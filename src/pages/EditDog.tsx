
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useDogs } from '@/context/DogContext';
import DogFormWithDocuments from '@/components/DogFormWithDocuments';
import MobileContainer from '@/components/MobileContainer';

const EditDog = () => {
  const navigate = useNavigate();
  const { dogId } = useParams<{ dogId: string }>();
  const { dogs } = useDogs();
  
  // Find the current dog to edit
  const currentDog = dogId ? dogs.find(dog => dog.id === dogId) : undefined;
  
  useEffect(() => {
    if (dogId && !currentDog) {
      toast("Hund nicht gefunden");
      navigate('/dogs');
    }
  }, [currentDog, navigate, dogId]);

  if (!currentDog) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full">
          <p>Laden...</p>
        </div>
      </MobileContainer>
    );
  }

  // Make sure currentDog with proper date is passed to avoid TypeScript errors
  const formattedDog = {
    ...currentDog,
    // Ensure birthdate is handled as Date for the form
    birthdate: typeof currentDog.birthdate === 'string' ? 
      new Date(currentDog.birthdate) : 
      currentDog.birthdate
  };

  return (
    <MobileContainer>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(`/dogs/${dogId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Hund bearbeiten</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DogFormWithDocuments initialData={formattedDog as Dog} mode="edit" />
        </div>
      </div>
    </MobileContainer>
  );
};

export default EditDog;
