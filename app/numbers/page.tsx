"use client";

import { useState } from "react";
import NumberCard from "@/components/NumberCard";
import numbersData from "@/content/numbers.json";

type Tab = "units" | "tens" | "large";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "units", label: "1 – 10", emoji: "🔢" },
  { id: "tens", label: "Десятки", emoji: "💯" },
  { id: "large", label: "Крупные", emoji: "🌌" },
];

export default function NumbersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("units");

  return (
    <div className="page-enter" style={{ background: "#f8faff", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="px-5 pb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(140deg, #f97316 0%, #dc2626 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <div
          className="absolute"
          style={{
            top: -40, right: -40, width: 160, height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
          }}
        />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
          Тоонууд
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Числа
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
          Нажми на карточку — узнаешь слово
        </p>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-0 z-10 px-4 pt-3 pb-2 flex gap-2"
        style={{ background: "rgba(248,250,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
            style={{
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #f97316, #dc2626)"
                : "#f1f5f9",
              color: activeTab === tab.id ? "white" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 2px 12px -2px #f9731655" : "none",
            }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* UNITS */}
        {activeTab === "units" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                Переверни карточку
              </span>
              <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {numbersData.units.map((n, i) => (
                <NumberCard
                  key={n.number}
                  number={n.number}
                  buryat={n.buryat}
                  variants={(n as { variants?: string[] }).variants}
                  colorIndex={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* TENS */}
        {activeTab === "tens" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                Переверни карточку
              </span>
              <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {numbersData.tens.map((n, i) => (
                <NumberCard
                  key={n.number}
                  number={n.number}
                  buryat={n.buryat}
                  variants={(n as { variants?: string[] }).variants}
                  colorIndex={i + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* LARGE */}
        {activeTab === "large" && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {numbersData.large.map((n, i) => (
                <NumberCard key={n.number} number={n.number} buryat={n.buryat} colorIndex={i * 3 + 2} />
              ))}
            </div>

            {/* Compound rule */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#fbbf24" }}>
                ✦ Составные числа
              </p>
              <p className="text-sm text-white leading-relaxed">{numbersData.compound_rule}</p>
            </div>

            {/* Examples */}
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
              Примеры
            </p>
            <div className="space-y-2">
              {numbersData.examples.map((ex, i) => (
                <div
                  key={ex.number}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: "white",
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{
                      color: ["#ef4444","#f97316","#6366f1","#14b8a6"][i % 4],
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    {ex.number}
                  </span>
                  <span className="text-base font-bold" style={{ color: "#1e3a5f" }}>
                    {ex.buryat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGE PHRASES */}
        <div
          className="mt-5 rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <span className="text-lg">🎂</span>
            <p className="text-sm font-bold text-white">Как спросить возраст?</p>
          </div>
          {numbersData.age_phrases.map((phrase, i) => (
            <div
              key={i}
              className="px-4 py-3 border-t"
              style={{
                borderColor: "#f1f5f9",
                background: i % 2 === 0 ? "white" : "#f8faff",
              }}
            >
              <div className="text-base font-bold" style={{ color: "#1e3a5f" }}>
                {phrase.buryat}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "#64748b" }}>
                {phrase.russian}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
