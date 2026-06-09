"use client";

import { useState } from "react";
import pronounsData from "@/content/pronouns.json";
import verbsData from "@/content/verb-conjugations.json";

type Tab = "pronouns" | "verbs";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "pronouns", label: "Местоимения", emoji: "👤" },
  { id: "verbs",    label: "Глаголы",     emoji: "📝" },
];

// ───────── Interactive Table ─────────────────────────────────
interface TableCol { key: string; label: string; bold?: boolean }

function InteractiveTable({ columns, rows }: { columns: TableCol[]; rows: Record<string, string>[] }) {
  const [active, setActive] = useState<{ r: number; c: string } | null>(null);
  const toggle = (r: number, c: string) =>
    setActive(active?.r === r && active?.c === c ? null : { r, c });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)`, background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}>
        {columns.map((c) => (
          <div key={c.key} className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.75)" }}>
            {c.label}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => {
        const rowActive = columns.some((c) => active?.r === ri && active?.c === c.key);
        return (
          <div key={ri} className="grid border-t" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)`, borderColor: "#e2e8f0", background: rowActive ? "#eff6ff" : ri % 2 === 0 ? "white" : "#f8faff" }}>
            {columns.map((col, ci) => {
              const isActive = active?.r === ri && active?.c === col.key;
              return (
                <div key={col.key} onClick={() => toggle(ri, col.key)}
                  className="px-3 py-3 text-center cursor-pointer transition-all duration-150 border-r last:border-r-0"
                  style={{ borderColor: "#e2e8f0", background: isActive ? "#dbeafe" : undefined }}>
                  <span className="text-sm leading-snug block"
                    style={{ fontWeight: col.bold ? 700 : 500, color: isActive ? "#1d4ed8" : col.bold ? "#1e3a5f" : "#374151", fontSize: col.bold ? "1rem" : undefined }}>
                    {row[col.key] || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ───────── Verb conjugation ───────────────────────────────────
function FormDisplay({ form, active }: { form: string; active: boolean }) {
  const parts: { text: string; hi: boolean }[] = [];
  const re = /[А-ЯЁ]{2,}/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(form)) !== null) {
    if (m.index > last) parts.push({ text: form.slice(last, m.index), hi: false });
    parts.push({ text: m[0], hi: true });
    last = m.index + m[0].length;
  }
  if (last < form.length) parts.push({ text: form.slice(last), hi: false });
  if (!parts.length) parts.push({ text: form, hi: false });

  return (
    <span className="text-sm font-bold" style={{ color: active ? "#1d4ed8" : "#1e3a5f" }}>
      {parts.map((p, i) =>
        p.hi ? (
          <span key={i} style={{ color: "#f97316", borderBottom: "2px solid #f97316", paddingBottom: 1 }}>{p.text}</span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

function VerbTable({ verb, primary }: { verb: (typeof verbsData.verbs)[0]; primary?: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl"
        style={{ background: primary ? "linear-gradient(135deg, #1e3a5f, #1d4ed8)" : "linear-gradient(135deg, #eff6ff, #dbeafe)", border: primary ? "none" : "1.5px solid #bfdbfe" }}>
        {primary && <span className="text-2xl">⭐</span>}
        <div>
          <span className="block text-xl font-bold" style={{ color: primary ? "white" : "#1e3a5f" }}>{verb.infinitive}</span>
          <span className="block text-sm" style={{ color: primary ? "rgba(255,255,255,0.75)" : "#3b82f6" }}>
            {verb.meaning} → основа:{" "}
            <strong style={{ color: primary ? "#fbbf24" : "#f97316" }}>{verb.stem}</strong>
          </span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
        <div className="grid grid-cols-3" style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}>
          {["Местоим.", "Форма", "Перевод"].map((h) => (
            <div key={h} className="px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>{h}</div>
          ))}
        </div>
        {verb.forms.map((f, i) => {
          const isActive = active === i;
          return (
            <div key={i} onClick={() => setActive(isActive ? null : i)}
              className="grid grid-cols-3 border-t cursor-pointer transition-all duration-150"
              style={{ borderColor: "#e2e8f0", background: isActive ? "#eff6ff" : i % 2 === 0 ? "white" : "#f8faff" }}>
              <div className="px-3 py-3 border-r text-center" style={{ borderColor: "#e2e8f0" }}>
                <span className="text-sm font-bold" style={{ color: isActive ? "#1d4ed8" : "#1e3a5f" }}>{f.pronoun}</span>
              </div>
              <div className="px-3 py-3 border-r text-center" style={{ borderColor: "#e2e8f0" }}>
                <FormDisplay form={f.form} active={isActive} />
              </div>
              <div className="px-3 py-3 text-center">
                <span className="text-sm font-semibold" style={{ color: isActive ? "#1d4ed8" : "#374151" }}>
                  {(f as { translation?: string }).translation || f.pronoun_ru}
                </span>
                {isActive && f.note && (
                  <span className="block text-xs mt-0.5 italic" style={{ color: "#94a3b8" }}>{f.note}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────── Possessive examples ─────────────────────────────────
const POSSESSIVE_EXAMPLES = [
  { phrase: "Минии гэр",    translation: "Мой дом",         pronoun: "Би → Минии" },
  { phrase: "Шинии эжы",   translation: "Твоя мама",        pronoun: "Ши → Шинии" },
  { phrase: "Манай нохой", translation: "Наша собака",      pronoun: "Бидэ → Манай" },
  { phrase: "Танай морин",  translation: "Ваша лошадь",     pronoun: "Та → Танай" },
  { phrase: "Минии ном",   translation: "Моя книга",        pronoun: "Би → Минии" },
  { phrase: "Тэрээнэй гэр",translation: "Его / её дом",     pronoun: "Тэрэ → Тэрээнэй" },
];

// ───────── Page ───────────────────────────────────────────────
export default function GrammarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pronouns");

  return (
    <div className="page-enter" style={{ background: "#f8faff", minHeight: "100dvh" }}>
      {/* Header */}
      <div className="px-5 pb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)", paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
        <div className="absolute" style={{ top: -30, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Хэлэ зүй</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Грамматика</h1>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 px-4 py-3 flex gap-2"
        style={{ background: "rgba(248,250,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95"
            style={{
              background: activeTab === tab.id ? "linear-gradient(135deg, #1d4ed8, #1e3a5f)" : "#f1f5f9",
              color: activeTab === tab.id ? "white" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 2px 12px -2px #1d4ed855" : "none",
            }}>
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 pt-5 pb-8">

        {/* ── МЕСТОИМЕНИЯ (личные + притяжательные) ── */}
        {activeTab === "pronouns" && (
          <div>
            {/* Личные */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#1d4ed8" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Личные местоимения</p>
            </div>
            <p className="text-xs mb-3" style={{ color: "#64748b" }}>Нажми на ячейку для выделения</p>
            <InteractiveTable
              columns={[
                { key: "buryat",  label: "Бурятский", bold: true },
                { key: "russian", label: "Русский" },
              ]}
              rows={pronounsData.personal.map((p) => ({ buryat: p.buryat, russian: p.russian }))}
            />

            {/* Притяжательные — перемещены сюда */}
            <div className="flex items-center gap-2 mt-6 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#0891b2" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Притяжательные местоимения</p>
            </div>
            <InteractiveTable
              columns={[
                { key: "pronoun",    label: "Местоим.",  bold: true },
                { key: "possessive", label: "Притяж.",   bold: true },
                { key: "russian",    label: "Русский" },
              ]}
              rows={pronounsData.possessive.map((p) => ({ pronoun: p.pronoun, possessive: p.possessive, russian: p.russian }))}
            />

            {/* Примеры с притяжательными */}
            <div className="flex items-center gap-2 mt-5 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#f97316" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Примеры употребления</p>
            </div>
            <div className="space-y-2">
              {POSSESSIVE_EXAMPLES.map((ex) => (
                <div key={ex.phrase} className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: "white", border: "1.5px solid #e2e8f0" }}>
                  <div>
                    <span className="font-bold text-base" style={{ color: "#1e3a5f" }}>{ex.phrase}</span>
                    <span className="text-sm ml-3" style={{ color: "#374151" }}>— {ex.translation}</span>
                  </div>
                  <span className="text-xs font-medium ml-3 flex-shrink-0" style={{ color: "#94a3b8" }}>{ex.pronoun}</span>
                </div>
              ))}
            </div>

            {/* Указательные */}
            <div className="flex items-center gap-2 mt-6 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#8b5cf6" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Указательные</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pronounsData.demonstrative.map((d) => (
                <div key={d.buryat} className="rounded-2xl p-4"
                  style={{ background: "white", border: "2px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: "#1e3a5f" }}>{d.buryat}</div>
                  <div className="text-base font-bold" style={{ color: "#f97316" }}>{d.russian}</div>
                  <div className="text-xs mt-1" style={{ color: "#94a3b8" }}>{d.note}</div>
                </div>
              ))}
            </div>

            {/* Вопросительные */}
            <div className="flex items-center gap-2 mt-6 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#6366f1" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Вопросительные</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pronounsData.questions.map((q) => (
                <div key={q.buryat} className="rounded-2xl p-4"
                  style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", border: "1.5px solid #ddd6fe" }}>
                  <div className="text-2xl font-bold" style={{ color: "#7c3aed" }}>{q.buryat}</div>
                  <div className="text-sm mt-1" style={{ color: "#5b21b6" }}>{q.russian}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ГЛАГОЛЫ ─────────────────────────────── */}
        {activeTab === "verbs" && (
          <div>
            {/* Rule block */}
            <div className="rounded-2xl p-4 mb-5" style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)" }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#fbbf24" }}>
                ✦ {verbsData.tense}
              </p>
              <p className="text-sm font-semibold text-white">{verbsData.rule}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
                  -ха / -хэ
                </span>
                <span className="text-xl" style={{ color: "#fbbf24" }}>→</span>
                <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(249,115,22,0.25)", color: "#fb923c" }}>
                  -на / -но / -нэ
                </span>
              </div>
            </div>

            {/* Байха — primary (all details) */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "#1d4ed8" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Разбираем на примере Байха</p>
            </div>
            <VerbTable verb={verbsData.verbs[0]} primary />

            {/* Other verbs — as examples */}
            <div className="flex items-center gap-2 mb-3 mt-2">
              <div className="w-1 h-5 rounded-full" style={{ background: "#f97316" }} />
              <p className="text-sm font-bold" style={{ color: "#1e3a5f" }}>Другие глаголы — тот же паттерн</p>
            </div>
            {verbsData.verbs.slice(1).map((verb) => (
              <VerbTable key={verb.infinitive} verb={verb} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
