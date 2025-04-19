"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}>
      {children}
    </Link>
  );
}

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

function NavDropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1">
        {trigger}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "transform rotate-180"
          )}
        />
      </Button>

      {open && (
        <div className="absolute z-10 mt-1 w-48 rounded-md bg-popover border shadow-lg">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/">
        <Button variant="ghost" className="text-xl font-bold">
          RevAIsor
        </Button>
      </Link>

      <div className="flex items-center space-x-2">
        <NavLink href="/">Home</NavLink>

        <NavDropdown trigger="Admin">
          <NavLink href="/admin/feedback" className="block w-full">
            Feedback
          </NavLink>
        </NavDropdown>
      </div>
    </div>
  );
}

export default MainNav;
