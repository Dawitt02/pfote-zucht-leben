
import React from 'react';
import { Providers } from '@/providers';

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Providers>{children}</Providers>;
};

export default AppWrapper;
