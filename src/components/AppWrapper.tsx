
import React from 'react';
import { Providers, useProvidersInitialized } from '@/providers';

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We'll always wrap with Providers to ensure they're available
  return <Providers>{children}</Providers>;
};

export default AppWrapper;
