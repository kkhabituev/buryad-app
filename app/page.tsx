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
    available: true,
  },
  {
    href: "/topics",
    title: "Подборки",
    sub: "Үгын бүлэг",
    desc: "Числа, цвета, животные",
    emoji: "🗂️",
    gradient: "linear-gradient(140deg, #f97316 0%, #dc2626 100%)",
    glow: "#f97316",
    available: true,
  },
  {
    href: "/practice",
    title: "Практика",
    sub: "Дасхал",
    desc: "Карточки для заучивания",
    emoji: "⭐",
    gradient: "linear-gradient(140deg, #f59e0b 0%, #d97706 100%)",
    glow: "#f59e0b",
    available: true,
  },
  {
    href: "/vocabulary",
    title: "Словарь",
    sub: "Үгын сан",
    desc: "Слова по темам",
    emoji: "📖",
    gradient: "linear-gradient(140deg, #e2e8f0 0%, #cbd5e1 100%)",
    glow: "#94a3b8",
    available: false,
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
        {/* Glowing orbs */}
        <div
          className="absolute"
          style={{
            top: -60,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
          }}
        />

        <div className="relative px-5 pt-14 pb-10">
          {/* Badge */}
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
          <p className="text-base font-semibold mb-1" style={{ color: "#fbbf24" }}>
            Учим бурятский вместе
          </p>

          {/* Mini stats */}
          <div className="flex gap-3 mt-5">
            {[
              { icon: "🔥", value: "0", label: "дней подряд" },
              { icon: "⭐", value: "6", label: "наборов карточек" },
              { icon: "📝", value: "50+", label: "слов" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 rounded-2xl px-3 py-2.5 text-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="text-lg leading-none mb-0.5">{s.icon}</div>
                <div className="text-base font-bold text-white leading-none">{s.value}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="px-4 pt-5 pb-6">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#94a3b8" }}
        >
          Разделы
        </p>

        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.available ? s.href : "#"}
              className={`relative rounded-2xl p-4 transition-all duration-200 ${
                s.available ? "active:scale-95" : "cursor-default"
              }`}
              style={{
                background: s.gradient,
                boxShadow: s.available ? `0 4px 20px -6px ${s.glow}66` : "none",
                minHeight: 148,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {!s.available && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(248,250,255,0.5)" }}
                />
              )}
              {!s.available && (
                <div
                  className="absolute top-2.5 right-2.5 text-xs font-bold px-2 py-0.5 rounded-full z-10"
                  style={{ background: "rgba(148,163,184,0.2)", color: "#64748b" }}
                >
                  Скоро
                </div>
              )}

              <div className="relative z-10">
                <span className="text-3xl block mb-2">{s.emoji}</span>
                <div
                  className="text-base font-bold leading-tight"
                  style={{
                    color: s.available ? "white" : "#64748b",
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {s.title}
                </div>
                <div
                  className="text-xs font-bold mt-0.5"
                  style={{ color: s.available ? "rgba(255,255,255,0.65)" : "#94a3b8" }}
                >
                  {s.sub}
                </div>
              </div>

              <p
                className="relative z-10 text-xs leading-snug mt-2"
                style={{ color: s.available ? "rgba(255,255,255,0.8)" : "#94a3b8" }}
              >
                {s.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* PROMO BLOCK */}
        <div
          className="mt-4 rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1.5px solid #a7f3d0",
          }}
        >
          <span className="text-3xl">🎯</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>
              Попробуй флэш-карточки
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#059669" }}>
              6 наборов · местоимения, числа, глаголы
            </p>
          </div>
          <Link
            href="/practice"
            className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full transition active:scale-95"
            style={{ background: "#10b981", color: "white" }}
          >
            Начать
          </Link>
        </div>
      </div>
    </div>
  );
}
