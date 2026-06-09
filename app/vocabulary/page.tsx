"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const API = "https://burlang.ru/api/v1";
const HISTORY_KEY = "buryad_search_history";
const MAX_HISTORY = 8;

type Direction = "ru→bur" | "bur→ru";

interface SearchSuggestion { value: string }
interface Translation { value: string }

// ── LocalStorage helpers ────────────────────────────────────────
function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveToHistory(word: string) {
  const h = getHistory().filter((w) => w.toLowerCase() !== word.toLowerCase());
  h.unshift(word);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
}
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// ──────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const [dir, setDir] = useState<Direction>("ru→bur");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [translation, setTranslation] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setHistory(getHistory()); }, []);

  // ── Translate ────────────────────────────────────────────────
  const translate = useCallback(async (word: string, addHist = true) => {
    if (!word.trim()) return;
    setSelectedWord(word);
    setError(null);
    setLoadingTranslate(true);
    try {
      const endpoint = dir === "ru→bur" ? "russian-word" : "buryat-word";
      const res = await fetch(`${API}/${endpoint}/translate?q=${encodeURIComponent(word.trim())}`);
      if (res.status === 404) { setTranslation(null); setError("Слово не найдено"); setLoadingTranslate(false); return; }
      if (!res.ok) throw new Error();
      const data: { translations: Translation[] } = await res.json();
      const text = data.translations.map((t) => t.value).filter(Boolean).join("; ");
      setTranslation(text || null);
      if (!text) setError("Перевод не найден");
      if (addHist && text) { saveToHistory(word.trim()); setHistory(getHistory()); }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoadingTranslate(false);
    }
  }, [dir]);

  // ── Debounced auto-search + auto-translate ───────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setError(null);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setTranslation(null);
      setSelectedWord(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const endpoint = dir === "ru→bur" ? "russian-word" : "buryat-word";
        const res = await fetch(`${API}/${endpoint}/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: SearchSuggestion[] = await res.json();
          setSuggestions(data.map((d) => d.value).slice(0, 6));
        }
      } finally {
        setLoadingSuggest(false);
      }
      translate(query, false);
    }, 350);
  }, [query, dir, translate]);

  // Reset on direction change
  useEffect(() => {
    setQuery(""); setSuggestions([]); setTranslation(null);
    setSelectedWord(null); setError(null);
  }, [dir]);

  const pickWord = (word: string) => {
    setQuery(word);
    setSuggestions([]);
    translate(word);
  };

  const clearAll = () => {
    setQuery(""); setSuggestions([]); setTranslation(null);
    setSelectedWord(null); setError(null);
  };

  // ─────────────────────────────────────────────────────────────
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
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Үгын сан</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Словарь</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>Перевод любого слова</p>
      </div>

      <div className="px-4 pt-4 pb-24">

        {/* Direction toggle */}
        <div className="flex rounded-2xl p-1 mb-4" style={{ background: "#e2e8f0" }}>
          {(["ru→bur", "bur→ru"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => setDir(d)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
              style={{
                background: dir === d ? "white" : "transparent",
                color: dir === d ? "#1d4ed8" : "#64748b",
                boxShadow: dir === d ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {d === "ru→bur" ? "🇷🇺 Русский → Бурятский" : "Бурятский → 🇷🇺 Русский"}
            </button>
          ))}
        </div>

        {/* Search field */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4"
          style={{ background: "white", border: "2px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dir === "ru→bur" ? "Введи русское слово…" : "Введи бурятское слово…"}
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 py-4 text-base font-medium outline-none bg-transparent"
            style={{ color: "#0f172a" }}
          />
          {loadingSuggest && (
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: "2px solid #e2e8f0", borderTopColor: "#1d4ed8", animation: "spin 0.7s linear infinite" }} />
          )}
          {query && (
            <button type="button" onClick={clearAll} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f1f5f9" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions — inline chips (NOT absolute, never overlaps) */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pickWord(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{
                  background: "white",
                  color: "#1d4ed8",
                  border: "1.5px solid #dbeafe",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#93c5fd" strokeWidth="2.5" />
                  <path d="m20 20-3.5-3.5" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Translation result — always below suggestions */}
        {loadingTranslate && (
          <div className="mt-4 rounded-2xl p-5 text-center" style={{ background: "white", border: "2px solid #e2e8f0" }}>
            <div className="w-7 h-7 rounded-full mx-auto" style={{ border: "3px solid #e2e8f0", borderTopColor: "#1d4ed8", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {error && !loadingTranslate && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
            <p className="text-sm font-semibold text-center" style={{ color: "#dc2626" }}>{error}</p>
          </div>
        )}

        {translation && selectedWord && !loadingTranslate && (
          <div className="mt-4 rounded-2xl overflow-hidden card-reveal" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}>
              <span className="text-sm font-bold text-white">{selectedWord}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                {dir === "ru→bur" ? "бурятский" : "русский"}
              </span>
            </div>
            <div className="px-4 py-4" style={{ background: "white" }}>
              <p className="text-lg font-bold leading-relaxed" style={{ color: "#1e3a5f" }}>{translation}</p>
            </div>
          </div>
        )}

        {/* Empty state: history + example chips */}
        {!query && !translation && (
          <div className="mt-4">
            {history.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                    🕐 Недавние
                  </p>
                  <button
                    onClick={() => { clearHistory(); setHistory([]); }}
                    className="text-xs font-semibold"
                    style={{ color: "#94a3b8" }}
                  >
                    Очистить
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {history.map((w) => (
                    <button
                      key={w}
                      onClick={() => { setQuery(w); translate(w); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition active:scale-95"
                      style={{ background: "white", color: "#1d4ed8", border: "1.5px solid #dbeafe" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {w}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94a3b8" }}>
              Попробуй
            </p>
            <div className="flex flex-wrap gap-2">
              {(dir === "ru→bur"
                ? ["кошка", "собака", "вода", "огонь", "мама", "дом", "земля", "небо"]
                : ["байха", "морин", "нохой", "уhан", "гэр", "тэнгэри"]
              ).map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); translate(ex); }}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold transition active:scale-95"
                  style={{ background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #dbeafe" }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
