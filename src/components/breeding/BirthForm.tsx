
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

const birthFormSchema = z.object({
  litterId: z.string(),
  birthDate: z.date(),
  puppyCount: z.string().optional(),
  males: z.string().optional(),
  females: z.string().optional(),
  notes: z.string().optional(),
});

type BirthFormValues = z.infer<typeof birthFormSchema>;

interface BirthFormProps {
  onSubmit?: () => void;
  preselectedLitterId?: string;
}

const BirthForm = ({ onSubmit: onSubmitProp, preselectedLitterId }: BirthFormProps) => {
  const { dogs, litters, recordBirth } = useDogs();
  const pendingLitters = litters.filter(litter => !litter.birthDate);
  
  const form = useForm<BirthFormValues>({
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

  const handleSubmit = form.handleSubmit((data) => {
    try {
      const { litterId, birthDate, puppyCount, males, females, notes } = data;
      const litter = litters.find(l => l.id === litterId);
      if (!litter) {
        toast.error('Ausgewählter Wurf nicht gefunden');
        return;
      }
      
      const dogName = dogs.find(d => d.id === litter.dogId)?.name || 'Hündin';
      
      // Record birth and schedule all events
      recordBirth(
        litterId,
        birthDate, 
        Number(puppyCount) || undefined, 
        Number(males) || undefined, 
        Number(females) || undefined, 
        notes
      );
      
      toast.success(`Wurf für ${dogName} erfolgreich eingetragen`);
      
      if (onSubmitProp) {
        onSubmitProp();
      }
      
      form.reset({
        litterId: '',
        birthDate: new Date(),
        puppyCount: '',
        males: '',
        females: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Fehler beim Speichern der Wurfdaten');
      console.error(error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="litterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wurf wählen</FormLabel>
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
                  {pendingLitters.length === 0 ? (
                    <SelectItem value="none" disabled>Keine anstehenden Würfe</SelectItem>
                  ) : (
                    pendingLitters.map(litter => {
                      const dog = dogs.find(d => d.id === litter.dogId);
                      const expectedDate = new Date(litter.breedingDate);
                      expectedDate.setDate(expectedDate.getDate() + 60);
                      
                      return (
                        <SelectItem key={litter.id} value={litter.id}>
                          {dog?.name || 'Unbekannt'} (erwartet: {format(expectedDate, 'dd.MM.yyyy')})
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Wähle den Wurf, für den das Geburtsdatum eingetragen werden soll
              </FormDescription>
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
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Wähle das Datum der Geburt
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="puppyCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anzahl Welpen</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. 6" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="males"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rüden</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. 3" type="number" {...field} />
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
                  <Input placeholder="z.B. 3" type="number" {...field} />
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

        <Button type="submit" className="w-full">
          Wurf eintragen & Termine planen
        </Button>
      </form>
    </Form>
  );
};

export default BirthForm;
