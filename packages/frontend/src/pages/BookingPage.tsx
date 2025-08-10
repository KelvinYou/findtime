import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { 
  Clock, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AvailabilityTimeSlot,
  BookingConfirmationResponse
} from '@zync/shared';
import { usePublicAvailability, useCreateAppointment } from '@/hooks/useApi';

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: availabilityData, isLoading } = usePublicAvailability(slug || '');
  const createAppointment = useCreateAppointment(slug || '');
  
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityTimeSlot | null>(null);
  const [bookingComplete, setBookingComplete] = useState<BookingConfirmationResponse | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSlotSelect = (slot: AvailabilityTimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !slug) return;

    const bookingData = {
      time_slot_id: selectedSlot.id,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone || undefined,
      customer_message: formData.customer_message || undefined,
    };

    createAppointment.mutate(bookingData, {
      onSuccess: (result) => {
        setBookingComplete(result);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            <Trans id="Loading booking page..." />
          </p>
        </div>
      </div>
    );
  }

  if (!availabilityData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <Trans id="Booking Page Not Found" />
          </h1>
          <p className="text-gray-600">
            <Trans id="The booking page you're looking for doesn't exist or is not available." />
          </p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Card>
            <CardContent className="text-center pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                <Trans id="Booking Confirmed!" />
              </h1>
              <p className="text-gray-600 mb-4">
                {bookingComplete.message}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">
                  <Trans id="Booking Details" />
                </h3>
                <div className="text-sm space-y-1">
                  <p><strong><Trans id="Reference" />:</strong> {bookingComplete.booking_reference}</p>
                  <p><strong><Trans id="Date" />:</strong> {bookingComplete.appointment.appointment_date}</p>
                  <p><strong><Trans id="Time" />:</strong> {bookingComplete.appointment.start_time} - {bookingComplete.appointment.end_time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                <Trans id="You'll receive a confirmation email shortly. Save your booking reference for future reference." />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { freelancer, available_slots } = availabilityData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {freelancer.business_name}
            </h1>
            {freelancer.description && (
              <p className="text-gray-600 mb-4">{freelancer.description}</p>
            )}
            {freelancer.services_offered && freelancer.services_offered.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {freelancer.services_offered.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Available Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <Trans id="Available Times" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Select a time slot that works for you" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {available_slots.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {available_slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{slot.date}</span>
                          <span className="text-sm text-gray-600">
                            {slot.start_time} - {slot.end_time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {slot.duration_minutes} minutes
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Trans id="No Available Times" />
                    </h3>
                    <p className="text-gray-600">
                      <Trans id="There are no available appointment slots at the moment. Please check back later." />
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  <Trans id="Book Appointment" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Fill in your details to confirm the booking" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSlot ? (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <Trans id="Selected time" />: {selectedSlot.date} at {selectedSlot.start_time} - {selectedSlot.end_time}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="customer_name">
                        <Trans id="Full Name" /> *
                      </Label>
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_email">
                        <Trans id="Email Address" /> *
                      </Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_phone">
                        <Trans id="Phone Number" />
                      </Label>
                      <Input
                        id="customer_phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_message">
                        <Trans id="Message" />
                      </Label>
                      <Textarea
                        id="customer_message"
                        value={formData.customer_message}
                        onChange={(e) => handleInputChange('customer_message', e.target.value)}
                        placeholder="Any additional information or questions..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                      {createAppointment.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                          <Trans id="Booking..." />
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <Trans id="Confirm Booking" />
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Trans id="Select a Time Slot" />
                    </h3>
                    <p className="text-gray-600">
                      <Trans id="Please select an available time slot to continue with your booking." />
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          {(freelancer.hourly_rate || freelancer.cancellation_policy) && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>
                  <Trans id="Additional Information" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {freelancer.hourly_rate && (
                  <div>
                    <h4 className="font-medium mb-1">
                      <Trans id="Rate" />
                    </h4>
                    <p className="text-gray-600">
                      {freelancer.currency} {freelancer.hourly_rate}/hour
                    </p>
                  </div>
                )}
                {freelancer.cancellation_policy && (
                  <div>
                    <h4 className="font-medium mb-1">
                      <Trans id="Cancellation Policy" />
                    </h4>
                    <p className="text-gray-600">{freelancer.cancellation_policy}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 