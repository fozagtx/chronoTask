"use client";

import { Button } from "@/components/ui/button";
import { Library, Plus, MessageCircle } from "lucide-react";
import { useUser, UserButton } from "@civic/auth/react";
import Image from "next/image";

interface NavbarProps {
  onNewCourse: () => void;
  onOpenLibrary: () => void;
  onOpenChat?: () => void;
}

export function Navbar({ onNewCourse, onOpenLibrary, onOpenChat }: NavbarProps) {
  const { user, signIn, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-1.5 sm:p-2">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="LearnLM"
              width={180}
              height={52}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full text-slate-600 hover:text-slate-900"
            >
              <a href="#faqs">FAQs</a>
            </Button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                {onOpenChat && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenChat}
                    className="rounded-full px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <MessageCircle className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Ask</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Library className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Library</span>
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full bg-orange-500 px-2.5 text-white hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">New</span>
                </Button>

                <div className="flex items-center pl-4">
                  <UserButton />
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn()}
                className="rounded-full h-9 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
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
