"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Zap } from "lucide-react";

interface Message {
  text: string;
  isBot: boolean;
  ts?: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Guardian initialization complete. How can I protect you today?", isBot: true, ts: "12:00" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages(prev => [...prev, { text, isBot: false, ts: now() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/sentinel/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        text: data.response || "Processing complete. Standing by.",
        isBot: true,
        ts: now(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        text: "Neural link temporarily offline. Use the full chat interface for real-time conversations.",
        isBot: true,
        ts: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        id="chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[110] w-16 h-16 rounded-full flex items-center justify-center group"
        style={{
          background: "linear-gradient(135deg, #B8960C, #D4AF37, #F5E6C8, #D4AF37)",
          boxShadow: "0 0 40px rgba(212,175,55,0.5), inset 0 0 20px rgba(255,230,100,0.1)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen
          ? <X className="w-6 h-6 text-[#0A0A0F]" />
          : <MessageSquare className="w-6 h-6 text-[#0A0A0F] group-hover:rotate-12 transition-transform" />
        }
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-8 z-[100] w-[90vw] md:w-[400px] h-[560px] flex flex-col rounded-2xl overflow-hidden glass-gold"
            style={{ boxShadow: "0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.15)" }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center gap-4 border-b" style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.04)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))", border: "1px solid rgba(212,175,55,0.3)" }}>
                <Bot className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <div className="font-space font-black text-sm tracking-tight gold-text">NEURAL_SENTINEL</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Logic Online</span>
                </div>
              </div>
              <a href="/chat" target="_blank"
                className="ml-auto text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all"
                style={{ color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.05)" }}>
                Full View →
              </a>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.isBot ? "chat-bubble-bot" : "chat-bubble-user"}`}>
                    {m.text}
                    <div className="text-[9px] mt-1.5 opacity-50 font-mono">{m.ts}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot px-5 py-3 rounded-2xl flex items-center gap-2">
                    <Zap className="w-3 h-3 animate-pulse" style={{ color: "#D4AF37" }} />
                    <span className="text-[11px] font-mono tracking-wider uppercase animate-pulse" style={{ color: "#D4AF37" }}>
                      PROCESSING_LOGIC
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="Query the Guardian..."
                  className="w-full rounded-xl px-5 py-3.5 pr-14 text-[13px] font-mono focus:outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(212,175,55,0.2)")}
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #B8960C, #D4AF37)" }}
                >
                  <Send className="w-4 h-4 text-[#0A0A0F]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
