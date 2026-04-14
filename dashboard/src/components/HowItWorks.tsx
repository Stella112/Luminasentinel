"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scan, ShieldAlert, Cpu, Zap } from "lucide-react";

const steps = [
  {
    icon: <Scan className="w-8 h-8" />,
    title: "Identity Synthesis",
    desc: "Lumina connects to your Solana address, performing a deep-level scan of your onchain history and current permissions."
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Neural Guardian Analysis",
    desc: "Our AI brain processes thousands of protocols to identify hidden risks, malicious delegations, and drained approvals."
  },
  {
    icon: <ShieldAlert className="w-8 h-8" />,
    title: "Threat Neutralization",
    desc: "High-risk threats are flagged in real-time. You receive surgical alerts with one-click revocation capabilities."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Sovereign Optimization",
    desc: "Beyond security, Lumina optimizes your position, suggesting protocol migrations and yield-security balancing."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-black">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-space font-black mb-6 chrome-text uppercase tracking-tighter">
            THE SENTINEL PROTOCOL
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-outfit">
            How Lumina Sentinel transforms from a passive observer to an active autonomous guardian of your wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all chrome-border">
                {step.icon}
              </div>
              <div className="absolute top-10 left-20 right-0 h-[1px] bg-gradient-to-r from-white/20 to-transparent hidden md:block" />
              
              <h3 className="text-xl font-space font-bold mb-4 text-white uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm font-outfit leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Connection Line Decoration */}
        <div className="mt-20 p-8 glass rounded-3xl border border-white/5 chrome-border text-center">
          <p className="text-white font-mono text-sm tracking-widest uppercase opacity-70">
            [ STATUS: LOGIC CORE ONLINE // MONITORING ACTIVE ]
          </p>
        </div>
      </div>
    </section>
  );
};
