"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Shield, AlertTriangle, Zap } from "lucide-react";

interface Stats {
  pubkey: string;
  agentId: string;
  chatUrl: string;
  solBalance: number;
  tokenCount: number;
  riskyApprovals: number;
  approvals: Array<{ mint: string; delegate: string; amount: number }>;
}

const SecurityMeter = ({ score }: { score: number }) => (
  <div className="relative">
    <svg viewBox="0 0 120 120" className="w-28 h-28">
      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle
        cx="60" cy="60" r="50" fill="none"
        stroke="url(#goldGrad)" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * 314} 314`}
        transform="rotate(-90 60 60)"
      />
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8960C" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F5E6C8" />
        </linearGradient>
      </defs>
      <text x="60" y="55" textAnchor="middle" fill="#D4AF37" fontSize="20" fontWeight="900" fontFamily="Space Grotesk">
        {score}
      </text>
      <text x="60" y="70" textAnchor="middle" fill="#808080" fontSize="8" fontFamily="JetBrains Mono">
        SECURITY
      </text>
    </svg>
  </div>
);

export const TerminalDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [tick, setTick] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/sentinel/stats`);
      const data = await res.json();
      setStats(data);
      setLogs([
        "SENTINEL_BOOT: Protocol initialized ✓",
        `WALLET_SYNC: ${data.pubkey?.slice(0, 8)}...${data.pubkey?.slice(-6)} verified`,
        `BALANCE_CHECK: ${data.solBalance?.toFixed(4)} SOL detected`,
        `TOKEN_SCAN: ${data.tokenCount} active assets indexed`,
        `RISK_ANALYSIS: ${data.riskyApprovals} delegations flagged`,
        "NEURAL_CORE: Qwen intelligence layer active",
        "GUARDIAN_MODE: VIGILANT ∞",
      ]);
    } catch {
      setLogs(["SENTINEL_CORE: Connecting to guardian protocol...", "LINK: Establishing secure channel..."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    const ticker = setInterval(() => setTick(t => !t), 600);
    return () => { clearInterval(interval); clearInterval(ticker); };
  }, []);

  return (
    <section id="dashboard" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[11px] font-mono font-bold tracking-[0.5em] uppercase mb-6" style={{ color: "#D4AF37" }}>
            // LIVE SYSTEM BRIEFING
          </span>
          <h2 className="text-4xl md:text-5xl font-space font-black uppercase">
            <span className="gold-text">Dashboard</span>
            <span className="silver-text"> Preview</span>
          </h2>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="terminal"
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.03)" }}>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]/70" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]/70" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]/70" />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
              // SENTINEL_OS v4.2 — SECURE
            </span>
            <button onClick={fetchStats}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} style={{ color: "#D4AF37" }} />
            </button>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Col 1 — Security Score */}
            <div className="flex flex-col items-center justify-center gap-8 border-b lg:border-b-0 lg:border-r pb-10 lg:pb-0 lg:pr-10"
              style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <SecurityMeter score={99} />
              <div className="w-full space-y-3">
                {[
                  { label: "Logic Protocol", value: "DEEP-SYNC" },
                  { label: "Neural Core", value: "QWEN ACTIVE" },
                  { label: "Uptime", value: "99.999%" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: "#D4AF37" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2 — Asset Matrix */}
            <div className="border-b lg:border-b-0 lg:border-r pb-10 lg:pb-0 lg:pr-10 space-y-6"
              style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <div className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase mb-6" style={{ color: "#D4AF37" }}>
                ASSET MATRIX
              </div>

              {/* Wallet address */}
              <div className="glass-gold rounded-lg p-4">
                <div className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>WALLET IDENTITY</div>
                <div className="font-mono text-[11px] break-all leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {stats?.pubkey ?? "Connecting..."}
                </div>
              </div>

              {/* SOL Balance */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>SOL CORE</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: "#D4AF37" }}>{stats?.solBalance?.toFixed(4) ?? "–"} SOL</span>
                </div>
                <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div className="h-px" style={{ background: "linear-gradient(to right, #B8960C, #D4AF37, #F5E6C8)" }}
                    initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2.5 }} />
                </div>
              </div>

              {/* Token count */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>ACTIVE ASSETS</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: "#E5E5E5" }}>{stats?.tokenCount ?? "–"} TOKENS</span>
                </div>
                <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <motion.div className="h-px bg-[#C0C0C0]"
                    initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 2.5, delay: 0.5 }} />
                </div>
              </div>

              {/* Risk Alert */}
              <div className={`rounded-lg p-4 border ${(stats?.riskyApprovals ?? 0) > 0 ? "border-red-500/30 bg-red-500/5" : "border-[#D4AF37]/20 bg-[#D4AF37]/5"}`}>
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${(stats?.riskyApprovals ?? 0) > 0 ? "text-red-400" : "text-[#D4AF37]"}`} />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: (stats?.riskyApprovals ?? 0) > 0 ? "#f87171" : "#D4AF37" }}>
                    {stats?.riskyApprovals ?? 0} THREATS DETECTED
                  </span>
                </div>
              </div>
            </div>

            {/* Col 3 — Live Intel Stream */}
            <div>
              <div className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase mb-6" style={{ color: "#D4AF37" }}>
                // LIVE_INTEL_STREAM
              </div>
              <div className="space-y-3 font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="opacity-30" style={{ color: "var(--text-secondary)" }}>[{(1024 + i).toString().padStart(4, "0")}]</span>
                    <span style={{ color: i === logs.length - 1 ? "#D4AF37" : "var(--text-secondary)" }}>{log}</span>
                  </div>
                ))}
                <div className="flex gap-3">
                  <span className="opacity-30 font-mono text-[11px]" style={{ color: "var(--text-secondary)" }}>[{(1024 + logs.length).toString().padStart(4, "0")}]</span>
                  <span className="w-2 h-4 inline-block" style={{ background: "#D4AF37", opacity: tick ? 1 : 0 }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
