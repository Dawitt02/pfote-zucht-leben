import React, { useState } from 'react';
import { Plus, Upload, FileText, Image, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DogCard from '@/components/DogCard';
import Navbar from '@/components/Navbar';
import { useDogs } from '@/context/DogContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppWrapper from '@/components/AppWrapper';

const DogProfiles = () => {
  const { dogs } = useDogs();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [documentCategory, setDocumentCategory] = useState("pedigree");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadTab, setUploadTab] = useState("documents");

  const handleUploadClick = (dogId: string) => {
    setSelectedDog(dogId);
    setUploadDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Bitte wählen Sie Dateien zum Hochladen aus");
      return;
    }

    const fileNames = Array.from(selectedFiles).map(file => file.name).join(', ');
    
    const dogName = dogs.find(dog => dog.id === selectedDog)?.name || "Hund";
    const categoryLabels: Record<string, string> = {
      pedigree: "Stammbaum-Dokumente",
      genetic: "Genetische Testergebnisse",
      health: "Gesundheitsprüfungen",
      exhibition: "Ausstellungsergebnisse",
      vaccination: "Impfnachweise",
      photos: "Fotos",
      videos: "Videos",
      breeding: "Zuchtverbanddokumente",
      litter: "Wurfabnahmeprotokolle"
    };
    
    toast.success(`${fileNames} für ${dogName} (${categoryLabels[documentCategory]}) hochgeladen`);
    setUploadDialogOpen(false);
    setSelectedFiles(null);
  };

  const getDogNameById = (id: string): string => {
    return dogs.find(dog => dog.id === id)?.name || "Unbekannter Hund";
  };

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Meine Hunde</h1>
            <div className="flex gap-2">
              <Button className="bg-zucht-blue hover:bg-zucht-blue/90" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" /> Dokumente
              </Button>
              <Button className="bg-zucht-amber hover:bg-zucht-amber/90" asChild>
                <Link to="/dogs/add">
                  <Plus className="h-4 w-4 mr-2" /> Hinzufügen
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dogs.map(dog => (
              <div key={dog.id} className="relative">
                <DogCard {...dog} className="h-full" />
                <Button 
                  className="absolute top-2 right-2 bg-zucht-blue hover:bg-zucht-blue/90 p-2 h-8 w-8" 
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUploadClick(dog.id);
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokumente hochladen</DialogTitle>
            <DialogDescription>
              {selectedDog ? 
                `Laden Sie Dokumente für ${getDogNameById(selectedDog)} hoch` : 
                "Wählen Sie einen Hund und Dokumenttyp aus"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={uploadTab} onValueChange={setUploadTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Dokumente</TabsTrigger>
              <TabsTrigger value="media">Medien</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="space-y-4 py-4">
              {!selectedDog && (
                <div className="space-y-2">
                  <Label htmlFor="dogSelect">Hund auswählen</Label>
                  <Select onValueChange={setSelectedDog}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hund auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="categorySelect">Dokumentenkategorie</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pedigree">Stammbaum-Dokumente</SelectItem>
                    <SelectItem value="genetic">Genetische Testergebnisse</SelectItem>
                    <SelectItem value="health">Gesundheitsprüfungen</SelectItem>
                    <SelectItem value="exhibition">Ausstellungsergebnisse</SelectItem>
                    <SelectItem value="vaccination">Impfnachweise</SelectItem>
                    <SelectItem value="breeding">Zuchtverbanddokumente</SelectItem>
                    <SelectItem value="litter">Wurfabnahmeprotokolle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="documentUpload">Dokumente (PDF, JPG, PNG, DOCX)</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klicken Sie zum Hochladen</span> oder ziehen Sie Dateien hierher
                      </p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX (max. 10MB)</p>
                    </div>
                    <Input 
                      id="documentUpload" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center">
                        <File className="w-4 h-4 mr-2" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4 py-4">
              {!selectedDog && (
                <div className="space-y-2">
                  <Label htmlFor="dogSelect">Hund auswählen</Label>
                  <Select onValueChange={setSelectedDog}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hund auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs.map(dog => (
                        <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="mediaType">Medientyp</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Medientyp wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photos">Fotos (Standardpositionen)</SelectItem>
                    <SelectItem value="videos">Videos (Gangwerk, Verhalten)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="mediaUpload">
                  {documentCategory === "photos" ? "Fotos (JPG, PNG)" : "Videos (MP4, MOV)"}
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {documentCategory === "photos" ? (
                        <Image className="w-8 h-8 mb-2 text-gray-500" />
                      ) : (
                        <Video className="w-8 h-8 mb-2 text-gray-500" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klicken Sie zum Hochladen</span> oder ziehen Sie Dateien hierher
                      </p>
                      <p className="text-xs text-gray-500">
                        {documentCategory === "photos" ? "JPG, PNG (max. 5MB)" : "MP4, MOV (max. 50MB)"}
                      </p>
                    </div>
                    <Input 
                      id="mediaUpload" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept={documentCategory === "photos" ? ".jpg,.jpeg,.png" : ".mp4,.mov"}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="flex items-center">
                        {file.type.includes("image") ? (
                          <Image className="w-4 h-4 mr-2" />
                        ) : (
                          <Video className="w-4 h-4 mr-2" />
                        )}
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setUploadDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button 
              type="button" 
              className="bg-zucht-amber hover:bg-zucht-amber/90"
              onClick={handleUpload}
            >
              Hochladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Navbar />
    </div>
  );
};

export default DogProfiles;
