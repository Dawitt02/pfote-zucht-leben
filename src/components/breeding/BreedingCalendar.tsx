
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDogs } from '@/context/DogContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface BreedingCalendarProps {
  onAddEvent?: () => void;
  className?: string;
  dogId?: string; // Make dogId optional
}

const BreedingCalendar: React.FC<BreedingCalendarProps> = ({ onAddEvent, className, dogId }) => {
  const { breedingEvents, heatCycles } = useDogs();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const locales = {
    'de': de,
  };
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: de }),
    getDay,
    locales,
  });
  
  // Filter events by dogId if it's provided
  const filteredEvents = dogId 
    ? breedingEvents.filter(event => event.dogId === dogId)
    : breedingEvents;
    
  // Convert breeding events to calendar events
  const calendarEvents = filteredEvents.map(event => {
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    
    return {
      id: event.id,
      title: event.title,
      start: eventDate,
      end: eventDate,
      allDay: true,
      resource: {
        ...event,
        color: event.color || '#8B5CF6'
      }
    };
  });
  
  // Custom event style
  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.resource.color,
      borderRadius: '0.25rem',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
      fontWeight: 500
    };
    return {
      style
    };
  };
  
  // Limit toolbar to just the header and navigation
  const CustomToolbar = (toolbarProps: any) => (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbarProps.onNavigate('PREV')}>
          zurück
        </button>
        <button 
          type="button" 
          onClick={() => { 
            const today = new Date(); 
            setCurrentDate(today);
            toolbarProps.onNavigate('TODAY', today);
          }}
        >
          heute
        </button>
        <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')}>
          vor
        </button>
      </span>
      <span className="rbc-toolbar-label">{toolbarProps.label}</span>
      {onAddEvent && (
        <Button size="sm" variant="outline" onClick={onAddEvent}>
          <CalendarPlus className="h-4 w-4 mr-1" />
          Event
        </Button>
      )}
    </div>
  );
  
  return (
    <div className={`breeding-calendar ${className || ''}`}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 450 }}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        culture="de"
        components={{
          toolbar: CustomToolbar
        }}
        messages={{
          today: 'Heute',
          previous: 'Zurück',
          next: 'Weiter',
          month: 'Monat',
          week: 'Woche',
          day: 'Tag',
          agenda: 'Agenda',
          date: 'Datum',
          time: 'Zeit',
          event: 'Event',
          noEventsInRange: 'Keine Termine in diesem Zeitraum'
        }}
      />
    </div>
  );
};

export default BreedingCalendar;
