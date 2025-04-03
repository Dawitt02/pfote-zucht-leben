
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, isSameDay, isSameMonth, isWithinInterval } from 'date-fns';
import { de } from 'date-fns/locale';
import { DayContent, DayContentProps } from 'react-day-picker';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDogs, BreedingEvent, HeatCycle } from '@/context/DogContext';

interface BreedingCalendarProps {
  onSelectDate?: (date: Date) => void;
  onAddEvent?: () => void;
}

const BreedingCalendar = ({ onSelectDate, onAddEvent }: BreedingCalendarProps) => {
  const { breedingEvents, heatCycles, dogs } = useDogs();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get events for the current month
  const eventsInCurrentMonth = breedingEvents.filter(event => 
    isSameMonth(new Date(event.date), currentMonth)
  );

  // Get fertility periods for visual marking on calendar
  const fertilityPeriods = heatCycles
    .filter(cycle => cycle.fertile)
    .map(cycle => ({
      start: cycle.fertile!.startDate,
      end: cycle.fertile!.endDate,
      dogId: cycle.dogId
    }));

  // Custom day render function to mark days with events
  const renderDay = (props: DayContentProps) => {
    const day = props.date;
    
    // Check if there are events on this day
    const hasEvent = eventsInCurrentMonth.some(event => 
      isSameDay(new Date(event.date), day)
    );

    // Check if this day is in a fertility period
    const isFertileDay = fertilityPeriods.some(period => 
      isWithinInterval(day, { start: new Date(period.start), end: new Date(period.end) })
    );

    // Check if this day is a heat start
    const isHeatStartDay = breedingEvents.some(event => 
      event.type === 'heatStart' && isSameDay(new Date(event.date), day)
    );

    // Check if this day is expected birth
    const isBirthDay = breedingEvents.some(event => 
      event.type === 'birthExpected' && isSameDay(new Date(event.date), day)
    );
    
    // Determine the styling based on event types
    let dayClassName = '';
    let dotColor = '';
    
    if (isHeatStartDay) {
      dayClassName = 'bg-rose-100';
      dotColor = 'bg-rose-500';
    } else if (isFertileDay) {
      dayClassName = 'bg-green-100';
      dotColor = 'bg-green-500';
    } else if (isBirthDay) {
      dayClassName = 'bg-blue-100';
      dotColor = 'bg-blue-500';
    } else if (hasEvent) {
      dotColor = 'bg-purple-500';
    }

    return (
      <div 
        className={cn(
          "h-9 w-9 p-0 font-normal relative flex items-center justify-center",
          dayClassName
        )}
        {...props}
      >
        <div>{format(day, 'd')}</div>
        {hasEvent && (
          <div 
            className={cn(
              "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
              dotColor
            )}
          />
        )}
      </div>
    );
  };

  // Filter events for the selected date
  const selectedDayEvents = selectedDate 
    ? breedingEvents
        .filter(event => isSameDay(new Date(event.date), selectedDate))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // Get dog names for display
  const getDogName = (dogId: string) => {
    return dogs.find(dog => dog.id === dogId)?.name || 'Unbekannter Hund';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Zuchtkalender</h2>
            <Button 
              variant="outline"
              size="sm"
              onClick={onAddEvent}
              className="text-zucht-blue"
            >
              <Plus className="h-4 w-4 mr-1" /> Läufigkeit
            </Button>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              if (date && onSelectDate) {
                onSelectDate(date);
              }
            }}
            onMonthChange={setCurrentMonth}
            locale={de}
            components={{
              DayContent: renderDay
            }}
            className="rounded-md border"
          />
          
          <div className="flex justify-between mt-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-rose-500 mr-1"></div>
              <span>Läufigkeitsbeginn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Fruchtbare Tage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Geburt erwartet</span>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && selectedDayEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Ereignisse am {format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
            </CardTitle>
            <CardDescription>
              {selectedDayEvents.length} Ereignis{selectedDayEvents.length !== 1 ? 'se' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-md border-l-4" 
                  style={{ borderLeftColor: event.color || '#8B5CF6' }}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {getDogName(event.dogId)}
                  </div>
                  {event.notes && (
                    <div className="text-sm mt-1">{event.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreedingCalendar;
