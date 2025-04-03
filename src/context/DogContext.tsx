
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Document type definition
export interface DogDocument {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
  date: string;
  fileType: string;
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
  addDog: (dog: Omit<Dog, 'id'>) => void;
  updateDog: (dog: Dog) => void;
  addDocumentToDog: (dogId: string, document: Omit<DogDocument, 'id'>) => void;
  removeDocumentFromDog: (dogId: string, documentId: string) => void;
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

export const DogProvider = ({ children }: { children: ReactNode }) => {
  const [dogs, setDogs] = useState<Dog[]>(initialDogs);

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

  return (
    <DogContext.Provider value={{ 
      dogs, 
      addDog, 
      updateDog, 
      addDocumentToDog, 
      removeDocumentFromDog 
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
