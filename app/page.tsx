import Link from "next/link";

const sections = [
  {
    href: "/grammar",
    title: "Грамматика",
    sub: "Хэлэ зүй",
    desc: "Местоимения, глаголы и формы",
    emoji: "📚",
    gradient: "linear-gradient(140deg, #1d4ed8 0%, #1e3a5f 100%)",
    glow: "#1d4ed8",
  },
  {
    href: "/topics",
    title: "Подборки",
    sub: "Үгын бүлэг",
    desc: "Числа, цвета, животные",
    emoji: "🗂️",
    gradient: "linear-gradient(140deg, #f97316 0%, #dc2626 100%)",
    glow: "#f97316",
  },
  {
    href: "/vocabulary",
    title: "Словарь",
    sub: "Үгын сан",
    desc: "Перевод любого слова",
    emoji: "📖",
    gradient: "linear-gradient(140deg, #0891b2 0%, #0e7490 100%)",
    glow: "#0891b2",
  },
  {
    href: "/phrasebook",
    title: "Разговорник",
    sub: "Хэлэлсэгшэ",
    desc: "Живые бурятские фразы",
    emoji: "💬",
    gradient: "linear-gradient(140deg, #7c3aed 0%, #6d28d9 100%)",
    glow: "#7c3aed",
  },
];

export default function HomePage() {
  return (
    <div className="page-enter">
      {/* HERO */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 45%, #1d4ed8 100%)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="absolute" style={{ top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%)" }} />
        <div className="absolute" style={{ bottom: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)" }} />

        <div className="relative px-5 pt-14 pb-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <span>🌊</span> Язык народа Байкала
          </div>

          <h1
            className="text-4xl font-bold text-white leading-tight mb-1"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Буряад хэлэн
          </h1>
          <p className="text-base font-semibold" style={{ color: "#fbbf24" }}>
            Учим бурятский вместе
          </p>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="px-4 pt-5 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
          Разделы
        </p>

        {/* 2×2 grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="relative rounded-2xl p-4 transition-all duration-200 active:scale-95"
              style={{
                background: s.gradient,
                boxShadow: `0 4px 20px -6px ${s.glow}66`,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span className="text-3xl block mb-2">{s.emoji}</span>
                <div
                  className="text-base font-bold leading-tight text-white"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {s.title}
                </div>
                <div className="text-xs font-bold mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {s.sub}
                </div>
              </div>
              <p className="text-xs leading-snug mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
                {s.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Practice — featured full-width */}
        <Link
          href="/practice"
          className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            boxShadow: "0 4px 24px -6px #f59e0b66",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            ⭐
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              Практика · Дасхал
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
              17 наборов флэш-карточек · обучение и проверка
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
