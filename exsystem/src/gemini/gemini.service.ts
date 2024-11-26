import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { SensorDataService } from '../sensor-data/sensor-data.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as json2csv from 'json2csv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GeminiService {
  private readonly RESPONSE_GUIDELINES = `
    Guidelines for Responding to User Queries:

    Sensors Available:

    "Ultrasonic": Measures distance/water level.
    "Seismic": Detects vibrations/tremors.
    "Tilt": Monitors structural tilt.
    "Load cell": Measures force/weight.
    "Pressure": Measures pressure variations.
    "Sound": Captures sound for analysis.

    Data Handling:

    Sensor data is stored in a database. When relevant, mention that the data is being fetched.
    If the query requires historical data (e.g., past week), inform the user that the data is being fetched.

    Machine Learning Model:

    The model predicts dam status ("Normal", "Warning", "Critical") as 0,1,2 respectively based on sensor data trends.
    Important: You are not to train any model. I (the system) will provide the output of the trained model.
    If you receive "MODEL-PREDICTION", infer from the data returned from the system and offer an interpretation.

    Response Guidelines:

    Be concise, factual, and specific to the query.
    If a query is unclear or involves multiple sensors, ask for clarification.
    Stick to the scope of sensors and dam status predictions.

    Keywords:

    "BACK": Use when the user's query is unclear or needs more information.
    "NEXT": Use when the user's query is clear and sufficient for processing.
    "END": Use when the system provides database or model data.

    Examples:

    BACK: "I need more details. Can you specify which sensors or the time range for the data?"
    NEXT: "I will fetch the latest data and run the prediction."
    END: "Based on the database data, the water level is 8.2."

    Always include one of these keywords ("BACK", "NEXT", or "END") based on the clarity and sufficiency of the user’s query.
  `;

  constructor(
    private readonly gemini: GoogleGenerativeAI,
    private readonly sensorDataService: SensorDataService,
    private readonly predictionService: PredictionService,
  ) {}

  private checkForKeywords(response: string): string {
    if (!response) {
      console.error('Empty response from model');
      return 'UNKNOWN';
    }
  
    // Check for 'END:', 'BACK:', and 'NEXT:' as the first word in the response
    if (/^\s*END:/i.test(response)) {
      return 'END';
    } else if (/^\s*BACK:/i.test(response)) {
      return 'BACK';
    } else if (/^\s*NEXT:/i.test(response)) {
      return 'NEXT';
    }
  
    return 'UNKNOWN';
  }
  
  
  private extractKeywordsAndText(response: string): { action: string; text: string } {
    console.log("called extract keywords")
    if (!response) {
      console.error('Empty response from model');
      return { action: 'UNKNOWN', text: '' };
    }
 
  
    const keywordPattern = /\b(BACK|NEXT|END):\s*/i; // Matches keywords followed by ':'
    const match = response.match(keywordPattern);
  
    if (match) {
      const action = match[1].toUpperCase(); // Extract the keyword (action)
      const text = response.replace(keywordPattern, '').trim(); // Remove the keyword and colon
      return { action, text };
    }
  
    return { action: 'UNKNOWN', text: response.trim() }; // Default case
  }
  

  async createChatCompletion(messages: ChatCompletionMessageDto[]): Promise<string> {
    const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${this.RESPONSE_GUIDELINES}\n${messages.map((msg) => msg.content).join('\n')}`;
    // console.log(`[${new Date().toISOString()}] Generated Prompt:`, prompt);

    try {
      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text();
      console.log(`[${new Date().toISOString()}] Model Response:`, responseText);

      const action = this.checkForKeywords(responseText);
      console.log(`[DEBUG] Action identified: ${action}`);

      if (action === 'BACK') {
        return this.handleBack(responseText);
      } else if (action === 'NEXT') {
        return this.processNextAction(responseText, messages);
      } else if (action === 'END') {
        console.log('[DEBUG] Extracting keywords and text...');
        const { text } = this.extractKeywordsAndText(responseText);
        return text;
      }

      return responseText || 'UNKNOWN: No valid response from the model.';
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in createChatCompletion:`, error.stack || error.message);
      return 'Error: Unable to generate a response at this time.';
    }
  }

  private handleBack(response: string): string {
    console.log(`[${new Date().toISOString()}] Handling BACK action`);
    const { action, text } = this.extractKeywordsAndText(response);
    return text;
  }

  private async processNextAction(
    response: string,
    messages: ChatCompletionMessageDto[]
  ): Promise<string> {
    console.log('Handling NEXT action'); // Debug: Log the action

    try {
      const recentSensorData = await this.sensorDataService.findLimitedData(500,0);
      // console.log(recentSensorData);

      if (!recentSensorData || recentSensorData.length === 0) {
        console.warn('No recent sensor data available'); // Debug: Warn if no data found
        return 'NEXT: No recent sensor data available. Please try again later.';
      }

      // console.log('Recent Sensor Data:', recentSensorData); // Debug: Log fetched data

      const prediction = await this.predictionService.predict(recentSensorData);
      console.log(`prediction is: ${prediction}`);


      // Add database data to messages array
      messages.push({
        role: 'system',
        content: `DATABASE-DATA: Recent sensor data from the last 7 days: ${JSON.stringify(recentSensorData)} And this is what the model predicted given the data MODEL-PREDICTION: ${JSON.stringify(prediction)} `,
      });

      // Add user response as a new message
      messages.push({
        role: 'user',
        content: response,
      });

      // Generate the next response without recursion
      return this.createChatCompletion(messages);
    } catch (error) {
      console.error('Error in processNextAction:', error);
      return 'Error: Unable to process your request at this time.';
    }
  }
}
