"use client";

import { useState } from "react";

interface NumberCardProps {
  number: number;
  buryat: string;
  variants?: string[];
}

export default function NumberCard({ number, buryat, variants }: NumberCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card h-28 cursor-pointer select-none`}
      style={{ minHeight: 112 }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front */}
        <div
          className="flip-card-front card-shadow"
          style={{
            background: "white",
            border: "2px solid #e8e0d5",
          }}
        >
          <span
            className="block text-4xl font-bold leading-none"
            style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {number}
          </span>
          <span className="block text-xs mt-2 font-medium" style={{ color: "#9b8e7f" }}>
            нажми
          </span>
        </div>

        {/* Back */}
        <div
          className="flip-card-back"
          style={{
            background: "#1e3a5f",
          }}
        >
          <span
            className="block text-xl font-bold text-center px-2 leading-tight"
            style={{ color: "#f5e6d3" }}
          >
            {buryat}
          </span>
          {variants && variants.length > 0 && (
            <span
              className="block text-xs text-center mt-1 px-2"
              style={{ color: "rgba(245, 230, 211, 0.7)" }}
            >
              {variants.join(", ")}
            </span>
          )}
          <span
            className="absolute bottom-2 right-2 text-xs font-bold"
            style={{ color: "rgba(201, 133, 58, 0.9)" }}
          >
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}
