
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/shared/AppHeader';
import { ThemeProvider } from '@/context/ThemeContext';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CustomCursor } from '@/components/shared/CustomCursor';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId='G-NW9ZSDMP25'/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <CustomCursor />
          <AppHeader />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <footer className="py-6 text-center text-sm text-muted-foreground">
            Made with ❤️ by <a href="https://www.linkedin.com/in/sanskardrolia/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Sanskar Drolia</a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
