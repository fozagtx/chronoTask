"use client";

import { Link2, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Paste a URL",
    description: "Copy any YouTube video link and paste it into ChronoTask",
  },
  {
    icon: Sparkles,
    title: "AI Analysis",
    description: "Our AI breaks down the content into key concepts and actionable tasks",
  },
  {
    icon: CheckCircle2,
    title: "Learn & Track",
    description: "Follow your personalized study plan and track your progress",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            How it Works
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Transform any educational video into a structured learning experience in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <step.icon className="w-7 h-7 text-slate-700" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-heading">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 w-[calc(100%-200px)]">
          <div className="border-t-2 border-dashed border-slate-200" />
        </div>
      </div>
    </section>
  );
}
