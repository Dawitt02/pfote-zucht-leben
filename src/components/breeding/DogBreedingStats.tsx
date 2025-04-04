
import React, { useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  BarChart,
  LineChart,
  Calendar as CalendarIcon,
  Percent,
  BabyIcon
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useDogs, HeatCycle } from '@/context/DogContext';

interface DogBreedingStatsProps {
  dogId: string;
}

const DogBreedingStats: React.FC<DogBreedingStatsProps> = ({ dogId }) => {
  const { heatCycles, litters } = useDogs();
  
  // Filter for this dog
  const dogHeatCycles = heatCycles.filter(cycle => cycle.dogId === dogId);
  const dogLitters = litters.filter(litter => litter.dogId === dogId);
  
  // Calculate statistics
  const stats = useMemo(() => {
    // Sort heat cycles by date (oldest first)
    const sortedCycles = [...dogHeatCycles].sort((a, b) => {
      const dateA = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
      const dateB = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Calculate average cycle length
    let averageCycleLength = 0;
    if (sortedCycles.length > 1) {
      let totalDays = 0;
      for (let i = 0; i < sortedCycles.length - 1; i++) {
        const currentDate = sortedCycles[i].startDate instanceof Date 
          ? sortedCycles[i].startDate 
          : new Date(sortedCycles[i].startDate);
        const nextDate = sortedCycles[i+1].startDate instanceof Date 
          ? sortedCycles[i+1].startDate 
          : new Date(sortedCycles[i+1].startDate);
        
        totalDays += Math.abs(differenceInDays(currentDate, nextDate));
      }
      averageCycleLength = Math.round(totalDays / (sortedCycles.length - 1));
    }
    
    // Calculate breeding success rate
    const birthLitters = dogLitters.filter(litter => litter.birthDate);
    const breedingSuccessRate = dogLitters.length > 0
      ? Math.round((birthLitters.length / dogLitters.length) * 100)
      : 0;
    
    // Calculate average litter size
    let averageLitterSize = 0;
    if (birthLitters.length > 0) {
      const totalPuppies = birthLitters.reduce((sum, litter) => sum + (litter.puppyCount || 0), 0);
      averageLitterSize = Math.round(totalPuppies / birthLitters.length * 10) / 10;
    }
    
    return {
      totalCycles: dogHeatCycles.length,
      averageCycleLength,
      totalLitters: dogLitters.length,
      completedLitters: birthLitters.length,
      breedingSuccessRate,
      averageLitterSize
    };
  }, [dogHeatCycles, dogLitters]);
  
  return (
    <Card>
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm">Zuchtstatistiken</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-pink-500" />
              <div>
                <div className="text-xs text-muted-foreground">Läufigkeiten</div>
                <div className="font-medium">{stats.totalCycles}</div>
              </div>
            </div>
            
            {stats.averageCycleLength > 0 && (
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-2 text-pink-500" />
                <div>
                  <div className="text-xs text-muted-foreground">∅ Zykluslänge</div>
                  <div className="font-medium">{stats.averageCycleLength} Tage</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <BabyIcon className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <div className="text-xs text-muted-foreground">Würfe</div>
                <div className="font-medium">{stats.completedLitters} / {stats.totalLitters}</div>
              </div>
            </div>
            
            {stats.completedLitters > 0 && (
              <>
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">∅ Wurfgröße</div>
                    <div className="font-medium">{stats.averageLitterSize} Welpen</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Percent className="h-4 w-4 mr-2 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Deckrate</div>
                    <div className="font-medium">{stats.breedingSuccessRate}%</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogBreedingStats;
