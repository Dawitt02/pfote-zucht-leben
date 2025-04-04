
import React, { useState } from 'react';
import { addDays } from 'date-fns';
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
import { HeatCycle, useDogs } from '@/context/DogContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface HeatCycleFormProps {
  onSubmit?: () => void;
  defaultValues?: Partial<HeatCycle>;
  mode?: 'add' | 'edit';
}

const HeatCycleForm = ({ 
  onSubmit: onSubmitProp, 
  defaultValues,
  mode = 'add' 
}: HeatCycleFormProps) => {
  const { dogs, addHeatCycle, updateHeatCycle } = useDogs();
  const femaleDogsOnly = dogs.filter(dog => dog.gender === 'female');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const initialStartDate = defaultValues?.startDate ? 
    (defaultValues.startDate instanceof Date ? 
      defaultValues.startDate : 
      new Date(defaultValues.startDate)) : 
    new Date();
  
  const form = useForm<{
    dogId: string;
    startDate: Date;
    calculateFertile: boolean;
    notes?: string;
  }>({
    defaultValues: {
      dogId: defaultValues?.dogId || '',
      startDate: initialStartDate,
      calculateFertile: !!defaultValues?.fertile,
      notes: defaultValues?.notes || ''
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    try {
      setFormSubmitting(true);
      const { dogId, startDate, calculateFertile, notes } = data;
      
      if (!dogId) {
        toast.error('Bitte wähle eine Hündin aus');
        setFormSubmitting(false);
        return;
      }
      
      const dogName = dogs.find(d => d.id === dogId)?.name || 'Hund';
      
      let fertileData = undefined;
      if (calculateFertile) {
        const fertileStartDate = addDays(startDate, 9);
        const fertileEndDate = addDays(fertileStartDate, 5);
        
        fertileData = {
          startDate: fertileStartDate,
          endDate: fertileEndDate
        };
      }
      
      if (mode === 'add') {
        addHeatCycle({
          dogId,
          startDate,
          fertile: fertileData,
          notes
        });
        toast.success(`Läufigkeit für ${dogName} erfolgreich hinzugefügt`);
      } else if (mode === 'edit' && defaultValues?.id) {
        updateHeatCycle({
          id: defaultValues.id,
          dogId,
          startDate,
          fertile: fertileData,
          notes
        });
        toast.success(`Läufigkeit für ${dogName} erfolgreich aktualisiert`);
      }
      
      if (onSubmitProp) {
        onSubmitProp();
      }
      
      if (mode === 'add') {
        form.reset({
          dogId: '',
          startDate: new Date(),
          calculateFertile: true,
          notes: ''
        });
      }
    } catch (error) {
      toast.error('Fehler beim Speichern der Läufigkeitsdaten');
      console.error(error);
    } finally {
      setFormSubmitting(false);
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
                Wähle die Hündin, für die die Läufigkeit eingetragen werden soll
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Erster Tag der Läufigkeit</FormLabel>
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
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Wähle den ersten Tag der Läufigkeit
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="calculateFertile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="form-checkbox h-4 w-4"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Fruchtbare Tage berechnen</FormLabel>
                <FormDescription>
                  Automatisch fruchtbare Tage (Tag 9-14 der Läufigkeit) markieren
                </FormDescription>
              </div>
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
                  placeholder="Notizen zur Läufigkeit..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={formSubmitting}>
          {formSubmitting ? 'Wird gespeichert...' : mode === 'add' ? 'Läufigkeit hinzufügen' : 'Änderungen speichern'}
        </Button>
      </form>
    </Form>
  );
};

export default HeatCycleForm;
