import { Trans } from '@lingui/react';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FreelancerAvailabilityResponse } from '@zync/shared';

type AvailabilityCalendarProps = {
  availability: FreelancerAvailabilityResponse | null;
  onAvailabilityUpdated: () => void;
};

export function AvailabilityCalendar({ availability, onAvailabilityUpdated }: AvailabilityCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          <Trans id="Availability Calendar" />
        </CardTitle>
        <CardDescription>
          <Trans id="Manage your available time slots" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <Trans id="Calendar View Coming Soon" />
          </h3>
          <p className="text-gray-600 mb-6">
            <Trans id="Visual calendar interface for managing your availability will be available soon." />
          </p>
          <Button onClick={onAvailabilityUpdated}>
            <Plus className="mr-2 h-4 w-4" />
            <Trans id="Add Time Slot" />
          </Button>
        </div>
        {availability && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">
              <Trans id="Current Time Slots" />: {availability.time_slots.length}
            </h4>
            {availability.time_slots.slice(0, 5).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between py-2 border-b">
                <span>{slot.date} {slot.start_time} - {slot.end_time}</span>
                <span className={slot.is_available ? 'text-green-600' : 'text-red-600'}>
                  {slot.is_available ? 'Available' : 'Booked'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 