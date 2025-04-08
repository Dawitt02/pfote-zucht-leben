import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from "sonner";
import DocumentUpload from './DocumentUpload';
import { Dog, DogDocument, useDogs } from '@/context/DogContext';
import { calculateAge } from '@/utils/dateUtils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormFileInput,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const dogFormSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein' }),
  breed: z.string().min(2, { message: 'Rasse muss mindestens 2 Zeichen lang sein' }),
  birthdate: z.date({
    required_error: "Bitte geben Sie das Geburtsdatum ein",
  }),
  gender: z.enum(['male', 'female']),
  breedingStatus: z.string().optional(),
  
  fullName: z.string().optional(),
  registrationNumber: z.string().optional(),
  chipNumber: z.string().optional(),
  notes: z.string().optional(),
  
  pedigree: z.string().optional(),
  geneticTestResults: z.string().optional(),
  healthStatus: z.string().optional(),
  vaccinationHistory: z.string().optional(),
  weight: z.string().optional(),
  size: z.string().optional(),
  
  cycleInformation: z.string().optional(),
  breedingHistory: z.string().optional(),
  litterInformation: z.string().optional(),
  breedingRestrictions: z.string().optional(),
  
  exhibitionResults: z.string().optional(),
  temperamentAssessment: z.string().optional(),
});

type DogFormValues = z.infer<typeof dogFormSchema>;

interface DogFormWithDocumentsProps {
  initialData?: Dog;
  mode: 'add' | 'edit';
}

const DogFormWithDocuments: React.FC<DogFormWithDocumentsProps> = ({ initialData, mode }) => {
  const { addDog, updateDog, addDocumentToDog } = useDogs();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Record<string, Omit<DogDocument, 'id'>>>({});
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);

  let initialBirthdate: Date | undefined = undefined;
  if (initialData?.birthdate) {
    initialBirthdate = new Date(initialData.birthdate);
  }

  const defaultValues: Partial<DogFormValues> = {
    name: initialData?.name || '',
    breed: initialData?.breed || '',
    birthdate: initialBirthdate || new Date(),
    gender: initialData?.gender || 'male',
    breedingStatus: initialData?.breedingStatus || '',
    fullName: initialData?.fullName || '',
    registrationNumber: initialData?.registrationNumber || '',
    chipNumber: initialData?.chipNumber || '',
    notes: initialData?.notes || '',
    pedigree: initialData?.pedigree || '',
    geneticTestResults: initialData?.geneticTestResults || '',
    healthStatus: initialData?.healthStatus || '',
    vaccinationHistory: initialData?.vaccinationHistory || '',
    weight: initialData?.weight || '',
    size: initialData?.size || '',
    cycleInformation: initialData?.cycleInformation || '',
    breedingHistory: initialData?.breedingHistory || '',
    litterInformation: initialData?.litterInformation || '',
    breedingRestrictions: initialData?.breedingRestrictions || '',
    exhibitionResults: initialData?.exhibitionResults || '',
    temperamentAssessment: initialData?.temperamentAssessment || '',
  };

  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      const formValues = {...initialData};
      if (initialData.birthdate) {
        formValues.birthdate = new Date(initialData.birthdate);
      }
      form.reset(formValues as any);
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData, form]);

  const onSubmit = (values: DogFormValues) => {
    const birthdateString = values.birthdate instanceof Date 
      ? values.birthdate.toISOString() 
      : new Date().toISOString();
    
    if (mode === 'add') {
      const newDog: Omit<Dog, 'id'> = {
        name: values.name,
        breed: values.breed,
        birthdate: birthdateString,
        gender: values.gender,
        imageUrl: imagePreview || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        breedingStatus: values.breedingStatus || '',
        achievements: [],
        documents: [],
        fullName: values.fullName || '',
        registrationNumber: values.registrationNumber || '',
        chipNumber: values.chipNumber || '',
        notes: values.notes || '',
        pedigree: values.pedigree || '',
        geneticTestResults: values.geneticTestResults || '',
        healthStatus: values.healthStatus || '',
        vaccinationHistory: values.vaccinationHistory || '',
        weight: values.weight || '',
        size: values.size || '',
        cycleInformation: values.cycleInformation || '',
        breedingHistory: values.breedingHistory || '',
        litterInformation: values.litterInformation || '',
        breedingRestrictions: values.breedingRestrictions || '',
        exhibitionResults: values.exhibitionResults || '',
        temperamentAssessment: values.temperamentAssessment || '',
      };
      
      addDog(newDog);
      toast("Hund hinzugefügt", {
        description: `${values.name} wurde erfolgreich hinzugefügt.`,
      });
    } else if (mode === 'edit' && initialData) {
      const achievements = initialData.achievements || [];
      
      updateDog({ 
        ...initialData, 
        ...values,
        birthdate: birthdateString,
        imageUrl: imagePreview || initialData.imageUrl,
        achievements,
        documents: initialData.documents || []
      });
      
      toast("Hund aktualisiert", {
        description: `${values.name} wurde erfolgreich aktualisiert.`,
      });
    }

    if (Object.keys(documents).length > 0 && initialData?.id) {
      Object.values(documents).forEach(doc => {
        addDocumentToDog(initialData.id, doc);
      });
    }

    setTimeout(() => {
      navigate('/dogs');
    }, 300);
  };

  const handleImageChange = (dataUrl: string) => {
    setImagePreview(dataUrl);
  };

  const handleDocumentUpload = (category: string, document: Omit<DogDocument, 'id'>) => {
    setDocuments(prev => ({
      ...prev,
      [category]: document
    }));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basic">Grunddaten</TabsTrigger>
            <TabsTrigger value="identity">Identifikation</TabsTrigger>
            <TabsTrigger value="pedigree">Abstammung</TabsTrigger>
            <TabsTrigger value="health">Gesundheit</TabsTrigger>
            <TabsTrigger value="breeding">Zucht</TabsTrigger>
            <TabsTrigger value="performance">Leistung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Grunddaten</CardTitle>
                <CardDescription>
                  Geben Sie die grundlegenden Informationen des Hundes ein.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. 'Luna'" {...field} />
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
                          <Input placeholder="z.B. 'Golden Retriever'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Geburtsdatum</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "P", { locale: de })
                                ) : (
                                  <span>Datum auswählen</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value instanceof Date ? field.value : new Date(field.value)}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          {field.value && `Alter: ${calculateAge(field.value instanceof Date ? field.value : new Date(field.value))}`}
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
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="male"
                              checked={field.value === 'male'}
                              onChange={() => field.onChange('male')}
                              className="form-radio"
                            />
                            <span>Rüde</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="female"
                              checked={field.value === 'female'}
                              onChange={() => field.onChange('female')}
                              className="form-radio"
                            />
                            <span>Hündin</span>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="breedingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zuchtstatus</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded"
                            {...field}
                          >
                            <option value="">Bitte wählen...</option>
                            <option value="Zuchttauglich">Zuchttauglich</option>
                            <option value="In Vorbereitung">In Vorbereitung</option>
                            <option value="Aktiv">Aktiv</option>
                            <option value="Ruhend">Ruhend</option>
                            <option value="Ausgeschlossen">Ausgeschlossen</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label>Hundefoto</Label>
                    <FormFileInput
                      accept="image/*"
                      onImageChange={handleImageChange}
                      previewUrl={imagePreview}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Wählen Sie ein Profilbild für den Hund.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="identity" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Offizielle Identifikation</CardTitle>
                <CardDescription>
                  Tragen Sie die offiziellen Identifikationsdaten ein.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vollständiger Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Zuchtname mit Zwingernamen" {...field} />
                        </FormControl>
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
                          <Input placeholder="z.B. 'VDH123456'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chipNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chipnummer</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. '276098106123456'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pedigree" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Abstammung & Genetik</CardTitle>
                <CardDescription>
                  Informationen zur Abstammung und genetischen Daten.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUpload
                    fieldLabel="Stammbaum"
                    category="pedigree"
                    onDocumentUpload={(doc) => handleDocumentUpload('pedigree', doc)}
                    documentInfo={documents['pedigree']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Genetische Testergebnisse"
                    category="genetic"
                    onDocumentUpload={(doc) => handleDocumentUpload('genetic', doc)}
                    documentInfo={documents['genetic']?.name}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gesundheitsinformationen</CardTitle>
                <CardDescription>
                  Gesundheitsstatus und medizinische Informationen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUpload
                    fieldLabel="Gesundheitsstatus"
                    category="health"
                    onDocumentUpload={(doc) => handleDocumentUpload('health', doc)}
                    documentInfo={documents['health']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Impfhistorie"
                    category="vaccination"
                    onDocumentUpload={(doc) => handleDocumentUpload('vaccination', doc)}
                    documentInfo={documents['vaccination']?.name}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gewicht</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. '25 kg'" {...field} />
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
                        <FormLabel>Größe / Widerristhöhe</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. '55 cm'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breeding" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Zuchtinformationen</CardTitle>
                <CardDescription>
                  Details zur Zuchteignung und -historie.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUpload
                    fieldLabel="Zyklusdaten (bei Hündinnen)"
                    category="cycle"
                    onDocumentUpload={(doc) => handleDocumentUpload('cycle', doc)}
                    documentInfo={documents['cycle']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Zuchthistorie"
                    category="breedingHistory"
                    onDocumentUpload={(doc) => handleDocumentUpload('breedingHistory', doc)}
                    documentInfo={documents['breedingHistory']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Wurfinformationen"
                    category="litter"
                    onDocumentUpload={(doc) => handleDocumentUpload('litter', doc)}
                    documentInfo={documents['litter']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Zuchteinschränkungen"
                    category="restrictions"
                    onDocumentUpload={(doc) => handleDocumentUpload('restrictions', doc)}
                    documentInfo={documents['restrictions']?.name}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Leistung & Charakter</CardTitle>
                <CardDescription>
                  Ausstellungsergebnisse und Charakterbeurteilungen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUpload
                    fieldLabel="Ausstellungsergebnisse"
                    category="exhibition"
                    onDocumentUpload={(doc) => handleDocumentUpload('exhibition', doc)}
                    documentInfo={documents['exhibition']?.name}
                  />
                  
                  <DocumentUpload
                    fieldLabel="Wesensbeurteilung"
                    category="temperament"
                    onDocumentUpload={(doc) => handleDocumentUpload('temperament', doc)}
                    documentInfo={documents['temperament']?.name}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notizen</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Weitere Notizen zum Hund"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dogs')}>
            Abbrechen
          </Button>
          <Button type="submit" className="bg-zucht-blue hover:bg-zucht-blue/90">
            {mode === 'add' ? 'Hund hinzufügen' : 'Änderungen speichern'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DogFormWithDocuments;
