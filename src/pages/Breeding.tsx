
import React, { useState } from 'react';
import {
  PlusCircle,
  CalendarDays,
  Dog,
  Award,
  ChevronRight,
  PawPrint,
  Heart
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
import Navbar from '@/components/Navbar';
import BreedingCalendar from '@/components/breeding/BreedingCalendar';
import HeatCycleForm from '@/components/breeding/HeatCycleForm';
import BreedingForm from '@/components/breeding/BreedingForm';
import { useDogs } from '@/context/DogContext';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

const Breeding = () => {
  const { dogs, heatCycles, breedingEvents, litters } = useDogs();
  const [isAddHeatDialogOpen, setIsAddHeatDialogOpen] = useState(false);
  const [isAddBreedingDialogOpen, setIsAddBreedingDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | undefined>(undefined);
  
  const femaleDogsOnly = dogs.filter(dog => dog.gender === 'female');
  
  const lastHeatCycles = femaleDogsOnly.map(dog => {
    const dogHeatCycles = heatCycles
      .filter(cycle => cycle.dogId === dog.id)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    return {
      dog,
      lastHeat: dogHeatCycles.length > 0 ? dogHeatCycles[0] : null,
      nextExpectedHeat: dogHeatCycles.length > 0 
        ? addDays(new Date(dogHeatCycles[0].startDate), 180)
        : null
    };
  });
  
  const upcomingEvents = breedingEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const recentBreedings = litters
    .sort((a, b) => new Date(b.breedingDate).getTime() - new Date(a.breedingDate).getTime())
    .slice(0, 3); // Get the 3 most recent breedings
  
  const statistics = {
    totalHeatCycles: heatCycles.length,
    upcomingHeatCycles: lastHeatCycles.filter(
      item => item.nextExpectedHeat && item.nextExpectedHeat > new Date()
    ).length,
    activeFemales: femaleDogsOnly.filter(dog => 
      dog.breedingStatus === 'Zuchttauglich' || dog.breedingStatus === 'Aktiv'
    ).length,
    activeBreedings: litters.filter(litter => !litter.birthDate).length
  };

  const handleDogBreeding = (dogId: string) => {
    setSelectedDogId(dogId);
    setIsAddBreedingDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zucht-cream">
      <main className="flex-1 overflow-hidden pb-24">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Zuchtplanung</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddBreedingDialogOpen(true)}
                  className="bg-zucht-amber hover:bg-zucht-amber/90"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Deckakt eintragen
                </Button>
                <Button
                  onClick={() => setIsAddHeatDialogOpen(true)}
                  className="bg-zucht-blue hover:bg-zucht-blue/90"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Läufigkeit eintragen
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Läufigkeiten gesamt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalHeatCycles}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Erwartete Läufigkeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.upcomingHeatCycles}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aktive Zuchthündinnen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.activeFemales}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Laufende Trächtigkeiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.activeBreedings}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="calendar">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Kalender
                </TabsTrigger>
                <TabsTrigger value="dogs">
                  <Dog className="h-4 w-4 mr-2" />
                  Hündinnen
                </TabsTrigger>
                <TabsTrigger value="litters">
                  <PawPrint className="h-4 w-4 mr-2" />
                  Würfe
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BreedingCalendar 
                    onAddEvent={() => setIsAddHeatDialogOpen(true)}
                  />
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Anstehende Termine</CardTitle>
                        <CardDescription>
                          Die nächsten wichtigen Ereignisse
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {upcomingEvents.length === 0 ? (
                          <div className="px-6 py-4 text-center text-muted-foreground">
                            Keine anstehenden Termine
                          </div>
                        ) : (
                          <div className="divide-y">
                            {upcomingEvents.map((event) => {
                              const dogName = dogs.find(dog => dog.id === event.dogId)?.name || 'Unbekannt';
                              return (
                                <div 
                                  key={event.id} 
                                  className="flex items-center p-4 hover:bg-slate-50"
                                >
                                  <div 
                                    className="w-2 h-2 rounded-full mr-3" 
                                    style={{ backgroundColor: event.color || '#8B5CF6' }}
                                  ></div>
                                  <div className="flex-1">
                                    <div className="font-medium">{event.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {dogName} • {format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}
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
                      <CardHeader>
                        <CardTitle className="text-base">Letzte Läufigkeiten</CardTitle>
                        <CardDescription>
                          Übersicht der letzten Läufigkeiten Ihrer Hündinnen
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        {lastHeatCycles.length === 0 ? (
                          <div className="px-6 py-4 text-center text-muted-foreground">
                            Keine Läufigkeitsdaten vorhanden
                          </div>
                        ) : (
                          <div className="divide-y">
                            {lastHeatCycles.map(({ dog, lastHeat, nextExpectedHeat }, index) => (
                              <div 
                                key={dog.id} 
                                className="flex items-center p-4 hover:bg-slate-50"
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{dog.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {lastHeat 
                                      ? `Letzte Läufigkeit: ${format(new Date(lastHeat.startDate), 'dd.MM.yyyy', { locale: de })}`
                                      : 'Keine Läufigkeit erfasst'}
                                  </div>
                                  {nextExpectedHeat && (
                                    <div className="text-sm text-zucht-blue mt-1">
                                      Nächste erwartet: {format(nextExpectedHeat, 'dd.MM.yyyy', { locale: de })}
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
                  <CardHeader>
                    <CardTitle>Zuchthündinnen</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Zuchthündinnen und deren Zyklen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {femaleDogsOnly.map(dog => (
                        <Card key={dog.id} className="overflow-hidden">
                          <div className="flex border-l-4 border-zucht-blue p-4">
                            <div className="mr-4 flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                {dog.imageUrl ? (
                                  <img 
                                    src={dog.imageUrl} 
                                    alt={dog.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-zucht-blue text-white text-xl">
                                    {dog.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{dog.name}</h3>
                              <p className="text-sm text-muted-foreground">{dog.breed}</p>
                              <div className="flex items-center mt-1">
                                <Award className="h-4 w-4 text-zucht-amber mr-1" />
                                <span className="text-sm">{dog.breedingStatus || 'Kein Zuchtstatus'}</span>
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
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsAddHeatDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Läufigkeit eintragen
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-zucht-amber border-zucht-amber hover:bg-zucht-amber/10"
                      onClick={() => setIsAddBreedingDialogOpen(true)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Deckakt eintragen
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="litters">
                <Card>
                  <CardHeader>
                    <CardTitle>Wurf-Management</CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Würfe und Welpen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentBreedings.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Aktuelle Verpaarungen</h3>
                        <div className="space-y-3">
                          {recentBreedings.map(litter => {
                            const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Unbekannt';
                            const expectedBirthDate = new Date(litter.breedingDate);
                            expectedBirthDate.setDate(expectedBirthDate.getDate() + 60);
                            
                            return (
                              <div key={litter.id} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{dogName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Deckdatum: {format(new Date(litter.breedingDate), 'dd.MM.yyyy', { locale: de })}
                                    </p>
                                    <p className="text-sm text-zucht-blue mt-1">
                                      Erwarteter Wurf: {format(expectedBirthDate, 'dd.MM.yyyy', { locale: de })}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                                {litter.notes && (
                                  <p className="text-sm mt-2 text-muted-foreground">{litter.notes}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="flex flex-col items-center">
                          <PawPrint className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Keine Würfe vorhanden</h3>
                          <p className="text-muted-foreground mb-4 max-w-md">
                            Hier können Sie Informationen zu Ihren Würfen verwalten, sobald eine Ihrer Hündinnen trächtig ist.
                          </p>
                          <Button onClick={() => setIsAddBreedingDialogOpen(true)}>
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
        </ScrollArea>
      </main>
      
      <Dialog open={isAddHeatDialogOpen} onOpenChange={setIsAddHeatDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Läufigkeit eintragen</DialogTitle>
            <DialogDescription>
              Tragen Sie die Läufigkeitsdaten einer Hündin ein, um den Deckzeitpunkt zu berechnen
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
              Tragen Sie die Daten zum Deckakt ein. Der erwartete Geburtstermin wird automatisch 60 Tage später angesetzt.
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

      <Navbar />
    </div>
  );
};

export default Breeding;
