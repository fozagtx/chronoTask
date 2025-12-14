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

export function Navbar({
  onNewCourse,
  onOpenLibrary,
  onOpenChat,
}: NavbarProps) {
  const { user, signIn, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-1.5 sm:p-2">
      <div className="flex justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg shadow-slate-300/50 border border-slate-100 flex items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <Image
              src="/app-icon.svg"
              alt="LearnLM"
              width={28}
              height={28}
              className="h-7 w-7"
              priority
            />
            <span className="font-semibold text-slate-800 text-sm">LearnLM</span>
          </div>

          <a
            href="#faqs"
            className="hidden sm:inline-flex items-center rounded-full px-3 h-8 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            FAQ
          </a>

          <div className="flex items-center gap-1.5 shrink-0">
            {isLoading ? (
              <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                {onOpenChat && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenChat}
                    className="rounded-full px-2 h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <MessageCircle className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Ask</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenLibrary}
                  className="rounded-full px-2 h-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Library className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Library</span>
                </Button>
                <Button
                  size="sm"
                  onClick={onNewCourse}
                  className="rounded-full bg-orange-500 px-2 h-8 text-white hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">New</span>
                </Button>
                <div className="flex items-center pl-1">
                  <UserButton />
                </div>
              </>
            ) : (
              <Button
                onClick={() => signIn()}
                className="rounded-full h-8 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
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
