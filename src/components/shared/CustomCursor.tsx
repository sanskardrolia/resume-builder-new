
'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile'; // Corrected import path
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove('custom-cursor-active');
      setIsVisible(false); // Ensure it's not visible on mobile
      return;
    }

    // Only set active and visible if not mobile from the start
    if (!isVisible && !isMobile) {
        setIsVisible(true);
        document.body.classList.add('custom-cursor-active');
    }


    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"], input[type="button"], input[type="submit"]')) {
        setIsHoveringInteractive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
       if ((e.target as HTMLElement).closest('a, button, [role="button"], input[type="button"], input[type="submit"]')) {
        setIsHoveringInteractive(false);
      }
    };
    
    // Add listeners only if not mobile
    if (!isMobile) {
        window.addEventListener('mousemove', updateMousePosition);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      // Only remove if it was potentially added
      if (!isMobile) {
        document.body.classList.remove('custom-cursor-active');
      }
    };
  }, [isMobile, isVisible]); // isVisible ensures setup runs once it should be visible

  if (isMobile || !isVisible) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'custom-cursor-dot',
          isHoveringInteractive && 'custom-cursor-dot-interactive'
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0, // Control visibility via opacity for smooth transition
        }}
      />
      <div
        className={cn(
          'custom-cursor-outline',
          isHoveringInteractive && 'custom-cursor-outline-interactive'
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0, // Control visibility via opacity
        }}
      />
    </>
  );
}
