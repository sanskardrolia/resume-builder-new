import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/shared/AppHeader';

export const metadata: Metadata = {
  title: 'ResuMatic - Build Your Perfect Resume',
  description: 'Create professional, ATS-friendly resumes with ease using ResuMatic.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        
        
        
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
        <footer className="py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ResuMatic. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
