import Link from "next/link";

const sections = [
  {
    href: "/grammar",
    title: "Грамматика",
    titleBuryat: "Хэлэ зүй",
    description: "Местоимения, глаголы, притяжательные формы",
    emoji: "📚",
    color: "#1e3a5f",
    textColor: "white",
    available: true,
  },
  {
    href: "/numbers",
    title: "Числа",
    titleBuryat: "Тоонууд",
    description: "Единицы, десятки, как спросить возраст",
    emoji: "🔢",
    color: "#c9853a",
    textColor: "white",
    available: true,
  },
  {
    href: "/vocabulary",
    title: "Словарь",
    titleBuryat: "Үгын сан",
    description: "Животные, цвета, еда и многое другое",
    emoji: "📖",
    color: "white",
    textColor: "#1e3a5f",
    available: false,
  },
  {
    href: "/phrasebook",
    title: "Разговорник",
    titleBuryat: "Хэлэлсэгшэ",
    description: "Приветствия, за столом, в пути",
    emoji: "💬",
    color: "white",
    textColor: "#1e3a5f",
    available: false,
  },
];

export default function HomePage() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1e3a5f 0%, #2d5485 60%, #1e3a5f 100%)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #c9853a 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #c9853a 0%, transparent 40%)`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-5"
          style={{
            background: "radial-gradient(circle, white, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />

        <div className="relative px-5 pt-12 pb-10">
          {/* Ornament */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1" style={{ background: "rgba(201,133,58,0.5)" }} />
            <span className="text-lg" style={{ color: "#c9853a" }}>✦</span>
            <div className="h-px flex-1" style={{ background: "rgba(201,133,58,0.5)" }} />
          </div>

          <h1
            className="text-3xl font-bold text-white mb-1 leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Буряад хэлэн
          </h1>
          <p className="text-base font-semibold" style={{ color: "#c9853a" }}>
            Учим бурятский вместе
          </p>
          <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
            Язык народа Байкала
          </p>

          <div className="flex items-center gap-2 mt-4">
            <div className="h-px flex-1" style={{ background: "rgba(201,133,58,0.5)" }} />
            <span className="text-lg" style={{ color: "#c9853a" }}>✦</span>
            <div className="h-px flex-1" style={{ background: "rgba(201,133,58,0.5)" }} />
          </div>
        </div>
      </div>

      {/* Sections grid */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#9b8e7f" }}>
          Разделы
        </p>

        <div className="grid grid-cols-2 gap-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.available ? section.href : "#"}
              className={`relative rounded-2xl p-4 transition-all duration-200 card-shadow ${
                section.available ? "active:scale-95 active:opacity-80" : "cursor-default"
              }`}
              style={{
                background: section.color,
                border: section.color === "white" ? "2px solid #e8e0d5" : "none",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {!section.available && (
                <div
                  className="absolute top-2.5 right-2.5 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#f5e6d3", color: "#c9853a" }}
                >
                  Скоро
                </div>
              )}

              <div>
                <div className="text-2xl mb-2">{section.emoji}</div>
                <div
                  className="text-base font-bold leading-tight"
                  style={{
                    color: section.textColor,
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {section.title}
                </div>
                <div
                  className="text-xs mt-0.5 font-semibold"
                  style={{
                    color:
                      section.color === "white"
                        ? "#c9853a"
                        : "rgba(255,255,255,0.7)",
                  }}
                >
                  {section.titleBuryat}
                </div>
              </div>

              <p
                className="text-xs leading-snug mt-2"
                style={{
                  color:
                    section.color === "white"
                      ? "#7a6a56"
                      : "rgba(255,255,255,0.8)",
                }}
              >
                {section.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="mt-6 rounded-2xl p-4 text-center"
          style={{ background: "#f0ede6" }}
        >
          <p className="text-sm" style={{ color: "#7a6a56" }}>
            🌊 Бурятский язык — язык берегов Байкала.
          </p>
          <p className="text-xs mt-1" style={{ color: "#9b8e7f" }}>
            Учите по 10 минут в день.
          </p>
        </div>
      </div>
    </div>
  );
}
