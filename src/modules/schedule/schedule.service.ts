import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
} from '../appointments/model/appointment.model';
import { Slot, SlotDocument } from '../slot/model/slot.model';
import { User, UserDocument } from '../users/model/user.model';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail@gmail.com',
      pass: 'password',
    },
  });

  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Slot.name)
    private slotModel: Model<SlotDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendReminders() {
    const now = moment();
    const in30Min = now.clone().add(30, 'minutes');

    const slots = await this.slotModel.find({
      isBooked: true,
      date: in30Min.format('YYYY-MM-DD'),
      startTime: in30Min.format('YYYY-MM-DDTHH:mm:ss.sssZ'),
    });

    for (const slot of slots) {
      const appointment = await this.appointmentModel.findOne({
        slotId: slot._id,
        status: 'booked',
      });

      if (!appointment) continue;

      const user = await this.userModel.findById(appointment.userId);
      if (!user) continue;

      await this.sendEmail(user.email, slot.date, slot.startTime);
      this.logger.log(
        `Sent reminder to ${user.email} for ${slot.date} ${slot.startTime}`,
      );
    }
  }

  private async sendEmail(email: string, date: string, time: Date) {
    await this.transporter.sendMail({
      from: '"Appointment System"',
      to: email,
      subject: 'Upcoming Appointment Reminder',
      text: `You have an appointment scheduled on ${date} at ${time}.`,
    });
  }
}
