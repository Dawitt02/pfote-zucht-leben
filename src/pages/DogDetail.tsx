
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Award, 
  FileText, 
  Image, 
  Video, 
  Edit,
  Dog,
  Dna,
  Activity,
  Syringe,
  Medal,
  File
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

const DogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('info');

  // Mock data - in a real app this would come from your state management or API
  const dogs = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: '3 Jahre',
      birthDate: '15.03.2022',
      gender: 'female' as const,
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Zuchttauglich',
      achievements: ['Ausstellung A'],
      chip: '276098100123456',
      color: 'Golden',
      weight: '28 kg',
      height: '56 cm',
      parents: {
        father: 'Rex vom Goldenen Tal',
        mother: 'Bella von der Sonnenseite'
      },
      healthTests: [
        { name: 'HD/ED Röntgen', date: '10.05.2024', result: 'HD-A / ED-0', document: 'hd_ed_luna.pdf' },
        { name: 'Augenuntersuchung', date: '21.01.2024', result: 'Ohne Befund', document: 'augen_luna.pdf' }
      ],
      geneticTests: [
        { name: 'PRA', result: 'Clear', date: '15.12.2023', document: 'pra_luna.pdf' },
        { name: 'DM', result: 'Carrier', date: '15.12.2023', document: 'dm_luna.pdf' }
      ],
      vaccinations: [
        { name: 'Tollwut', date: '10.02.2024', nextDue: '10.02.2025', document: 'tollwut_luna.pdf' },
        { name: 'Kombiimpfung', date: '10.02.2024', nextDue: '10.02.2025', document: 'kombi_luna.pdf' }
      ],
      documents: [
        { type: 'pedigree', name: 'Ahnentafel', date: '20.03.2022', fileType: 'pdf' },
        { type: 'breeding', name: 'Zuchtzulassung', date: '15.06.2023', fileType: 'pdf' },
        { type: 'exhibition', name: 'Ausstellungsbewertung München', date: '22.09.2023', fileType: 'pdf' }
      ],
      media: [
        { type: 'photos', name: 'Standposition Seite', date: '01.04.2024', fileType: 'jpg' },
        { type: 'photos', name: 'Standposition Front', date: '01.04.2024', fileType: 'jpg' },
        { type: 'videos', name: 'Gangwerk', date: '01.04.2024', fileType: 'mp4' }
      ]
    },
    {
      id: '2',
      name: 'Max',
      breed: 'Deutscher Schäferhund',
      age: '4 Jahre',
      birthDate: '22.06.2021',
      gender: 'male' as const,
      imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Aktiv',
      achievements: ['Schutzhund IPO1', 'Ausstellung B'],
      chip: '276098100678910',
      color: 'Schwarz-Braun',
      weight: '35 kg',
      height: '65 cm',
      parents: {
        father: 'Tyson vom Schwarzwald',
        mother: 'Heidi von der Bergstraße'
      },
      healthTests: [
        { name: 'HD/ED Röntgen', date: '05.08.2023', result: 'HD-B / ED-1', document: 'hd_ed_max.pdf' }
      ],
      geneticTests: [
        { name: 'DM', result: 'Clear', date: '12.09.2022', document: 'dm_max.pdf' }
      ],
      vaccinations: [
        { name: 'Tollwut', date: '15.01.2024', nextDue: '15.01.2025', document: 'tollwut_max.pdf' }
      ],
      documents: [
        { type: 'pedigree', name: 'Ahnentafel', date: '30.06.2021', fileType: 'pdf' },
        { type: 'breeding', name: 'Zuchtzulassung', date: '05.10.2022', fileType: 'pdf' }
      ],
      media: [
        { type: 'photos', name: 'Standposition Seite', date: '10.02.2024', fileType: 'jpg' },
        { type: 'videos', name: 'Schutzdienst-Übung', date: '10.02.2024', fileType: 'mp4' }
      ]
    },
    {
      id: '3',
      name: 'Bella',
      breed: 'Labrador Retriever',
      age: '2 Jahre',
      birthDate: '08.11.2022',
      gender: 'female' as const,
      imageUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'In Vorbereitung',
      chip: '276098100345678',
      color: 'Schwarz',
      weight: '26 kg',
      height: '54 cm',
      parents: {
        father: 'Bruno vom Seeblick',
        mother: 'Nora vom Wiesengrund'
      },
      healthTests: [
        { name: 'HD/ED Röntgen', date: '10.01.2024', result: 'HD-A / ED-0', document: 'hd_ed_bella.pdf' }
      ],
      documents: [
        { type: 'pedigree', name: 'Ahnentafel', date: '15.11.2022', fileType: 'pdf' }
      ],
      media: [
        { type: 'photos', name: 'Standposition Seite', date: '20.03.2024', fileType: 'jpg' }
      ]
    },
    {
      id: '4',
      name: 'Rocky',
      breed: 'Boxer',
      age: '5 Jahre',
      birthDate: '03.05.2020',
      gender: 'male' as const,
      imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      breedingStatus: 'Ruhend',
      achievements: ['Ausstellung C'],
      chip: '276098100987654',
      color: 'Gestromt',
      weight: '32 kg',
      height: '60 cm',
      parents: {
        father: 'Champion vom Boxerparadies',
        mother: 'Cindy von der Stadtmitte'
      },
      healthTests: [
        { name: 'Herzuntersuchung', date: '15.06.2023', result: 'Ohne Befund', document: 'herz_rocky.pdf' }
      ],
      documents: [
        { type: 'pedigree', name: 'Ahnentafel', date: '10.05.2020', fileType: 'pdf' },
        { type: 'exhibition', name: 'Ausstellungsbewertung Hamburg', date: '18.08.2023', fileType: 'pdf' }
      ]
    }
  ];

  const dog = dogs.find(dog => dog.id === id);

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

  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container py-4">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dogs">
                <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
              </Link>
            </Button>
          </div>
          
          {/* Dog header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3">
              <div className="relative rounded-lg overflow-hidden h-64">
                <img 
                  src={dog.imageUrl} 
                  alt={`${dog.name}, a ${dog.breed} dog`}
                  className="w-full h-full object-cover" 
                />
                <div className={`absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center ${dog.gender === 'male' ? 'bg-zucht-blue text-white' : 'bg-zucht-amber text-white'}`}>
                  {dog.gender === 'male' ? '♂' : '♀'}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-bold">{dog.name}</h1>
                <Button size="sm" variant="outline" className="bg-zucht-blue text-white hover:bg-zucht-blue/90">
                  <Edit className="h-4 w-4 mr-2" /> Bearbeiten
                </Button>
              </div>
              
              <p className="text-lg text-zucht-brown/80 mb-3">{dog.breed}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
                  <span>Alter: {dog.age}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-zucht-blue" />
                  <span>Geboren: {dog.birthDate}</span>
                </div>
                
                {dog.breedingStatus && (
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-zucht-amber" />
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dog.breedingStatus)}`}>
                      {dog.breedingStatus}
                    </span>
                  </div>
                )}
                
                {dog.chip && (
                  <div className="flex items-center">
                    <Dog className="h-4 w-4 mr-2 text-zucht-brown" />
                    <span>Chip: {dog.chip}</span>
                  </div>
                )}
              </div>
              
              {dog.achievements && dog.achievements.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {dog.achievements.map((achievement, index) => (
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
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="info">Grunddaten</TabsTrigger>
              <TabsTrigger value="health">Gesundheit</TabsTrigger>
              <TabsTrigger value="breeding">Zucht</TabsTrigger>
              <TabsTrigger value="documents">Dokumente</TabsTrigger>
              <TabsTrigger value="media">Medien</TabsTrigger>
            </TabsList>
            
            {/* Grunddaten Tab */}
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
                        <TableCell>{dog.breed}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Geschlecht</TableCell>
                        <TableCell>{dog.gender === 'male' ? 'männlich' : 'weiblich'}</TableCell>
                      </TableRow>
                      {dog.color && (
                        <TableRow>
                          <TableCell className="font-medium">Farbe</TableCell>
                          <TableCell>{dog.color}</TableCell>
                        </TableRow>
                      )}
                      {dog.weight && (
                        <TableRow>
                          <TableCell className="font-medium">Gewicht</TableCell>
                          <TableCell>{dog.weight}</TableCell>
                        </TableRow>
                      )}
                      {dog.height && (
                        <TableRow>
                          <TableCell className="font-medium">Widerristhöhe</TableCell>
                          <TableCell>{dog.height}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">Zuchtstatus</TableCell>
                        <TableCell>{dog.breedingStatus}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Geburtsdatum</TableCell>
                        <TableCell>{dog.birthDate}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Chip-Nr.</TableCell>
                        <TableCell>{dog.chip}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {dog.parents && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Abstammung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">Vater</TableCell>
                          <TableCell>{dog.parents.father}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Mutter</TableCell>
                          <TableCell>{dog.parents.mother}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              {dog.achievements && dog.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leistungen & Auszeichnungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dog.achievements.map((achievement, index) => (
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
            
            {/* Gesundheit Tab */}
            <TabsContent value="health" className="space-y-4 py-4">
              {dog.healthTests && dog.healthTests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gesundheitsuntersuchungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Untersuchung</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Ergebnis</TableHead>
                          <TableHead>Dokument</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dog.healthTests.map((test, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell>{test.date}</TableCell>
                            <TableCell>{test.result}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-zucht-blue">
                                <FileText className="h-4 w-4 mr-2" /> Anzeigen
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              {dog.geneticTests && dog.geneticTests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Genetische Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Ergebnis</TableHead>
                          <TableHead>Dokument</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dog.geneticTests.map((test, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell>{test.date}</TableCell>
                            <TableCell>{test.result}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-zucht-blue">
                                <FileText className="h-4 w-4 mr-2" /> Anzeigen
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              {dog.vaccinations && dog.vaccinations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Impfungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Impfung</TableHead>
                          <TableHead>Datum</TableHead>
                          <TableHead>Fällig</TableHead>
                          <TableHead>Dokument</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dog.vaccinations.map((vaccination, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{vaccination.name}</TableCell>
                            <TableCell>{vaccination.date}</TableCell>
                            <TableCell>{vaccination.nextDue}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-zucht-blue">
                                <FileText className="h-4 w-4 mr-2" /> Anzeigen
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Zucht Tab */}
            <TabsContent value="breeding" className="space-y-4 py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Zuchtstatus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 mr-2 text-zucht-amber" />
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(dog.breedingStatus)}`}>
                      {dog.breedingStatus}
                    </span>
                  </div>
                  
                  {/* Placeholder content for breeding tab */}
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
            
            {/* Dokumente Tab */}
            <TabsContent value="documents" className="space-y-4 py-4">
              {dog.documents && dog.documents.length > 0 && (
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
                        {dog.documents.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getFileIcon(doc.fileType)}
                                <span className="ml-2">{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {doc.type === 'pedigree' && 'Stammbaum'}
                              {doc.type === 'breeding' && 'Zuchtverband'}
                              {doc.type === 'exhibition' && 'Ausstellung'}
                              {doc.type === 'health' && 'Gesundheit'}
                              {doc.type === 'genetic' && 'Genetik'}
                              {doc.type === 'vaccination' && 'Impfung'}
                              {doc.type === 'litter' && 'Wurfabnahme'}
                            </TableCell>
                            <TableCell>{doc.date}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="text-zucht-blue">
                                <FileText className="h-4 w-4 mr-2" /> Anzeigen
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end">
                <Button className="bg-zucht-blue hover:bg-zucht-blue/90">
                  <FileText className="h-4 w-4 mr-2" /> Dokument hochladen
                </Button>
              </div>
            </TabsContent>
            
            {/* Medien Tab */}
            <TabsContent value="media" className="space-y-4 py-4">
              {dog.media && dog.media.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-4">Fotos & Videos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dog.media.map((item, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden bg-white">
                        <div className="h-40 bg-gray-100 flex items-center justify-center">
                          {item.fileType === 'jpg' || item.fileType === 'png' ? (
                            <Image className="h-12 w-12 text-gray-400" />
                          ) : (
                            <Video className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <div className="p-3">
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 flex justify-between mt-1">
                            <span>{item.date}</span>
                            <span className="capitalize">{item.type === 'photos' ? 'Foto' : 'Video'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <div className="flex justify-end mt-4">
                <Button className="bg-zucht-blue hover:bg-zucht-blue/90">
                  <Image className="h-4 w-4 mr-2" /> Medien hochladen
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default DogDetail;
