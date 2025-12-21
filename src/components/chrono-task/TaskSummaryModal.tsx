"use client";

import { useState } from "react";
import { X, Check, Clock, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "./TaskItem";

interface TaskSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onComplete: (taskId: string) => void;
  onNext: () => void;
  hasNext: boolean;
  concepts?: string[];
  content?: string;
}

export function TaskSummaryModal({
  isOpen,
  onClose,
  task,
  onComplete,
  onNext,
  hasNext,
  concepts = [],
  content,
}: TaskSummaryModalProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !task) return null;

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate brief loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    onComplete(task.id);
    setIsCompleting(false);
  };

  const handleCompleteAndNext = () => {
    handleComplete();
    if (hasNext) {
      // Small delay to show completion animation
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  // Extract relevant concepts related to the task
  const relatedConcepts = concepts.slice(0, 3); // Show top 3 concepts

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-float-in sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-orange-50 to-orange-100/50 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                Task Summary
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {task.duration} estimated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Task Title */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                {task.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{task.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Interactive Task</span>
                </div>
              </div>
            </div>

            {/* Key Concepts */}
            {relatedConcepts.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">
                  Key Concepts to Review
                </h4>
                <div className="space-y-2">
                  {relatedConcepts.map((concept, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                      <span className="text-slate-700 text-sm sm:text-base">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Details Preview */}
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-semibold text-slate-900 text-sm sm:text-base">Task Details</h4>
                <span className="text-xs sm:text-sm text-slate-500">
                  {isExpanded ? "Hide" : "Show"} details
                </span>
              </button>

              {isExpanded && (
                <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    {content
                      ? "This task focuses on applying the concepts you've learned. Take your time to understand each step and ensure you grasp the underlying principles before moving forward."
                      : "This interactive task will help reinforce your understanding of the key concepts. Follow the steps carefully and don't hesitate to review the material if needed."}
                  </p>
                  {content && (
                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Tip: Refer back to the document content if you need
                        clarification on any concepts.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 text-sm sm:text-base">
                    Ready to complete this task?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Mark as complete to track your progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 bg-slate-50 p-3 sm:p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 w-full sm:w-auto text-sm"
          >
            Review Later
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 flex-1 sm:flex-initial text-sm"
            >
              {isCompleting ? (
                <Loader2 className="w-4 h-4 animate-spin sm:mr-2" />
              ) : (
                <Check className="w-4 h-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Complete</span>
              <span className="sm:hidden">Done</span>
            </Button>

            <Button
              onClick={handleCompleteAndNext}
              disabled={isCompleting}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1 sm:flex-initial text-sm"
            >
              {isCompleting ? (
                <Loader2 className="w-4 h-4 animate-spin sm:mr-2" />
              ) : (
                <>
                  <span className="hidden sm:inline">Complete & Continue</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
