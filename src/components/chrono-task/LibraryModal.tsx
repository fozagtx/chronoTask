"use client";

import { useState, useEffect } from "react";
import { X, FileText, Trash2, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSavedDocuments, deleteDocument, SavedDocument } from "@/lib/storage";

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument: (doc: SavedDocument) => void;
}

export function LibraryModal({
  isOpen,
  onClose,
  onSelectDocument,
}: LibraryModalProps) {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDocuments(getSavedDocuments());
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDocument(id);
    setDocuments(getSavedDocuments());
  };

  const getProgress = (tasks: SavedDocument["tasks"]) => {
    if (tasks.length === 0) return 0;
    return Math.round(
      (tasks.filter((t) => t.completed).length / tasks.length) * 100
    );
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
      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-float-in sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-900 font-heading">
            My Library
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No saved documents
              </h3>
              <p className="text-slate-500">
                Upload a PDF and save it to your library
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const progress = getProgress(doc.tasks);
                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="group p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Document Icon */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate mb-1">
                          {doc.title || doc.fileName || "Untitled Document"}
                        </h3>
                        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {doc.tasks.filter((t) => t.completed).length}/
                            {doc.tasks.length} tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(doc.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(doc.id, e)}
                        className="text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
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
