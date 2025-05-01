import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentSchema,
} from '../appointments/model/appointment.model';
import { Slot, SlotSchema } from '../slot/model/slot.model';
import { User, UserSchema } from '../users/model/user.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Slot.name, schema: SlotSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ScheduleService],
})
export class SchedulerModule {}
