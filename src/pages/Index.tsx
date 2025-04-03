
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Index() {
  return (
    <div className="flex flex-col h-screen bg-zucht-cream">
      <main className="flex-1 overflow-hidden pb-16">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="app-container">
            <Dashboard />
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
}
