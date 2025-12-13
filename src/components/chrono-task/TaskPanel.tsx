"use client";

import { ProgressRing } from "./ProgressRing";
import { TaskItem, Task } from "./TaskItem";

interface TaskPanelProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export function TaskPanel({ tasks, onToggleTask }: TaskPanelProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const totalTime = tasks.reduce((acc, task) => {
    const minutes = parseInt(task.duration.replace(/[^0-9]/g, '')) || 0;
    return acc + minutes;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 font-heading">
            Action Plan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {completedCount} of {tasks.length} tasks completed • {totalTime} min total
          </p>
        </div>
        <ProgressRing progress={progress} />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task, index) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={onToggleTask}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <div className="p-6 bg-gradient-to-r from-[#2563EB]/10 to-[#2563EB]/5 border-t border-[#2563EB]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 font-heading">
                Course Complete! 🎉
              </p>
              <p className="text-sm text-slate-500">
                Great job finishing all tasks
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
