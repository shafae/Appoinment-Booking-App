import { IsMongoId } from 'class-validator';

export class BookAppointmentDto {
  @IsMongoId()
  slotId: string;
}
