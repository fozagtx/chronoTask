"use client";

import { useState, useEffect } from "react";
import { HeaderBase, HeroSection, HowItWorks, Footer, LearningDashboard, Task, LibraryModal, SlidesModal } from "@/components/chrono-task";
import { extractVideoId, fetchTranscript } from "@/lib/youtube";
import { analyzeTranscript } from "@/lib/openai";
import { saveCourse, updateCourseProgress, getSavedCourses, SavedCourse } from "@/lib/storage";

export default function Page() {
  const [view, setView] = useState<"hero" | "dashboard">("hero");
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

  // Check if current course is saved
  useEffect(() => {
    if (videoId) {
      const courses = getSavedCourses();
      setIsSaved(courses.some(c => c.videoId === videoId));
    }
  }, [videoId]);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Extract video ID
      const id = extractVideoId(url);
      if (!id) {
        throw new Error("Invalid YouTube URL");
      }
      
      setVideoId(id);
      
      // Fetch transcript from YouTube video
      const fetchedTranscript = await fetchTranscript(id);
      setTranscript(fetchedTranscript);
      
      // Analyze transcript with OpenAI
      const analysis = await analyzeTranscript(fetchedTranscript);
      
      // Update state with AI-generated content
      setConcepts(analysis.concepts);
      setTasks(analysis.tasks.map(t => ({ ...t, completed: false })));
      setVideoTitle(`Video ${id}`);
      
      setView("dashboard");
    } catch (err) {
      console.error("Error processing video:", err);
      setError(err instanceof Error ? err.message : "Failed to process video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewCourse = () => {
    setView("hero");
    setVideoId("");
    setTasks([]);
    setConcepts([]);
    setError("");
    setTranscript("");
    setVideoTitle("");
    setIsSaved(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      // Update saved course progress if saved
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
  };

  return (
    <main className="min-h-screen">
      <HeaderBase
        onNewCourse={handleNewCourse}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        showActions={view === "dashboard"}
      />

      {view === "hero" ? (
        <>
          <HeroSection onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          <HowItWorks />
          <Footer />
        </>
      ) : (
        <LearningDashboard
          videoId={videoId}
          concepts={concepts}
          tasks={tasks}
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
    </main>
  );
}
