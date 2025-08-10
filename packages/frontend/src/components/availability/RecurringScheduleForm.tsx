import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Repeat, Clock, Plus, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api';
import { CreateRecurringAvailabilityDto, RecurringAvailability } from '@zync/shared';

type RecurringScheduleFormProps = {
  onScheduleCreated: (schedule: RecurringAvailability) => void;
  onCancel?: () => void;
  existingSchedules?: RecurringAvailability[];
};

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

const BUFFER_OPTIONS = [
  { value: 0, label: 'No buffer' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
];

export function RecurringScheduleForm({ 
  onScheduleCreated, 
  onCancel, 
  existingSchedules = [] 
}: RecurringScheduleFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string>('');
  const [formData, setFormData] = useState({
    day_of_week: 1, // Monday by default
    start_time: '09:00',
    end_time: '17:00',
    duration_minutes: 60,
    buffer_time_minutes: 15,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear conflict warning when user changes inputs
    if (conflictWarning) {
      setConflictWarning('');
    }
  };

  const checkScheduleConflicts = (dayOfWeek: number, startTime: string, endTime: string) => {
    const conflicts = existingSchedules.filter(schedule => {
      if (schedule.day_of_week !== dayOfWeek || !schedule.is_active) return false;
      
      // Check for time overlap
      const newStart = startTime;
      const newEnd = endTime;
      const existingStart = schedule.start_time;
      const existingEnd = schedule.end_time;
      
      return (newStart < existingEnd && newEnd > existingStart);
    });

    return conflicts;
  };

  const calculateSlotsCount = (startTime: string, endTime: string, slotDuration: number, bufferTime: number): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const slotWithBuffer = slotDuration + bufferTime;
    return Math.floor(totalMinutes / slotWithBuffer);
  };

  const validateSchedule = (): boolean => {
    if (!formData.start_time || !formData.end_time) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return false;
    }

    // Check if start time is before end time
    if (formData.start_time >= formData.end_time) {
      toast({
        title: 'Invalid Time Range',
        description: 'Start time must be before end time',
        variant: 'destructive',
      });
      return false;
    }

    // Check for conflicts with existing schedules
    const conflicts = checkScheduleConflicts(formData.day_of_week, formData.start_time, formData.end_time);
    if (conflicts.length > 0) {
      const dayName = DAYS_OF_WEEK.find(d => d.value === formData.day_of_week)?.label;
      const conflictTime = `${conflicts[0].start_time} - ${conflicts[0].end_time}`;
      setConflictWarning(`Schedule conflicts with existing ${dayName} schedule: ${conflictTime}`);
      return false;
    }

    // Check if the time range can accommodate at least one slot
    const slotsCount = calculateSlotsCount(
      formData.start_time, 
      formData.end_time, 
      formData.duration_minutes, 
      formData.buffer_time_minutes
    );

    if (slotsCount < 1) {
      toast({
        title: 'Invalid Schedule',
        description: 'Time range is too short for the selected slot duration and buffer time',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSchedule()) return;

    setIsLoading(true);
    try {
      const scheduleData: CreateRecurringAvailabilityDto = {
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        duration_minutes: formData.duration_minutes,
        buffer_time_minutes: formData.buffer_time_minutes,
      };

      const createdSchedule = await apiClient.createRecurringAvailability(scheduleData);
      
      const dayName = DAYS_OF_WEEK.find(d => d.value === formData.day_of_week)?.label;
      toast({
        title: 'Recurring Schedule Created',
        description: `${dayName} schedule created: ${formData.start_time} - ${formData.end_time}`,
      });

      onScheduleCreated(createdSchedule);
      
      // Reset form
      setFormData({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        duration_minutes: 60,
        buffer_time_minutes: 15,
      });
      
    } catch (error) {
      console.error('Failed to create recurring schedule:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create recurring schedule',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const slotsCount = calculateSlotsCount(
    formData.start_time, 
    formData.end_time, 
    formData.duration_minutes, 
    formData.buffer_time_minutes
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Repeat className="mr-2 h-5 w-5" />
          <Trans id="Add Recurring Schedule" />
        </CardTitle>
        <CardDescription>
          <Trans id="Create a weekly recurring availability pattern" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {conflictWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{conflictWarning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="day_of_week">
              <Trans id="Day of Week" /> *
            </Label>
            <Select
              value={formData.day_of_week.toString()}
              onValueChange={(value) => handleInputChange('day_of_week', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">
                <Trans id="Start Time" /> *
              </Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">
                <Trans id="End Time" /> *
              </Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">
                <Trans id="Slot Duration" />
              </Label>
              <Select
                value={formData.duration_minutes.toString()}
                onValueChange={(value) => handleInputChange('duration_minutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buffer">
                <Trans id="Buffer Time" />
              </Label>
              <Select
                value={formData.buffer_time_minutes.toString()}
                onValueChange={(value) => handleInputChange('buffer_time_minutes', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUFFER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.start_time && formData.end_time && slotsCount > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong><Trans id="Schedule Preview" />:</strong><br />
                {DAYS_OF_WEEK.find(d => d.value === formData.day_of_week)?.label}s: {formData.start_time} - {formData.end_time}
                <br />
                <strong><Trans id="Generated Slots" />:</strong> {slotsCount} slots of {formData.duration_minutes} minutes each
                {formData.buffer_time_minutes > 0 && (
                  <>
                    <br />
                    <strong><Trans id="Buffer Time" />:</strong> {formData.buffer_time_minutes} minutes between slots
                  </>
                )}
              </p>
            </div>
          )}

          {slotsCount === 0 && formData.start_time && formData.end_time && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <Trans id="Time range is too short for the selected duration and buffer time" />
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <Trans id="Cancel" />
              </Button>
            )}
            <Button type="submit" disabled={isLoading || slotsCount === 0}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  <Trans id="Creating..." />
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  <Trans id="Create Schedule" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 