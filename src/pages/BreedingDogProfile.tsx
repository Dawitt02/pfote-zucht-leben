
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays, addMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  ArrowLeft, 
  CalendarRange, 
  HeartPulse, 
  Heart, 
  Baby, 
  ChevronRight,
  AlertCircle,
  Clock,
  Award,
  FilePlus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import MobileContainer from '@/components/MobileContainer';
import { useDogs, Dog, HeatCycle, BreedingEvent, Litter } from '@/context/DogContext';
import HeatCycleForm from '@/components/breeding/HeatCycleForm';
import BreedingForm from '@/components/breeding/BreedingForm';
import BirthForm from '@/components/breeding/BirthForm';
import BreedingCalendar from '@/components/breeding/BreedingCalendar';
import DogBreedingStats from '@/components/breeding/DogBreedingStats';

const BreedingDogProfile = () => {
  const { dogId } = useParams();
  const navigate = useNavigate();
  const { dogs, heatCycles, breedingEvents, litters } = useDogs();
  const [isAddHeatDialogOpen, setIsAddHeatDialogOpen] = useState(false);
  const [isAddBreedingDialogOpen, setIsAddBreedingDialogOpen] = useState(false);
  const [isAddBirthDialogOpen, setIsAddBirthDialogOpen] = useState(false);
  const [selectedLitterId, setSelectedLitterId] = useState<string | undefined>(undefined);
  
  // Find the current dog
  const dog = dogs.find(d => d.id === dogId);
  
  // Filter data for this dog
  const dogHeatCycles = heatCycles
    .filter(cycle => cycle.dogId === dogId)
    .sort((a, b) => {
      const dateA = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
      const dateB = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();  // Sort descending (newest first)
    });

  const dogBreedingEvents = breedingEvents
    .filter(event => event.dogId === dogId)
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateA.getTime() - dateB.getTime();  // Sort ascending (oldest first)
    });
    
  const dogLitters = litters
    .filter(litter => litter.dogId === dogId)
    .sort((a, b) => {
      const dateA = a.breedingDate instanceof Date ? a.breedingDate : new Date(a.breedingDate);
      const dateB = b.breedingDate instanceof Date ? b.breedingDate : new Date(b.breedingDate);
      return dateB.getTime() - dateA.getTime();  // Sort descending (newest first)
    });

  const upcomingEvents = dogBreedingEvents
    .filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return eventDate >= new Date() || 
        differenceInDays(eventDate, new Date()) > -1;  // Include today's events
    })
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);
    
  // Calculate next expected heat cycle
  const calculateNextHeat = () => {
    if (dogHeatCycles.length === 0) return null;
    
    const lastHeatDate = dogHeatCycles[0].startDate instanceof Date 
      ? dogHeatCycles[0].startDate 
      : new Date(dogHeatCycles[0].startDate);
      
    // Calculate average cycle length if we have multiple cycles
    let cycleLength = 180; // Default to 6 months
    if (dogHeatCycles.length > 1) {
      let totalDays = 0;
      for (let i = 0; i < dogHeatCycles.length - 1; i++) {
        const currentDate = dogHeatCycles[i].startDate instanceof Date 
          ? dogHeatCycles[i].startDate 
          : new Date(dogHeatCycles[i].startDate);
        const nextDate = dogHeatCycles[i+1].startDate instanceof Date 
          ? dogHeatCycles[i+1].startDate 
          : new Date(dogHeatCycles[i+1].startDate);
        
        totalDays += Math.abs(differenceInDays(currentDate, nextDate));
      }
      cycleLength = totalDays / (dogHeatCycles.length - 1);
    }
    
    return addDays(lastHeatDate, cycleLength);
  };
  
  // Get the next expected heat date
  const nextExpectedHeat = calculateNextHeat();
  
  // Find pending births (litters without birthDate)
  const pendingBirths = dogLitters.filter(litter => !litter.birthDate);
  
  // Handle opening birth form for a specific litter
  const handleLitterBirth = (litterId: string) => {
    setSelectedLitterId(litterId);
    setIsAddBirthDialogOpen(true);
  };
  
  // Navigate back to breeding page
  const handleBackClick = () => {
    navigate('/breeding');
  };

  if (!dog) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold mb-2">Hündin nicht gefunden</h1>
          <p className="text-center mb-6">
            Die gesuchte Hündin konnte nicht gefunden werden.
          </p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Zuchtplanung
          </Button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 p-0 h-9 w-9" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{dog.name}</h1>
          
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => setIsAddHeatDialogOpen(true)}
            >
              <CalendarRange className="h-4 w-4 mr-2" />
              Läufigkeit
            </Button>
            <Button 
              size="sm" 
              className="bg-zucht-amber hover:bg-zucht-amber/90 h-9"
              onClick={() => setIsAddBreedingDialogOpen(true)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Deckakt
            </Button>
          </div>
        </div>

        {/* Dog Info Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4 flex-shrink-0">
                {dog.imageUrl ? (
                  <img 
                    src={dog.imageUrl} 
                    alt={dog.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zucht-blue text-white text-2xl">
                    {dog.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{dog.name}</h2>
                <p className="text-sm text-muted-foreground">{dog.breed}</p>
                <p className="text-sm">{dog.age}</p>
                <div className="flex items-center mt-1">
                  <Award className="h-4 w-4 text-zucht-amber mr-1" />
                  <span className="text-sm">
                    {dog.breedingStatus || 'Kein Zuchtstatus'}
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => navigate(`/dogs/${dog.id}`)}
              >
                <FilePlus className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Expected Heat and Pending Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {nextExpectedHeat && (
            <Card className="relative overflow-hidden border-l-4 border-[#FFDEE2]">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CalendarRange className="h-5 w-5 text-pink-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-sm">Nächste Läufigkeit erwartet</h3>
                    <p className="text-lg font-bold">
                      {format(nextExpectedHeat, 'dd.MM.yyyy', { locale: de })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      In {differenceInDays(nextExpectedHeat, new Date())} Tagen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingBirths.length > 0 && (
            <Card className="relative overflow-hidden border-l-4 border-[#D3E4FD]">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Baby className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-sm">Wurf erwartet</h3>
                    {pendingBirths.map((litter) => {
                      // Calculate expected birth date (60 days after breeding)
                      const breedingDate = litter.breedingDate instanceof Date 
                        ? litter.breedingDate 
                        : new Date(litter.breedingDate);
                      const expectedBirthDate = addDays(breedingDate, 60);
                      
                      return (
                        <div key={litter.id}>
                          <p className="text-lg font-bold">
                            {format(expectedBirthDate, 'dd.MM.yyyy', { locale: de })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            In {differenceInDays(expectedBirthDate, new Date())} Tagen
                          </p>
                          {litter.notes && (
                            <p className="text-xs mt-1 truncate max-w-[200px]">
                              {litter.notes}
                            </p>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => handleLitterBirth(litter.id)}
                          >
                            <Baby className="h-3 w-3 mr-1" />
                            Wurf eintragen
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="text-xs">
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="heat" className="text-xs">
              Läufigkeiten
            </TabsTrigger>
            <TabsTrigger value="breedings" className="text-xs">
              Deckakte
            </TabsTrigger>
            <TabsTrigger value="litters" className="text-xs">
              Würfe
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Overview Tab */}
            <div className="space-y-4">
              {/* Calendar Section */}
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base">Kalender</CardTitle>
                  <CardDescription>
                    Termine und wichtige Daten
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pb-4">
                  <BreedingCalendar
                    dogId={dogId}
                    onAddEvent={() => setIsAddHeatDialogOpen(true)}
                    className="h-[400px]"
                  />
                </CardContent>
              </Card>
              
              {/* Upcoming Events */}
              <Card>
                <CardHeader className="pb-1 pt-3 px-4">
                  <CardTitle className="text-sm">Anstehende Termine</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {upcomingEvents.length === 0 ? (
                    <div className="px-4 py-3 text-center text-muted-foreground">
                      Keine anstehenden Termine
                    </div>
                  ) : (
                    <div className="divide-y">
                      {upcomingEvents.map((event) => (
                        <div 
                          key={event.id} 
                          className="flex items-center px-4 py-2 hover:bg-slate-50"
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: event.color || '#8B5CF6' }}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(
                                event.date instanceof Date ? event.date : new Date(event.date),
                                'dd.MM.yyyy',
                                { locale: de }
                              )}
                            </div>
                            {event.notes && (
                              <div className="text-xs mt-0.5 text-muted-foreground">
                                {event.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              <DogBreedingStats dogId={dogId} />
            </div>
          </TabsContent>
          
          <TabsContent value="heat">
            {/* Heat Cycles Tab */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-base">Läufigkeiten</CardTitle>
                <CardDescription>
                  Verlauf aller dokumentierten Läufigkeiten
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beginn</TableHead>
                        <TableHead>Fruchtbare Tage</TableHead>
                        <TableHead>Notizen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dogHeatCycles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                            Keine Läufigkeiten dokumentiert
                          </TableCell>
                        </TableRow>
                      ) : (
                        dogHeatCycles.map((cycle) => {
                          const startDate = cycle.startDate instanceof Date 
                            ? cycle.startDate 
                            : new Date(cycle.startDate);
                            
                          return (
                            <TableRow key={cycle.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {format(startDate, 'dd.MM.yyyy', { locale: de })}
                                </div>
                              </TableCell>
                              <TableCell>
                                {cycle.fertile ? (
                                  <div>
                                    <div>
                                      {format(
                                        cycle.fertile.startDate instanceof Date 
                                          ? cycle.fertile.startDate 
                                          : new Date(cycle.fertile.startDate),
                                        'dd.MM.',
                                        { locale: de }
                                      )}
                                      {' - '}
                                      {format(
                                        cycle.fertile.endDate instanceof Date 
                                          ? cycle.fertile.endDate 
                                          : new Date(cycle.fertile.endDate),
                                        'dd.MM.yyyy',
                                        { locale: de }
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Nicht angegeben</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {cycle.notes ? (
                                  <p className="text-sm">{cycle.notes}</p>
                                ) : (
                                  <span className="text-muted-foreground text-sm">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="p-4">
                  <Button
                    onClick={() => setIsAddHeatDialogOpen(true)}
                    className="w-full"
                  >
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Neue Läufigkeit eintragen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breedings">
            {/* Breedings Tab */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-base">Deckakte</CardTitle>
                <CardDescription>
                  Durchgeführte und geplante Deckakte
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 p-4">
                  {dogBreedingEvents
                    .filter(event => event.type === 'breeding')
                    .length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Keine Deckakte dokumentiert
                    </div>
                  ) : (
                    dogBreedingEvents
                      .filter(event => event.type === 'breeding')
                      .map(event => {
                        const eventDate = event.date instanceof Date 
                          ? event.date 
                          : new Date(event.date);
                          
                        // Find related litter if any
                        const relatedLitter = dogLitters.find(litter => {
                          const breedingDate = litter.breedingDate instanceof Date 
                            ? litter.breedingDate 
                            : new Date(litter.breedingDate);
                          
                          // Check if dates are close (within 1 day)
                          return Math.abs(differenceInDays(breedingDate, eventDate)) <= 1;
                        });
                        
                        return (
                          <Card key={event.id} className="shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-center mb-2">
                                <Heart className={`h-4 w-4 ${relatedLitter?.birthDate ? 'text-green-500' : 'text-zucht-amber'} mr-2`} />
                                <h3 className="font-medium">{event.title}</h3>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{format(eventDate, 'dd.MM.yyyy', { locale: de })}</span>
                                </div>
                                
                                {event.stud && (
                                  <>
                                    <div className="text-sm">
                                      <span className="font-medium">Rüde:</span> {event.stud.name}
                                    </div>
                                    
                                    {event.stud.owner && (
                                      <div className="text-sm">
                                        <span className="font-medium">Besitzer:</span> {event.stud.owner}
                                      </div>
                                    )}
                                  </>
                                )}
                                
                                {event.notes && (
                                  <div className="text-sm text-muted-foreground">
                                    {event.notes}
                                  </div>
                                )}
                                
                                {relatedLitter && (
                                  <div className="mt-2">
                                    {relatedLitter.birthDate ? (
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                        Wurf am {format(
                                          relatedLitter.birthDate instanceof Date 
                                            ? relatedLitter.birthDate 
                                            : new Date(relatedLitter.birthDate),
                                          'dd.MM.yyyy',
                                          { locale: de }
                                        )}
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        Wurf erwartet am {format(
                                          addDays(
                                            relatedLitter.breedingDate instanceof Date 
                                              ? relatedLitter.breedingDate 
                                              : new Date(relatedLitter.breedingDate),
                                            60
                                          ),
                                          'dd.MM.yyyy',
                                          { locale: de }
                                        )}
                                      </Badge>
                                    )}
                                    
                                    {relatedLitter.puppyCount > 0 && (
                                      <div className="text-sm mt-1">
                                        <span className="font-medium">Welpen:</span> {relatedLitter.puppyCount}
                                        {relatedLitter.males !== undefined && relatedLitter.females !== undefined && (
                                          <span className="text-muted-foreground">
                                            {' '}({relatedLitter.males}♂, {relatedLitter.females}♀)
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    
                                    {!relatedLitter.birthDate && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="mt-2 h-7 text-xs"
                                        onClick={() => handleLitterBirth(relatedLitter.id)}
                                      >
                                        <Baby className="h-3 w-3 mr-1" />
                                        Wurf eintragen
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                  )}
                  
                  <Button
                    onClick={() => setIsAddBreedingDialogOpen(true)}
                    className="w-full bg-zucht-amber hover:bg-zucht-amber/90"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Neuen Deckakt eintragen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="litters">
            {/* Litters Tab */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-base">Würfe</CardTitle>
                <CardDescription>
                  Alle Würfe und Welpen
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {dogLitters.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Keine Würfe dokumentiert
                    </div>
                  ) : (
                    dogLitters.map(litter => {
                      const breedingDate = litter.breedingDate instanceof Date 
                        ? litter.breedingDate 
                        : new Date(litter.breedingDate);
                        
                      // Find related breeding event
                      const relatedBreeding = dogBreedingEvents
                        .filter(event => event.type === 'breeding')
                        .find(event => {
                          const eventDate = event.date instanceof Date 
                            ? event.date 
                            : new Date(event.date);
                          
                          // Check if dates are close (within 1 day)
                          return Math.abs(differenceInDays(breedingDate, eventDate)) <= 1;
                        });
                        
                      return (
                        <Card key={litter.id} className="shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Baby className="h-4 w-4 text-blue-500 mr-2" />
                                <h3 className="font-medium">
                                  Wurf vom {litter.birthDate ? 
                                    format(
                                      litter.birthDate instanceof Date 
                                        ? litter.birthDate 
                                        : new Date(litter.birthDate),
                                      'dd.MM.yyyy',
                                      { locale: de }
                                    ) : 
                                    'erwartet'}
                                </h3>
                              </div>
                              
                              {litter.birthDate && litter.id && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="p-0 h-8 w-8"
                                  onClick={() => navigate(`/breeding/litter/${litter.id}`)}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Deckdatum:</span>{' '}
                                {format(breedingDate, 'dd.MM.yyyy', { locale: de })}
                                
                                {relatedBreeding?.stud && (
                                  <span className="ml-2 text-muted-foreground">
                                    mit {relatedBreeding.stud.name}
                                  </span>
                                )}
                              </div>
                              
                              {litter.birthDate ? (
                                <>
                                  <div className="text-sm">
                                    <span className="font-medium">Geburtsdatum:</span>{' '}
                                    {format(
                                      litter.birthDate instanceof Date 
                                        ? litter.birthDate 
                                        : new Date(litter.birthDate),
                                      'dd.MM.yyyy',
                                      { locale: de }
                                    )}
                                  </div>
                                  
                                  {litter.puppyCount !== undefined && (
                                    <div className="text-sm">
                                      <span className="font-medium">Welpen:</span> {litter.puppyCount}
                                      {litter.males !== undefined && litter.females !== undefined && (
                                        <span className="text-muted-foreground">
                                          {' '}({litter.males}♂, {litter.females}♀)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {litter.puppies && litter.puppies.length > 0 && (
                                    <div className="mt-2">
                                      <h4 className="text-sm font-medium mb-1">Welpen</h4>
                                      <ScrollArea className="h-24 rounded border p-2">
                                        <div className="space-y-1">
                                          {litter.puppies.map(puppy => (
                                            <div key={puppy.id} className="text-xs flex items-center">
                                              <span className={`h-2 w-2 rounded-full mr-1 ${puppy.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                              <span className="font-medium">{puppy.name || 'Unbenannt'}</span>
                                              {puppy.sold && (
                                                <Badge className="ml-2 h-4 text-[10px] bg-green-100 text-green-800 hover:bg-green-200">
                                                  Vergeben
                                                </Badge>
                                              )}
                                              {puppy.color && (
                                                <span className="ml-2 text-muted-foreground">
                                                  {puppy.color}
                                                </span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="text-sm">
                                    <span className="font-medium">Erwarteter Geburtstermin:</span>{' '}
                                    {format(addDays(breedingDate, 60), 'dd.MM.yyyy', { locale: de })}
                                    <span className="ml-2 text-muted-foreground">
                                      (in {differenceInDays(addDays(breedingDate, 60), new Date())} Tagen)
                                    </span>
                                  </div>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleLitterBirth(litter.id)}
                                  >
                                    <Baby className="h-3 w-3 mr-1" />
                                    Wurf eintragen
                                  </Button>
                                </>
                              )}
                              
                              {litter.notes && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  {litter.notes}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs for adding new records */}
      <Dialog open={isAddHeatDialogOpen} onOpenChange={setIsAddHeatDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Läufigkeit eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie eine neue Läufigkeit für {dog.name} ein
            </DialogDescription>
          </DialogHeader>
          <HeatCycleForm 
            onSubmit={() => setIsAddHeatDialogOpen(false)}
            defaultValues={{ dogId }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddBreedingDialogOpen} onOpenChange={setIsAddBreedingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deckakt eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie einen Deckakt für {dog.name} ein
            </DialogDescription>
          </DialogHeader>
          <BreedingForm 
            onSubmit={() => setIsAddBreedingDialogOpen(false)}
            preselectedDogId={dogId}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddBirthDialogOpen} onOpenChange={setIsAddBirthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wurf eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie den Wurf für {dog.name} ein
            </DialogDescription>
          </DialogHeader>
          <BirthForm 
            onSubmit={() => {
              setIsAddBirthDialogOpen(false);
              setSelectedLitterId(undefined);
            }}
            preselectedLitterId={selectedLitterId}
          />
        </DialogContent>
      </Dialog>
    </MobileContainer>
  );
};

export default BreedingDogProfile;
