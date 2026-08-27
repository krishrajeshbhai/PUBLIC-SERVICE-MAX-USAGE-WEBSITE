import { IsString, IsNotEmpty, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PreferencesDto {
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  accessible?: boolean;
}

export class SearchJourneyDto {
  @ApiProperty({ example: 'stop-10' })
  @IsString()
  @IsNotEmpty()
  originStopId: string;

  @ApiProperty({ example: 'stop-5' })
  @IsString()
  @IsNotEmpty()
  destinationStopId: string;

  @ApiProperty({ required: false, type: PreferencesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  prefs?: PreferencesDto;
}
