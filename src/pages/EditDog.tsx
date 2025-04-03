
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useDogs } from '@/context/DogContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import DogFormWithDocuments from '@/components/DogFormWithDocuments';

const EditDog = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { dogs } = useDogs();
  
  // Find the current dog to edit
  const currentDog = dogs.find(dog => dog.id === id);
  
  useEffect(() => {
    if (!currentDog) {
      toast.error("Hund nicht gefunden");
      navigate('/dogs');
    }
  }, [currentDog, navigate]);

  if (!currentDog) {
    return (
      <div className="flex flex-col min-h-screen bg-zucht-cream">
        <main className="flex-1 flex items-center justify-center">
          <p>Laden...</p>
        </main>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zucht-cream">
      <main className="flex-1 overflow-hidden pb-28">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="app-container">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate(`/dogs/${id}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Hund bearbeiten</h1>
            </div>
            
            <DogFormWithDocuments initialData={currentDog} mode="edit" />
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
};

export default EditDog;
