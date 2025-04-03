
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './Navbar';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-zucht-cream">
      <main className="flex-1 overflow-hidden pb-20">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className={isMobile ? "px-3 py-4 pb-16" : "container mx-auto px-4 py-6 pb-16 max-w-5xl"}>
            {children}
          </div>
        </ScrollArea>
      </main>
      <Navbar />
    </div>
  );
};

export default MobileContainer;
