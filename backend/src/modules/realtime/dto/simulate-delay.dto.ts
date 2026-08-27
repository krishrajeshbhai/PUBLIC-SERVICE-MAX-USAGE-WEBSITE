import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimulateDelayDto {
  @ApiProperty({ example: 'line-purple' })
  @IsString()
  @IsNotEmpty()
  lineId: string;

  @ApiProperty({ example: 'stop-10' })
  @IsString()
  @IsNotEmpty()
  fromStopId: string;

  @ApiProperty({ example: 'stop-9' })
  @IsString()
  @IsNotEmpty()
  toStopId: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  delayMinutes: number;
}
