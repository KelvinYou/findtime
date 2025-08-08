import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { 
  CreateScheduleDto, 
  UpdateScheduleDto, 
  SubmitAvailabilityDto,
  ScheduleResponse,
  PublicScheduleResponse,
  AvailabilityResponse,
  ApiResponse
} from '@zync/shared';

@Injectable()
export class ScheduleService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createScheduleDto: CreateScheduleDto, userId?: string): Promise<ApiResponse<ScheduleResponse>> {
    const supabase = this.supabaseService.getClient();
    
    // Validate guest user data if not authenticated
    if (!userId && !createScheduleDto.creatorName) {
      throw new Error('Creator name is required for guest users');
    }

    // Prepare insert data
    const insertData: any = {
      title: createScheduleDto.title,
      description: createScheduleDto.description,
      available_slots: createScheduleDto.availableSlots,
      duration: createScheduleDto.duration,
      time_zone: createScheduleDto.timeZone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (userId) {
      // Authenticated user
      insertData.user_id = userId;
    } else {
      // Guest user
      insertData.creator_name = createScheduleDto.creatorName;
      insertData.creator_email = createScheduleDto.creatorEmail;
    }
    
    const { data, error } = await supabase
      .from('schedules')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        availableSlots: data.available_slots,
        duration: data.duration,
        timeZone: data.time_zone,
        userId: data.user_id,
        creatorName: data.creator_name,
        creatorEmail: data.creator_email,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async findAllByUser(userId: string): Promise<ApiResponse<ScheduleResponse[]>> {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch schedules: ${error.message}`);
    }

    const schedules = data.map(schedule => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      availableSlots: schedule.available_slots,
      duration: schedule.duration,
      timeZone: schedule.time_zone,
      userId: schedule.user_id,
      creatorName: schedule.creator_name,
      creatorEmail: schedule.creator_email,
      createdAt: schedule.created_at,
      updatedAt: schedule.updated_at,
    }));

    return {
      success: true,
      data: schedules
    };
  }

  async findOne(id: string): Promise<ApiResponse<ScheduleResponse>> {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Schedule not found');
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        availableSlots: data.available_slots,
        duration: data.duration,
        timeZone: data.time_zone,
        userId: data.user_id,
        creatorName: data.creator_name,
        creatorEmail: data.creator_email,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto, userId: string): Promise<ApiResponse<ScheduleResponse>> {
    const supabase = this.supabaseService.getClient();
    
    // First check if the schedule exists and belongs to the user
    const { data: existingSchedule, error: fetchError } = await supabase
      .from('schedules')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingSchedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (existingSchedule.user_id !== userId) {
      throw new ForbiddenException('You can only update your own schedules');
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updateScheduleDto.title) updateData.title = updateScheduleDto.title;
    if (updateScheduleDto.description !== undefined) updateData.description = updateScheduleDto.description;
    if (updateScheduleDto.availableSlots) updateData.available_slots = updateScheduleDto.availableSlots;
    if (updateScheduleDto.duration) updateData.duration = updateScheduleDto.duration;
    if (updateScheduleDto.timeZone) updateData.time_zone = updateScheduleDto.timeZone;

    const { data, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        availableSlots: data.available_slots,
        duration: data.duration,
        timeZone: data.time_zone,
        userId: data.user_id,
        creatorName: data.creator_name,
        creatorEmail: data.creator_email,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    };
  }

  async remove(id: string, userId: string): Promise<ApiResponse<{ id: string }>> {
    const supabase = this.supabaseService.getClient();
    
    // First check if the schedule exists and belongs to the user
    const { data: existingSchedule, error: fetchError } = await supabase
      .from('schedules')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingSchedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (existingSchedule.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own schedules');
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }

    return {
      success: true,
      data: { id }
    };
  }

  async getPublicSchedule(id: string): Promise<ApiResponse<PublicScheduleResponse>> {
    const supabase = this.supabaseService.getClient();
    
    // Get schedule details
    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .select(`
        *,
        profiles:user_id (display_name, email)
      `)
      .eq('id', id)
      .single();

    if (scheduleError || !schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Get availability responses
    const { data: responses, error: responsesError } = await supabase
      .from('availability_responses')
      .select('*')
      .eq('schedule_id', id)
      .order('submitted_at', { ascending: true });

    if (responsesError) {
      throw new Error(`Failed to fetch availability responses: ${responsesError.message}`);
    }

    const availabilityResponses: AvailabilityResponse[] = (responses || []).map(response => ({
      id: response.id,
      scheduleId: response.schedule_id,
      name: response.name,
      availability: response.availability,
      submittedAt: response.submitted_at,
    }));

    // Determine creator name
    let createdBy = 'Unknown';
    if (schedule.creator_name) {
      // Guest-created schedule
      createdBy = schedule.creator_name;
    } else if (schedule.profiles?.display_name) {
      // Authenticated user with display name
      createdBy = schedule.profiles.display_name;
    } else if (schedule.profiles?.email) {
      // Authenticated user with email
      createdBy = schedule.profiles.email;
    }

    return {
      success: true,
      data: {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        availableSlots: schedule.available_slots,
        duration: schedule.duration,
        timeZone: schedule.time_zone,
        createdBy,
        createdAt: schedule.created_at,
        responses: availabilityResponses,
      }
    };
  }

  async submitAvailability(scheduleId: string, submitAvailabilityDto: SubmitAvailabilityDto): Promise<ApiResponse<AvailabilityResponse>> {
    const supabase = this.supabaseService.getClient();
    
    // First verify the schedule exists
    const { data: schedule, error: scheduleError } = await supabase
      .from('schedules')
      .select('id')
      .eq('id', scheduleId)
      .single();

    if (scheduleError || !schedule) {
      throw new NotFoundException('Schedule not found');
    }

    // Check if this name has already submitted availability for this schedule
    const { data: existingResponse, error: existingError } = await supabase
      .from('availability_responses')
      .select('id')
      .eq('schedule_id', scheduleId)
      .eq('name', submitAvailabilityDto.name)
      .single();

    if (existingResponse) {
      // Update existing response
      const { data, error } = await supabase
        .from('availability_responses')
        .update({
          availability: submitAvailabilityDto.availability,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', existingResponse.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update availability: ${error.message}`);
      }

      return {
        success: true,
        data: {
          id: data.id,
          scheduleId: data.schedule_id,
          name: data.name,
          availability: data.availability,
          submittedAt: data.submitted_at,
        }
      };
    } else {
      // Create new response
      const { data, error } = await supabase
        .from('availability_responses')
        .insert({
          schedule_id: scheduleId,
          name: submitAvailabilityDto.name,
          availability: submitAvailabilityDto.availability,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to submit availability: ${error.message}`);
      }

      return {
        success: true,
        data: {
          id: data.id,
          scheduleId: data.schedule_id,
          name: data.name,
          availability: data.availability,
          submittedAt: data.submitted_at,
        }
      };
    }
  }
} 