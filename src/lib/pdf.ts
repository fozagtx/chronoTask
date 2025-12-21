import { Task } from "@/components/chrono-task";

interface PDFUploadResult {
  success: boolean;
  documentId: string;
  fileName: string;
  text: string;
  textLength: number;
  pageCount?: number;
  error?: string;
}

interface DocumentAnalysis {
  concepts: string[];
  tasks: Task[];
}

export async function uploadPDF(file: File): Promise<PDFUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to upload PDF");
  }

  return response.json();
}

export async function analyzeDocument(
  content: string,
  documentTitle?: string
): Promise<DocumentAnalysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, documentTitle }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to analyze document");
  }

  return response.json();
}

export async function askQuestion(params: {
  question: string;
  content?: string;
  concepts?: string[];
  documentTitle?: string;
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
