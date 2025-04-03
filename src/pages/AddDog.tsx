
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dog, Calendar, Award, Camera, Plus, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';

// Define form validation schema
const dogFormSchema = z.object({
  name: z.string().min(2, { message: "Der Name muss mindestens 2 Zeichen lang sein." }),
  breed: z.string().min(2, { message: "Die Rasse muss angegeben werden." }),
  age: z.string().min(1, { message: "Bitte gib das Alter an." }),
  gender: z.enum(["male", "female"], { 
    required_error: "Bitte wähle das Geschlecht aus." 
  }),
  breedingStatus: z.string().optional(),
  achievements: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

type DogFormValues = z.infer<typeof dogFormSchema>;

const AddDog = () => {
  const navigate = useNavigate();
  
  // Default values for the form
  const defaultValues: Partial<DogFormValues> = {
    name: "",
    breed: "",
    age: "",
    gender: undefined,
    breedingStatus: "",
    achievements: "",
    notes: "",
    imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Placeholder image
  };
  
  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues,
  });

  function onSubmit(data: DogFormValues) {
    // Here you would typically save the data to your database
    console.log("Form submitted:", data);
    
    // Show success message
    toast.success("Hund erfolgreich hinzugefügt!");
    
    // Navigate back to dogs page
    setTimeout(() => navigate('/dogs'), 1500);
  }

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate('/dogs')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Neuen Hund hinzufügen</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Image upload placeholder */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-zucht-amber">
                  {form.watch("imageUrl") ? (
                    <img 
                      src={form.watch("imageUrl")} 
                      alt="Hundebild" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                  <Button 
                    type="button" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full bg-zucht-amber h-8 w-8 p-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Dog className="mr-2 h-5 w-5 text-zucht-amber" />
                  Grundinformationen
                </h2>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name des Hundes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rasse</FormLabel>
                      <FormControl>
                        <Input placeholder="z.B. Golden Retriever" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alter</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. 3 Jahre" {...field} />
                        </FormControl>
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
                              <SelectValue placeholder="Auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Rüde</SelectItem>
                            <SelectItem value="female">Hündin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Breeding Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-zucht-blue" />
                  Zuchtinformationen
                </h2>
                
                <FormField
                  control={form.control}
                  name="breedingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zuchtstatus</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Zuchttauglich">Zuchttauglich</SelectItem>
                          <SelectItem value="In Vorbereitung">In Vorbereitung</SelectItem>
                          <SelectItem value="Aktiv">Aktiv</SelectItem>
                          <SelectItem value="Ruhend">Ruhend</SelectItem>
                          <SelectItem value="Nicht zur Zucht">Nicht zur Zucht</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Award className="mr-2 h-4 w-4 text-zucht-amber" />
                        Auszeichnungen
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="z.B. Schutzhund IPO1, Ausstellung B" 
                          className="resize-none" 
                          {...field} 
                        />
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
                      <FormLabel>Notizen</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Weitere Informationen zum Hund" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-zucht-amber hover:bg-zucht-amber/90"
              >
                Hund hinzufügen
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default AddDog;
