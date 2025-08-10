import { useState, useEffect } from 'react';
import { Trans } from '@lingui/react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Settings, 
  BarChart3, 
  Users,
  ExternalLink,
  Repeat,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api';
import { 
  FreelancerProfile, 
  FreelancerAvailabilityResponse, 
  AvailabilityStats,
  RecurringAvailability,
  AvailabilityTimeSlot,
  Appointment
} from '@zync/shared';
import { FreelancerProfileSetup } from '@/components/availability/FreelancerProfileSetup';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';
import { RecurringAvailabilityManager } from '@/components/availability/RecurringAvailabilityManager';
import { AppointmentsList } from '@/components/availability/AppointmentsList';

export function AvailabilityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [availability, setAvailability] = useState<FreelancerAvailabilityResponse | null>(null);
  const [stats, setStats] = useState<AvailabilityStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Try to load freelancer profile
      let profile: FreelancerProfile | null = null;
      try {
        profile = await apiClient.getFreelancerProfile();
        setFreelancerProfile(profile);
      } catch (error) {
        // Profile doesn't exist yet
        setFreelancerProfile(null);
        setIsLoading(false);
        return;
      }

      // If profile exists, load other data
      const [availabilityData, statsData, appointmentsData] = await Promise.all([
        apiClient.getAvailability(),
        apiClient.getAvailabilityStats(),
        apiClient.getAppointments()
      ]);

      setAvailability(availabilityData);
      setStats(statsData);
      setAppointments(appointmentsData);
      
    } catch (error) {
      console.error('Failed to load availability data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCreated = (profile: FreelancerProfile) => {
    setFreelancerProfile(profile);
    loadData(); // Reload all data
  };

  const handleAvailabilityUpdated = () => {
    loadData(); // Reload data when availability changes
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            <Trans id="Loading availability..." />
          </p>
        </div>
      </div>
    );
  }

  // Show profile setup if no profile exists
  if (!freelancerProfile) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              <Trans id="Set Up Your Booking Page" />
            </h1>
            <p className="text-muted-foreground mt-2">
              <Trans id="Create your freelancer profile to start accepting bookings" />
            </p>
          </div>
          <FreelancerProfileSetup onProfileCreated={handleProfileCreated} />
        </div>
      </div>
    );
  }

  const bookingUrl = `${window.location.origin}/book/${freelancerProfile.booking_url_slug}`;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <Trans id="Availability Management" />
          </h1>
          <p className="text-muted-foreground">
            <Trans id="Manage your schedule and bookings" />
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              <Trans id="View Booking Page" />
            </a>
          </Button>
          <Button onClick={() => setActiveTab('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <Trans id="Settings" />
          </Button>
        </div>
      </div>

      {/* Profile Status Alert */}
      {!freelancerProfile.is_public && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <Trans id="Your booking page is currently private. Enable it in settings to accept bookings." />
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans id="Available This Week" />
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.available_slots_this_week}</div>
              <p className="text-xs text-muted-foreground">
                <Trans id="out of" /> {stats.total_slots_this_week} <Trans id="total slots" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans id="Bookings This Week" />
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.booked_slots_this_week}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_slots_this_week > 0 
                  ? `${Math.round((stats.booked_slots_this_week / stats.total_slots_this_week) * 100)}%`
                  : '0%'
                } <Trans id="booking rate" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans id="This Month" />
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_appointments_this_month}</div>
              <p className="text-xs text-muted-foreground">
                <Trans id="appointments" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Trans id="Upcoming" />
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming_appointments.length}</div>
              <p className="text-xs text-muted-foreground">
                <Trans id="appointments" />
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Trans id="Overview" />
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Trans id="Calendar" />
          </TabsTrigger>
          <TabsTrigger value="recurring">
            <Trans id="Recurring Schedule" />
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Trans id="Appointments" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Trans id="Settings" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Trans id="Quick Actions" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Common tasks to manage your availability" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('calendar')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <Trans id="Add Available Times" />
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('recurring')}
                >
                  <Repeat className="mr-2 h-4 w-4" />
                  <Trans id="Set Recurring Schedule" />
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  asChild
                >
                  <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <Trans id="Preview Booking Page" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Trans id="Recent Appointments" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Latest booking activity" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.upcoming_appointments && stats.upcoming_appointments.length > 0 ? (
                  <div className="space-y-3">
                    {stats.upcoming_appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{appointment.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.appointment_date} at {appointment.start_time}
                          </p>
                        </div>
                        <Badge variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="link" 
                      className="w-full p-0"
                      onClick={() => setActiveTab('appointments')}
                    >
                      <Trans id="View all appointments" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Trans id="No appointments yet" />
                    </h3>
                    <p className="text-gray-600 mb-4">
                      <Trans id="Share your booking page to start receiving appointments" />
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <AvailabilityCalendar 
            availability={availability}
            onAvailabilityUpdated={handleAvailabilityUpdated}
          />
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringAvailabilityManager 
            recurringAvailability={availability?.recurring_availability || []}
            onAvailabilityUpdated={handleAvailabilityUpdated}
          />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsList 
            appointments={appointments}
            onAppointmentUpdated={handleAvailabilityUpdated}
          />
        </TabsContent>

        <TabsContent value="settings">
          <FreelancerProfileSetup 
            existingProfile={freelancerProfile}
            onProfileCreated={handleProfileCreated}
            isEditing={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 