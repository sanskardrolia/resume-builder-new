
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme

export function AppHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b matte-glass-surface">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-semibold">
          <FileText className="h-7 w-7 text-primary" />
          <span>ResuMatic</span>
        </Link>
        <nav className="flex items-center gap-2"> {/* Reduced gap for tighter packing */}
          <Button variant={pathname === '/' ? "default" : "ghost"} asChild size="sm">
            <Link href="/">Home</Link>
          </Button>
          <Button variant={pathname === '/builder' ? "default" : "ghost"} asChild size="sm">
            <Link href="/builder">Builder</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}

    