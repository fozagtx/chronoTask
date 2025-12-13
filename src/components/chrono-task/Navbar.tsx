"use client";

import { Button } from "@/components/ui/button";
import { Library, Plus } from "lucide-react";
import { useUser, UserButton } from "@civic/auth/react";
import Image from "next/image";

interface NavbarProps {
  onNewCourse: () => void;
  onOpenLibrary: () => void;
}

export function Navbar({ onNewCourse, onOpenLibrary }: NavbarProps) {
  const { user, signIn, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-2">
      <div className="max-w-md mx-auto">
        {/* Rounded container */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-slate-100 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="LearnLM"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isLoading ? (
              <div className="w-6 h-6 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-2 h-6 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[10px]"
                >
                  <Library className="w-3 h-3 mr-0.5" />
                  Library
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full px-2 h-6 bg-orange-500 hover:bg-orange-600 text-white text-[10px]"
                >
                  <Plus className="w-3 h-3 mr-0.5" />
                  New
                </Button>

                <div className="flex items-center gap-2 pl-1">
                  <div className="flex flex-col items-end leading-tight max-w-[140px]">
                    <p className="text-[10px] font-medium text-slate-700 truncate">
                      {user.name || user.email || "Signed in"}
                    </p>
                    {user.name && user.email && (
                      <p className="text-[9px] text-slate-500 truncate">{user.email}</p>
                    )}
                  </div>
                  <UserButton />
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn()}
                className="rounded-full px-3 h-6 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-medium"
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
