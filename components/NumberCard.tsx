"use client";

import { useState } from "react";

interface NumberCardProps {
  number: number;
  buryat: string;
  variants?: string[];
  colorIndex?: number;
}

const CARD_COLORS = [
  { bg: "linear-gradient(140deg, #ef4444 0%, #dc2626 100%)", glow: "#ef4444" },
  { bg: "linear-gradient(140deg, #f97316 0%, #ea580c 100%)", glow: "#f97316" },
  { bg: "linear-gradient(140deg, #f59e0b 0%, #d97706 100%)", glow: "#f59e0b" },
  { bg: "linear-gradient(140deg, #22c55e 0%, #16a34a 100%)", glow: "#22c55e" },
  { bg: "linear-gradient(140deg, #06b6d4 0%, #0891b2 100%)", glow: "#06b6d4" },
  { bg: "linear-gradient(140deg, #6366f1 0%, #4f46e5 100%)", glow: "#6366f1" },
  { bg: "linear-gradient(140deg, #ec4899 0%, #db2777 100%)", glow: "#ec4899" },
  { bg: "linear-gradient(140deg, #14b8a6 0%, #0d9488 100%)", glow: "#14b8a6" },
  { bg: "linear-gradient(140deg, #8b5cf6 0%, #7c3aed 100%)", glow: "#8b5cf6" },
  { bg: "linear-gradient(140deg, #1d4ed8 0%, #1e3a5f 100%)", glow: "#1d4ed8" },
];

export default function NumberCard({ number, buryat, variants, colorIndex = 0 }: NumberCardProps) {
  const [flipped, setFlipped] = useState(false);
  const color = CARD_COLORS[colorIndex % CARD_COLORS.length];

  return (
    <div
      className={`flip-card cursor-pointer select-none btn-tap${flipped ? " flipped" : ""}`}
      style={{ height: 130, minHeight: 130 }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="flip-card-inner"
        style={{ height: "100%" }}
      >
        {/* FRONT */}
        <div
          className="flip-card-front"
          style={{
            background: color.bg,
            boxShadow: `0 4px 20px -4px ${color.glow}55`,
          }}
        >
          <span
            className="block text-5xl font-bold leading-none"
            style={{ color: "white", fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {number}
          </span>
          <span
            className="block text-xs mt-2 font-semibold tracking-wide uppercase"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            нажми
          </span>
        </div>

        {/* BACK */}
        <div
          className="flip-card-back"
          style={{
            background: "white",
            border: `3px solid ${color.glow}`,
            boxShadow: `0 4px 20px -4px ${color.glow}44`,
          }}
        >
          <span
            className="block text-2xl font-bold text-center px-3 leading-snug"
            style={{ color: "#0f172a" }}
          >
            {buryat}
          </span>
          {variants && variants.length > 0 && (
            <span
              className="block text-xs text-center mt-1.5 px-3"
              style={{ color: "#64748b" }}
            >
              {variants.join(" / ")}
            </span>
          )}
          <span
            className="absolute bottom-2 right-3 text-xl font-bold"
            style={{ color: color.glow }}
          >
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}
