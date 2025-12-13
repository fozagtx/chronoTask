"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VideoPanelProps {
  videoId: string;
  concepts: string[];
}

export function VideoPanel({ videoId, concepts }: VideoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Video Embed */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl shadow-md overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Key Concepts Card */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2563EB]/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 font-heading">
                    Key Concepts
                  </h3>
                  <p className="text-sm text-slate-500">
                    {concepts.length} concepts identified
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-5 pb-5 space-y-3 animate-float-in">
              {concepts.map((concept, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-white">{index + 1}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
