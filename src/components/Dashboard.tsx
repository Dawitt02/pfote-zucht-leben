import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Bell, Plus, Dog, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DogCard from './DogCard';
import { useDogs } from '@/context/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const { dogs } = useDogs();
  const isMobile = useIsMobile();
  const myDogs = dogs.slice(0, 3);

  const upcomingEvents = [
    { id: '1', date: '15.04.2025', title: 'Tierarzttermin für Luna', type: 'health' },
    { id: '2', date: '22.04.2025', title: 'Max: Läufigkeit erwartet', type: 'breeding' },
    { id: '3', date: '05.05.2025', title: 'Hundeausstellung München', type: 'event' },
  ];

  return (
    <div className={cn("space-y-4 md:space-y-6", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Willkommen zurück!</h1>
          <p className="text-zucht-brown/70">Was möchtest du heute tun?</p>
        </div>
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <QuickAction to="/dogs/add" icon={<Plus className="h-5 w-5" />} label="Hund hinzufügen" color="amber" />
        <QuickAction to="/breeding" icon={<Calendar className="h-5 w-5" />} label="Zuchtplanung" color="blue" />
        <QuickAction to="/health" icon={<Activity className="h-5 w-5" />} label="Gesundheitscheck" color="green" />
      </div>

      <section>
        <div className="flex justify-between items-center mb-2 md:mb-3">
          <h2 className="text-lg md:text-xl font-semibold">Meine Hunde</h2>
          <Link to="/dogs" className="text-zucht-blue flex items-center text-sm font-medium">
            Alle anzeigen <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-3 px-3 md:px-0 md:-mx-0 scrollbar-hide">
          {myDogs.map(dog => (
            <div key={dog.id} className="min-w-[200px] md:min-w-[240px]">
              <DogCard {...dog} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2 md:mb-3">
          <h2 className="text-lg md:text-xl font-semibold">Anstehende Termine</h2>
          <Link to="/breeding" className="text-zucht-blue flex items-center text-sm font-medium">
            Kalender <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id} 
                className={cn(
                  "p-3 md:p-4 flex items-center border-b last:border-b-0",
                  index % 2 === 0 ? "bg-zucht-cream" : "bg-white"
                )}
              >
                <div className="mr-3 md:mr-4 min-w-10 md:min-w-14 text-center">
                  <div className="text-sm font-medium">{event.date.split('.')[0]}</div>
                  <div className="text-xs text-zucht-brown/70">{event.date.split('.')[1]}</div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                </div>
                <div className="ml-2">
                  <EventTypeIcon type={event.type} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Zuchtstatistik</h2>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <StatCard title="Aktive Zuchthunde" value="3" description="1 Rüde, 2 Hündinnen" />
          <StatCard title="Würfe dieses Jahr" value="2" description="12 Welpen gesamt" />
        </div>
      </section>
    </div>
  );
}

interface QuickActionProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: 'amber' | 'blue' | 'green';
}

function QuickAction({ to, icon, label, color }: QuickActionProps) {
  const colorClass = {
    amber: 'bg-zucht-amber text-white',
    blue: 'bg-zucht-blue text-white',
    green: 'bg-zucht-green text-white'
  }[color];

  return (
    <Link to={to} className="flex flex-col items-center">
      <div className={cn("rounded-full p-2 md:p-3 mb-1 md:mb-2", colorClass)}>
        {icon}
      </div>
      <span className="text-xs text-center">{label}</span>
    </Link>
  );
}

function EventTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'health':
      return <Activity className="h-4 w-4 md:h-5 md:w-5 text-zucht-green" />;
    case 'breeding':
      return <Dog className="h-4 w-4 md:h-5 md:w-5 text-zucht-amber" />;
    default:
      return <Calendar className="h-4 w-4 md:h-5 md:w-5 text-zucht-blue" />;
  }
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
        <CardTitle className="text-xs md:text-sm font-medium text-zucht-brown/70">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0">
        <p className="text-xl md:text-2xl font-bold">{value}</p>
        <p className="text-xs text-zucht-brown/70">{description}</p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
