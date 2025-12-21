// Local storage utilities for saving documents

export interface SavedDocument {
  id: string;
  documentId: string;
  fileName: string;
  title: string;
  concepts: string[];
  tasks: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
  content?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "chronotask_library";

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDocument(
  doc: Omit<SavedDocument, "id" | "createdAt" | "updatedAt">
): SavedDocument {
  const documents = getSavedDocuments();

  // Check if document with same documentId exists
  const existingIndex = documents.findIndex(
    (d) => d.documentId === doc.documentId
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing document
    documents[existingIndex] = {
      ...documents[existingIndex],
      ...doc,
      updatedAt: now,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    return documents[existingIndex];
  }

  // Create new document
  const newDocument: SavedDocument = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  documents.unshift(newDocument);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  return newDocument;
}

export function deleteDocument(id: string): void {
  const documents = getSavedDocuments();
  const filtered = documents.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateDocumentProgress(
  documentId: string,
  tasks: SavedDocument["tasks"]
): void {
  const documents = getSavedDocuments();
  const index = documents.findIndex((d) => d.documentId === documentId);

  if (index >= 0) {
    documents[index].tasks = tasks;
    documents[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
}
