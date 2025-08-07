import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { Calendar as CalendarIcon, Clock, Share2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { ShareSchedule } from '@/components/schedule/ShareSchedule';

const createScheduleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type CreateScheduleFormData = z.infer<typeof createScheduleSchema>;

export default function CreateSchedulePage() {
  const navigate = useNavigate();
  const { t } = useLingui();
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<Array<{date: string; slots: Array<{start: string; end: string}>}>>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [createdScheduleId, setCreatedScheduleId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleSchema),
  });

  const onSubmit = async (data: CreateScheduleFormData) => {
    if (selectedDates.length === 0) {
      toast({
        title: t`Error`,
        description: t`Please select at least one date for your schedule`,
        variant: 'destructive',
      });
      return;
    }

    // TODO: Implement API call to create schedule
    console.log('Creating schedule:', { ...data, selectedDates, timeSlots });
    
    // Simulate creating schedule and getting ID
    const scheduleId = `schedule_${Date.now()}`;
    setCreatedScheduleId(scheduleId);
    
    toast({
      title: 'Schedule Created',
      description: 'Your schedule has been created successfully',
    });

    // Show share dialog
    setShowShareDialog(true);
  };

  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="mr-3 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              <Trans id="Create New Schedule" />
            </h1>
            <p className="text-gray-600 mt-1">
              <Trans id="Set up your availability and share with others" />
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <Trans id="Basic Information" />
              </CardTitle>
              <CardDescription>
                <Trans id="Give your schedule a title and description" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  <Trans id="Schedule Title" />
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Team Meeting - Q1 Planning"
                  {...register('title')}
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  <Trans id="Description (Optional)" />
                </Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about this schedule..."
                  {...register('description')}
                  className="w-full min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <Trans id="Available Dates & Times" />
              </CardTitle>
              <CardDescription>
                <Trans id="Select the dates when you're available and set your time preferences" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                timeSlots={timeSlots}
                onTimeSlotsChange={setTimeSlots}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              className="flex-1 sm:flex-none"
            >
              <Trans id="Cancel" />
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              <Trans id="Create & Share" />
            </Button>
          </div>
        </form>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Trans id="Schedule Created Successfully!" />
            </DialogTitle>
            <DialogDescription>
              <Trans id="Your schedule is ready. Share it with others to collect their availability." />
            </DialogDescription>
          </DialogHeader>
          {createdScheduleId && (
            <ShareSchedule
              scheduleId={createdScheduleId}
              scheduleTitle={watch('title') || 'Untitled Schedule'}
              onClose={() => {
                setShowShareDialog(false);
                navigate(ROUTES.SCHEDULE.replace(':id', createdScheduleId));
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 