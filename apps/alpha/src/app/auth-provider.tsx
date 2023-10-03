import React from 'react';
import { AuthProvider } from './context/auth-context';
import { ViewportProvider } from '@alpha/app/context/viewport-context';

function AppProviders(props: any) {
  return (
    <AuthProvider>
      <ViewportProvider>{props.children}</ViewportProvider>
    </AuthProvider>
  );
}

export default AppProviders;
