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
  ProfileResponse
} from '@zync/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
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