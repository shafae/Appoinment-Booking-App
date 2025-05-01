import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentController } from './appointments.controller';
import { AppointmentService } from './appointments.service';
import { Appointment, AppointmentSchema } from './model/appointment.model';
import { Slot, SlotSchema } from '../slot/model/slot.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Slot.name, schema: SlotSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
