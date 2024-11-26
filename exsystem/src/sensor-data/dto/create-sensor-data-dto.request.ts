import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSensorDataDto {
  @IsNumber()
  @IsNotEmpty()
  ultrasonic: number;

  @IsNumber()
  @IsNotEmpty()
  seismic: number;

  @IsNumber()
  @IsNotEmpty()
  tilt: number;

  @IsNumber()
  @IsNotEmpty()
  load: number;

  @IsNumber()
  @IsNotEmpty()
  pressure: number;

  @IsNumber()
  @IsNotEmpty()
  sound: number;

  @IsNumber()
  @IsOptional() // Status is now optional
  status?: number;
}
