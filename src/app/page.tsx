"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@civic/auth/react";
import {
  Navbar,
  HeroSection,
  LearningDashboard,
  Task,
  LibraryModal,
  SlidesModal,
  CivicAuthModal,
  ChatWidget,
  BackgroundGradient,
} from "@/components/chrono-task";
import { uploadPDF, analyzeDocument } from "@/lib/pdf";
import {
  saveDocument,
  updateDocumentProgress,
  getSavedDocuments,
  SavedDocument,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Upload, FileText } from "lucide-react";
import { TextShimmer } from "@/components/prompt-kit";

export default function Page() {
  const { user } = useUser();
  const [view, setView] = useState<"hero" | "input" | "dashboard">("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prevUser, setPrevUser] = useState<typeof user>(null);
  const [rotatingWordIndex, setRotatingWordIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rotatingWords = ["plan", "tasks", "slides", "summary", "quiz"];

  // Check if current document is saved
  useEffect(() => {
    if (documentId) {
      const documents = getSavedDocuments();
      setIsSaved(documents.some((d) => d.documentId === documentId));
    }
  }, [documentId]);

  // Show auth modal and redirect to input view when user logs in
  useEffect(() => {
    if (user && !prevUser) {
      setIsAuthModalOpen(true);
      if (view === "hero") {
        setView("input");
      }
    }
    setPrevUser(user);
  }, [user, prevUser, view]);

  // Rotate headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const handleFileUpload = async (file: File) => {
    setError("");
    setIsLoading(true);

    try {
      // Upload and extract text
      const uploadResult = await uploadPDF(file);

      setDocumentId(uploadResult.documentId);
      setFileName(uploadResult.fileName);
      setPageCount(uploadResult.pageCount);
      setContent(uploadResult.text);

      // Analyze the document
      const analysis = await analyzeDocument(
        uploadResult.text,
        uploadResult.fileName
      );

      setConcepts(analysis.concepts);
      setTasks(analysis.tasks.map((t) => ({ ...t, completed: false })));
      setDocumentTitle(uploadResult.fileName.replace(/\.pdf$/i, ""));

      setView("dashboard");
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process PDF. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        handleFileUpload(file);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleNewDocument = () => {
    setView("input");
    setDocumentId("");
    setFileName("");
    setPageCount(undefined);
    setTasks([]);
    setConcepts([]);
    setError("");
    setContent("");
    setDocumentTitle("");
    setIsSaved(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const newTasks = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      if (isSaved && documentId) {
        updateDocumentProgress(documentId, newTasks);
      }

      return newTasks;
    });
  };

  const handleSaveDocument = () => {
    if (!documentId) return;

    saveDocument({
      documentId,
      fileName,
      title: documentTitle || fileName,
      concepts,
      tasks,
      content,
      pageCount,
    });

    setIsSaved(true);
  };

  const handleSelectDocument = (doc: SavedDocument) => {
    setDocumentId(doc.documentId);
    setFileName(doc.fileName);
    setDocumentTitle(doc.title);
    setPageCount(doc.pageCount);
    setConcepts(doc.concepts);
    setTasks(doc.tasks);
    setContent(doc.content || "");
    setIsSaved(true);
    setIsLibraryOpen(false);
    setView("dashboard");
  };

  // Render PDF upload input view
  const renderInputView = () => (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <BackgroundGradient />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 text-center mb-2 tracking-tight">
          Create new study{" "}
          <span className="relative inline-block min-w-[100px]">
            <span
              key={rotatingWordIndex}
              className="inline-block text-orange-500 animate-[fadeSlideIn_0.4s_ease-out]"
            >
              {rotatingWords[rotatingWordIndex]}
            </span>
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          Upload a PDF document to get started
        </p>

        <div className="w-full max-w-xl">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border-2 border-dashed transition-all duration-200 cursor-pointer ${
              isDragging
                ? "border-orange-500 bg-orange-50/80 dark:bg-orange-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-orange-400"
            } ${isLoading ? "pointer-events-none opacity-70" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInputChange}
              disabled={isLoading}
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <TextShimmer className="text-sm text-slate-600 dark:text-slate-400">
                  Processing your PDF... Analyzing content and generating study
                  plan
                </TextShimmer>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-2">
                  Drop your PDF here
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  or click to browse
                </p>
                <Button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isLoading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Select PDF
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm text-center whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500">
            Maximum file size: 10MB • PDF files only
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <Navbar
        onNewDocument={handleNewDocument}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {!user || view === "hero" ? (
        <HeroSection />
      ) : view === "input" ? (
        renderInputView()
      ) : (
        <LearningDashboard
          documentId={documentId}
          fileName={fileName}
          pageCount={pageCount}
          concepts={concepts}
          tasks={tasks}
          content={content}
          documentTitle={documentTitle}
          onToggleTask={handleToggleTask}
          onSaveDocument={handleSaveDocument}
          onOpenSlides={() => setIsSlidesOpen(true)}
          isSaved={isSaved}
        />
      )}

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectDocument={handleSelectDocument}
      />

      <SlidesModal
        isOpen={isSlidesOpen}
        onClose={() => setIsSlidesOpen(false)}
        concepts={concepts}
        tasks={tasks}
        documentTitle={documentTitle}
      />

      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={{
          content,
          concepts,
          documentTitle,
        }}
      />

      <CivicAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
      />
    </main>
  );
}
