import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';
import { Plus, Calendar, Clock, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          <Trans id="Dashboard" />
        </h1>
        <p className="text-gray-600">
          <Trans id="Welcome back" />, {user?.name || user?.email}!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Create New Schedule" />
            </CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link to={ROUTES.CREATE_SCHEDULE}>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                <Trans id="New Schedule" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="My Schedules" />
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Active schedules" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Trans id="Recent Activity" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Trans id="Recent responses" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schedules */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          <Trans id="Recent Schedules" />
        </h2>
        
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                <Trans id="No schedules yet" />
              </h3>
              <p className="text-gray-600 mb-4">
                <Trans id="Create your first schedule to start coordinating with others" />
              </p>
              <Link to={ROUTES.CREATE_SCHEDULE}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <Trans id="Create Schedule" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          <Trans id="Getting Started" />
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
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
                <Users className="mr-2 h-5 w-5" />
                <Trans id="Share with Others" />
              </CardTitle>
              <CardDescription>
                <Trans id="Send the schedule link to participants so they can submit their availability" />
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
} 