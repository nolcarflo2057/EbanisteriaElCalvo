"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";
import { ConfigData } from "@/features/whiteLabel/hooks/useWhiteLabelConfig";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SimpleChatbotWidget({ config }: { config: ConfigData }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ensure the textarea scrolls with content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTagClick = (tag: string, response: string) => {
    const userMessage: Message = { role: "user", content: tag };
    const assistantMessage: Message = { role: "assistant", content: response };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let responseText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          responseText += chunk;
        }
      }
      const assistantMessage: Message = { role: "assistant", content: responseText };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={cn(
          "fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md shadow-lg hover:bg-white/50 transition",
          "shadow-primary/30"
        )}
        onClick={() => setOpen(true)}
        aria-label="Open chatbot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.657 0-3.21-.398-4.55-1.09L3 21l1.09-4.45C3.398 15.21 3 13.657 3 12c0-4.97 3.582-9 8-9s8 4.03 8 9z"
          />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg bg-white/80 backdrop-blur-md shadow-xl">
            <button
              className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("mb-2", msg.role === "user" ? "text-right" : "text-left")}>
                  <span
                    className={cn(
                      "inline-block p-2 rounded-lg",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-800"
                    )}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Quick Reply Tags */}
            {config.chatbotTags && config.chatbotTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border-t bg-gray-50/50">
                {config.chatbotTags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTagClick(t.tag, t.response)}
                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {t.tag}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t p-2">
              <Textarea
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                className="w-full mb-2"
              />
              <Button onClick={handleSend} disabled={!input.trim()} className="w-full">
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


