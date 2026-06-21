"use client";

import Link from "next/link";

type Word = { buryat: string; russian: string; category: string; emoji: string };

const WORD_POOL: Word[] = [
  // Цвета
  { buryat: "улаан",      russian: "красный",    category: "Цвета",         emoji: "🎨" },
  { buryat: "хүхэ",       russian: "синий",      category: "Цвета",         emoji: "🎨" },
  { buryat: "ногоон",     russian: "зелёный",    category: "Цвета",         emoji: "🎨" },
  { buryat: "шара",       russian: "жёлтый",     category: "Цвета",         emoji: "🎨" },
  { buryat: "сагаан",     russian: "белый",      category: "Цвета",         emoji: "🎨" },
  { buryat: "хара",       russian: "чёрный",     category: "Цвета",         emoji: "🎨" },
  { buryat: "ягаан",      russian: "розовый",    category: "Цвета",         emoji: "🎨" },
  { buryat: "боро",       russian: "серый",      category: "Цвета",         emoji: "🎨" },
  { buryat: "сэнхир",     russian: "голубой",    category: "Цвета",         emoji: "🎨" },
  { buryat: "хүрин",      russian: "коричневый", category: "Цвета",         emoji: "🎨" },
  // Животные
  { buryat: "баабгай",    russian: "медведь",    category: "Животные",      emoji: "🐻" },
  { buryat: "шоно",       russian: "волк",       category: "Животные",      emoji: "🐺" },
  { buryat: "үнэгэн",     russian: "лиса",       category: "Животные",      emoji: "🦊" },
  { buryat: "морин",      russian: "лошадь",     category: "Животные",      emoji: "🐴" },
  { buryat: "нохой",      russian: "собака",     category: "Животные",      emoji: "🐶" },
  { buryat: "загаhан",    russian: "рыба",       category: "Животные",      emoji: "🐟" },
  { buryat: "шубуун",     russian: "птица",      category: "Животные",      emoji: "🐦" },
  { buryat: "шандаган",   russian: "заяц",       category: "Животные",      emoji: "🐰" },
  { buryat: "үнеэн",      russian: "корова",     category: "Животные",      emoji: "🐄" },
  { buryat: "бүргэд",     russian: "орёл",       category: "Животные",      emoji: "🦅" },
  // Семья
  { buryat: "эжы",        russian: "мама",       category: "Семья",         emoji: "👩" },
  { buryat: "аба",        russian: "папа",       category: "Семья",         emoji: "👨" },
  { buryat: "аха",        russian: "старший брат", category: "Семья",       emoji: "🧑" },
  { buryat: "эгэшэ",      russian: "старшая сестра", category: "Семья",     emoji: "👧" },
  { buryat: "дүү",        russian: "младший / -ая", category: "Семья",      emoji: "👶" },
  { buryat: "хүбүүн",     russian: "сын",        category: "Семья",         emoji: "🧒" },
  { buryat: "басаган",    russian: "дочь",       category: "Семья",         emoji: "🎀" },
  // Еда
  { buryat: "буузэ",      russian: "буузы",      category: "Еда",           emoji: "🥟" },
  { buryat: "шүлэн",      russian: "суп",        category: "Еда",           emoji: "🍲" },
  { buryat: "мяхан",      russian: "мясо",       category: "Еда",           emoji: "🥩" },
  { buryat: "хилээмэн",   russian: "хлеб",       category: "Еда",           emoji: "🍞" },
  { buryat: "уhан",       russian: "вода",       category: "Еда",           emoji: "💧" },
  { buryat: "hүн",        russian: "молоко",     category: "Еда",           emoji: "🥛" },
  // Природа
  { buryat: "Байгал нуур", russian: "Байкал",    category: "Природа",       emoji: "🌊" },
  { buryat: "нуур",       russian: "озеро",      category: "Природа",       emoji: "🏞️" },
  { buryat: "гол",        russian: "река",       category: "Природа",       emoji: "🌊" },
  { buryat: "хада",       russian: "гора",       category: "Природа",       emoji: "⛰️" },
  { buryat: "тала",       russian: "степь",      category: "Природа",       emoji: "🌾" },
  { buryat: "ой",         russian: "лес",        category: "Природа",       emoji: "🌲" },
  { buryat: "тэнгэри",    russian: "небо",       category: "Природа",       emoji: "🌌" },
  { buryat: "наран",      russian: "солнце",     category: "Природа",       emoji: "☀️" },
  { buryat: "hара",       russian: "луна",       category: "Природа",       emoji: "🌙" },
  { buryat: "одон",       russian: "звезда",     category: "Природа",       emoji: "⭐" },
  // Тело
  { buryat: "толгой",     russian: "голова",     category: "Тело",          emoji: "🗣️" },
  { buryat: "нюдэн",      russian: "глаз",       category: "Тело",          emoji: "👁️" },
  { buryat: "хамар",      russian: "нос",        category: "Тело",          emoji: "👃" },
  { buryat: "аман",       russian: "рот",        category: "Тело",          emoji: "👄" },
  { buryat: "шэхэн",      russian: "ухо",        category: "Тело",          emoji: "👂" },
  { buryat: "гар",        russian: "рука",       category: "Тело",          emoji: "🤚" },
  { buryat: "хүл",        russian: "нога",       category: "Тело",          emoji: "🦵" },
  { buryat: "зүрхэн",     russian: "сердце",     category: "Тело",          emoji: "❤️" },
  // Погода
  { buryat: "хүйтэн",     russian: "холодно",    category: "Погода",        emoji: "🥶" },
  { buryat: "дулаан",     russian: "тепло",      category: "Погода",        emoji: "🌡️" },
  { buryat: "саhан",      russian: "снег",       category: "Погода",        emoji: "❄️" },
  { buryat: "бороо",      russian: "дождь",      category: "Погода",        emoji: "🌧️" },
  { buryat: "нартай",     russian: "солнечно",   category: "Погода",        emoji: "☀️" },
  { buryat: "үүлэн",      russian: "туча",       category: "Погода",        emoji: "☁️" },
  // Эмоции
  { buryat: "жаргалтай",  russian: "счастливый", category: "Эмоции",        emoji: "😊" },
  { buryat: "уйдхартай",  russian: "грустный",   category: "Эмоции",        emoji: "😢" },
  { buryat: "ууртай",     russian: "злой",       category: "Эмоции",        emoji: "😠" },
  { buryat: "гайхалтай",  russian: "удивлённый", category: "Эмоции",        emoji: "😲" },
  { buryat: "залхуу",     russian: "ленивый",    category: "Эмоции",        emoji: "😴" },
  // Время
  { buryat: "үглөө",      russian: "утро",       category: "Время",         emoji: "🌅" },
  { buryat: "үдэр",       russian: "день",       category: "Время",         emoji: "☀️" },
  { buryat: "үдэшэ",      russian: "вечер",      category: "Время",         emoji: "🌆" },
  { buryat: "hүни",       russian: "ночь",       category: "Время",         emoji: "🌙" },
  { buryat: "мүнөөдэр",   russian: "сегодня",    category: "Время",         emoji: "📅" },
  { buryat: "үглөөдэр",   russian: "завтра",     category: "Время",         emoji: "➡️" },
  // Прилагательные
  { buryat: "ехэ",        russian: "большой",    category: "Прилагательные", emoji: "🐘" },
  { buryat: "бишыхан",    russian: "маленький",  category: "Прилагательные", emoji: "🐭" },
  { buryat: "hайн",       russian: "хороший",    category: "Прилагательные", emoji: "👍" },
  { buryat: "муу",        russian: "плохой",     category: "Прилагательные", emoji: "👎" },
  { buryat: "шэнэ",       russian: "новый",      category: "Прилагательные", emoji: "✨" },
  { buryat: "түргэн",     russian: "быстрый",    category: "Прилагательные", emoji: "⚡" },
  { buryat: "удаан",      russian: "медленный",  category: "Прилагательные", emoji: "🐢" },
  { buryat: "үндэр",      russian: "высокий",    category: "Прилагательные", emoji: "🏔️" },
  { buryat: "хүндэ",      russian: "тяжёлый",   category: "Прилагательные", emoji: "🏋️" },
  { buryat: "хүнгэн",     russian: "лёгкий",    category: "Прилагательные", emoji: "🪶" },
  // Глаголы
  { buryat: "ябаха",      russian: "идти",       category: "Глаголы",       emoji: "🚶" },
  { buryat: "ерэхэ",      russian: "приходить",  category: "Глаголы",       emoji: "👋" },
  { buryat: "хэлэхэ",     russian: "говорить",   category: "Глаголы",       emoji: "💬" },
  { buryat: "мэдэхэ",     russian: "знать",      category: "Глаголы",       emoji: "🧠" },
  { buryat: "эдихэ",      russian: "кушать",     category: "Глаголы",       emoji: "🍽️" },
  { buryat: "ууха",       russian: "пить",       category: "Глаголы",       emoji: "🥤" },
  { buryat: "унтаха",     russian: "спать",      category: "Глаголы",       emoji: "😴" },
  { buryat: "харахa",     russian: "видеть",     category: "Глаголы",       emoji: "👀" },
  { buryat: "уншаха",     russian: "читать",     category: "Глаголы",       emoji: "📖" },
  { buryat: "бэшэхэ",     russian: "писать",     category: "Глаголы",       emoji: "✍️" },
  { buryat: "шадаха",     russian: "мочь, уметь", category: "Глаголы",      emoji: "💪" },
  { buryat: "хэхэ",       russian: "делать",     category: "Глаголы",       emoji: "🔨" },
  { buryat: "дурлаха",    russian: "любить",     category: "Глаголы",       emoji: "❤️" },
  { buryat: "хүсэхэ",     russian: "хотеть",     category: "Глаголы",       emoji: "🌟" },
  { buryat: "ойлгохо",    russian: "понимать",   category: "Глаголы",       emoji: "💡" },
  // Школа
  { buryat: "hургуули",   russian: "школа",      category: "Школа",         emoji: "🏫" },
  { buryat: "ном",        russian: "книга",      category: "Школа",         emoji: "📚" },
  { buryat: "дэбтэр",     russian: "тетрадь",    category: "Школа",         emoji: "📓" },
  { buryat: "багша",      russian: "учитель",    category: "Школа",         emoji: "👨‍🏫" },
  { buryat: "хэшээл",     russian: "урок",       category: "Школа",         emoji: "📝" },
  // Праздники и культура
  { buryat: "hайндэр",    russian: "праздник",   category: "Праздники",     emoji: "🎉" },
  { buryat: "бэлэг",      russian: "подарок",    category: "Праздники",     emoji: "🎁" },
  { buryat: "дуун",       russian: "песня",      category: "Культура",      emoji: "🎵" },
  { buryat: "хатар",      russian: "танец",      category: "Культура",      emoji: "💃" },
  { buryat: "хүгжэм",     russian: "музыка",     category: "Культура",      emoji: "🎶" },
  // Спорт
  { buryat: "барилдаан",  russian: "борьба",     category: "Спорт",         emoji: "🤼" },
  { buryat: "илалта",     russian: "победа",     category: "Спорт",         emoji: "🥇" },
  // Дом
  { buryat: "сонхо",      russian: "окно",       category: "Дом",           emoji: "🪟" },
  { buryat: "үүдэн",      russian: "дверь",      category: "Дом",           emoji: "🚪" },
  { buryat: "орон",       russian: "кровать",    category: "Дом",           emoji: "🛏️" },
  // Вопросы
  { buryat: "хэн",        russian: "кто",        category: "Вопросы",       emoji: "👤" },
  { buryat: "юун",        russian: "что",        category: "Вопросы",       emoji: "🤔" },
  { buryat: "хаана",      russian: "где",        category: "Вопросы",       emoji: "📍" },
  { buryat: "хэзээ",      russian: "когда",      category: "Вопросы",       emoji: "🕐" },
  { buryat: "юундэ",      russian: "почему",     category: "Вопросы",       emoji: "❓" },
  { buryat: "ямар",       russian: "какой",      category: "Вопросы",       emoji: "🎯" },
  // Деньги
  { buryat: "мүнгэн",     russian: "деньги",     category: "Деньги",        emoji: "💰" },
  { buryat: "дэлгүүр",    russian: "магазин",    category: "Деньги",        emoji: "🛒" },
];

export default function WordOfDay() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const word = WORD_POOL[dayIndex % WORD_POOL.length];

  const dateStr = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  return (
    <div className="px-4 pt-4 pb-1 md:max-w-3xl md:mx-auto">
      <div
        className="wod-card relative overflow-hidden rounded-3xl px-5 py-4"
        style={{ boxShadow: "0 8px 32px -8px rgba(29,78,216,0.45)" }}
      >
        {/* SVG noise overlay */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none",
          }}
        >
          <filter id="wod-noise-f">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#wod-noise-f)" />
        </svg>

        {/* Header row */}
        <div className="relative flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
            Үдэрэй үгэ · Слово дня
          </p>
          <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            {dateStr}
          </p>
        </div>

        {/* Buryat word */}
        <p
          className="relative font-bold leading-tight mb-1"
          style={{ fontSize: "2.4rem", color: "white", fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {word.emoji} {word.buryat}
        </p>

        {/* Russian translation */}
        <p className="relative text-lg font-semibold mb-3" style={{ color: "rgba(255,255,255,0.88)" }}>
          {word.russian}
        </p>

        {/* Footer row */}
        <div className="relative flex items-center justify-between">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}
          >
            {word.category}
          </span>
          <Link
            href="/topics"
            className="text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Ещё слова
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
