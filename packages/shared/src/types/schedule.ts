export type TimeSlot = {
  start: string; // HH:MM format
  end: string;   // HH:MM format
};

export type DateTimeSlots = {
  date: string; // YYYY-MM-DD format
  slots: TimeSlot[];
};

export type CreateScheduleDto = {
  title: string;
  description?: string;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  duration: number; // in minutes
  timeZone: string;
  // Guest creator info (when not authenticated)
  creatorName?: string;
  creatorEmail?: string;
};

export type UpdateScheduleDto = Partial<CreateScheduleDto>;

export type ScheduleResponse = {
  id: string;
  title: string;
  description?: string;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  duration: number;
  timeZone: string;
  userId?: string; // Optional for guest-created schedules
  creatorName?: string; // For guest creators
  creatorEmail?: string; // For guest creators
  createdAt: string;
  updatedAt: string;
};

export type PublicScheduleResponse = {
  id: string;
  title: string;
  description?: string;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  duration: number;
  timeZone: string;
  createdBy: string; // Display name (from user profile or guest name)
  createdAt: string;
  responses: AvailabilityResponse[];
};

export type SubmitAvailabilityDto = {
  scheduleId: string;
  name: string;
  availability: DateTimeSlots[];
};

export type AvailabilityResponse = {
  id: string;
  scheduleId: string;
  name: string;
  availability: DateTimeSlots[];
  submittedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
  error?: string;
}; 