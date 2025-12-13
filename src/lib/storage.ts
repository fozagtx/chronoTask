// Local storage utilities for saving courses

export interface SavedCourse {
  id: string;
  videoId: string;
  title: string;
  concepts: string[];
  tasks: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
  transcript?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "chronotask_library";

export function getSavedCourses(): SavedCourse[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCourse(course: Omit<SavedCourse, "id" | "createdAt" | "updatedAt">): SavedCourse {
  const courses = getSavedCourses();
  
  // Check if course with same videoId exists
  const existingIndex = courses.findIndex(c => c.videoId === course.videoId);
  
  const now = new Date().toISOString();
  
  if (existingIndex >= 0) {
    // Update existing course
    courses[existingIndex] = {
      ...courses[existingIndex],
      ...course,
      updatedAt: now,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return courses[existingIndex];
  }
  
  // Create new course
  const newCourse: SavedCourse = {
    ...course,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  
  courses.unshift(newCourse);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  return newCourse;
}

export function deleteCourse(id: string): void {
  const courses = getSavedCourses();
  const filtered = courses.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateCourseProgress(videoId: string, tasks: SavedCourse["tasks"]): void {
  const courses = getSavedCourses();
  const index = courses.findIndex(c => c.videoId === videoId);
  
  if (index >= 0) {
    courses[index].tasks = tasks;
    courses[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }
}
