
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import AppWrapper from '@/components/AppWrapper';

export default function Index() {
  return (
    <AppWrapper>
      <div className="flex flex-col h-full bg-zucht-cream">
        <main className="flex-1 overflow-auto pb-16">
          <div className="app-container">
            <Dashboard />
          </div>
        </main>
        <Navbar />
      </div>
    </AppWrapper>
  );
}
