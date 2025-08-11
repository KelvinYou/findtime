import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { Calendar as CalendarIcon, Clock, Share2, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { ShareSchedule } from '@/components/schedule/ShareSchedule';
import { apiClient, transformTimeSlots } from '@/services/api';
import { CreateScheduleDto } from '@zync/shared';
import { guestStorage } from '@/lib/utils';

const createScheduleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  // Guest creator info (when not authenticated)
  creatorName: z.string().min(1, 'Your name is required').max(50, 'Name must be less than 50 characters'),
  creatorEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
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

  const { isAuthenticated, user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleSchema),
  });

  // Auto-fill user info on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      // For logged-in users, auto-fill with profile info
      setValue('creatorName', user.name || user.email.split('@')[0]);
      setValue('creatorEmail', user.email);
    } else {
      // For guest users, try to load from localStorage
      const guestData = guestStorage.getGuestData();
      if (guestData) {
        setValue('creatorName', guestData.user.name);
        if (guestData.user.email) {
          setValue('creatorEmail', guestData.user.email);
        }
      }
    }
  }, [isAuthenticated, user, setValue]);

  const onSubmit = async (data: CreateScheduleFormData) => {
    if (selectedDates.length === 0) {
      toast({
        title: t`Error`,
        description: t`Please select at least one date for your schedule`,
        variant: 'destructive',
      });
      return;
    }

    if (timeSlots.length === 0) {
      toast({
        title: t`Error`,
        description: t`Please add at least one time slot for your available dates`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const createScheduleData: CreateScheduleDto = {
        title: data.title,
        description: data.description || '',
        availableSlots: transformTimeSlots(timeSlots),
        duration: 60, // Default 60 minutes - could be made configurable
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Only include guest creator info if not authenticated
        ...(isAuthenticated ? {} : {
          creatorName: data.creatorName,
          creatorEmail: data.creatorEmail || undefined,
        }),
      };

      const schedule = await apiClient.createSchedule(createScheduleData);
      setCreatedScheduleId(schedule.id);
      
      // For guest users, save their info to localStorage for future use
      if (!isAuthenticated) {
        guestStorage.saveGuestData({
          name: data.creatorName,
          email: data.creatorEmail || undefined,
        });
      }
      
      toast({
        title: t`Schedule Created`,
        description: t`Your schedule has been created successfully`,
      });

      // Show share dialog
      setShowShareDialog(true);
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast({
        title: t`Error`,
        description: error instanceof Error ? error.message : t`Failed to create schedule`,
        variant: 'destructive',
      });
    }
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
          {/* Creator Information - Always show, but disable for logged-in users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                <Trans id="Your Information" />
              </CardTitle>
              <CardDescription>
                {isAuthenticated ? (
                  <Trans id="Your account information will be used for this schedule" />
                ) : (
                  <Trans id="Let others know who created this schedule" />
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creatorName">
                  <Trans id="Your Name" />
                </Label>
                <Input
                  id="creatorName"
                  placeholder="e.g., John Doe"
                  {...register('creatorName')}
                  className={`w-full`}
                />
                {errors.creatorName && (
                  <p className="text-sm text-red-600">{errors.creatorName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creatorEmail">
                  <Trans id="Your Email (Optional)" />
                </Label>
                <Input
                  id="creatorEmail"
                  type="email"
                  placeholder="e.g., john@example.com"
                  {...register('creatorEmail')}
                  disabled={isAuthenticated}
                  className={`w-full ${isAuthenticated ? 'bg-gray-50' : ''}`}
                />
                {errors.creatorEmail && (
                  <p className="text-sm text-red-600">{errors.creatorEmail.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  {isAuthenticated ? (
                    <Trans id="Using your account email address" />
                  ) : (
                    <Trans id="Optional. Others can contact you about this schedule." />
                  )}
                </p>
              </div>
            </CardContent>
          </Card>



          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <Trans id="Schedule Details" />
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
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
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