"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const API = "https://burlang.ru/api/v1";
const HISTORY_KEY = "buryad_search_history";
const FAVS_KEY    = "buryad_favs";
const MAX_HISTORY = 8;

// ── Random word pools ───────────────────────────────────────────
const RANDOM_RU = [
  "вода","огонь","земля","небо","солнце","луна","звезда","ветер","снег","дождь",
  "дерево","река","гора","степь","лес","озеро","камень","трава",
  "мама","папа","брат","сестра","бабушка","дедушка","сын","дочь","муж","жена",
  "дом","город","деревня","дорога","мост","юрта",
  "кошка","собака","лошадь","медведь","волк","лиса","заяц","орёл","рыба","корова",
  "хлеб","мясо","молоко","чай","суп","вода","масло",
  "красный","синий","белый","чёрный","жёлтый","зелёный","серый","розовый",
  "один","два","три","пять","десять","сто","тысяча",
  "сердце","рука","нога","глаз","голова","нос","рот","ухо",
  "хорошо","плохо","красиво","большой","маленький","быстро","тихо",
  "идти","жить","спать","говорить","думать","любить","знать","видеть",
  "утро","вечер","ночь","день","год","неделя","сегодня","завтра","вчера",
  "счастливый","грустный","добрый","сильный","умный",
  "Байкал","Бурятия","Россия","народ","язык","песня","танец",
];

const RANDOM_BUR = [
  "уhан","гал","газар","тэнгэри","наран","hара","одон","hалхин","саhан","бороо",
  "модон","гол","хада","тала","ой","нуур","шулуун","ногоон",
  "эжы","аба","аха","эгэшэ","дүү","хүгшэн эжы","хүгшэн аба","хүбүүн","басаган",
  "гэр","хото","тосхон","зам","хүүргэ",
  "миисгэй","нохой","морин","баабгай","шоно","үнэгэн","шандаган","бүргэд","загаhан","үнеэн",
  "хилээмэн","мяхан","hүн","сай","шүлэн",
  "улаан","хүхэ","сагаан","хара","шара","ногоон","боро","ягаан",
  "нэгэн","хоёр","гурба","табан","арбан","зуун","мянган",
  "зүрхэн","гар","хүл","нюдэн","толгой","хамар","аман","шэхэн",
  "hайн","муу","гоё","томо","жэжэхэн",
  "ябаха","байха","унтаха","хэлэхэ","бодохо","дуратай","мэдэхэ","харахa",
  "үглөө","үдэшэ","hүни","үдэр","жэл","долоон хоног",
  "жаргалтай","уйдхартай","hайхан","хүсэтэй","ухаантай",
  "Байгал","Буряад орон","арад","хэлэн","дуун",
];

type Direction = "ru→bur" | "bur→ru";

interface SearchSuggestion { value: string }
interface Translation { value: string }
interface Favorite { word: string; translation: string; dir: Direction }

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
function clearHistory() { localStorage.removeItem(HISTORY_KEY); }

function getFavs(): Favorite[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAVS_KEY) || "[]"); } catch { return []; }
}
function isFavSaved(word: string, dir: Direction) {
  return getFavs().some((f) => f.word.toLowerCase() === word.toLowerCase() && f.dir === dir);
}
function toggleFavSaved(item: Favorite): Favorite[] {
  const favs = getFavs();
  const idx = favs.findIndex((f) => f.word.toLowerCase() === item.word.toLowerCase() && f.dir === item.dir);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.unshift(item);
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs.slice(0, 60)));
  return [...favs];
}

// ── Copy button ─────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      title="Скопировать перевод"
      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all duration-150 active:scale-95"
      style={{
        background: copied ? "#dcfce7" : "#f1f5f9",
        color: copied ? "#16a34a" : "#64748b",
        border: `1px solid ${copied ? "#bbf7d0" : "#e2e8f0"}`,
        fontSize: "0.72rem", fontWeight: 700,
      }}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M20 6 9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Скопировано
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="#64748b" strokeWidth="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#64748b" strokeWidth="2"/>
          </svg>
          Копировать
        </>
      )}
    </button>
  );
}

// ── Flag SVGs (flag emojis don't render on Windows) ─────────────
const FLAG_STYLE: React.CSSProperties = {
  display: "inline", verticalAlign: "middle",
  borderRadius: 2, border: "0.5px solid rgba(0,0,0,0.12)", flexShrink: 0,
};

function RussianFlag() {
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" style={FLAG_STYLE}>
      <rect width="22" height="5"  fill="white" />
      <rect y="5"  width="22" height="5"  fill="#003DA5" />
      <rect y="10" width="22" height="5"  fill="#CC0000" />
    </svg>
  );
}

function BuryatFlag() {
  return (
    <svg width="22" height="15" viewBox="0 0 22 15" style={FLAG_STYLE}>
      <rect width="22" height="5"  fill="#003DA5" />
      <rect y="5"  width="22" height="5"  fill="white" />
      <rect y="10" width="22" height="5"  fill="#FFD700" />
      {/* Simplified Soyombo on blue stripe */}
      <circle cx="5.5" cy="2.5" r="1.3"  fill="#FFD700" />
      <path d="M3.9 3.8 Q5.5 4.8 7.1 3.8" fill="none" stroke="#FFD700" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M4.8 1.4 L5.5 0.4 L6.2 1.4" fill="#FFD700" />
    </svg>
  );
}

// ── Star icon ───────────────────────────────────────────────────
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={filled ? "#fbbf24" : "rgba(255,255,255,0.7)"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const [dir, setDir]                   = useState<Direction>("ru→bur");
  const [query, setQuery]               = useState("");
  const [suggestions, setSuggestions]   = useState<string[]>([]);
  const [translation, setTranslation]   = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [history, setHistory]           = useState<string[]>([]);
  const [favorites, setFavorites]       = useState<Favorite[]>([]);
  const [isFav, setIsFav]               = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHistory(getHistory());
    setFavorites(getFavs());
  }, []);

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
      setIsFav(isFavSaved(word.trim(), dir));
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoadingTranslate(false);
    }
  }, [dir]);

  // ── Debounced auto-search ────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setError(null);
    if (query.trim().length < 2) {
      setSuggestions([]); setTranslation(null); setSelectedWord(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const endpoint = dir === "ru→bur" ? "russian-word" : "buryat-word";
        const res = await fetch(`${API}/${endpoint}/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: SearchSuggestion[] = await res.json();
          const results = data.map((d) => d.value).slice(0, 6);
          setSuggestions(results);
          translate(results.length > 0 ? results[0] : query, false);
        } else {
          translate(query, false);
        }
      } finally {
        setLoadingSuggest(false);
      }
    }, 350);
  }, [query, dir, translate]);

  useEffect(() => {
    setQuery(""); setSuggestions([]); setTranslation(null);
    setSelectedWord(null); setError(null); setIsFav(false);
  }, [dir]);

  const pickWord = (word: string) => { setQuery(word); setSuggestions([]); translate(word); };
  const clearAll = () => {
    setQuery(""); setSuggestions([]); setTranslation(null);
    setSelectedWord(null); setError(null); setIsFav(false);
  };

  const handleToggleFav = () => {
    if (!selectedWord || !translation) return;
    const updated = toggleFavSaved({ word: selectedWord, translation, dir });
    setFavorites(updated);
    setIsFav(!isFav);
  };

  const handleRandom = () => {
    const pool = dir === "ru→bur" ? RANDOM_RU : RANDOM_BUR;
    // avoid repeating the current word
    const filtered = pool.filter((w) => w !== query);
    const word = (filtered.length ? filtered : pool)[Math.floor(Math.random() * (filtered.length || pool.length))];
    setQuery(word);
    setSuggestions([]);
    translate(word);
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
          <button
            onClick={() => setDir("ru→bur")}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              background: dir === "ru→bur" ? "white" : "transparent",
              color: dir === "ru→bur" ? "#1d4ed8" : "#64748b",
              boxShadow: dir === "ru→bur" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <RussianFlag /> → <BuryatFlag />
          </button>
          <button
            onClick={() => setDir("bur→ru")}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              background: dir === "bur→ru" ? "white" : "transparent",
              color: dir === "bur→ru" ? "#1d4ed8" : "#64748b",
              boxShadow: dir === "bur→ru" ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <BuryatFlag /> → <RussianFlag />
          </button>
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

        {/* Random word button */}
        <div className="flex justify-end mt-2 mb-1">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 active:scale-95"
            style={{
              background: "white",
              color: "#7c3aed",
              border: "1.5px solid #ddd6fe",
              boxShadow: "0 1px 4px rgba(124,58,237,0.08)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#7c3aed" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#7c3aed"/>
              <circle cx="15.5" cy="8.5" r="1.5" fill="#7c3aed"/>
              <circle cx="8.5" cy="15.5" r="1.5" fill="#7c3aed"/>
              <circle cx="15.5" cy="15.5" r="1.5" fill="#7c3aed"/>
              <circle cx="12" cy="12" r="1.5" fill="#7c3aed"/>
            </svg>
            Случайное слово
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pickWord(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{ background: "white", color: "#1d4ed8", border: "1.5px solid #dbeafe", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
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

        {/* Loading */}
        {loadingTranslate && (
          <div className="mt-4 rounded-2xl p-5 text-center" style={{ background: "white", border: "2px solid #e2e8f0" }}>
            <div className="w-7 h-7 rounded-full mx-auto" style={{ border: "3px solid #e2e8f0", borderTopColor: "#1d4ed8", animation: "spin 0.7s linear infinite" }} />
          </div>
        )}

        {/* Error */}
        {error && !loadingTranslate && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
            <p className="text-sm font-semibold text-center" style={{ color: "#dc2626" }}>{error}</p>
          </div>
        )}

        {/* Translation result */}
        {translation && selectedWord && !loadingTranslate && (
          <div className="mt-4 rounded-2xl overflow-hidden card-reveal" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}>
              <span className="text-sm font-bold text-white">{selectedWord}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-semibold flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                {dir === "ru→bur" ? "бурятский" : "русский"}
              </span>
              {/* Favorites star */}
              <button
                onClick={handleToggleFav}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90"
                style={{ background: isFav ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.12)" }}
                title={isFav ? "Убрать из избранного" : "Добавить в избранное"}
              >
                <StarIcon filled={isFav} />
              </button>
            </div>
            <div className="px-4 py-4 flex items-start justify-between gap-3" style={{ background: "white" }}>
              <p className="text-lg font-bold leading-relaxed flex-1" style={{ color: "#1e3a5f" }}>{translation}</p>
              <CopyButton text={translation} />
            </div>
          </div>
        )}

        {/* Empty state: favorites + history + examples */}
        {!query && !translation && (
          <div className="mt-4">

            {/* Favorites */}
            {favorites.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                    ⭐ Избранное
                  </p>
                  <button
                    onClick={() => { localStorage.removeItem(FAVS_KEY); setFavorites([]); }}
                    className="text-xs font-semibold"
                    style={{ color: "#94a3b8" }}
                  >
                    Очистить
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {favorites.map((f) => (
                    <button
                      key={`${f.dir}-${f.word}`}
                      onClick={() => { setDir(f.dir); setQuery(f.word); translate(f.word); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition active:scale-95"
                      style={{ background: "#fffbeb", color: "#d97706", border: "1.5px solid #fde68a" }}
                    >
                      ⭐ {f.word}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* History */}
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
