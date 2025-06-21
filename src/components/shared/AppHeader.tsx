
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Moon, Sun, Menu, Share2, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FeedbackDialog } from '../builder/FeedbackDialog';
import { ShareDialog } from '../builder/ShareDialog';

export function AppHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/builder", label: "Builder" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b matte-glass-surface">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-headline text-xl md:text-2xl font-semibold text-foreground">
            <FileText className="h-7 w-7" />
            <span>MakeItResume</span>
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
            <Button variant="outline" size="sm" onClick={() => setIsFeedbackDialogOpen(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
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
                  <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                        <FileText className="h-6 w-6" />
                        <span>MakeItResume</span> 
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
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
                      className="w-full justify-start gap-2 mb-2"
                      onClick={() => {
                        setIsFeedbackDialogOpen(true);
                        setIsMobileMenuOpen(false);
                      }} 
                      aria-label="Give feedback"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Feedback</span>
                    </Button>
                     <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 mb-2"
                      onClick={() => {
                        setIsShareDialogOpen(true);
                        setIsMobileMenuOpen(false);
                      }} 
                      aria-label="Share the app"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2" 
                      onClick={() => {
                        toggleTheme();
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
      <FeedbackDialog isOpen={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />
      <ShareDialog isOpen={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} />
    </>
  );
}
