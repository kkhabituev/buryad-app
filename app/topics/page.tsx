"use client";

import { useState } from "react";
import numbersData from "@/content/numbers.json";

type TopicTab = "numbers" | "colors" | "animals";
type NumberTab = "units" | "tens" | "large";

// ── Colors ─────────────────────────────────────────────────────
const COLORS = [
  { ru: "красный",    buryat: "улаан",        hex: "#ef4444", light: false },
  { ru: "синий",      buryat: "хүхэ",         hex: "#1d4ed8", light: false },
  { ru: "зелёный",    buryat: "ногоон",       hex: "#16a34a", light: false },
  { ru: "жёлтый",     buryat: "шара",         hex: "#eab308", light: true  },
  { ru: "белый",      buryat: "сагаан",       hex: "#f1f5f9", light: true  },
  { ru: "чёрный",     buryat: "хара",         hex: "#1e293b", light: false },
  { ru: "оранжевый",  buryat: "улаан шара",   hex: "#f97316", light: false },
  { ru: "розовый",    buryat: "ягаан",        hex: "#ec4899", light: false },
  { ru: "серый",      buryat: "боро",         hex: "#94a3b8", light: false },
  { ru: "голубой",    buryat: "сэнхир",       hex: "#38bdf8", light: true  },
  { ru: "коричневый", buryat: "хүрин",        hex: "#92400e", light: false },
];

// ── Animals (from burlang.ru API) ───────────────────────────────
const ANIMALS = [
  { ru: "медведь",  buryat: "баабгай",      emoji: "🐻", from: "#d97706", to: "#7c2d12" },
  { ru: "волк",     buryat: "шоно",         emoji: "🐺", from: "#64748b", to: "#1e293b" },
  { ru: "лиса",     buryat: "үнэгэн",       emoji: "🦊", from: "#fb923c", to: "#c2410c" },
  { ru: "лошадь",   buryat: "морин",        emoji: "🐴", from: "#a16207", to: "#713f12" },
  { ru: "собака",   buryat: "нохой",        emoji: "🐶", from: "#fbbf24", to: "#b45309" },
  { ru: "рыба",     buryat: "загаһан",      emoji: "🐟", from: "#22d3ee", to: "#0369a1" },
  { ru: "птица",    buryat: "шубуун",       emoji: "🐦", from: "#60a5fa", to: "#1d4ed8" },
  { ru: "заяц",     buryat: "шандаган",     emoji: "🐰", from: "#f9a8d4", to: "#be185d" },
  { ru: "корова",   buryat: "үнеэн",        emoji: "🐄", from: "#94a3b8", to: "#334155" },
  { ru: "орёл",     buryat: "бүргэд",       emoji: "🦅", from: "#fbbf24", to: "#92400e" },
  { ru: "кошка",    buryat: "эмэ миисгэй",  emoji: "🐱", from: "#c084fc", to: "#6d28d9" },
  { ru: "олень",    buryat: "оро",          emoji: "🦌", from: "#4ade80", to: "#15803d" },
];

// ── NumberList ─────────────────────────────────────────────────
interface NumberRow { number: number; buryat: string; variants?: string[] }

function NumberList({ items }: { items: NumberRow[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
      {items.map((n, i) => (
        <div
          key={n.number}
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}
          >
            <span
              className="font-bold"
              style={{
                fontSize: n.number >= 100 ? "0.85rem" : n.number >= 10 ? "1.2rem" : "1.6rem",
                color: "#1d4ed8",
                fontFamily: '"Playfair Display", Georgia, serif',
                lineHeight: 1,
              }}
            >
              {n.number}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight" style={{ fontSize: "1.05rem", color: "#0f172a" }}>
              {n.buryat}
            </p>
            {n.variants && n.variants.length > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>также: {n.variants.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
export default function TopicsPage() {
  const [topicTab, setTopicTab] = useState<TopicTab>("numbers");
  const [numberTab, setNumberTab] = useState<NumberTab>("units");

  const topicTabs: { id: TopicTab; label: string }[] = [
    { id: "numbers", label: "🔢 Числа" },
    { id: "colors",  label: "🎨 Цвета" },
    { id: "animals", label: "🐾 Животные" },
  ];

  const numberTabs: { id: NumberTab; label: string }[] = [
    { id: "units", label: "1 – 10" },
    { id: "tens",  label: "Десятки" },
    { id: "large", label: "Крупные" },
  ];

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
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          Үгын бүлэгүүд
        </p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          Подборки
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
          Числа · Цвета · Животные
        </p>
      </div>

      {/* Main topic tabs (sticky) */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex gap-2"
        style={{
          background: "rgba(248,250,255,0.97)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {topicTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopicTab(t.id)}
            className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
            style={{
              background: topicTab === t.id ? "#1d4ed8" : "#f1f5f9",
              color: topicTab === t.id ? "white" : "#64748b",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ЧИСЛА ─────────────────────────────────────────── */}
      {topicTab === "numbers" && (
        <div>
          {/* Inner sub-tabs */}
          <div className="px-4 pt-3 pb-0 flex gap-2">
            {numberTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setNumberTab(t.id)}
                className="flex-1 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95"
                style={{
                  background: numberTab === t.id ? "#1e3a5f" : "#e2e8f0",
                  color: numberTab === t.id ? "white" : "#64748b",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="px-4 pt-3 pb-8">
            {numberTab === "units" && (
              <NumberList
                items={numbersData.units.map((n) => ({
                  number: n.number,
                  buryat: n.buryat,
                  variants: (n as { variants?: string[] }).variants,
                }))}
              />
            )}

            {numberTab === "tens" && (
              <NumberList
                items={numbersData.tens.map((n) => ({
                  number: n.number,
                  buryat: n.buryat,
                  variants: (n as { variants?: string[] }).variants,
                }))}
              />
            )}

            {numberTab === "large" && (
              <div>
                <NumberList items={numbersData.large.map((n) => ({ number: n.number, buryat: n.buryat }))} />
                <div className="mt-4 rounded-2xl p-4" style={{ background: "#1e3a5f" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#fbbf24" }}>
                    Составные числа
                  </p>
                  <p className="text-sm text-white leading-relaxed">{numbersData.compound_rule}</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mt-5 mb-3" style={{ color: "#94a3b8" }}>
                  Примеры
                </p>
                <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
                  {numbersData.examples.map((ex, i) => (
                    <div
                      key={ex.number}
                      className="flex items-center justify-between px-5 py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}
                    >
                      <span className="text-xl font-bold" style={{ color: "#1d4ed8", fontFamily: '"Playfair Display", Georgia, serif' }}>
                        {ex.number}
                      </span>
                      <span className="text-base font-bold" style={{ color: "#0f172a" }}>{ex.buryat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Age phrases — always visible */}
            <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0" }}>
              <div className="px-4 py-3" style={{ background: "#1d4ed8" }}>
                <p className="text-sm font-bold text-white">🎂 Как спросить возраст?</p>
              </div>
              {numbersData.age_phrases.map((phrase, i) => (
                <div
                  key={i}
                  className="px-4 py-3"
                  style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}
                >
                  <p className="font-bold" style={{ color: "#1e3a5f" }}>{phrase.buryat}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{phrase.russian}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ЦВЕТА ─────────────────────────────────────────── */}
      {topicTab === "colors" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
            Үнгэнүүд — цвета по-бурятски
          </p>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map((c) => (
              <div
                key={c.ru}
                className="rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  border: c.light ? "1.5px solid #e2e8f0" : "none",
                }}
              >
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
              «Улаан» — красный, как закат над Байкалом.
              «Хүхэ» — синий, как вода озера.
              «Сагаан» — белый, как снег Хамар-Дабана.
            </p>
          </div>
        </div>
      )}

      {/* ── ЖИВОТНЫЕ ──────────────────────────────────────── */}
      {topicTab === "animals" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
            Амитад — животные по-бурятски
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ANIMALS.map((a) => (
              <div
                key={a.ru}
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
              >
                {/* Emoji card top */}
                <div
                  style={{
                    background: `linear-gradient(140deg, ${a.from} 0%, ${a.to} 100%)`,
                    height: 96,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "3.2rem", lineHeight: 1 }}>{a.emoji}</span>
                </div>
                {/* Text bottom */}
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{a.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{a.ru}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-5 rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1.5px solid #a7f3d0" }}
          >
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>🌿 Бурятия и природа</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#047857" }}>
              Бурятский язык богат словами о животных — они занимают особое место в культуре народов Байкала.
              «Морин» (лошадь) и «баабгай» (медведь) — символы бурятской земли.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
