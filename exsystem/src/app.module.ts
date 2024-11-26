import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { PredictionService } from './prediction/prediction.service';
import { PredictionController } from './prediction/prediction.controller';

@Module({
  imports: [ConfigModule.forRoot(), GeminiModule, SensorDataModule],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class AppModule {}
