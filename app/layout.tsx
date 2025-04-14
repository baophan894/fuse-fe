import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Providers } from './provider';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={lato.className}>
      <body className="overflow-hidden" suppressHydrationWarning={true}>
        <NextTopLoader showSpinner={false} />
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
