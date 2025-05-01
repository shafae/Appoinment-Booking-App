import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/model/user.model';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post('book')
  @Roles(UserRole.USER)
  book(@Body() dto: BookAppointmentDto, @Req() req) {
    return this.service.bookSlot(dto, req.user.userId);
  }

  @Delete('cancel/:id')
  @Roles(UserRole.USER)
  cancel(@Param('id') id: string, @Req() req) {
    return this.service.cancel(id, req.user.userId);
  }

  @Get('me')
  @Roles(UserRole.USER)
  myAppointments(@Req() req) {
    return this.service.myAppointments(req.user.userId);
  }

  @Get('provider')
  @Roles(UserRole.PROVIDER)
  providerAppointments(@Req() req) {
    return this.service.providerAppointments(req.user.userId);
  }
}
