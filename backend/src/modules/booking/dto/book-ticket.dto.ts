import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookTicketDto {
  @ApiProperty({ example: 'user-1' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'jo-fastest-stop-10-stop-5-1787826640331-260' })
  @IsString()
  @IsNotEmpty()
  journeyOptionId: string;

  @IsOptional()
  chosenOption?: any;
}
