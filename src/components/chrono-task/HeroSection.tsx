"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { FloatingCards } from "./FloatingCards";

interface HeroSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string;
}

export function HeroSection({ onSubmit, isLoading, error: externalError }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

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
    <section className="min-h-screen dot-pattern relative overflow-hidden">
      {/* Floating Decorative Cards */}
      <FloatingCards />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-4 animate-float-in font-heading">
          Turn videos into action
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-500 text-center mb-12 max-w-lg animate-float-in-delay-1">
          Paste a YouTube URL and let AI create your personalized study plan
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl animate-float-in-delay-2"
        >
          <div className="relative flex items-center gap-2 bg-white rounded-full shadow-lg p-2 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex-1 flex items-center">
              <Sparkles className="w-5 h-5 text-slate-400 ml-4 mr-3 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                className="flex-1 h-12 border-0 shadow-none text-base placeholder:text-slate-400 focus-visible:ring-0 bg-transparent"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating
                </>
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
            <p className="text-red-500 text-sm mt-3 text-center animate-float-in">
              {displayError}
            </p>
          )}
        </form>

        {/* Helper Text */}
        <p className="text-sm text-slate-400 mt-6 animate-float-in-delay-3">
          Works with any YouTube educational video
        </p>
      </div>
    </section>
  );
}
