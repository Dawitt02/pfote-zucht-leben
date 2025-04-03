
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="flex flex-col h-full bg-zucht-cream">
      <main className="flex-1 overflow-auto pb-16">
        <div className="app-container">
          <Dashboard />
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default Index;
