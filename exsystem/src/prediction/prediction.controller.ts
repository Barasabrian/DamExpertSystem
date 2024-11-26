import { Controller, Post, Body } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  // Endpoint to receive new sensor data and get predictions
  @Post()
  async predict(@Body() data: any) {
    const predictions = await this.predictionService.predict(data);
    return { predictions };
  }
}
