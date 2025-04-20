"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";


// This component toggles between light and dark themes using the next-themes library
// It uses the useTheme hook to access the current theme and the setTheme function to change it
export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Only show once component has mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md border bg-background shadow-lg z-50">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent">
            Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent">
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent">
            System
          </button>
        </div>
      )}
    </div>
  );
}
