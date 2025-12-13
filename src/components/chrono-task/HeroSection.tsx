"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { useUser } from "@civic/auth/react";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string;
}

export function HeroSection({ onSubmit, isLoading, error: externalError }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const { user, signIn, isLoading: authLoading } = useUser();

  const displayError = externalError || error;

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    onSubmit(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16">
        {/* Logo Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-4 tracking-tight">
          Turn videos into action
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-500 text-center mb-12 max-w-md">
          Paste a YouTube URL to generate your study plan
        </p>

        {/* Input Form or Sign In Prompt */}
        {authLoading ? (
          <div className="flex items-center justify-center gap-3 bg-white rounded-full shadow-lg shadow-slate-200/50 px-8 py-4">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            <span className="text-slate-500">Loading...</span>
          </div>
        ) : user ? (
          <form onSubmit={handleSubmit} className="w-full max-w-xl">
            <div className="flex items-center gap-2 bg-white rounded-full shadow-lg shadow-slate-200/50 p-2 border border-slate-100">
              <Input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                className="flex-1 h-12 border-0 shadow-none text-base placeholder:text-slate-400 focus-visible:ring-0 bg-transparent px-4 rounded-full"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-sm font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Generate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {displayError && (
              <p className="text-red-500 text-sm mt-3 text-center">
                {displayError}
              </p>
            )}
          </form>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-slate-500 text-center">
              Sign in to start creating your study plans
            </p>
            <Button
              onClick={() => signIn()}
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/20 font-medium"
            >
              Sign in with Google
            </Button>
          </div>
        )}

        {/* Helper Text */}
        <p className="text-sm text-slate-400 mt-8">
          Works with any YouTube educational video
        </p>
      </div>
    </div>
  );
}
