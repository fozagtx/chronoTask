"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { askQuestion } from "@/lib/openai";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AskWidget(props: {
  transcript?: string;
  concepts?: string[];
  videoTitle?: string;
}) {
  const { transcript, concepts, videoTitle } = props;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "assistant",
      content:
        "Ask me a question about this video and I’ll help you understand it.",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const placeholder = useMemo(() => {
    if (videoTitle?.trim()) return `Ask about “${videoTitle.trim()}”...`;
    return "Ask a question about this topic...";
  }, [videoTitle]);

  const send = async () => {
    const question = input.trim();
    if (!question || isSending) return;

    setInput("");
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await askQuestion({
        question,
        transcript,
        concepts,
        videoTitle,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content:
            res.answer || "I couldn’t generate an answer. Try rephrasing.",
        },
      ]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to answer";
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: message },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-40 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600"
          aria-label="Ask a question"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Ask
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-[420px] flex-col p-0 sm:w-[420px]">
        <SheetHeader className="border-b border-slate-200 p-4">
          <SheetTitle className="text-slate-900">Ask a question</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-orange-500 text-white"
                    : "mr-auto bg-slate-100 text-slate-800",
                )}
              >
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <Button
              onClick={() => void send()}
              disabled={isSending || !input.trim()}
              className="h-10 bg-orange-500 px-3 text-white hover:bg-orange-600"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Answers are generated from the transcript and may be imperfect.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
