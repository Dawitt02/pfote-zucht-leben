
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { useDogs, Litter } from '@/context/DogContext';

interface BirthFormProps {
  onSubmit?: () => void;
  preselectedLitterId?: string;
}

const birthFormSchema = z.object({
  litterId: z.string().min(1, { message: "Bitte wähle einen Wurf aus" }),
  birthDate: z.date(),
  puppyCount: z.string().optional(),
  males: z.string().optional(),
  females: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof birthFormSchema>;

const BirthForm = ({ onSubmit: onSubmitProp, preselectedLitterId }: BirthFormProps) => {
  const { dogs, litters, recordBirth } = useDogs();
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Filter litters that don't have a birth date recorded yet
  const pendingBirths = litters
    .filter(litter => !litter.birthDate)
    .map(litter => {
      const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Unbekannt';
      return {
        ...litter,
        dogName,
        breedingDate: litter.breedingDate instanceof Date ? 
          litter.breedingDate : 
          new Date(litter.breedingDate)
      };
    });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(birthFormSchema),
    defaultValues: {
      litterId: preselectedLitterId || '',
      birthDate: new Date(),
      puppyCount: '',
      males: '',
      females: '',
      notes: ''
    }
  });
  
  // Set the preselected litter ID when it changes
  useEffect(() => {
    if (preselectedLitterId) {
      form.setValue('litterId', preselectedLitterId);
    }
  }, [preselectedLitterId, form]);

  const handleSubmit = form.handleSubmit((data) => {
    try {
      setFormSubmitting(true);
      const { litterId, birthDate, puppyCount, males, females, notes } = data;
      
      const selectedLitter = litters.find(l => l.id === litterId);
      if (!selectedLitter) {
        toast.error('Der ausgewählte Wurf wurde nicht gefunden');
        setFormSubmitting(false);
        return;
      }
      
      const dogName = dogs.find(d => d.id === selectedLitter.dogId)?.name || 'Unbekannter Hund';
      
      recordBirth(
        litterId, 
        birthDate, 
        puppyCount ? parseInt(puppyCount) : undefined, 
        males ? parseInt(males) : undefined, 
        females ? parseInt(females) : undefined,
        notes
      );
      
      toast.success(`Geburt für ${dogName} erfolgreich eingetragen`);
      
      if (onSubmitProp) {
        onSubmitProp();
      }
    } catch (error) {
      toast.error('Fehler beim Speichern der Geburtsdaten');
      console.error(error);
    } finally {
      setFormSubmitting(false);
    }
  });
  
  // Calculate males and females based on puppy count
  const totalPuppies = form.watch('puppyCount');
  const males = form.watch('males');
  const females = form.watch('females');
  
  // Validate that males + females = total if all are filled
  useEffect(() => {
    const puppyTotal = parseInt(totalPuppies || '0');
    const malesCount = parseInt(males || '0');
    const femalesCount = parseInt(females || '0');
    
    if (puppyTotal > 0 && malesCount > 0 && femalesCount > 0) {
      if (malesCount + femalesCount !== puppyTotal) {
        form.setError('puppyCount', {
          type: 'manual',
          message: 'Gesamtzahl stimmt nicht mit Rüden + Hündinnen überein'
        });
      } else {
        form.clearErrors('puppyCount');
      }
    }
  }, [totalPuppies, males, females, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="litterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wurf auswählen</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wähle einen Wurf" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pendingBirths.length === 0 ? (
                    <SelectItem disabled value="none">Keine anstehenden Würfe</SelectItem>
                  ) : (
                    pendingBirths.map(litter => (
                      <SelectItem key={litter.id} value={litter.id}>
                        {litter.dogName} - {format(litter.breedingDate, 'dd.MM.yyyy')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Geburtsdatum</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="puppyCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anzahl der Welpen</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Gesamtanzahl der Welpen" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    
                    // Auto-calculate males and females if only one is filled
                    const total = parseInt(e.target.value || '0');
                    const malesValue = parseInt(males || '0');
                    const femalesValue = parseInt(females || '0');
                    
                    if (total > 0 && malesValue > 0 && femalesValue === 0) {
                      if (total >= malesValue) {
                        form.setValue('females', (total - malesValue).toString());
                      }
                    } else if (total > 0 && malesValue === 0 && femalesValue > 0) {
                      if (total >= femalesValue) {
                        form.setValue('males', (total - femalesValue).toString());
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="males"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rüden</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Anzahl Rüden" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Auto-calculate females if total is filled
                      const malesValue = parseInt(e.target.value || '0');
                      const total = parseInt(totalPuppies || '0');
                      
                      if (total > 0 && malesValue >= 0) {
                        if (total >= malesValue) {
                          form.setValue('females', (total - malesValue).toString());
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="females"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hündinnen</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Anzahl Hündinnen" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Auto-calculate males if total is filled
                      const femalesValue = parseInt(e.target.value || '0');
                      const total = parseInt(totalPuppies || '0');
                      
                      if (total > 0 && femalesValue >= 0) {
                        if (total >= femalesValue) {
                          form.setValue('males', (total - femalesValue).toString());
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notizen zum Wurf..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={formSubmitting || pendingBirths.length === 0}>
          {formSubmitting ? 'Wird gespeichert...' : 'Geburt eintragen'}
        </Button>
      </form>
    </Form>
  );
};

export default BirthForm;
