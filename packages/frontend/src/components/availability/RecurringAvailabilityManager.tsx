import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Repeat, Plus, Trash2, Play, Pause, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RecurringAvailability } from '@zync/shared';
import { 
  useUpdateRecurringAvailability, 
  useDeleteRecurringAvailability, 
  useGenerateSlots 
} from '@/hooks/useApi';
import { RecurringScheduleForm } from './RecurringScheduleForm';

type RecurringAvailabilityManagerProps = {
  recurringAvailability: RecurringAvailability[];
  onAvailabilityUpdated: () => void;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function RecurringAvailabilityManager({ 
  recurringAvailability, 
  onAvailabilityUpdated 
}: RecurringAvailabilityManagerProps) {
  const updateRecurringAvailability = useUpdateRecurringAvailability();
  const deleteRecurringAvailability = useDeleteRecurringAvailability();
  const generateSlots = useGenerateSlots();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleScheduleCreated = (schedule: RecurringAvailability) => {
    setIsAddDialogOpen(false);
    onAvailabilityUpdated();
  };

  const handleToggleSchedule = (scheduleId: string, isActive: boolean) => {
    updateRecurringAvailability.mutate(
      { id: scheduleId, data: { is_active: !isActive } },
      {
        onSuccess: () => {
          onAvailabilityUpdated();
        },
      }
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteRecurringAvailability.mutate(scheduleId, {
      onSuccess: () => {
        onAvailabilityUpdated();
      },
    });
  };

  const handleGenerateSlots = () => {
    // Generate slots for the next 4 weeks
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    generateSlots.mutate(
      { startDate, endDate },
      {
        onSuccess: () => {
          onAvailabilityUpdated();
        },
      }
    );
  };

  const activeSchedules = recurringAvailability.filter(s => s.is_active);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Repeat className="mr-2 h-5 w-5 text-primary" />
              <Trans id="Recurring Schedules" />
            </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {activeSchedules.length > 0 && (
                                 <Button
                  variant="outline"
                  onClick={handleGenerateSlots}
                  disabled={generateSlots.isPending}
                  className="w-full sm:w-auto"
                >
                  {generateSlots.isPending ? (
                   <>
                     <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                     <Trans id="Generating..." />
                   </>
                 ) : (
                   <>
                     <Calendar className="mr-2 h-4 w-4" />
                     <Trans id="Generate Slots" />
                   </>
                 )}
               </Button>
              )}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans id="Add Schedule" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      <Trans id="Create Recurring Schedule" />
                    </DialogTitle>
                  </DialogHeader>
                  <RecurringScheduleForm 
                    onScheduleCreated={handleScheduleCreated}
                    onCancel={() => setIsAddDialogOpen(false)}
                    existingSchedules={recurringAvailability}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription>
            <Trans id="Set up weekly recurring availability patterns that automatically generate time slots" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recurringAvailability.length > 0 ? (
            <div className="space-y-3">
              {recurringAvailability.map((recurring) => (
                <div key={recurring.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="font-medium text-base sm:text-lg">
                        {DAYS[recurring.day_of_week]}
                      </span>
                      <Badge variant={recurring.is_active ? 'default' : 'secondary'} className="self-start sm:self-auto">
                        {recurring.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      {recurring.start_time} - {recurring.end_time} • {recurring.duration_minutes}min slots
                      {recurring.buffer_time_minutes > 0 && (
                        <span> • {recurring.buffer_time_minutes}min buffer</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleSchedule(recurring.id, recurring.is_active)}
                      className="flex-1 sm:flex-none"
                    >
                      {recurring.is_active ? (
                        <>
                          <Pause className="h-4 w-4 mr-2 sm:mr-0" />
                          <span className="sm:hidden">Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2 sm:mr-0" />
                          <span className="sm:hidden">Resume</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSchedule(recurring.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              {activeSchedules.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    <Trans id="Auto-Generate Time Slots" />
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    <Trans id="Generate individual time slots from your active recurring schedules for the next few weeks." />
                  </p>
                                     <Button
                     onClick={handleGenerateSlots}
                     disabled={generateSlots.isPending}
                     size="sm"
                   >
                     {generateSlots.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                        <Trans id="Generating..." />
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        <Trans id="Generate Time Slots" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Repeat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <Trans id="No Recurring Schedules" />
              </h3>
              <p className="text-gray-600 mb-6">
                <Trans id="Create recurring schedules to automatically generate time slots every week." />
              </p>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <Trans id="Create First Schedule" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      <Trans id="Create Recurring Schedule" />
                    </DialogTitle>
                  </DialogHeader>
                  <RecurringScheduleForm 
                    onScheduleCreated={handleScheduleCreated}
                    onCancel={() => setIsAddDialogOpen(false)}
                    existingSchedules={recurringAvailability}
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