"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sun, Moon, Shield, Zap, ChevronLeft } from "lucide-react";
import { SparkleField } from "@/components/SparkleField";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  ts: string;
}

const STARTER_PROMPTS = [
  "Check my wallet for risky approvals",
  "What's my current SOL balance?",
  "Give me a security briefing",
  "Analyze market conditions today",
];

export default function ChatPage() {
  const { theme, toggle } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Guardian initialization complete. I am Lumina Sentinel — your Onchain Jarvis and Personal AI Life OS. I'm monitoring your wallet, scanning for threats, and standing vigilant. How can I protect or assist you today?",
      isBot: true,
      ts: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const fetchChatUrl = async () => {
      try {
        const res = await fetch(`/api/sentinel/stats`);
        const data = await res.json();
        if (data.chatUrl) setChatUrl(data.chatUrl);
      } catch { /* silent */ }
    };
    fetchChatUrl();
    inputRef.current?.focus();
  }, []);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const newMsg: Message = { id: Date.now(), text: msg, isBot: false, ts: now() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/sentinel/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || "Logic trace complete. Standing by, Guardian.",
        isBot: true,
        ts: now(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Neural link momentarily disrupted. Reconnecting to Sentinel core...",
        isBot: true,
        ts: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col relative overflow-hidden">
      <SparkleField />

      {/* Chat interface */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 md:px-10 py-4 border-b backdrop-blur-[28px] shrink-0"
          style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(10,10,15,0.8)" }}
        >
          <div className="flex items-center gap-4">
            <Link href="/"
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)" }}>
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.05))",
                border: "1px solid rgba(212,175,55,0.4)",
                boxShadow: "0 0 20px rgba(212,175,55,0.2)",
              }}
            >
              <Bot className="w-5 h-5" style={{ color: "#D4AF37" }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-space font-black tracking-tight text-base gold-text">
                  Lumina Sentinel
                </span>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                  Connected
                </span>
                <span className="text-[10px] font-mono" style={{ color: "rgba(212,175,55,0.6)" }}>
                  · Qwen Intelligence Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Open full ElizaOS */}
            {chatUrl && (
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-lg border transition-all hover:bg-[#D4AF37]/10"
                style={{ color: "#D4AF37", borderColor: "rgba(212,175,55,0.3)" }}
              >
                <Zap className="w-3 h-3" />
                Full ElizaOS
              </a>
            )}

            {/* Shield status */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Vigilant</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(212,175,55,0.2)", color: "#D4AF37" }}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-10 py-8 space-y-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 25 }}
                  className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}
                >
                  {m.isBot && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 mt-1"
                      style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <Bot className="w-4 h-4" style={{ color: "#D4AF37" }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-lg ${m.isBot ? "chat-bubble-bot" : "chat-bubble-user"}`}
                    style={m.isBot ? {} : { boxShadow: "0 0 30px rgba(212,175,55,0.2)" }}
                  >
                    <p className="text-sm leading-relaxed font-outfit whitespace-pre-wrap">
                      {m.text}
                    </p>
                    <div className="text-[10px] font-mono mt-2 opacity-40">{m.ts}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3"
                  style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <Bot className="w-4 h-4" style={{ color: "#D4AF37" }} />
                </div>
                <div className="chat-bubble-bot px-5 py-4 rounded-2xl flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#D4AF37" }}
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "#D4AF37" }}>
                    Neural processing...
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Starter prompts */}
        {messages.length === 1 && (
          <div className="px-4 md:px-10 pb-4 shrink-0">
            <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] font-mono px-4 py-2 rounded-full border transition-all hover:scale-105"
                  style={{
                    color: "#D4AF37",
                    borderColor: "rgba(212,175,55,0.25)",
                    background: "rgba(212,175,55,0.05)",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div
          className="px-4 md:px-10 py-5 border-t backdrop-blur-[28px] shrink-0"
          style={{ borderColor: "rgba(212,175,55,0.1)", background: "rgba(10,10,15,0.7)" }}
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask Lumina anything..."
                className="w-full rounded-2xl px-6 py-4 text-sm font-outfit focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  color: "var(--text-primary)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(212,175,55,0.55)")}
                onBlur={e => (e.target.style.borderColor = "rgba(212,175,55,0.2)")}
              />
            </div>
            <motion.button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: "linear-gradient(135deg, #B8960C, #D4AF37, #F5E6C8)",
                boxShadow: input.trim() ? "0 0 30px rgba(212,175,55,0.4)" : "none",
              }}
              whileHover={input.trim() ? { scale: 1.05 } : {}}
              whileTap={input.trim() ? { scale: 0.95 } : {}}
            >
              <Send className="w-5 h-5 text-[#0A0A0F]" />
            </motion.button>
          </div>
          <p className="text-center text-[10px] font-mono mt-3 tracking-widest uppercase" style={{ color: "rgba(192,192,192,0.3)" }}>
            Lumina Sentinel · Powered by Nosana × Qwen Intelligence
          </p>
        </div>
      </div>
    </main>
  );
}
