
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/shared/AppHeader';
import { ThemeProvider } from '@/context/ThemeContext'; // Import ThemeProvider

export const metadata: Metadata = {
  title: 'Fresher Resume Builder - Build Your Perfect Resume', // Changed name
  description: 'Create professional, ATS-friendly resumes with ease using Fresher Resume Builder.', // Changed name
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider> {/* Wrap with ThemeProvider */}
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

    