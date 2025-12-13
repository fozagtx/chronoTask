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
  transcript?: string;
}

export function TaskSummaryModal({
  isOpen,
  onClose,
  task,
  onComplete,
  onNext,
  hasNext,
  concepts = [],
  transcript,
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
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-orange-50 to-orange-100/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Task Summary
              </h2>
              <p className="text-sm text-slate-600">
                {task.duration} estimated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Task Title */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {task.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{task.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Interactive Task</span>
                </div>
              </div>
            </div>

            {/* Key Concepts */}
            {relatedConcepts.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">
                  Key Concepts to Review
                </h4>
                <div className="space-y-2">
                  {relatedConcepts.map((concept, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="text-slate-700">{concept}</span>
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
                <h4 className="font-semibold text-slate-900">Task Details</h4>
                <span className="text-sm text-slate-500">
                  {isExpanded ? "Hide" : "Show"} details
                </span>
              </button>

              {isExpanded && (
                <div className="mt-3 p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {transcript
                      ? "This task focuses on applying the concepts you've learned. Take your time to understand each step and ensure you grasp the underlying principles before moving forward."
                      : "This interactive task will help reinforce your understanding of the key concepts. Follow the steps carefully and don't hesitate to review the material if needed."}
                  </p>
                  {transcript && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        💡 Tip: Refer back to the video content if you need
                        clarification on any concepts.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Ready to complete this task?
                  </p>
                  <p className="text-sm text-slate-600">
                    Mark as complete to track your progress and move forward
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900"
          >
            Review Later
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              {isCompleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Complete
            </Button>

            <Button
              onClick={handleCompleteAndNext}
              disabled={isCompleting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isCompleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <>
                  Complete & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
