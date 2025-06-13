"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b matte-glass-surface">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-semibold">
          <FileText className="h-7 w-7 text-primary" />
          <span>ResuMatic</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant={pathname === '/' ? "default" : "ghost"} asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant={pathname === '/builder' ? "default" : "ghost"} asChild>
            <Link href="/builder">Builder</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
