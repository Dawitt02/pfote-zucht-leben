import React, { useEffect } from 'react';
import { Providers, useProvidersInitialized } from '@/providers';

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const providersInitialized = useProvidersInitialized();

  // If providers are not initialized, wrap with Providers
  if (!providersInitialized) {
    return <Providers>{children}</Providers>;
  }

  // Otherwise, just render children
  return <>{children}</>;
};

export default AppWrapper;
