"use client";

import { useState, useRef } from "react";
import phrasebookData from "@/content/phrasebook.json";

type Category = typeof phrasebookData.categories[number];
type Phrase = Category["phrases"][number];
type SearchResult = Phrase & {
  catEmoji: string;
  catTitle: string;
  catId: string;
  phraseIdx: number;
};

// Copy to clipboard — compact icon button, placed next to the Buryat text
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      title={copied ? "Скопировано!" : "Скопировать бурятскую фразу"}
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-90"
      style={{
        background: copied ? "#dcfce7" : "#f1f5f9",
        border: `1.5px solid ${copied ? "#86efac" : "#e2e8f0"}`,
      }}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M20 6 9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="#94a3b8" strokeWidth="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#94a3b8" strokeWidth="2"/>
        </svg>
      )}
    </button>
  );
}

// Highlight matched substring
function HL({ text, q }: { text: string; q: string }): React.ReactNode {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: "#fef08a", borderRadius: 2 }}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function PhrasebookPage() {
  const [activeId, setActiveId]       = useState(phrasebookData.categories[0].id);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const active = phrasebookData.categories.find((c) => c.id === activeId) as Category;

  // ── Live search across all categories ──────────────────────
  const q = searchQuery.trim().toLowerCase();
  const searchResults: SearchResult[] = q.length > 0
    ? phrasebookData.categories.flatMap((cat) =>
        cat.phrases
          .map((p, i) => ({ ...p, catEmoji: cat.emoji, catTitle: cat.title, catId: cat.id, phraseIdx: i }))
          .filter(
            (p) =>
              p.buryat.toLowerCase().includes(q) ||
              p.russian.toLowerCase().includes(q) ||
              (("note" in p && typeof (p as { note?: string }).note === "string")
                ? ((p as { note?: string }).note ?? "").toLowerCase().includes(q)
                : false)
          )
      )
    : [];

  const isSearching = q.length > 0;

  return (
    <div style={{ background: "#f8faff", minHeight: "100dvh" }}>

      {/* Header */}
      <div
        className="px-5 pb-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Хэлэлсэгшэ</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Разговорник</h1>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 rounded-2xl px-3 mt-4"
          style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск фраз…"
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 py-3 text-sm font-medium bg-transparent outline-none placeholder-white/40"
            style={{ color: "white" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category tabs — hidden when searching */}
      {!isSearching && (
        <div
          className="sticky top-0 z-10 py-3"
          style={{ background: "rgba(248,250,255,0.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}
        >
          <div style={{ overflowX: "auto", display: "flex", gap: 8, padding: "0 16px", scrollbarWidth: "none" }}>
            {phrasebookData.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveId(cat.id); setExpanded(null); }}
                className="transition-all duration-200 active:scale-95"
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                  fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer",
                  background: activeId === cat.id ? "#1d4ed8" : "#f1f5f9",
                  color: activeId === cat.id ? "white" : "#64748b",
                }}
              >
                {cat.emoji} {cat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-4 pb-24">

        {/* ── SEARCH RESULTS ─────────────────────────────────────── */}
        {isSearching && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
              {searchResults.length > 0
                ? `${searchResults.length} ${searchResults.length === 1 ? "фраза" : searchResults.length < 5 ? "фразы" : "фраз"}`
                : "Ничего не найдено"}
            </p>

            {searchResults.length === 0 && (
              <div className="rounded-2xl p-8 text-center" style={{ background: "white", border: "2px solid #e2e8f0" }}>
                <p style={{ fontSize: "2.5rem" }}>🔍</p>
                <p className="text-sm font-bold mt-2" style={{ color: "#64748b" }}>
                  Нет фраз по запросу «{searchQuery}»
                </p>
                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Попробуй другое слово</p>
              </div>
            )}

            <div className="space-y-2">
              {searchResults.map((p, i) => {
                const key = `search-${p.catId}-${p.phraseIdx}-${i}`;
                const isOpen = expanded === key;
                return (
                  <button
                    key={key}
                    onClick={() => setExpanded(isOpen ? null : key)}
                    className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200 active:scale-98"
                    style={{
                      background: "white",
                      border: isOpen ? "2px solid #bfdbfe" : "2px solid #e2e8f0",
                      boxShadow: isOpen ? "0 4px 16px rgba(29,78,216,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="px-4 py-3.5 flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{p.catEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold mb-0.5" style={{ color: "#94a3b8" }}>{p.catTitle}</p>
                        <p className="font-bold text-base leading-tight" style={{ color: "#0f172a" }}>
                          <HL text={p.buryat} q={q} />
                        </p>
                        {!isOpen && (
                          <p className="text-sm mt-0.5 font-medium" style={{ color: "#64748b" }}>
                            <HL text={p.russian} q={q} />
                          </p>
                        )}
                      </div>
                      <CopyButton text={p.buryat} />
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        className="flex-shrink-0 transition-transform duration-200 mt-1"
                        style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                      >
                        <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #eff6ff" }}>
                        <div className="rounded-xl p-3" style={{ background: "#eff6ff" }}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>Перевод</p>
                          <p className="text-base font-bold" style={{ color: "#1d4ed8" }}>{p.russian}</p>
                        </div>
                        {("note" in p && typeof (p as { note?: string }).note === "string") && (
                          <p className="text-xs mt-2 italic px-1" style={{ color: "#94a3b8" }}>
                            💡 {(p as { note?: string }).note}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── NORMAL CATEGORY VIEW ───────────────────────────────── */}
        {!isSearching && (
          <>
            <div
              className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background: active.gradient, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
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
                    style={{
                      background: "white",
                      border: isOpen ? "2px solid #bfdbfe" : "2px solid #e2e8f0",
                      boxShadow: isOpen ? "0 4px 16px rgba(29,78,216,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="px-4 py-3.5 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{ background: isOpen ? "#dbeafe" : "#f1f5f9", color: isOpen ? "#1d4ed8" : "#94a3b8" }}
                      >
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
                      <CopyButton text={phrase.buryat} />
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                      >
                        <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #eff6ff" }}>
                        <div className="rounded-xl p-3" style={{ background: "#eff6ff" }}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>Перевод</p>
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

            <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1.5px solid #bfdbfe" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "#1d4ed8" }}>📖 Скоро больше фраз</p>
              <p className="text-xs leading-relaxed" style={{ color: "#3b82f6" }}>
                Раздел пополняется. Если у тебя есть фразы для добавления — мы рады принять!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
