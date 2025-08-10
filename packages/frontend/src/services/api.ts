import { 
  CreateScheduleDto, 
  UpdateScheduleDto, 
  SubmitAvailabilityDto,
  ScheduleResponse,
  PublicScheduleResponse,
  AvailabilityResponse,
  ApiResponse,
  ApiError,
  LoginDto,
  RegisterDto,
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  UpdateProfileDto,
  UploadAvatarResponse,
  // Availability types
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  CreateRecurringAvailabilityDto,
  UpdateRecurringAvailabilityDto,
  CreateFreelancerProfileDto,
  UpdateFreelancerProfileDto,
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  FreelancerAvailabilityResponse,
  PublicAvailabilityResponse,
  AvailabilityStats,
  AvailabilityTimeSlot,
  RecurringAvailability,
  FreelancerProfile,
  Appointment,
  BookingConfirmationResponse
} from '@zync/shared';
import { STORAGE_KEYS } from '@/constants/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        // Only set Content-Type for non-FormData requests
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication methods
  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await this.request<ProfileResponse>('/auth/profile');
    return response;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
    return response;
  }

  // Profile management
  async updateProfile(data: UpdateProfileDto): Promise<ProfileResponse> {
    const response = await this.request<ProfileResponse>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await this.request<UploadAvatarResponse>('/profile/avatar', {
      method: 'POST',
      body: formData,
        });
    return response;
  }

  // Freelancer Availability Management
  async createFreelancerProfile(data: CreateFreelancerProfileDto): Promise<FreelancerProfile> {
    const response = await this.request<FreelancerProfile>('/availability/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getFreelancerProfile(): Promise<FreelancerProfile> {
    const response = await this.request<FreelancerProfile>('/availability/profile');
    return response;
  }

  async updateFreelancerProfile(data: UpdateFreelancerProfileDto): Promise<FreelancerProfile> {
    const response = await this.request<FreelancerProfile>('/availability/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  // Time Slot Management
  async createTimeSlot(data: CreateTimeSlotDto): Promise<AvailabilityTimeSlot> {
    const response = await this.request<AvailabilityTimeSlot>('/availability/slots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getAvailability(startDate?: string, endDate?: string): Promise<FreelancerAvailabilityResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await this.request<FreelancerAvailabilityResponse>(
      `/availability/slots?${params.toString()}`
    );
    return response;
  }

  async updateTimeSlot(slotId: string, data: UpdateTimeSlotDto): Promise<AvailabilityTimeSlot> {
    const response = await this.request<AvailabilityTimeSlot>(`/availability/slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteTimeSlot(slotId: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(`/availability/slots/${slotId}`, {
      method: 'DELETE',
    });
    return response;
  }

  // Recurring Availability
  async createRecurringAvailability(data: CreateRecurringAvailabilityDto): Promise<RecurringAvailability> {
    const response = await this.request<RecurringAvailability>('/availability/recurring', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getRecurringAvailability(): Promise<RecurringAvailability[]> {
    const response = await this.request<RecurringAvailability[]>('/availability/recurring');
    return response;
  }

  async updateRecurringAvailability(recurringId: string, data: UpdateRecurringAvailabilityDto): Promise<RecurringAvailability> {
    const response = await this.request<RecurringAvailability>(`/availability/recurring/${recurringId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteRecurringAvailability(recurringId: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(`/availability/recurring/${recurringId}`, {
      method: 'DELETE',
    });
    return response;
  }

  async generateSlotsFromRecurring(startDate: string, endDate: string): Promise<{ created_slots: number }> {
    const response = await this.request<{ created_slots: number }>('/availability/generate-slots', {
      method: 'POST',
      body: JSON.stringify({ start_date: startDate, end_date: endDate }),
    });
    return response;
  }

  // Public booking
  async getPublicAvailability(slug: string, startDate?: string, endDate?: string): Promise<PublicAvailabilityResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await this.request<PublicAvailabilityResponse>(
      `/availability/public/${slug}?${params.toString()}`
    );
    return response;
  }

  async getAvailabilityStats(): Promise<AvailabilityStats> {
    const response = await this.request<AvailabilityStats>('/availability/stats');
    return response;
  }

  // Booking Management
  async createAppointment(slug: string, data: CreateAppointmentDto): Promise<BookingConfirmationResponse> {
    const response = await this.request<BookingConfirmationResponse>(`/booking/${slug}/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getAppointments(
    status?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await this.request<Appointment[]>(`/booking/appointments?${params.toString()}`);
    return response;
  }

  async updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled'): Promise<Appointment> {
    const response = await this.request<Appointment>(`/booking/appointments/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response;
  }

  async getAppointmentByReference(reference: string): Promise<Appointment> {
    const response = await this.request<Appointment>(`/booking/appointment/${reference}`);
    return response;
  }

  async cancelAppointmentByReference(reference: string): Promise<Appointment> {
    const response = await this.request<Appointment>(`/booking/appointment/${reference}/cancel`, {
      method: 'PUT',
    });
    return response;
  }

  // Schedule management (authenticated)
  async createSchedule(data: CreateScheduleDto): Promise<ScheduleResponse> {
    const response = await this.request<ApiResponse<ScheduleResponse>>('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getSchedules(): Promise<ScheduleResponse[]> {
    const response = await this.request<ApiResponse<ScheduleResponse[]>>('/schedules');
    return response.data;
  }

  async getSchedule(id: string): Promise<ScheduleResponse> {
    const response = await this.request<ApiResponse<ScheduleResponse>>(`/schedules/${id}`);
    return response.data;
  }

  async updateSchedule(id: string, data: UpdateScheduleDto): Promise<ScheduleResponse> {
    const response = await this.request<ApiResponse<ScheduleResponse>>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteSchedule(id: string): Promise<{ id: string }> {
    const response = await this.request<ApiResponse<{ id: string }>>(`/schedules/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  // Public schedule access (no auth required)
  async getPublicSchedule(id: string): Promise<PublicScheduleResponse> {
    const response = await this.request<ApiResponse<PublicScheduleResponse>>(`/schedules/${id}/public`);
    return response.data;
  }

  async submitAvailability(scheduleId: string, data: Omit<SubmitAvailabilityDto, 'scheduleId'>): Promise<AvailabilityResponse> {
    const submitData: SubmitAvailabilityDto = {
      ...data,
      scheduleId,
    };
    
    const response = await this.request<ApiResponse<AvailabilityResponse>>(`/schedules/${scheduleId}/availability`, {
      method: 'POST',
      body: JSON.stringify(submitData),
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Utility functions for data transformation
export const transformTimeSlots = (timeSlots: Array<{date: string; slots: Array<{start: string; end: string}>}>) => {
  return timeSlots.flatMap(dateSlot => 
    dateSlot.slots.map(slot => ({
      date: dateSlot.date,
      startTime: slot.start,
      endTime: slot.end,
    }))
  );
};

export const transformFromAvailableSlots = (availableSlots: Array<{date: string; startTime: string; endTime: string}>) => {
  const groupedByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push({ start: slot.startTime, end: slot.endTime });
    return acc;
  }, {} as Record<string, Array<{start: string; end: string}>>);

  return Object.entries(groupedByDate).map(([date, slots]) => ({
    date,
    slots,
  }));
}; 