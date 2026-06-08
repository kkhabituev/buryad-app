import vocabularyData from "@/content/vocabulary.json";

export default function VocabularyPage() {
  return (
    <div className="page-enter">
      <div
        className="px-5 pb-5"
        style={{
          background: "linear-gradient(160deg, #1e3a5f 0%, #2d5485 100%)",
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#c9853a" }}>
          Үгын сан
        </p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Словарь
        </h1>
      </div>

      <div className="px-4 pt-8 pb-6 flex flex-col items-center text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-4xl"
          style={{ background: "#f5e6d3" }}
        >
          📖
        </div>

        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Этот раздел пополняется
        </h2>
        <p className="text-sm mb-6" style={{ color: "#7a6a56" }}>
          Скоро здесь будут слова по темам
        </p>

        <div className="w-full space-y-3">
          {vocabularyData.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 rounded-2xl px-5 py-4"
              style={{ background: "white", border: "2px solid #e8e0d5" }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="text-left">
                <div className="text-sm font-bold" style={{ color: "#1e3a5f" }}>
                  {cat.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#c9853a" }}>
                  Скоро
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-8 w-full rounded-2xl px-5 py-4"
          style={{ background: "#f0ede6" }}
        >
          <p className="text-xs" style={{ color: "#7a6a56" }}>
            🌿 Хотите предложить слова для словаря? Напишите нам.
          </p>
        </div>
      </div>
    </div>
  );
}
