
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Moon, Sun, Menu } from 'lucide-react'; // Added Menu icon
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added Sheet components

export function AppHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/builder", label: "Builder" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b matte-glass-surface">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl md:text-2xl font-semibold text-foreground">
          <FileText className="h-7 w-7" />
          <span>Fresher Resume Builder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isMounted ? (
              theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
            ) : (
              <span className="h-5 w-5" /> 
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="h-6 w-6" />
                    <span>ResuMatic</span>
                  </Link>
                </div>
                <nav className="flex-grow p-6 space-y-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center py-2 px-3 rounded-md text-base font-medium transition-colors
                          ${pathname === link.href 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="p-6 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2" 
                    onClick={() => {
                      toggleTheme();
                      // setIsMobileMenuOpen(false); // Optionally close menu on theme toggle
                    }} 
                    aria-label="Toggle theme"
                  >
                    {isMounted ? (
                      theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
                    ) : (
                      <span className="h-5 w-5" />
                    )}
                    <span>Toggle Theme</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
