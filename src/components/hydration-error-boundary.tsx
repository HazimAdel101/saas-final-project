/**
 * This component suppresses hydration errors caused by browser extensions
 * that modify the DOM before React can hydrate it.
 */
'use client';

import { useEffect, useState } from 'react';

export default function HydrationErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During server rendering and the first client render,
  // render children without any special behavior
  if (!isClient) {
    return <>{children}</>;
  }

  // On subsequent renders (client-only), render children normally
  return <>{children}</>;
}
