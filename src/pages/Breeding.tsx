
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Breeding = () => {
  // In a real app, you would use a date library and manage state
  const currentMonth = "April 2025";
  
  // Mock breeding events
  const breedingEvents = [
    { id: '1', date: '2025-04-10', dog: 'Luna', event: 'Läufigkeit erwartet', status: 'upcoming' },
    { id: '2', date: '2025-04-15', dog: 'Bella', event: 'Trächtigkeitsuntersuchung', status: 'important' },
    { id: '3', date: '2025-04-22', dog: 'Luna', event: 'Decktermin geplant', status: 'confirmed' },
    { id: '4', date: '2025-05-05', dog: 'Max', event: 'Zuchttauglichkeitsprüfung', status: 'upcoming' },
  ];

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Zuchtplanung</h1>
            <Button variant="outline" className="text-zucht-blue">
              <CalendarIcon className="h-4 w-4 mr-2" /> Termin
            </Button>
          </div>

          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{currentMonth}</h2>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar placeholder - in a real app this would be an interactive calendar */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                  <div key={day} className="text-xs font-medium py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  // Apply special styling to days with events
                  const hasEvent = breedingEvents.some(
                    event => parseInt(event.date.split('-')[2]) === day
                  );
                  return (
                    <div 
                      key={day} 
                      className={`p-2 rounded-full text-sm ${
                        hasEvent 
                          ? 'bg-zucht-amber/20 text-zucht-amber font-medium' 
                          : 'hover:bg-gray-100 cursor-pointer'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Breeding events list */}
          <h2 className="text-xl font-semibold mb-3">Anstehende Termine</h2>
          <div className="space-y-3">
            {breedingEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex border-l-4 pl-3 py-3 pr-4 bg-white" 
                    style={{ 
                      borderLeftColor: 
                        event.status === 'important' ? '#F9A826' : 
                        event.status === 'confirmed' ? '#2E7D32' : '#4A8FE7' 
                    }}
                  >
                    <div className="mr-4">
                      <div className="text-sm font-medium">{event.date.split('-')[2]}</div>
                      <div className="text-xs text-zucht-brown/70">{event.date.split('-')[1]}</div>
                    </div>
                    <div>
                      <p className="font-medium">{event.dog}</p>
                      <p className="text-sm text-zucht-brown/70">{event.event}</p>
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

export default Breeding;
