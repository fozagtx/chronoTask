"use client";

import { useState } from "react";
import { ProgressRing } from "./ProgressRing";
import { TaskItem, Task } from "./TaskItem";
import { TaskSummaryModal } from "./TaskSummaryModal";

interface TaskPanelProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  concepts?: string[];
  transcript?: string;
}

export function TaskPanel({
  tasks,
  onToggleTask,
  concepts = [],
  transcript,
}: TaskPanelProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const totalTime = tasks.reduce((acc, task) => {
    const minutes = parseInt(task.duration.replace(/[^0-9]/g, "")) || 0;
    return acc + minutes;
  }, 0);

  const handleOpenSummary = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleCompleteTask = (taskId: string) => {
    onToggleTask(taskId);
    handleCloseModal();
  };

  const handleNextTask = () => {
    const currentIndex = tasks.findIndex((t) => t.id === selectedTask?.id);
    if (currentIndex >= 0 && currentIndex < tasks.length - 1) {
      const nextTask = tasks[currentIndex + 1];
      setSelectedTask(nextTask);
      // Keep modal open for next task
    } else {
      handleCloseModal();
    }
  };

  const currentTaskIndex = selectedTask
    ? tasks.findIndex((t) => t.id === selectedTask.id)
    : -1;
  const hasNext = currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1;

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 font-heading">
            Action Plan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {completedCount} of {tasks.length} tasks completed • {totalTime} min
            total
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
            onOpenSummary={handleOpenSummary}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-t border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
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

      {/* Task Summary Modal */}
      <TaskSummaryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        onComplete={handleCompleteTask}
        onNext={handleNextTask}
        hasNext={hasNext}
        concepts={concepts}
        transcript={transcript}
      />
    </div>
  );
}
