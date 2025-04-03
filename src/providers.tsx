
import React, { createContext, useContext } from 'react';
import { DogProvider } from './context/DogContext';

// This context helps us track if the providers are initialized
const ProvidersInitializedContext = createContext(false);

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProvidersInitializedContext.Provider value={true}>
      <DogProvider>
        {children}
      </DogProvider>
    </ProvidersInitializedContext.Provider>
  );
};

// Use this in the top level components to ensure providers are initialized
export const useProvidersInitialized = () => {
  return useContext(ProvidersInitializedContext);
};
