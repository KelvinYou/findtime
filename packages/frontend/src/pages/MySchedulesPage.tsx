import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { Plus, Calendar, Clock, Users, Search, Filter, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { useScheduleAnalytics } from '@/hooks/useApi';

export function MySchedulesPage() {
  const { user } = useAuth();
  const { data: scheduleAnalytics, isLoading } = useScheduleAnalytics();

  const schedules = scheduleAnalytics?.recentSchedules || [];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">
            <Trans id="Loading schedules..." />
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
            <Trans id="My Schedules" />
          </h1>
          <p className="text-gray-600 mt-1">
            <Trans id="Manage and track all your scheduling activities" />
          </p>
        </div>
        <Link to={ROUTES.CREATE_SCHEDULE}>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <Trans id="Create Schedule" />
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Total Schedules" />
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduleAnalytics?.totalSchedules || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Trans id="All time" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Active Schedules" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduleAnalytics?.activeSchedules || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Currently collecting responses" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Total Participants" />
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduleAnalytics?.totalParticipants || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Across all schedules" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Response Rate" />
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scheduleAnalytics?.averageResponseRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Average response rate" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search schedules..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          <Trans id="Filter" />
        </Button>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate">
                        {schedule.title}
                      </h3>
                      <Badge variant={
                        schedule.status === 'active' ? 'default' :
                        schedule.status === 'completed' ? 'secondary' : 'destructive'
                      }>
                        {schedule.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {schedule.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {schedule.responses}/{schedule.participants} <Trans id="responses" />
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <Trans id="Created" />: {schedule.created}
                      </div>
                      {schedule.status === 'active' && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <Trans id="Deadline" />: {schedule.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Trans id="View" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trans id="Share" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Trans id="Edit" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trans id="Duplicate" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trans id="Export" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trans id="Delete" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  <Trans id="No schedules yet" />
                </h3>
                <p className="text-gray-600 mb-6">
                  <Trans id="Create your first schedule to start coordinating with others" />
                </p>
                <Link to={ROUTES.CREATE_SCHEDULE}>
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    <Trans id="Create Your First Schedule" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Getting Started Guide */}
      {schedules.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            <Trans id="Getting Started" />
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  <Trans id="Create a Schedule" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Set up time slots and invite participants to find the best meeting time" />
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  <Trans id="Share with Others" />
                </CardTitle>
                <CardDescription>
                  <Trans id="Send the schedule link to participants so they can submit their availability" />
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 