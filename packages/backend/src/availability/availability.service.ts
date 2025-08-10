import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { 
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  CreateRecurringAvailabilityDto,
  UpdateRecurringAvailabilityDto,
  CreateFreelancerProfileDto,
  UpdateFreelancerProfileDto,
  FreelancerAvailabilityResponse,
  PublicAvailabilityResponse,
  AvailabilityStats,
  AvailabilityTimeSlot,
  RecurringAvailability,
  FreelancerProfile,
  Appointment
} from '@zync/shared';

@Injectable()
export class AvailabilityService {
  constructor(private supabaseService: SupabaseService) {}

  // Freelancer Profile Management
  async createFreelancerProfile(userId: string, createProfileDto: CreateFreelancerProfileDto): Promise<FreelancerProfile> {
    const supabase = this.supabaseService.getClient();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      throw new ConflictException('Freelancer profile already exists');
    }

    // Check if slug is unique
    const { data: existingSlug } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('booking_url_slug', createProfileDto.booking_url_slug)
      .single();

    if (existingSlug) {
      throw new ConflictException('Booking URL slug already taken');
    }

    const { data, error } = await supabase
      .from('freelancer_profiles')
      .insert({
        user_id: userId,
        ...createProfileDto,
        is_public: true,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create freelancer profile: ' + error.message);
    }

    return data;
  }

  async getFreelancerProfile(userId: string): Promise<FreelancerProfile> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Freelancer profile not found');
    }

    return data;
  }

  async updateFreelancerProfile(userId: string, updateProfileDto: UpdateFreelancerProfileDto): Promise<FreelancerProfile> {
    const supabase = this.supabaseService.getClient();

    // If updating slug, check uniqueness
    if (updateProfileDto.booking_url_slug) {
      const { data: existingSlug } = await supabase
        .from('freelancer_profiles')
        .select('id, user_id')
        .eq('booking_url_slug', updateProfileDto.booking_url_slug)
        .single();

      if (existingSlug && existingSlug.user_id !== userId) {
        throw new ConflictException('Booking URL slug already taken');
      }
    }

    const { data, error } = await supabase
      .from('freelancer_profiles')
      .update({
        ...updateProfileDto,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new BadRequestException('Failed to update freelancer profile');
    }

    return data;
  }

  // Time Slot Management
  async createTimeSlot(userId: string, createSlotDto: CreateTimeSlotDto): Promise<AvailabilityTimeSlot> {
    const supabase = this.supabaseService.getClient();

    // Validate time slot doesn't overlap with existing ones
    const { data: overlapping } = await supabase
      .from('time_slots')
      .select('*')
      .eq('user_id', userId)
      .eq('date', createSlotDto.date)
      .or(`start_time.lte.${createSlotDto.end_time},end_time.gte.${createSlotDto.start_time}`);

    if (overlapping && overlapping.length > 0) {
      throw new ConflictException('Time slot overlaps with existing availability');
    }

    const { data, error } = await supabase
      .from('time_slots')
      .insert({
        user_id: userId,
        ...createSlotDto,
        is_available: true,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create time slot: ' + error.message);
    }

    return data;
  }

  async getUserAvailability(userId: string, startDate?: string, endDate?: string): Promise<FreelancerAvailabilityResponse> {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('time_slots')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: timeSlots, error: slotsError } = await query;

    if (slotsError) {
      throw new BadRequestException('Failed to fetch time slots');
    }

    const { data: recurring, error: recurringError } = await supabase
      .from('recurring_availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });

    if (recurringError) {
      throw new BadRequestException('Failed to fetch recurring availability');
    }

    return {
      time_slots: timeSlots || [],
      recurring_availability: recurring || [],
      total_slots: timeSlots?.length || 0,
    };
  }

  async updateTimeSlot(userId: string, slotId: string, updateSlotDto: UpdateTimeSlotDto): Promise<AvailabilityTimeSlot> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('time_slots')
      .update({
        ...updateSlotDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', slotId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Time slot not found or not authorized');
    }

    return data;
  }

  async deleteTimeSlot(userId: string, slotId: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', slotId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException('Failed to delete time slot');
    }
  }

  // Recurring Availability Management
  async createRecurringAvailability(userId: string, createRecurringDto: CreateRecurringAvailabilityDto): Promise<RecurringAvailability> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('recurring_availability')
      .insert({
        user_id: userId,
        ...createRecurringDto,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create recurring availability: ' + error.message);
    }

    return data;
  }

  async getRecurringAvailability(userId: string): Promise<RecurringAvailability[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('recurring_availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });

    if (error) {
      throw new BadRequestException('Failed to fetch recurring availability');
    }

    return data || [];
  }

  async updateRecurringAvailability(userId: string, recurringId: string, updateRecurringDto: UpdateRecurringAvailabilityDto): Promise<RecurringAvailability> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('recurring_availability')
      .update({
        ...updateRecurringDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recurringId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Recurring availability not found or not authorized');
    }

    return data;
  }

  async deleteRecurringAvailability(userId: string, recurringId: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('recurring_availability')
      .delete()
      .eq('id', recurringId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException('Failed to delete recurring availability');
    }
  }

  async generateSlotsFromRecurring(userId: string, startDate: string, endDate: string): Promise<number> {
    const supabase = this.supabaseService.getClient();

    // Get recurring availability
    const { data: recurring } = await supabase
      .from('recurring_availability')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!recurring || recurring.length === 0) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const slotsToCreate = [];

    // Generate slots for each day in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      const dateString = date.toISOString().split('T')[0];

      // Find recurring availability for this day
      const dayRecurring = recurring.filter(r => r.day_of_week === dayOfWeek);

      for (const recur of dayRecurring) {
        // Generate time slots for this recurring availability
        const startTime = new Date(`${dateString}T${recur.start_time}`);
        const endTime = new Date(`${dateString}T${recur.end_time}`);

        while (startTime < endTime) {
          const slotEndTime = new Date(startTime.getTime() + recur.duration_minutes * 60000);
          
          if (slotEndTime <= endTime) {
            slotsToCreate.push({
              user_id: userId,
              date: dateString,
              start_time: startTime.toTimeString().slice(0, 5),
              end_time: slotEndTime.toTimeString().slice(0, 5),
              duration_minutes: recur.duration_minutes,
              buffer_time_minutes: recur.buffer_time_minutes,
              is_available: true,
            });
          }

          startTime.setTime(startTime.getTime() + (recur.duration_minutes + recur.buffer_time_minutes) * 60000);
        }
      }
    }

    if (slotsToCreate.length === 0) {
      return 0;
    }

    // Insert slots (with conflict resolution)
    const { error } = await supabase
      .from('time_slots')
      .upsert(slotsToCreate, { 
        onConflict: 'user_id,date,start_time',
        ignoreDuplicates: true 
      });

    if (error) {
      throw new BadRequestException('Failed to generate slots: ' + error.message);
    }

    return slotsToCreate.length;
  }

  // Public booking
  async getPublicAvailability(slug: string, startDate?: string, endDate?: string): Promise<PublicAvailabilityResponse> {
    const supabase = this.supabaseService.getClient();

    // Get freelancer profile
    const { data: profile, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('booking_url_slug', slug)
      .eq('is_public', true)
      .single();

    if (profileError || !profile) {
      throw new NotFoundException('Freelancer not found or booking page is private');
    }

    // Get available slots
    let slotsQuery = supabase
      .from('time_slots')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_available', true)
      .gte('date', startDate || new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (endDate) {
      slotsQuery = slotsQuery.lte('date', endDate);
    }

    const { data: availableSlots, error: slotsError } = await slotsQuery;

    if (slotsError) {
      throw new BadRequestException('Failed to fetch available slots');
    }

    // Find next available date
    const nextAvailable = availableSlots && availableSlots.length > 0 
      ? availableSlots[0].date 
      : undefined;

    return {
      freelancer: profile,
      available_slots: availableSlots || [],
      next_available_date: nextAvailable,
    };
  }

  // Analytics
  async getAvailabilityStats(userId: string): Promise<AvailabilityStats> {
    const supabase = this.supabaseService.getClient();

    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get this week's stats
    const { data: weekSlots } = await supabase
      .from('time_slots')
      .select('*, appointments(*)')
      .eq('user_id', userId)
      .gte('date', weekStart.toISOString().split('T')[0])
      .lte('date', weekEnd.toISOString().split('T')[0]);

    // Get upcoming appointments
    const { data: upcomingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('freelancer_id', userId)
      .gte('appointment_date', new Date().toISOString().split('T')[0])
      .in('status', ['pending', 'confirmed'])
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(10);

    const totalSlotsThisWeek = weekSlots?.length || 0;
    const bookedSlotsThisWeek = weekSlots?.filter(slot => 
      slot.appointments && slot.appointments.length > 0
    ).length || 0;
    const availableSlotsThisWeek = totalSlotsThisWeek - bookedSlotsThisWeek;

    // Get this month's appointments
    const { data: monthAppointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('freelancer_id', userId)
      .gte('appointment_date', monthStart.toISOString().split('T')[0])
      .lte('appointment_date', monthEnd.toISOString().split('T')[0]);

    return {
      total_slots_this_week: totalSlotsThisWeek,
      booked_slots_this_week: bookedSlotsThisWeek,
      available_slots_this_week: availableSlotsThisWeek,
      total_appointments_this_month: monthAppointments?.length || 0,
      upcoming_appointments: upcomingAppointments || [],
    };
  }
} 