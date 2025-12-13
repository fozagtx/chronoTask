import { Task } from "@/components/chrono-task";

interface VideoAnalysis {
  concepts: string[];
  tasks: Task[];
}

export async function analyzeTranscript(
  transcript: string,
): Promise<VideoAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze transcript");
  }

  return response.json();
}

export async function askQuestion(params: {
  question: string;
  transcript?: string;
  concepts?: string[];
  videoTitle?: string;
}): Promise<{ answer: string }> {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to answer question");
  }

  return response.json();
}
