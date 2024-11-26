import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [GeminiController],
  imports: [ConfigModule],
  providers: [
    PredictionService, SensorDataService, GeminiService,
    {
      provide: GoogleGenerativeAI,
      useFactory: (configService: ConfigService) => {
        return new GoogleGenerativeAI(configService.getOrThrow('GEMINI_API'));
      },
      inject: [ConfigService], // Explicitly inject ConfigService
    },
  ],
})
export class GeminiModule {}
