
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DogProvider } from './context/DogContext';
import AppWrapper from './components/AppWrapper';
import Dashboard from './components/Dashboard';
import DogProfiles from './pages/DogProfiles';
import DogDetail from './pages/DogDetail';
import AddDog from './pages/AddDog';
import EditDog from './pages/EditDog';
import Health from './pages/Health';
import Breeding from './pages/Breeding';
import BreedingDogProfile from './pages/BreedingDogProfile';
import LitterDetail from './pages/LitterDetail';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DogProvider>
        <Router>
          <AppWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dogs" element={<DogProfiles />} />
              <Route path="dogs/:dogId" element={<DogDetail />} />
              <Route path="dogs/add" element={<AddDog />} />
              <Route path="dogs/:dogId/edit" element={<EditDog />} />
              <Route path="health" element={<Health />} />
              <Route path="breeding" element={<Breeding />} />
              <Route path="breeding/dog/:dogId" element={<BreedingDogProfile />} />
              <Route path="breeding/litter/:litterId" element={<LitterDetail />} />
              <Route path="community" element={<Community />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppWrapper>
        </Router>
      </DogProvider>
    </QueryClientProvider>
  );
}

export default App;
