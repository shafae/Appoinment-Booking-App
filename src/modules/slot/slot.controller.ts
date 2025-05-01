import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/model/user.model';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  @Roles(UserRole.PROVIDER)
  create(@Body() dto: CreateSlotDto, @Req() req) {
    return this.slotService.create(dto, req.user.userId);
  }

  @Get('mine')
  @Roles(UserRole.PROVIDER)
  findOwn(@Req() req) {
    return this.slotService.findOwn(req.user.userId);
  }

  @Get('available')
  @Roles(UserRole.USER)
  findAllAvailable(@Query('providerId') providerId: string) {
    return this.slotService.findAllAvailable(providerId);
  }

  @Patch(':id')
  @Roles(UserRole.PROVIDER)
  update(@Param('id') id: string, @Body() dto: UpdateSlotDto, @Req() req) {
    return this.slotService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.PROVIDER)
  remove(@Param('id') id: string, @Req() req) {
    return this.slotService.remove(id, req.user.userId);
  }
}
