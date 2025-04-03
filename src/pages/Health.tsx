
import React from 'react';
import { Search, Filter, Activity, Stethoscope, Pill, Weight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Health = () => {
  // Mock health records
  const healthRecords = [
    { 
      id: '1', 
      dog: 'Luna', 
      date: '02.04.2025', 
      type: 'checkup', 
      title: 'Jährliche Untersuchung', 
      details: 'Allgemeiner Gesundheitszustand gut, alle Impfungen aktualisiert.' 
    },
    { 
      id: '2', 
      dog: 'Max', 
      date: '28.03.2025', 
      type: 'medication', 
      title: 'Wurmkur', 
      details: 'Regelmäßige Wurmkur durchgeführt.' 
    },
    { 
      id: '3', 
      dog: 'Bella', 
      date: '15.03.2025', 
      type: 'weight', 
      title: 'Gewichtskontrolle', 
      details: '28,5 kg. Leichte Gewichtszunahme.' 
    },
    { 
      id: '4', 
      dog: 'Luna', 
      date: '10.03.2025', 
      type: 'medical', 
      title: 'Ohrenentzündung', 
      details: 'Behandlung mit Antibiotika für 7 Tage.' 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gesundheit</h1>
          </div>

          {/* Search and filter */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zucht-brown/50 h-4 w-4" />
              <Input 
                placeholder="Einträge durchsuchen" 
                className="pl-9 bg-white"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick access buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <HealthAction icon={<Activity className="h-5 w-5" />} label="Untersuchung" color="blue" />
            <HealthAction icon={<Pill className="h-5 w-5" />} label="Medikament" color="amber" />
            <HealthAction icon={<Weight className="h-5 w-5" />} label="Gewicht" color="green" />
          </div>

          {/* Health records list */}
          <h2 className="text-xl font-semibold mb-3">Gesundheitseinträge</h2>
          <div className="space-y-3">
            {healthRecords.map(record => (
              <Card key={record.id} className="overflow-hidden card-shadow">
                <CardContent className="p-0">
                  <div className="flex p-4 bg-white">
                    <div className="mr-4">
                      <HealthRecordIcon type={record.type} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{record.title}</h3>
                        <span className="text-xs text-zucht-brown/70">{record.date}</span>
                      </div>
                      <p className="text-sm text-zucht-blue font-medium mb-1">{record.dog}</p>
                      <p className="text-sm text-zucht-brown/80">{record.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

interface HealthActionProps {
  icon: React.ReactNode;
  label: string;
  color: 'amber' | 'blue' | 'green';
}

function HealthAction({ icon, label, color }: HealthActionProps) {
  const colorClass = {
    amber: 'bg-zucht-amber text-white',
    blue: 'bg-zucht-blue text-white',
    green: 'bg-zucht-green text-white'
  }[color];

  return (
    <Button className={`flex flex-col items-center h-20 ${colorClass}`}>
      <div className="mb-1">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Button>
  );
}

function HealthRecordIcon({ type }: { type: string }) {
  switch (type) {
    case 'checkup':
      return <Activity className="h-8 w-8 text-zucht-blue" />;
    case 'medication':
      return <Pill className="h-8 w-8 text-zucht-amber" />;
    case 'weight':
      return <Weight className="h-8 w-8 text-zucht-green" />;
    case 'medical':
      return <Stethoscope className="h-8 w-8 text-zucht-amber" />;
    default:
      return <Activity className="h-8 w-8 text-zucht-blue" />;
  }
}

export default Health;
