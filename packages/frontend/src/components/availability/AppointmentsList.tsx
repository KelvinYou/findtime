import { Trans } from '@lingui/react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Appointment } from '@zync/shared';

type AppointmentsListProps = {
  appointments: Appointment[];
  onAppointmentUpdated: () => void;
};

export function AppointmentsList({ appointments, onAppointmentUpdated }: AppointmentsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          <Trans id="Appointments" />
        </CardTitle>
        <CardDescription>
          <Trans id="Manage your upcoming and past appointments" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{appointment.customer_name}</h4>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'pending' ? 'secondary' :
                      appointment.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.customer_email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {appointment.appointment_date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {appointment.start_time} - {appointment.end_time}
                    </span>
                  </div>
                  {appointment.customer_message && (
                    <p className="text-sm text-gray-600 mt-2">
                      "{appointment.customer_message}"
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {appointment.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={onAppointmentUpdated}>
                        <Trans id="Confirm" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={onAppointmentUpdated}>
                        <Trans id="Cancel" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <Trans id="No Appointments" />
            </h3>
            <p className="text-gray-600">
              <Trans id="Your appointments will appear here once customers start booking." />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 