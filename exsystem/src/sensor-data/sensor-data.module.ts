import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { SensorDataController } from './sensor-data.controller';

@Module({
  providers: [SensorDataService],
  controllers: [SensorDataController]
})
export class SensorDataModule {}
