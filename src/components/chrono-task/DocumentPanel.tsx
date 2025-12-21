"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, FileText, FileCheck } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DocumentPanelProps {
  fileName: string;
  pageCount?: number;
  concepts: string[];
}

export function DocumentPanel({ fileName, pageCount, concepts }: DocumentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Document Info Card */}
      <div className="relative w-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {fileName}
            </h3>
            <p className="text-orange-100 text-sm">
              {pageCount ? `${pageCount} page${pageCount > 1 ? "s" : ""}` : "PDF Document"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-orange-100 text-sm">
          <FileText className="w-4 h-4" />
          <span>Document analyzed and ready for study</span>
        </div>
      </div>

      {/* Key Concepts Card */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
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
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-white">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {concept}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
