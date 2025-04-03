import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dog, Calendar, Award, Camera, Plus, ArrowLeft, FileText, Activity, Save } from 'lucide-react';
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormFileInput } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '@/components/Navbar';

const dogFormSchema = z.object({
  name: z.string().min(2, { message: "Der Name muss mindestens 2 Zeichen lang sein." }),
  breed: z.string().min(2, { message: "Die Rasse muss angegeben werden." }),
  age: z.string().min(1, { message: "Bitte gib das Alter an." }),
  gender: z.enum(["male", "female"], { 
    required_error: "Bitte wähle das Geschlecht aus." 
  }),
  
  fullName: z.string().optional(),
  registrationNumber: z.string().optional(),
  chipNumber: z.string().optional(),
  
  pedigree: z.string().optional(),
  geneticTestResults: z.string().optional(),
  inbreedingCoefficient: z.string().optional(),
  
  healthStatus: z.string().optional(),
  vaccinationHistory: z.string().optional(),
  weight: z.string().optional(),
  size: z.string().optional(),

  breedingStatus: z.string().optional(),
  cycleInformation: z.string().optional(),
  breedingHistory: z.string().optional(),
  litterInformation: z.string().optional(),
  breedingRestrictions: z.string().optional(),

  achievements: z.string().optional(),
  exhibitionResults: z.string().optional(),
  temperamentAssessment: z.string().optional(),

  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  hasStandardPhotos: z.boolean().optional(),
});

type DogFormValues = z.infer<typeof dogFormSchema>;

const AddDog = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const defaultValues: Partial<DogFormValues> = {
    name: "",
    breed: "",
    age: "",
    gender: undefined,
    breedingStatus: "",
    achievements: "",
    notes: "",
    imageUrl: "",
    hasStandardPhotos: false,
  };
  
  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues,
  });

  const handleImageChange = (dataUrl: string) => {
    setImagePreview(dataUrl);
    form.setValue('imageUrl', dataUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  function onSubmit(data: DogFormValues) {
    if (!data.imageUrl) {
      toast.error("Bitte lade ein Bild des Hundes hoch.");
      return;
    }

    console.log("Form submitted:", data);
    toast.success("Hund erfolgreich hinzugefügt!");
    setTimeout(() => navigate('/dogs'), 1500);
  }

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (window.confirm("Möchten Sie wirklich abbrechen? Alle eingegebenen Daten gehen verloren.")) {
        navigate('/dogs');
      }
    } else {
      navigate('/dogs');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-28">
        <div className="app-container">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Neuen Hund hinzufügen</h1>
          </div>

          <Form {...form}>
            <form id="add-dog-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col items-center">
                      <FormLabel className="text-center mb-2">Hundebild</FormLabel>
                      <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-zucht-amber mb-2">
                        {imagePreview ? (
                          <Avatar className="w-32 h-32">
                            <AvatarImage src={imagePreview} alt="Hundebild" className="object-cover" />
                            <AvatarFallback>
                              <Camera className="h-8 w-8 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                        <Button 
                          type="button" 
                          size="icon" 
                          className="absolute bottom-0 right-0 rounded-full bg-zucht-amber h-8 w-8 p-1"
                          onClick={triggerFileInput}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormControl>
                        <FormFileInput
                          ref={fileInputRef}
                          accept="image/*"
                          onImageChange={handleImageChange}
                          previewUrl={imagePreview || undefined}
                          {...field}
                          value={undefined}
                        />
                      </FormControl>
                      <FormDescription className="text-center">
                        Bitte lade ein Bild des Hundes hoch
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Accordion type="multiple" defaultValue={["basic-info"]} className="w-full">
                <AccordionItem value="basic-info">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <Dog className="mr-2 h-5 w-5 text-zucht-amber" />
                      Grundinformationen
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="official-id">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-zucht-blue" />
                      Offizielle Identifikation
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vollständiger Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Offizieller Name im Zuchtverband" {...field} />
                          </FormControl>
                          <FormDescription>
                            Der vollständige, im Zuchtverband registrierte Name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registrierungsnummer</FormLabel>
                          <FormControl>
                            <Input placeholder="z.B. VDH-12345-67" {...field} />
                          </FormControl>
                          <FormDescription>
                            Die offizielle Identifikationsnummer im Zuchtverband
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chipNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chip-/Mikrochip-Nummer</FormLabel>
                          <FormControl>
                            <Input placeholder="z.B. 276098106123456" {...field} />
                          </FormControl>
                          <FormDescription>
                            Die gesetzlich vorgeschriebene eindeutige Kennung
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pedigree-genetics">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-zucht-amber" />
                      Stammbaum & Genetik
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="pedigree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stammbaum (3-4 Generationen)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Abstammungsnachweis und Blutlinien" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Die Vorfahren des Hundes über mehrere Generationen
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="geneticTestResults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genetische Testergebnisse</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ergebnisse für rassetypische Erbkrankheiten" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Tests auf erbliche Krankheiten und genetische Eigenschaften
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="inbreedingCoefficient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inzuchtkoeffizient</FormLabel>
                          <FormControl>
                            <Input placeholder="z.B. 5.4%" {...field} />
                          </FormControl>
                          <FormDescription>
                            Wichtiger Wert für die Zuchtplanung
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="health-info">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-zucht-green" />
                      Gesundheitsinformationen
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="healthStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HD/ED-Status & Gesundheitsprüfungen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Zuchtrelevante Gesundheitsnachweise" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Ergebnisse wichtiger Gesundheitsuntersuchungen wie HD/ED
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vaccinationHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impf- und Entwurmungshistorie</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Grundlegende Gesundheitspflege" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Chronologische Aufzeichnung der Impfungen und Entwurmungen
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gewicht</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. 28 kg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Größe/Widerristhöhe</FormLabel>
                            <FormControl>
                              <Input placeholder="z.B. 58 cm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="breeding-info">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-zucht-blue" />
                      Zuchtinformationen
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
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
                      name="cycleInformation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zyklusinformationen (Hündinnen)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Läufigkeiten mit Datumsangaben" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Nur für Hündinnen: Zeitpunkte und Dauer der Läufigkeiten
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="breedingHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deck- und Wurfdaten</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Zuchthistorie mit Partnern und Terminen" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Bisherige Verpaarungen mit Datumsangaben
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="litterInformation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wurfstärke & Welpeninformationen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Anzahl, Geschlechterverteilung, Besonderheiten" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Detaillierte Informationen zu Würfen
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="breedingRestrictions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zuchtrestriktionen oder -empfehlungen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Vom Zuchtverband vorgegebene Einschränkungen" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Vorgaben oder Beschränkungen vom Zuchtverband
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="performance-character">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-zucht-green" />
                      Leistung & Charakter
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="achievements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auszeichnungen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="z.B. Schutzhund IPO1, Ausstellung B" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Erzielte Auszeichnungen und Titel
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="exhibitionResults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ausstellungsergebnisse & Bewertungen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Formwert und Außenbeurteilungen" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Beurteilungen und Ergebnisse aus Ausstellungen
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="temperamentAssessment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wesens- und Verhaltensbeurteilungen</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Charaktereigenschaften und Temperament" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Beurteilungen zum Charakter und Verhalten
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notes-media">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-zucht-amber" />
                      Notizen & Medien
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allgemeine Notizen</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="hasStandardPhotos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Standardfotos vorhanden
                            </FormLabel>
                            <FormDescription>
                              Aktuelle Fotos in Standardpositionen für die Zuchtbewertung
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </div>
      </main>
      
      <div className="fixed bottom-16 left-0 right-0 bg-zucht-amber/10 border-t border-zucht-amber/30 py-4 px-4 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex gap-4 max-w-md mx-auto">
          <Button 
            type="submit" 
            form="add-dog-form"
            className="flex-1 bg-zucht-amber hover:bg-zucht-amber/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Hund speichern
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            Abbrechen
          </Button>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default AddDog;
