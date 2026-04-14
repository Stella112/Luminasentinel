import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#E0E0E0", // Silver Light
          glow: "rgba(224, 224, 224, 0.3)",
        },
        secondary: {
          DEFAULT: "#8E8E93", // Chrome/Gray
          glow: "rgba(142, 142, 147, 0.2)",
        },
        accent: {
          DEFAULT: "#FFFFFF", // High specularity
        },
        surface: "rgba(5, 5, 5, 0.85)",
      },
      fontFamily: {
        space: ["var(--font-space-grotesk)"],
        outfit: ["var(--font-outfit)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "metal-shine": "metal-shine 3s linear infinite",
        "glitter": "glitter 8s ease-in-out infinite",
      },
      keyframes: {
        "metal-shine": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glitter": {
          "0%, 100%": { transform: "translateY(0) opacity(0)" },
          "50%": { transform: "translateY(-100px) opacity(0.8)" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
