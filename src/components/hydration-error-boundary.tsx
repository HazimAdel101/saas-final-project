/**
 * This component suppresses hydration errors caused by browser extensions
 * that modify the DOM before React can hydrate it.
 */
'use client';

import { useHydration } from '@/hooks/use-hydration';
import { useEffect } from 'react';

export default function HydrationErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useHydration();

  useEffect(() => {
    // Additional cleanup specifically for bis_skin_checked attributes
    const cleanupBisAttributes = () => {
      const elements = document.querySelectorAll('*[bis_skin_checked]');
      elements.forEach(element => {
        element.removeAttribute('bis_skin_checked');
      });
    };

    // Run cleanup immediately and on interval
    cleanupBisAttributes();
    const interval = setInterval(cleanupBisAttributes, 100);

    // Clean up interval after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // During server rendering and initial hydration, render children normally
  // The useHydration hook will handle cleanup of browser extension attributes
  return <>{children}</>;
}
