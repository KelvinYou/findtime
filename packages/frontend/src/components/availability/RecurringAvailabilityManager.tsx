import { Trans } from '@lingui/react';
import { Repeat, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecurringAvailability } from '@zync/shared';

type RecurringAvailabilityManagerProps = {
  recurringAvailability: RecurringAvailability[];
  onAvailabilityUpdated: () => void;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function RecurringAvailabilityManager({ 
  recurringAvailability, 
  onAvailabilityUpdated 
}: RecurringAvailabilityManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Repeat className="mr-2 h-5 w-5" />
          <Trans id="Recurring Schedule" />
        </CardTitle>
        <CardDescription>
          <Trans id="Set up your weekly availability pattern" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurringAvailability.length > 0 ? (
            <>
              {recurringAvailability.map((recurring) => (
                <div key={recurring.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{DAYS[recurring.day_of_week]}</span>
                    <span className="ml-2 text-gray-600">
                      {recurring.start_time} - {recurring.end_time}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({recurring.duration_minutes} min slots)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={recurring.is_active ? 'text-green-600' : 'text-red-600'}>
                      {recurring.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
              <Button onClick={onAvailabilityUpdated} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                <Trans id="Add Recurring Schedule" />
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <Repeat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <Trans id="No Recurring Schedule" />
              </h3>
              <p className="text-gray-600 mb-6">
                <Trans id="Set up recurring availability to automatically generate time slots." />
              </p>
              <Button onClick={onAvailabilityUpdated}>
                <Plus className="mr-2 h-4 w-4" />
                <Trans id="Create Recurring Schedule" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 