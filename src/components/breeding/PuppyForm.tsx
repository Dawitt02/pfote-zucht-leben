import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Puppy } from '@/context/DogContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const puppyFormSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['male', 'female']),
  color: z.string().optional(),
  birthWeight: z.string().optional(),
  chip: z.string().optional(),
  sold: z.boolean().default(false),
  newOwner: z.string().optional(),
  notes: z.string().optional(),
});

type PuppyFormValues = z.infer<typeof puppyFormSchema>;

interface PuppyFormProps {
  onSubmit: (data: Omit<Puppy, 'id' | 'litterId'>) => void;
  defaultValues?: Partial<PuppyFormValues>;
}

const PuppyForm = ({ onSubmit, defaultValues }: PuppyFormProps) => {
  const form = useForm<PuppyFormValues>({
    resolver: zodResolver(puppyFormSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      color: '',
      birthWeight: '',
      chip: '',
      sold: false,
      newOwner: '',
      notes: '',
      ...defaultValues
    }
  });

  const handleSubmit = form.handleSubmit((data) => {
    const puppyData: Omit<Puppy, 'id' | 'litterId'> = {
      gender: data.gender,
      name: data.name,
      color: data.color,
      birthWeight: data.birthWeight,
      chip: data.chip,
      sold: data.sold,
      newOwner: data.newOwner,
      notes: data.notes
    };
    
    onSubmit(puppyData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Name des Welpen" {...field} />
              </FormControl>
              <FormDescription>
                Geben Sie einen Namen oder eine Kennung für den Welpen ein
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Geschlecht</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie das Geschlecht" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Rüde (♂)</SelectItem>
                  <SelectItem value="female">Hündin (♀)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farbe (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. schwarz, braun, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geburtsgewicht in g (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. 350" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="chip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chipnummer (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Chipnummer, falls vorhanden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sold"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Reserviert/Verkauft</FormLabel>
                <FormDescription>
                  Markieren Sie dieses Kästchen, wenn der Welpe bereits reserviert oder verkauft ist
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch('sold') && (
          <FormField
            control={form.control}
            name="newOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neuer Besitzer</FormLabel>
                <FormControl>
                  <Input placeholder="Name des neuen Besitzers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notizen (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Besonderheiten, Merkmale, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Welpe speichern
        </Button>
      </form>
    </Form>
  );
};

export default PuppyForm;
