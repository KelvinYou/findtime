import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Calendar, Clock, Plus, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AvailabilityTimeSlot } from '@zync/shared';
import { useCreateTimeSlot } from '@/hooks/useApi';

type TimeSlotFormProps = {
  onSlotCreated: (slot: AvailabilityTimeSlot) => void;
  onCancel?: () => void;
  existingSlots?: AvailabilityTimeSlot[];
};

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

export function TimeSlotForm({ onSlotCreated, onCancel, existingSlots = [] }: TimeSlotFormProps) {
  const createTimeSlot = useCreateTimeSlot();
  const [conflictWarning, setConflictWarning] = useState<string>('');
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
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

  const checkTimeConflicts = (date: string, startTime: string, durationMinutes: number) => {
    const newStartTime = new Date(`${date}T${startTime}`);
    const newEndTime = new Date(newStartTime.getTime() + durationMinutes * 60000);

    const conflicts = existingSlots.filter(slot => {
      if (slot.date !== date) return false;
      
      const slotStart = new Date(`${slot.date}T${slot.start_time}`);
      const slotEnd = new Date(`${slot.date}T${slot.end_time}`);
      
      // Check for overlap
      return (newStartTime < slotEnd && newEndTime > slotStart);
    });

    return conflicts;
  };

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return endDate.toTimeString().slice(0, 5); // HH:MM format
  };

  const validateTimeSlot = (): string | null => {
    if (!formData.date || !formData.start_time) {
      return 'Please fill in all required fields';
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Cannot create time slots in the past';
    }

    // Check for conflicts
    const conflicts = checkTimeConflicts(formData.date, formData.start_time, formData.duration_minutes);
    if (conflicts.length > 0) {
      const conflictTime = `${conflicts[0].start_time} - ${conflicts[0].end_time}`;
      setConflictWarning(`Time slot conflicts with existing slot: ${conflictTime}`);
      return `Time slot conflicts with existing slot: ${conflictTime}`;
    }

    // Check if end time is valid (not past midnight)
    const endTime = calculateEndTime(formData.start_time, formData.duration_minutes);
    if (endTime < formData.start_time) {
      return 'Time slot cannot extend past midnight';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateTimeSlot();
    if (validationError) return;

    const endTime = calculateEndTime(formData.start_time, formData.duration_minutes);
    
    const slotData = {
      date: formData.date,
      start_time: formData.start_time,
      end_time: endTime,
      duration_minutes: formData.duration_minutes,
      buffer_time_minutes: formData.buffer_time_minutes,
    };

    createTimeSlot.mutate(slotData, {
      onSuccess: (createdSlot) => {
        onSlotCreated(createdSlot);
        
        // Reset form
        setFormData({
          date: '',
          start_time: '',
          duration_minutes: 60,
          buffer_time_minutes: 15,
        });
      },
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          <Trans id="Add Time Slot" />
        </CardTitle>
        <CardDescription>
          <Trans id="Create a new available time slot for booking" />
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Trans id="Date" /> *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                min={today}
                max={maxDateStr}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">
                <Trans id="Duration" />
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

          {formData.start_time && formData.duration_minutes && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong><Trans id="End Time" />:</strong> {calculateEndTime(formData.start_time, formData.duration_minutes)}
                <br />
                <strong><Trans id="Total Slot Duration" />:</strong> {formData.duration_minutes} minutes
                {formData.buffer_time_minutes > 0 && (
                  <>
                    <br />
                    <strong><Trans id="Buffer Time" />:</strong> {formData.buffer_time_minutes} minutes
                  </>
                )}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <Trans id="Cancel" />
              </Button>
            )}
            <Button type="submit" disabled={createTimeSlot.isPending}>
              {createTimeSlot.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  <Trans id="Creating..." />
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  <Trans id="Create Time Slot" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 