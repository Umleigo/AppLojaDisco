import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/store';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Loja de Disco',
  description: 'Um aplicativo moderno para gerenciamento de loja de discos de vinil.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <StoreProvider>
          <AppLayout>{children}</AppLayout>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
