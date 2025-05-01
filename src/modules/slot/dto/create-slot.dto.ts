import { IsDateString, IsString } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
