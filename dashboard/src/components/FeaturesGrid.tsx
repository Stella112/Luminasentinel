"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "Memory Vault",
    desc: "Persistent memory across every interaction. Lumina remembers your preferences, tasks, and goals — always in context, always sovereign.",
    accent: "#D4AF37",
  },
  {
    icon: "💰",
    title: "Finance Optimizer",
    desc: "Real-time portfolio analysis, yield strategies, and DeFi opportunity scanning. Your personal quantitative analyst, on-chain.",
    accent: "#D4AF37",
  },
  {
    icon: "🛡️",
    title: "Security Shield",
    desc: "Continuous wallet scanning for risky token approvals, suspicious delegations, and phishing threats. Revoke in one click.",
    accent: "#C0C0C0",
  },
  {
    icon: "⚡",
    title: "On-Chain Actions",
    desc: "Execute SOL transfers, revoke approvals, swap tokens, and interact with protocols — directly through natural language.",
    accent: "#C0C0C0",
  },
  {
    icon: "📋",
    title: "Daily Briefings",
    desc: "Every morning: a curated intelligence report — market conditions, wallet health, flagged risks, and opportunities awaiting.",
    accent: "#D4AF37",
  },
  {
    icon: "🔬",
    title: "Research Synthesis",
    desc: "Deep-dive analysis on any protocol, token, or onchain event. Powered by Qwen intelligence and real-time web search.",
    accent: "#C0C0C0",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[11px] font-mono font-bold tracking-[0.5em] uppercase mb-6" style={{ color: "#D4AF37" }}>
            // CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-6xl font-space font-black uppercase mb-6">
            <span className="gold-text">What Lumina</span>
            <br />
            <span className="silver-text">Sentinel Does</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg font-outfit font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Six mission-critical functions, unified in a single sovereign intelligence layer — always vigilant, always operational.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-gold p-8 group cursor-default"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${feature.accent}20, ${feature.accent}08)`,
                  border: `1px solid ${feature.accent}30`,
                  boxShadow: `0 0 20px ${feature.accent}20`,
                }}
              >
                {feature.icon}
              </div>

              {/* Diamond accent */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-block w-1 h-1 rotate-45 opacity-80"
                  style={{ background: feature.accent }}
                />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-60"
                  style={{ color: feature.accent }}>
                  ACTIVE
                </span>
              </div>

              <h3 className="text-xl font-space font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                {feature.title}
              </h3>
              <p className="text-sm font-outfit leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {feature.desc}
              </p>

              {/* Bottom glow line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
