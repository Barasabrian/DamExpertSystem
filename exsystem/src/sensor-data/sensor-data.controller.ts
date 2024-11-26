import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { CreateSensorDataDto } from './dto/create-sensor-data-dto.request';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post()
  async create(@Body() createSensorDataDto: CreateSensorDataDto) {
    return this.sensorDataService.create(createSensorDataDto);
  }

  @Get()
  async findAll() {
    return this.sensorDataService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sensorDataService.findOne(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreateSensorDataDto>) {
    return this.sensorDataService.update(Number(id), updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sensorDataService.remove(Number(id));
  }
}
