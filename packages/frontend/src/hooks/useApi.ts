import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  // Auth types
  AuthUser,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  UploadAvatarResponse,
  
  // Availability types
  FreelancerProfile,
  CreateFreelancerProfileDto,
  UpdateFreelancerProfileDto,
  AvailabilityTimeSlot,
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  RecurringAvailability,
  CreateRecurringAvailabilityDto,
  UpdateRecurringAvailabilityDto,
  FreelancerAvailabilityResponse,
  AvailabilityStats,
  PublicAvailabilityResponse,
  
  // Analytics types
  DashboardAnalytics,
  ScheduleAnalytics,
  
  // Booking types
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  BookingConfirmationResponse,
} from '@zync/shared';

// Query Keys
export const QUERY_KEYS = {
  // Auth
  auth: ['auth'] as const,
  
  // Profile
  profile: ['profile'] as const,
  
  // Freelancer Profile
  freelancerProfile: ['freelancerProfile'] as const,
  
  // Availability
  availability: ['availability'] as const,
  availabilityStats: ['availabilityStats'] as const,
  recurringAvailability: ['recurringAvailability'] as const,
  
  // Public Booking
  publicAvailability: (slug: string) => ['publicAvailability', slug] as const,
  
  // Appointments
  appointments: ['appointments'] as const,
  appointmentByReference: (reference: string) => ['appointment', reference] as const,
  
  // Analytics
  dashboardAnalytics: ['dashboardAnalytics'] as const,
  scheduleAnalytics: ['scheduleAnalytics'] as const,
} as const;

// ============================================================================
// AUTH HOOKS
// ============================================================================

export function useLogin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginDto) => apiClient.login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.auth, user);
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterDto) => apiClient.register(data),
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.auth, user);
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useLogout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      });
    },
  });
}

// ============================================================================
// PROFILE HOOKS
// ============================================================================

export function useUpdateProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileDto) => apiClient.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.auth, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUploadAvatar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => apiClient.uploadAvatar(file),
    onSuccess: (response: UploadAvatarResponse) => {
      queryClient.setQueryData(QUERY_KEYS.auth, response.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// FREELANCER PROFILE HOOKS
// ============================================================================

export function useFreelancerProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.freelancerProfile,
    queryFn: () => apiClient.getFreelancerProfile(),
    retry: false, // Don't retry if profile doesn't exist
  });
}

export function useCreateFreelancerProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFreelancerProfileDto) => apiClient.createFreelancerProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.freelancerProfile, profile);
      toast({
        title: 'Profile Created',
        description: 'Your freelancer profile has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateFreelancerProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateFreelancerProfileDto) => apiClient.updateFreelancerProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.freelancerProfile, profile);
      toast({
        title: 'Profile Updated',
        description: 'Your freelancer profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// AVAILABILITY HOOKS
// ============================================================================

export function useAvailability() {
  return useQuery({
    queryKey: QUERY_KEYS.availability,
    queryFn: () => apiClient.getAvailability(),
  });
}

export function useAvailabilityStats() {
  return useQuery({
    queryKey: QUERY_KEYS.availabilityStats,
    queryFn: () => apiClient.getAvailabilityStats(),
  });
}

export function useCreateTimeSlot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTimeSlotDto) => apiClient.createTimeSlot(data),
    onSuccess: (slot) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityStats });
      toast({
        title: 'Time Slot Created',
        description: `Available slot created for ${slot.date} at ${slot.start_time}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTimeSlot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimeSlotDto }) => 
      apiClient.updateTimeSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityStats });
      toast({
        title: 'Time Slot Updated',
        description: 'The time slot has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteTimeSlot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTimeSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityStats });
      toast({
        title: 'Time Slot Deleted',
        description: 'The time slot has been removed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// RECURRING AVAILABILITY HOOKS
// ============================================================================

export function useRecurringAvailability() {
  return useQuery({
    queryKey: QUERY_KEYS.recurringAvailability,
    queryFn: () => apiClient.getRecurringAvailability(),
  });
}

export function useCreateRecurringAvailability() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRecurringAvailabilityDto) => 
      apiClient.createRecurringAvailability(data),
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recurringAvailability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[schedule.day_of_week];
      toast({
        title: 'Recurring Schedule Created',
        description: `${dayName} schedule created: ${schedule.start_time} - ${schedule.end_time}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateRecurringAvailability() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringAvailabilityDto }) => 
      apiClient.updateRecurringAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recurringAvailability });
      toast({
        title: 'Schedule Updated',
        description: 'Recurring schedule has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteRecurringAvailability() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteRecurringAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recurringAvailability });
      toast({
        title: 'Schedule Deleted',
        description: 'Recurring schedule has been removed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useGenerateSlots() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ startDate, endDate }: { startDate: string; endDate: string }) => 
      apiClient.generateSlotsFromRecurring(startDate, endDate),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityStats });
      toast({
        title: 'Slots Generated',
        description: `${result.created_slots} time slots have been generated from your recurring schedules.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// PUBLIC BOOKING HOOKS
// ============================================================================

export function usePublicAvailability(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicAvailability(slug),
    queryFn: () => apiClient.getPublicAvailability(slug),
    enabled: !!slug,
  });
}

export function useCreateAppointment(slug: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAppointmentDto) => apiClient.createAppointment(slug, data),
    onSuccess: (response) => {
      // Invalidate public availability to update available slots
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.publicAvailability(slug) });
      toast({
        title: 'Booking Confirmed',
        description: 'Your appointment has been booked successfully!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// APPOINTMENT MANAGEMENT HOOKS
// ============================================================================

export function useAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments,
    queryFn: () => apiClient.getAppointments(),
  });
}

export function useUpdateAppointmentStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' }) => 
      apiClient.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availability });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityStats });
      toast({
        title: 'Appointment Updated',
        description: 'The appointment status has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useAppointmentByReference(reference: string) {
  return useQuery({
    queryKey: QUERY_KEYS.appointmentByReference(reference),
    queryFn: () => apiClient.getAppointmentByReference(reference),
    enabled: !!reference,
  });
}

export function useCancelAppointmentByReference() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reference: string) => apiClient.cancelAppointmentByReference(reference),
    onSuccess: (_, reference) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointmentByReference(reference) });
      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// ============================================================================
// ANALYTICS HOOKS
// ============================================================================

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardAnalytics,
    queryFn: () => apiClient.getDashboardAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useScheduleAnalytics() {
  return useQuery({
    queryKey: QUERY_KEYS.scheduleAnalytics,
    queryFn: () => apiClient.getScheduleAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 