import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: <Trans id="Smart Scheduling" />,
      description: <Trans id="Automatically find the best meeting times based on everyone's availability" />,
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: <Trans id="Calendar Integration" />,
      description: <Trans id="Seamlessly sync with your existing calendar applications" />,
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: <Trans id="Team Collaboration" />,
      description: <Trans id="Coordinate schedules across your entire team efficiently" />,
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <Trans id="Welcome to Zync" />
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            <Trans id="Find the perfect time for your meetings" />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link to={ROUTES.CREATE_SCHEDULE}>
                <Trans id="Create Schedule" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Trans id="Learn More" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            <Trans id="Features" />
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            <Trans id="Ready to optimize your scheduling?" />
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            <Trans id="Join thousands of teams who have already improved their meeting coordination" />
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <Link to={isAuthenticated ? ROUTES.CREATE_SCHEDULE : ROUTES.REGISTER}>
              <Trans id="Get Started" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 