import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDogs } from '@/context/DogContext';
import { calculateAge } from '@/utils/dateUtils';

const BreedingDogProfile = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const { dogs } = useDogs();
  
  const dog = dogs.find(dog => dog.id === dogId);

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white p-4 shadow">
        <div className="container mx-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/breeding">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Breeding
            </Link>
          </Button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-1/3">
          <div className="relative rounded-lg overflow-hidden h-64">
            <img 
              src={dog.imageUrl} 
              alt={`${dog.name}, a ${dog.breed} dog`}
              className="w-full h-full object-cover" 
            />
            <div className={`absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center ${dog.gender === 'male' ? 'bg-zucht-blue text-white' : 'bg-zucht-amber text-white'}`}>
              {dog.gender === 'male' ? '♂' : '♀'}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl md:text-3xl font-bold">{dog.name}</h1>
          <p className="text-lg text-zucht-brown/80 mb-3">{dog.breed}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
              <span>Alter: {dog ? calculateAge(dog.birthdate) : ''}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
              <span>Breeding Status: {dog.breedingStatus || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Breeding Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Health Status</h3>
            <p>{dog.healthStatus || 'No health information available'}</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Genetic Test Results</h3>
            <p>{dog.geneticTestResults || 'No genetic test results available'}</p>
          </div>
          
          {dog.gender === 'female' && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Cycle Information</h3>
              <p>{dog.cycleInformation || 'No cycle information available'}</p>
            </div>
          )}
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Breeding History</h3>
            <p>{dog.breedingHistory || 'No breeding history available'}</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Litter Information</h3>
            <p>{dog.litterInformation || 'No litter information available'}</p>
          </div>
          
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Breeding Restrictions</h3>
            <p>{dog.breedingRestrictions || 'No breeding restrictions specified'}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Performance & Character</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Exhibition Results</h3>
              <p>{dog.exhibitionResults || 'No exhibition results available'}</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Temperament Assessment</h3>
              <p>{dog.temperamentAssessment || 'No temperament assessment available'}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Notes</h2>
          <div className="bg-white p-4 rounded shadow">
            <p>{dog.notes || 'No additional notes'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedingDogProfile;
