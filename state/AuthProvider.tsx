'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/state/authState';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  useEffect(() => {
    hydrateAuth().then(() => {
        console.log('Hydrated Zustand state:', useAuthStore.getState());
    });
  }, [hydrateAuth]);

  return <>{children}</>;
};

export default AuthProvider;