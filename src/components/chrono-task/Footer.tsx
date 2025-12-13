"use client";

import { Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <span className="font-semibold text-slate-900 font-heading">ChronoTask</span>
              <p className="text-sm text-slate-500">Turn videos into action</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How it Works
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400">
            {currentYear} ChronoTask. Built with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
