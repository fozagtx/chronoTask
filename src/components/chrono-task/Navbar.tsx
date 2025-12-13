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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Rounded container */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M4.93 4.93l2.83 2.83" />
                <path d="M16.24 16.24l2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">
              LearnLM
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-3 h-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm"
                >
                  <Library className="w-4 h-4 mr-1.5" />
                  Library
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full px-3 h-8 bg-orange-500 hover:bg-orange-600 text-white text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.picture} alt={user.name || "User"} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="rounded-full h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn({ displayMode: "iframe", iframeMode: "modal" })}
                className="rounded-full px-5 h-8 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
