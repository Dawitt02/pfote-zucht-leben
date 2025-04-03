import React, { createContext, useContext, useState, ReactNode } from 'react';

// Document type definition
export interface DogDocument {
  id: string;
  name: string;
  category: string; // Added category property for document type
  fileUrl: string;
  date: string;
  fileType: string;
}

// Heat Cycle type definition
export interface HeatCycle {
  id: string;
  dogId: string;
  startDate: Date;
  endDate?: Date;
  fertile?: {
    startDate: Date;
    endDate: Date;
  };
  notes?: string;
}

// Breeding event type definition
export interface BreedingEvent {
  id: string;
  type: 'heatStart' | 'breeding' | 'ultrasound' | 'birthExpected' | 'birth' | 'deworming' | 'vaccination' | 'chipping' | 'inspection' | 'handover' | 'socialization' | 'photos' | 'paperwork' | 'reminder' | 'other';
  title: string;
  dogId: string;
  date: Date;
  notes?: string;
  color?: string;
  stud?: {
    name: string;
    owner?: string;
    breederId?: string;
  };
  relatedLitterId?: string;
}

// Litter type definition
export interface Litter {
  id: string;
  dogId: string;
  studId?: string;
  breedingDate: Date;
  birthDate?: Date;
  puppyCount?: number;
  males?: number;
  females?: number;
  notes?: string;
  puppies?: Puppy[];
}

// Puppy type definition
export interface Puppy {
  id: string;
  litterId: string;
  name?: string;
  gender: 'male' | 'female';
  color?: string;
  birthWeight?: string;
  chip?: string;
  sold?: boolean;
  newOwner?: string;
  notes?: string;
}

// Dog type definition
export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  imageUrl: string;
  breedingStatus?: string;
  achievements?: string[];
  fullName?: string;
  registrationNumber?: string;
  chipNumber?: string;
  notes?: string;
  hasStandardPhotos?: boolean;
  documents?: DogDocument[];
  
  // Additional properties needed for EditDog
  pedigree?: string;
  geneticTestResults?: string;
  inbreedingCoefficient?: string;
  healthStatus?: string;
  vaccinationHistory?: string;
  weight?: string;
  size?: string;
  cycleInformation?: string;
  breedingHistory?: string;
  litterInformation?: string;
  breedingRestrictions?: string;
  exhibitionResults?: string;
  temperamentAssessment?: string;
}

interface DogContextType {
  dogs: Dog[];
  heatCycles: HeatCycle[];
  breedingEvents: BreedingEvent[];
  litters: Litter[];
  addDog: (dog: Omit<Dog, 'id'>) => void;
  updateDog: (dog: Dog) => void;
  addDocumentToDog: (dogId: string, document: Omit<DogDocument, 'id'>) => void;
  removeDocumentFromDog: (dogId: string, documentId: string) => void;
  addHeatCycle: (heatCycle: Omit<HeatCycle, 'id'>) => HeatCycle;
  updateHeatCycle: (heatCycle: HeatCycle) => void;
  removeHeatCycle: (heatCycleId: string) => void;
  addBreedingEvent: (event: Omit<BreedingEvent, 'id'>) => BreedingEvent;
  updateBreedingEvent: (event: BreedingEvent) => void;
  removeBreedingEvent: (eventId: string) => void;
  addLitter: (litter: Omit<Litter, 'id'>) => Litter;
  updateLitter: (litter: Litter) => void;
  removeLitter: (litterId: string) => void;
  addPuppy: (litterId: string, puppy: Omit<Puppy, 'id' | 'litterId'>) => Puppy;
  updatePuppy: (puppy: Puppy) => void;
  removePuppy: (puppyId: string) => void;
  recordBirth: (litterId: string, birthDate: Date, puppyCount?: number, males?: number, females?: number, notes?: string) => void;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

// Initial dogs data
const initialDogs: Dog[] = [
  {
    id: '1',
    name: 'Luna',
    breed: 'Golden Retriever',
    age: '3 Jahre',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    breedingStatus: 'Zuchttauglich',
    achievements: ['Ausstellung A']
  },
  {
    id: '2',
    name: 'Max',
    breed: 'Deutscher Schäferhund',
    age: '4 Jahre',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    breedingStatus: 'Aktiv',
    achievements: ['Schutzhund IPO1', 'Ausstellung B']
  },
  {
    id: '3',
    name: 'Bella',
    breed: 'Labrador Retriever',
    age: '2 Jahre',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    breedingStatus: 'In Vorbereitung'
  },
  {
    id: '4',
    name: 'Rocky',
    breed: 'Boxer',
    age: '5 Jahre',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    breedingStatus: 'Ruhend',
    achievements: ['Ausstellung C']
  }
];

// Sample heat cycles
const initialHeatCycles: HeatCycle[] = [
  {
    id: '1',
    dogId: '1', // Luna
    startDate: new Date(2025, 3, 5), // April 5, 2025
    fertile: {
      startDate: new Date(2025, 3, 10), // April 10, 2025
      endDate: new Date(2025, 3, 15), // April 15, 2025
    },
    notes: 'Erster Tag der Läufigkeit notiert'
  },
  {
    id: '2',
    dogId: '3', // Bella
    startDate: new Date(2025, 3, 12), // April 12, 2025
    fertile: {
      startDate: new Date(2025, 3, 17), // April 17, 2025
      endDate: new Date(2025, 3, 22), // April 22, 2025
    },
    notes: 'Zweite Läufigkeit dieses Jahr'
  }
];

// Sample breeding events
const initialBreedingEvents: BreedingEvent[] = [
  {
    id: '1',
    type: 'heatStart',
    title: 'Läufigkeit begonnen',
    dogId: '1', // Luna
    date: new Date(2025, 3, 5), // April 5, 2025
    notes: 'Erster Tag der Läufigkeit',
    color: '#FFDEE2' // Soft Pink
  },
  {
    id: '2',
    type: 'breeding',
    title: 'Deckakt geplant',
    dogId: '1', // Luna
    date: new Date(2025, 3, 12), // April 12, 2025
    notes: 'Decktermin mit Max',
    color: '#F2FCE2', // Soft Green
    stud: {
      name: 'Max',
      owner: 'Klaus Schmidt'
    }
  },
  {
    id: '3',
    type: 'ultrasound',
    title: 'Ultraschall',
    dogId: '3', // Bella
    date: new Date(2025, 3, 15), // April 15, 2025
    notes: 'Termin beim Tierarzt',
    color: '#D3E4FD' // Soft Blue
  },
  {
    id: '4',
    type: 'birthExpected',
    title: 'Geburtstermin',
    dogId: '3', // Bella
    date: new Date(2025, 6, 10), // July 10, 2025
    notes: 'Erwarteter Geburtstermin',
    color: '#D3E4FD' // Soft Blue
  }
];

// Sample litters data
const initialLitters: Litter[] = [];

export const DogProvider = ({ children }: { children: ReactNode }) => {
  const [dogs, setDogs] = useState<Dog[]>(initialDogs);
  const [heatCycles, setHeatCycles] = useState<HeatCycle[]>(initialHeatCycles);
  const [breedingEvents, setBreedingEvents] = useState<BreedingEvent[]>(initialBreedingEvents);
  const [litters, setLitters] = useState<Litter[]>(initialLitters);

  const addDog = (newDog: Omit<Dog, 'id'>) => {
    const id = (dogs.length + 1).toString();
    setDogs(prevDogs => [...prevDogs, { id, ...newDog, documents: [] }]);
  };

  const updateDog = (updatedDog: Dog) => {
    setDogs(prevDogs => 
      prevDogs.map(dog => 
        dog.id === updatedDog.id ? updatedDog : dog
      )
    );
  };

  const addDocumentToDog = (dogId: string, document: Omit<DogDocument, 'id'>) => {
    setDogs(prevDogs => 
      prevDogs.map(dog => {
        if (dog.id === dogId) {
          const documents = dog.documents || [];
          const newDocument = {
            id: `${dogId}-doc-${documents.length + 1}`,
            ...document
          };
          return {
            ...dog,
            documents: [...documents, newDocument]
          };
        }
        return dog;
      })
    );
  };

  const removeDocumentFromDog = (dogId: string, documentId: string) => {
    setDogs(prevDogs => 
      prevDogs.map(dog => {
        if (dog.id === dogId && dog.documents) {
          return {
            ...dog,
            documents: dog.documents.filter(doc => doc.id !== documentId)
          };
        }
        return dog;
      })
    );
  };

  // Heat cycle management
  const addHeatCycle = (heatCycle: Omit<HeatCycle, 'id'>) => {
    const id = `hc-${Date.now()}`;
    const newHeatCycle = { id, ...heatCycle };
    setHeatCycles(prev => [...prev, newHeatCycle]);
    
    // Add corresponding breeding event
    addBreedingEvent({
      type: 'heatStart',
      title: 'Läufigkeit begonnen',
      dogId: heatCycle.dogId,
      date: heatCycle.startDate,
      notes: heatCycle.notes,
      color: '#FFDEE2' // Soft Pink
    });

    // Add fertile period event
    if (heatCycle.fertile) {
      addBreedingEvent({
        type: 'breeding',
        title: 'Fruchtbare Tage',
        dogId: heatCycle.dogId,
        date: heatCycle.fertile.startDate,
        notes: 'Empfohlener Deckzeitraum beginnt',
        color: '#F2FCE2' // Soft Green
      });
    }
    
    return newHeatCycle;
  };

  const updateHeatCycle = (heatCycle: HeatCycle) => {
    setHeatCycles(prev => 
      prev.map(cycle => cycle.id === heatCycle.id ? heatCycle : cycle)
    );
    
    // Update associated events
    // Find heat start event
    const heatStartEvent = breedingEvents.find(
      e => e.type === 'heatStart' && e.dogId === heatCycle.dogId
    );
    
    if (heatStartEvent) {
      updateBreedingEvent({
        ...heatStartEvent,
        date: heatCycle.startDate,
        notes: heatCycle.notes
      });
    }
  };

  const removeHeatCycle = (heatCycleId: string) => {
    // Get the cycle to be removed
    const cycleToRemove = heatCycles.find(cycle => cycle.id === heatCycleId);
    
    if (cycleToRemove) {
      // Remove associated events
      setBreedingEvents(prev => 
        prev.filter(event => 
          !(event.type === 'heatStart' && event.dogId === cycleToRemove.dogId &&
            new Date(event.date).toDateString() === new Date(cycleToRemove.startDate).toDateString())
        )
      );
    }
    
    setHeatCycles(prev => prev.filter(cycle => cycle.id !== heatCycleId));
  };

  // Breeding event management
  const addBreedingEvent = (event: Omit<BreedingEvent, 'id'>) => {
    const id = `be-${Date.now()}`;
    const newEvent = { id, ...event };
    setBreedingEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateBreedingEvent = (event: BreedingEvent) => {
    setBreedingEvents(prev => 
      prev.map(e => e.id === event.id ? event : e)
    );
  };

  const removeBreedingEvent = (eventId: string) => {
    setBreedingEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Litter management
  const addLitter = (litter: Omit<Litter, 'id'>) => {
    const id = `lit-${Date.now()}`;
    const newLitter = { id, ...litter, puppies: [] };
    setLitters(prev => [...prev, newLitter]);
    
    // Add birth expected event (now exactly 60 days after breeding date)
    if (litter.breedingDate) {
      const birthExpectedDate = new Date(litter.breedingDate);
      birthExpectedDate.setDate(birthExpectedDate.getDate() + 60); // Exactly 60 days of pregnancy
      
      // Get dog and stud names for better event display
      const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Hündin';
      const studName = litter.notes?.includes('Verpaarung mit') 
        ? litter.notes.replace('Verpaarung mit ', '') 
        : 'Rüde';
      
      addBreedingEvent({
        type: 'birthExpected',
        title: `Geburt erwartet: ${dogName}`,
        dogId: litter.dogId,
        date: birthExpectedDate,
        notes: `Erwarteter Wurf von ${dogName} und ${studName} basierend auf dem Deckdatum`,
        color: '#D3E4FD', // Soft Blue
        relatedLitterId: id
      });
    }
    
    return newLitter;
  };

  const updateLitter = (litter: Litter) => {
    setLitters(prev => 
      prev.map(l => l.id === litter.id ? litter : l)
    );
    
    // Update birth expected event if breeding date changed
    const oldLitter = litters.find(l => l.id === litter.id);
    if (oldLitter && oldLitter.breedingDate.getTime() !== litter.breedingDate.getTime()) {
      // Find the associated birthExpected event
      const birthEvent = breedingEvents.find(e => 
        e.type === 'birthExpected' && 
        e.dogId === litter.dogId && 
        // Find event that's approximately 60 days after the old breeding date
        Math.abs(e.date.getTime() - (new Date(oldLitter.breedingDate).getTime() + 60 * 24 * 60 * 60 * 1000)) < 86400000
      );
      
      if (birthEvent) {
        // Calculate new expected birth date
        const newBirthDate = new Date(litter.breedingDate);
        newBirthDate.setDate(newBirthDate.getDate() + 60);
        
        // Update the event
        updateBreedingEvent({
          ...birthEvent,
          date: newBirthDate
        });
      }
    }
  };

  const removeLitter = (litterId: string) => {
    // Find the litter to be removed
    const litterToRemove = litters.find(lit => lit.id === litterId);
    
    if (litterToRemove) {
      // Remove associated birth expected event
      const birthDate = new Date(litterToRemove.breedingDate);
      birthDate.setDate(birthDate.getDate() + 60);
      
      setBreedingEvents(prev => 
        prev.filter(event => 
          !(event.type === 'birthExpected' && event.dogId === litterToRemove.dogId &&
            new Date(event.date).toDateString() === birthDate.toDateString())
        )
      );
      
      // Also remove all events related to this litter
      setBreedingEvents(prev => 
        prev.filter(event => event.relatedLitterId !== litterId)
      );
    }
    
    setLitters(prev => prev.filter(litter => litter.id !== litterId));
  };

  // Puppy management
  const addPuppy = (litterId: string, puppy: Omit<Puppy, 'id' | 'litterId'>) => {
    const id = `pup-${Date.now()}`;
    const newPuppy = { id, litterId, ...puppy };
    
    setLitters(prev => 
      prev.map(litter => {
        if (litter.id === litterId) {
          const puppies = litter.puppies || [];
          return {
            ...litter,
            puppies: [...puppies, newPuppy]
          };
        }
        return litter;
      })
    );
    
    return newPuppy;
  };

  const updatePuppy = (puppy: Puppy) => {
    setLitters(prev => 
      prev.map(litter => {
        if (litter.id === puppy.litterId && litter.puppies) {
          return {
            ...litter,
            puppies: litter.puppies.map(p => p.id === puppy.id ? puppy : p)
          };
        }
        return litter;
      })
    );
  };

  const removePuppy = (puppyId: string) => {
    setLitters(prev => 
      prev.map(litter => {
        if (litter.puppies) {
          return {
            ...litter,
            puppies: litter.puppies.filter(p => p.id !== puppyId)
          };
        }
        return litter;
      })
    );
  };

  // New function to record birth and schedule events
  const recordBirth = (litterId: string, birthDate: Date, puppyCount?: number, males?: number, females?: number, notes?: string) => {
    // 1. Update the litter record with birth information
    const litter = litters.find(l => l.id === litterId);
    if (!litter) return;
    
    const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Hündin';
    
    const updatedLitter: Litter = {
      ...litter,
      birthDate,
      puppyCount: puppyCount || litter.puppyCount,
      males: males || litter.males,
      females: females || litter.females,
      notes: notes || litter.notes
    };
    
    updateLitter(updatedLitter);
    
    // 2. Create birth event
    addBreedingEvent({
      type: 'birth',
      title: `Geburt: ${dogName}`,
      dogId: litter.dogId,
      date: birthDate,
      notes: `Wurf von ${dogName} mit ${puppyCount || 'unbekannter Anzahl'} Welpen`,
      color: '#FFDEE2', // Soft Pink
      relatedLitterId: litterId
    });
    
    // 3. Schedule all related events
    
    // A) Deworming (Entwurmung)
    const dewormingDates = [
      { weeks: 3, title: "Erste Entwurmung" },
      { weeks: 5, title: "Zweite Entwurmung" },
      { weeks: 7, title: "Dritte Entwurmung" },
      { weeks: 11, title: "Vierte Entwurmung" }
    ];
    
    dewormingDates.forEach(({ weeks, title }) => {
      const dewormDate = new Date(birthDate);
      dewormDate.setDate(birthDate.getDate() + (weeks * 7));
      
      addBreedingEvent({
        type: 'deworming',
        title,
        dogId: litter.dogId,
        date: dewormDate,
        notes: `${title} der Welpen von ${dogName}`,
        color: '#E6F7C1', // Light Green
        relatedLitterId: litterId
      });
    });
    
    // B) Vaccinations & Chipping
    const vaccinationDates = [
      { weeks: 7.5, title: "Erste Impfung & Chippen", type: 'vaccination' },
      { weeks: 12, title: "Zweite Impfung", type: 'vaccination' },
      { weeks: 16, title: "Tollwut-Impfung", type: 'vaccination' }
    ];
    
    vaccinationDates.forEach(({ weeks, title, type }) => {
      const vaccDate = new Date(birthDate);
      vaccDate.setDate(birthDate.getDate() + Math.round(weeks * 7));
      
      addBreedingEvent({
        type: type as any,
        title,
        dogId: litter.dogId,
        date: vaccDate,
        notes: `${title} der Welpen von ${dogName}`,
        color: '#D3E4FD', // Soft Blue
        relatedLitterId: litterId
      });
    });
    
    // C) Inspection & Handover
    // Wurfabnahme
    const inspectionDate = new Date(birthDate);
    inspectionDate.setDate(birthDate.getDate() + (8 * 7));
    
    addBreedingEvent({
      type: 'inspection',
      title: "Wurfabnahme",
      dogId: litter.dogId,
      date: inspectionDate,
      notes: `Wurfabnahme durch Zuchtwart für die Welpen von ${dogName}`,
      color: '#F9EBD9', // Soft Orange
      relatedLitterId: litterId
    });
    
    // Welpenabgabe
    const handoverDate = new Date(birthDate);
    handoverDate.setDate(birthDate.getDate() + (9 * 7));
    
    addBreedingEvent({
      type: 'handover',
      title: "Welpenabgabe möglich",
      dogId: litter.dogId,
      date: handoverDate,
      notes: `Ab heute können die Welpen von ${dogName} abgegeben werden`,
      color: '#F9EBD9', // Soft Orange
      relatedLitterId: litterId
    });
    
    // D) Other reminders
    const otherReminders = [
      { weeks: 6, title: "Sozialisierungsphase beginnt", type: 'socialization', notes: "Umwelterfahrungen anbieten (Auto fahren, Geräusche, fremde Menschen)", color: '#FFF2CC' },
      { weeks: 8, title: "Welpenfotos machen", type: 'photos', notes: "Erinnerung: Welpenfotos für zukünftige Besitzer machen", color: '#FFF2CC' },
      { weeks: 9, title: "Papiere vorbereiten", type: 'paperwork', notes: "Verträge & Papiere für Welpenkäufer vorbereiten", color: '#FFF2CC' }
    ];
    
    otherReminders.forEach(({ weeks, title, type, notes, color }) => {
      const reminderDate = new Date(birthDate);
      reminderDate.setDate(birthDate.getDate() + (weeks * 7));
      
      addBreedingEvent({
        type: type as any,
        title,
        dogId: litter.dogId,
        date: reminderDate,
        notes,
        color,
        relatedLitterId: litterId
      });
    });
  };

  return (
    <DogContext.Provider value={{ 
      dogs, 
      heatCycles,
      breedingEvents,
      litters,
      addDog, 
      updateDog, 
      addDocumentToDog, 
      removeDocumentFromDog,
      addHeatCycle,
      updateHeatCycle,
      removeHeatCycle,
      addBreedingEvent,
      updateBreedingEvent,
      removeBreedingEvent,
      addLitter,
      updateLitter,
      removeLitter,
      addPuppy,
      updatePuppy,
      removePuppy,
      recordBirth
    }}>
      {children}
    </DogContext.Provider>
  );
};

export const useDogs = () => {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error('useDogs must be used within a DogProvider');
  }
  return context;
};
