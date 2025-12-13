"use client";

import { VideoPanel } from "./VideoPanel";
import { TaskPanel } from "./TaskPanel";
import { Task } from "./TaskItem";
import { AskWidget } from "./AskWidget";
import { Button } from "@/components/ui/button";
import { Bookmark, Presentation, Check } from "lucide-react";

interface LearningDashboardProps {
  videoId: string;
  concepts: string[];
  tasks: Task[];
  transcript?: string;
  videoTitle?: string;
  onToggleTask: (id: string) => void;
  onSaveCourse: () => void;
  onOpenSlides: () => void;
  isSaved?: boolean;
}

export function LearningDashboard({
  videoId,
  concepts,
  tasks,
  transcript,
  videoTitle,
  onToggleTask,
  onSaveCourse,
  onOpenSlides,
  isSaved = false,
}: LearningDashboardProps) {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-6 px-4 sm:pt-20 sm:pb-8 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Action Bar - Pill shaped container */}
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSlides}
              className="rounded-full px-4 h-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Presentation className="w-4 h-4 mr-2" />
              Slides
            </Button>
            <Button
              size="sm"
              onClick={onSaveCourse}
              className={`rounded-full px-4 h-9 transition-all duration-200 ${
                isSaved
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 sm:gap-6 lg:h-[calc(100vh-10rem)]">
          {/* Left Panel - Video (40%) */}
          <div className="animate-float-in">
            <VideoPanel videoId={videoId} concepts={concepts} />
          </div>

          {/* Right Panel - Tasks (60%) */}
          <div className="animate-float-in-delay-1">
            <TaskPanel tasks={tasks} onToggleTask={onToggleTask} />
          </div>
        </div>
      </div>

      <AskWidget
        transcript={transcript}
        concepts={concepts}
        videoTitle={videoTitle}
      />
    </div>
  );
}
