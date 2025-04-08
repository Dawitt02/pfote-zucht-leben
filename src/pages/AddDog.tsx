
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDogs } from '@/context/DogContext';
import DogFormWithDocuments from '@/components/DogFormWithDocuments';
import MobileContainer from '@/components/MobileContainer';

const AddDog = () => {
  const navigate = useNavigate();
  
  return (
    <MobileContainer>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/dogs')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Hund hinzufügen</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <DogFormWithDocuments mode="add" />
        </div>
      </div>
    </MobileContainer>
  );
};

export default AddDog;
