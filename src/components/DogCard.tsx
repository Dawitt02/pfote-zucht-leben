
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DogCardProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  imageUrl: string;
  breedingStatus?: string;
  achievements?: string[];
  onClick?: () => void;
  className?: string;
}

export function DogCard({
  name,
  breed,
  age,
  gender,
  imageUrl,
  breedingStatus,
  achievements = [],
  onClick,
  className
}: DogCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden card-shadow hover:shadow-lg transition-shadow duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={`${name}, a ${breed} dog`}
          className="w-full h-full object-cover" 
        />
        <div className={cn(
          "absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center",
          gender === 'male' ? "bg-zucht-blue text-white" : "bg-zucht-amber text-white"
        )}>
          {gender === 'male' ? '♂' : '♀'}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-sm text-zucht-brown/80 mb-3">{breed}</p>
        
        <div className="flex items-center gap-4 text-sm mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-zucht-blue" />
            <span>{age}</span>
          </div>
          
          {breedingStatus && (
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1 text-zucht-amber" />
              <span>{breedingStatus}</span>
            </div>
          )}
        </div>
        
        {achievements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center text-xs bg-zucht-green/10 text-zucht-green px-2 py-1 rounded-full">
                <Award className="h-3 w-3 mr-1" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DogCard;
