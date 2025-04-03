
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentUploadProps {
  fieldLabel: string;
  category: string;
  onDocumentUpload: (document: {
    name: string;
    category: string;
    fileUrl: string;
    date: string;
    fileType: string;
  }) => void;
  documentInfo?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  fieldLabel,
  category,
  onDocumentUpload,
  documentInfo
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

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
    
    // In a real application, this would upload the file to a server
    // and get a URL back. For now, we'll create a fake URL.
    const fakeUrl = URL.createObjectURL(selectedFile);
    
    onDocumentUpload({
      name: documentName || selectedFile.name,
      category,
      fileUrl: fakeUrl,
      date: currentDate,
      fileType
    });
    
    toast({
      title: "Dokument hochgeladen",
      description: `${documentName || selectedFile.name} wurde erfolgreich hochgeladen.`,
    });
    
    setSelectedFile(null);
    setDocumentName('');
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <Label htmlFor={category}>{fieldLabel}</Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="flex items-center text-xs"
            >
              <Upload className="h-3 w-3 mr-1" /> Dokument
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Dokument hochladen</DialogTitle>
              <DialogDescription>
                Laden Sie ein Dokument für {fieldLabel} hoch.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`${category}-name`} className="text-right">
                    Name
                  </Label>
                  <Input
                    id={`${category}-name`}
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Name des Dokuments"
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`${category}-file`} className="text-right">
                    Datei
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id={`${category}-file`}
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
      
      <Input 
        id={category} 
        placeholder={fieldLabel}
        value={documentInfo || ''}
        readOnly={!!documentInfo}
        className={documentInfo ? "bg-gray-50" : ""}
      />
      
      {documentInfo && (
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <File className="h-3 w-3 mr-1" /> 
          <span>{documentInfo}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
