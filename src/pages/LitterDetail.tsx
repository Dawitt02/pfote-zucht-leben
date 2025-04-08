import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Dog, 
  PawPrint, 
  Clock, 
  FileText, 
  Weight, 
  Heart, 
  Baby, 
  X 
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { useDogs, Litter, Dog as DogType, BreedingEvent, Puppy } from '@/context/DogContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PuppyForm from '@/components/breeding/PuppyForm';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { calculateAge } from '@/utils/dateUtils';

const LitterDetail = () => {
  const { litterId } = useParams<{ litterId: string }>();
  const navigate = useNavigate();
  const { litters, breedingEvents, dogs, addPuppy } = useDogs();
  const [isAddPuppyDialogOpen, setIsAddPuppyDialogOpen] = useState(false);
  
  if (!litterId) {
    return <div>Wurf-ID fehlt</div>;
  }
  
  const litter = litters.find(l => l.id === litterId);
  if (!litter) {
    return (
      <div className="flex flex-col min-h-screen bg-zucht-cream">
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-4xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/breeding')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Zuchtplanung
            </Button>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Wurf nicht gefunden</h2>
                  <p className="text-muted-foreground">
                    Der gesuchte Wurf konnte nicht gefunden werden.
                  </p>
                  <Button 
                    onClick={() => navigate('/breeding')} 
                    className="mt-4"
                  >
                    Zur Zuchtübersicht
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Navbar />
      </div>
    );
  }
  
  const mother = dogs.find(d => d.id === litter.dogId);
  const relatedEvents = breedingEvents
    .filter(event => event.relatedLitterId === litterId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const birthEvent = relatedEvents.find(event => event.type === 'birth');
  
  const eventsByCategory = {
    deworming: relatedEvents.filter(e => e.type === 'deworming'),
    vaccination: relatedEvents.filter(e => e.type === 'vaccination' || e.type === 'chipping'),
    handover: relatedEvents.filter(e => e.type === 'inspection' || e.type === 'handover'),
    other: relatedEvents.filter(e => 
      !['deworming', 'vaccination', 'chipping', 'inspection', 'handover', 'birth'].includes(e.type)
    )
  };
  
  const calculateAgeInWeeks = (birthDate: Date, currentDate: Date = new Date()): number => {
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };
  
  const formatEventDate = (date: Date, birthDate?: Date): string => {
    const formatted = format(date, 'dd.MM.yyyy', { locale: de });
    
    if (birthDate) {
      const ageInWeeks = calculateAgeInWeeks(birthDate, date);
      return `${formatted} (${ageInWeeks}. Woche)`;
    }
    
    return formatted;
  };
  
  const handleAddPuppy = (puppy: Omit<Puppy, 'id' | 'litterId'>) => {
    addPuppy(litterId, puppy);
    setIsAddPuppyDialogOpen(false);
  };
  
  const puppies = litter.puppies || [];
  const totalPuppies = litter.puppyCount || puppies.length || 0;
  const males = litter.males || puppies.filter(p => p.gender === 'male').length || 0;
  const females = litter.females || puppies.filter(p => p.gender === 'female').length || 0;
  
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-hidden pb-24">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/breeding')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Zuchtplanung
            </Button>
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Wurf: {mother?.name || 'Unbekannt'}
                {litter.birthDate && (
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    ({format(new Date(litter.birthDate), 'dd.MM.yyyy', { locale: de })})
                  </span>
                )}
              </h1>
              <div className="flex gap-2">
                <Dialog open={isAddPuppyDialogOpen} onOpenChange={setIsAddPuppyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PawPrint className="h-4 w-4 mr-2" />
                      Welpe hinzufügen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Welpe hinzufügen</DialogTitle>
                      <DialogDescription>
                        Fügen Sie einen neuen Welpen zum Wurf hinzu
                      </DialogDescription>
                    </DialogHeader>
                    <PuppyForm onSubmit={handleAddPuppy} />
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Export
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full md:w-auto">
                <TabsTrigger value="overview">
                  <PawPrint className="h-4 w-4 mr-2" />
                  Übersicht
                </TabsTrigger>
                <TabsTrigger value="puppies">
                  <Dog className="h-4 w-4 mr-2" />
                  Welpen
                </TabsTrigger>
                <TabsTrigger value="schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  Termine
                </TabsTrigger>
                <TabsTrigger value="parents">
                  <Heart className="h-4 w-4 mr-2" />
                  Elterntiere
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wurfübersicht</CardTitle>
                    <CardDescription>
                      Alle wichtigen Informationen zum Wurf auf einen Blick
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Mutterhündin</h3>
                          <p className="text-lg font-medium">{mother?.name || 'Unbekannt'}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Deckrüde</h3>
                          <p className="text-lg font-medium">
                            {litter.studId 
                              ? (dogs.find(d => d.id === litter.studId)?.name || 'Unbekannt')
                              : (litter.notes?.includes('Verpaarung mit') 
                                ? litter.notes.replace('Verpaarung mit ', '') 
                                : 'Nicht angegeben')}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Deckdatum</h3>
                          <p className="text-lg font-medium">
                            {format(new Date(litter.breedingDate), 'dd.MM.yyyy', { locale: de })}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Geburtsdatum</h3>
                          <p className="text-lg font-medium">
                            {litter.birthDate 
                              ? format(new Date(litter.birthDate), 'dd.MM.yyyy', { locale: de })
                              : 'Noch nicht geboren'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Anzahl Welpen</h3>
                          <p className="text-lg font-medium">
                            {totalPuppies} Welpen 
                            {(males > 0 || females > 0) && ` (${males} Rüden, ${females} Hündinnen)`}
                          </p>
                        </div>
                        
                        {birthEvent && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Geburtsnotizen</h3>
                            <p className="text-base">
                              {birthEvent.notes || 'Keine Notizen zur Geburt'}
                            </p>
                          </div>
                        )}
                        
                        {litter.notes && litter.notes !== birthEvent?.notes && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Allgemeine Notizen</h3>
                            <p className="text-base">{litter.notes}</p>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Aktuelle Lebensphase</h3>
                          {litter.birthDate ? (
                            <div className="mt-1">
                              <Badge className="bg-zucht-blue text-white">
                                {calculateAgeInWeeks(new Date(litter.birthDate))}. Lebenswoche
                              </Badge>
                            </div>
                          ) : (
                            <p className="text-base">Noch nicht geboren</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Nächste Termine</h3>
                      
                      {litter.birthDate ? (
                        <div className="space-y-3">
                          {relatedEvents
                            .filter(event => new Date(event.date) >= new Date())
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .slice(0, 3)
                            .map(event => (
                              <div 
                                key={event.id} 
                                className="flex items-center p-3 border rounded-lg"
                                style={{ borderLeftWidth: '4px', borderLeftColor: event.color || '#8B5CF6' }}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{event.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatEventDate(new Date(event.date), new Date(litter.birthDate))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          
                          {relatedEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                            <p className="text-muted-foreground">Keine anstehenden Termine</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Termine werden nach Eintragung des Geburtsdatums angezeigt
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="puppies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Welpenübersicht</CardTitle>
                    <CardDescription>
                      Details zu den einzelnen Welpen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {puppies.length === 0 ? (
                      <div className="text-center py-10">
                        <Baby className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Keine Welpen eingetragen</h3>
                        <p className="text-muted-foreground mb-4">
                          Sie haben noch keine Welpen zu diesem Wurf hinzugefügt.
                        </p>
                        <Button 
                          onClick={() => setIsAddPuppyDialogOpen(true)}
                          className="mt-2"
                        >
                          <PawPrint className="h-4 w-4 mr-2" />
                          Welpe hinzufügen
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {puppies.map(puppy => (
                          <Card key={puppy.id} className="overflow-hidden">
                            <CardHeader className={`py-3 ${puppy.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'}`}>
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-base">
                                  {puppy.name || `Welpe ${puppy.id.slice(-2)}`}
                                </CardTitle>
                                <Badge 
                                  variant="outline" 
                                  className={puppy.gender === 'male' 
                                    ? 'border-blue-500 text-blue-500' 
                                    : 'border-pink-500 text-pink-500'}
                                >
                                  {puppy.gender === 'male' ? '♂ Rüde' : '♀ Hündin'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-4 pb-2">
                              <div className="space-y-2">
                                {puppy.color && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Farbe:</span>
                                    <span className="text-sm font-medium">{puppy.color}</span>
                                  </div>
                                )}
                                
                                {puppy.birthWeight && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Geburtsgewicht:</span>
                                    <span className="text-sm font-medium">{puppy.birthWeight} g</span>
                                  </div>
                                )}
                                
                                {puppy.chip && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Chip:</span>
                                    <span className="text-sm font-medium">{puppy.chip}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Status:</span>
                                  <Badge variant="outline" className={puppy.sold 
                                    ? 'border-red-500 text-red-500' 
                                    : 'border-green-500 text-green-500'}>
                                    {puppy.sold ? 'Reserviert/Verkauft' : 'Verfügbar'}
                                  </Badge>
                                </div>
                                
                                {puppy.newOwner && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Neuer Besitzer:</span>
                                    <span className="text-sm font-medium">{puppy.newOwner}</span>
                                  </div>
                                )}
                              </div>
                              
                              {puppy.notes && (
                                <div className="mt-3 pt-3 border-t">
                                  <span className="text-sm text-muted-foreground">Notizen:</span>
                                  <p className="text-sm mt-1">{puppy.notes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => setIsAddPuppyDialogOpen(true)}
                      className="w-full"
                    >
                      <PawPrint className="h-4 w-4 mr-2" />
                      Weiteren Welpen hinzufügen
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Terminplanung</CardTitle>
                    <CardDescription>
                      Automatisch generierte Termine für Ihren Wurf
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!litter.birthDate ? (
                      <div className="text-center py-10">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Kein Geburtsdatum eingetragen</h3>
                        <p className="text-muted-foreground">
                          Erst nach Eintragung des Geburtsdatums werden die Termine automatisch generiert.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Badge className="mr-2 bg-[#E6F7C1]">✅</Badge>
                            Entwurmungen
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Termin</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Lebenswoche</TableHead>
                                <TableHead>Notizen</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventsByCategory.deworming.length > 0 ? (
                                eventsByCategory.deworming.map(event => (
                                  <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</TableCell>
                                    <TableCell>
                                      {calculateAgeInWeeks(new Date(litter.birthDate), new Date(event.date))}. Woche
                                    </TableCell>
                                    <TableCell>{event.notes || '-'}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Keine Entwurmungstermine gefunden
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Badge className="mr-2 bg-[#D3E4FD]">💉</Badge>
                            Impfungen & Chippen
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Termin</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Lebenswoche</TableHead>
                                <TableHead>Notizen</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventsByCategory.vaccination.length > 0 ? (
                                eventsByCategory.vaccination.map(event => (
                                  <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</TableCell>
                                    <TableCell>
                                      {calculateAgeInWeeks(new Date(litter.birthDate), new Date(event.date))}. Woche
                                    </TableCell>
                                    <TableCell>{event.notes || '-'}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Keine Impftermine gefunden
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Badge className="mr-2 bg-[#F9EBD9]">📋</Badge>
                            Wurfabnahme & Welpenabgabe
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Termin</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Lebenswoche</TableHead>
                                <TableHead>Notizen</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventsByCategory.handover.length > 0 ? (
                                eventsByCategory.handover.map(event => (
                                  <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</TableCell>
                                    <TableCell>
                                      {calculateAgeInWeeks(new Date(litter.birthDate), new Date(event.date))}. Woche
                                    </TableCell>
                                    <TableCell>{event.notes || '-'}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Keine Abnahme- oder Abgabetermine gefunden
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Badge className="mr-2 bg-[#FFF2CC]">🐾</Badge>
                            Sonstige Erinnerungen
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Termin</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Lebenswoche</TableHead>
                                <TableHead>Notizen</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {eventsByCategory.other.length > 0 ? (
                                eventsByCategory.other.map(event => (
                                  <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{format(new Date(event.date), 'dd.MM.yyyy', { locale: de })}</TableCell>
                                    <TableCell>
                                      {calculateAgeInWeeks(new Date(litter.birthDate), new Date(event.date))}. Woche
                                    </TableCell>
                                    <TableCell>{event.notes || '-'}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    Keine sonstigen Termine gefunden
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="parents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Elterntiere</CardTitle>
                    <CardDescription>
                      Informationen zu den Elterntieren dieses Wurfs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Mother info */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Mutterhündin</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {mother ? (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                  {mother.imageUrl ? (
                                    <img 
                                      src={mother.imageUrl} 
                                      alt={mother.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zucht-blue text-white text-2xl">
                                      {mother.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{mother.name}</h3>
                                  <p className="text-muted-foreground">{mother.breed}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-1 text-sm text-muted-foreground">Alter:</div>
                                  <div className="col-span-2 text-sm">{calculateAge(mother.birthdate)}</div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-1 text-sm text-muted-foreground">Zuchtstatus:</div>
                                  <div className="col-span-2 text-sm">{mother.breedingStatus || 'Nicht angegeben'}</div>
                                </div>
                                
                                {mother.registrationNumber && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1 text-sm text-muted-foreground">Zuchtbuchnr.:</div>
                                    <div className="col-span-2 text-sm">{mother.registrationNumber}</div>
                                  </div>
                                )}
                                
                                {mother.chipNumber && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1 text-sm text-muted-foreground">Chipnummer:</div>
                                    <div className="col-span-2 text-sm">{mother.chipNumber}</div>
                                  </div>
                                )}
                                
                                {mother.healthStatus && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-1 text-sm text-muted-foreground">Gesundheit:</div>
                                    <div className="col-span-2 text-sm">{mother.healthStatus}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Keine Informationen zur Mutterhündin verfügbar</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Father info */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Deckrüde</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {litter.studId ? (
                            (() => {
                              const father = dogs.find(d => d.id === litter.studId);
                              if (!father) return (
                                <p className="text-muted-foreground">Keine Informationen zum Deckrüden verfügbar</p>
                              );
                              
                              return (
                                <div className="space-y-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                      {father.imageUrl ? (
                                        <img 
                                          src={father.imageUrl} 
                                          alt={father.name} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zucht-blue text-white text-2xl">
                                          {father.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg">{father.name}</h3>
                                      <p className="text-muted-foreground">{father.breed}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="col-span-1 text-sm text-muted-foreground">Alter:</div>
                                      <div className="col-span-2 text-sm">{calculateAge(father.birthdate)}</div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="col-span-1 text-sm text-muted-foreground">Zuchtstatus:</div>
                                      <div className="col-span-2 text-sm">{father.breedingStatus || 'Nicht angegeben'}</div>
                                    </div>
                                    
                                    {father.registrationNumber && (
                                      <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1 text-sm text-muted-foreground">Zuchtbuchnr.:</div>
                                        <div className="col-span-2 text-sm">{father.registrationNumber}</div>
                                      </div>
                                    )}
                                    
                                    {father.chipNumber && (
                                      <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1 text-sm text-muted-foreground">Chipnummer:</div>
                                        <div className="col-span-2 text-sm">{father.chipNumber}</div>
                                      </div>
                                    )}
                                    
                                    {father.healthStatus && (
                                      <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1 text-sm text-muted-foreground">Gesundheit:</div>
                                        <div className="col-span-2 text-sm">{father.healthStatus}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="text-muted-foreground">
                              {litter.notes?.includes('Verpaarung mit') ? (
                                <p>Externer Deckrüde: {litter.notes.replace('Verpaarung mit ', '')}</p>
                              ) : (
                                <p>Keine Informationen zum Deckrüden verfügbar</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
};

export default LitterDetail;
