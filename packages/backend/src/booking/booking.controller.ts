import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request,
  NotFoundException 
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { 
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  AppointmentResponse,
  BookingConfirmationResponse,
  Appointment
} from '@zync/shared';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  // Public booking - customer creates appointment
  @Post(':slug/book')
  async createAppointment(
    @Param('slug') slug: string,
    @Body() createAppointmentDto: CreateAppointmentDto
  ): Promise<BookingConfirmationResponse> {
    return this.bookingService.createAppointment(slug, createAppointmentDto);
  }

  // Freelancer manages their appointments
  @UseGuards(JwtAuthGuard)
  @Get('appointments')
  async getFreelancerAppointments(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ): Promise<Appointment[]> {
    return this.bookingService.getFreelancerAppointments(
      req.user.id, 
      status as any, 
      startDate, 
      endDate
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointments/:id')
  async getAppointment(
    @Request() req: any,
    @Param('id') appointmentId: string
  ): Promise<AppointmentResponse> {
    return this.bookingService.getAppointment(req.user.id, appointmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('appointments/:id/status')
  async updateAppointmentStatus(
    @Request() req: any,
    @Param('id') appointmentId: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto
  ): Promise<AppointmentResponse> {
    return this.bookingService.updateAppointmentStatus(
      req.user.id, 
      appointmentId, 
      updateStatusDto.status
    );
  }

  // Customer checks appointment status (public)
  @Get('appointment/:reference')
  async getAppointmentByReference(
    @Param('reference') reference: string
  ): Promise<AppointmentResponse> {
    return this.bookingService.getAppointmentByReference(reference);
  }

  // Customer cancels appointment (public)
  @Put('appointment/:reference/cancel')
  async cancelAppointmentByReference(
    @Param('reference') reference: string
  ): Promise<AppointmentResponse> {
    return this.bookingService.cancelAppointmentByReference(reference);
  }
} 