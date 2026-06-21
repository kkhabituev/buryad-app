"use client";

import { useState } from "react";
import Link from "next/link";
import numbersData from "@/content/numbers.json";

type TopicTab =
  | "numbers" | "colors" | "animals" | "family" | "food" | "body"
  | "nature" | "weather" | "emotions" | "time"
  | "questions" | "adjectives" | "clothes" | "home" | "city"
  | "money" | "school" | "holidays" | "music" | "sport"
  | "v_movement" | "v_communication" | "v_life"
  | "v_perception" | "v_creative" | "v_routine" | "v_modal";

type NumberTab = "units" | "tens" | "large";

// ── Existing data (unchanged) ─────────────────────────────────────

const COLORS = [
  { ru: "красный",    buryat: "улаан",      hex: "#ef4444", light: false },
  { ru: "синий",      buryat: "хүхэ",       hex: "#1d4ed8", light: false },
  { ru: "зелёный",    buryat: "ногоон",     hex: "#16a34a", light: false },
  { ru: "жёлтый",     buryat: "шара",       hex: "#eab308", light: true  },
  { ru: "белый",      buryat: "сагаан",     hex: "#f1f5f9", light: true  },
  { ru: "чёрный",     buryat: "хара",       hex: "#1e293b", light: false },
  { ru: "оранжевый",  buryat: "улаан шара", hex: "#f97316", light: false },
  { ru: "розовый",    buryat: "ягаан",      hex: "#ec4899", light: false },
  { ru: "серый",      buryat: "боро",       hex: "#94a3b8", light: false },
  { ru: "голубой",    buryat: "сэнхир",     hex: "#38bdf8", light: true  },
  { ru: "коричневый", buryat: "хүрин",      hex: "#92400e", light: false },
];

const ANIMALS = [
  { ru: "медведь", buryat: "баабгай",     emoji: "🐻", from: "#d97706", to: "#7c2d12" },
  { ru: "волк",    buryat: "шоно",        emoji: "🐺", from: "#64748b", to: "#1e293b" },
  { ru: "лиса",    buryat: "үнэгэн",      emoji: "🦊", from: "#fb923c", to: "#c2410c" },
  { ru: "лошадь",  buryat: "морин",       emoji: "🐴", from: "#a16207", to: "#713f12" },
  { ru: "собака",  buryat: "нохой",       emoji: "🐶", from: "#fbbf24", to: "#b45309" },
  { ru: "рыба",    buryat: "загаhан",     emoji: "🐟", from: "#22d3ee", to: "#0369a1" },
  { ru: "птица",   buryat: "шубуун",      emoji: "🐦", from: "#60a5fa", to: "#1d4ed8" },
  { ru: "заяц",    buryat: "шандаган",    emoji: "🐰", from: "#f9a8d4", to: "#be185d" },
  { ru: "корова",  buryat: "үнеэн",       emoji: "🐄", from: "#94a3b8", to: "#334155" },
  { ru: "орёл",    buryat: "бүргэд",      emoji: "🦅", from: "#fbbf24", to: "#92400e" },
  { ru: "кошка",   buryat: "эмэ миисгэй", emoji: "🐱", from: "#c084fc", to: "#6d28d9" },
  { ru: "олень",   buryat: "оро",         emoji: "🦌", from: "#4ade80", to: "#15803d" },
];

const FAMILY = [
  { ru: "мама",           buryat: "эжы",         emoji: "👩" },
  { ru: "папа",           buryat: "аба",          emoji: "👨" },
  { ru: "бабушка",        buryat: "хүгшэн эжы",  emoji: "👵" },
  { ru: "дедушка",        buryat: "хүгшэн аба",  emoji: "👴" },
  { ru: "старший брат",   buryat: "аха",          emoji: "🧑" },
  { ru: "старшая сестра", buryat: "эгэшэ",        emoji: "👧" },
  { ru: "младший / -ая",  buryat: "дүү",          emoji: "👶" },
  { ru: "сын",            buryat: "хүбүүн",       emoji: "🧒" },
  { ru: "дочь",           buryat: "басаган",      emoji: "🎀" },
  { ru: "муж",            buryat: "үбгэн",        emoji: "🤵" },
  { ru: "жена",           buryat: "hамган",       emoji: "👰" },
];

const FOOD = [
  { ru: "буузы",         buryat: "буузэ",      emoji: "🥟", buryat_dish: true  },
  { ru: "хуушуур",       buryat: "хуушуур",    emoji: "🥙", buryat_dish: true  },
  { ru: "суп",           buryat: "шүлэн",      emoji: "🍲", buryat_dish: false },
  { ru: "чай с молоком", buryat: "сагаан сай", emoji: "🍵", buryat_dish: true  },
  { ru: "мясо",          buryat: "мяхан",      emoji: "🥩", buryat_dish: false },
  { ru: "хлеб",          buryat: "хилээмэн",   emoji: "🍞", buryat_dish: false },
  { ru: "вода",          buryat: "уhан",       emoji: "💧", buryat_dish: false },
  { ru: "молоко",        buryat: "hүн",        emoji: "🥛", buryat_dish: false },
];

const BODY = [
  { ru: "голова", buryat: "толгой",   emoji: "🗣️" },
  { ru: "глаз",   buryat: "нюдэн",   emoji: "👁️" },
  { ru: "нос",    buryat: "хамар",   emoji: "👃" },
  { ru: "рот",    buryat: "аман",    emoji: "👄" },
  { ru: "ухо",    buryat: "шэхэн",   emoji: "👂" },
  { ru: "рука",   buryat: "гар",     emoji: "🤚" },
  { ru: "нога",   buryat: "хүл",     emoji: "🦵" },
  { ru: "спина",  buryat: "нюрган",  emoji: "🦴" },
  { ru: "живот",  buryat: "гэдэhэн", emoji: "🫃" },
  { ru: "сердце", buryat: "зүрхэн",  emoji: "❤️" },
];

const NATURE = [
  { ru: "Байкал", buryat: "Байгал нуур", emoji: "🌊", from: "#0ea5e9", to: "#0369a1" },
  { ru: "озеро",  buryat: "нуур",        emoji: "🏞️", from: "#38bdf8", to: "#0284c7" },
  { ru: "река",   buryat: "гол",         emoji: "🏔️", from: "#22d3ee", to: "#0891b2" },
  { ru: "гора",   buryat: "хада",        emoji: "⛰️", from: "#94a3b8", to: "#475569" },
  { ru: "степь",  buryat: "тала",        emoji: "🌾", from: "#fbbf24", to: "#d97706" },
  { ru: "лес",    buryat: "ой",          emoji: "🌲", from: "#22c55e", to: "#15803d" },
  { ru: "небо",   buryat: "тэнгэри",     emoji: "🌌", from: "#818cf8", to: "#4338ca" },
  { ru: "солнце", buryat: "наран",       emoji: "☀️", from: "#fbbf24", to: "#f59e0b" },
  { ru: "луна",   buryat: "hара",        emoji: "🌙", from: "#94a3b8", to: "#1e293b" },
  { ru: "звезда", buryat: "одон",        emoji: "⭐", from: "#c084fc", to: "#6d28d9" },
];

const WEATHER = [
  { ru: "холодно",  buryat: "хүйтэн",  emoji: "🥶", from: "#bfdbfe", to: "#3b82f6" },
  { ru: "тепло",    buryat: "дулаан",  emoji: "🌡️", from: "#fde68a", to: "#f59e0b" },
  { ru: "снег",     buryat: "саhан",   emoji: "❄️", from: "#e0f2fe", to: "#7dd3fc" },
  { ru: "дождь",    buryat: "бороо",   emoji: "🌧️", from: "#93c5fd", to: "#3b82f6" },
  { ru: "ветер",    buryat: "hалхин",  emoji: "💨", from: "#d1d5db", to: "#6b7280" },
  { ru: "солнечно", buryat: "нартай",  emoji: "☀️", from: "#fef08a", to: "#fbbf24" },
  { ru: "туча",     buryat: "үүлэн",   emoji: "☁️", from: "#d1d5db", to: "#9ca3af" },
];

const EMOTIONS = [
  { ru: "счастливый", buryat: "жаргалтай", emoji: "😊", bg: "#fef9c3", border: "#fde68a" },
  { ru: "грустный",   buryat: "уйдхартай", emoji: "😢", bg: "#dbeafe", border: "#93c5fd" },
  { ru: "злой",       buryat: "ууртай",     emoji: "😠", bg: "#fee2e2", border: "#fca5a5" },
  { ru: "удивлённый", buryat: "гайхалтай", emoji: "😲", bg: "#f3e8ff", border: "#d8b4fe" },
  { ru: "испуганный", buryat: "айhан",      emoji: "😨", bg: "#fed7aa", border: "#fb923c" },
  { ru: "ленивый",    buryat: "залхуу",    emoji: "😴", bg: "#e2e8f0", border: "#94a3b8" },
];

const TIME_OF_DAY = [
  { ru: "утро",  buryat: "үглөө", emoji: "🌅", from: "#fde68a", to: "#fb923c", textLight: false },
  { ru: "день",  buryat: "үдэр",  emoji: "☀️", from: "#7dd3fc", to: "#3b82f6", textLight: true  },
  { ru: "вечер", buryat: "үдэшэ", emoji: "🌆", from: "#c084fc", to: "#7c3aed", textLight: true  },
  { ru: "ночь",  buryat: "hүни",  emoji: "🌙", from: "#1e3a5f", to: "#0f172a", textLight: true  },
];
const TIME_OTHER = [
  { ru: "сегодня", buryat: "мүнөөдэр",    emoji: "📅" },
  { ru: "завтра",  buryat: "үглөөдэр",    emoji: "➡️" },
  { ru: "вчера",   buryat: "үсэгэлдэр",   emoji: "⬅️" },
  { ru: "неделя",  buryat: "долоон хоног", emoji: "🗓️" },
  { ru: "год",     buryat: "жэл",          emoji: "🎊" },
];

// ── New noun / adjective data ─────────────────────────────────────

const QUESTIONS = [
  { ru: "кто",     buryat: "хэн",   emoji: "👤" },
  { ru: "что",     buryat: "юун",   emoji: "🤔" },
  { ru: "где",     buryat: "хаана", emoji: "📍" },
  { ru: "когда",   buryat: "хэзээ", emoji: "🕐" },
  { ru: "почему",  buryat: "юундэ", emoji: "❓" },
  { ru: "сколько", buryat: "хэды",  emoji: "🔢" },
  { ru: "какой",   buryat: "ямар",  emoji: "🎯" },
];

const ADJECTIVES = [
  { ru: "большой",   buryat: "ехэ",     emoji: "🐘", bg: "#eff6ff", border: "#bfdbfe" },
  { ru: "маленький", buryat: "бишыхан", emoji: "🐭", bg: "#f0fdf4", border: "#bbf7d0" },
  { ru: "хороший",   buryat: "hайн",    emoji: "👍", bg: "#f0fdf4", border: "#bbf7d0" },
  { ru: "плохой",    buryat: "муу",     emoji: "👎", bg: "#fef2f2", border: "#fecaca" },
  { ru: "новый",     buryat: "шэнэ",    emoji: "✨", bg: "#f0f9ff", border: "#bae6fd" },
  { ru: "старый",    buryat: "үтэлhэн", emoji: "🏛️", bg: "#fefce8", border: "#fde68a" },
  { ru: "быстрый",   buryat: "түргэн",  emoji: "⚡", bg: "#fefce8", border: "#fde68a" },
  { ru: "медленный", buryat: "удаан",   emoji: "🐢", bg: "#f0fdf4", border: "#bbf7d0" },
  { ru: "высокий",   buryat: "үндэр",   emoji: "🏔️", bg: "#eff6ff", border: "#bfdbfe" },
  { ru: "низкий",    buryat: "набтар",  emoji: "📉", bg: "#f8fafc", border: "#e2e8f0" },
  { ru: "длинный",   buryat: "үта",     emoji: "📏", bg: "#eff6ff", border: "#bfdbfe" },
  { ru: "короткий",  buryat: "богони",  emoji: "📐", bg: "#f8fafc", border: "#e2e8f0" },
  { ru: "тяжёлый",   buryat: "хүндэ",  emoji: "🏋️", bg: "#fef2f2", border: "#fecaca" },
  { ru: "лёгкий",    buryat: "хүнгэн", emoji: "🪶", bg: "#f0f9ff", border: "#bae6fd" },
  { ru: "дорогой",   buryat: "үнэтэй", emoji: "💎", bg: "#fdf4ff", border: "#e9d5ff" },
  { ru: "дешёвый",   buryat: "үнэгүй", emoji: "🏷️", bg: "#f0fdf4", border: "#bbf7d0" },
];

const CLOTHES = [
  { ru: "рубашка", buryat: "самса",   emoji: "👔" },
  { ru: "халат",   buryat: "халаад",  emoji: "🥻" },
  { ru: "шапка",   buryat: "малгай",  emoji: "🧢" },
  { ru: "сапоги",  buryat: "сабхи",   emoji: "👢" },
  { ru: "платье",  buryat: "плати",   emoji: "👗" },
  { ru: "пальто",  buryat: "пальто",  emoji: "🧥" },
  { ru: "пояс",    buryat: "бүhэ",    emoji: "🎗️" },
];

const HOME_ITEMS = [
  { ru: "стол",    buryat: "стол",   emoji: "🪑" },
  { ru: "стул",    buryat: "стул",   emoji: "🪑" },
  { ru: "окно",    buryat: "сонхо",  emoji: "🪟" },
  { ru: "дверь",   buryat: "үүдэн",  emoji: "🚪" },
  { ru: "кровать", buryat: "орон",   emoji: "🛏️" },
  { ru: "шкаф",    buryat: "шкаф",   emoji: "🗄️" },
  { ru: "лампа",   buryat: "лаампа", emoji: "💡" },
];

const CITY = [
  { ru: "улица",   buryat: "үйлсэ",        emoji: "🏘️" },
  { ru: "магазин", buryat: "магазин",       emoji: "🏪" },
  { ru: "направо", buryat: "баруун тээшэ", emoji: "➡️" },
  { ru: "налево",  buryat: "зүүн тээшэ",   emoji: "⬅️" },
  { ru: "прямо",   buryat: "сэхэ",          emoji: "⬆️" },
  { ru: "рынок",   buryat: "дэлгүүр",      emoji: "🛒" },
  { ru: "дорога",  buryat: "харгы",         emoji: "🛣️" },
];

const MONEY = [
  { ru: "деньги", buryat: "мүнгэн",      emoji: "💰" },
  { ru: "цена",   buryat: "сэн",          emoji: "🏷️" },
  { ru: "дорого", buryat: "үнэтэй",      emoji: "💎" },
  { ru: "дёшево", buryat: "үнэгүйгөөр", emoji: "🎁" },
  { ru: "рынок",  buryat: "дэлгүүр",    emoji: "🛒" },
  { ru: "монета", buryat: "монетэ",      emoji: "🪙" },
];

const SCHOOL = [
  { ru: "школа",    buryat: "hургуули",   emoji: "🏫" },
  { ru: "книга",    buryat: "ном",         emoji: "📚" },
  { ru: "тетрадь",  buryat: "дэбтэр",     emoji: "📓" },
  { ru: "карандаш", buryat: "харандааш",  emoji: "✏️" },
  { ru: "учитель",  buryat: "багша",       emoji: "👨‍🏫" },
  { ru: "ученик",   buryat: "hурагша",    emoji: "🧑‍🎓" },
  { ru: "урок",     buryat: "хэшээл",     emoji: "📝" },
  { ru: "экзамен",  buryat: "шалгалта",   emoji: "📊" },
];

const HOLIDAYS = [
  { ru: "праздник", buryat: "hайндэр", emoji: "🎉", bg: "#fdf4ff", border: "#e9d5ff" },
  { ru: "подарок",  buryat: "бэлэг",   emoji: "🎁", bg: "#fef9c3", border: "#fde68a" },
  { ru: "гость",    buryat: "айлшан",  emoji: "🤝", bg: "#f0fdf4", border: "#bbf7d0" },
];

const MUSIC = [
  { ru: "песня",      buryat: "дуун",   emoji: "🎵", from: "#7c3aed", to: "#6d28d9" },
  { ru: "танец",      buryat: "хатар",  emoji: "💃", from: "#ec4899", to: "#be185d" },
  { ru: "музыка",     buryat: "хүгжэм", emoji: "🎶", from: "#0891b2", to: "#0e7490" },
  { ru: "рисунок",    buryat: "зураг",  emoji: "🎨", from: "#f97316", to: "#c2410c" },
  { ru: "инструмент", buryat: "зэмсэг", emoji: "🎸", from: "#059669", to: "#065f46" },
];

const SPORT = [
  { ru: "борьба",       buryat: "барилдаан",       emoji: "🤼", from: "#dc2626", to: "#7f1d1d" },
  { ru: "стрельба",     buryat: "буудалган",        emoji: "🎯", from: "#d97706", to: "#713f12" },
  { ru: "скачки",       buryat: "мориной урилдаан", emoji: "🏇", from: "#7c3aed", to: "#4c1d95" },
  { ru: "спортсмен",    buryat: "спортсмен",         emoji: "🏆", from: "#0891b2", to: "#0e7490" },
  { ru: "победа",       buryat: "илалта",            emoji: "🥇", from: "#f59e0b", to: "#b45309" },
  { ru: "соревнование", buryat: "мүрысөөн",         emoji: "⚔️", from: "#64748b", to: "#1e293b" },
];

// ── Verb data ─────────────────────────────────────────────────────

const V_MOVEMENT = [
  { buryat: "ябаха",    ru: "ходить, идти",          emoji: "🚶" },
  { buryat: "ерэхэ",    ru: "приходить",              emoji: "👋" },
  { buryat: "ошохо",    ru: "уходить, уезжать",       emoji: "🚪" },
  { buryat: "гүйхэ",    ru: "бежать",                 emoji: "🏃" },
  { buryat: "hуухa",    ru: "сидеть, садиться",       emoji: "🪑" },
  { buryat: "зогсохо",  ru: "стоять, остановиться",   emoji: "🛑" },
  { buryat: "абаха",    ru: "брать, взять",           emoji: "🤲" },
  { buryat: "үгэхэ",    ru: "давать, отдавать",       emoji: "🎁" },
  { buryat: "олохо",    ru: "находить",               emoji: "🔍" },
  { buryat: "хүлеэхэ",  ru: "ждать, ожидать",         emoji: "⏳" },
];

const V_COMMUNICATION = [
  { buryat: "хэлэхэ",    ru: "говорить, сказать",  emoji: "💬" },
  { buryat: "асуухa",    ru: "спрашивать",          emoji: "❓" },
  { buryat: "харюусаха", ru: "отвечать",            emoji: "💡" },
  { buryat: "мэдэхэ",   ru: "знать",               emoji: "🧠" },
  { buryat: "дуулаха",  ru: "петь; слышать",        emoji: "🎵" },
  { buryat: "харахa",   ru: "видеть, смотреть",     emoji: "👀" },
  { buryat: "уншаха",   ru: "читать",               emoji: "📖" },
  { buryat: "бэшэхэ",   ru: "писать",               emoji: "✍️" },
  { buryat: "шадаха",   ru: "мочь, уметь",          emoji: "💪" },
  { buryat: "хэхэ",     ru: "делать",               emoji: "🔨" },
];

const V_LIFE = [
  { buryat: "эдихэ",   ru: "кушать, есть",  emoji: "🍽️" },
  { buryat: "ууха",    ru: "пить",           emoji: "🥤" },
  { buryat: "унтаха",  ru: "спать",          emoji: "😴" },
  { buryat: "наадаха", ru: "играть",         emoji: "🎮" },
  { buryat: "нээхэ",   ru: "открывать",      emoji: "🔓" },
  { buryat: "хааха",   ru: "закрывать",      emoji: "🔒" },
];

const V_PERCEPTION = [
  { buryat: "дуулаха",    ru: "слышать",          emoji: "👂" },
  { buryat: "дурлаха",    ru: "любить",            emoji: "❤️" },
  { buryat: "хүсэхэ",     ru: "хотеть, желать",   emoji: "🌟" },
  { buryat: "үнэншэхэ",   ru: "верить",            emoji: "🙏" },
  { buryat: "шэбшэхэ",    ru: "думать",            emoji: "🤔" },
  { buryat: "ойлгохо",    ru: "понимать, понять",  emoji: "💡" },
];

const V_CREATIVE = [
  { buryat: "зураха",  ru: "рисовать",  emoji: "🎨" },
  { buryat: "уулаха",  ru: "петь",      emoji: "🎤" },
  { buryat: "бэшэхэ",  ru: "писать",    emoji: "✍️" },
  { buryat: "уншаха",  ru: "читать",    emoji: "📖" },
  { buryat: "бэдэрхэ", ru: "искать",    emoji: "🔍" },
  { buryat: "шэбшэхэ", ru: "думать",    emoji: "🤔" },
];

const V_ROUTINE = [
  { buryat: "бэеэ угааха", ru: "мыться",       emoji: "🚿" },
  { buryat: "хүдэлхэ",     ru: "работать",     emoji: "💼" },
  { buryat: "унтаха",      ru: "спать",         emoji: "😴" },
  { buryat: "сэнгэхэ",     ru: "гулять",        emoji: "🌸" },
  { buryat: "hураха",      ru: "учиться",       emoji: "📚" },
  { buryat: "бэлдэхэ",     ru: "готовить",      emoji: "🍳" },
];

const V_MODAL = [
  { buryat: "шадаха",    ru: "мочь, уметь", emoji: "💪" },
  { buryat: "хүсэхэ",    ru: "хотеть",       emoji: "🌟" },
  { buryat: "үритэй",   ru: "должен",        emoji: "📌" },
  { buryat: "хэрэгтэй", ru: "нужно",         emoji: "❗" },
  { buryat: "болохо",   ru: "можно",          emoji: "✅" },
];

// Verbs that have conjugation tables in /grammar
const HAS_CONJUGATION = new Set(["ябаха", "эдихэ", "уншаха"]);

// ── Navigation groups ─────────────────────────────────────────────

const TOPIC_GROUPS: { title: string; color: string; topics: { id: TopicTab; label: string; emoji: string }[] }[] = [
  {
    title: "Люди и отношения",
    color: "#f59e0b",
    topics: [
      { id: "family",   label: "Семья",   emoji: "👨‍👩‍👧" },
      { id: "emotions", label: "Эмоции",  emoji: "😊" },
    ],
  },
  {
    title: "Мир вокруг",
    color: "#22c55e",
    topics: [
      { id: "nature",  label: "Природа",  emoji: "🌿" },
      { id: "weather", label: "Погода",   emoji: "🌤️" },
      { id: "animals", label: "Животные", emoji: "🐾" },
    ],
  },
  {
    title: "Тело и быт",
    color: "#f97316",
    topics: [
      { id: "body",    label: "Тело",      emoji: "💪" },
      { id: "food",    label: "Еда",       emoji: "🍖" },
      { id: "time",    label: "Время",     emoji: "⏰" },
      { id: "home",    label: "Дом и быт", emoji: "🏠" },
      { id: "clothes", label: "Одежда",    emoji: "👗" },
    ],
  },
  {
    title: "Язык в действии",
    color: "#1d4ed8",
    topics: [
      { id: "questions",  label: "Вопросительные слова", emoji: "❓" },
      { id: "adjectives", label: "Прилагательные",       emoji: "🎯" },
      { id: "numbers",    label: "Числа",                emoji: "🔢" },
    ],
  },
  {
    title: "Город и общество",
    color: "#0891b2",
    topics: [
      { id: "city",   label: "Город и направления", emoji: "🏙️" },
      { id: "money",  label: "Деньги и покупки",    emoji: "💰" },
      { id: "school", label: "Школа и учёба",       emoji: "📚" },
    ],
  },
  {
    title: "Культура",
    color: "#7c3aed",
    topics: [
      { id: "holidays", label: "Праздники",          emoji: "🎉" },
      { id: "music",    label: "Музыка и творчество", emoji: "🎵" },
      { id: "sport",    label: "Спорт",              emoji: "🏆" },
    ],
  },
  {
    title: "Глаголы",
    color: "#059669",
    topics: [
      { id: "v_movement",      label: "Движение и действие",    emoji: "🏃" },
      { id: "v_communication", label: "Общение и знание",       emoji: "💬" },
      { id: "v_life",          label: "Быт и повседневность",   emoji: "🍽️" },
      { id: "v_perception",    label: "Восприятие и чувства",   emoji: "❤️" },
      { id: "v_creative",      label: "Творчество",             emoji: "🎨" },
      { id: "v_routine",       label: "Рутина",                 emoji: "🌅" },
      { id: "v_modal",         label: "Модальные конструкции",  emoji: "💭" },
    ],
  },
];

// ── Helper components ─────────────────────────────────────────────

interface NumberRow { number: number; buryat: string; variants?: string[] }
function NumberList({ items }: { items: NumberRow[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
      {items.map((n, i) => (
        <div key={n.number} className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}>
            <span className="font-bold" style={{
              fontSize: n.number >= 100 ? "0.85rem" : n.number >= 10 ? "1.2rem" : "1.6rem",
              color: "#1d4ed8", fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1,
            }}>{n.number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight" style={{ fontSize: "1.05rem", color: "#0f172a" }}>{n.buryat}</p>
            {n.variants && n.variants.length > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>также: {n.variants.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SimpleList({ items }: { items: { ru: string; buryat: string; emoji: string }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
      {items.map((item, i) => (
        <div key={item.ru} className="flex items-center gap-3 px-4 py-3"
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
          <span style={{ fontSize: "1.6rem", lineHeight: 1, width: 36, textAlign: "center" as const }}>{item.emoji}</span>
          <div className="flex-1">
            <p className="font-bold" style={{ color: "#0f172a" }}>{item.buryat}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: "#64748b" }}>{item.ru}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerbList({ verbs }: { verbs: { buryat: string; ru: string; emoji: string }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
      {verbs.map((v, i) => (
        <div key={`${v.buryat}-${i}`} className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
          <span style={{ fontSize: "1.5rem", lineHeight: 1, width: 32, textAlign: "center" as const }}>{v.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold" style={{ color: "#0f172a" }}>{v.buryat}</p>
              {HAS_CONJUGATION.has(v.buryat) && (
                <Link href="/grammar"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 active:scale-95 transition-all"
                  style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                  Спряжение →
                </Link>
              )}
            </div>
            <p className="text-xs font-semibold mt-0.5" style={{ color: "#64748b" }}>{v.ru}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function TopicsPage() {
  const [topicTab, setTopicTab] = useState<TopicTab | null>(null);
  const [numberTab, setNumberTab] = useState<NumberTab>("units");
  const [wiggleKey, setWiggleKey] = useState<string>("");

  const triggerWiggle = (key: string) => {
    setWiggleKey(key);
    setTimeout(() => setWiggleKey(""), 500);
  };

  const currentTopic = topicTab
    ? TOPIC_GROUPS.flatMap((g) => g.topics).find((t) => t.id === topicTab)
    : null;

  return (
    <div style={{ background: "#f8faff", minHeight: "100dvh" }}>

      {/* Header */}
      <div className="px-5 pb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #1e3a5f 0%, #1d4ed8 100%)", paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}>
        <div className="absolute" style={{ top: -30, right: -20, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)" }} />
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Үгын бүлэгүүд</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>Подборки</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>26 тематических коллекций</p>
      </div>

      {/* Back button (when topic selected) */}
      {topicTab !== null && (
        <div className="sticky top-0 z-10 px-4 py-2.5 flex items-center gap-2"
          style={{ background: "rgba(248,250,255,0.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
          <button
            onClick={() => setTopicTab(null)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 active:scale-95 transition-all text-sm font-bold"
            style={{ background: "#f1f5f9", color: "#1d4ed8", border: "none", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Подборки
          </button>
          {currentTopic && (
            <span className="text-sm font-bold truncate" style={{ color: "#64748b" }}>
              {currentTopic.emoji} {currentTopic.label}
            </span>
          )}
        </div>
      )}

      {/* ── GROUP SELECTOR ──────────────────────────────────────── */}
      {topicTab === null && (
        <div className="px-4 pt-4 pb-24 page-enter">
          {TOPIC_GROUPS.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-2.5"
                style={{ color: group.color }}>
                {group.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setTopicTab(topic.id)}
                    className="transition-all duration-200 active:scale-95"
                    style={{
                      padding: "8px 14px", borderRadius: 999,
                      fontSize: "0.8rem", fontWeight: 700,
                      background: "white", color: "#374151",
                      border: "1.5px solid #e2e8f0",
                      cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                    {topic.emoji} {topic.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ЧИСЛА ──────────────────────────────────────────────── */}
      {topicTab === "numbers" && (
        <div>
          <div className="px-4 pt-3 flex gap-2">
            {(["units", "tens", "large"] as NumberTab[]).map((id, i) => {
              const labels = ["1 – 10", "Десятки", "Крупные"];
              return (
                <button key={id} onClick={() => setNumberTab(id)}
                  className="flex-1 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={{ background: numberTab === id ? "#1e3a5f" : "#e2e8f0", color: numberTab === id ? "white" : "#64748b" }}>
                  {labels[i]}
                </button>
              );
            })}
          </div>
          <div className="px-4 pt-3 pb-8">
            {numberTab === "units" && <NumberList items={numbersData.units.map((n) => ({ number: n.number, buryat: n.buryat, variants: (n as { variants?: string[] }).variants }))} />}
            {numberTab === "tens" && <NumberList items={numbersData.tens.map((n) => ({ number: n.number, buryat: n.buryat, variants: (n as { variants?: string[] }).variants }))} />}
            {numberTab === "large" && (
              <div>
                <NumberList items={numbersData.large.map((n) => ({ number: n.number, buryat: n.buryat }))} />
                <div className="mt-4 rounded-2xl p-4" style={{ background: "#1e3a5f" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#fbbf24" }}>Составные числа</p>
                  <p className="text-sm text-white leading-relaxed">{numbersData.compound_rule}</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mt-5 mb-3" style={{ color: "#94a3b8" }}>Примеры</p>
                <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0", background: "white" }}>
                  {numbersData.examples.map((ex, i) => (
                    <div key={ex.number} className="flex items-center justify-between px-5 py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                      <span className="text-xl font-bold" style={{ color: "#1d4ed8", fontFamily: '"Playfair Display", Georgia, serif' }}>{ex.number}</span>
                      <span className="text-base font-bold" style={{ color: "#0f172a" }}>{ex.buryat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: "2px solid #e2e8f0" }}>
              <div className="px-4 py-3" style={{ background: "#1d4ed8" }}>
                <p className="text-sm font-bold text-white">🎂 Как спросить возраст?</p>
              </div>
              {numbersData.age_phrases.map((phrase, i) => (
                <div key={i} className="px-4 py-3"
                  style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                  <p className="font-bold" style={{ color: "#1e3a5f" }}>{phrase.buryat}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>{phrase.russian}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ЦВЕТА ──────────────────────────────────────────────── */}
      {topicTab === "colors" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Үнгэнүүд — цвета по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map((c) => (
              <div key={c.ru} className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: c.light ? "1.5px solid #e2e8f0" : "none" }}>
                <div style={{ background: c.hex, height: 72 }} />
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{c.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{c.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#eff6ff", border: "1.5px solid #dbeafe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Запоминалка</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              «Улаан» — красный, как закат над Байкалом. «Хүхэ» — синий, как вода озера. «Сагаан» — белый, как снег Хамар-Дабана.
            </p>
          </div>
        </div>
      )}

      {/* ── ЖИВОТНЫЕ ───────────────────────────────────────────── */}
      {topicTab === "animals" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Амитад — животные по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {ANIMALS.map((a) => (
              <div key={a.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${a.from} 0%, ${a.to} 100%)`, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3.2rem", lineHeight: 1 }}>{a.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{a.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{a.ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── СЕМЬЯ ──────────────────────────────────────────────── */}
      {topicTab === "family" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Бүлэ — семья по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {FAMILY.map((f) => (
              <div key={f.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: "linear-gradient(145deg, #fef9ee 0%, #fef3c7 100%)", border: "1.5px solid #fde68a", boxShadow: "0 2px 12px rgba(251,191,36,0.12)" }}>
                <span style={{ fontSize: "2.5rem", lineHeight: 1, marginBottom: 8 }}>{f.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{f.buryat}</p>
                <p className="text-xs mt-1 font-semibold leading-snug" style={{ color: "#92400e" }}>{f.ru}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#92400e" }}>💡 Интересно</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              В бурятском «аха» — старший брат, «эгэшэ» — старшая сестра, а «дүү» — любой младший брат или сестра. Возраст важнее пола!
            </p>
          </div>
        </div>
      )}

      {/* ── ЕДА ────────────────────────────────────────────────── */}
      {topicTab === "food" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Эдеэн — еда по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {FOOD.map((f) => (
              <div key={f.ru} className="rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1.5px solid #f1f5f9" }}>
                <div style={{ background: f.buryat_dish ? "linear-gradient(140deg, #fef3c7, #fde68a)" : "linear-gradient(140deg, #f8faff, #f1f5f9)", height: 84, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{f.emoji}</span>
                  {f.buryat_dish && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#f97316", color: "white" }}>Бурятское</span>
                  )}
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{f.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{f.ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ТЕЛО ───────────────────────────────────────────────── */}
      {topicTab === "body" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Бэе — тело по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {BODY.map((b) => (
              <div key={b.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: "linear-gradient(145deg, #fff8f5 0%, #fde8d8 100%)", border: "1.5px solid #fed7aa", boxShadow: "0 2px 10px rgba(251,146,60,0.1)" }}>
                <span style={{ fontSize: "2.4rem", lineHeight: 1, marginBottom: 8 }}>{b.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{b.buryat}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: "#9a3412" }}>{b.ru}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ПРИРОДА ────────────────────────────────────────────── */}
      {topicTab === "nature" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Байгаали — природа по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {NATURE.map((n) => (
              <div key={n.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${n.from} 0%, ${n.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{n.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{n.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{n.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1.5px solid #a7f3d0" }}>
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>🌊 Байгал нуур</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#047857" }}>
              «Байгал» на бурятском — «богатое озеро». «Тэнгэри» (небо) в бурятской мифологии населено духами.
            </p>
          </div>
        </div>
      )}

      {/* ── ПОГОДА ─────────────────────────────────────────────── */}
      {topicTab === "weather" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Агаар — погода по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {WEATHER.map((w) => (
              <div key={w.ru}
                className={wiggleKey === w.ru ? "wiggle-anim" : ""}
                onClick={() => triggerWiggle(w.ru)}
                style={{ cursor: "pointer", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ background: `linear-gradient(140deg, ${w.from} 0%, ${w.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{w.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{w.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{w.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>Нажми на карточку ☝️</p>
        </div>
      )}

      {/* ── ЭМОЦИИ ─────────────────────────────────────────────── */}
      {topicTab === "emotions" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Мэдэрэл — эмоции по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {EMOTIONS.map((e) => (
              <div key={e.ru} className="rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ background: e.bg, border: `1.5px solid ${e.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 10 }}>{e.emoji}</span>
                <p className="text-base font-bold leading-tight" style={{ color: "#1e293b" }}>{e.buryat}</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: "#64748b" }}>{e.ru}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fef9c3", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#a16207" }}>💡 Суффикс -тай</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              Многие прилагательные-эмоции образуются суффиксом «-тай»: жаргал (счастье) → жаргал<b>тай</b> (счастливый).
            </p>
          </div>
        </div>
      )}

      {/* ── ВРЕМЯ ──────────────────────────────────────────────── */}
      {topicTab === "time" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Саг — время по-бурятски</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {TIME_OF_DAY.map((t) => (
              <div key={t.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                <div style={{ background: `linear-gradient(160deg, ${t.from} 0%, ${t.to} 100%)`, padding: "20px 12px 16px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {t.ru === "ночь" && (
                    <>
                      <span style={{ position: "absolute", top: 6, right: 10, fontSize: "0.6rem", opacity: 0.7 }}>✨</span>
                      <span style={{ position: "absolute", top: 12, left: 14, fontSize: "0.5rem", opacity: 0.5 }}>⭐</span>
                    </>
                  )}
                  <span style={{ fontSize: "3rem", lineHeight: 1, marginBottom: 10 }}>{t.emoji}</span>
                  <p className="text-xl font-bold text-center leading-tight" style={{ color: t.textLight ? "white" : "#1e293b" }}>{t.buryat}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: t.textLight ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)" }}>{t.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Другие слова о времени</p>
          <SimpleList items={TIME_OTHER} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1.5px solid #bae6fd" }}>
            <p className="text-sm font-bold" style={{ color: "#075985" }}>💡 Интересно</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#0369a1" }}>
              «Долоон хоног» (неделя) буквально — «семь ночей». «Үглөөдэр» (завтра) и «үглөө» (утро) — однокоренные!
            </p>
          </div>
        </div>
      )}

      {/* ── ВОПРОСИТЕЛЬНЫЕ СЛОВА ───────────────────────────────── */}
      {topicTab === "questions" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Асуудалай үгэнүүд — вопросительные слова</p>
          <SimpleList items={QUESTIONS} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Вопрос в конце</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              В бурятском вопросительная частица «гү» ставится в конце предложения: «Ши hайн гү?» — «Ты в порядке?»
            </p>
          </div>
        </div>
      )}

      {/* ── ПРИЛАГАТЕЛЬНЫЕ ─────────────────────────────────────── */}
      {topicTab === "adjectives" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Тэмдэгэй нэрэнүүд — прилагательные</p>
          <div className="grid grid-cols-2 gap-2.5">
            {ADJECTIVES.map((a) => (
              <div key={a.ru} className="rounded-2xl p-3 flex items-center gap-2.5"
                style={{ background: a.bg, border: `1.5px solid ${a.border}` }}>
                <span style={{ fontSize: "1.8rem", lineHeight: 1, flexShrink: 0 }}>{a.emoji}</span>
                <div className="min-w-0">
                  <p className="font-bold text-sm leading-tight" style={{ color: "#0f172a" }}>{a.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{a.ru}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ОДЕЖДА ─────────────────────────────────────────────── */}
      {topicTab === "clothes" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Хубсаhан — одежда по-бурятски</p>
          <SimpleList items={CLOTHES} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", border: "1.5px solid #ddd6fe" }}>
            <p className="text-sm font-bold" style={{ color: "#7c3aed" }}>💡 Бурятский халат</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6d28d9" }}>
              «Халаад» — традиционный бурятский халат-дэгэл. Важная часть национального костюма, носится на праздниках и церемониях.
            </p>
          </div>
        </div>
      )}

      {/* ── ДОМ И БЫТ ──────────────────────────────────────────── */}
      {topicTab === "home" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Гэр — дом по-бурятски</p>
          <SimpleList items={HOME_ITEMS} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#a16207" }}>💡 Гэр — юрта</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              «Гэр» по-бурятски — дом, а также традиционная юрта. Многие слова для мебели — русские заимствования, адаптированные в бурятский.
            </p>
          </div>
        </div>
      )}

      {/* ── ГОРОД И НАПРАВЛЕНИЯ ────────────────────────────────── */}
      {topicTab === "city" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Хото — город по-бурятски</p>
          <SimpleList items={CITY} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1.5px solid #bae6fd" }}>
            <p className="text-sm font-bold" style={{ color: "#0891b2" }}>💡 Стороны света</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#0369a1" }}>
              «Баруун» (правый, западный) и «зүүн» (левый, восточный) — используются и для направлений, и для сторон света.
            </p>
          </div>
        </div>
      )}

      {/* ── ДЕНЬГИ И ПОКУПКИ ───────────────────────────────────── */}
      {topicTab === "money" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Мүнгэн — деньги по-бурятски</p>
          <SimpleList items={MONEY} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fefce8, #fef9c3)", border: "1.5px solid #fde68a" }}>
            <p className="text-sm font-bold" style={{ color: "#a16207" }}>💡 Мүнгэн</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b45309" }}>
              «Мүнгэн» означает и «деньги», и «серебро» — ценный металл исторически был главным средством обмена.
            </p>
          </div>
        </div>
      )}

      {/* ── ШКОЛА И УЧЁБА ──────────────────────────────────────── */}
      {topicTab === "school" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>hургуули — школа по-бурятски</p>
          <SimpleList items={SCHOOL} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1.5px solid #bfdbfe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Багша</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              «Багша» (учитель) — слово тибетского происхождения, пришедшее через буддийскую традицию. Также означает «наставник» или «мастер».
            </p>
          </div>
        </div>
      )}

      {/* ── ПРАЗДНИКИ ──────────────────────────────────────────── */}
      {topicTab === "holidays" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>hайндэрнүүд — праздники по-бурятски</p>
          <div className="grid grid-cols-1 gap-3">
            {HOLIDAYS.map((h) => (
              <div key={h.ru} className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: h.bg, border: `1.5px solid ${h.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "2.8rem", lineHeight: 1, flexShrink: 0 }}>{h.emoji}</span>
                <div>
                  <p className="text-lg font-bold leading-tight" style={{ color: "#0f172a" }}>{h.buryat}</p>
                  <p className="text-sm mt-0.5 font-semibold" style={{ color: "#64748b" }}>{h.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", border: "1.5px solid #ddd6fe" }}>
            <p className="text-sm font-bold" style={{ color: "#7c3aed" }}>🎊 Сагаалган</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6d28d9" }}>
              Главный бурятский праздник — Сагаалган (Белый месяц, бурятский Новый год). Отмечается в конце января — феврале по лунному календарю.
            </p>
          </div>
        </div>
      )}

      {/* ── МУЗЫКА И ТВОРЧЕСТВО ────────────────────────────────── */}
      {topicTab === "music" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Хүгжэм — музыка по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {MUSIC.map((m) => (
              <div key={m.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${m.from} 0%, ${m.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{m.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{m.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{m.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", border: "1.5px solid #ddd6fe" }}>
            <p className="text-sm font-bold" style={{ color: "#7c3aed" }}>🎵 Дуун</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6d28d9" }}>
              Бурятская песня (дуун) — важная часть культуры. Традиционные жанры: улигеры (эпос) и дифирамбы (магтаал) в честь природы и предков.
            </p>
          </div>
        </div>
      )}

      {/* ── СПОРТ ──────────────────────────────────────────────── */}
      {topicTab === "sport" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Спорт — спорт по-бурятски</p>
          <div className="grid grid-cols-2 gap-3">
            {SPORT.map((s) => (
              <div key={s.ru} className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                <div style={{ background: `linear-gradient(140deg, ${s.from} 0%, ${s.to} 100%)`, height: 92, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "3rem", lineHeight: 1 }}>{s.emoji}</span>
                </div>
                <div className="px-3 py-2.5" style={{ background: "white" }}>
                  <p className="text-base font-bold leading-tight" style={{ color: "#0f172a" }}>{s.buryat}</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "#64748b" }}>{s.ru}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)", border: "1.5px solid #fecaca" }}>
            <p className="text-sm font-bold" style={{ color: "#991b1b" }}>🏆 Три игры нааданы</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#b91c1c" }}>
              Сурхарбан — главный спортивный праздник. Три традиционных вида: барилдаан (борьба), буудалган (стрельба), мориной урилдаан (скачки).
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — ДВИЖЕНИЕ ─────────────────────────────────── */}
      {topicTab === "v_movement" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Движение и действие</p>
          <VerbList verbs={V_MOVEMENT} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1.5px solid #a7f3d0" }}>
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>💡 Инфинитив на -ха / -хэ / -хо</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#047857" }}>
              Бурятский инфинитив: яба<b>ха</b> (идти), хүлеэ<b>хэ</b> (ждать), зогсо<b>хо</b> (стоять).
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — ОБЩЕНИЕ ──────────────────────────────────── */}
      {topicTab === "v_communication" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Общение и знание</p>
          <VerbList verbs={V_COMMUNICATION} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1.5px solid #bfdbfe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Дуулаха</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              «Дуулаха» означает и «петь», и «слышать» — в бурятском традиция передавать знания через песню неразделима с восприятием на слух.
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — БЫТ ──────────────────────────────────────── */}
      {topicTab === "v_life" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Быт и повседневность</p>
          <VerbList verbs={V_LIFE} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)", border: "1.5px solid #fed7aa" }}>
            <p className="text-sm font-bold" style={{ color: "#c2410c" }}>💡 Эдихэ</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#ea580c" }}>
              «Эдихэ» (кушать) — одно из ключевых слов в бурятском гостеприимстве. Угощение едой — знак уважения к гостю.
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — ВОСПРИЯТИЕ ───────────────────────────────── */}
      {topicTab === "v_perception" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Восприятие и чувства</p>
          <VerbList verbs={V_PERCEPTION} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fdf2f8, #fce7f3)", border: "1.5px solid #f9a8d4" }}>
            <p className="text-sm font-bold" style={{ color: "#9d174d" }}>💡 Дурлаха</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#be185d" }}>
              «Дурлаха» (любить) — глагол, описывающий романтическое чувство. Для любви к семье чаще используют «дуратай» (любить, быть расположенным).
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — ТВОРЧЕСТВО ───────────────────────────────── */}
      {topicTab === "v_creative" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Творчество</p>
          <VerbList verbs={V_CREATIVE} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", border: "1.5px solid #ddd6fe" }}>
            <p className="text-sm font-bold" style={{ color: "#7c3aed" }}>💡 Зураха</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6d28d9" }}>
              «Зураха» (рисовать) — от «зураг» (рисунок, рисунок). Слово охватывает и рисование, и создание узоров в традиционном искусстве.
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — РУТИНА ───────────────────────────────────── */}
      {topicTab === "v_routine" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Рутина</p>
          <VerbList verbs={V_ROUTINE} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", border: "1.5px solid #a7f3d0" }}>
            <p className="text-sm font-bold" style={{ color: "#065f46" }}>💡 hураха</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#047857" }}>
              «hураха» (учиться) — от того же корня, что «hургуули» (школа). Учёба в бурятской культуре всегда ценилась высоко.
            </p>
          </div>
        </div>
      )}

      {/* ── ГЛАГОЛЫ — МОДАЛЬНЫЕ ────────────────────────────────── */}
      {topicTab === "v_modal" && (
        <div className="px-4 pt-4 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Модальные конструкции</p>
          <VerbList verbs={V_MODAL} />
          <div className="mt-5 rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1.5px solid #bfdbfe" }}>
            <p className="text-sm font-bold" style={{ color: "#1d4ed8" }}>💡 Модальность в бурятском</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#3b82f6" }}>
              В бурятском «нельзя» — «болохогүй» (отрицание болохо). «Нужно» (хэрэгтэй) и «должен» (үритэй) — прилагательные-предикативы, а не глаголы.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wiggle {
          0%   { transform: rotate(0deg) scale(1); }
          20%  { transform: rotate(-12deg) scale(1.08); }
          40%  { transform: rotate(12deg) scale(1.08); }
          60%  { transform: rotate(-6deg) scale(1.04); }
          80%  { transform: rotate(4deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .wiggle-anim { animation: wiggle 0.5s ease; }
      `}</style>
    </div>
  );
}
