'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { AppProgressBar } from 'next-nprogress-bar';
import { Toaster } from 'sonner';
import { store } from '@/store';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <React.Suspense>
      <NextThemesProvider {...themeProps}>
        <AppProgressBar
          shallowRouting
          color="#13D0B4"
          height="4px"
          options={{ showSpinner: false }}
        />
        <Provider store={store}>
          <Toaster closeButton richColors position="top-right" />
          {children},
        </Provider>
      </NextThemesProvider>
    </React.Suspense>
  );
}
