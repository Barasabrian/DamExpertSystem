import * as tf from '@tensorflow/tfjs-node';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

// Build the correct file path with the file:// prefix
const filePath = path.join(process.cwd(), 'model', 'model.json');
const modelFileUrl = `file://${filePath}`;

@Injectable()
export class PredictionService {
  private model: tf.LayersModel;

  async onModuleInit() {
    // Load the model using the correct file URL
    this.model = await tf.loadLayersModel(modelFileUrl);
    console.log('Model loaded successfully');
  }

  // Preprocess incoming data (normalization and sequence creation)
  private preprocessData(data: any) {
    // Normalize the incoming data
    const normalizedData = data.map((row) => ({
      ultrasonic: row.ultrasonic / 100,  // Example normalization (adjust scaling as needed)
      seismic: row.seismic / 100,
      tilt: row.tilt / 100,
      load: row.load / 100,
      pressure: row.pressure / 100,
      sound: row.sound / 100,
    }));

    // Define sequence length (same as during training)
    const sequenceLength = 7;  // Number of timesteps per sequence
    const sequences = [];

    // Create sequences for prediction
    for (let i = 0; i < normalizedData.length - sequenceLength + 1; i++) {
      sequences.push(normalizedData.slice(i, i + sequenceLength));
    }

    // Log the shape of sequences for debugging
    console.log('Generated Sequences Shape:', sequences.length, sequenceLength, Object.keys(sequences[0][0]).length);

    return sequences;
  }

  // Make prediction based on new data
  async predict(data: any) {
    const sequences = this.preprocessData(data);

    // Ensure the sequences are properly structured as a 3D array
    const reshapedSequences = sequences.map(seq => 
      seq.map(item => [
        item.ultrasonic, item.seismic, item.tilt, item.load, item.pressure, item.sound
      ])
    );

    // Convert the sequences to a tensor
    const tensorData = tf.tensor(reshapedSequences); 

    // Log tensor shape for debugging
    console.log('Tensor Shape:', tensorData.shape);

    // Ensure tensor has 3 dimensions
    if (tensorData.shape.length !== 3) {
      throw new Error(`Input tensor must have 3 dimensions: [batch_size, timesteps, features], but got ${tensorData.shape.length} dimensions.`);
    }

    // Make prediction using the model
    const predictions = this.model.predict(tensorData) as tf.Tensor;
    
    // Get the class with the highest probability
    const predictedLabels = predictions.argMax(-1).dataSync(); // Get predicted class with highest probability

    return Array.from(predictedLabels);
  }
}
