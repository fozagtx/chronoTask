"use client";

import { useState, useEffect } from "react";
import { X, Play, Trash2, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSavedCourses, deleteCourse, SavedCourse } from "@/lib/storage";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: SavedCourse) => void;
}

export function LibraryModal({ isOpen, onClose, onSelectCourse }: LibraryModalProps) {
  const [courses, setCourses] = useState<SavedCourse[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCourses(getSavedCourses());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCourse(id);
    setCourses(getSavedCourses());
  };

  const getProgress = (tasks: SavedCourse["tasks"]) => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-float-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 font-heading">My Library</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No saved courses</h3>
              <p className="text-slate-500">Generate a study plan and save it to your library</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => {
                const progress = getProgress(course.tasks);
                return (
                  <div
                    key={course.id}
                    onClick={() => onSelectCourse(course)}
                    className="group p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${course.videoId}/mqdefault.jpg`}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate mb-1">
                          {course.title || "Untitled Course"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {course.tasks.filter(t => t.completed).length}/{course.tasks.length} tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(course.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#2563EB] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(course.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
