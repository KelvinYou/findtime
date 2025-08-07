import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans } from '@lingui/react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Users, ArrowLeft, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes';

// Mock data for demonstration
const MOCK_SCHEDULE = {
  id: 'schedule_123',
  title: 'Team Meeting - Q1 Planning',
  description: 'Let\'s plan our Q1 objectives and discuss upcoming projects. This meeting will help us align on priorities.',
  createdBy: 'John Doe',
  availableDates: [
    {
      date: '2024-02-15',
      slots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]
    },
    {
      date: '2024-02-16',
      slots: [
        { start: '10:00', end: '12:00' },
        { start: '15:00', end: '18:00' }
      ]
    },
    {
      date: '2024-02-17',
      slots: [
        { start: '09:00', end: '11:00' },
        { start: '13:00', end: '16:00' }
      ]
    }
  ],
  responses: [
    {
      name: 'Alice Johnson',
      avatar: 'AJ',
      availability: [
        { date: '2024-02-15', slots: [{ start: '09:00', end: '12:00' }] },
        { date: '2024-02-17', slots: [{ start: '13:00', end: '16:00' }] }
      ]
    },
    {
      name: 'Bob Smith',
      avatar: 'BS',
      availability: [
        { date: '2024-02-15', slots: [{ start: '14:00', end: '17:00' }] },
        { date: '2024-02-16', slots: [{ start: '10:00', end: '12:00' }] }
      ]
    }
  ]
};

const guestFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

type SelectedAvailability = {
  date: string;
  slots: Array<{ start: string; end: string; selected: boolean }>;
};

export default function ScheduleViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Guest user state
  const [isGuest, setIsGuest] = useState(true); // In real app, check authentication
  const [guestName, setGuestName] = useState('');
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  
  // Availability selection state
  const [selectedAvailability, setSelectedAvailability] = useState<SelectedAvailability[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerGuest,
    handleSubmit: handleGuestSubmit,
    formState: { errors: guestErrors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
  });

  // Initialize selected availability from mock data
  useEffect(() => {
    const initialAvailability = MOCK_SCHEDULE.availableDates.map(dateItem => ({
      date: dateItem.date,
      slots: dateItem.slots.map(slot => ({ ...slot, selected: false }))
    }));
    setSelectedAvailability(initialAvailability);
  }, []);

  const handleGuestNameSubmit = (data: GuestFormData) => {
    setGuestName(data.name);
    setHasSubmittedName(true);
  };

  const handleSlotToggle = (date: string, slotIndex: number) => {
    setSelectedAvailability(prev => 
      prev.map(dateItem => 
        dateItem.date === date 
          ? {
              ...dateItem,
              slots: dateItem.slots.map((slot, index) => 
                index === slotIndex 
                  ? { ...slot, selected: !slot.selected }
                  : slot
              )
            }
          : dateItem
      )
    );
  };

  const handleSubmitAvailability = async () => {
    const selectedSlots = selectedAvailability
      .map(dateItem => ({
        date: dateItem.date,
        slots: dateItem.slots.filter(slot => slot.selected).map(({ start, end }) => ({ start, end }))
      }))
      .filter(dateItem => dateItem.slots.length > 0);

    if (selectedSlots.length === 0) {
      toast({
        title: 'No availability selected',
        description: 'Please select at least one time slot.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Submitting availability:', { name: guestName, availability: selectedSlots });
    
    toast({
      title: 'Availability Submitted',
      description: 'Thank you! Your availability has been recorded.',
    });

    setIsSubmitting(false);
    
    // In real app, might redirect or show success state
  };

  const getParticipantCount = (date: string, slot: { start: string; end: string }) => {
    return MOCK_SCHEDULE.responses.filter(response => 
      response.availability.some(avail => 
        avail.date === date && 
        avail.slots.some(respSlot => 
          respSlot.start === slot.start && respSlot.end === slot.end
        )
      )
    ).length;
  };

  const formatDateHeader = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <Trans id="Schedule Not Found" />
          </h1>
          <p className="text-gray-600 mb-4">
            <Trans id="The schedule you're looking for doesn't exist." />
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            <Trans id="Go Home" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.HOME)}
            className="mr-3 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {MOCK_SCHEDULE.title}
            </h1>
            <p className="text-gray-600 mt-1">
              <Trans id="Created by" /> {MOCK_SCHEDULE.createdBy}
            </p>
          </div>
        </div>

        {/* Description */}
        {MOCK_SCHEDULE.description && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-gray-700">{MOCK_SCHEDULE.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Guest Name Input */}
        {isGuest && !hasSubmittedName && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                <Trans id="Join as Guest" />
              </CardTitle>
              <CardDescription>
                <Trans id="Please enter your name to add your availability" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGuestSubmit(handleGuestNameSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-name">
                    <Trans id="Your Name" />
                  </Label>
                  <Input
                    id="guest-name"
                    placeholder="Enter your name"
                    {...registerGuest('name')}
                    className="w-full"
                  />
                  {guestErrors.name && (
                    <p className="text-sm text-red-600">{guestErrors.name.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Trans id="Continue" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Responses */}
        {MOCK_SCHEDULE.responses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <Trans id="Current Responses" /> ({MOCK_SCHEDULE.responses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {MOCK_SCHEDULE.responses.map((response, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{response.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{response.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Availability Selection */}
        {(!isGuest || hasSubmittedName) && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <Trans id="Select Your Availability" />
                  {hasSubmittedName && (
                    <Badge variant="secondary" className="ml-2">
                      {guestName}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  <Trans id="Click on the time slots when you're available" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedAvailability.map((dateItem, dateIndex) => (
                  <div key={dateIndex}>
                    <h3 className="font-medium mb-3">
                      {formatDateHeader(dateItem.date)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {dateItem.slots.map((slot, slotIndex) => {
                        const participantCount = getParticipantCount(dateItem.date, slot);
                        return (
                          <button
                            key={slotIndex}
                            type="button"
                            onClick={() => handleSlotToggle(dateItem.date, slotIndex)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              slot.selected
                                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="font-medium">
                                  {slot.start} - {slot.end}
                                </span>
                              </div>
                              {slot.selected && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            {participantCount > 0 && (
                              <div className="mt-2 flex items-center text-sm text-gray-600">
                                <Users className="h-3 w-3 mr-1" />
                                {participantCount} {participantCount === 1 ? 'person' : 'people'}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {dateIndex < selectedAvailability.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAvailability}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                <Trans id="Submit Availability" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 