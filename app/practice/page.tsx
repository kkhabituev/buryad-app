"use client";

import { useState, useCallback } from "react";
import pronounsData from "@/content/pronouns.json";
import numbersData from "@/content/numbers.json";
import verbsData from "@/content/verb-conjugations.json";

// ──────────────────────────────────────
// Types
// ──────────────────────────────────────
interface FlashCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

interface CardSet {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  glow: string;
  cards: FlashCard[];
}

type Phase = "menu" | "studying" | "done";

// ──────────────────────────────────────
// Card sets — built from JSON data
// ──────────────────────────────────────
const CARD_SETS: CardSet[] = [
  {
    id: "pronouns-personal",
    title: "Личные",
    subtitle: "Местоимения",
    emoji: "👤",
    gradient: "linear-gradient(140deg, #2563eb 0%, #1e3a5f 100%)",
    glow: "#2563eb",
    cards: pronounsData.personal.map((p, i) => ({
      id: `pp-${i}`,
      front: p.buryat,
      back: p.russian,
      hint: p.pronunciation,
    })),
  },
  {
    id: "pronouns-possessive",
    title: "Притяжательные",
    subtitle: "Местоимения",
    emoji: "🏷️",
    gradient: "linear-gradient(140deg, #0891b2 0%, #06b6d4 100%)",
    glow: "#0891b2",
    cards: pronounsData.possessive.map((p, i) => ({
      id: `pos-${i}`,
      front: p.possessive,
      back: p.russian,
      hint: `← ${p.pronoun}`,
    })),
  },
  {
    id: "numbers-1-10",
    title: "Числа 1 – 10",
    subtitle: "Единицы",
    emoji: "🔢",
    gradient: "linear-gradient(140deg, #f97316 0%, #dc2626 100%)",
    glow: "#f97316",
    cards: numbersData.units.map((n) => ({
      id: `u-${n.number}`,
      front: String(n.number),
      back: n.buryat,
      hint: (n as { variants?: string[] }).variants?.join(" / "),
    })),
  },
  {
    id: "numbers-tens",
    title: "Десятки",
    subtitle: "10 – 90",
    emoji: "💯",
    gradient: "linear-gradient(140deg, #8b5cf6 0%, #7c3aed 100%)",
    glow: "#8b5cf6",
    cards: numbersData.tens.map((n) => ({
      id: `t-${n.number}`,
      front: String(n.number),
      back: n.buryat,
      hint: (n as { variants?: string[] }).variants?.join(" / "),
    })),
  },
  {
    id: "verb-bayha",
    title: "Байха",
    subtitle: "Глагол «быть»",
    emoji: "📝",
    gradient: "linear-gradient(140deg, #16a34a 0%, #059669 100%)",
    glow: "#16a34a",
    cards: verbsData.verbs[0].forms.map((f, i) => ({
      id: `bh-${i}`,
      front: f.form,
      back: `${f.pronoun_ru} (${f.pronoun})`,
      hint: f.note || undefined,
    })),
  },
  {
    id: "verb-edihe",
    title: "Эдихэ",
    subtitle: "Глагол «кушать»",
    emoji: "🍽️",
    gradient: "linear-gradient(140deg, #f59e0b 0%, #d97706 100%)",
    glow: "#f59e0b",
    cards: verbsData.verbs[1].forms.map((f, i) => ({
      id: `eh-${i}`,
      front: f.form,
      back: `${f.pronoun_ru} (${f.pronoun})`,
      hint: f.note || undefined,
    })),
  },
];

// ──────────────────────────────────────
// Main page
// ──────────────────────────────────────
export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [activeSet, setActiveSet] = useState<CardSet | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [flashClass, setFlashClass] = useState("");

  const startSet = useCallback((set: CardSet) => {
    setActiveSet(set);
    setCardIndex(0);
    setRevealed(false);
    setKnownIds(new Set());
    setWrongIds(new Set());
    setPhase("studying");
  }, []);

  const handleReveal = () => setRevealed(true);

  const handleAnswer = (knew: boolean) => {
    if (!activeSet) return;
    const card = activeSet.cards[cardIndex];

    if (knew) {
      setKnownIds((prev) => new Set(prev).add(card.id));
      setFlashClass("flash-success");
    } else {
      setWrongIds((prev) => new Set(prev).add(card.id));
      setFlashClass("flash-error");
    }

    setTimeout(() => setFlashClass(""), 500);

    const next = cardIndex + 1;
    if (next >= activeSet.cards.length) {
      setPhase("done");
    } else {
      setCardIndex(next);
      setRevealed(false);
    }
  };

  const goBack = () => {
    setPhase("menu");
    setActiveSet(null);
  };

  // ── MENU ──────────────────────────────
  if (phase === "menu") {
    return (
      <div className="page-enter" style={{ background: "#f8faff", minHeight: "100dvh" }}>
        {/* Header */}
        <div
          className="px-5 pb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(140deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
            paddingTop: "calc(env(safe-area-inset-top) + 24px)",
          }}
        >
          <div
            className="absolute"
            style={{
              top: -30, right: -20, width: 150, height: 150,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.2), transparent 70%)",
            }}
          />
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>
            ⭐ Дасхал
          </p>
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Практика
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
            Выбери набор и начни повторять
          </p>
        </div>

        <div className="px-4 pt-5 pb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
            {CARD_SETS.length} наборов карточек
          </p>

          <div className="space-y-3">
            {CARD_SETS.map((set) => (
              <button
                key={set.id}
                onClick={() => startSet(set)}
                className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-150 active:scale-98"
                style={{
                  background: "white",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                {/* Color dot */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: set.gradient,
                    boxShadow: `0 4px 12px -4px ${set.glow}55`,
                  }}
                >
                  {set.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base" style={{ color: "#0f172a" }}>
                    {set.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                    {set.subtitle} · {set.cards.length} карточек
                  </div>
                </div>

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f1f5f9" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div
            className="mt-5 rounded-2xl p-4"
            style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe" }}
          >
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>
              💡 Как пользоваться?
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#3b82f6" }}>
              Видишь карточку — вспоминаешь слово.
              Жмёшь «Показать» — проверяешь себя.
              «Знаю» — карточка в пройденные,
              «Ещё раз» — вернётся в следующем раунде.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ──────────────────────────────
  if (phase === "done" && activeSet) {
    const total = activeSet.cards.length;
    const known = knownIds.size;
    const pct = Math.round((known / total) * 100);
    const perfect = known === total;

    return (
      <div className="page-enter flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        <div
          className="px-5 pb-8 pt-8 text-center flex-1 flex flex-col items-center justify-center"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}
        >
          {/* Big result */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
            style={{
              background: perfect
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow: `0 8px 32px -8px ${perfect ? "#f59e0b" : "#3b82f6"}77`,
            }}
          >
            {perfect ? "🏆" : "⭐"}
          </div>

          <h2
            className="text-3xl font-bold mb-1"
            style={{ color: "#0f172a", fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {perfect ? "Идеально!" : "Хорошая работа!"}
          </h2>
          <p className="text-base" style={{ color: "#64748b" }}>
            {known} из {total} карточек
          </p>

          {/* Progress ring (simple bar) */}
          <div className="w-full max-w-xs mt-6">
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 12, background: "#e2e8f0" }}
            >
              <div
                className="h-full rounded-full progress-fill"
                style={{
                  width: `${pct}%`,
                  background: perfect
                    ? "linear-gradient(90deg, #f59e0b, #d97706)"
                    : "linear-gradient(90deg, #3b82f6, #1d4ed8)",
                }}
              />
            </div>
            <p className="text-center text-sm font-bold mt-2" style={{ color: perfect ? "#d97706" : "#1d4ed8" }}>
              {pct}% знаешь ✓
            </p>
          </div>

          {/* Cards known / unknown */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-5">
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "#ecfdf5", border: "1.5px solid #bbf7d0" }}
            >
              <p className="text-2xl font-bold" style={{ color: "#16a34a" }}>{known}</p>
              <p className="text-xs mt-0.5" style={{ color: "#22c55e" }}>Знаю ✓</p>
            </div>
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}
            >
              <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>{total - known}</p>
              <p className="text-xs mt-0.5" style={{ color: "#ef4444" }}>Повторить</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-4 pb-24 flex flex-col gap-3">
          <button
            onClick={() => startSet(activeSet)}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
            style={{
              background: activeSet.gradient,
              boxShadow: `0 4px 16px -4px ${activeSet.glow}66`,
            }}
          >
            🔄 Повторить набор
          </button>
          <button
            onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
            style={{ background: "#f1f5f9", color: "#475569" }}
          >
            ← Все наборы
          </button>
        </div>
      </div>
    );
  }

  // ── STUDY MODE ────────────────────────
  if (phase === "studying" && activeSet) {
    const card = activeSet.cards[cardIndex];
    const total = activeSet.cards.length;
    const progress = ((cardIndex) / total) * 100;

    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        {/* Top bar */}
        <div
          className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)", background: "white", borderBottom: "1px solid #e2e8f0" }}
        >
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90"
            style={{ background: "#f1f5f9" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#e2e8f0" }}>
            <div
              className="h-full rounded-full progress-fill"
              style={{ width: `${progress}%`, background: activeSet.gradient }}
            />
          </div>

          <span className="text-xs font-bold w-12 text-right" style={{ color: "#64748b" }}>
            {cardIndex}/{total}
          </span>
        </div>

        {/* Set label */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: activeSet.gradient,
              color: "white",
            }}
          >
            {activeSet.emoji} {activeSet.title}
          </span>
        </div>

        {/* Card area */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
          {/* Main card */}
          <div
            className={`w-full rounded-3xl p-6 flex flex-col items-center justify-center transition-all duration-200 ${flashClass}`}
            style={{
              background: "white",
              border: "2px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              minHeight: 220,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94a3b8" }}>
              {revealed ? "Перевод" : "Бурятский"}
            </p>

            {!revealed ? (
              <span
                className="text-4xl font-bold text-center leading-tight"
                style={{ color: "#0f172a" }}
              >
                {card.front}
              </span>
            ) : (
              <div className="card-reveal text-center">
                <span
                  className="text-3xl font-bold block"
                  style={{ color: "#1d4ed8" }}
                >
                  {card.back}
                </span>
                {card.hint && (
                  <span
                    className="block text-sm mt-2 font-medium italic"
                    style={{ color: "#64748b" }}
                  >
                    {card.hint}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Card counter dots */}
          <div className="flex gap-1.5 mt-4">
            {activeSet.cards.map((c, i) => (
              <div
                key={c.id}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === cardIndex ? 20 : 6,
                  height: 6,
                  background:
                    i < cardIndex
                      ? knownIds.has(activeSet.cards[i].id)
                        ? "#22c55e"
                        : "#ef4444"
                      : i === cardIndex
                      ? "#1d4ed8"
                      : "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-24 pt-2">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition active:scale-95 btn-tap"
              style={{
                background: activeSet.gradient,
                boxShadow: `0 4px 16px -4px ${activeSet.glow}66`,
              }}
            >
              Показать ответ
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-base transition active:scale-95 flex flex-col items-center gap-0.5 btn-tap"
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "2px solid #fecaca",
                }}
              >
                <span className="text-xl">✗</span>
                <span className="text-sm">Ещё раз</span>
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-4 rounded-2xl font-bold text-base transition active:scale-95 flex flex-col items-center gap-0.5 btn-tap"
                style={{
                  background: "#ecfdf5",
                  color: "#16a34a",
                  border: "2px solid #bbf7d0",
                }}
              >
                <span className="text-xl">✓</span>
                <span className="text-sm">Знаю!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
