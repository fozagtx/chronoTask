"use client";

import { Button } from "@/components/ui/button";
import { Library, Plus } from "lucide-react";

interface HeaderBaseProps {
  onNewCourse?: () => void;
  onOpenLibrary?: () => void;
  showActions?: boolean;
}

export function HeaderBase({ onNewCourse, onOpenLibrary, showActions = true }: HeaderBaseProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full shadow-lg shadow-slate-200/50 px-2 py-2 flex items-center gap-1">
        {/* Logo */}
        <div className="flex items-center gap-2 pl-3 pr-4">
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

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* Nav Links */}
        <div className="flex items-center gap-1 px-2">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it Works
          </Button>
        </div>

        {showActions && (
          <>
            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* Actions */}
            <div className="flex items-center gap-2 pl-2 pr-1">
              <Button
                variant="ghost"
                onClick={onOpenLibrary}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
              >
                <Library className="w-4 h-4 mr-2" />
                Library
              </Button>
              <Button
                onClick={onNewCourse}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
