export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatContextData {
  content?: string;
  concepts?: string[];
  documentTitle?: string;
}

export async function sendChatMessage(
  message: string,
  context: ChatContextData,
  history: ChatMessage[]
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: context.content,
      concepts: context.concepts,
      documentTitle: context.documentTitle,
      history: history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to send message");
  }

  const data = (await response.json()) as { message?: string };
  return data.message || "";
}
