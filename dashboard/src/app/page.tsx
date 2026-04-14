import { StickyNav } from "@/components/StickyNav";
import { Hero } from "@/components/Hero";
import { SparkleField } from "@/components/SparkleField";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { TerminalDashboard } from "@/components/TerminalDashboard";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Global particle background */}
      <SparkleField />

      {/* Navigation */}
      <StickyNav />

      {/* Page content above sparkles */}
      <div className="relative z-10">

        {/* 1. Hero */}
        <Hero />

        {/* 2. What Lumina Sentinel Does */}
        <FeaturesGrid />

        {/* 3. Live Dashboard Preview */}
        <TerminalDashboard />

        {/* 4. Footer */}
        <footer className="py-24 border-t relative" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="text-2xl font-space font-black gold-text mb-2">LUMINA SENTINEL</div>
                <p className="text-sm font-outfit" style={{ color: "var(--text-secondary)" }}>
                  Your Onchain Jarvis — Personal AI Life OS & Finance Guardian
                </p>
              </div>
              <div className="flex gap-8 text-[11px] font-mono font-bold tracking-[0.3em] uppercase" style={{ color: "var(--text-secondary)" }}>
                <a href="#features" className="hover:text-[#D4AF37] transition-colors">Features</a>
                <a href="#dashboard" className="hover:text-[#D4AF37] transition-colors">Dashboard</a>
                <a href="/chat" className="hover:text-[#D4AF37] transition-colors">Chat</a>
                <a href="https://nosana.io" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors">Nosana</a>
              </div>
            </div>
            <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
              style={{ borderColor: "rgba(212,175,55,0.08)" }}>
              <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>
                © 2026 LUMINA PROTOCOLS · VIGILANCE IS FREEDOM
              </span>
              <span className="text-[10px] font-mono" style={{ color: "rgba(212,175,55,0.5)" }}>
                Powered by Nosana × ElizaOS × Qwen Intelligence
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
