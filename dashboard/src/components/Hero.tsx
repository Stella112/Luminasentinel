"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export const Hero = () => {
  const [chatUrl, setChatUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatUrl = async () => {
      try {
        const res = await fetch(`/api/sentinel/stats`);
        const data = await res.json();
        if (data.chatUrl) setChatUrl(data.chatUrl);
      } catch { /* silent */ }
    };
    fetchChatUrl();
  }, []);

  const handleLaunchChat = () => {
    window.location.href = "/chat";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">

      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)" }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px]"
          style={{ background: "radial-gradient(ellipse at top right, rgba(192,192,192,0.05) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]"
          style={{ background: "radial-gradient(ellipse at bottom left, rgba(0,229,255,0.04) 0%, transparent 60%)" }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">

        {/* Protocol badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 glass-gold rounded-full text-[11px] font-mono font-bold tracking-[0.4em] uppercase mb-10"
            style={{ color: "#D4AF37" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            SENTINEL_PROTOCOL_v4.2 · ACTIVE
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-[clamp(3.5rem,12vw,10rem)] font-space font-black leading-[0.85] tracking-[-0.04em] uppercase mb-8"
        >
          <span className="gold-text">LUMINA</span>
          <br />
          <span className="silver-text">SENTINEL</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-14 font-outfit font-light leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Your Onchain Jarvis —{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Personal AI Life OS</span>
          {" "}& Finance Guardian
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="/chat"
            className="btn-gold text-sm w-full sm:w-auto inline-block text-center"
          >
            ⚡ Launch Chat
          </a>
          <a
            href="https://nosana.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-silver text-sm w-full sm:w-auto"
          >
            🚀 Deploy on Nosana
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-12 mt-20"
        >
          {[
            { value: "99.8", label: "Security Score", suffix: "%" },
            { value: "24/7", label: "Active Guardian" },
            { value: "0ms", label: "Response Time — Qwen" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-space font-black gold-text">{s.value}{s.suffix}</div>
              <div className="text-[11px] font-mono tracking-widest uppercase mt-1" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />
    </section>
  );
};
