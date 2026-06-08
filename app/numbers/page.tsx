"use client";

import { useState } from "react";
import NumberCard from "@/components/NumberCard";
import SectionHeader from "@/components/SectionHeader";
import numbersData from "@/content/numbers.json";

type Tab = "units" | "tens" | "large";

const tabs: { id: Tab; label: string }[] = [
  { id: "units", label: "Единицы" },
  { id: "tens", label: "Десятки" },
  { id: "large", label: "Крупные" },
];

export default function NumbersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("units");

  return (
    <div className="page-enter">
      {/* Page header */}
      <div
        className="px-5 pb-5"
        style={{
          background: "linear-gradient(160deg, #c9853a 0%, #e0a05a 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
          Тоонууд
        </p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Числа
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
          Нажми на карточку, чтобы узнать число
        </p>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex gap-2"
        style={{ background: "#faf8f4", borderBottom: "1px solid #e8e0d5" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab.id ? "#c9853a" : "#f0ede6",
              color: activeTab === tab.id ? "white" : "#7a6a56",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-5 pb-6">
        {/* UNITS */}
        {activeTab === "units" && (
          <div>
            <SectionHeader
              title="Числа от 1 до 10"
              subtitle="Переверни карточку"
              accent="Единицы"
            />
            <div className="grid grid-cols-2 gap-3">
              {numbersData.units.map((n) => (
                <NumberCard
                  key={n.number}
                  number={n.number}
                  buryat={n.buryat}
                  variants={(n as { variants?: string[] }).variants}
                />
              ))}
            </div>
          </div>
        )}

        {/* TENS */}
        {activeTab === "tens" && (
          <div>
            <SectionHeader
              title="Десятки"
              subtitle="Переверни карточку"
              accent="Десятки"
            />
            <div className="grid grid-cols-2 gap-3">
              {numbersData.tens.map((n) => (
                <NumberCard
                  key={n.number}
                  number={n.number}
                  buryat={n.buryat}
                  variants={(n as { variants?: string[] }).variants}
                />
              ))}
            </div>
          </div>
        )}

        {/* LARGE */}
        {activeTab === "large" && (
          <div>
            <SectionHeader
              title="Крупные числа"
              subtitle="Переверни карточку"
              accent="Большие числа"
            />
            <div className="grid grid-cols-3 gap-3">
              {numbersData.large.map((n) => (
                <NumberCard
                  key={n.number}
                  number={n.number}
                  buryat={n.buryat}
                />
              ))}
            </div>

            {/* Compound rule */}
            <div
              className="mt-5 rounded-2xl p-4"
              style={{ background: "#1e3a5f" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#c9853a" }}>
                Составные числа
              </p>
              <p className="text-sm text-white">{numbersData.compound_rule}</p>
            </div>

            {/* Examples */}
            <div className="mt-4">
              <SectionHeader title="Примеры" accent="Примеры" />
              <div className="space-y-2">
                {numbersData.examples.map((ex) => (
                  <div
                    key={ex.number}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: "white", border: "2px solid #e8e0d5" }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "#c9853a", fontFamily: '"Playfair Display", Georgia, serif' }}
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
          </div>
        )}

        {/* Age phrases — shown in all tabs at bottom */}
        <div
          className="mt-6 rounded-2xl overflow-hidden card-shadow border"
          style={{ borderColor: "#e8d0b5" }}
        >
          <div className="px-4 py-3" style={{ background: "#c9853a" }}>
            <p className="text-sm font-bold text-white">Как спросить возраст?</p>
          </div>
          {numbersData.age_phrases.map((phrase, i) => (
            <div
              key={i}
              className="px-4 py-3 border-t"
              style={{
                borderColor: "#e8d0b5",
                background: i % 2 === 0 ? "white" : "#faf8f4",
              }}
            >
              <div className="text-base font-bold" style={{ color: "#1e3a5f" }}>
                {phrase.buryat}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "#7a6a56" }}>
                {phrase.russian}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
