import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Repeat, Plus, Trash2, Play, Pause, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api';
import { RecurringAvailability } from '@zync/shared';
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
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleScheduleCreated = (schedule: RecurringAvailability) => {
    setIsAddDialogOpen(false);
    onAvailabilityUpdated();
  };

  const handleToggleSchedule = async (scheduleId: string, isActive: boolean) => {
    try {
      await apiClient.updateRecurringAvailability(scheduleId, { is_active: !isActive });
      toast({
        title: 'Schedule Updated',
        description: `Schedule ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      onAvailabilityUpdated();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await apiClient.deleteRecurringAvailability(scheduleId);
      toast({
        title: 'Schedule Deleted',
        description: 'Recurring schedule has been removed successfully',
      });
      onAvailabilityUpdated();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete schedule',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateSlots = async () => {
    try {
      setIsGenerating(true);
      
      // Generate slots for the next 4 weeks
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const result = await apiClient.generateSlotsFromRecurring(startDate, endDate);
      toast({
        title: 'Slots Generated',
        description: `${result.created_slots} time slots have been generated from your recurring schedules`,
      });
      onAvailabilityUpdated();
    } catch (error) {
      console.error('Failed to generate slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate time slots',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const activeSchedules = recurringAvailability.filter(s => s.is_active);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Repeat className="mr-2 h-5 w-5" />
              <Trans id="Recurring Schedules" />
            </div>
            <div className="flex items-center space-x-2">
              {activeSchedules.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleGenerateSlots}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
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
                  <Button>
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
                <div key={recurring.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-lg">
                        {DAYS[recurring.day_of_week]}
                      </span>
                      <Badge variant={recurring.is_active ? 'default' : 'secondary'}>
                        {recurring.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {recurring.start_time} - {recurring.end_time} • {recurring.duration_minutes}min slots
                      {recurring.buffer_time_minutes > 0 && (
                        <span> • {recurring.buffer_time_minutes}min buffer</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleSchedule(recurring.id, recurring.is_active)}
                    >
                      {recurring.is_active ? (
                        <>
                          <Pause className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSchedule(recurring.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
                    disabled={isGenerating}
                    size="sm"
                  >
                    {isGenerating ? (
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