"use client";

import { Button } from "@/components/ui/button";
import { Library, Plus } from "lucide-react";

interface NavbarProps {
  onNewCourse: () => void;
  onOpenLibrary: () => void;
}

export function Navbar({ onNewCourse, onOpenLibrary }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <span className="font-semibold text-slate-900 text-lg font-heading">
            ChronoTask
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={onOpenLibrary}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Library className="w-4 h-4 mr-2" />
            My Library
          </Button>
          <Button 
            onClick={onNewCourse}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>
    </nav>
  );
}
