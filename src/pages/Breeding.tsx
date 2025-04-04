import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  CalendarDays,
  Dog,
  Award,
  ChevronRight,
  PawPrint,
  Heart,
  Baby
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MobileContainer from '@/components/MobileContainer';
import BreedingCalendar from '@/components/breeding/BreedingCalendar';
import HeatCycleForm from '@/components/breeding/HeatCycleForm';
import BreedingForm from '@/components/breeding/BreedingForm';
import BirthForm from '@/components/breeding/BirthForm';
import { useDogs } from '@/context/DogContext';
import { format, addDays, isFuture, isPast, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

const Breeding = () => {
  const { dogs, heatCycles, breedingEvents, litters } = useDogs();
  const [isAddHeatDialogOpen, setIsAddHeatDialogOpen] = useState(false);
  const [isAddBreedingDialogOpen, setIsAddBreedingDialogOpen] = useState(false);
  const [isAddBirthDialogOpen, setIsAddBirthDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | undefined>(undefined);
  const [selectedLitterId, setSelectedLitterId] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();
  
  const normalizedBreedingEvents = breedingEvents.map(event => ({
    ...event,
    date: event.date instanceof Date ? event.date : new Date(event.date)
  }));
  
  const normalizedLitters = litters.map(litter => ({
    ...litter,
    breedingDate: litter.breedingDate instanceof Date ? 
      litter.breedingDate : 
      new Date(litter.breedingDate),
    birthDate: litter.birthDate ? 
      (litter.birthDate instanceof Date ? litter.birthDate : new Date(litter.birthDate)) : 
      undefined
  }));
  
  const normalizedHeatCycles = heatCycles.map(cycle => ({
    ...cycle,
    startDate: cycle.startDate instanceof Date ? cycle.startDate : new Date(cycle.startDate),
    endDate: cycle.endDate ? 
      (cycle.endDate instanceof Date ? cycle.endDate : new Date(cycle.endDate)) : 
      undefined,
    fertile: cycle.fertile ? {
      startDate: cycle.fertile.startDate instanceof Date ? 
        cycle.fertile.startDate : 
        new Date(cycle.fertile.startDate),
      endDate: cycle.fertile.endDate instanceof Date ? 
        cycle.fertile.endDate : 
        new Date(cycle.fertile.endDate)
    } : undefined
  }));
  
  const femaleDogsOnly = dogs.filter(dog => dog.gender === 'female');
  
  const lastHeatCycles = femaleDogsOnly.map(dog => {
    const dogHeatCycles = normalizedHeatCycles
      .filter(cycle => cycle.dogId === dog.id)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    
    return {
      dog,
      lastHeat: dogHeatCycles.length > 0 ? dogHeatCycles[0] : null,
      nextExpectedHeat: dogHeatCycles.length > 0 
        ? addDays(dogHeatCycles[0].startDate, 180)
        : null
    };
  });
  
  const upcomingEvents = normalizedBreedingEvents
    .filter(event => isFuture(event.date) || isToday(event.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);
  
  const recentBreedings = normalizedLitters
    .sort((a, b) => b.breedingDate.getTime() - a.breedingDate.getTime())
    .slice(0, 3); // Get the 3 most recent breedings
  
  const pendingBirths = normalizedLitters.filter(litter => !litter.birthDate);
  
  const statistics = {
    upcomingHeatCycles: lastHeatCycles.filter(
      item => item.nextExpectedHeat && isFuture(item.nextExpectedHeat)
    ).length,
    activeBreedings: pendingBirths.length
  };

  const handleDogBreeding = (dogId: string) => {
    setSelectedDogId(dogId);
    setIsAddBreedingDialogOpen(true);
  };

  const handleLitterBirth = (litterId: string) => {
    setSelectedLitterId(litterId);
    setIsAddBirthDialogOpen(true);
  };

  const QuickActionButtons = () => (
    <div className="fixed bottom-20 right-4 flex flex-col gap-3 z-40">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full bg-zucht-blue shadow-lg">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6 pt-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-2">Schnellaktionen</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => {
                  setIsAddBirthDialogOpen(true);
                }}
                className="w-full bg-zucht-blue hover:bg-zucht-blue/90"
                size="lg"
              >
                <Baby className="h-5 w-5 mr-2" />
                Wurf eintragen
              </Button>
              <Button
                onClick={() => setIsAddBreedingDialogOpen(true)}
                className="w-full bg-zucht-amber hover:bg-zucht-amber/90"
                size="lg"
              >
                <Heart className="h-5 w-5 mr-2" />
                Deckakt eintragen
              </Button>
              <Button
                onClick={() => setIsAddHeatDialogOpen(true)}
                className="w-full"
                variant="outline"
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Läufigkeit eintragen
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  return (
    <MobileContainer>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Zuchtplanung</h1>
          {!isMobile && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddBirthDialogOpen(true)}
                className="bg-zucht-blue hover:bg-zucht-blue/90"
              >
                <Baby className="h-4 w-4 mr-2" />
                Wurf eintragen
              </Button>
              <Button
                onClick={() => setIsAddBreedingDialogOpen(true)}
                className="bg-zucht-amber hover:bg-zucht-amber/90"
              >
                <Heart className="h-4 w-4 mr-2" />
                Deckakt eintragen
              </Button>
              <Button
                onClick={() => setIsAddHeatDialogOpen(true)}
                variant="outline"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Läufigkeit
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium">
                Erwartete Läufigkeiten
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0">
              <div className="text-xl font-bold">{statistics.upcomingHeatCycles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium">
                Anstehende Würfe
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0">
              <div className="text-xl font-bold">{statistics.activeBreedings}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="calendar" className="text-xs py-1.5">
              <CalendarDays className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Kalender</span>
            </TabsTrigger>
            <TabsTrigger value="dogs" className="text-xs py-1.5">
              <Dog className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Hündinnen</span>
            </TabsTrigger>
            <TabsTrigger value="litters" className="text-xs py-1.5">
              <PawPrint className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Würfe</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BreedingCalendar 
                onAddEvent={() => setIsAddHeatDialogOpen(true)}
              />
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-1 px-3 pt-3">
                    <CardTitle className="text-sm">Anstehende Termine</CardTitle>
                    <CardDescription className="text-xs">
                      Die nächsten wichtigen Ereignisse
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {upcomingEvents.length === 0 ? (
                      <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                        Keine anstehenden Termine
                      </div>
                    ) : (
                      <div className="divide-y">
                        {upcomingEvents.map((event) => {
                          const dogName = dogs.find(dog => dog.id === event.dogId)?.name || 'Unbekannt';
                          return (
                            <div 
                              key={event.id} 
                              className="flex items-center px-3 py-2 hover:bg-slate-50"
                            >
                              <div 
                                className="w-2 h-2 rounded-full mr-2" 
                                style={{ backgroundColor: event.color || '#8B5CF6' }}
                              ></div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {dogName} • {format(event.date, 'dd.MM.yyyy', { locale: de })}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 px-3 pt-3">
                    <CardTitle className="text-sm">Letzte Läufigkeiten</CardTitle>
                    <CardDescription className="text-xs">
                      Übersicht der letzten Läufigkeiten
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {lastHeatCycles.length === 0 ? (
                      <div className="px-4 py-3 text-center text-muted-foreground text-sm">
                        Keine Läufigkeitsdaten vorhanden
                      </div>
                    ) : (
                      <div className="divide-y">
                        {lastHeatCycles.map(({ dog, lastHeat, nextExpectedHeat }, index) => (
                          <div 
                            key={dog.id} 
                            className="flex items-center px-3 py-2 hover:bg-slate-50"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{dog.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {lastHeat 
                                  ? `Letzte Läufigkeit: ${format(lastHeat.startDate, 'dd.MM.yyyy', { locale: de })}`
                                  : 'Keine Läufigkeit erfasst'}
                              </div>
                              {nextExpectedHeat && (
                                <div className="text-xs text-zucht-blue mt-0.5">
                                  Nächste: {format(nextExpectedHeat, 'dd.MM.yyyy', { locale: de })}
                                </div>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dogs">
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-base">Zuchthündinnen</CardTitle>
                <CardDescription className="text-xs">
                  Verwalten Sie Ihre Zuchthündinnen
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="grid grid-cols-1 gap-3">
                  {femaleDogsOnly.map(dog => (
                    <Card key={dog.id} className="overflow-hidden">
                      <div className="flex border-l-4 border-zucht-blue p-3">
                        <div className="mr-3 flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {dog.imageUrl ? (
                              <img 
                                src={dog.imageUrl} 
                                alt={dog.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zucht-blue text-white text-lg">
                                {dog.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{dog.name}</h3>
                          <p className="text-xs text-muted-foreground">{dog.breed}</p>
                          <div className="flex items-center mt-0.5">
                            <Award className="h-3 w-3 text-zucht-amber mr-1" />
                            <span className="text-xs">{dog.breedingStatus || 'Kein Zuchtstatus'}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs" 
                              onClick={() => {
                                setSelectedDogId(dog.id);
                                setIsAddHeatDialogOpen(true);
                              }}
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Läufigkeit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs text-zucht-amber border-zucht-amber hover:bg-zucht-amber/10" 
                              onClick={() => handleDogBreeding(dog.id)}
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Deckakt
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 px-3 py-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs h-8"
                  onClick={() => setIsAddHeatDialogOpen(true)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Läufigkeit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs h-8 text-zucht-amber border-zucht-amber hover:bg-zucht-amber/10"
                  onClick={() => setIsAddBreedingDialogOpen(true)}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Deckakt
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="litters">
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-base">Wurf-Management</CardTitle>
                <CardDescription className="text-xs">
                  Verwalten Sie Ihre Würfe und Welpen
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                {recentBreedings.length > 0 ? (
                  <div className="space-y-3">
                    {pendingBirths.length > 0 && (
                      <>
                        <h3 className="text-xs font-medium">Anstehende Geburten</h3>
                        <div className="space-y-3">
                          {pendingBirths.map(litter => {
                            const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Unbekannt';
                            const expectedBirthDate = new Date(litter.breedingDate);
                            expectedBirthDate.setDate(expectedBirthDate.getDate() + 60);
                            
                            return (
                              <div key={litter.id} className="bg-white p-3 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-sm">{dogName}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      Deckdatum: {format(new Date(litter.breedingDate), 'dd.MM.yyyy', { locale: de })}
                                    </p>
                                    <p className="text-xs text-zucht-blue mt-0.5">
                                      Erwarteter Wurf: {format(expectedBirthDate, 'dd.MM.yyyy', { locale: de })}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => handleLitterBirth(litter.id)}
                                  >
                                    <Baby className="h-3 w-3 mr-1" />
                                    Geburt
                                  </Button>
                                </div>
                                {litter.notes && (
                                  <p className="text-xs mt-2 text-muted-foreground">{litter.notes}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                    
                    <h3 className="text-xs font-medium mt-4">Aktuelle Würfe</h3>
                    <div className="space-y-3">
                      {litters
                        .filter(litter => litter.birthDate)
                        .sort((a, b) => new Date(b.birthDate!).getTime() - new Date(a.birthDate!).getTime())
                        .slice(0, 3)
                        .map(litter => {
                          const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Unbekannt';
                          
                          return (
                            <div key={litter.id} className="bg-white p-3 rounded-lg border shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm">{dogName}</h4>
                                  <p className="text-xs">
                                    <span className="text-zucht-blue font-medium">
                                      {litter.puppyCount || 0} Welpen
                                    </span>
                                    {litter.males !== undefined && litter.females !== undefined ? (
                                      <span className="text-muted-foreground"> 
                                        ({litter.males} Rüden, {litter.females} Hündinnen)
                                      </span>
                                    ) : null}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Geboren am: {format(new Date(litter.birthDate!), 'dd.MM.yyyy', { locale: de })}
                                  </p>
                                </div>
                                <Link to={`/breeding/litter/${litter.id}`}>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                              {litter.notes && (
                                <p className="text-xs mt-1 text-muted-foreground">{litter.notes}</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="flex flex-col items-center">
                      <PawPrint className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-base font-medium mb-1">Keine Würfe vorhanden</h3>
                      <p className="text-xs text-muted-foreground mb-3 max-w-md">
                        Hier können Sie Informationen zu Ihren Würfen verwalten.
                      </p>
                      <Button onClick={() => setIsAddBreedingDialogOpen(true)} size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Deckakt eintragen
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {isMobile && <QuickActionButtons />}
      
      <Dialog open={isAddHeatDialogOpen} onOpenChange={setIsAddHeatDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Läufigkeit eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie die Läufigkeitsdaten einer Hündin ein
            </DialogDescription>
          </DialogHeader>
          <HeatCycleForm 
            onSubmit={() => setIsAddHeatDialogOpen(false)}
            defaultValues={selectedDogId ? { dogId: selectedDogId } : undefined}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddBreedingDialogOpen} onOpenChange={setIsAddBreedingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deckakt eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie die Daten zum Deckakt ein
            </DialogDescription>
          </DialogHeader>
          <BreedingForm 
            onSubmit={() => {
              setIsAddBreedingDialogOpen(false);
              setSelectedDogId(undefined);
            }}
            preselectedDogId={selectedDogId}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddBirthDialogOpen} onOpenChange={setIsAddBirthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wurfdaten eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie das Geburtsdatum und die Anzahl der Welpen ein
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

export default Breeding;
