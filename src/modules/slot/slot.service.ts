import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from './model/slot.model';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { responseInterface } from 'src/common/utils/response.interface';
import { combineDateWithTimes } from 'src/common/utils/convertStringTime';

@Injectable()
export class SlotService {
  constructor(@InjectModel(Slot.name) private slotModel: Model<SlotDocument>) {}

  async create(
    createDto: CreateSlotDto,
    providerId: string,
  ): Promise<responseInterface> {
    const { date, startTime, endTime } = createDto;
    const { start, end } = combineDateWithTimes(date, startTime, endTime);
    if (start >= end) {
      throw new HttpException('Start time must be before end time', 400);
    }
    // Check for overlapping slots
    const existingSlot = await this.slotModel.findOne({
      providerId,
      date,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    if (existingSlot) {
      throw new HttpException('Slot overlaps with an existing slot.', 409);
    }
    const slot = await this.slotModel.create({
      date,
      startTime: start,
      endTime: end,
      providerId,
    });
    return {
      responseCode: 200,
      message: 'Slot created successfully',
      data: slot,
    };
  }

  async findOwn(providerId: string) {
    return this.slotModel.find({ providerId });
  }

  async update(
    id: string,
    updateDto: UpdateSlotDto,
    userId: string,
  ): Promise<responseInterface> {
    const slot = await this.slotModel.findById(id);
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.providerId.toString() !== userId)
      throw new ForbiddenException('You can only edit your own slots');
    const { date, startTime, endTime } = updateDto;
    const { start, end } = combineDateWithTimes(date, startTime, endTime);
    if (start >= end) {
      throw new HttpException('Start time must be before end time', 400);
    }
    const updatedSlot = { _id: slot._id, date, startTime: start, endTime: end };
    const existingSlot = await this.slotModel.findOneAndUpdate({
      providerId: userId,
      date,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (existingSlot) {
      throw new HttpException('Slot overlaps with an existing slot.', 409);
    }
    Object.assign(slot, updatedSlot);
    await slot.save();
    return {
      responseCode: 200,
      message: 'Slot updated successfully',
    };
  }

  async remove(id: string, userId: string): Promise<responseInterface> {
    const slot = await this.slotModel.findById(id);
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.providerId.toString() !== userId)
      throw new ForbiddenException('You can only delete your own slots');

    await this.slotModel.findByIdAndDelete(id);
    return { responseCode: 200, message: 'Slot deleted' };
  }

  async findAllAvailable(providerId?: string): Promise<responseInterface> {
    const filter: any = { isBooked: false };
    if (providerId) filter.providerId = providerId;
    const availableSlots = await this.slotModel.find(filter);
    return {
      responseCode: 200,
      message: 'Available slots fetched',
      data: availableSlots,
    };
  }
}
