import vocabularyData from "@/content/vocabulary.json";
import Link from "next/link";

export default function VocabularyPage() {
  return (
    <div className="page-enter" style={{ background: "#f8faff", minHeight: "100dvh" }}>
      <div
        className="px-5 pb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Үгын сан</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Словарь</h1>
      </div>

      <div className="px-4 pt-8 pb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl" style={{ background: "linear-gradient(135deg, #dbeafe, #bfdbfe)" }}>
          📖
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}>Скоро пополнится</h2>
        <p className="text-sm mb-6" style={{ color: "#64748b" }}>Здесь будут слова по темам</p>

        <div className="w-full space-y-3">
          {vocabularyData.categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "white", border: "2px solid #e2e8f0" }}>
              <span className="text-2xl">{cat.emoji}</span>
              <div className="text-left">
                <div className="text-sm font-bold" style={{ color: "#1e3a5f" }}>{cat.name}</div>
                <div className="text-xs mt-0.5 font-semibold" style={{ color: "#94a3b8" }}>Скоро</div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/practice" className="mt-8 w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition active:scale-95" style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a5f)" }}>
          ⭐ Попробуй Практику
        </Link>
      </div>
    </div>
  );
}
