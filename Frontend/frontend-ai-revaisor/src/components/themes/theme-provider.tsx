"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";


/**
 * This component wraps the NextThemesProvider to handle theme switching
 * and hydration issues in a Next.js application.
 *
 * @param {ThemeProviderProps} props - The props for the NextThemesProvider.
 * @returns {JSX.Element} - The wrapped component with theme support.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Only run this effect on the client side
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, render children without any theme classes
  // to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
