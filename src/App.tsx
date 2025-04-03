
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DogProvider } from "./context/DogContext";
import Index from "./pages/Index";
import DogProfiles from "./pages/DogProfiles";
import DogDetail from "./pages/DogDetail";
import AddDog from "./pages/AddDog";
import EditDog from "./pages/EditDog";
import Breeding from "./pages/Breeding";
import Health from "./pages/Health";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DogProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dogs" element={<DogProfiles />} />
              <Route path="/dogs/add" element={<AddDog />} />
              <Route path="/dogs/:id" element={<DogDetail />} />
              <Route path="/dogs/:id/edit" element={<EditDog />} />
              <Route path="/dogs/:id/documents" element={<DogProfiles />} />
              <Route path="/breeding" element={<Breeding />} />
              <Route path="/breeding/cycles" element={<Breeding />} />
              <Route path="/breeding/litters" element={<Breeding />} />
              <Route path="/health" element={<Health />} />
              <Route path="/community" element={<Community />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DogProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
