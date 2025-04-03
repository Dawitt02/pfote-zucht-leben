
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dog, Calendar, Award, Camera, Plus, ArrowLeft, FileText, Activity, Save } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';
import { useDogs } from '@/context/DogContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import DogFormWithDocuments from '@/components/DogFormWithDocuments';

const EditDog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { dogs } = useDogs();
  
  // Find the current dog to edit
  const currentDog = dogs.find(dog => dog.id === id);
  
  useEffect(() => {
    if (!currentDog) {
      toast.error("Hund nicht gefunden");
      navigate('/dogs');
    }
  }, [currentDog, navigate]);

  if (!currentDog) {
    return (
      <div className="flex flex-col min-h-screen bg-zucht-cream">
        <main className="flex-1 flex items-center justify-center">
          <p>Laden...</p>
        </main>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zucht-cream">
      <main className="flex-1 overflow-hidden pb-28">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate(`/dogs/${id}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Hund bearbeiten</h1>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-32 w-32 border-2 border-gray-200">
                      {currentDog.imageUrl ? (
                        <AvatarImage src={currentDog.imageUrl} alt={currentDog.name} />
                      ) : (
                        <AvatarFallback className="bg-zucht-blue text-white text-3xl">
                          {currentDog.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-center mb-2">{currentDog.name}</h2>
                  <p className="text-gray-500 text-center mb-4">{currentDog.breed}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Dog className="text-zucht-blue mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm text-gray-500">Geschlecht</p>
                        <p className="font-medium">{currentDog.gender === 'male' ? 'Rüde' : 'Hündin'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="text-zucht-blue mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm text-gray-500">Alter</p>
                        <p className="font-medium">{currentDog.age}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="text-zucht-blue mr-3 h-5 w-5" />
                      <div>
                        <p className="text-sm text-gray-500">Zuchtstatus</p>
                        <p className="font-medium">{currentDog.breedingStatus || 'Nicht angegeben'}</p>
                      </div>
                    </div>
                    
                    {currentDog.achievements && currentDog.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="font-medium mb-2">Auszeichnungen</h3>
                        <ul className="space-y-1">
                          {currentDog.achievements.map((achievement, index) => (
                            <li key={index} className="text-sm">• {achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                  <h3 className="font-medium mb-4">Hinweis</h3>
                  <p className="text-sm text-gray-600">
                    Änderungen werden sofort nach dem Speichern übernommen und sind in der Hundeübersicht sichtbar.
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="bg-white rounded-lg shadow">
                  <DogFormWithDocuments initialData={currentDog} mode="edit" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
};

export default EditDog;
