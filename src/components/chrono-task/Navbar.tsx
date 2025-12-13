"use client";

import { Button } from "@/components/ui/button";
import { Library, Plus, LogOut } from "lucide-react";
import { useUser } from "@civic/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onNewCourse: () => void;
  onOpenLibrary: () => void;
}

export function Navbar({ onNewCourse, onOpenLibrary }: NavbarProps) {
  const { user, signIn, signOut, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="font-semibold text-slate-800 text-lg tracking-tight">
            LearnLM
          </span>
        </div>

        {/* Actions - All in one row */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <>
              {/* Pill-shaped action bar for logged in users */}
              <div className="flex items-center gap-1 bg-slate-100/80 rounded-full p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-4 h-9 text-slate-600 hover:text-slate-900 hover:bg-white/80"
                >
                  <Library className="w-4 h-4 mr-2" />
                  Library
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full px-4 h-9 bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>

              {/* User avatar with dropdown feel */}
              <div className="flex items-center gap-2 ml-2">
                <Avatar className="w-9 h-9 ring-2 ring-slate-100">
                  <AvatarImage src={user.picture} alt={user.name || "User"} />
                  <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="rounded-full h-9 w-9 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => signIn()}
              className="rounded-full px-6 h-10 bg-orange-500 hover:bg-orange-600 text-white shadow-sm font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
