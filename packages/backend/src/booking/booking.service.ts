import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { 
  CreateAppointmentDto,
  AppointmentResponse,
  BookingConfirmationResponse,
  Appointment
} from '@zync/shared';

@Injectable()
export class BookingService {
  constructor(private supabaseService: SupabaseService) {}

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createAppointment(slug: string, createAppointmentDto: CreateAppointmentDto): Promise<BookingConfirmationResponse> {
    const supabase = this.supabaseService.getClient();

    // Get freelancer profile
    const { data: profile, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('booking_url_slug', slug)
      .eq('is_public', true)
      .single();

    if (profileError || !profile) {
      throw new NotFoundException('Freelancer not found or booking is not available');
    }

    // Get the time slot and verify it's available
    const { data: timeSlot, error: slotError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', createAppointmentDto.time_slot_id)
      .eq('user_id', profile.user_id)
      .eq('is_available', true)
      .single();

    if (slotError || !timeSlot) {
      throw new NotFoundException('Time slot not found or not available');
    }

    // Check if slot is already booked
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('time_slot_id', createAppointmentDto.time_slot_id)
      .in('status', ['pending', 'confirmed'])
      .single();

    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    // Validate booking advance days
    const appointmentDate = new Date(timeSlot.date);
    const today = new Date();
    const daysDifference = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference > profile.booking_advance_days) {
      throw new BadRequestException(`Booking can only be made up to ${profile.booking_advance_days} days in advance`);
    }

    if (daysDifference < 0) {
      throw new BadRequestException('Cannot book appointments in the past');
    }

    const bookingReference = this.generateBookingReference();

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        time_slot_id: createAppointmentDto.time_slot_id,
        freelancer_id: profile.user_id,
        customer_name: createAppointmentDto.customer_name,
        customer_email: createAppointmentDto.customer_email,
        customer_phone: createAppointmentDto.customer_phone,
        customer_message: createAppointmentDto.customer_message,
        appointment_date: timeSlot.date,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        status: 'pending',
        booking_reference: bookingReference,
      })
      .select()
      .single();

    if (appointmentError) {
      throw new BadRequestException('Failed to create appointment: ' + appointmentError.message);
    }

    // Mark time slot as unavailable
    await supabase
      .from('time_slots')
      .update({ is_available: false })
      .eq('id', createAppointmentDto.time_slot_id);

    return {
      appointment,
      booking_reference: bookingReference,
      message: 'Appointment booked successfully. You will receive a confirmation email shortly.',
    };
  }

  async getFreelancerAppointments(
    freelancerId: string, 
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
    startDate?: string,
    endDate?: string
  ): Promise<Appointment[]> {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('appointments')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('appointment_date', startDate);
    }

    if (endDate) {
      query = query.lte('appointment_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch appointments');
    }

    return data || [];
  }

  async getAppointment(freelancerId: string, appointmentId: string): Promise<AppointmentResponse> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .eq('freelancer_id', freelancerId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Appointment not found');
    }

    return data;
  }

  async updateAppointmentStatus(
    freelancerId: string, 
    appointmentId: string, 
    status: 'confirmed' | 'cancelled'
  ): Promise<AppointmentResponse> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .eq('freelancer_id', freelancerId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Appointment not found or not authorized');
    }

    // If cancelled, make the time slot available again
    if (status === 'cancelled') {
      await supabase
        .from('time_slots')
        .update({ is_available: true })
        .eq('id', data.time_slot_id);
    }

    return data;
  }

  async getAppointmentByReference(reference: string): Promise<AppointmentResponse> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('booking_reference', reference)
      .single();

    if (error || !data) {
      throw new NotFoundException('Appointment not found');
    }

    return data;
  }

  async cancelAppointmentByReference(reference: string): Promise<AppointmentResponse> {
    const supabase = this.supabaseService.getClient();

    // Get appointment
    const { data: appointment, error: getError } = await supabase
      .from('appointments')
      .select('*')
      .eq('booking_reference', reference)
      .single();

    if (getError || !appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === 'cancelled') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === 'completed') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    // Check if cancellation is allowed (e.g., not too close to appointment time)
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      throw new BadRequestException('Appointments can only be cancelled at least 24 hours in advance');
    }

    // Update appointment status
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('booking_reference', reference)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to cancel appointment');
    }

    // Make time slot available again
    await supabase
      .from('time_slots')
      .update({ is_available: true })
      .eq('id', data.time_slot_id);

    return data;
  }
} 