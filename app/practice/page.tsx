"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import pronounsData from "@/content/pronouns.json";
import numbersData from "@/content/numbers.json";
import verbsData from "@/content/verb-conjugations.json";

// ── Types ─────────────────────────────────────────────────────
interface FlashCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  emoji?: string;
  color?: string;
  colorLight?: boolean;
}
interface CardSet {
  id: string; title: string; subtitle: string;
  emoji: string; gradient: string; glow: string;
  group: string;
  cards: FlashCard[];
}
type Phase = "menu" | "mode_select" | "studying" | "quiz" | "done";
type PracticeMode = "learn" | "quiz";
type FlipDir = null | "right" | "left";

// ── Topic data ────────────────────────────────────────────────
const P_COLORS = [
  { buryat: "улаан",      ru: "красный",    hex: "#ef4444", light: false },
  { buryat: "хүхэ",       ru: "синий",      hex: "#1d4ed8", light: false },
  { buryat: "ногоон",     ru: "зелёный",    hex: "#16a34a", light: false },
  { buryat: "шара",       ru: "жёлтый",     hex: "#eab308", light: true  },
  { buryat: "сагаан",     ru: "белый",      hex: "#f1f5f9", light: true  },
  { buryat: "хара",       ru: "чёрный",     hex: "#1e293b", light: false },
  { buryat: "улаан шара", ru: "оранжевый",  hex: "#f97316", light: false },
  { buryat: "ягаан",      ru: "розовый",    hex: "#ec4899", light: false },
  { buryat: "боро",       ru: "серый",      hex: "#94a3b8", light: false },
  { buryat: "сэнхир",     ru: "голубой",    hex: "#38bdf8", light: true  },
  { buryat: "хүрин",      ru: "коричневый", hex: "#92400e", light: false },
];
const P_ANIMALS = [
  { buryat: "баабгай",      ru: "медведь", emoji: "🐻" },
  { buryat: "шоно",         ru: "волк",    emoji: "🐺" },
  { buryat: "үнэгэн",       ru: "лиса",    emoji: "🦊" },
  { buryat: "морин",        ru: "лошадь",  emoji: "🐴" },
  { buryat: "нохой",        ru: "собака",  emoji: "🐶" },
  { buryat: "загаhан",      ru: "рыба",    emoji: "🐟" },
  { buryat: "шубуун",       ru: "птица",   emoji: "🐦" },
  { buryat: "шандаган",     ru: "заяц",    emoji: "🐰" },
  { buryat: "үнеэн",        ru: "корова",  emoji: "🐄" },
  { buryat: "бүргэд",       ru: "орёл",    emoji: "🦅" },
  { buryat: "эмэ миисгэй",  ru: "кошка",   emoji: "🐱" },
  { buryat: "оро",          ru: "олень",   emoji: "🦌" },
];
const P_FAMILY = [
  { buryat: "эжы",         ru: "мама",           emoji: "👩" },
  { buryat: "аба",         ru: "папа",           emoji: "👨" },
  { buryat: "хүгшэн эжы",  ru: "бабушка",        emoji: "👵" },
  { buryat: "хүгшэн аба",  ru: "дедушка",        emoji: "👴" },
  { buryat: "аха",         ru: "старший брат",   emoji: "🧑" },
  { buryat: "эгэшэ",       ru: "старшая сестра", emoji: "👧" },
  { buryat: "дүү",         ru: "младший / -ая",  emoji: "👶" },
  { buryat: "хүбүүн",      ru: "сын",            emoji: "🧒" },
  { buryat: "басаган",     ru: "дочь",           emoji: "🎀" },
  { buryat: "үбгэн",       ru: "муж",            emoji: "🤵" },
  { buryat: "hамган",      ru: "жена",           emoji: "👰" },
];
const P_FOOD = [
  { buryat: "буузэ",      ru: "буузы",          emoji: "🥟" },
  { buryat: "хуушуур",    ru: "хуушуур",        emoji: "🥙" },
  { buryat: "шүлэн",      ru: "суп",            emoji: "🍲" },
  { buryat: "сагаан сай", ru: "чай с молоком",  emoji: "🍵" },
  { buryat: "мяхан",      ru: "мясо",           emoji: "🥩" },
  { buryat: "хилээмэн",   ru: "хлеб",           emoji: "🍞" },
  { buryat: "уhан",       ru: "вода",           emoji: "💧" },
  { buryat: "hүн",        ru: "молоко",         emoji: "🥛" },
];
const P_BODY = [
  { buryat: "толгой",  ru: "голова", emoji: "🗣️" },
  { buryat: "нюдэн",  ru: "глаз",   emoji: "👁️" },
  { buryat: "хамар",  ru: "нос",    emoji: "👃" },
  { buryat: "аман",   ru: "рот",    emoji: "👄" },
  { buryat: "шэхэн",  ru: "ухо",    emoji: "👂" },
  { buryat: "гар",    ru: "рука",   emoji: "🤚" },
  { buryat: "хүл",    ru: "нога",   emoji: "🦵" },
  { buryat: "нюрган", ru: "спина",  emoji: "🦴" },
  { buryat: "гэдэhэн",ru: "живот",  emoji: "🫃" },
  { buryat: "зүрхэн", ru: "сердце", emoji: "❤️" },
];
const P_NATURE = [
  { buryat: "Байгал нуур", ru: "Байкал",  emoji: "🌊" },
  { buryat: "нуур",        ru: "озеро",   emoji: "🏞️" },
  { buryat: "гол",         ru: "река",    emoji: "🌊" },
  { buryat: "хада",        ru: "гора",    emoji: "⛰️" },
  { buryat: "тала",        ru: "степь",   emoji: "🌾" },
  { buryat: "ой",          ru: "лес",     emoji: "🌲" },
  { buryat: "тэнгэри",     ru: "небо",    emoji: "🌌" },
  { buryat: "наран",       ru: "солнце",  emoji: "☀️" },
  { buryat: "hара",        ru: "луна",    emoji: "🌙" },
  { buryat: "одон",        ru: "звезда",  emoji: "⭐" },
];
const P_WEATHER = [
  { buryat: "хүйтэн", ru: "холодно",  emoji: "🥶" },
  { buryat: "дулаан", ru: "тепло",    emoji: "🌡️" },
  { buryat: "саhан",  ru: "снег",     emoji: "❄️" },
  { buryat: "бороо",  ru: "дождь",    emoji: "🌧️" },
  { buryat: "hалхин", ru: "ветер",    emoji: "💨" },
  { buryat: "нартай", ru: "солнечно", emoji: "☀️" },
  { buryat: "үүлэн",  ru: "туча",     emoji: "☁️" },
];
const P_EMOTIONS = [
  { buryat: "жаргалтай", ru: "счастливый", emoji: "😊" },
  { buryat: "уйдхартай", ru: "грустный",   emoji: "😢" },
  { buryat: "ууртай",    ru: "злой",       emoji: "😠" },
  { buryat: "гайхалтай", ru: "удивлённый", emoji: "😲" },
  { buryat: "айhан",     ru: "испуганный", emoji: "😨" },
  { buryat: "залхуу",    ru: "ленивый",    emoji: "😴" },
];
const P_TIME = [
  { buryat: "үглөө",       ru: "утро",    emoji: "🌅" },
  { buryat: "үдэр",        ru: "день",    emoji: "☀️" },
  { buryat: "үдэшэ",       ru: "вечер",   emoji: "🌆" },
  { buryat: "hүни",        ru: "ночь",    emoji: "🌙" },
  { buryat: "мүнөөдэр",    ru: "сегодня", emoji: "📅" },
  { buryat: "үглөөдэр",    ru: "завтра",  emoji: "➡️" },
  { buryat: "үсэгэлдэр",   ru: "вчера",   emoji: "⬅️" },
  { buryat: "долоон хоног", ru: "неделя",  emoji: "🗓️" },
  { buryat: "жэл",         ru: "год",     emoji: "🎊" },
];

const P_VERBS1 = [
  { buryat: "ябаха",    ru: "ходить, идти",         emoji: "🚶" },
  { buryat: "ерэхэ",    ru: "приходить",             emoji: "👋" },
  { buryat: "ошохо",    ru: "уходить, уезжать",      emoji: "🚪" },
  { buryat: "гүйхэ",    ru: "бежать",                emoji: "🏃" },
  { buryat: "hуухa",    ru: "сидеть, садиться",      emoji: "🪑" },
  { buryat: "зогсохо",  ru: "стоять, останавливаться",emoji: "🛑" },
  { buryat: "абаха",    ru: "брать, взять",          emoji: "🤲" },
  { buryat: "үгэхэ",    ru: "давать, отдавать",      emoji: "🎁" },
  { buryat: "олохо",    ru: "находить",              emoji: "🔍" },
  { buryat: "хүлеэхэ",  ru: "ждать, ожидать",        emoji: "⏳" },
];
const P_VERBS2 = [
  { buryat: "хэлэхэ",    ru: "говорить, сказать",   emoji: "💬" },
  { buryat: "асуухa",    ru: "спрашивать",           emoji: "❓" },
  { buryat: "харюусаха", ru: "отвечать",             emoji: "💡" },
  { buryat: "мэдэхэ",   ru: "знать",                emoji: "🧠" },
  { buryat: "дуулаха",  ru: "петь; слышать",         emoji: "🎵" },
  { buryat: "харахa",   ru: "видеть, смотреть",      emoji: "👀" },
  { buryat: "уншаха",   ru: "читать",                emoji: "📖" },
  { buryat: "бэшэхэ",   ru: "писать",                emoji: "✍️" },
  { buryat: "шадаха",   ru: "мочь, уметь",           emoji: "💪" },
  { buryat: "хэхэ",     ru: "делать",                emoji: "🔨" },
];
const P_VERBS3 = [
  { buryat: "эдихэ",   ru: "кушать, есть",   emoji: "🍽️" },
  { buryat: "ууха",    ru: "пить",            emoji: "🥤" },
  { buryat: "унтаха",  ru: "спать",           emoji: "😴" },
  { buryat: "наадаха", ru: "играть",          emoji: "🎮" },
  { buryat: "нээхэ",   ru: "открывать",       emoji: "🔓" },
  { buryat: "хааха",   ru: "закрывать",       emoji: "🔒" },
];

// ── New topic & phrase data ────────────────────────────────────
const P_QUESTIONS = [
  { buryat: "хэн",   ru: "кто",     emoji: "👤" },
  { buryat: "юун",   ru: "что",     emoji: "🤔" },
  { buryat: "хаана", ru: "где",     emoji: "📍" },
  { buryat: "хэзээ", ru: "когда",   emoji: "🕐" },
  { buryat: "юундэ", ru: "почему",  emoji: "❓" },
  { buryat: "хэды",  ru: "сколько", emoji: "🔢" },
  { buryat: "ямар",  ru: "какой",   emoji: "🎯" },
];
const P_ADJECTIVES = [
  { buryat: "ехэ",     ru: "большой",   emoji: "🐘" },
  { buryat: "бишыхан", ru: "маленький", emoji: "🐭" },
  { buryat: "hайн",    ru: "хороший",   emoji: "👍" },
  { buryat: "муу",     ru: "плохой",    emoji: "👎" },
  { buryat: "шэнэ",    ru: "новый",     emoji: "✨" },
  { buryat: "үтэлhэн", ru: "старый",    emoji: "🏛️" },
  { buryat: "түргэн",  ru: "быстрый",   emoji: "⚡" },
  { buryat: "удаан",   ru: "медленный", emoji: "🐢" },
  { buryat: "үндэр",   ru: "высокий",   emoji: "🏔️" },
  { buryat: "набтар",  ru: "низкий",    emoji: "📉" },
  { buryat: "үта",     ru: "длинный",   emoji: "📏" },
  { buryat: "богони",  ru: "короткий",  emoji: "📐" },
  { buryat: "хүндэ",   ru: "тяжёлый",  emoji: "🏋️" },
  { buryat: "хүнгэн",  ru: "лёгкий",   emoji: "🪶" },
  { buryat: "үнэтэй",  ru: "дорогой",  emoji: "💎" },
  { buryat: "үнэгүй",  ru: "дешёвый",  emoji: "🏷️" },
];
const P_CLOTHES = [
  { buryat: "самса",  ru: "рубашка", emoji: "👔" },
  { buryat: "халаад", ru: "халат",   emoji: "🥻" },
  { buryat: "малгай", ru: "шапка",   emoji: "🧢" },
  { buryat: "сабхи",  ru: "сапоги",  emoji: "👢" },
  { buryat: "плати",  ru: "платье",  emoji: "👗" },
  { buryat: "пальто", ru: "пальто",  emoji: "🧥" },
  { buryat: "бүhэ",   ru: "пояс",    emoji: "🎗️" },
];
const P_HOME = [
  { buryat: "стол",   ru: "стол",    emoji: "🪑" },
  { buryat: "стул",   ru: "стул",    emoji: "🪑" },
  { buryat: "сонхо",  ru: "окно",    emoji: "🪟" },
  { buryat: "үүдэн",  ru: "дверь",   emoji: "🚪" },
  { buryat: "орон",   ru: "кровать", emoji: "🛏️" },
  { buryat: "шкаф",   ru: "шкаф",    emoji: "🗄️" },
  { buryat: "лаампа", ru: "лампа",   emoji: "💡" },
];
const P_CITY = [
  { buryat: "үйлсэ",        ru: "улица",   emoji: "🏘️" },
  { buryat: "магазин",       ru: "магазин", emoji: "🏪" },
  { buryat: "баруун тээшэ", ru: "направо", emoji: "➡️" },
  { buryat: "зүүн тээшэ",   ru: "налево",  emoji: "⬅️" },
  { buryat: "сэхэ",          ru: "прямо",   emoji: "⬆️" },
  { buryat: "дэлгүүр",      ru: "рынок",   emoji: "🛒" },
  { buryat: "харгы",         ru: "дорога",  emoji: "🛣️" },
];
const P_MONEY = [
  { buryat: "мүнгэн",      ru: "деньги", emoji: "💰" },
  { buryat: "сэн",          ru: "цена",   emoji: "🏷️" },
  { buryat: "үнэтэй",      ru: "дорого", emoji: "💎" },
  { buryat: "үнэгүйгөөр", ru: "дёшево", emoji: "🎁" },
  { buryat: "дэлгүүр",    ru: "рынок",  emoji: "🛒" },
  { buryat: "монетэ",      ru: "монета", emoji: "🪙" },
];
const P_SCHOOL = [
  { buryat: "hургуули",   ru: "школа",    emoji: "🏫" },
  { buryat: "ном",         ru: "книга",    emoji: "📚" },
  { buryat: "дэбтэр",     ru: "тетрадь",  emoji: "📓" },
  { buryat: "харандааш",  ru: "карандаш", emoji: "✏️" },
  { buryat: "багша",       ru: "учитель",  emoji: "👨‍🏫" },
  { buryat: "hурагша",    ru: "ученик",   emoji: "🧑‍🎓" },
  { buryat: "хэшээл",     ru: "урок",     emoji: "📝" },
  { buryat: "шалгалта",   ru: "экзамен",  emoji: "📊" },
];
const P_HOLIDAYS = [
  { buryat: "hайндэр", ru: "праздник", emoji: "🎉" },
  { buryat: "бэлэг",   ru: "подарок",  emoji: "🎁" },
  { buryat: "айлшан",  ru: "гость",    emoji: "🤝" },
];
const P_MUSIC = [
  { buryat: "дуун",   ru: "песня",      emoji: "🎵" },
  { buryat: "хатар",  ru: "танец",      emoji: "💃" },
  { buryat: "хүгжэм", ru: "музыка",     emoji: "🎶" },
  { buryat: "зураг",  ru: "рисунок",    emoji: "🎨" },
  { buryat: "зэмсэг", ru: "инструмент", emoji: "🎸" },
];
const P_SPORT = [
  { buryat: "барилдаан",        ru: "борьба",       emoji: "🤼" },
  { buryat: "буудалган",         ru: "стрельба",     emoji: "🎯" },
  { buryat: "мориной урилдаан",  ru: "скачки",       emoji: "🏇" },
  { buryat: "спортсмен",          ru: "спортсмен",    emoji: "🏆" },
  { buryat: "илалта",             ru: "победа",       emoji: "🥇" },
  { buryat: "мүрысөөн",          ru: "соревнование", emoji: "⚔️" },
];
const P_V_PERCEPTION = [
  { buryat: "дуулаха",   ru: "слышать",         emoji: "👂" },
  { buryat: "дурлаха",   ru: "любить",           emoji: "❤️" },
  { buryat: "хүсэхэ",    ru: "хотеть, желать",  emoji: "🌟" },
  { buryat: "үнэншэхэ",  ru: "верить",           emoji: "🙏" },
  { buryat: "шэбшэхэ",   ru: "думать",           emoji: "🤔" },
  { buryat: "ойлгохо",   ru: "понимать, понять", emoji: "💡" },
];
const P_V_CREATIVE = [
  { buryat: "зураха",  ru: "рисовать", emoji: "🎨" },
  { buryat: "уулаха",  ru: "петь",     emoji: "🎤" },
  { buryat: "бэшэхэ",  ru: "писать",   emoji: "✍️" },
  { buryat: "уншаха",  ru: "читать",   emoji: "📖" },
  { buryat: "бэдэрхэ", ru: "искать",   emoji: "🔍" },
  { buryat: "шэбшэхэ", ru: "думать",   emoji: "🤔" },
];
const P_V_ROUTINE = [
  { buryat: "бэеэ угааха", ru: "мыться",   emoji: "🚿" },
  { buryat: "хүдэлхэ",     ru: "работать", emoji: "💼" },
  { buryat: "унтаха",      ru: "спать",    emoji: "😴" },
  { buryat: "сэнгэхэ",     ru: "гулять",   emoji: "🌸" },
  { buryat: "hураха",      ru: "учиться",  emoji: "📚" },
  { buryat: "бэлдэхэ",     ru: "готовить", emoji: "🍳" },
];
const P_V_MODAL = [
  { buryat: "шадаха",    ru: "мочь, уметь", emoji: "💪" },
  { buryat: "хүсэхэ",    ru: "хотеть",      emoji: "🌟" },
  { buryat: "үритэй",   ru: "должен",       emoji: "📌" },
  { buryat: "хэрэгтэй", ru: "нужно",        emoji: "❗" },
  { buryat: "болохо",   ru: "можно",         emoji: "✅" },
];
const P_PHRASES_GREETING = [
  { buryat: "Сайн байна!", russian: "Здравствуйте!" },
  { buryat: "Мэндээ!", russian: "Здравствуйте!" },
  { buryat: "Амгалан үдэр!", russian: "Добрый день!" },
  { buryat: "Һайн байна гүт?", russian: "Как поживаете?" },
  { buryat: "Һайн, һайн даа!", russian: "Хорошо, в порядке!" },
  { buryat: "Юу һонин бэ?", russian: "Какие новости?" },
  { buryat: "Таниие үнинэй харааагүйб", russian: "Давно Вас не видел" },
  { buryat: "Хүргэхэб", russian: "Передам" },
];
const P_PHRASES_JOY = [
  { buryat: "Ехэ һайн даа!", russian: "Очень хорошо!" },
  { buryat: "Ямар гоёб!", russian: "Как красиво!" },
  { buryat: "Гайхалтай!", russian: "Удивительно!" },
  { buryat: "Би ехэ баяртай байнаб", russian: "Я очень рад(а)!" },
  { buryat: "Ямар амтатайб!", russian: "Как вкусно!" },
  { buryat: "Бэрхэ!", russian: "Молодец!" },
  { buryat: "Юун гэһэн бэрхэб!", russian: "Какой молодец!" },
  { buryat: "Ямар бэлигтэйб!", russian: "Какой талантливый!" },
  { buryat: "Ямар һонин бэ!", russian: "Как интересно!" },
];

// Compound number helpers
const UNITS_F: Record<number, string> = {
  1:"нэгэн",2:"хоёр",3:"гурба",4:"дурбэн",5:"табан",
  6:"зургаан",7:"долоон",8:"найман",9:"юhэн"
};
const TENS_F: Record<number, string> = {
  10:"арбан",20:"хорин",30:"гушан",40:"душэн",50:"табин",
  60:"жаран",70:"далан",80:"наян",90:"ерэн"
};
const COMPOUND_NRS = [11,13,15,22,28,34,47,53,66,72,85,99];

// ── Card sets ─────────────────────────────────────────────────
const CARD_SETS: CardSet[] = [
  // — Грамматика —
  {
    id:"pronouns-personal", title:"Личные", subtitle:"Местоимения",
    emoji:"👤", gradient:"linear-gradient(140deg,#2563eb 0%,#1e3a5f 100%)", glow:"#2563eb",
    group:"Грамматика",
    cards: pronounsData.personal.map((p,i)=>({id:`pp-${i}`,front:p.buryat,back:p.russian})),
  },
  {
    id:"pronouns-possessive", title:"Притяжательные", subtitle:"Местоимения",
    emoji:"🏷️", gradient:"linear-gradient(140deg,#0891b2 0%,#06b6d4 100%)", glow:"#0891b2",
    group:"Грамматика",
    cards: pronounsData.possessive.map((p,i)=>({id:`pos-${i}`,front:p.possessive,back:p.russian,hint:`← ${p.pronoun}`})),
  },
  // — Числа —
  {
    id:"numbers-1-10", title:"Числа 1 – 10", subtitle:"Числа",
    emoji:"🔢", gradient:"linear-gradient(140deg,#f97316 0%,#dc2626 100%)", glow:"#f97316",
    group:"Числа",
    cards: numbersData.units.map(n=>({id:`u-${n.number}`,front:String(n.number),back:n.buryat,hint:(n as {variants?:string[]}).variants?.join(" / ")})),
  },
  {
    id:"numbers-tens", title:"Десятки + 100, 1000", subtitle:"Числа",
    emoji:"💯", gradient:"linear-gradient(140deg,#8b5cf6 0%,#7c3aed 100%)", glow:"#8b5cf6",
    group:"Числа",
    cards: [
      ...numbersData.tens.map(n=>({id:`t-${n.number}`,front:String(n.number),back:n.buryat})),
      {id:"t-100",  front:"100",  back:"зуу(н)"},
      {id:"t-1000", front:"1000", back:"мянга(н)"},
    ],
  },
  {
    id:"numbers-compound", title:"Составные числа", subtitle:"11 – 99",
    emoji:"🔣", gradient:"linear-gradient(140deg,#7c3aed 0%,#4f46e5 100%)", glow:"#7c3aed",
    group:"Числа",
    cards: COMPOUND_NRS.map(n=>{
      const t=Math.floor(n/10)*10; const u=n%10;
      return {id:`cmp-${n}`,front:String(n),back:`${TENS_F[t]} ${UNITS_F[u]}`};
    }),
  },
  // — Глаголы —
  {
    id:"verb-bayha", title:"Байха", subtitle:"Глагол «быть»",
    emoji:"📝", gradient:"linear-gradient(140deg,#16a34a 0%,#059669 100%)", glow:"#16a34a",
    group:"Глаголы",
    cards: verbsData.verbs[0].forms.map((f,i)=>({
      id:`bh-${i}`,front:f.form,
      back:(f as {translation?:string}).translation||f.pronoun_ru,
      hint:f.note||undefined,
    })),
  },
  {
    id:"verb-edihe", title:"Эдихэ", subtitle:"Глагол «кушать»",
    emoji:"🍽️", gradient:"linear-gradient(140deg,#f59e0b 0%,#d97706 100%)", glow:"#f59e0b",
    group:"Глаголы",
    cards: verbsData.verbs[1].forms.map((f,i)=>({
      id:`eh-${i}`,front:f.form,
      back:(f as {translation?:string}).translation||f.pronoun_ru,
    })),
  },
  {
    id:"verb-yabaha", title:"Ябаха", subtitle:"Глагол «идти»",
    emoji:"🚶", gradient:"linear-gradient(140deg,#ec4899 0%,#be185d 100%)", glow:"#ec4899",
    group:"Глаголы",
    cards: verbsData.verbs[2].forms.map((f,i)=>({
      id:`yb-${i}`,front:f.form,
      back:(f as {translation?:string}).translation||f.pronoun_ru,
    })),
  },
  // — Слова —
  {
    id:"questions", title:"Вопросительные слова", subtitle:"Слова",
    emoji:"❓", gradient:"linear-gradient(140deg,#1d4ed8 0%,#0891b2 100%)", glow:"#1d4ed8",
    group:"Слова",
    cards: P_QUESTIONS.map((w,i)=>({id:`q-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"adjectives", title:"Прилагательные", subtitle:"Слова",
    emoji:"🎯", gradient:"linear-gradient(140deg,#7c3aed 0%,#a855f7 100%)", glow:"#7c3aed",
    group:"Слова",
    cards: P_ADJECTIVES.map((w,i)=>({id:`adj-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"clothes", title:"Одежда", subtitle:"Слова",
    emoji:"👗", gradient:"linear-gradient(140deg,#ec4899 0%,#be185d 100%)", glow:"#ec4899",
    group:"Слова",
    cards: P_CLOTHES.map((w,i)=>({id:`clo-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"home", title:"Дом и быт", subtitle:"Слова",
    emoji:"🏠", gradient:"linear-gradient(140deg,#f97316 0%,#ea580c 100%)", glow:"#f97316",
    group:"Слова",
    cards: P_HOME.map((w,i)=>({id:`hm-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"city", title:"Город и направления", subtitle:"Слова",
    emoji:"🏙️", gradient:"linear-gradient(140deg,#0891b2 0%,#0e7490 100%)", glow:"#0891b2",
    group:"Слова",
    cards: P_CITY.map((w,i)=>({id:`cty-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"money", title:"Деньги и покупки", subtitle:"Слова",
    emoji:"💰", gradient:"linear-gradient(140deg,#16a34a 0%,#059669 100%)", glow:"#16a34a",
    group:"Слова",
    cards: P_MONEY.map((w,i)=>({id:`mny-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"school", title:"Школа и учёба", subtitle:"Слова",
    emoji:"📚", gradient:"linear-gradient(140deg,#2563eb 0%,#1d4ed8 100%)", glow:"#2563eb",
    group:"Слова",
    cards: P_SCHOOL.map((w,i)=>({id:`sch-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"holidays", title:"Праздники", subtitle:"Слова",
    emoji:"🎉", gradient:"linear-gradient(140deg,#f59e0b 0%,#d97706 100%)", glow:"#f59e0b",
    group:"Слова",
    cards: P_HOLIDAYS.map((w,i)=>({id:`hol-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"music", title:"Музыка и творчество", subtitle:"Слова",
    emoji:"🎵", gradient:"linear-gradient(140deg,#7c3aed 0%,#6d28d9 100%)", glow:"#7c3aed",
    group:"Слова",
    cards: P_MUSIC.map((w,i)=>({id:`msc-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"sport", title:"Спорт", subtitle:"Слова",
    emoji:"🏆", gradient:"linear-gradient(140deg,#dc2626 0%,#7f1d1d 100%)", glow:"#dc2626",
    group:"Слова",
    cards: P_SPORT.map((w,i)=>({id:`spt-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  // — Фразы —
  {
    id:"phrases-greeting", title:"Приветствие", subtitle:"Фразы",
    emoji:"👋", gradient:"linear-gradient(140deg,#1d4ed8 0%,#1e3a5f 100%)", glow:"#1d4ed8",
    group:"Фразы",
    cards: P_PHRASES_GREETING.map((p,i)=>({id:`greet-${i}`,front:p.buryat,back:p.russian})),
  },
  {
    id:"phrases-joy", title:"Радость", subtitle:"Фразы",
    emoji:"😄", gradient:"linear-gradient(140deg,#f59e0b 0%,#f97316 100%)", glow:"#f59e0b",
    group:"Фразы",
    cards: P_PHRASES_JOY.map((p,i)=>({id:`joy-${i}`,front:p.buryat,back:p.russian})),
  },
  // — Подборки —
  {
    id:"colors", title:"Цвета", subtitle:"Подборки",
    emoji:"🎨", gradient:"linear-gradient(140deg,#7c3aed 0%,#ec4899 100%)", glow:"#7c3aed",
    group:"Подборки",
    cards: P_COLORS.map((c,i)=>({id:`col-${i}`,front:c.buryat,back:c.ru,color:c.hex,colorLight:c.light})),
  },
  {
    id:"animals", title:"Животные", subtitle:"Подборки",
    emoji:"🐾", gradient:"linear-gradient(140deg,#d97706 0%,#7c2d12 100%)", glow:"#d97706",
    group:"Подборки",
    cards: P_ANIMALS.map((a,i)=>({id:`ani-${i}`,front:a.buryat,back:a.ru,emoji:a.emoji})),
  },
  {
    id:"family", title:"Семья", subtitle:"Подборки",
    emoji:"👨‍👩‍👧", gradient:"linear-gradient(140deg,#fbbf24 0%,#d97706 100%)", glow:"#fbbf24",
    group:"Подборки",
    cards: P_FAMILY.map((f,i)=>({id:`fam-${i}`,front:f.buryat,back:f.ru,emoji:f.emoji})),
  },
  {
    id:"food", title:"Еда", subtitle:"Подборки",
    emoji:"🍖", gradient:"linear-gradient(140deg,#f97316 0%,#ea580c 100%)", glow:"#f97316",
    group:"Подборки",
    cards: P_FOOD.map((f,i)=>({id:`food-${i}`,front:f.buryat,back:f.ru,emoji:f.emoji})),
  },
  {
    id:"body", title:"Тело", subtitle:"Подборки",
    emoji:"💪", gradient:"linear-gradient(140deg,#fb923c 0%,#c2410c 100%)", glow:"#fb923c",
    group:"Подборки",
    cards: P_BODY.map((b,i)=>({id:`body-${i}`,front:b.buryat,back:b.ru,emoji:b.emoji})),
  },
  {
    id:"nature", title:"Природа", subtitle:"Подборки",
    emoji:"🌿", gradient:"linear-gradient(140deg,#22c55e 0%,#0891b2 100%)", glow:"#22c55e",
    group:"Подборки",
    cards: P_NATURE.map((n,i)=>({id:`nat-${i}`,front:n.buryat,back:n.ru,emoji:n.emoji})),
  },
  {
    id:"weather", title:"Погода", subtitle:"Подборки",
    emoji:"🌤️", gradient:"linear-gradient(140deg,#38bdf8 0%,#3b82f6 100%)", glow:"#38bdf8",
    group:"Подборки",
    cards: P_WEATHER.map((w,i)=>({id:`wth-${i}`,front:w.buryat,back:w.ru,emoji:w.emoji})),
  },
  {
    id:"emotions", title:"Эмоции", subtitle:"Подборки",
    emoji:"😊", gradient:"linear-gradient(140deg,#a855f7 0%,#ec4899 100%)", glow:"#a855f7",
    group:"Подборки",
    cards: P_EMOTIONS.map((e,i)=>({id:`emo-${i}`,front:e.buryat,back:e.ru,emoji:e.emoji})),
  },
  {
    id:"time", title:"Время", subtitle:"Подборки",
    emoji:"⏰", gradient:"linear-gradient(140deg,#3b82f6 0%,#7c3aed 100%)", glow:"#3b82f6",
    group:"Подборки",
    cards: P_TIME.map((t,i)=>({id:`time-${i}`,front:t.buryat,back:t.ru,emoji:t.emoji})),
  },
  {
    id:"verbs1", title:"Глаголы 1", subtitle:"Движение и действие",
    emoji:"🏃", gradient:"linear-gradient(140deg,#059669 0%,#0891b2 100%)", glow:"#059669",
    group:"Подборки",
    cards: P_VERBS1.map((v,i)=>({id:`v1-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"verbs2", title:"Глаголы 2", subtitle:"Общение и знание",
    emoji:"💬", gradient:"linear-gradient(140deg,#7c3aed 0%,#2563eb 100%)", glow:"#7c3aed",
    group:"Подборки",
    cards: P_VERBS2.map((v,i)=>({id:`v2-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"verbs3", title:"Глаголы 3", subtitle:"Быт и повседневность",
    emoji:"🏠", gradient:"linear-gradient(140deg,#ea580c 0%,#dc2626 100%)", glow:"#ea580c",
    group:"Подборки",
    cards: P_VERBS3.map((v,i)=>({id:`v3-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"v-perception", title:"Глаголы 4", subtitle:"Чувства и восприятие",
    emoji:"👂", gradient:"linear-gradient(140deg,#8b5cf6 0%,#6d28d9 100%)", glow:"#8b5cf6",
    group:"Подборки",
    cards: P_V_PERCEPTION.map((v,i)=>({id:`vp-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"v-creative", title:"Глаголы 5", subtitle:"Творчество",
    emoji:"🎨", gradient:"linear-gradient(140deg,#f97316 0%,#c2410c 100%)", glow:"#f97316",
    group:"Подборки",
    cards: P_V_CREATIVE.map((v,i)=>({id:`vc-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"v-routine", title:"Глаголы 6", subtitle:"Рутина",
    emoji:"🚿", gradient:"linear-gradient(140deg,#22c55e 0%,#0891b2 100%)", glow:"#22c55e",
    group:"Подборки",
    cards: P_V_ROUTINE.map((v,i)=>({id:`vr-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
  {
    id:"v-modal", title:"Глаголы 7", subtitle:"Модальные",
    emoji:"💪", gradient:"linear-gradient(140deg,#0f172a 0%,#1e3a5f 100%)", glow:"#1e3a5f",
    group:"Подборки",
    cards: P_V_MODAL.map((v,i)=>({id:`vm-${i}`,front:v.buryat,back:v.ru,emoji:v.emoji})),
  },
];

const GROUPS = ["Грамматика", "Числа", "Глаголы", "Слова", "Фразы", "Подборки"];

// ── Quiz helpers ──────────────────────────────────────────────
function generateOptions(cards: FlashCard[], currentIdx: number): string[] {
  const correct = cards[currentIdx].back;
  const pool = cards
    .filter((_,i)=>i!==currentIdx).map(c=>c.back)
    .filter((v,i,arr)=>arr.indexOf(v)===i && v!==correct);
  const shuffled = [...pool].sort(()=>Math.random()-0.5);
  return [correct,...shuffled.slice(0,3)].sort(()=>Math.random()-0.5);
}

// ── Main component ────────────────────────────────────────────
export default function PracticePage() {
  const [phase, setPhase]           = useState<Phase>("menu");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("learn");
  const [activeSet, setActiveSet]   = useState<CardSet|null>(null);
  const [cardIndex, setCardIndex]   = useState(0);

  // Study mode state — directional flip + 2D drag
  const [flipDir, setFlipDir]       = useState<FlipDir>(null);
  const [dragX, setDragX]           = useState(0);
  const [dragY, setDragY]           = useState(0);
  const pointerStartX               = useRef<number|null>(null);
  const pointerStartY               = useRef<number|null>(null);

  // Quiz mode state
  const [shuffledCards, setShuffledCards] = useState<FlashCard[]>([]);
  const [quizOptions, setQuizOptions]     = useState<string[]>([]);
  const [quizSelected, setQuizSelected]   = useState<string|null>(null);
  const [quizAnswered, setQuizAnswered]   = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  useEffect(()=>{
    if(phase==="quiz" && shuffledCards.length>0){
      setQuizOptions(generateOptions(shuffledCards, cardIndex));
      setQuizSelected(null);
      setQuizAnswered(false);
    }
  },[phase, shuffledCards, cardIndex]);

  const openModeSelect = useCallback((set: CardSet)=>{
    setActiveSet(set); setPhase("mode_select");
  },[]);

  const startMode = useCallback((mode: PracticeMode)=>{
    if(!activeSet) return;
    setPracticeMode(mode);
    setCardIndex(0);
    setFlipDir(null);
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizCorrectCount(0);
    if(mode==="quiz"){
      setShuffledCards([...activeSet.cards].sort(()=>Math.random()-0.5));
    }
    setPhase(mode==="learn"?"studying":"quiz");
  },[activeSet]);

  const goBack        = ()=>{ setPhase("menu"); setActiveSet(null); };
  const goToModeSelect= ()=>setPhase("mode_select");

  // ── Study mode ──────────────────────────────────────────────
  const resetDrag = () => { setDragX(0); setDragY(0); };

  const flipCard = (dir: "right"|"left") => {
    setFlipDir(d=> d!==null ? null : dir);
    resetDrag();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if(pointerStartX.current === null) return;
    setDragX(e.clientX - pointerStartX.current);
    setDragY(e.clientY - (pointerStartY.current ?? e.clientY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if(pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    const dy = e.clientY - (pointerStartY.current ?? e.clientY);
    pointerStartX.current = null;
    pointerStartY.current = null;

    if(Math.abs(dx) > 40) {
      if(flipDir === null) {
        // Front: flip in swipe direction
        flipCard(dx > 0 ? "right" : "left");
      } else {
        // Back: any horizontal swipe unflips
        setFlipDir(null);
        resetDrag();
      }
    } else {
      resetDrag();
      // Pure tap (tiny movement)
      if(Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        if(flipDir !== null) {
          // On back: tap to unflip
          setFlipDir(null);
        } else {
          // On front: tap left/right half to flip that direction
          const rect = e.currentTarget.getBoundingClientRect();
          flipCard(e.clientX - rect.left > rect.width / 2 ? "right" : "left");
        }
      }
    }
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
    pointerStartY.current = null;
    resetDrag();
  };

  const handleStudyNext = () => {
    if(!activeSet) return;
    const next = cardIndex+1;
    if(next>=activeSet.cards.length) setPhase("done");
    else { setCardIndex(next); setFlipDir(null); resetDrag(); }
  };
  const handleStudyPrev = () => {
    if(cardIndex>0){ setCardIndex(c=>c-1); setFlipDir(null); resetDrag(); }
  };

  // ── Quiz mode ───────────────────────────────────────────────
  const handleQuizAnswer = (option: string) => {
    if(quizAnswered||shuffledCards.length===0) return;
    setQuizSelected(option);
    setQuizAnswered(true);
    if(option===shuffledCards[cardIndex].back) setQuizCorrectCount(c=>c+1);
  };
  const handleQuizNext = () => {
    const next = cardIndex+1;
    if(next>=shuffledCards.length) setPhase("done");
    else setCardIndex(next);
  };

  // ════════════════════════════════════════════════════════════
  // MENU
  // ════════════════════════════════════════════════════════════
  if(phase==="menu"){
    return (
      <div className="page-enter" style={{background:"#f8faff",minHeight:"100dvh"}}>
        <div className="px-5 pb-6 relative overflow-hidden"
          style={{background:"linear-gradient(140deg,#0f172a 0%,#1e3a5f 60%,#1d4ed8 100%)",paddingTop:"calc(env(safe-area-inset-top) + 24px)"}}>
          <div className="absolute" style={{top:-30,right:-20,width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.2),transparent 70%)"}} />
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:"#fbbf24"}}>⭐ Дасхал</p>
          <h1 className="text-3xl font-bold text-white" style={{fontFamily:'"Playfair Display",Georgia,serif'}}>Практика</h1>
          <p className="text-sm mt-1" style={{color:"rgba(255,255,255,0.6)"}}>Выбери набор и начни повторять</p>
        </div>

        <div className="px-4 pt-4 pb-8 md:max-w-3xl md:mx-auto">
          {GROUPS.map(group=>{
            const sets = CARD_SETS.filter(s=>s.group===group);
            return (
              <div key={group} className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:"#94a3b8"}}>
                  {group}
                </p>
                <div className="space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
                  {sets.map(set=>(
                    <button key={set.id} onClick={()=>openModeSelect(set)}
                      className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left transition-all duration-150 active:scale-98"
                      style={{background:"white",border:"2px solid #e2e8f0",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{background:set.gradient,boxShadow:`0 3px 10px -3px ${set.glow}55`}}>
                        {set.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm" style={{color:"#0f172a"}}>{set.title}</div>
                        <div className="text-xs mt-0.5" style={{color:"#64748b"}}>{set.subtitle} · {set.cards.length} карточек</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <path d="M9 18l6-6-6-6" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-2 rounded-2xl p-4" style={{background:"#eff6ff",border:"1.5px solid #bfdbfe"}}>
            <p className="text-sm font-bold mb-2" style={{color:"#1d4ed8"}}>Два режима</p>
            <div className="flex gap-4">
              <div className="flex items-start gap-2">
                <span>📖</span>
                <div>
                  <p className="text-xs font-bold" style={{color:"#1e3a5f"}}>Обучение</p>
                  <p className="text-xs" style={{color:"#3b82f6"}}>Переворачивай карточку</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>🎯</span>
                <div>
                  <p className="text-xs font-bold" style={{color:"#1e3a5f"}}>Проверка</p>
                  <p className="text-xs" style={{color:"#3b82f6"}}>4 варианта ответа</p>
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
  if(phase==="mode_select" && activeSet){
    return (
      <div className="flex flex-col min-h-screen" style={{background:"#f8faff"}}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{paddingTop:"calc(env(safe-area-inset-top) + 12px)",background:"white",borderBottom:"1px solid #e2e8f0"}}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#f1f5f9"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1">
            <span className="font-bold text-base" style={{color:"#0f172a"}}>{activeSet.title}</span>
            <span className="text-xs ml-2" style={{color:"#64748b"}}>{activeSet.cards.length} карточек</span>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:activeSet.gradient}}>
            {activeSet.emoji}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 py-8 gap-4">
          <p className="text-center text-lg font-bold mb-2" style={{color:"#0f172a"}}>Как будем учиться?</p>

          <button onClick={()=>startMode("learn")}
            className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-95"
            style={{background:"linear-gradient(135deg,#eff6ff,#dbeafe)",border:"2px solid #bfdbfe",boxShadow:"0 4px 20px rgba(29,78,216,0.1)"}}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{background:"white",boxShadow:"0 2px 10px rgba(0,0,0,0.08)"}}>📖</div>
              <div>
                <p className="text-lg font-bold" style={{color:"#1e3a5f"}}>Обучение</p>
                <p className="text-sm mt-0.5" style={{color:"#3b82f6"}}>Переворачивай карточку — видишь перевод</p>
                <p className="text-xs mt-1" style={{color:"#93c5fd"}}>Свайп вправо / влево или нажми</p>
              </div>
            </div>
          </button>

          <button onClick={()=>startMode("quiz")}
            className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-95"
            style={{background:"linear-gradient(135deg,#fef9c3,#fde68a)",border:"2px solid #fcd34d",boxShadow:"0 4px 20px rgba(245,158,11,0.12)"}}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{background:"white",boxShadow:"0 2px 10px rgba(0,0,0,0.08)"}}>🎯</div>
              <div>
                <p className="text-lg font-bold" style={{color:"#92400e"}}>Проверка</p>
                <p className="text-sm mt-0.5" style={{color:"#d97706"}}>Выбираешь правильный вариант из 4</p>
                <p className="text-xs mt-1" style={{color:"#f59e0b"}}>Карточки перемешаны каждый раз</p>
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
  if(phase==="done" && activeSet){
    if(practiceMode==="learn"){
      return (
        <div className="page-enter flex flex-col min-h-screen" style={{background:"#f8faff"}}>
          <div className="px-5 pb-8 flex-1 flex flex-col items-center justify-center"
            style={{paddingTop:"calc(env(safe-area-inset-top) + 32px)"}}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
              style={{background:activeSet.gradient,boxShadow:`0 8px 32px -8px ${activeSet.glow}77`}}>⭐</div>
            <h2 className="text-3xl font-bold mb-2" style={{color:"#0f172a",fontFamily:'"Playfair Display",Georgia,serif'}}>Молодец!</h2>
            <p className="text-base" style={{color:"#64748b"}}>Все {activeSet.cards.length} карточек просмотрены</p>
            <p className="text-sm mt-1 font-semibold" style={{color:activeSet.glow}}>{activeSet.emoji} {activeSet.title}</p>
          </div>
          <div className="px-4 pb-24 flex flex-col gap-3">
            <button onClick={()=>startMode("learn")}
              className="w-full py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
              style={{background:activeSet.gradient,boxShadow:`0 4px 16px -4px ${activeSet.glow}66`}}>
              🔄 Просмотреть ещё раз
            </button>
            <button onClick={()=>startMode("quiz")}
              className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
              style={{background:"linear-gradient(135deg,#fef9c3,#fde68a)",color:"#92400e",border:"1.5px solid #fcd34d"}}>
              🎯 Перейти к проверке
            </button>
            <button onClick={goBack}
              className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
              style={{background:"#f1f5f9",color:"#475569"}}>← Все наборы</button>
          </div>
        </div>
      );
    }

    const total = shuffledCards.length||activeSet.cards.length;
    const known = quizCorrectCount;
    const pct   = Math.round((known/total)*100);
    const perfect = known===total;

    return (
      <div className="page-enter flex flex-col min-h-screen" style={{background:"#f8faff"}}>
        <div className="px-5 pb-8 flex-1 flex flex-col items-center justify-center"
          style={{paddingTop:"calc(env(safe-area-inset-top) + 32px)"}}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-5"
            style={{background:perfect?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#3b82f6,#1d4ed8)",boxShadow:`0 8px 32px -8px ${perfect?"#f59e0b":"#3b82f6"}77`}}>
            {perfect?"🏆":"⭐"}
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{color:"#0f172a",fontFamily:'"Playfair Display",Georgia,serif'}}>
            {perfect?"Идеально!":pct>=70?"Отлично!":"Хорошая работа!"}
          </h2>
          <p className="text-sm mb-1" style={{color:"#64748b"}}>Проверка завершена</p>
          <p className="text-base" style={{color:"#64748b"}}>{known} из {total} правильно</p>
          <div className="w-full max-w-xs mt-6">
            <div className="w-full rounded-full overflow-hidden" style={{height:12,background:"#e2e8f0"}}>
              <div className="h-full rounded-full progress-fill"
                style={{width:`${pct}%`,background:perfect?"linear-gradient(90deg,#f59e0b,#d97706)":"linear-gradient(90deg,#3b82f6,#1d4ed8)"}}/>
            </div>
            <p className="text-center text-sm font-bold mt-2" style={{color:perfect?"#d97706":"#1d4ed8"}}>{pct}% ✓</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-5">
            <div className="rounded-2xl p-4 text-center" style={{background:"#ecfdf5",border:"1.5px solid #bbf7d0"}}>
              <p className="text-2xl font-bold" style={{color:"#16a34a"}}>{known}</p>
              <p className="text-xs mt-0.5" style={{color:"#22c55e"}}>Верно ✓</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{background:"#fef2f2",border:"1.5px solid #fecaca"}}>
              <p className="text-2xl font-bold" style={{color:"#dc2626"}}>{total-known}</p>
              <p className="text-xs mt-0.5" style={{color:"#ef4444"}}>Повторить</p>
            </div>
          </div>
        </div>
        <div className="px-4 pb-24 flex flex-col gap-3">
          <button onClick={()=>startMode("quiz")}
            className="w-full py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
            style={{background:activeSet.gradient,boxShadow:`0 4px 16px -4px ${activeSet.glow}66`}}>
            🔄 Повторить ещё раз
          </button>
          <button onClick={goToModeSelect}
            className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
            style={{background:"#eff6ff",color:"#1d4ed8",border:"1.5px solid #bfdbfe"}}>
            ↕ Сменить режим
          </button>
          <button onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold text-base transition active:scale-95"
            style={{background:"#f1f5f9",color:"#475569"}}>← Все наборы</button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // STUDY MODE — направленный flip
  // ════════════════════════════════════════════════════════════
  if(phase==="studying" && activeSet){
    const card  = activeSet.cards[cardIndex];
    const total = activeSet.cards.length;
    const isColor  = !!card.color;
    const hasEmoji = !!card.emoji;

    // Front background: solid color for color cards, gradient otherwise
    const frontBg  = isColor ? card.color! : activeSet.gradient;
    const frontShadow = `0 10px 40px -8px ${isColor ? card.color : activeSet.glow}55`;
    const frontTextColor  = isColor ? (card.colorLight ? "#1e293b" : "white") : "white";
    const frontSubColor   = isColor ? (card.colorLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)") : "rgba(255,255,255,0.5)";
    const frontHintColor  = isColor ? (card.colorLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)") : "rgba(255,255,255,0.55)";

    // 2D free rotation: base angle (0 or ±180) + live drag on both axes
    const baseY    = flipDir === "right" ? 180 : flipDir === "left" ? -180 : 0;
    const isDragging = dragX !== 0 || dragY !== 0;
    const rotY     = Math.max(-72, Math.min(72, dragX * 0.18));
    const rotX     = Math.max(-28, Math.min(28, -dragY * 0.1));
    const innerTransform = isDragging
      ? `rotateY(${baseY + rotY}deg) rotateX(${rotX}deg)`
      : `rotateY(${baseY}deg)`;
    const innerTransition = isDragging
      ? "none"
      : "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)";

    return (
      <div className="flex flex-col min-h-screen" style={{background:"#f8faff"}}>
        {/* Top bar */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{paddingTop:"calc(env(safe-area-inset-top) + 12px)",background:"white",borderBottom:"1px solid #e2e8f0"}}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#f1f5f9"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 rounded-full overflow-hidden" style={{height:8,background:"#e2e8f0"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${(cardIndex/total)*100}%`,background:activeSet.gradient}}/>
          </div>
          <span className="text-xs font-bold w-12 text-right" style={{color:"#64748b"}}>{cardIndex+1}/{total}</span>
        </div>

        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:activeSet.gradient,color:"white"}}>
            📖 {activeSet.emoji} {activeSet.title}
          </span>
          <span className="text-xs" style={{color:"#94a3b8"}}>
            {flipDir ? "↩ свайп чтобы вернуть" : "свайп или нажми"}
          </span>
        </div>

        {/* Flip card */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-3">
          <div
            className="flip-card w-full md:max-w-[540px] cursor-pointer select-none"
            style={{height:290, touchAction:"none"}}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div className="flip-card-inner" style={{height:"100%", transform:innerTransform, transition:innerTransition}}>

              {/* FRONT */}
              <div className="flip-card-front"
                style={{borderRadius:24,background:frontBg,boxShadow:frontShadow}}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:frontSubColor}}>
                  Бурятский
                </p>
                {hasEmoji && (
                  <span style={{fontSize:"3.2rem",lineHeight:1,marginBottom:14}}>{card.emoji}</span>
                )}
                <span className="font-bold text-center leading-tight px-6"
                  style={{fontSize:hasEmoji?"1.9rem":"2.5rem",color:frontTextColor}}>
                  {card.front}
                </span>
                {card.hint && (
                  <span className="text-sm mt-2 italic text-center px-6" style={{color:frontHintColor}}>
                    {card.hint}
                  </span>
                )}
                <div className="mt-6 flex items-center gap-1.5" style={{color:frontSubColor}}>
                  <span style={{fontSize:"0.7rem"}}>← свайп / нажми →</span>
                </div>
              </div>

              {/* BACK */}
              <div className="flip-card-back"
                style={{borderRadius:24,background:"white",border:`2.5px solid ${isColor?card.color+"33":activeSet.glow+"28"}`,boxShadow:`0 10px 40px -8px ${isColor?card.color:activeSet.glow}28`}}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:"#94a3b8"}}>
                  Перевод
                </p>
                {hasEmoji && (
                  <span style={{fontSize:"3.2rem",lineHeight:1,marginBottom:14}}>{card.emoji}</span>
                )}
                {isColor && (
                  <div style={{width:72,height:72,borderRadius:16,background:card.color,border:"2px solid rgba(0,0,0,0.08)",marginBottom:14,boxShadow:`0 4px 16px -4px ${card.color}66`}}/>
                )}
                <span className="font-bold text-center leading-snug px-6"
                  style={{fontSize:hasEmoji?"1.8rem":"2.2rem",color:"#1e3a5f"}}>
                  {card.back}
                </span>
                {card.hint && !hasEmoji && (
                  <span className="text-sm mt-2 italic text-center px-6" style={{color:"#94a3b8"}}>
                    {card.hint}
                  </span>
                )}
                <div className="mt-6 flex items-center gap-1.5" style={{color:"#cbd5e1"}}>
                  <span style={{fontSize:"0.7rem"}}>← свайп / нажми →</span>
                </div>
              </div>

            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-4 flex-wrap justify-center" style={{maxWidth:280}}>
            {activeSet.cards.map((c,i)=>(
              <div key={c.id} className="rounded-full transition-all duration-300"
                style={{
                  width:i===cardIndex?20:6,height:6,
                  background:i<cardIndex?activeSet.glow:i===cardIndex?"#1d4ed8":"#e2e8f0",
                  opacity:i<cardIndex?0.55:1,
                }}/>
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <div className="px-4 pb-24 pt-2 md:max-w-[540px] md:mx-auto">
          <div className="flex gap-3">
            {cardIndex>0 && (
              <button onClick={handleStudyPrev}
                className="py-4 px-6 rounded-2xl font-bold text-base transition active:scale-95"
                style={{background:"white",color:"#475569",border:"2px solid #e2e8f0"}}>←</button>
            )}
            <button onClick={handleStudyNext}
              className="flex-1 py-4 rounded-2xl font-bold text-base text-white transition active:scale-95"
              style={{background:activeSet.gradient,boxShadow:`0 4px 16px -4px ${activeSet.glow}66`}}>
              {cardIndex+1>=total?"Завершить ✓":"Следующая →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // QUIZ MODE
  // ════════════════════════════════════════════════════════════
  if(phase==="quiz" && activeSet && shuffledCards.length>0){
    const card   = shuffledCards[cardIndex];
    const total  = shuffledCards.length;
    const correct= card.back;

    const optStyle = (opt: string): React.CSSProperties => {
      if(!quizAnswered) return {background:"white",color:"#0f172a",border:"2px solid #e2e8f0"};
      if(opt===correct)    return {background:"#ecfdf5",color:"#15803d",border:"2px solid #bbf7d0"};
      if(opt===quizSelected) return {background:"#fef2f2",color:"#dc2626",border:"2px solid #fecaca"};
      return {background:"#f8faff",color:"#94a3b8",border:"2px solid #f1f5f9"};
    };
    const optIcon = (opt: string) => {
      if(!quizAnswered) return null;
      if(opt===correct)     return <span>✓</span>;
      if(opt===quizSelected)return <span>✗</span>;
      return null;
    };

    return (
      <div className="flex flex-col min-h-screen" style={{background:"#f8faff"}}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{paddingTop:"calc(env(safe-area-inset-top) + 12px)",background:"white",borderBottom:"1px solid #e2e8f0"}}>
          <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#f1f5f9"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 rounded-full overflow-hidden" style={{height:8,background:"#e2e8f0"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${(cardIndex/total)*100}%`,background:"linear-gradient(90deg,#f59e0b,#d97706)"}}/>
          </div>
          <span className="text-xs font-bold w-16 text-right" style={{color:"#64748b"}}>
            {cardIndex+1}/{total} · 🎯{quizCorrectCount}
          </span>
        </div>

        <div className="px-4 pt-2 pb-1">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{background:"linear-gradient(135deg,#fbbf24,#d97706)",color:"white"}}>
            🎯 {activeSet.emoji} {activeSet.title}
          </span>
        </div>

        {/* Question */}
        <div className="px-5 pt-4 pb-3 md:max-w-[540px] md:mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{color:"#94a3b8"}}>
            Переведи на русский:
          </p>
          <div className="w-full rounded-3xl p-5 flex flex-col items-center justify-center"
            style={{background:"white",border:"2px solid #e2e8f0",boxShadow:"0 4px 20px rgba(0,0,0,0.06)",minHeight:90}}>
            {card.emoji && <span style={{fontSize:"2.5rem",lineHeight:1,marginBottom:8}}>{card.emoji}</span>}
            {card.color && <div style={{width:52,height:52,borderRadius:12,background:card.color,border:"2px solid rgba(0,0,0,0.08)",marginBottom:8}}/>}
            <span className="text-3xl font-bold text-center leading-tight" style={{color:"#0f172a"}}>{card.front}</span>
            {card.hint && <span className="text-xs mt-1 italic" style={{color:"#94a3b8"}}>{card.hint}</span>}
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 px-5 flex flex-col gap-2.5 pb-3 md:max-w-[540px] md:mx-auto">
          {quizOptions.map(opt=>(
            <button key={opt} onClick={()=>handleQuizAnswer(opt)} disabled={quizAnswered}
              className="w-full py-3.5 px-5 rounded-2xl font-semibold text-base transition-all duration-150 active:scale-97 flex items-center justify-between"
              style={{...optStyle(opt),boxShadow:!quizAnswered?"0 2px 8px rgba(0,0,0,0.05)":"none"}}>
              <span>{opt}</span>
              {optIcon(opt)}
            </button>
          ))}
        </div>

        <div className="px-5 pb-24 pt-1 md:max-w-[540px] md:mx-auto">
          {quizAnswered && (
            <button onClick={handleQuizNext}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition active:scale-95 card-reveal"
              style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",boxShadow:"0 4px 16px -4px #d9770666"}}>
              {cardIndex+1>=total?"Посмотреть результат →":"Следующая →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
