"use client";

import { useState } from "react";
import numbersData from "@/content/numbers.json";

type Tab = "units" | "tens" | "large";

const tabs: { id: Tab; label: string }[] = [
  { id: "units", label: "1 – 10" },
  { id: "tens", label: "Десятки" },
  { id: "large", label: "Крупные" },
];

interface NumberRow {
  number: number;
  buryat: string;
  variants?: string[];
}

function NumberList({ items }: { items: NumberRow[] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "2px solid #e2e8f0", background: "white" }}
    >
      {items.map((n, i) => (
        <div
          key={n.number}
          className="flex items-center gap-4 px-4 py-4"
          style={{
            borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
            background: i % 2 === 0 ? "white" : "#f8faff",
          }}
        >
          {/* Number badge */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "#eff6ff",
              border: "2px solid #dbeafe",
            }}
          >
            <span
              className="font-bold"
              style={{
                fontSize: n.number >= 100 ? "1rem" : n.number >= 10 ? "1.5rem" : "2rem",
                color: "#1d4ed8",
                fontFamily: '"Playfair Display", Georgia, serif',
                lineHeight: 1,
              }}
            >
              {n.number}
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="font-bold leading-tight"
              style={{ fontSize: "1.2rem", color: "#0f172a" }}
            >
              {n.buryat}
            </p>
            {n.variants && n.variants.length > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
                также: {n.variants.join(", ")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NumbersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("units");

  return (
    <div style={{ background: "#f8faff", minHeight: "100dvh" }}>
      {/* Header */}
      <div
        className="px-5 pb-5"
        style={{
          background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Тоонууд
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Числа
        </h1>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex gap-2"
        style={{
          background: "rgba(248,250,255,0.97)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
            style={{
              background: activeTab === tab.id ? "#1d4ed8" : "#f1f5f9",
              color: activeTab === tab.id ? "white" : "#64748b",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-8">

        {/* UNITS */}
        {activeTab === "units" && (
          <NumberList
            items={numbersData.units.map((n) => ({
              number: n.number,
              buryat: n.buryat,
              variants: (n as { variants?: string[] }).variants,
            }))}
          />
        )}

        {/* TENS */}
        {activeTab === "tens" && (
          <NumberList
            items={numbersData.tens.map((n) => ({
              number: n.number,
              buryat: n.buryat,
              variants: (n as { variants?: string[] }).variants,
            }))}
          />
        )}

        {/* LARGE */}
        {activeTab === "large" && (
          <div>
            <NumberList
              items={numbersData.large.map((n) => ({
                number: n.number,
                buryat: n.buryat,
              }))}
            />

            {/* Rule */}
            <div
              className="mt-4 rounded-2xl p-4"
              style={{ background: "#1e3a5f" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wide mb-1.5"
                style={{ color: "#fbbf24" }}
              >
                Составные числа
              </p>
              <p className="text-sm text-white leading-relaxed">
                {numbersData.compound_rule}
              </p>
            </div>

            {/* Examples */}
            <p
              className="text-xs font-bold uppercase tracking-widest mt-5 mb-3"
              style={{ color: "#94a3b8" }}
            >
              Примеры
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "2px solid #e2e8f0", background: "white" }}
            >
              {numbersData.examples.map((ex, i) => (
                <div
                  key={ex.number}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                    background: i % 2 === 0 ? "white" : "#f8faff",
                  }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{
                      color: "#1d4ed8",
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    {ex.number}
                  </span>
                  <span className="text-base font-bold" style={{ color: "#0f172a" }}>
                    {ex.buryat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Age phrases — always visible at bottom */}
        <div
          className="mt-5 rounded-2xl overflow-hidden"
          style={{ border: "2px solid #e2e8f0" }}
        >
          <div
            className="px-4 py-3"
            style={{ background: "#1d4ed8" }}
          >
            <p className="text-sm font-bold text-white">
              🎂 Как спросить возраст?
            </p>
          </div>
          {numbersData.age_phrases.map((phrase, i) => (
            <div
              key={i}
              className="px-4 py-3"
              style={{
                borderTop: "1px solid #f1f5f9",
                background: i % 2 === 0 ? "white" : "#f8faff",
              }}
            >
              <p className="font-bold" style={{ color: "#1e3a5f" }}>
                {phrase.buryat}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
                {phrase.russian}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
