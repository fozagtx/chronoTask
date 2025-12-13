"use client";

import { useState, useEffect } from "react";
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
} from "@/components/chrono-task";
import {
  extractVideoId,
  fetchTranscript,
  fetchVideoTitle,
} from "@/lib/youtube";
import { analyzeTranscript } from "@/lib/openai";
import {
  saveCourse,
  updateCourseProgress,
  getSavedCourses,
  SavedCourse,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { TextShimmer } from "@/components/prompt-kit";

export default function Page() {
  const { user } = useUser();
  const [view, setView] = useState<"hero" | "input" | "dashboard">("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [videoId, setVideoId] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [prevUser, setPrevUser] = useState<typeof user>(null);

  // Check if current course is saved
  useEffect(() => {
    if (videoId) {
      const courses = getSavedCourses();
      setIsSaved(courses.some((c) => c.videoId === videoId));
    }
  }, [videoId]);

  // Show auth modal and redirect to input view when user logs in
  useEffect(() => {
    if (user && !prevUser) {
      // User just logged in - show the auth modal
      setIsAuthModalOpen(true);
      if (view === "hero") {
        setView("input");
      }
    }
    setPrevUser(user);
  }, [user, prevUser, view]);

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    try {
      const id = extractVideoId(url);
      if (!id) {
        throw new Error("Invalid YouTube URL");
      }

      setVideoId(id);

      const { transcript: fetchedTranscript, title } =
        await fetchTranscript(id);
      setTranscript(fetchedTranscript);

      const analysis = await analyzeTranscript(fetchedTranscript);

      setConcepts(analysis.concepts);
      setTasks(analysis.tasks.map((t) => ({ ...t, completed: false })));
      setVideoTitle(title);

      setView("dashboard");
    } catch (err) {
      console.error("Error processing video:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process video. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCourse = () => {
    setView("input");
    setVideoId("");
    setTasks([]);
    setConcepts([]);
    setError("");
    setTranscript("");
    setVideoTitle("");
    setIsSaved(false);
    setUrl("");
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const newTasks = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      );

      if (isSaved && videoId) {
        updateCourseProgress(videoId, newTasks);
      }

      return newTasks;
    });
  };

  const handleSaveCourse = () => {
    if (!videoId) return;

    saveCourse({
      videoId,
      title: videoTitle || `Video ${videoId}`,
      concepts,
      tasks,
      transcript,
    });

    setIsSaved(true);
  };

  const handleSelectCourse = (course: SavedCourse) => {
    setVideoId(course.videoId);
    setVideoTitle(course.title);
    setConcepts(course.concepts);
    setTasks(course.tasks);
    setTranscript(course.transcript || "");
    setIsSaved(true);
    setIsLibraryOpen(false);
    setView("dashboard");

    const maybePlaceholder =
      !course.title?.trim() ||
      course.title.trim() === `Video ${course.videoId}`;

    if (maybePlaceholder) {
      void (async () => {
        const resolved = await fetchVideoTitle(course.videoId);
        if (resolved) {
          setVideoTitle(resolved);
          saveCourse({
            videoId: course.videoId,
            title: resolved,
            concepts: course.concepts,
            tasks: course.tasks,
            transcript: course.transcript,
          });
        }
      })();
    }
  };

  // Render URL input view
  const renderInputView = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2 tracking-tight">
          Create new study plan
        </h2>
        <p className="text-slate-500 text-center mb-8">
          Paste a YouTube video URL to get started
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div className="flex flex-col items-stretch gap-2 bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-2 border border-slate-100 sm:flex-row sm:items-center sm:rounded-full">
            <Input
              type="text"
              placeholder="Paste YouTube URL here..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="h-12 w-full border-0 bg-transparent px-4 text-base placeholder:text-slate-400 shadow-none focus-visible:ring-0 sm:flex-1 sm:rounded-full disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-orange-500 px-6 font-medium text-white shadow-sm hover:bg-orange-600 sm:w-auto sm:rounded-full"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <TextShimmer className="text-sm text-slate-600">
                Processing your YouTube URL... Analyzing transcript and generating study plan
              </TextShimmer>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <Navbar
        onNewCourse={handleNewCourse}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {!user || view === "hero" ? (
        <HeroSection />
      ) : view === "input" ? (
        renderInputView()
      ) : (
        <LearningDashboard
          videoId={videoId}
          concepts={concepts}
          tasks={tasks}
          transcript={transcript}
          videoTitle={videoTitle}
          onToggleTask={handleToggleTask}
          onSaveCourse={handleSaveCourse}
          onOpenSlides={() => setIsSlidesOpen(true)}
          isSaved={isSaved}
        />
      )}

      <LibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectCourse={handleSelectCourse}
      />

      <SlidesModal
        isOpen={isSlidesOpen}
        onClose={() => setIsSlidesOpen(false)}
        concepts={concepts}
        tasks={tasks}
        videoTitle={videoTitle}
      />

      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={{
          transcript,
          concepts,
          videoTitle,
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
