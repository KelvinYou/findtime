// Availability Management Types
export type AvailabilityTimeSlot = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  duration_minutes: number;
  is_available: boolean;
  buffer_time_minutes?: number; // Time between appointments
  created_at: string;
  updated_at: string;
};

export type RecurringAvailability = {
  id: string;
  user_id: string;
  day_of_week: number; // 0-6 (Sunday to Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  duration_minutes: number;
  buffer_time_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  time_slot_id: string;
  freelancer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_message?: string;
  appointment_date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_reference: string;
  created_at: string;
  updated_at: string;
};

export type FreelancerProfile = {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  services_offered?: string[];
  hourly_rate?: number;
  currency: string;
  time_zone: string;
  booking_url_slug: string; // Unique URL identifier
  is_public: boolean;
  booking_advance_days: number; // How many days in advance bookings are allowed
  cancellation_policy?: string;
  created_at: string;
  updated_at: string;
};

// DTOs for API requests
export type CreateTimeSlotDto = {
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  buffer_time_minutes?: number;
};

export type UpdateTimeSlotDto = {
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  is_available?: boolean;
  buffer_time_minutes?: number;
};

export type CreateRecurringAvailabilityDto = {
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  buffer_time_minutes: number;
};

export type UpdateRecurringAvailabilityDto = {
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  buffer_time_minutes?: number;
  is_active?: boolean;
};

export type CreateAppointmentDto = {
  time_slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_message?: string;
};

export type UpdateAppointmentStatusDto = {
  status: 'confirmed' | 'cancelled';
};

export type CreateFreelancerProfileDto = {
  business_name: string;
  description?: string;
  services_offered?: string[];
  hourly_rate?: number;
  currency: string;
  time_zone: string;
  booking_url_slug: string;
  booking_advance_days: number;
  cancellation_policy?: string;
};

export type UpdateFreelancerProfileDto = {
  business_name?: string;
  description?: string;
  services_offered?: string[];
  hourly_rate?: number;
  currency?: string;
  time_zone?: string;
  booking_url_slug?: string;
  is_public?: boolean;
  booking_advance_days?: number;
  cancellation_policy?: string;
};

// Response types
export type FreelancerAvailabilityResponse = {
  time_slots: AvailabilityTimeSlot[];
  recurring_availability: RecurringAvailability[];
  total_slots: number;
};

export type PublicAvailabilityResponse = {
  freelancer: FreelancerProfile;
  available_slots: AvailabilityTimeSlot[];
  next_available_date?: string;
};

export type AppointmentResponse = Appointment;

export type BookingConfirmationResponse = {
  appointment: Appointment;
  booking_reference: string;
  message: string;
};

// Calendar view types
export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'available' | 'booked' | 'blocked';
  appointment?: Appointment;
  time_slot?: AvailabilityTimeSlot;
};

export type AvailabilityStats = {
  total_slots_this_week: number;
  booked_slots_this_week: number;
  available_slots_this_week: number;
  total_appointments_this_month: number;
  upcoming_appointments: Appointment[];
}; 