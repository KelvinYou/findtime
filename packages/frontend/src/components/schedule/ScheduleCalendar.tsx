import { useState } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { Calendar as CalendarIcon, Clock, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type TimeSlot = {
  start: string;
  end: string;
};

type DateTimeSlots = {
  date: string;
  slots: TimeSlot[];
};

type ScheduleCalendarProps = {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  timeSlots: DateTimeSlots[];
  onTimeSlotsChange: (timeSlots: DateTimeSlots[]) => void;
};

export function ScheduleCalendar({ 
  selectedDates, 
  onDatesChange, 
  timeSlots, 
  onTimeSlotsChange 
}: ScheduleCalendarProps) {
  const { t } = useLingui();
  const [selectedDateForTime, setSelectedDateForTime] = useState<Date | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const normalizedDate = startOfDay(date);
    const isSelected = selectedDates.some(
      (selectedDate) => startOfDay(selectedDate).getTime() === normalizedDate.getTime()
    );

    if (isSelected) {
      // Remove date
      const newDates = selectedDates.filter(
        (selectedDate) => startOfDay(selectedDate).getTime() !== normalizedDate.getTime()
      );
      onDatesChange(newDates);
      
      // Remove time slots for this date
      const dateString = format(normalizedDate, 'yyyy-MM-dd');
      const newTimeSlots = timeSlots.filter(slot => slot.date !== dateString);
      onTimeSlotsChange(newTimeSlots);
    } else {
      // Add date
      onDatesChange([...selectedDates, normalizedDate]);
    }
  };

  const handleTimeSlotAdd = (date: Date, startTime: string, endTime: string) => {
    if (!startTime || !endTime) return;

    const dateString = format(date, 'yyyy-MM-dd');
    const existingDateSlots = timeSlots.find(slot => slot.date === dateString);
    
    const newSlot: TimeSlot = { start: startTime, end: endTime };

    if (existingDateSlots) {
      const updatedTimeSlots = timeSlots.map(slot => 
        slot.date === dateString 
          ? { ...slot, slots: [...slot.slots, newSlot] }
          : slot
      );
      onTimeSlotsChange(updatedTimeSlots);
    } else {
      onTimeSlotsChange([...timeSlots, { date: dateString, slots: [newSlot] }]);
    }
  };

  const handleTimeSlotRemove = (date: string, slotIndex: number) => {
    const updatedTimeSlots = timeSlots.map(slot => 
      slot.date === date 
        ? { ...slot, slots: slot.slots.filter((_, index) => index !== slotIndex) }
        : slot
    ).filter(slot => slot.slots.length > 0);
    
    onTimeSlotsChange(updatedTimeSlots);
  };

  const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return timeSlots.find(slot => slot.date === dateString)?.slots || [];
  };

  return (
    <div className="space-y-6">
      {/* Calendar for Date Selection */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              <Trans id="Select Available Dates" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <Trans id="Click on dates when you're available" />
            </p>
          </div>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => dates && onDatesChange(dates)}
            disabled={(date) => date < new Date()}
            className="rounded-xl border border-border bg-card shadow-sm"
          />
        </div>

        {/* Selected Dates Summary */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              <Trans id="Selected Dates" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <Trans id="Click on a date to set specific time slots" />
            </p>
          </div>
          
          {selectedDates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>
                <Trans id="No dates selected yet" />
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, index) => {
                  const slots = getTimeSlotsForDate(date);
                  return (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent 
                        className="p-4"
                        onClick={() => setSelectedDateForTime(date)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {format(date, 'EEEE, MMMM d, yyyy')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {slots.length > 0 
                                ? `${slots.length} time slot${slots.length === 1 ? '' : 's'}`
                                : 'No time slots set'
                              }
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {slots.length > 0 && (
                              <Badge variant="secondary">
                                {slots.length}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDateSelect(date);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Time Slot Configuration */}
      {selectedDateForTime && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <Trans 
                id="Time Slots for {date}" 
                values={{ date: format(selectedDateForTime, 'MMMM d, yyyy') }} 
              />
            </CardTitle>
            <CardDescription>
              <Trans id="Add specific time ranges when you're available" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSlotEditor
              date={selectedDateForTime}
              timeSlots={getTimeSlotsForDate(selectedDateForTime)}
              onAdd={handleTimeSlotAdd}
              onRemove={(slotIndex) => 
                handleTimeSlotRemove(format(selectedDateForTime, 'yyyy-MM-dd'), slotIndex)
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type TimeSlotEditorProps = {
  date: Date;
  timeSlots: TimeSlot[];
  onAdd: (date: Date, startTime: string, endTime: string) => void;
  onRemove: (slotIndex: number) => void;
};

function TimeSlotEditor({ date, timeSlots, onAdd, onRemove }: TimeSlotEditorProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAdd = () => {
    if (startTime && endTime && startTime < endTime) {
      onAdd(date, startTime, endTime);
      // Keep the same times for easy multiple additions
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Time Slot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <Label htmlFor="start-time">
            <Trans id="Start Time" />
          </Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="end-time">
            <Trans id="End Time" />
          </Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!startTime || !endTime || startTime >= endTime}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            <Trans id="Add Slot" />
          </Button>
        </div>
      </div>

      {/* Existing Time Slots */}
      {timeSlots.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            <Trans id="Current Time Slots" />
          </h4>
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium">
                  {slot.start} - {slot.end}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 