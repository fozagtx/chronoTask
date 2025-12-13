"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  delay?: number;
}

export function TaskItem({ task, onToggle, delay = 0 }: TaskItemProps) {
  return (
    <div 
      className={`
        group flex items-center gap-4 h-14 px-4 border-b border-slate-200 
        hover:bg-slate-50 transition-all duration-200 cursor-pointer
        animate-task-in
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onToggle(task.id)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className={`
          w-5 h-5 rounded-md border-2 transition-all duration-300
          ${task.completed 
            ? 'bg-[#2563EB] border-[#2563EB]' 
            : 'border-slate-300 hover:border-[#2563EB]'
          }
        `}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Task Title */}
      <span 
        className={`
          flex-1 text-[15px] transition-all duration-300
          ${task.completed 
            ? 'line-through text-slate-400' 
            : 'text-slate-700'
          }
        `}
      >
        {task.title}
      </span>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">{task.duration}</span>
      </div>
    </div>
  );
}
