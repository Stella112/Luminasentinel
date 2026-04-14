"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

const GoldDiamond = () => (
  <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#D4AF37] opacity-70 animate-pulse" />
);

export const StickyNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const fetchChatUrl = async () => {
      try {
        const res = await fetch(`/api/sentinel/stats`);
        const data = await res.json();
        if (data.chatUrl) setChatUrl(data.chatUrl);
      } catch { /* silent */ }
    };
    fetchChatUrl();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Architecture", href: "#features" },
    { name: "Chat", href: "/chat" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 backdrop-blur-[28px] bg-[var(--bg-surface)] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-b border-[var(--border)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/logo-chrome.png"
              alt="Lumina Sentinel"
              width={36}
              height={36}
              className="relative z-10"
            />
          </div>
          <span className="font-space font-black text-lg tracking-tight gold-text">
            LUMINA SENTINEL
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-[11px] font-space font-bold tracking-[0.25em] uppercase transition-all duration-300 group"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {link.name}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-full glass-gold transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-[#D4AF37]" />
            )}
          </button>

          {/* Launch Chat CTA */}
          <a
            href="/chat"
            className="btn-gold text-[10px] px-6 py-2.5 inline-block text-center"
          >
            LAUNCH CHAT
          </a>
        </div>
      </div>
    </motion.nav>
  );
};
