import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

type CreateScheduleDto = {
  title: string;
  description?: string;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  duration: number;
  timeZone: string;
};

type UpdateScheduleDto = Partial<CreateScheduleDto>;

@Injectable()
export class ScheduleService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createScheduleDto: CreateScheduleDto, userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        ...createScheduleDto,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }

    return data;
  }

  async findAllByUser(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch schedules: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Schedule not found');
    }

    return data;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto, userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // First check if schedule exists and belongs to user
    const existing = await this.findOne(id);
    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only update your own schedules');
    }

    const { data, error } = await supabase
      .from('schedules')
      .update({
        ...updateScheduleDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }

    return data;
  }

  async remove(id: string, userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // First check if schedule exists and belongs to user
    const existing = await this.findOne(id);
    if (existing.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own schedules');
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }

    return { message: 'Schedule deleted successfully' };
  }

  async getPublicSchedule(id: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .select('id, title, description, availableSlots, duration, timeZone')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Schedule not found');
    }

    return data;
  }
} 