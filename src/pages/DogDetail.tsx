import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Award, 
  FileText, 
  Image, 
  Video, 
  Edit,
  Dog as DogIcon,
  Dna,
  Activity,
  Syringe,
  Medal,
  File,
  X,
  Upload,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDogs } from '@/context/DogContext';

const DogDetail = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('documents');
  const [uploadSubCategory, setUploadSubCategory] = useState('pedigree');
  const [documentName, setDocumentName] = useState('');
  const { toast } = useToast();
  const { dogs } = useDogs();

  const dog = dogs.find(dog => dog.id === dogId);

  if (!dog) {
    return (
      <div className="flex flex-col h-full bg-zucht-cream">
        <main className="flex-1 overflow-auto pb-16">
          <div className="app-container py-4">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold mb-4">Hund nicht gefunden</h1>
              <Button asChild>
                <Link to="/dogs">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Zurück zur Übersicht
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Navbar />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Zuchttauglich':
      case 'Aktiv':
        return 'bg-green-100 text-green-800';
      case 'In Vorbereitung':
        return 'bg-blue-100 text-blue-800';
      case 'Ruhend':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'jpg':
      case 'png':
        return <Image className="h-4 w-4" />;
      case 'mp4':
      case 'mov':
        return <Video className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      if (!documentName) {
        const fileName = e.target.files[0].name;
        const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        setDocumentName(nameWithoutExtension);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine Datei aus.",
        variant: "destructive",
      });
      return;
    }

    const fileType = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    const currentDate = new Date().toLocaleDateString('de-DE');
    
    const newDocument = {
      category: uploadSubCategory,
      name: documentName || selectedFile.name,
      date: currentDate,
      fileType: fileType
    };
    
    toast({
      title: "Datei hochgeladen",
      description: `${newDocument.name} wurde erfolgreich hochgeladen.`,
    });
    
    setSelectedFile(null);
    setDocumentName('');
    setIsUploadDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="app-container py-4">
            <div className="mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dogs">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <div className="relative rounded-lg overflow-hidden h-64">
                  <img 
                    src={dog?.imageUrl} 
                    alt={`${dog?.name}, a ${dog?.breed} dog`}
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center ${dog?.gender === 'male' ? 'bg-zucht-blue text-white' : 'bg-zucht-amber text-white'}`}>
                    {dog?.gender === 'male' ? '♂' : '♀'}
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl md:text-3xl font-bold">{dog?.name}</h1>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-zucht-blue text-white hover:bg-zucht-blue/90"
                    onClick={() => navigate(`/dogs/${dogId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Bearbeiten
                  </Button>
                </div>
                
                <p className="text-lg text-zucht-brown/80 mb-3">{dog?.breed}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
                    <span>Alter: {dog?.age}</span>
                  </div>
                  
                  {dog?.age && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
                      <span>Alter: {dog?.age}</span>
                    </div>
                  )}
                  
                  {dog?.breedingStatus && (
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-zucht-amber" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dog?.breedingStatus)}`}>
                        {dog?.breedingStatus}
                      </span>
                    </div>
                  )}
                  
                  {dog?.chipNumber && (
                    <div className="flex items-center">
                      <DogIcon className="h-4 w-4 mr-2 text-zucht-brown" />
                      <span>Chip: {dog?.chipNumber}</span>
                    </div>
                  )}
                </div>
                
                {dog?.achievements && dog?.achievements.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {dog?.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center text-xs bg-zucht-green/10 text-zucht-green px-2 py-1 rounded-full">
                          <Award className="h-3 w-3 mr-1" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="info">Grunddaten</TabsTrigger>
                <TabsTrigger value="health">Gesundheit</TabsTrigger>
                <TabsTrigger value="breeding">Zucht</TabsTrigger>
                <TabsTrigger value="documents">Dokumente</TabsTrigger>
                <TabsTrigger value="media">Medien</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Allgemeine Informationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">Rasse</TableCell>
                          <TableCell>{dog?.breed}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Geschlecht</TableCell>
                          <TableCell>{dog?.gender === 'male' ? 'männlich' : 'weiblich'}</TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell className="font-medium">Zuchtstatus</TableCell>
                          <TableCell>{dog?.breedingStatus}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Alter</TableCell>
                          <TableCell>{dog?.age}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Chip-Nr.</TableCell>
                          <TableCell>{dog?.chipNumber}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                {dog?.achievements && dog?.achievements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Leistungen & Auszeichnungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {dog?.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-zucht-amber" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="health" className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gesundheitsinformationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Gesundheitsdaten für {dog.name} werden hier angezeigt, sobald sie hinzugefügt wurden.</p>
                    
                    {dog.healthStatus && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Gesundheitsstatus</h3>
                        <p>{dog.healthStatus}</p>
                      </div>
                    )}
                    
                    {dog.geneticTestResults && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Genetische Testergebnisse</h3>
                        <p>{dog.geneticTestResults}</p>
                      </div>
                    )}
                    
                    {dog.vaccinationHistory && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Impfhistorie</h3>
                        <p>{dog.vaccinationHistory}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="breeding" className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zuchtstatus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Heart className="h-5 w-5 mr-2 text-zucht-amber" />
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(dog?.breedingStatus)}`}>
                        {dog?.breedingStatus}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Hier werden zukünftig Informationen zu Würfen, Zuchtplanungen und Zuchtwerten angezeigt.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 bg-white">
                          <h4 className="font-medium mb-2">Zuchtplanung</h4>
                          <p className="text-sm text-gray-500">Keine aktuelle Zuchtplanung vorhanden</p>
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-white">
                          <h4 className="font-medium mb-2">Vergangene Würfe</h4>
                          <p className="text-sm text-gray-500">Keine Würfe dokumentiert</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4 py-4">
                {dog?.documents && dog?.documents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dokumente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Kategorie</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dog?.documents.map((doc, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {getFileIcon(doc.fileType)}
                                  <span className="ml-2">{doc.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {doc.category === 'pedigree' && 'Stammbaum'}
                                {doc.category === 'breeding' && 'Zuchtverband'}
                                {doc.category === 'exhibition' && 'Ausstellung'}
                                {doc.category === 'health' && 'Gesundheit'}
                                {doc.category === 'genetic' && 'Genetik'}
                                {doc.category === 'vaccination' && 'Impfung'}
                                {doc.category === 'litter' && 'Wurfabnahme'}
                              </TableCell>
                              <TableCell>{doc.date}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm" className="text-zucht-blue">
                                    <FileText className="h-4 w-4 mr-2" /> Anzeigen
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-500">
                                        <X className="h-4 w-4 mr-2" /> Löschen
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Dokument löschen</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Möchten Sie wirklich das Dokument "{doc.name}" löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-500 hover:bg-red-600"
                                          onClick={() => {
                                            toast({
                                              title: "Dokument gelöscht",
                                              description: `${doc.name} wurde erfolgreich gelöscht.`,
                                            });
                                          }}
                                        >
                                          Löschen
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-end">
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-zucht-blue hover:bg-zucht-blue/90">
                        <Upload className="h-4 w-4 mr-2" /> Dokument hochladen
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Dokument hochladen</DialogTitle>
                        <DialogDescription>
                          Laden Sie ein neues Dokument für {dog?.name} hoch. Wählen Sie die Kategorie und die Datei aus.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUploadSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="documentName" className="text-right">
                              Dokumentname
                            </Label>
                            <Input
                              id="documentName"
                              value={documentName}
                              onChange={(e) => setDocumentName(e.target.value)}
                              placeholder="Name des Dokuments"
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Kategorie
                            </Label>
                            <select 
                              id="category"
                              value={uploadSubCategory}
                              onChange={(e) => setUploadSubCategory(e.target.value)}
                              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                              <option value="pedigree">Stammbaum</option>
                              <option value="breeding">Zuchtverband</option>
                              <option value="exhibition">Ausstellung</option>
                              <option value="health">Gesundheit</option>
                              <option value="genetic">Genetik</option>
                              <option value="vaccination">Impfung</option>
                              <option value="litter">Wurfabnahme</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file" className="text-right">
                              Datei
                            </Label>
                            <div className="col-span-3">
                              <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="col-span-3"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Unterstützte Formate: PDF, JPG, PNG, DOCX
                              </p>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-zucht-blue hover:bg-zucht-blue/90">
                            <Upload className="h-4 w-4 mr-2" /> Hochladen
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-4 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fotos & Videos</CardTitle>
                    <p className="text-gray-500 text-sm">Noch keine Medien vorhanden</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Fügen Sie Fotos oder Videos von {dog.name} hinzu</p>
                      <Button className="mt-4 bg-zucht-blue hover:bg-zucht-blue/90">
                        <Upload className="h-4 w-4 mr-2" /> Medien hochladen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end mt-4">
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-zucht-blue hover:bg-zucht-blue/90">
                        <Upload className="h-4 w-4 mr-2" /> Medien hochladen
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Medium hochladen</DialogTitle>
                        <DialogDescription>
                          Laden Sie ein neues Foto oder Video für {dog?.name} hoch.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUploadSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mediaName" className="text-right">
                              Bezeichnung
                            </Label>
                            <Input
                              id="mediaName"
                              value={documentName}
                              onChange={(e) => setDocumentName(e.target.value)}
                              placeholder="Beschreibung des Mediums"
                              className="col-span-3"
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mediaCategory" className="text-right">
                              Kategorie
                            </Label>
                            <select 
                              id="mediaCategory"
                              value={uploadCategory}
                              onChange={(e) => setUploadCategory(e.target.value)}
                              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                              <option value="photos">Foto</option>
                              <option value="videos">Video</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mediaFile" className="text-right">
                              Datei
                            </Label>
                            <div className="col-span-3">
                              <Input
                                id="mediaFile"
                                type="file"
                                onChange={handleFileChange}
                                className="col-span-3"
                                accept={uploadCategory === 'photos' ? '.jpg,.jpeg,.png' : '.mp4,.mov'}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {uploadCategory === 'photos' 
                                  ? 'Unterstützte Formate: JPG, PNG' 
                                  : 'Unterstützte Formate: MP4, MOV'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-zucht-blue hover:bg-zucht-blue/90">
                            <Upload className="h-4 w-4 mr-2" /> Hochladen
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
};

export default DogDetail;
