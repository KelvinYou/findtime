import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { 
  DashboardAnalytics,
  ServiceAnalytics,
  WeeklyStats,
  ScheduleAnalytics,
  ScheduleSummary
} from '@zync/shared';

@Injectable()
export class AnalyticsService {
  constructor(private supabaseService: SupabaseService) {}

  async getDashboardAnalytics(userId: string): Promise<DashboardAnalytics> {
    const supabase = this.supabaseService.getClient();

    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Get appointments for revenue calculation
    const { data: thisMonthAppointments } = await supabase
      .from('appointments')
      .select(`
        *,
        time_slots!inner(user_id),
        freelancer_profiles!inner(hourly_rate, currency)
      `)
      .eq('time_slots.user_id', userId)
      .gte('appointment_date', thisMonth.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    const { data: lastMonthAppointments } = await supabase
      .from('appointments')
      .select(`
        *,
        time_slots!inner(user_id),
        freelancer_profiles!inner(hourly_rate, currency)
      `)
      .eq('time_slots.user_id', userId)
      .gte('appointment_date', lastMonth.toISOString().split('T')[0])
      .lte('appointment_date', lastMonthEnd.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    // Calculate revenue
    const thisMonthRevenue = this.calculateRevenue(thisMonthAppointments || []);
    const lastMonthRevenue = this.calculateRevenue(lastMonthAppointments || []);
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get booking rate data
    const { data: totalSlots } = await supabase
      .from('time_slots')
      .select('id, appointments(*)')
      .eq('user_id', userId)
      .gte('date', thisMonth.toISOString().split('T')[0]);

    const totalSlotsCount = totalSlots?.length || 0;
    const bookedSlotsCount = totalSlots?.filter(slot => 
      slot.appointments && slot.appointments.length > 0
    ).length || 0;
    const bookingRate = totalSlotsCount > 0 ? (bookedSlotsCount / totalSlotsCount) * 100 : 0;

    // Get weekly stats
    const weeklyStats = await this.getWeeklyStats(userId, weekStart, weekEnd);

    // Get top services (mock data for now - would need service tracking)
    const topServices: ServiceAnalytics[] = [
      { name: 'Consultation', bookings: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(thisMonthRevenue * 0.4) },
      { name: 'Strategy Session', bookings: Math.floor(Math.random() * 20) + 5, revenue: Math.floor(thisMonthRevenue * 0.35) },
      { name: 'Follow-up', bookings: Math.floor(Math.random() * 15) + 3, revenue: Math.floor(thisMonthRevenue * 0.25) }
    ];

    return {
      revenue: {
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: revenueGrowth
      },
      bookingRate: {
        current: Math.round(bookingRate),
        target: 85
      },
      avgSessionDuration: '45m', // Mock data - would need session tracking
      customerSatisfaction: 4.8, // Mock data - would need feedback system
      topServices,
      weeklyStats,
      responseRate: 98 // Mock data - would need response tracking
    };
  }

  async getScheduleAnalytics(userId: string): Promise<ScheduleAnalytics> {
    const supabase = this.supabaseService.getClient();

    // Get all schedules for the user
    const { data: schedules } = await supabase
      .from('schedules')
      .select(`
        *,
        availability_responses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!schedules) {
      return {
        totalSchedules: 0,
        activeSchedules: 0,
        totalParticipants: 0,
        averageResponseRate: 0,
        recentSchedules: []
      };
    }

    // Calculate analytics
    const totalSchedules = schedules.length;
    const activeSchedules = schedules.filter(s => this.isScheduleActive(s)).length;
    
    let totalParticipants = 0;
    let totalResponses = 0;

    const recentSchedules: ScheduleSummary[] = schedules.slice(0, 10).map(schedule => {
      const participants = schedule.available_slots?.length || 0;
      const responses = schedule.availability_responses?.length || 0;
      
      totalParticipants += participants;
      totalResponses += responses;

      return {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        participants,
        responses,
        status: this.getScheduleStatus(schedule),
        created: schedule.created_at,
        deadline: schedule.deadline
      };
    });

    const averageResponseRate = totalParticipants > 0 
      ? (totalResponses / totalParticipants) * 100 
      : 0;

    return {
      totalSchedules,
      activeSchedules,
      totalParticipants,
      averageResponseRate: Math.round(averageResponseRate),
      recentSchedules
    };
  }

  private calculateRevenue(appointments: any[]): number {
    return appointments.reduce((total, appointment) => {
      const hourlyRate = appointment.freelancer_profiles?.hourly_rate || 0;
      const duration = appointment.end_time && appointment.start_time 
        ? this.calculateDurationHours(appointment.start_time, appointment.end_time)
        : 1;
      return total + (hourlyRate * duration);
    }, 0);
  }

  private calculateDurationHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  private async getWeeklyStats(userId: string, weekStart: Date, weekEnd: Date): Promise<WeeklyStats[]> {
    const supabase = this.supabaseService.getClient();
    
    const { data: weekAppointments } = await supabase
      .from('appointments')
      .select(`
        *,
        time_slots!inner(user_id),
        freelancer_profiles!inner(hourly_rate)
      `)
      .eq('time_slots.user_id', userId)
      .gte('appointment_date', weekStart.toISOString().split('T')[0])
      .lte('appointment_date', weekEnd.toISOString().split('T')[0])
      .in('status', ['confirmed', 'completed']);

    const weeklyStats: WeeklyStats[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = weekAppointments?.filter(apt => apt.appointment_date === dateStr) || [];
      const dayRevenue = this.calculateRevenue(dayAppointments);

      weeklyStats.push({
        day: days[i],
        bookings: dayAppointments.length,
        revenue: dayRevenue
      });
    }

    return weeklyStats;
  }

  private isScheduleActive(schedule: any): boolean {
    // A schedule is active if it's not expired and has available slots
    const now = new Date();
    const createdAt = new Date(schedule.created_at);
    const daysSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Consider active if created within last 30 days and has slots
    return daysSinceCreated < 30 && schedule.available_slots && schedule.available_slots.length > 0;
  }

  private getScheduleStatus(schedule: any): 'active' | 'completed' | 'expired' {
    if (this.isScheduleActive(schedule)) {
      return 'active';
    }
    
    const responses = schedule.availability_responses?.length || 0;
    const participants = schedule.available_slots?.length || 0;
    
    if (responses >= participants) {
      return 'completed';
    }
    
    return 'expired';
  }
} 