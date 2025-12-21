"use client";

import {
  ListChecks,
  Youtube,
  Brain,
  Target,
  Zap,
  BookOpen,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundGradient } from "./BackgroundGradient";
import { TextShimmer } from "@/components/prompt-kit";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Premium gradient background */}
      <BackgroundGradient />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] px-6 pt-24 pb-8">
        {/* Backed by badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <TextShimmer className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Backed by bolt.new • minimax
            </TextShimmer>
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 text-center mb-4 tracking-tight">
          Turn{" "}
          <span className="inline-flex items-center align-middle" aria-hidden>
            <Image
              src="/youtube-icon.svg"
              alt=""
              width={56}
              height={40}
              className="w-[1.4em] h-[1em]"
            />
          </span>
          <span className="sr-only">YouTube </span> videos into action
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-slate-500 dark:text-slate-400 text-center max-w-md">
          Transform YouTube videos into personalized study plans
        </p>
      </div>

      {/* Demo Video Card */}
      <div className="relative z-10 px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="aspect-video relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/HahyRY6H7TA?autoplay=1&mute=1&loop=1&playlist=HahyRY6H7TA"
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
            Features
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-lg mx-auto">
            Everything you need to transform passive video watching into active
            learning
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Instant Analysis
              </h3>
              <p className="text-slate-500 text-sm">
                AI extracts key concepts in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Smart Tasks</h3>
              <p className="text-slate-500 text-sm">
                Actionable learning checklist
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Save Time</h3>
              <p className="text-slate-500 text-sm">
                No more rewatching videos
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Track Progress
              </h3>
              <p className="text-slate-500 text-sm">Visual learning progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - Bento Grid */}
      <div className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 - Large */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Youtube className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                1. Paste a YouTube URL
              </h3>
              <p className="text-slate-500 text-sm">
                Drop any educational video link and our AI will analyze the
                content, extracting key concepts and learning objectives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-orange-100 text-sm">
                Smart extraction of topics, concepts, and actionable tasks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Get Tasks</h3>
              <p className="text-slate-400 text-sm">
                Receive a structured checklist of actionable learning tasks.
              </p>
            </div>

            {/* Step 4 - Large */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                4. Track Progress
              </h3>
              <p className="text-slate-500 text-sm">
                Check off tasks as you complete them, save courses to your
                library, and build a consistent learning habit with visual
                progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div id="faqs" className="relative z-10 px-6 py-16 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">
            FAQs
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
            Everything you need to know before turning YouTube videos into a
            study plan.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="px-6">
                <AccordionTrigger className="text-left">
                  What does ChronoTask (LearnLM) do?
                </AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Paste a YouTube link and the app extracts key concepts and
                  generates an actionable checklist so you can learn by doing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="px-6">
                <AccordionTrigger className="text-left">
                  Which YouTube videos are supported?
                </AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Most public educational videos work. If a video has captions
                  available, the results are usually best.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="px-6">
                <AccordionTrigger className="text-left">
                  Do you save my videos or progress?
                </AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Your saved courses and task progress are stored locally in
                  your browser so you can pick up where you left off.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="px-6">
                <AccordionTrigger className="text-left">
                  Can I export what the AI generates?
                </AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  Yes. You can generate slides and export summaries to share or
                  study offline.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="px-6">
                <AccordionTrigger className="text-left">
                  Is it free to use?
                </AccordionTrigger>
                <AccordionContent className="text-slate-500">
                  The app may have usage limits depending on AI costs. If you
                  hit a limit, try again later.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Image
                src="/app-icon.svg"
                alt="LearnLM"
                width={48}
                height={48}
                className="h-10 w-10"
              />
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
