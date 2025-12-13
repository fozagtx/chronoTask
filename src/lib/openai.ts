import { Task } from "@/components/chrono-task";

interface VideoAnalysis {
  concepts: string[];
  tasks: Task[];
}

export async function analyzeTranscript(transcript: string): Promise<VideoAnalysis> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze transcript');
  }

  return response.json();
}
