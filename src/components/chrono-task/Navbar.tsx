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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-5 py-3 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="LearnLM"
              width={180}
              height={52}
              className="h-12 w-auto"
              priority
            />
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full text-slate-600 hover:text-slate-900"
            >
              <a href="#faqs">FAQs</a>
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Library className="w-4 h-4 mr-1" />
                  Library
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full px-3 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>

                <div className="flex items-center pl-1">
                  <UserButton />
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn()}
                className="rounded-full h-9 px-7 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
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
