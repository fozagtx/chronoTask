"use client";

import { Play, ListChecks, Sparkles, Youtube, Brain, Target } from "lucide-react";

export function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 pt-20">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 text-center mb-4 tracking-tight">
          Turn videos into action
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-500 text-center max-w-md mb-4">
          Transform YouTube videos into personalized study plans
        </p>

        {/* Helper Text */}
        <p className="text-sm text-slate-400">
          Sign in to get started
        </p>
      </div>

      {/* How It Works - Bento Grid */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 - Large */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Youtube className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Paste a YouTube URL</h3>
              <p className="text-slate-500 text-sm">Drop any educational video link and our AI will analyze the content, extracting key concepts and learning objectives.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-orange-100 text-sm">Smart extraction of topics, concepts, and actionable tasks.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Get Tasks</h3>
              <p className="text-slate-400 text-sm">Receive a structured checklist of actionable learning tasks.</p>
            </div>

            {/* Step 4 - Large */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4. Track Progress</h3>
              <p className="text-slate-500 text-sm">Check off tasks as you complete them, save courses to your library, and build a consistent learning habit with visual progress tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-slate-800 text-sm">LearnLM</span>
            </div>
            <p className="text-slate-400 text-sm">
              Transform how you learn from videos
            </p>
            <p className="text-slate-400 text-xs">
              &copy; {new Date().getFullYear()} LearnLM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
