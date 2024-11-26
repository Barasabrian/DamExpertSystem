import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, SensorData } from '@prisma/client';

@Injectable()
export class SensorDataService {
  private prisma = new PrismaClient();

  // Create new sensor data
   // Create new sensor data
   async create(data: Prisma.SensorDataCreateInput): Promise<SensorData> {
    return this.prisma.sensorData.create({ data });
  }

  // Get all sensor data
  async findAll(): Promise<SensorData[]> {
    return this.prisma.sensorData.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }

  // Get sensor data by ID
  async findOne(id: number): Promise<SensorData | null> {
    return this.prisma.sensorData.findUnique({
      where: { id },
    });
  }

  // Update sensor data
  async update(id: number, data: Partial<SensorData>): Promise<SensorData> {
    return this.prisma.sensorData.update({
      where: { id },
      data,
    });
  }

  // Delete sensor data
  async remove(id: number): Promise<SensorData> {
    return this.prisma.sensorData.delete({
      where: { id },
    });
  }



  
   // Fetch a limited number of sensor data entries with optional offset for pagination
  async findLimitedData(limit: number, offset: number = 0): Promise<SensorData[]> {
    return this.prisma.sensorData.findMany({
      skip: offset,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  // Fetch sensor data filtered by type (e.g., ultrasonic, seismic) with pagination
  async findBySensorField(
    field: keyof Omit<SensorData, 'id' | 'timestamp' | 'status'>, // Restrict keys to sensor fields
    minValue: number, // Minimum threshold for the sensor value
    limit: number = 10,
    offset: number = 0,
  ): Promise<SensorData[]> {
    return this.prisma.sensorData.findMany({
      where: {
        [field]: {
          gte: minValue, // Example: Fetch records where the sensor value is >= minValue
        },
      },
      skip: offset,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }
  

  // Fetch sensor data by a specific date range with pagination
  async findByDateRange(startDate: Date, endDate: Date, limit: number, offset: number = 0): Promise<SensorData[]> {
    return this.prisma.sensorData.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip: offset,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  // Fetch sensor data by status (e.g., 0 = normal, 1 = warning, 2 = critical) with pagination
  async findByStatus(status: number, limit: number, offset: number = 0): Promise<SensorData[]> {
    return this.prisma.sensorData.findMany({
      where: { status },
      skip: offset,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  // Fetch aggregated data for specific sensors over a date range
  async getAggregatedData(sensorKey: keyof Prisma.SensorDataCreateInput, startDate: Date, endDate: Date): Promise<any> {
    const result = await this.prisma.sensorData.aggregate({
      _avg: { [sensorKey]: true },
      _min: { [sensorKey]: true },
      _max: { [sensorKey]: true },
      _count: { [sensorKey]: true },
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      average: result._avg[sensorKey] || 0,
      minimum: result._min[sensorKey] || 0,
      maximum: result._max[sensorKey] || 0,
      count: result._count[sensorKey] || 0,
    };
  }

  // Fetch the latest entry for all sensor fields
  async getLatestSensorData(): Promise<SensorData[]> {
    const sensorFields = ['ultrasonic', 'seismic', 'tilt', 'load', 'pressure', 'sound'];

    return Promise.all(
      sensorFields.map((field) =>
        this.prisma.sensorData.findFirst({
          where: { [field]: { not: null } },
          orderBy: { timestamp: 'desc' },
        })
      )
    );
  }

  // Fetch summarized daily report for specific sensors
 
  
}

