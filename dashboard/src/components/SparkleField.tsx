"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: "circle" | "diamond" | "star";
  life: number;
  maxLife: number;
}

const GOLD_PALETTE = [
  "rgba(212, 175, 55, ",
  "rgba(245, 230, 200, ",
  "rgba(184, 150, 12, ",
];
const SILVER_PALETTE = ["rgba(192, 192, 192, ", "rgba(229, 229, 229, "];
const CYAN_PALETTE = ["rgba(0, 229, 255, "];

const ALL_COLORS = [
  ...GOLD_PALETTE, ...GOLD_PALETTE, ...GOLD_PALETTE,
  ...SILVER_PALETTE, ...SILVER_PALETTE,
  ...CYAN_PALETTE,
];

export const SparkleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    const px = x ?? Math.random() * (canvas?.width ?? window.innerWidth);
    const py = y ?? Math.random() * (canvas?.height ?? window.innerHeight);
    const colorBase = ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
    const types: Array<"circle" | "diamond" | "star"> = ["circle", "diamond", "circle", "circle"];
    return {
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.1,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: colorBase,
      type: types[Math.floor(Math.random() * types.length)],
      life: 0,
      maxLife: Math.random() * 200 + 100,
    };
  }, []);

  const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const len = size * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn initial particles
    for (let i = 0; i < 80; i++) {
      particles.current.push(createParticle());
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Trail particles
      for (let i = 0; i < 2; i++) {
        const p = createParticle(
          e.clientX + (Math.random() - 0.5) * 20,
          e.clientY + (Math.random() - 0.5) * 20
        );
        p.maxLife = 60;
        p.size = Math.random() * 2 + 1;
        p.vy -= 0.5;
        particles.current.push(p);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Maintain particle count
      while (particles.current.length < 80) {
        particles.current.push(createParticle());
      }

      particles.current = particles.current.filter(p => p.life < p.maxLife);

      for (const p of particles.current) {
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio) * (lifeRatio < 0.1 ? lifeRatio * 10 : 1);

        // Mouse attraction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.03;
          p.vx += dx * force * 0.01;
          p.vy += dy * force * 0.01;
        }

        // Max speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) { p.vx = (p.vx / speed) * 2; p.vy = (p.vy / speed) * 2; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Glow effect
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = p.color + "0.8)";

        const fillStyle = p.color + currentOpacity.toFixed(2) + ")";
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = fillStyle;

        if (p.type === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "diamond") {
          drawDiamond(ctx, p.x, p.y, p.size);
          ctx.fill();
        } else {
          drawStar(ctx, p.x, p.y, p.size);
        }

        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="sparkle-canvas"
      aria-hidden="true"
    />
  );
};
