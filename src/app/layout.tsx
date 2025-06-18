
import type {Metadata} from 'next';
// Removed Script import as GoogleAnalytics component is used
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/shared/AppHeader';
import { ThemeProvider } from '@/context/ThemeContext';
import { GoogleAnalytics } from '@next/third-parties/google';
import { CustomCursor } from '@/components/shared/CustomCursor'; // Added import

export const metadata: Metadata = {
  title: 'Fresher Resume Builder - Build Your Perfect Resume',
  description: 'Create professional, ATS-friendly resumes with ease using Fresher Resume Builder.',
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
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <CustomCursor /> {/* Added CustomCursor component */}
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
