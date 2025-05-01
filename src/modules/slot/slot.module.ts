import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { Slot, SlotSchema } from './model/slot.model';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
    UsersModule,
  ],
  controllers: [SlotController],
  providers: [SlotService],
})
export class SlotModule {}
