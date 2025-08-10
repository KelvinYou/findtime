import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FreelancerAvailabilityResponse, AvailabilityTimeSlot } from '@zync/shared';
import { useDeleteTimeSlot } from '@/hooks/useApi';
import { TimeSlotForm } from './TimeSlotForm';

type AvailabilityCalendarProps = {
  availability: FreelancerAvailabilityResponse | null;
  onAvailabilityUpdated: () => void;
};

export function AvailabilityCalendar({ availability, onAvailabilityUpdated }: AvailabilityCalendarProps) {
  const deleteTimeSlot = useDeleteTimeSlot();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleSlotCreated = (slot: AvailabilityTimeSlot) => {
    setIsAddDialogOpen(false);
    onAvailabilityUpdated();
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteTimeSlot.mutate(slotId, {
      onSuccess: () => {
        onAvailabilityUpdated();
      },
    });
  };

  const groupSlotsByDate = (slots: AvailabilityTimeSlot[]) => {
    const grouped: Record<string, AvailabilityTimeSlot[]> = {};
    slots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    
    // Sort slots within each date by start time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    return grouped;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSlotStatus = (slot: AvailabilityTimeSlot) => {
    if (!slot.is_available) return { text: 'Booked', variant: 'destructive' as const };
    
    const slotDate = new Date(slot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (slotDate < today) return { text: 'Past', variant: 'secondary' as const };
    return { text: 'Available', variant: 'default' as const };
  };

  const timeSlots = availability?.time_slots || [];
  const groupedSlots = groupSlotsByDate(timeSlots);
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <Trans id="Time Slots" />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <Trans id="Add Time Slot" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    <Trans id="Create New Time Slot" />
                  </DialogTitle>
                </DialogHeader>
                <TimeSlotForm 
                  onSlotCreated={handleSlotCreated}
                  onCancel={() => setIsAddDialogOpen(false)}
                  existingSlots={timeSlots}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            <Trans id="Manage your individual available time slots" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-3">
                  <h3 className="font-medium text-lg">{formatDate(date)}</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {groupedSlots[date].map((slot) => {
                      const status = getSlotStatus(slot);
                      return (
                        <div 
                          key={slot.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <Badge variant={status.variant}>
                                {status.text}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {slot.duration_minutes} minutes
                              {slot.buffer_time_minutes && slot.buffer_time_minutes > 0 && (
                                <span> • {slot.buffer_time_minutes}min buffer</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {slot.is_available && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteSlot(slot.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <Trans id="No Time Slots" />
              </h3>
              <p className="text-gray-600 mb-6">
                <Trans id="Create your first time slot to start accepting bookings" />
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans id="Create First Time Slot" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      <Trans id="Create New Time Slot" />
                    </DialogTitle>
                  </DialogHeader>
                  <TimeSlotForm 
                    onSlotCreated={handleSlotCreated}
                    onCancel={() => setIsAddDialogOpen(false)}
                    existingSlots={timeSlots}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 