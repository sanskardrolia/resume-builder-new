import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Standard Tailwind md breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Handler to call on window resize or initial load
    const handleResize = () => {
      // Set the state based on whether window.innerWidth is less than the breakpoint
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check if window is defined (ensures code runs only in client-side)
    if (typeof window !== 'undefined') {
      // Set the initial value
      handleResize();
      
      // Add event listener for window resize
      window.addEventListener('resize', handleResize);
      
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures effect is only run on mount and unmount

  return isMobile === undefined ? true : isMobile; // Default to true (mobile) if undefined, to prevent flash of desktop styles
}
