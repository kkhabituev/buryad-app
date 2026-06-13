"use client";

import { useState } from "react";
import phrasebookData from "@/content/phrasebook.json";

type Category = typeof phrasebookData.categories[number];

export default function PhrasebookPage() {
  const [activeId, setActiveId] = useState(phrasebookData.categories[0].id);
  const [expanded, setExpanded] = useState<string | null>(null);

  const active = phrasebookData.categories.find((c) => c.id === activeId) as Category;

  return (
    <div style={{ background: "#f8faff", minHeight: "100dvh" }}>

      {/* Header */}
      <div className="px-5 pb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)", paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Хэлэлсэгшэ</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Разговорник</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Живые бурятские фразы</p>
      </div>

      {/* Category tabs */}
      <div className="sticky top-0 z-10 py-3"
        style={{ background: "rgba(248,250,255,0.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ overflowX: "auto", display: "flex", gap: 8, padding: "0 16px", scrollbarWidth: "none" }}>
          {phrasebookData.categories.map((cat) => (
            <button key={cat.id} onClick={() => { setActiveId(cat.id); setExpanded(null); }}
              className="transition-all duration-200 active:scale-95"
              style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer",
                background: activeId === cat.id ? "#1d4ed8" : "#f1f5f9",
                color: activeId === cat.id ? "white" : "#64748b",
              }}>
              {cat.emoji} {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases list */}
      <div className="px-4 pt-4 pb-24">
        {/* Category header card */}
        <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{ background: active.gradient, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: "2.5rem" }}>{active.emoji}</span>
          <div>
            <p className="text-lg font-bold text-white">{active.title}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
              {active.phrases.length} фраз
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {active.phrases.map((phrase, i) => {
            const key = `${active.id}-${i}`;
            const isOpen = expanded === key;
            return (
              <button
                key={key}
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 active:scale-98"
                style={{ background: "white", border: isOpen ? "2px solid #bfdbfe" : "2px solid #e2e8f0", boxShadow: isOpen ? "0 4px 16px rgba(29,78,216,0.08)" : "0 1px 4px rgba(0,0,0,0.04)" }}>
                {/* Main row */}
                <div className="px-4 py-3.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ background: isOpen ? "#dbeafe" : "#f1f5f9", color: isOpen ? "#1d4ed8" : "#94a3b8" }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base leading-tight" style={{ color: "#0f172a" }}>
                      {phrase.buryat}
                    </p>
                    {!isOpen && (
                      <p className="text-sm mt-0.5 font-medium" style={{ color: "#64748b" }}>
                        {phrase.russian}
                      </p>
                    )}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(90deg)" : "none" }}>
                    <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #eff6ff" }}>
                    <div className="rounded-xl p-3" style={{ background: "#eff6ff" }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                        Перевод
                      </p>
                      <p className="text-base font-bold" style={{ color: "#1d4ed8" }}>{phrase.russian}</p>
                    </div>
                    {(phrase as { note?: string }).note && (
                      <p className="text-xs mt-2 italic px-1" style={{ color: "#94a3b8" }}>
                        💡 {(phrase as { note?: string }).note}
                      </p>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info block */}
        <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1.5px solid #bfdbfe" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#1d4ed8" }}>📖 Скоро больше фраз</p>
          <p className="text-xs leading-relaxed" style={{ color: "#3b82f6" }}>
            Раздел пополняется. Если у тебя есть фразы для добавления — мы рады принять!
          </p>
        </div>
      </div>

      <style>{`.phrase-tab::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
