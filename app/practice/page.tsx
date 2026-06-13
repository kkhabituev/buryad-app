"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import pronounsData from "@/content/pronouns.json";
import numbersData from "@/content/numbers.json";
import verbsData from "@/content/verb-conjugations.json";

// ── Types ─────────────────────────────────────────────────────
interface FlashCard { id: string; front: string; back: string; hint?: string }
interface CardSet {
  id: string; title: string; subtitle: string;
  emoji: string; gradient: string; glow: string;
  cards: FlashCard[];
}
type Phase = "menu" | "mode_select" | "studying" | "quiz" | "done";
type PracticeMode = "learn" | "quiz";

// ── Card sets ─────────────────────────────────────────────────
const CARD_SETS: CardSet[] = [
  {
    id: "pronouns-personal", title: "Личные", subtitle: "Местоимения",
    emoji: "👤", gradient: "linear-gradient(140deg, #2563eb 0%, #1e3a5f 100%)", glow: "#2563eb",
    cards: pronounsData.personal.map((p, i) => ({ id: `pp-${i}`, front: p.buryat, back: p.russian })),
  },
  {
    id: "pronouns-possessive", title: "Притяжательные", subtitle: "Местоимения",
    emoji: "🏷️", gradient: "linear-gradient(140deg, #0891b2 0%, #06b6d4 100%)", glow: "#0891b2",
    cards: pronounsData.possessive.map((p, i) => ({ id: `pos-${i}`, front: p.possessive, back: p.russian, hint: `← ${p.pronoun}` })),
  },
  {
    id: "numbers-1-10", title: "Числа 1 – 10", subtitle: "Единицы",
    emoji: "🔢", gradient: "linear-gradient(140deg, #f97316 0%, #dc2626 100%)", glow: "#f97316",
    cards: numbersData.units.map((n) => ({ id: `u-${n.number}`, front: String(n.number), back: n.buryat, hint: (n as { variants?: string[] }).variants?.join(" / ") })),
  },
  {
    id: "numbers-tens", title: "Десятки", subtitle: "10 – 90",
    emoji: "💯", gradient: "linear-gradient(140deg, #8b5cf6 0%, #7c3aed 100%)", glow: "#8b5cf6",
    cards: numbersData.tens.map((n) => ({ id: `t-${n.number}`, front: String(n.number), back: n.buryat })),
  },
  {
    id: "verb-bayha", title: "Байха", subtitle: "Глагол «быть»",
    emoji: "📝", gradient: "linear-gradient(140deg, #16a34a 0%, #059669 100%)", glow: "#16a34a",
    cards: verbsData.verbs[0].forms.map((f, i) => ({
      id: `bh-${i}`, front: f.form,
      back: (f as { translation?: string }).translation || f.pronoun_ru,
      hint: f.note || undefined,
    })),
  },
  {
    id: "verb-edihe", title: "Эдихэ", subtitle: "Глагол «кушать»",
    emoji: "🍽️", gradient: "linear-gradient(140deg, #f59e0b 0%, #d97706 100%)", glow: "#f59e0b",
    cards: verbsData.verbs[1].forms.map((f, i) => ({
      id: `eh-${i}`, front: f.form,
      back: (f as { translation?: string }).translation || f.pronoun_ru,
    })),
  },
  {
    id: "verb-yabaha", title: "Ябаха", subtitle: "Глагол «идти»",
    emoji: "🚶", gradient: "linear-gradient(140deg, #ec4899 0%, #be185d 100%)", glow: "#ec4899",
    cards: verbsData.verbs[2].forms.map((f, i) => ({
      id: `yb-${i}`, front: f.form,
      back: (f as { translation?: string }).translation || f.pronoun_ru,
    })),
  },
];

// ── Quiz helpers ──────────────────────────────────────────────
function generateOptions(cards: FlashCard[], currentIdx: number): string[] {
  const correct = cards[currentIdx].back;
  const pool = cards
    .filter((_, i) => i !== currentIdx)
    .map(c => c.back)
    .filter((v, i, arr) => arr.indexOf(v) === i && v !== correct);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [correct, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5);
}

// ── Main component ────────────────────────────────────────────
export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("learn");
  const [activeSet, setActiveSet] = useState<CardSet | null>(null);
  const [cardIndex, setCardIndex] = useState(0);

  // Learn mode state
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Quiz mode state — shuffled copy of cards for this session
  const [shuffledCards, setShuffledCards] = useState<FlashCard[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  // Regenerate options when card changes in quiz mode
  useEffect(() => {
    if (phase === "quiz" && shuffledCards.length > 0) {
      setQuizOptions(generateOptions(shuffledCards, cardIndex));
      setQuizSelected(null);
      setQuizAnswered(false);
    }
  }, [phase, shuffledCards, cardIndex]);

  const openModeSelect = useCallback((set: CardSet) => {
    setActiveSet(set);
    setPhase("mode_select");
  }, []);

  const startMode = useCallback((mode: PracticeMode) => {
    if (!activeSet) return;
    setPracticeMode(mode);
    setCardIndex(0);
    setFlipped(false);
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizCorrectCount(0);
    if (mode === "quiz") {
      // Shuffle cards so order is unpredictable each session
      setShuffledCards([...activeSet.cards].sort(() => Math.random() - 0.5));
    }
    setPhase(mode === "learn" ? "studying" : "quiz");
  }, [activeSet]);

  const goBack = () => { setPhase("menu"); setActiveSet(null); };
  const goToModeSelect = () => setPhase("mode_select");

  // ── Learn mode handlers ─────────────────────────────────────
  const handleStudyNext = () => {
    if (!activeSet) return;
    const next = cardIndex + 1;
    if (next >= activeSet.cards.length) setPhase("done");
    else { setCardIndex(next); setFlipped(false); }
  };

  const handleStudyPrev = () => {
    if (cardIndex > 0) { setCardIndex(c => c - 1); setFlipped(false); }
  };

  const handleCardTap = () => setFlipped(f => !f);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    // Swipe threshold 40px — flip the card
    if (Math.abs(dx) > 40) setFlipped(f => !f);
  };

  // ── Quiz mode handlers ──────────────────────────────────────
  const handleQuizAnswer = (option: string) => {
    if (quizAnswered || shuffledCards.length === 0) return;
    setQuizSelected(option);
    setQuizAnswered(true);
    if (option === shuffledCards[cardIndex].back) {
      setQuizCorrectCount(c => c + 1);
    }
  };

  const handleQuizNext = () => {
    const next = cardIndex + 1;
    if (next >= shuffledCards.length) setPhase("done");
    else setCardIndex(next);
  };

  // ════════════════════════════════════════════════════════════
  // MENU
  // ════════════════════════════════════════════════════════════
  if (phase === "menu") {
    return (
      <div className="page-enter" style={{ background: "#f8faff", minHeight: "100dvh" }}>
        <div className="px-5 pb-6 relative overflow-hidden"
          style={{ background: "linear-gradient(140deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)", paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
          <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.2), transparent 70%)" }} />
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>⭐ Дасхал</p>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Практика</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Выбери набор и начни повторять</p>
        </div>

        <div className="px-4 pt-5 pb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
            {CARD_SETS.length} наборов карточек
          </p>
          <div className="space-y-3">
            {CARD_SETS.map((set) => (
              <button key={set.id} onClick={() => openModeSelect(set)}
                className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-150 active:scale-98"
                style={{ background: "white", border: "2px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: set.gradient, boxShadow: `0 4px 12px -4px ${set.glow}55` }}>
                  {set.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base" style={{ color: "#0f172a" }}>{set.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{set.subtitle} · {set.cards.length} карточек</div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f1f5f9" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl p-4" style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "#1d4ed8" }}>Два режима практики</p>
            <div className="flex gap-3">
              <div className="flex items-start gap-2">
                <span className="text-base">📖</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#1e3a5f" }}>Обучение</p>
                  <p className="text-xs" style={{ color: "#3b82f6" }}>Переворачивай карточку — видишь перевод</p>
                </div>
              </div>
              <div className="flex items-start gap-2 ml-4">
                <span className="text-base">🎯</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#1e3a5f" }}>Проверка</p>
                  <p className="text-xs" style={{ color: "#3b82f6" }}>Выбираешь из 4 вариантов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // MODE SELECT
  // ════════════════════════════════════════════════════════════
  if (phase === "mode_select" && activeSet) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)", background: "white", borderBottom: "1px solid #e2e8f0" }}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#f1f5f9" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1">
            <span className="font-bold text-base" style={{ color: "#0f172a" }}>{activeSet.title}</span>
            <span className="text-xs ml-2" style={{ color: "#64748b" }}>{activeSet.cards.length} карточек</span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: activeSet.gradient }}>
            {activeSet.emoji}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 py-8 gap-4">
          <p className="text-center text-lg font-bold mb-2" style={{ color: "#0f172a" }}>Как будем учиться?</p>

          <button onClick={() => startMode("learn")}
            className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-95"
            style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "2px solid #bfdbfe", boxShadow: "0 4px 20px rgba(29,78,216,0.1)" }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                📖
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: "#1e3a5f" }}>Обучение</p>
                <p className="text-sm mt-0.5" style={{ color: "#3b82f6" }}>Переворачивай карточку — видишь перевод</p>
                <p className="text-xs mt-1" style={{ color: "#93c5fd" }}>Свайп влево/вправо или нажми на карточку</p>
              </div>
            </div>
          </button>

          <button onClick={() => startMode("quiz")}
            className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-95"
            style={{ background: "linear-gradient(135deg, #fef9c3, #fde68a)", border: "2px solid #fcd34d", boxShadow: "0 4px 20px rgba(245,158,11,0.12)" }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                🎯
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: "#92400e" }}>Проверка</p>
                <p className="text-sm mt-0.5" style={{ color: "#d97706" }}>Выбираешь правильный вариант из 4</p>
                <p className="text-xs mt-1" style={{ color: "#f59e0b" }}>Карточки перемешаны — каждый раз по-новому</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DONE
  // ════════════════════════════════════════════════════════════
  if (phase === "done" && activeSet) {
    // Learn mode: no score, just completion
    if (practiceMode === "learn") {
      return (
        <div className="page-enter flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
          <div className="px-5 pb-8 flex-1 flex flex-col items-center justify-center"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
              style={{ background: activeSet.gradient, boxShadow: `0 8px 32px -8px ${activeSet.glow}77` }}>
              ⭐
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#0f172a", fontFamily: '"Playfair Display", Georgia, serif' }}>
              Молодец!
            </h2>
            <p className="text-base" style={{ color: "#64748b" }}>Все {activeSet.cards.length} карточек просмотрены</p>
            <p className="text-sm mt-1 font-semibold" style={{ color: activeSet.glow }}>{activeSet.emoji} {activeSet.title}</p>
          </div>

          <div className="px-4 pb-24 flex flex-col gap-3">
            <button onClick={() => startMode("learn")}
              className="w-full py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
              style={{ background: activeSet.gradient, boxShadow: `0 4px 16px -4px ${activeSet.glow}66` }}>
              🔄 Просмотреть ещё раз
            </button>
            <button onClick={() => startMode("quiz")}
              className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
              style={{ background: "linear-gradient(135deg, #fef9c3, #fde68a)", color: "#92400e", border: "1.5px solid #fcd34d" }}>
              🎯 Перейти к проверке
            </button>
            <button onClick={goBack}
              className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
              style={{ background: "#f1f5f9", color: "#475569" }}>
              ← Все наборы
            </button>
          </div>
        </div>
      );
    }

    // Quiz mode: show score
    const total = shuffledCards.length || activeSet.cards.length;
    const known = quizCorrectCount;
    const pct = Math.round((known / total) * 100);
    const perfect = known === total;

    return (
      <div className="page-enter flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        <div className="px-5 pb-8 flex-1 flex flex-col items-center justify-center"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 32px)" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
            style={{ background: perfect ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: `0 8px 32px -8px ${perfect ? "#f59e0b" : "#3b82f6"}77` }}>
            {perfect ? "🏆" : "⭐"}
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: "#0f172a", fontFamily: '"Playfair Display", Georgia, serif' }}>
            {perfect ? "Идеально!" : pct >= 70 ? "Отлично!" : "Хорошая работа!"}
          </h2>
          <p className="text-sm mb-1" style={{ color: "#64748b" }}>Проверка завершена</p>
          <p className="text-base" style={{ color: "#64748b" }}>{known} из {total} правильно</p>

          <div className="w-full max-w-xs mt-6">
            <div className="w-full rounded-full overflow-hidden" style={{ height: 12, background: "#e2e8f0" }}>
              <div className="h-full rounded-full progress-fill"
                style={{ width: `${pct}%`, background: perfect ? "linear-gradient(90deg, #f59e0b, #d97706)" : "linear-gradient(90deg, #3b82f6, #1d4ed8)" }} />
            </div>
            <p className="text-center text-sm font-bold mt-2" style={{ color: perfect ? "#d97706" : "#1d4ed8" }}>{pct}% ✓</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-5">
            <div className="rounded-2xl p-4 text-center" style={{ background: "#ecfdf5", border: "1.5px solid #bbf7d0" }}>
              <p className="text-2xl font-bold" style={{ color: "#16a34a" }}>{known}</p>
              <p className="text-xs mt-0.5" style={{ color: "#22c55e" }}>Верно ✓</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}>
              <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>{total - known}</p>
              <p className="text-xs mt-0.5" style={{ color: "#ef4444" }}>Повторить</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-24 flex flex-col gap-3">
          <button onClick={() => startMode("quiz")}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
            style={{ background: activeSet.gradient, boxShadow: `0 4px 16px -4px ${activeSet.glow}66` }}>
            🔄 Повторить ещё раз
          </button>
          <button onClick={goToModeSelect}
            className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
            style={{ background: "#eff6ff", color: "#1d4ed8", border: "1.5px solid #bfdbfe" }}>
            ↕ Сменить режим
          </button>
          <button onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
            style={{ background: "#f1f5f9", color: "#475569" }}>
            ← Все наборы
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // STUDY MODE — двухсторонняя flip-карточка
  // ════════════════════════════════════════════════════════════
  if (phase === "studying" && activeSet) {
    const card = activeSet.cards[cardIndex];
    const total = activeSet.cards.length;
    const progress = ((cardIndex) / total) * 100;

    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        {/* Top bar */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)", background: "white", borderBottom: "1px solid #e2e8f0" }}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#f1f5f9" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#e2e8f0" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: activeSet.gradient }} />
          </div>
          <span className="text-xs font-bold w-12 text-right" style={{ color: "#64748b" }}>{cardIndex + 1}/{total}</span>
        </div>

        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: activeSet.gradient, color: "white" }}>
            📖 {activeSet.emoji} {activeSet.title}
          </span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {flipped ? "↩ свайп чтобы вернуть" : "свайп или нажми чтобы перевернуть"}
          </span>
        </div>

        {/* Flip card */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
          <div
            className={`flip-card w-full cursor-pointer select-none${flipped ? " flipped" : ""}`}
            style={{ height: 290 }}
            onClick={handleCardTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flip-card-inner" style={{ height: "100%" }}>

              {/* FRONT — Buryat */}
              <div className="flip-card-front"
                style={{ borderRadius: 24, background: activeSet.gradient, boxShadow: `0 10px 40px -8px ${activeSet.glow}55` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Бурятский
                </p>
                <span className="text-4xl font-bold text-white text-center leading-tight px-6">{card.front}</span>
                {card.hint && (
                  <span className="text-sm mt-3 italic text-center px-6" style={{ color: "rgba(255,255,255,0.55)" }}>{card.hint}</span>
                )}
                <div className="mt-8 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs">свайп или нажми</span>
                </div>
              </div>

              {/* BACK — Russian */}
              <div className="flip-card-back"
                style={{ borderRadius: 24, background: "white", border: `2.5px solid ${activeSet.glow}28`, boxShadow: `0 10px 40px -8px ${activeSet.glow}28` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94a3b8" }}>
                  Перевод
                </p>
                <span className="text-3xl font-bold text-center leading-snug px-6" style={{ color: "#1e3a5f" }}>{card.back}</span>
                {card.hint && (
                  <span className="text-sm mt-3 italic text-center px-6" style={{ color: "#94a3b8" }}>{card.hint}</span>
                )}
                <div className="mt-8 flex items-center gap-2" style={{ color: "#cbd5e1" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs">свайп чтобы вернуть</span>
                </div>
              </div>

            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-5 flex-wrap justify-center max-w-xs">
            {activeSet.cards.map((c, i) => (
              <div key={c.id} className="rounded-full transition-all duration-300"
                style={{
                  width: i === cardIndex ? 20 : 6,
                  height: 6,
                  background: i < cardIndex ? activeSet.glow : i === cardIndex ? "#1d4ed8" : "#e2e8f0",
                  opacity: i < cardIndex ? 0.55 : 1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="px-4 pb-24 pt-2">
          <div className="flex gap-3">
            {cardIndex > 0 && (
              <button onClick={handleStudyPrev}
                className="py-4 px-6 rounded-2xl font-bold text-base transition active:scale-95"
                style={{ background: "white", color: "#475569", border: "2px solid #e2e8f0" }}>
                ←
              </button>
            )}
            <button onClick={handleStudyNext}
              className="flex-1 py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
              style={{ background: activeSet.gradient, boxShadow: `0 4px 16px -4px ${activeSet.glow}66` }}>
              {cardIndex + 1 >= total ? "Завершить ✓" : "Следующая →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // QUIZ MODE — рандомный порядок карточек
  // ════════════════════════════════════════════════════════════
  if (phase === "quiz" && activeSet && shuffledCards.length > 0) {
    const card = shuffledCards[cardIndex];
    const total = shuffledCards.length;
    const progress = (cardIndex / total) * 100;
    const correctAnswer = card.back;

    const optionStyle = (opt: string): React.CSSProperties => {
      if (!quizAnswered) return { background: "white", color: "#0f172a", border: "2px solid #e2e8f0" };
      if (opt === correctAnswer) return { background: "#ecfdf5", color: "#15803d", border: "2px solid #bbf7d0" };
      if (opt === quizSelected) return { background: "#fef2f2", color: "#dc2626", border: "2px solid #fecaca" };
      return { background: "#f8faff", color: "#94a3b8", border: "2px solid #f1f5f9" };
    };

    const optionIcon = (opt: string) => {
      if (!quizAnswered) return null;
      if (opt === correctAnswer) return <span className="text-base">✓</span>;
      if (opt === quizSelected) return <span className="text-base">✗</span>;
      return null;
    };

    return (
      <div className="flex flex-col min-h-screen" style={{ background: "#f8faff" }}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)", background: "white", borderBottom: "1px solid #e2e8f0" }}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#f1f5f9" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#e2e8f0" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
          </div>
          <span className="text-xs font-bold w-16 text-right" style={{ color: "#64748b" }}>
            {cardIndex + 1}/{total} · 🎯{quizCorrectCount}
          </span>
        </div>

        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "white" }}>
            🎯 {activeSet.emoji} {activeSet.title}
          </span>
        </div>

        {/* Question card */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "#94a3b8" }}>
            Переведи на русский:
          </p>
          <div className="w-full rounded-3xl p-6 flex flex-col items-center justify-center"
            style={{ background: "white", border: "2px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", minHeight: 100 }}>
            <span className="text-4xl font-bold text-center leading-tight" style={{ color: "#0f172a" }}>{card.front}</span>
            {card.hint && <span className="text-xs mt-1 italic" style={{ color: "#94a3b8" }}>{card.hint}</span>}
          </div>
        </div>

        {/* Answer options */}
        <div className="flex-1 px-5 flex flex-col gap-3 pb-4">
          {quizOptions.map((opt) => (
            <button key={opt} onClick={() => handleQuizAnswer(opt)} disabled={quizAnswered}
              className="w-full py-4 px-5 rounded-2xl font-semibold text-base transition-all duration-150 active:scale-97 flex items-center justify-between"
              style={{ ...optionStyle(opt), boxShadow: !quizAnswered ? "0 2px 8px rgba(0,0,0,0.05)" : "none" }}>
              <span>{opt}</span>
              {optionIcon(opt)}
            </button>
          ))}
        </div>

        {/* Next button — appears after answer */}
        <div className="px-5 pb-24 pt-1">
          {quizAnswered && (
            <button onClick={handleQuizNext}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition active:scale-95 card-reveal"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 16px -4px #d9770666" }}>
              {cardIndex + 1 >= total ? "Посмотреть результат →" : "Следующая →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
