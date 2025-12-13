"use client";

import { VideoPanel } from "./VideoPanel";
import { TaskPanel } from "./TaskPanel";
import { Task } from "./TaskItem";
import { Button } from "@/components/ui/button";
import { Bookmark, Presentation } from "lucide-react";

interface LearningDashboardProps {
  videoId: string;
  concepts: string[];
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onSaveCourse: () => void;
  onOpenSlides: () => void;
  isSaved?: boolean;
}

export function LearningDashboard({ 
  videoId, 
  concepts, 
  tasks, 
  onToggleTask,
  onSaveCourse,
  onOpenSlides,
  isSaved = false,
}: LearningDashboardProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dot-pattern pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 mb-4 animate-float-in">
          <Button
            variant="outline"
            onClick={onOpenSlides}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Presentation className="w-4 h-4 mr-2" />
            View Slides
          </Button>
          <Button
            onClick={onSaveCourse}
            className={`transition-all duration-200 ${
              isSaved 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved to Library' : 'Save to Library'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 h-[calc(100vh-10rem)]">
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
    </div>
  );
}
