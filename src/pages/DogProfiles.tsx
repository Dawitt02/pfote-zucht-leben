
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DogCard from '@/components/DogCard';
import Navbar from '@/components/Navbar';

const DogProfiles = () => {
  // Mock data - in a real app this would come from your state management
  const dogs = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: '3 Jahre',
      gender: 'female' as const,
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Zuchttauglich',
      achievements: ['Ausstellung A']
    },
    {
      id: '2',
      name: 'Max',
      breed: 'Deutscher Schäferhund',
      age: '4 Jahre',
      gender: 'male' as const,
      imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Aktiv',
      achievements: ['Schutzhund IPO1', 'Ausstellung B']
    },
    {
      id: '3',
      name: 'Bella',
      breed: 'Labrador Retriever',
      age: '2 Jahre',
      gender: 'female' as const,
      imageUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'In Vorbereitung'
    },
    {
      id: '4',
      name: 'Rocky',
      breed: 'Boxer',
      age: '5 Jahre',
      gender: 'male' as const,
      imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Ruhend',
      achievements: ['Ausstellung C']
    }
  ];

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Meine Hunde</h1>
            <Button className="bg-zucht-amber hover:bg-zucht-amber/90" asChild>
              <Link to="/dogs/add">
                <Plus className="h-4 w-4 mr-2" /> Hinzufügen
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dogs.map(dog => (
              <DogCard key={dog.id} {...dog} className="h-full" />
            ))}
          </div>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default DogProfiles;
