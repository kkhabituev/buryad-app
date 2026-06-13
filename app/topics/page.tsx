"use client";

import { useState } from "react";
import numbersData from "@/content/numbers.json";

type TopicTab = "numbers" | "colors" | "animals" | "family" | "food" | "body" | "nature" | "weather" | "emotions" | "time";
type NumberTab = "units" | "tens" | "large";

// ── Colors ────────────────────────────────────────────────────
const COLORS = [
  { ru: "красный",    buryat: "улаан",      hex: "#ef4444", light: false },
  { ru: "синий",      buryat: "хүхэ",       hex: "#1d4ed8", light: false },
  { ru: "зелёный",    buryat: "ногоон",     hex: "#16a34a", light: false },
  { ru: "жёлтый",     buryat: "шара",       hex: "#eab308", light: true  },
  { ru: "белый",      buryat: "сагаан",     hex: "#f1f5f9", light: true  },
  { ru: "чёрный",     buryat: "хара",       hex: "#1e293b", light: false },
  { ru: "оранжевый",  buryat: "улаан шара", hex: "#f97316", light: false },
  { ru: "розовый",    buryat: "ягаан",      hex: "#ec4899", light: false },
  { ru: "серый",      buryat: "боро",       hex: "#94a3b8", light: false },
  { ru: "голубой",    buryat: "сэнхир",     hex: "#38bdf8", light: true  },
  { ru: "коричневый", buryat: "хүрин",      hex: "#92400e", light: false },
];

// ── Animals ───────────────────────────────────────────────────
const ANIMALS = [
  { ru: "медведь", buryat: "баабгай",     emoji: "🐻", from: "#d97706", to: "#7c2d12" },
  { ru: "волк",    buryat: "шоно",        emoji: "🐺", from: "#64748b", to: "#1e293b" },
  { ru: "лиса",    buryat: "үнэгэн",      emoji: "🦊", from: "#fb923c", to: "#c2410c" },
  { ru: "лошадь",  buryat: "морин",       emoji: "🐴", from: "#a16207", to: "#713f12" },
  { ru: "собака",  buryat: "нохой",       emoji: "🐶", from: "#fbbf24", to: "#b45309" },
  { ru: "рыба",    buryat: "загаһан",     emoji: "🐟", from: "#22d3ee", to: "#0369a1" },
  { ru: "птица",   buryat: "шубуун",      emoji: "🐦", from: "#60a5fa", to: "#1d4ed8" },
  { ru: "заяц",    buryat: "шандаган",    emoji: "🐰", from: "#f9a8d4", to: "#be185d" },
  { ru: "корова",  buryat: "үнеэн",       emoji: "🐄", from: "#94a3b8", to: "#334155" },
  { ru: "орёл",    buryat: "бүргэд",      emoji: "🦅", from: "#fbbf24", to: "#92400e" },
  { ru: "кошка",   buryat: "эмэ миисгэй", emoji: "🐱", from: "#c084fc", to: "#6d28d9" },
  { ru: "олень",   buryat: "оро",         emoji: "🦌", from: "#4ade80", to: "#15803d" },
];

// ── Family ────────────────────────────────────────────────────
const FAMILY = [
  { ru: "мама",           buryat: "эжы",          emoji: "👩" },
  { ru: "папа",           buryat: "аба",           emoji: "👨" },
  { ru: "бабушка",        buryat: "хүгшэн эжы",   emoji: "👵" },
  { ru: "дедушка",        buryat: "хүгшэн аба",   emoji: "👴" },
  { ru: "старший брат",   buryat: "аха",           emoji: "🧑" },
  { ru: "старшая сестра", buryat: "эгэшэ",         emoji: "👧" },
  { ru: "младший / -ая",  buryat: "дүү",           emoji: "👶" },
  { ru: "сын",            buryat: "хүбүүн",        emoji: "🧒" },
  { ru: "дочь",           buryat: "басаган",       emoji: "🎀" },
  { ru: "муж",            buryat: "үбгэн",         emoji: "🤵" },
  { ru: "жена",           buryat: "һамган",        emoji: "👰" },
];

// ── Food ──────────────────────────────────────────────────────
const FOOD = [
  { ru: "буузы",          buryat: "буузэ",       emoji: "🥟", buryat_dish: true  },
  { ru: "хуушуур",        buryat: "хуушуур",     emoji: "🥙", buryat_dish: true  },
  { ru: "суп",            buryat: "шүлэн",       emoji: "🍲", buryat_dish: false },
  { ru: "чай с молоком",  buryat: "сагаан сай",  emoji: "🍵", buryat_dish: true  },
  { ru: "мясо",           buryat: "мяхан",       emoji: "🥩", buryat_dish: false },
  { ru: "хлеб",           buryat: "хилээмэн",    emoji: "🍞", buryat_dish: false },
  { ru: "вода",           buryat: "уһан",        emoji: "💧", buryat_dish: false },
  { ru: "молоко",         buryat: "һүн",         emoji: "🥛", buryat_dish: false },
];

// ── Body ──────────────────────────────────────────────────────
const BODY = [
  { ru: "голова", buryat: "толгой",   emoji: "🗣️" },
  { ru: "глаз",   buryat: "нюдэн",   emoji: "👁️" },
  { ru: "нос",    buryat: "хамар",   emoji: "👃" },
  { ru: "рот",    buryat: "аман",    emoji: "👄" },
  { ru: "ухо",    buryat: "шэхэн",   emoji: "👂" },
  { ru: "рука",   buryat: "гар",     emoji: "🤚" },
  { ru: "нога",   buryat: "хүл",     emoji: "🦵" },
  { ru: "спина",  buryat: "нюрган",  emoji: "🦴" },
  { ru: "живот",  buryat: "гэдэһэн", emoji: "🫃" },
  { ru: "сердце", buryat: "зүрхэн",  emoji: "❤️" },
];

// ── Nature ────────────────────────────────────────────────────
const NATURE = [
  { ru: "Байкал", buryat: "Байгал нуур", emoji: "🌊",  from: "#0ea5e9", to: "#0369a1" },
  { ru: "озеро",  buryat: "нуур",        emoji: "🏞️",  from: "#38bdf8", to: "#0284c7" },
  { ru: "река",   buryat: "гол",         emoji: "🏔️",  from: "#22d3ee", to: "#0891b2" },
  { ru: "гора",   buryat: "хада",        emoji: "⛰️",  from: "#94a3b8", to: "#475569" },
  { ru: "степь",  buryat: "тала",        emoji: "🌾",  from: "#fbbf24", to: "#d97706" },
  { ru: "лес",    buryat: "ой",          emoji: "🌲",  from: "#22c55e", to: "#15803d" },
  { ru: "небо",   buryat: "тэнгэри",     emoji: "🌌",  from: "#818cf8", to: "#4338ca" },
  { ru: "солнце", buryat: "наран",       emoji: "☀️",  from: "#fbbf24", to: "#f59e0b" },
  { ru: "луна",   buryat: "һара",        emoji: "🌙",  from: "#94a3b8", to: "#1e293b" },
  { ru: "звезда", buryat: "одон",        emoji: "⭐",  from: "#c084fc", to: "#6d28d9" },
];

// ── Weather ───────────────────────────────────────────────────
const WEATHER = [
  { ru: "холодно",  buryat: "хүйтэн",  emoji: "🥶", from: "#bfdbfe", to: "#3b82f6" },
  { ru: "тепло",    buryat: "дулаан",  emoji: "🌡️", from: "#fde68a", to: "#f59e0b" },
  { ru: "снег",     buryat: "саһан",   emoji: "❄️", from: "#e0f2fe", to: "#7dd3fc" },
  { ru: "дождь",    buryat: "бороо",   emoji: "🌧️", from: "#93c5fd", to: "#3b82f6" },
  { ru: "ветер",    buryat: "һалхин",  emoji: "💨", from: "#d1d5db", to: "#6b7280" },
  { ru: "солнечно", buryat: "нартай",  emoji: "☀️", from: "#fef08a", to: "#fbbf24" },
  { ru: "туча",     buryat: "үүлэн",   emoji: "☁️", from: "#d1d5db", to: "#9ca3af" },
];

// ── Emotions ──────────────────────────────────────────────────
const EMOTIONS = [
  { ru: "счастливый",  buryat: "жаргалтай",   emoji: "😊", bg: "#fef9c3", border: "#fde68a" },
  { ru: "грустный",    buryat: "уйдхартай",   emoji: "😢", bg: "#dbeafe", border: "#93c5fd" },
  { ru: "злой",        buryat: "ууртай",       emoji: "😠", bg: "#fee2e2", border: "#fca5a5" },
  { ru: "удивлённый",  buryat: "гайхалтай",   emoji: "😲", bg: "#f3e8ff", border: "#d8b4fe" },
  { ru: "испуганный",  buryat: "айһан",        emoji: "😨", bg: "#fed7aa", border: "#fb923c" },
  { ru: "ленивый",     buryat: "залхуу",       emoji: "😴", bg: "#e2e8f0", border: "#94a3b8" },
];

// ── Time ──────────────────────────────────────────────────────
const TIME_OF_DAY = [
  { ru: "утро",   buryat: "үглөө",  emoji: "🌅", from: "#fde68a", to: "#fb923c", textLight: false },
  { ru: "день",   buryat: "үдэр",   emoji: "☀️", from: "#7dd3fc", to: "#3b82f6", textLight: true  },
  { ru: "вечер",  buryat: "үдэшэ",  emoji: "🌆", from: "#c084fc", to: "#7c3aed", textLight: true  },
  { ru: "ночь",   buryat: "һүни",   emoji: "🌙", from: "#1e3a5f", to: "#0f172a", textLight: true  },
];
const TIME_OTHER = [
  { ru: "сегодня", buryat: "мүнөөдэр",     emoji: "📅" },
  { ru: "завтра",  buryat: "үглөөдэр",     emoji: "➡️" },
  { ru: "вчера",   buryat: "үсэгэлдэр",    emoji: "⬅️" },
  { ru: "неделя",  buryat: "долоон хоног", emoji: "🗓️" },
  { ru: "год",     buryat: "жэл",          emoji: "🎊" },
];

// ── Nav config ────────────────────────────────────────────────
const TOPIC_TABS: { id: TopicTab; label: string }[] = [
  { id: "numbers",  label: "🔢 Числа"    },
  { id: "colors",   label: "🎨 Цвета"    },
  { id: "animals",  label: "🐾 Животные" },
  { id: "family",   label: "👨‍👩‍👧 Семья"   },
  { id: "food",     label: "🍖 Еда"      },
  { id: "body",     label: "💪 Тело"     },
  { id: "nature",   label: "🌿 Природа"  },
  { id: "weather",  label: "🌤️ Погода"   },
  { id: "emotions", label: "😊 Эмоции"   },
  { id: "time",     label: "⏰ Время"    },
];

// ── NumberList ────────────────────────────────────────────────
interface NumberRow { number: number; buryat: string; variants?: string[] }
function NumberList({ items }: { items: NumberRow[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
      {items.map((n, i) => (
        <div key={n.number} className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}>
            <span className="font-bold" style={{
              fontSize: n.number >= 100 ? "0.85rem" : n.number >= 10 ? "1.2rem" : "1.6rem",
              color: "#1d4ed8", fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1,
            }}>{n.number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight" style={{ fontSize: "1.05rem", color: "#0f172a" }}>{n.buryat}</p>
            {n.variants && n.variants.length > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>также: {n.variants.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function TopicsPage() {
  const [topicTab, setTopicTab] = useState<TopicTab>("numbers");
  const [numberTab, setNumberTab] = useState<NumberTab>("units");
  const [wiggleKey, setWiggleKey] = useState<string>("");

  const triggerWiggle = (key: string) => {
    setWiggleKey(key);
    setTimeout(() => setWiggleKey(""), 500);
  };

  return (
    <div style={{ background: "#f8faff", minHeight: "100dvh" }}>

      {/* Header */}
      <div className="px-5 pb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)", paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Үгын бүлэгүүд</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Подборки</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>10 тематических коллекций</p>
      </div>

      {/* Scrollable topic tab bar */}
      <div className="sticky top-0 z-10 py-3"
        style={{ background: "rgba(248,250,255,0.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
        <div className="topic-scrollbar" style={{ overflowX: "auto", display: "flex", gap: 8, padding: "0 16px" }}>
          {TOPIC_TABS.map((t) => (
            <button key={t.id} onClick={() => setTopicTab(t.id)}
              className="transition-all duration-200 active:scale-95"
              style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                fontSize: "0.8rem", fontWeight: 700,
                background: topicTab === t.id ? "#1d4ed8" : "#f1f5f9",
                color: topicTab === t.id ? "white" : "#64748b",
                border: "none", cursor: "pointer",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ЧИСЛА ─────────────────────────────────────── */}
      {topicTab === "numbers" && (
        <div>
          <div className="px-4 pt-3 flex gap-2">
            {(["units","tens","large"] as NumberTab[]).map((id, i) => {
              const labels = ["1 – 10", "Десятки", "Крупные"];
              return (
                <button key={id} onClick={() => setNumberTab(id)}
                  className="flex-1 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={{ background: numberTab === id ? "#1e3a5f" : "#e2e8f0", color: numberTab === id ? "white" : "#64748b" }}>
                  {labels[i]}
                </button>
              );
            })}
          </div>
          <div className="px-4 pt-3 pb-8">
            {numberTab === "units" && <NumberList items={numbersData.units.map(n => ({ number: n.number, buryat: n.buryat, variants: (n as { variants?: string[] }).variants }))} />}
            {numberTab === "tens" && <NumberList items={numbersData.tens.map(n => ({ number: n.number, buryat: n.buryat, variants: (n as { variants?: string[] }).variants }))} />}
            {numberTab === "large" && (
              <div>
                <NumberList items={numbersData.large.map(n => ({ number: n.number, buryat: n.buryat }))} />
                <div className="mt-4 rounded-2xl p-4" style={{ background: "#1e3a5f" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#fbbf24" }}>Составные числа</p>
                  <p className="text-sm text-white leading-relaxed">{numbersData.compound_rule}</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mt-5 mb-3" style={{ color: "#94a3b8" }}>Примеры</p>
                <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
                  {numbersData.examples.map((ex, i) => (
                    <div key={ex.number} className="flex items-center justify-between px-5 py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                      <span className="text-xl font-bold" style={{ color: "#1d4ed8", fontFamily: '"Playfair Display", Georgia, serif' }}>{ex.number}</span>
                      <span className="text-base font-bold" style={{ color: "#0f172a" }}>{ex.buryat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0" }}>
              <div className="px-4 py-3" style={{ background: "#1d4ed8" }}>
                <p className="text-sm font-bold text-white">🎂 Как спросить возраст?</p>
              </div>
              {numbersData.age_phrases.map((phrase, i) => (
                <div key={i} className="px-4 py-3"
                  style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                  <p className="font-bold" style={{ color: "#1e3a5f" }}>{phrase.buryat}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{phrase.russian}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ЦВЕТА ─────────────────────────────────────── */}
      {topicTab === "colors" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Үнгэнүүд — цвета по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map((c) => (
              <div key={c.ru} className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: c.light ? "1.5px solid #e2e8f0" : "none" }}>
                <div style={{ background: c.hex, height: 72 }} />
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{c.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{c.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Запоминалка</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              «Улаан» — красный, как закат над Байкалом. «Хүхэ» — синий, как вода озера. «Сагаан» — белый, как снег Хамар-Дабана.
            </p>
          </div>
        </div>
      )}

      {/* ── ЖИВОТНЫЕ ──────────────────────────────────── */}
      {topicTab === "animals" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Амитад — животные по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {ANIMALS.map((a) => (
              <div key={a.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${a.from} 0%, ${a.to} 100%)`, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3.2rem", lineHeight: 1 }}>{a.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{a.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{a.ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── СЕМЬЯ ─────────────────────────────────────── */}
      {topicTab === "family" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Бүлэ — семья по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {FAMILY.map((f) => (
              <div key={f.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: "linear-gradient(145deg, #fef9ee 0%, #fef3c7 100%)", border: "1.5px solid #fde68a", boxShadow: "0 2px 12px rgba(251,191,36,0.12)" }}>
                <span style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: 8 }}>{f.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{f.buryat}</p>
                <p className="text-xs mt-1 font-semibold leading-snug" style={{ color: "#92400e" }}>{f.ru}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>💡 Интересно</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              В бурятском языке «аха» значит старший брат, «эгэшэ» — старшая сестра, а «дүү» — любой младший брат или сестра. Возраст важнее пола!
            </p>
          </div>
        </div>
      )}

      {/* ── ЕДА ───────────────────────────────────────── */}
      {topicTab === "food" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Эдеэн — еда по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {FOOD.map((f) => (
              <div key={f.ru} className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1.5px solid #f1f5f9" }}>
                {/* Emoji top */}
                <div style={{ background: f.buryat_dish ? "linear-gradient(140deg, #fef3c7, #fde68a)" : "linear-gradient(140deg, #f8faff, #f1f5f9)", height: 84, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{f.emoji}</span>
                  {f.buryat_dish && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#f97316", color: "white" }}>
                      Бурятское
                    </span>
                  )}
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{f.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{f.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)", border: "1.5px solid #fed7aa" }}>
            <p className="text-sm font-bold" style={{ color: "#c2410c" }}>🥟 Буузэ — гордость Бурятии</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#ea580c" }}>
              Буузы (буузэ) — национальное блюдо, паровые пельмени с мясом. Хуушуур — жареный аналог. Обязательно попробуй!
            </p>
          </div>
        </div>
      )}

      {/* ── ТЕЛО ──────────────────────────────────────── */}
      {topicTab === "body" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Бэе — тело по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {BODY.map((b) => (
              <div key={b.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: "linear-gradient(145deg, #fff8f5 0%, #fde8d8 100%)", border: "1.5px solid #fed7aa", boxShadow: "0 2px 10px rgba(251,146,60,0.1)" }}>
                <span style={{ fontSize: "2.4rem", lineHeight: 1, marginBottom: 8 }}>{b.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{b.buryat}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: "#9a3412" }}>{b.ru}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fff8f5", border: "1.5px solid #fed7aa" }}>
            <p className="text-sm font-bold" style={{ color: "#c2410c" }}>💡 Подсказка</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#ea580c" }}>
              «Зүрхэн» (сердце) — одно из важных слов в бурятской культуре. «Толгой» (голова) часто используется в пословицах о мудрости.
            </p>
          </div>
        </div>
      )}

      {/* ── ПРИРОДА ───────────────────────────────────── */}
      {topicTab === "nature" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Байгаали — природа по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {NATURE.map((n) => (
              <div key={n.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${n.from} 0%, ${n.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{n.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{n.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{n.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1.5px solid #a7f3d0" }}>
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>🌊 Байгал нуур</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#047857" }}>
              «Байгал» на бурятском — «богатое озеро». Это священное место для бурятского народа. «Тэнгэри» — небо — в бурятской мифологии населено духами.
            </p>
          </div>
        </div>
      )}

      {/* ── ПОГОДА ────────────────────────────────────── */}
      {topicTab === "weather" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Агаар — погода по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {WEATHER.map((w) => (
              <div key={w.ru}
                className={wiggleKey === w.ru ? "wiggle-anim" : ""}
                onClick={() => triggerWiggle(w.ru)}
                style={{ cursor: "pointer", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ background: `linear-gradient(140deg, ${w.from} 0%, ${w.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{w.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{w.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{w.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>Нажми на карточку ☝️</p>
        </div>
      )}

      {/* ── ЭМОЦИИ ────────────────────────────────────── */}
      {topicTab === "emotions" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Мэдэрэл — эмоции по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONS.map((e) => (
              <div key={e.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: e.bg, border: `1.5px solid ${e.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 10 }}>{e.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{e.buryat}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: "#64748b" }}>{e.ru}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fef9c3", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#a16207" }}>💡 Суффикс -тай</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              Многие прилагательные-эмоции образуются суффиксом «-тай»: жаргал (счастье) → жаргал<b>тай</b> (счастливый), уйдхар (грусть) → уйдхар<b>тай</b>.
            </p>
          </div>
        </div>
      )}

      {/* ── ВРЕМЯ ─────────────────────────────────────── */}
      {topicTab === "time" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Саг — время по-бурятски</p>

          {/* Time of day — big gradient cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {TIME_OF_DAY.map((t) => (
              <div key={t.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                <div style={{ background: `linear-gradient(160deg, ${t.from} 0%, ${t.to} 100%)`, padding: "20px 12px 16px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {/* Stars for ночь */}
                  {t.ru === "ночь" && (
                    <>
                      <span style={{ position: "absolute", top: 6, right: 10, fontSize: "0.6rem", opacity: 0.7 }}>✨</span>
                      <span style={{ position: "absolute", top: 12, left: 14, fontSize: "0.5rem", opacity: 0.5 }}>⭐</span>
                      <span style={{ position: "absolute", bottom: 20, right: 16, fontSize: "0.5rem", opacity: 0.6 }}>✦</span>
                    </>
                  )}
                  <span style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 10 }}>{t.emoji}</span>
                  <p className="text-xl font-bold text-center leading-tight"
                    style={{ color: t.textLight ? "white" : "#1e293b" }}>
                    {t.buryat}
                  </p>
                  <p className="text-xs font-semibold mt-1"
                    style={{ color: t.textLight ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)" }}>
                    {t.ru}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Other time words — list */}
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Другие слова о времени</p>
          <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
            {TIME_OTHER.map((t, i) => (
              <div key={t.ru} className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                <span style={{ fontSize: "1.6rem", lineHeight: 1, width: 36, textAlign: "center" }}>{t.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: "#0f172a" }}>{t.buryat}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "#64748b" }}>{t.ru}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1.5px solid #bae6fd" }}>
            <p className="text-sm font-bold" style={{ color: "#075985" }}>💡 Интересно</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#0369a1" }}>
              «Долоон хоног» (неделя) буквально — «семь ночей». «Үглөөдэр» (завтра) и «үглөө» (утро) — однокоренные слова!
            </p>
          </div>
        </div>
      )}

      <style>{`
        .topic-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes wiggle {
          0%   { transform: rotate(0deg) scale(1); }
          20%  { transform: rotate(-12deg) scale(1.08); }
          40%  { transform: rotate(12deg) scale(1.08); }
          60%  { transform: rotate(-6deg) scale(1.04); }
          80%  { transform: rotate(4deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .wiggle-anim { animation: wiggle 0.5s ease; }
      `}</style>
    </div>
  );
}
