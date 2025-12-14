"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
  TextShimmer,
} from "@/components/prompt-kit";
import {
  sendChatMessage,
  type ChatMessage,
  type ChatContextData,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ChatContextData;
}

export function ChatWidget({ isOpen, onClose, context }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setError("");
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input, context || {}, messages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[600px] max-h-[80vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Learning Assistant
              </h2>
              <p className="text-xs text-slate-500">
                {context?.videoTitle
                  ? `Discussing: ${context.videoTitle}`
                  : "Ask me anything"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-slate-600 font-medium">Start a conversation</p>
              <p className="text-sm text-slate-500 mt-1">
                Ask questions about your learning or browse the web
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", {
                "justify-end": message.role === "user",
              })}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="" alt="Assistant" />
                  <AvatarFallback className="bg-orange-500 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn("max-w-xs px-4 py-2 rounded-lg text-sm", {
                  "bg-orange-500 text-white rounded-br-none":
                    message.role === "user",
                  "bg-slate-100 text-slate-900 rounded-bl-none":
                    message.role === "assistant",
                })}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="" alt="You" />
                  <AvatarFallback className="bg-slate-300 text-slate-700 text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="" alt="Assistant" />
                <AvatarFallback className="bg-orange-500 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg rounded-bl-none text-sm">
                <TextShimmer>Thinking...</TextShimmer>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3">
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm w-full">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <PromptInput
            value={input}
            onValueChange={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <PromptInputTextarea
              placeholder="Ask a question..."
              rows={2}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={isLoading ? "Stop generation" : "Send message"}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
