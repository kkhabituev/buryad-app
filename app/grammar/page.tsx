"use client";

import { useState } from "react";
import InteractiveTable from "@/components/InteractiveTable";
import SectionHeader from "@/components/SectionHeader";
import pronounsData from "@/content/pronouns.json";
import verbsData from "@/content/verb-conjugations.json";

type Tab = "pronouns" | "verbs" | "possessive";

const tabs: { id: Tab; label: string }[] = [
  { id: "pronouns", label: "Местоимения" },
  { id: "verbs", label: "Глаголы" },
  { id: "possessive", label: "Притяжательные" },
];

function VerbTable({ verb }: { verb: (typeof verbsData.verbs)[0] }) {
  const [activeCell, setActiveCell] = useState<number | null>(null);

  return (
    <div className="mb-6">
      <div
        className="flex items-center gap-3 mb-3 p-3 rounded-xl"
        style={{ background: "#f0ede6" }}
      >
        <div>
          <span
            className="block text-lg font-bold"
            style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {verb.infinitive}
          </span>
          <span className="block text-sm" style={{ color: "#7a6a56" }}>
            {verb.meaning} → основа: <strong style={{ color: "#c9853a" }}>{verb.stem}</strong>
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden card-shadow border" style={{ borderColor: "#e8e0d5" }}>
        {/* Header */}
        <div className="grid grid-cols-3" style={{ background: "#1e3a5f" }}>
          <div className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
            Местоимение
          </div>
          <div className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
            Форма
          </div>
          <div className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
            Перевод
          </div>
        </div>

        {verb.forms.map((form, idx) => {
          const isActive = activeCell === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveCell(isActive ? null : idx)}
              className="grid grid-cols-3 border-t cursor-pointer transition-all duration-200"
              style={{
                borderColor: "#e8e0d5",
                background: isActive ? "#f5e6d3" : idx % 2 === 0 ? "white" : "#faf8f4",
              }}
            >
              <div className="px-3 py-3 border-r text-center" style={{ borderColor: "#e8e0d5" }}>
                <span className="text-sm font-bold" style={{ color: isActive ? "#c9853a" : "#1e3a5f" }}>
                  {form.pronoun}
                </span>
              </div>
              <div className="px-3 py-3 border-r text-center" style={{ borderColor: "#e8e0d5" }}>
                <FormDisplay form={form.form} active={isActive} />
              </div>
              <div className="px-3 py-3 text-center">
                <span className="text-xs" style={{ color: isActive ? "#8b5a1f" : "#7a6a56" }}>
                  {form.pronoun_ru}
                </span>
                {isActive && form.note && (
                  <span className="block text-xs mt-0.5 italic" style={{ color: "#9b7040" }}>
                    {form.note}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormDisplay({ form, active }: { form: string; active: boolean }) {
  const upperMatch = form.match(/[А-ЯЁ]{2,}/g);
  if (!upperMatch) {
    return (
      <span className="text-sm font-bold" style={{ color: active ? "#c9853a" : "#1e3a5f" }}>
        {form}
      </span>
    );
  }

  const parts: { text: string; isEnding: boolean }[] = [];
  let remaining = form;
  for (const match of upperMatch) {
    const idx = remaining.indexOf(match);
    if (idx > 0) {
      parts.push({ text: remaining.slice(0, idx), isEnding: false });
    }
    parts.push({ text: match, isEnding: true });
    remaining = remaining.slice(idx + match.length);
  }
  if (remaining) parts.push({ text: remaining, isEnding: false });

  return (
    <span className="text-sm font-bold" style={{ color: active ? "#c9853a" : "#1e3a5f" }}>
      {parts.map((part, i) =>
        part.isEnding ? (
          <span key={i} style={{ color: "#c9853a", borderBottom: "2px solid #c9853a" }}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}

export default function GrammarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pronouns");

  return (
    <div className="page-enter">
      {/* Page header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #1e3a5f 0%, #2d5485 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9853a" }}>
          Хэлэ зүй
        </p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Грамматика
        </h1>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex gap-2 overflow-x-auto"
        style={{ background: "#faf8f4", borderBottom: "1px solid #e8e0d5" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab.id ? "#1e3a5f" : "#f0ede6",
              color: activeTab === tab.id ? "white" : "#7a6a56",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-5 pb-6">
        {/* PRONOUNS TAB */}
        {activeTab === "pronouns" && (
          <div>
            <SectionHeader
              title="Личные местоимения"
              subtitle="Нажми на ячейку, чтобы увидеть произношение"
              accent="Личные"
            />
            <InteractiveTable
              columns={[
                { key: "buryat", label: "Бурятский", isBuryat: true },
                { key: "russian", label: "Русский" },
                { key: "pronunciation", label: "Произношение" },
              ]}
              rows={pronounsData.personal.map((p) => ({
                buryat: p.buryat,
                russian: p.russian,
                pronunciation: p.pronunciation,
              }))}
            />

            <div className="mt-6">
              <SectionHeader
                title="Указательные местоимения"
                accent="Указательные"
              />
              <div className="grid grid-cols-2 gap-3">
                {pronounsData.demonstrative.map((d) => (
                  <div
                    key={d.buryat}
                    className="rounded-2xl p-4 card-shadow"
                    style={{ background: "white", border: "2px solid #e8e0d5" }}
                  >
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      {d.buryat}
                    </div>
                    <div className="text-base font-semibold" style={{ color: "#c9853a" }}>
                      {d.russian}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#9b8e7f" }}>
                      {d.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SectionHeader title="Вопросительные" accent="Вопросы" />
              <div className="grid grid-cols-2 gap-3">
                {pronounsData.questions.map((q) => (
                  <div
                    key={q.buryat}
                    className="rounded-2xl p-4"
                    style={{ background: "#f5e6d3", border: "2px solid #e8d0b5" }}
                  >
                    <div
                      className="text-xl font-bold"
                      style={{ color: "#c9853a", fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      {q.buryat}
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#8b5a1f" }}>
                      {q.russian}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VERBS TAB */}
        {activeTab === "verbs" && (
          <div>
            {/* Rule box */}
            <div
              className="rounded-2xl p-4 mb-5"
              style={{ background: "#1e3a5f" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#c9853a" }}>
                {verbsData.tense}
              </p>
              <p className="text-sm font-semibold text-white">
                {verbsData.rule}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  -ха / -хэ
                </span>
                <span className="text-lg" style={{ color: "#c9853a" }}>→</span>
                <span className="text-sm font-bold" style={{ color: "#c9853a" }}>
                  -на / -но / -нэ
                </span>
              </div>
            </div>

            <SectionHeader
              title="Спряжение глаголов"
              subtitle="Нажми на строку, чтобы увидеть примечание"
            />

            {verbsData.verbs.map((verb) => (
              <VerbTable key={verb.infinitive} verb={verb} />
            ))}
          </div>
        )}

        {/* POSSESSIVE TAB */}
        {activeTab === "possessive" && (
          <div>
            <SectionHeader
              title="Притяжательные местоимения"
              subtitle="Нажми на ячейку для выделения"
              accent="Притяжательные"
            />
            <InteractiveTable
              columns={[
                { key: "pronoun", label: "Местоим.", isBuryat: true },
                { key: "possessive", label: "Притяж.", isBuryat: true },
                { key: "russian", label: "Русский" },
              ]}
              rows={pronounsData.possessive.map((p) => ({
                pronoun: p.pronoun,
                possessive: p.possessive,
                russian: p.russian,
                note: (p as { note?: string }).note ?? "",
              }))}
              highlightNote={(row) => row.note || undefined}
            />

            <div
              className="mt-5 rounded-2xl p-4"
              style={{ background: "#f5e6d3", border: "2px solid #e8d0b5" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#c9853a" }}>
                Подсказка
              </p>
              <p className="text-sm" style={{ color: "#8b5a1f" }}>
                Притяжательные местоимения в бурятском языке образуются добавлением окончания{" "}
                <strong>-ай / -эй / -ий</strong> к основе личного местоимения.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
