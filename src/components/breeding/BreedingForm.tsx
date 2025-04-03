
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDogs, Dog } from '@/context/DogContext';

interface BreedingFormProps {
  onSubmit?: () => void;
  preselectedDogId?: string;
}

interface FormValues {
  dogId: string;
  breedingDate: Date;
  studName: string;
  studOwner?: string;
  notes?: string;
}

const BreedingForm = ({ onSubmit: onSubmitProp, preselectedDogId }: BreedingFormProps) => {
  const { dogs, addBreedingEvent, addLitter } = useDogs();
  const femaleDogsOnly = dogs.filter(dog => dog.gender === 'female');
  
  const form = useForm<FormValues>({
    defaultValues: {
      dogId: preselectedDogId || '',
      breedingDate: new Date(),
      studName: '',
      studOwner: '',
      notes: ''
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    try {
      const { dogId, breedingDate, studName, studOwner, notes } = data;
      const dogName = dogs.find(d => d.id === dogId)?.name || 'Hund';
      
      // 1. Create a breeding event
      addBreedingEvent({
        type: 'breeding',
        title: `Deckakt: ${dogName} & ${studName}`,
        dogId,
        date: breedingDate,
        notes,
        color: '#F2FCE2', // Soft Green
        stud: {
          name: studName,
          owner: studOwner
        }
      });
      
      // 2. Create a litter record
      const newLitter = addLitter({
        dogId,
        breedingDate,
        puppies: [],
        notes: `Verpaarung mit ${studName}`
      });
      
      toast.success(`Deckakt für ${dogName} erfolgreich eingetragen`);
      
      if (onSubmitProp) {
        onSubmitProp();
      }
      
      form.reset({
        dogId: '',
        breedingDate: new Date(),
        studName: '',
        studOwner: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Fehler beim Speichern der Deckdaten');
      console.error(error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="dogId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hündin</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle eine Hündin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {femaleDogsOnly.map(dog => (
                    <SelectItem key={dog.id} value={dog.id}>
                      {dog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Wähle die Hündin, für die der Deckakt eingetragen werden soll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="breedingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Decktag</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Datum wählen</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Wähle den Tag des Deckakts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name des Rüden</FormLabel>
              <FormControl>
                <Input placeholder="Name des Rüden eingeben" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studOwner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Besitzer des Rüden (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Name des Besitzers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notizen zum Deckakt..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Deckakt eintragen
        </Button>
      </form>
    </Form>
  );
};

export default BreedingForm;
