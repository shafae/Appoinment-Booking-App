import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './model/appointment.model';
import { Slot, SlotDocument } from '../slot/model/slot.model';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { responseInterface } from 'src/common/utils/response.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Slot.name)
    private slotModel: Model<SlotDocument>,
  ) {}

  async bookSlot(
    dto: BookAppointmentDto,
    userId: string,
  ): Promise<responseInterface> {
    const slot = await this.slotModel.findById(dto.slotId);
    if (!slot || slot.isBooked) {
      throw new BadRequestException('Slot is unavailable or already booked');
    }

    slot.isBooked = true;
    await slot.save();

    const appointment = new this.appointmentModel({
      slotId: slot._id,
      userId,
      status: 'booked',
    });
    const bookdSlot = await appointment.save();

    return {
      responseCode: 200,
      message: 'Slot booked successfully',
      data: bookdSlot,
    };
  }

  async cancel(id: string, userId: string): Promise<responseInterface> {
    const appointment = await this.appointmentModel.findById(id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.userId.toString() !== userId)
      throw new ForbiddenException('Cannot cancel others’ appointments');

    appointment.status = 'cancelled';
    await appointment.save();

    await this.slotModel.findByIdAndUpdate(appointment.slotId, {
      isBooked: false,
    });
    return { responseCode: 200, message: 'Appointment cancelled' };
  }

  async myAppointments(userId: string): Promise<responseInterface> {
    const appointments = await this.appointmentModel
      .find({ userId })
      .populate('slotId');
    return {
      responseCode: 200,
      message: 'Appointments fetched',
      data: appointments,
    };
  }

  async providerAppointments(providerId: string): Promise<responseInterface> {
    const slots = await this.slotModel.find({ providerId });
    const slotIds = slots.map((s) => s._id);
    if (slots.length === 0) {
      throw new NotFoundException('No slots found for this provider');
    }
    const appointments = await this.appointmentModel
      .find({ slotId: { $in: slotIds }, status: 'booked' })
      .populate('slotId userId');
    return {
      responseCode: 200,
      message: 'Appointments fetched',
      data: appointments,
    };
  }
}
