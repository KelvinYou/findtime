import { Trans } from '@lingui/react';
import { Heart, Users, Smile, Clock, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';

export function AboutPage() {
  const { isAuthenticated } = useAuth();

  const mascotReasons = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: <Trans id="Very Sociable" />,
      description: <Trans id="Otters are naturally social creatures who enjoy group activities, just like how Zync brings people together for seamless scheduling and collaboration." />,
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: <Trans id="Connected Friends" />,
      description: <Trans id="Otters sleeping hand in hand in the river symbolize friends staying connected. Zync helps your team stay connected through smart scheduling." />,
    },
    {
      icon: <Smile className="h-8 w-8 text-primary" />,
      title: <Trans id="Cute & Approachable" />,
      description: <Trans id="With their cute and approachable appearance, otters make scheduling feel friendly and welcoming, especially for young users and teams." />,
    },
  ];

  const values = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: <Trans id="Time Respect" />,
      description: <Trans id="We believe everyone's time is valuable and should be respected." />,
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: <Trans id="Connection First" />,
      description: <Trans id="Technology should bring people together, not drive them apart." />,
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: <Trans id="Simplicity" />,
      description: <Trans id="Complex problems deserve simple, elegant solutions." />,
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: <Trans id="User Focus" />,
      description: <Trans id="Every feature is designed with the user experience in mind." />,
    },
  ];

  return (
    <div className="flex-1 space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <Trans id="About Zync" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            <Trans id="We're on a mission to make scheduling as natural and connected as otters holding hands in a river." />
          </p>
        </div>
        
        {/* Otter Mascot Section */}
        <div className="relative py-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl" />
          <div className="relative text-6xl mb-4">🦦</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            <Trans id="Meet Our Otter Mascot" />
          </h2>
          <p className="text-muted-foreground">
            <Trans id="Bringing people together, one scheduling session at a time" />
          </p>
        </div>
      </section>

      {/* Why Otter Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            <Trans id="Why Choose Otter as Our Mascot?" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <Trans id="Our choice of the otter as our mascot isn't just about cuteness – it represents everything we stand for." />
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mascotReasons.map((reason, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
                  {reason.icon}
                </div>
                <CardTitle className="text-xl">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {reason.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-gradient-surface rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            <Trans id="Our Story" />
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              <Trans id="Born from the frustration of endless back-and-forth emails trying to find a time that works for everyone, Zync was created to solve the universal problem of scheduling." />
            </p>
            <p className="text-lg text-muted-foreground">
              <Trans id="Just like otters naturally come together in groups, we believe people should be able to connect and coordinate effortlessly. Our platform eliminates the chaos of scheduling and brings the joy back to meeting up." />
            </p>
            <p className="text-lg text-muted-foreground">
              <Trans id="Whether you're planning a team meeting, a family gathering, or a casual hangout with friends, Zync makes it as easy as otters floating together down a river." />
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-8xl mb-4">🦦🦦🦦</div>
            <p className="text-sm text-muted-foreground italic">
              <Trans id="Together we're stronger, just like otters" />
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            <Trans id="Our Values" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <Trans id="The principles that guide everything we do" />
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <div className="mb-4 p-3 bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-primary">
                {value.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 bg-gradient-primary rounded-3xl p-8 md:p-12 text-white">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            <Trans id="Ready to Join Our Otter Pack?" />
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            <Trans id="Experience the joy of effortless scheduling. Let's make coordination as natural as otters holding hands." />
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
            <Link to={isAuthenticated ? ROUTES.CREATE_SCHEDULE : ROUTES.REGISTER}>
              <Trans id="Get Started Free" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
            <Link to={ROUTES.HOME}>
              <Trans id="Learn More" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage; 