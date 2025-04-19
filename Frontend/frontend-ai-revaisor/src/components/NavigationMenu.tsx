"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      <Link href="/">
        <Button variant="ghost" className="text-xl font-bold">
          RevAIsor
        </Button>
      </Link>

      <Link href="/" className="px-3 py-2 text-sm font-medium">
        Home
      </Link>

      {/* Simple dropdown without any external dependencies */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 text-sm font-medium">
          Admin
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-background shadow-lg z-50">
            <Link
              href="/admin/feedback"
              className="block px-4 py-2 text-sm hover:bg-accent"
              onClick={() => setIsOpen(false)}>
              Feedback
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainNav;
