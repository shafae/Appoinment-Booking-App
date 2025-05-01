import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotModule } from './modules/slot/slot.module';
import { UsersModule } from './modules/users/users.module';
import { AppointmentModule } from './modules/appointments/appointments.module';
import { SchedulerModule } from './modules/schedule/scheduler.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    SlotModule,
    UsersModule,
    AppointmentModule,
    SchedulerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
