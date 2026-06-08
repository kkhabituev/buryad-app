"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const API = "https://burlang.ru/api/v1";

type Direction = "ru→bur" | "bur→ru";

interface SearchSuggestion { value: string }
interface Translation { value: string }

export default function VocabularyPage() {
  const [dir, setDir] = useState<Direction>("ru→bur");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search suggestions ──────────────────────────────────────
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const endpoint = dir === "ru→bur" ? "russian-word" : "buryat-word";
      const res = await fetch(`${API}/${endpoint}/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data: SearchSuggestion[] = await res.json();
      setSuggestions(data.map((d) => d.value).slice(0, 8));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [dir]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTranslation(null);
    setSelectedWord(null);
    if (query.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 280);
  }, [query, fetchSuggestions]);

  // Clear suggestions when direction changes
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setTranslation(null);
    setSelectedWord(null);
    setError(null);
  }, [dir]);

  // ── Translate a word ────────────────────────────────────────
  const translate = async (word: string) => {
    setSelectedWord(word);
    setQuery(word);
    setSuggestions([]);
    setTranslating(true);
    setTranslation(null);
    setError(null);
    try {
      const endpoint = dir === "ru→bur" ? "russian-word" : "buryat-word";
      const res = await fetch(`${API}/${endpoint}/translate?q=${encodeURIComponent(word)}`);
      if (res.status === 404) { setError("Слово не найдено в словаре"); setTranslating(false); return; }
      if (!res.ok) throw new Error();
      const data: { translations: Translation[] } = await res.json();
      const text = data.translations.map((t) => t.value).join("; ");
      setTranslation(text || "Перевод не найден");
    } catch {
      setError("Ошибка соединения");
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) translate(query.trim());
  };

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
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
          Powered by burlang.ru
        </p>
      </div>

      <div className="px-4 pt-5 pb-24">

        {/* Direction toggle */}
        <div
          className="flex rounded-2xl p-1 mb-4"
          style={{ background: "#e2e8f0" }}
        >
          {(["ru→bur", "bur→ru"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => setDir(d)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
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

        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative">
          <div
            className="flex items-center gap-3 rounded-2xl px-4"
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
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
            {loading && (
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{
                  border: "2px solid #e2e8f0",
                  borderTopColor: "#1d4ed8",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            )}
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSuggestions([]); setTranslation(null); setSelectedWord(null); setError(null); }}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#f1f5f9" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 rounded-2xl overflow-hidden z-20 mt-1"
              style={{
                background: "white",
                border: "2px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => translate(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                    background: "white",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8faff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-base font-medium" style={{ color: "#0f172a" }}>{s}</span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Translation result */}
        {translating && (
          <div className="mt-4 rounded-2xl p-5 text-center" style={{ background: "white", border: "2px solid #e2e8f0" }}>
            <div
              className="w-8 h-8 rounded-full mx-auto"
              style={{ border: "3px solid #e2e8f0", borderTopColor: "#1d4ed8", animation: "spin 0.7s linear infinite" }}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
            <p className="text-sm font-semibold text-center" style={{ color: "#dc2626" }}>{error}</p>
          </div>
        )}

        {translation && selectedWord && !translating && (
          <div
            className="mt-4 rounded-2xl overflow-hidden card-reveal"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}
            >
              <span className="text-sm font-bold text-white">{selectedWord}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                {dir === "ru→bur" ? "бурятский" : "русский"}
              </span>
            </div>
            <div className="px-4 py-4" style={{ background: "white" }}>
              <p className="text-base leading-relaxed" style={{ color: "#1e3a5f", fontWeight: 600 }}>
                {translation}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!query && !translation && (
          <div className="mt-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
              style={{ background: "#eff6ff" }}
            >
              📖
            </div>
            <p className="text-base font-bold" style={{ color: "#1e3a5f" }}>Поищи любое слово</p>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>В базе тысячи бурятских слов</p>

            {/* Example searches */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {(dir === "ru→bur"
                ? ["кошка", "собака", "вода", "огонь", "мама", "дом"]
                : ["байха", "морин", "нохой", "уhан", "гэр"]
              ).map((ex) => (
                <button
                  key={ex}
                  onClick={() => translate(ex)}
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

      {/* CSS for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
