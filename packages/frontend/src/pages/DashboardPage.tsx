import { Trans } from '@lingui/react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  BarChart3,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Star,
  MessageSquare
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useFreelancerProfile,
  useAvailabilityStats,
  useAppointments,
  useDashboardAnalytics
} from '@/hooks/useApi';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: freelancerProfile } = useFreelancerProfile();
  const { data: stats } = useAvailabilityStats();
  const { data: appointments } = useAppointments();
  const { data: analyticsData, isLoading: analyticsLoading } = useDashboardAnalytics();

  const isGrowthPositive = analyticsData ? analyticsData.revenue.growth > 0 : false;

  if (analyticsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            <Trans id="Loading analytics..." />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            <Trans id="Dashboard" />
          </h1>
          <p className="text-gray-600 mt-1">
            <Trans id="Welcome back" />, {user?.name || user?.email}!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Activity className="w-3 h-3 mr-1" />
            <Trans id="Live" />
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Monthly Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData?.revenue.thisMonth || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {isGrowthPositive ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={isGrowthPositive ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analyticsData?.revenue.growth || 0)}%
              </span>
              <span className="ml-1">
                <Trans id="from last month" />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Total Bookings" />
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_appointments_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Trans id="This month" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Booking Rate" />
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.bookingRate.current || 0}%</div>
            <Progress value={analyticsData?.bookingRate.current || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              <Trans id="Target" />: {analyticsData?.bookingRate.target || 85}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Avg Session" />
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.avgSessionDuration || '0m'}</div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Average duration" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              <Trans id="Weekly Performance" />
            </CardTitle>
            <CardDescription>
              <Trans id="Bookings and revenue over the past week" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analyticsData?.weeklyStats || []).map((day, index) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{day.bookings} <Trans id="bookings" /></span>
                      <span>${day.revenue}</span>
                    </div>
                    <Progress value={(day.bookings / 6) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              <Trans id="Top Services" />
            </CardTitle>
            <CardDescription>
              <Trans id="Most popular services this month" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analyticsData?.topServices || []).map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.bookings} <Trans id="bookings" />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${service.revenue}</p>
                    <p className="text-sm text-muted-foreground">
                      <Trans id="revenue" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              <Trans id="Recent Appointments" />
            </CardTitle>
            <CardDescription>
              <Trans id="Latest booking activity" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_date} at {appointment.start_time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  <Trans id="No recent appointments" />
                </h3>
                <p className="text-gray-600">
                  <Trans id="Your recent bookings will appear here" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Trans id="Quick Stats" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {analyticsData?.customerSatisfaction || 0}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < Math.floor(analyticsData?.customerSatisfaction || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <Trans id="Customer Rating" />
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Trans id="Available This Week" />
                </span>
                <span className="font-medium">
                  {stats?.available_slots_this_week || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Trans id="Upcoming" />
                </span>
                <span className="font-medium">
                  {stats?.upcoming_appointments?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  <Trans id="Response Rate" />
                </span>
                <span className="font-medium">{analyticsData?.responseRate || 0}%</span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              <Trans id="View Feedback" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 