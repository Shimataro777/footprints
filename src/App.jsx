import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  BookOpen, Search, TrendingUp, BookMarked, Plus, X, Check,
  Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, Star, Award,
  Sparkles, Play, Home, Download, Link as LinkIcon, SlidersHorizontal, Upload, ImagePlus, Menu, Pin, Bookmark
} from "lucide-react";

/* ============================================================
   聖書マスタデータ（正式名 / 別名 / 章数）
   ============================================================ */
const BOOKS = [
  { name: "創世記", aliases: ["創"], chapters: 50 },
  { name: "出エジプト記", aliases: ["出"], chapters: 40 },
  { name: "レビ記", aliases: ["レビ"], chapters: 27 },
  { name: "民数記", aliases: ["民"], chapters: 36 },
  { name: "申命記", aliases: ["申"], chapters: 34 },
  { name: "ヨシュア記", aliases: ["ヨシュア"], chapters: 24 },
  { name: "士師記", aliases: [], chapters: 21 },
  { name: "ルツ記", aliases: ["ルツ"], chapters: 4 },
  { name: "サムエル記 第一", aliases: ["サムエル記第一", "サムエル上", "Ⅰサムエル", "1サムエル"], chapters: 31 },
  { name: "サムエル記 第二", aliases: ["サムエル記第二", "サムエル下", "Ⅱサムエル", "2サムエル"], chapters: 24 },
  { name: "列王記 第一", aliases: ["列王記第一", "列王記上", "Ⅰ列王記", "1列王記"], chapters: 22 },
  { name: "列王記 第二", aliases: ["列王記第二", "列王記下", "Ⅱ列王記", "2列王記"], chapters: 25 },
  { name: "歴代誌 第一", aliases: ["歴代誌第一", "歴代誌上", "Ⅰ歴代誌", "1歴代誌"], chapters: 29 },
  { name: "歴代誌 第二", aliases: ["歴代誌第二", "歴代誌下", "Ⅱ歴代誌", "2歴代誌"], chapters: 36 },
  { name: "エズラ記", aliases: ["エズラ"], chapters: 10 },
  { name: "ネヘミヤ記", aliases: ["ネヘミヤ"], chapters: 13 },
  { name: "エステル記", aliases: ["エステル"], chapters: 10 },
  { name: "ヨブ記", aliases: ["ヨブ"], chapters: 42 },
  { name: "詩篇", aliases: ["詩編", "詩"], chapters: 150 },
  { name: "箴言", aliases: [], chapters: 31 },
  { name: "伝道者の書", aliases: ["伝道の書", "コヘレトの言葉", "伝道者の書"], chapters: 12 },
  { name: "雅歌", aliases: [], chapters: 8 },
  { name: "イザヤ書", aliases: ["イザヤ"], chapters: 66 },
  { name: "エレミヤ書", aliases: ["エレミヤ"], chapters: 52 },
  { name: "哀歌", aliases: [], chapters: 5 },
  { name: "エゼキエル書", aliases: ["エゼキエル"], chapters: 48 },
  { name: "ダニエル書", aliases: ["ダニエル"], chapters: 12 },
  { name: "ホセア書", aliases: ["ホセア"], chapters: 14 },
  { name: "ヨエル書", aliases: ["ヨエル"], chapters: 3 },
  { name: "アモス書", aliases: ["アモス"], chapters: 9 },
  { name: "オバデヤ書", aliases: ["オバデヤ"], chapters: 1 },
  { name: "ヨナ書", aliases: ["ヨナ"], chapters: 4 },
  { name: "ミカ書", aliases: ["ミカ"], chapters: 7 },
  { name: "ナホム書", aliases: ["ナホム"], chapters: 3 },
  { name: "ハバクク書", aliases: ["ハバクク"], chapters: 3 },
  { name: "ゼパニヤ書", aliases: ["ゼパニヤ"], chapters: 3 },
  { name: "ハガイ書", aliases: ["ハガイ"], chapters: 2 },
  { name: "ゼカリヤ書", aliases: ["ゼカリヤ"], chapters: 14 },
  { name: "マラキ書", aliases: ["マラキ"], chapters: 4 },
  { name: "マタイの福音書", aliases: ["マタイ"], chapters: 28 },
  { name: "マルコの福音書", aliases: ["マルコ"], chapters: 16 },
  { name: "ルカの福音書", aliases: ["ルカ"], chapters: 24 },
  { name: "ヨハネの福音書", aliases: ["ヨハネ"], chapters: 21 },
  { name: "使徒の働き", aliases: ["使徒言行録", "使徒行伝", "使徒"], chapters: 28 },
  { name: "ローマ人への手紙", aliases: ["ローマの信徒への手紙", "ローマ書", "ローマ"], chapters: 16 },
  { name: "コリント人への手紙 第一", aliases: ["コリント人への手紙第一", "コリント人への第一の手紙", "コリント第一", "Ⅰコリント", "1コリント"], chapters: 16 },
  { name: "コリント人への手紙 第二", aliases: ["コリント人への手紙第二", "コリント人への第二の手紙", "コリント第二", "Ⅱコリント", "2コリント"], chapters: 13 },
  { name: "ガラテヤ人への手紙", aliases: ["ガラテヤ書", "ガラテヤ"], chapters: 6 },
  { name: "エペソ人への手紙", aliases: ["エペソ書", "エフェソの信徒への手紙", "エペソ"], chapters: 6 },
  { name: "ピリピ人への手紙", aliases: ["ピリピ書", "フィリピの信徒への手紙", "ピリピ"], chapters: 4 },
  { name: "コロサイ人への手紙", aliases: ["コロサイ書", "コロサイ"], chapters: 4 },
  { name: "テサロニケ人への手紙 第一", aliases: ["テサロニケ人への手紙第一", "テサロニケ人への第一の手紙", "テサロニケ第一", "Ⅰテサロニケ", "1テサロニケ"], chapters: 5 },
  { name: "テサロニケ人への手紙 第二", aliases: ["テサロニケ人への手紙第二", "テサロニケ人への第二の手紙", "テサロニケ第二", "Ⅱテサロニケ", "2テサロニケ"], chapters: 3 },
  { name: "テモテへの手紙 第一", aliases: ["テモテへの手紙第一", "テモテへの第一の手紙", "テモテ第一", "Ⅰテモテ", "1テモテ"], chapters: 6 },
  { name: "テモテへの手紙 第二", aliases: ["テモテへの手紙第二", "テモテへの第二の手紙", "テモテ第二", "Ⅱテモテ", "2テモテ"], chapters: 4 },
  { name: "テトスへの手紙", aliases: ["テトス書", "テトス"], chapters: 3 },
  { name: "ピレモンへの手紙", aliases: ["ピレモン書", "ピレモン"], chapters: 1 },
  { name: "ヘブル人への手紙", aliases: ["ヘブル書", "ヘブライ人への手紙", "ヘブル"], chapters: 13 },
  { name: "ヤコブの手紙", aliases: ["ヤコブ書", "ヤコブ"], chapters: 5 },
  { name: "ペテロの手紙 第一", aliases: ["ペテロの手紙第一", "ペテロの第一の手紙", "ペテロ第一", "Ⅰペテロ", "1ペテロ"], chapters: 5 },
  { name: "ペテロの手紙 第二", aliases: ["ペテロの手紙第二", "ペテロの第二の手紙", "ペテロ第二", "Ⅱペテロ", "2ペテロ"], chapters: 3 },
  { name: "ヨハネの手紙 第一", aliases: ["ヨハネの手紙第一", "ヨハネの第一の手紙", "ヨハネ第一の手紙", "Ⅰヨハネ", "1ヨハネ"], chapters: 5 },
  { name: "ヨハネの手紙 第二", aliases: ["ヨハネの手紙第二", "ヨハネの第二の手紙", "ヨハネ第二の手紙", "Ⅱヨハネ", "2ヨハネ"], chapters: 1 },
  { name: "ヨハネの手紙 第三", aliases: ["ヨハネの手紙第三", "ヨハネの第三の手紙", "ヨハネ第三の手紙", "Ⅲヨハネ", "3ヨハネ"], chapters: 1 },
  { name: "ユダの手紙", aliases: ["ユダ書", "ユダ"], chapters: 1 },
  { name: "ヨハネの黙示録", aliases: ["黙示録"], chapters: 22 },
];

/* 実績画面で66巻を折りたたむためのまとまり（BOOKS の並び順に対応） */
const BOOK_GROUPS = [
  { label: "モーセ五書", from: 0, to: 4 },
  { label: "歴史書", from: 5, to: 16 },
  { label: "詩歌書", from: 17, to: 21 },
  { label: "大預言書", from: 22, to: 26 },
  { label: "小預言書", from: 27, to: 38 },
  { label: "福音書と使徒の働き", from: 39, to: 43 },
  { label: "パウロの手紙", from: 44, to: 56 },
  { label: "その他の手紙と黙示録", from: 57, to: 65 },
];

const bookByName = (name) => BOOKS.find((b) => b.name === name);
const bookIndexOf = (name) => { const i = BOOKS.findIndex((b) => b.name === name); return i === -1 ? 9999 : i; };

/* ============================================================
   聖書箇所パース関数
   ============================================================ */
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
const BOOK_NAME_TABLE = BOOKS.flatMap((b) => {
  const names = [b.name, ...b.aliases];
  const withSpacedVariants = [];
  names.forEach((n) => {
    withSpacedVariants.push(n);
    const m = n.match(/^(.+?)(第[一二三])(.*)$/);
    if (m && !n.includes(" ")) withSpacedVariants.push(`${m[1]} ${m[2]}${m[3]}`);
  });
  return withSpacedVariants.map((n) => ({ n, canonical: b.name }));
}).sort((a, b) => b.n.length - a.n.length);
const BOOK_PATTERN = BOOK_NAME_TABLE.map((b) => escapeRegExp(b.n)).join("|");
/* 「申命記 6:5」「ヨハネ 3章」「詩篇 23」のように、節が無く章だけでも拾えるようにしている。
   章のまたぎ（「創世記 2章-5章」）も拾う。
   分かれ道は上から順に試されるので、**並べ替えないこと**。
   ① 章の範囲「2章-5章」「2-5章」  ← 終わりに「章」が付く形
   ② 章の範囲「2章-5」            ← 始めにだけ「章」が付く形
   ③ 節「6:5」「6章5」、範囲つきの「3:16-18」
   ④ 章だけ「3章」
   なお「創世記 2-5」のように「章」がどこにも無い書き方は、
   節なのか章なのか決められないため、これまでどおり章2として扱う */
const REF_REGEX = new RegExp(
  `(${BOOK_PATTERN})\\s*(\\d+)\\s*` +
  `(?:` +
    `章?\\s*[-〜~]\\s*(\\d+)\\s*章` +
    `|章\\s*[-〜~]\\s*(\\d+)` +
    `|[:：章]\\s*(\\d+)(?:\\s*[-〜~]\\s*(\\d+))?` +
    `|章` +
  `)?`,
  "g"
);

function parseBibleRefs(text) {
  if (!text) return [];
  const refs = []; const seen = new Set(); let match;
  REF_REGEX.lastIndex = 0;
  while ((match = REF_REGEX.exec(text)) !== null) {
    const found = BOOK_NAME_TABLE.find((b) => b.n === match[1]);
    if (!found) continue;
    const chapter = parseInt(match[2], 10);
    /* ①と②のどちらで拾えても、終わりの章は同じ意味 */
    const endRaw = match[3] || match[4];
    let chapterEnd = endRaw ? parseInt(endRaw, 10) : undefined;
    /* 逆向き（5章-2章）や、その書に無い章数は範囲として扱わない */
    const maxCh = (bookByName(found.canonical) || {}).chapters || 0;
    if (chapterEnd !== undefined && (chapterEnd <= chapter || (maxCh && chapterEnd > maxCh))) chapterEnd = undefined;
    const ref = {
      book: found.canonical,
      chapter,
      chapterEnd,
      verse: match[5] ? parseInt(match[5], 10) : undefined,
      verseEnd: match[6] ? parseInt(match[6], 10) : undefined,
    };
    const key = `${ref.book}-${ref.chapter}-${ref.chapterEnd || ""}-${ref.verse || ""}-${ref.verseEnd || ""}`;
    if (!seen.has(key)) { seen.add(key); refs.push(ref); }
  }
  return refs;
}
function formatRef(ref) {
  if (!ref || !ref.book) return "";
  let s = ref.book;
  if (ref.chapter) s += ` ${ref.chapter}`;
  /* 章をまたぐときは「創世記 2-5」と続けて見せる */
  if (ref.chapterEnd && ref.chapterEnd > ref.chapter) s += `-${ref.chapterEnd}`;
  if (ref.verse) s += `:${ref.verse}`;
  if (ref.verseEnd) s += `-${ref.verseEnd}`;
  return s;
}
function sameRef(a, b) { if (!a || !b) return false; return a.book === b.book && a.chapter === b.chapter && (a.verse || null) === (b.verse || null); }
function primaryRef(text) { const refs = parseBibleRefs(text); return refs[0] || null; }
function truncateAtCitation(text) {
  if (!text) return text;
  const parenRegex = /\([^)]*\)/g;
  let match, lastEnd = null;
  while ((match = parenRegex.exec(text)) !== null) { if (parseBibleRefs(match[0]).length > 0) lastEnd = match.index + match[0].length; }
  if (lastEnd != null) return text.slice(0, lastEnd).trim();
  return text.trim();
}
function formatChapterList(nums) {
  if (!nums || !nums.length) return "";
  const sorted = [...nums].sort((a, b) => a - b);
  const parts = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) { prev = cur; continue; }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = cur; prev = cur;
  }
  return parts.join(", ");
}

/* ============================================================
   自由タグ
   決まった一覧は持たない。これまでに使われた言葉を集めて候補にするので、
   新しいタグが増えても探す側の作りを直す必要はない
   ============================================================ */
const TAG_MAX = 24;
function normalizeTags(list) {
  if (!Array.isArray(list)) return [];
  const out = []; const seen = new Set();
  list.forEach((t) => {
    const s = String(t == null ? "" : t).replace(/\s+/g, " ").trim().slice(0, TAG_MAX);
    if (!s) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key); out.push(s);
  });
  return out;
}
/* すべての記録から、使われているタグを「よく使う順」に集める */
function allTagsOf(records) {
  const count = new Map();
  (records || []).forEach((r) => (r.tags || []).forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")).map(([t]) => t);
}

/* ============================================================
   本文の中のURL
   参考資料の項目を廃止したので、URLはメモ欄に直接貼ってもらう。
   閲覧画面では、押せるリンクとして描く
   ============================================================ */
const URL_REGEX = /https?:\/\/[^\s<>"'）)】」、。]+/g;
/* 文章を「URLの部分」と「それ以外」に切り分けて返す。
   末尾の句点やカンマはURLに含めない（「…example.com。」のような書き方に備える）。
   切り分けの決まりはここ1か所にまとめること。
   同じ処理を描画側にも書くと、片方だけ直したときに食い違う */
function splitByUrl(text) {
  const segs = [];
  if (!text) return segs;
  let last = 0, m;
  URL_REGEX.lastIndex = 0;
  while ((m = URL_REGEX.exec(text)) !== null) {
    const raw = m[0];
    const url = raw.replace(/[.,]+$/, "");
    const end = m.index + url.length;
    if (m.index > last) segs.push({ url: null, text: text.slice(last, m.index) });
    segs.push({ url, text: url });
    last = end;
  }
  if (last < text.length) segs.push({ url: null, text: text.slice(last) });
  return segs;
}




/* ============================================================
   レコード関連ヘルパ
   ============================================================ */
function recordAllText(r) {
  const parts = [];
  if (r.type === "reading") { parts.push(r.notes); }
  else if (r.type === "message") {
    parts.push(r.passageText, r.purpose, r.mainVerseText, r.notes);

  }
  else if (r.type === "memorization") { parts.push(r.text, r.note); }
  else if (r.type === "memo") { parts.push(r.notes); }
  /* タグも言葉で探せるようにする。これで「タグ用の探し方」を別に作らずに済む */
  parts.push(...(r.tags || []));
  return parts.filter(Boolean).join("\n");
}
function recordRefs(r) {
  const refs = [];
  /* 章をまたぐ箇所（創世記 2章-5章）は、間の章もすべて数え上げる。
     こうしないと「4章」で探したときに見つからない */
  parseBibleRefs(recordAllText(r)).forEach((x) => {
    refs.push(x);
    if (x.chapterEnd && x.chapterEnd > x.chapter) {
      for (let c = x.chapter + 1; c <= x.chapterEnd; c++) refs.push({ book: x.book, chapter: c });
    }
  });
  if (r.type === "reading" && r.book) {
    if (r.chapters && r.chapters.length > 0) r.chapters.forEach((c) => refs.push({ book: r.book, chapter: c }));
    else refs.push({ book: r.book, chapter: null });
  }
  /* その他は書を持たなくなったが、古い記録が読み込まれた場合に備えて残しておく */
  if (r.type === "memo" && r.book) refs.push({ book: r.book, chapter: null });
  return refs;
}
function primarySortRef(r) {
  if (r.type === "reading") return { book: r.book || null, chapter: r.chapters && r.chapters.length ? Math.min(...r.chapters) : null, verse: null };
  if (r.type === "memo") return { book: r.book || null, chapter: null, verse: null };
  if (r.type === "message") return primaryRef(r.mainVerseText) || primaryRef(recordAllText(r)) || {};
  if (r.type === "memorization") return primaryRef(r.text) || {};
  return {};
}
function compareForSearch(a, b) {
  const ra = primarySortRef(a), rb = primarySortRef(b);
  const ba = bookIndexOf(ra.book), bb = bookIndexOf(rb.book);
  if (ba !== bb) return ba - bb;
  const ma = a.type === "memo" ? 0 : 1, mb = b.type === "memo" ? 0 : 1;
  if (ma !== mb) return ma - mb;
  const ca = ra.chapter ?? 9999, cb = rb.chapter ?? 9999;
  if (ca !== cb) return ca - cb;
  const va = ra.verse ?? 9999, vb = rb.verse ?? 9999;
  if (va !== vb) return va - vb;
  return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
}
function chipRefs(refs) {
  const map = new Map();
  refs.forEach((r) => { if (!r.book) return; const key = `${r.book}-${r.chapter || ""}`; if (!map.has(key)) map.set(key, r); });
  return Array.from(map.values()).slice(0, 4);
}

/* ============================================================
   ストレージ
   ============================================================ */
/* ============================================================
   保存まわり
   ・まず専用ストレージ、だめなら端末のlocalStorageへ、と二段構えにしている
     （片方が使えない環境でも記録が消えないようにするため）
   ============================================================ */
async function storageGet(key) {
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      const res = await window.storage.get(key, false);
      if (res && typeof res.value === "string") return res.value;
    }
  } catch (e) { /* 次の手段へ */ }
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
async function storageSet(key, value) {
  let firstError = null;
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      await window.storage.set(key, value, false);
      try { localStorage.setItem(key, value); } catch (e) { /* 控えの保存は失敗しても構わない */ }
      return { ok: true };
    }
  } catch (e) { firstError = e; }
  try {
    localStorage.setItem(key, value);
    return { ok: true };
  } catch (e) {
    const err = firstError || e;
    return { ok: false, message: (err && err.message) ? err.message : String(err) };
  }
}

const STORAGE_KEY = "bible-tracker-records";
async function loadRecords() {
  try {
    const raw = await storageGet(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    /* 中身が壊れていても起動できるようにする。
       配列でなければ空として扱い、記録らしくないものは取り除く */
    if (!Array.isArray(data)) return [];
    return data.filter((r) => r && typeof r === "object" && !Array.isArray(r));
  }
  catch (e) { return []; }
}
async function persistRecords(records) {
  const res = await storageSet(STORAGE_KEY, JSON.stringify(records));
  if (!res.ok) console.error("保存に失敗しました", res.message);
  return res;
}

/* ユーザーが描いたイラスト。記録とは別に保管する */
const ART_KEY = "bible-tracker-illustrations";
const ART_MAX = 5;
const ART_TOTAL_LIMIT = 2_500_000; // 保存する文字数の上限（安全側に設定）
async function loadArtworks() {
  try {
    const raw = await storageGet(ART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((a) => a && typeof a === "object" && a.src);
  }
  catch (e) { return []; }
}
async function persistArtworks(list) {
  const payload = JSON.stringify(list);
  if (payload.length > ART_TOTAL_LIMIT) {
    return { ok: false, message: "イラストの合計サイズが大きすぎます。枚数を減らしてください。" };
  }
  return await storageSet(ART_KEY, payload);
}

/* ============================================================
   画面のカスタマイズ（テーマカラーなど）
   ============================================================ */
const THEMES = [
  { key: "teal",   label: "深い緑",   swatch: "#0F766E", vars: { 50:"#F0FDFA",100:"#CCFBF1",200:"#99F6E4",300:"#5EEAD4",600:"#0D9488",700:"#0F766E",800:"#115E59",900:"#134E4A" } },
  /* もとは藍色だったが、菫と見分けがつきにくかったので空色に差し替えた。
     key（"indigo"）は保存された設定と結びついているので変えないこと。
     変えると、この色を選んでいた人の設定が既定の色に戻ってしまう */
  { key: "indigo", label: "空",       swatch: "#0369A1", vars: { 50:"#F0F9FF",100:"#E0F2FE",200:"#BAE6FD",300:"#7DD3FC",600:"#0284C7",700:"#0369A1",800:"#075985",900:"#0C4A6E" } },
  { key: "rose",   label: "臙脂",     swatch: "#BE123C", vars: { 50:"#FFF1F2",100:"#FFE4E6",200:"#FECDD3",300:"#FDA4AF",600:"#E11D48",700:"#BE123C",800:"#9F1239",900:"#881337" } },
  { key: "amber",  label: "琥珀",     swatch: "#B45309", vars: { 50:"#FFFBEB",100:"#FEF3C7",200:"#FDE68A",300:"#FCD34D",600:"#D97706",700:"#B45309",800:"#92400E",900:"#78350F" } },
  { key: "violet", label: "菫",       swatch: "#6D28D9", vars: { 50:"#F5F3FF",100:"#EDE9FE",200:"#DDD6FE",300:"#C4B5FD",600:"#7C3AED",700:"#6D28D9",800:"#5B21B6",900:"#4C1D95" } },
  { key: "slate",  label: "墨",       swatch: "#334155", vars: { 50:"#F8FAFC",100:"#F1F5F9",200:"#E2E8F0",300:"#CBD5E1",600:"#475569",700:"#334155",800:"#1E293B",900:"#0F172A" } },
];
/* 書きかけの記録（自動下書き）。アプリが不意に閉じても失われないようにする */
const DRAFT_KEY = "bible-tracker-draft";
async function loadDraft() {
  try {
    const raw = await storageGet(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || !d.rec || !d.rec.type) return null;
    return d;
  } catch (e) { return null; }
}
async function persistDraft(d) { try { return await storageSet(DRAFT_KEY, JSON.stringify(d)); } catch (e) { return null; } }
async function clearDraft() { try { return await storageSet(DRAFT_KEY, ""); } catch (e) { return null; } }

/* 中身が空っぽの記録かどうか。空の下書きは残さない */
function hasContent(rec) {
  if (!rec) return false;
  const base = emptyRecord(rec.type);
  return Object.keys(base).some((k) => {
    if (k === "id" || k === "createdAt" || k === "date" || k === "type") return false;
    const v = rec[k], d = base[k];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "string") return v.trim() !== "";
    return v !== d && v !== null && v !== undefined && v !== false;
  });
}

/* 育てている木と、収穫した実の記録 */
const GARDEN_KEY = "bible-tracker-garden";
const DEFAULT_GARDEN = { cycle: null, harvests: [] };
async function loadGarden() {
  try {
    const raw = await storageGet(GARDEN_KEY);
    if (!raw) return { ...DEFAULT_GARDEN };
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || Array.isArray(d)) return { ...DEFAULT_GARDEN };
    const cycle = d.cycle && typeof d.cycle === "object" && d.cycle.fruit && d.cycle.startedAt ? d.cycle : null;
    const harvests = Array.isArray(d.harvests) ? d.harvests.filter((h) => h && h.fruit && h.date) : [];
    return { cycle, harvests };
  } catch (e) { return { ...DEFAULT_GARDEN }; }
}
async function persistGarden(g) {
  return await storageSet(GARDEN_KEY, JSON.stringify(g));
}

/* 記録の種類ごとの説明文（＋を押したときに出る案内） */
const TYPEDESC_KEY = "bible-tracker-typedesc";
const DEFAULT_TYPE_NAME = { ...{ reading: "通読", message: "学び", memorization: "聖句", memo: "その他" } };
/* 画面のどこからでも、設定した種類名を引けるようにする */
const TypeNameContext = React.createContext(DEFAULT_TYPE_NAME);
const useTypeName = () => React.useContext(TypeNameContext) || DEFAULT_TYPE_NAME;
const DEFAULT_TYPE_DESC = {
  reading: "今日読んだ箇所と、感じたこと",
  message: "礼拝や集会で聞いた話",
  memorization: "心にとめておきたいことば",
  memo: "テーマごとの覚え書き",
};
async function loadTypeDesc() {
  const fallback = { desc: { ...DEFAULT_TYPE_DESC }, name: { ...DEFAULT_TYPE_NAME } };
  try {
    const raw = await storageGet(TYPEDESC_KEY);
    if (!raw) return fallback;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || Array.isArray(d)) return fallback;
    /* 説明文だけを保存していた古い形にも対応する */
    if (d.desc || d.name) {
      return { desc: { ...DEFAULT_TYPE_DESC, ...(d.desc || {}) }, name: { ...DEFAULT_TYPE_NAME, ...(d.name || {}) } };
    }
    return { desc: { ...DEFAULT_TYPE_DESC, ...d }, name: { ...DEFAULT_TYPE_NAME } };
  } catch (e) { return fallback; }
}
async function persistTypeDesc(d) { try { return await storageSet(TYPEDESC_KEY, JSON.stringify(d)); } catch (e) { return null; } }

const PREF_KEY = "bible-tracker-prefs";
/* motion＝画面の動きの演出。true で有効。
   古い保存内容には motion が入っていないが、loadPrefs で既定値と混ぜるため
   これまで使っていた人も自動的に「あり」で始まる */
/* fontSize＝文字の大きさ。"s"（これまでと同じ）／"m"／"l"。
   古い保存内容には入っていないが、loadPrefs で既定値と混ぜるため
   これまで使っていた人はこれまでどおりの大きさで始まる */
const DEFAULT_PREFS = { theme: "teal", showMascots: true, lastBackup: null, motion: true, fontSize: "s" };
const FONT_SIZES = [
  { key: "s", label: "小" },
  { key: "m", label: "中" },
  { key: "l", label: "大" },
];
const BACKUP_REMIND_DAYS = 14; // これだけ日が空いたら、そっとお知らせする
/* 前回の書き出し以降に作られた・書き直された記録の数 */
function unsavedCount(records, prefs) {
  const last = prefs && prefs.lastBackup ? prefs.lastBackup : null;
  if (!last) return records.length;
  return records.filter((r) => (r.updatedAt || r.createdAt || "") > last).length;
}
async function loadPrefs() {
  try {
    const raw = await storageGet(PREF_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch (e) { return { ...DEFAULT_PREFS }; }
}
async function persistPrefs(prefs) {
  return await storageSet(PREF_KEY, JSON.stringify(prefs));
}

/* 記録画面の下に添えるひとこと。記録の種類ごとに好きな言葉へ変えられる */
/* ============================================================
   タグマスタ（登録済みのタグ一覧）
   記録に付いているタグから毎回集めるだけだと、
   その記録を消したとたんタグも消えてしまい、次から選べなくなる。
   別に一覧として持っておくことで、言い回しのゆれや重複を防ぐ
   ============================================================ */
const TAG_KEY = "bible-tracker-tags";
async function loadTagMaster() {
  try {
    const raw = await storageGet(TAG_KEY);
    return raw ? normalizeTags(JSON.parse(raw)) : [];
  } catch (e) { return []; }
}
async function persistTagMaster(list) {
  return await storageSet(TAG_KEY, JSON.stringify(normalizeTags(list)));
}

const CAPTION_KEY = "bible-tracker-captions";
const DEFAULT_CAPTIONS = {
  reading: "今日も、みことばに触れられましたね",
  message: "受け取ったことを、書き残しておきましょう",
  memorization: "くり返し口ずさんでみましょう",
  memo: "気づいたことを、忘れないうちに",
  empty: "",
};
async function loadCaptions() {
  try {
    const raw = await storageGet(CAPTION_KEY);
    return raw ? { ...DEFAULT_CAPTIONS, ...JSON.parse(raw) } : { ...DEFAULT_CAPTIONS };
  } catch (e) { return { ...DEFAULT_CAPTIONS }; }
}
async function persistCaptions(map) {
  return await storageSet(CAPTION_KEY, JSON.stringify(map));
}

/* 端末の容量を圧迫しないよう、しっかり縮めてから保存する。
   線画などの透過を活かしたいので、軽ければPNG、重ければWebP→JPEGの順に切り替える */
function shrinkImage(file, maxSide = 220) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("画像を読み込めませんでした"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("画像を解析できませんでした"));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          const png = canvas.toDataURL("image/png");
          if (png.length <= 90000) return resolve(png); // 透過を保てる軽さならPNGのまま

          const webp = canvas.toDataURL("image/webp", 0.85);
          if (webp.startsWith("data:image/webp") && webp.length <= 120000) return resolve(webp);

          const c2 = document.createElement("canvas");
          c2.width = w; c2.height = h;
          const x2 = c2.getContext("2d");
          x2.fillStyle = "#FFFFFF"; x2.fillRect(0, 0, w, h);
          x2.drawImage(img, 0, 0, w, h);
          resolve(c2.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          reject(new Error("画像を変換できませんでした"));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
/* 端末の地域の日付を返す。
   以前は世界標準時で計算していたため、日本では朝9時より前だと「前日」になっていた */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const curYear = () => new Date().getFullYear();
const curMonth = () => new Date().getMonth() + 1;

/* 旧い書の名前 → 新しい書の名前。別名表からその場で作る */
const BOOK_RENAME = (() => {
  const map = {};
  BOOKS.forEach((b) => (b.aliases || []).forEach((a) => { if (!map[a]) map[a] = b.name; }));
  BOOKS.forEach((b) => { delete map[b.name]; });
  return map;
})();
const canonicalBook = (name) => (name && BOOK_RENAME[name]) || name;

function migrateRecord(r) {
  if (!r || typeof r !== "object") return null;
  if (r.book && BOOK_RENAME[r.book]) r = { ...r, book: BOOK_RENAME[r.book] };
  if (["reading", "message", "memo"].includes(r.type) && !r.questionItems) {
    const items = [];
    if ((r.questions || "").trim() || (r.resolved || "").trim()) items.push({ id: uid(), text: [r.questions, r.resolved].filter((x) => (x || "").trim()).join("\n\n"), resolved: !!r.questionResolved });
    r = { ...r, questionItems: items };
  }
  /* 記録の種類「疑問」と「疑問メモ」は廃止した。タグで足りるようになったため。
     ただし書かれた内容は捨てない。「疑問」の記録は「その他」に移し、
     疑問メモは元の記録のメモ欄の末尾へ移したうえで、タグ「疑問」を付けておく。
     こうしておけば、これまでどおり探し出せる */
  if (r.type === "question") {
    const body = (r.text || "").trim();
    const tags = [...(r.tags || []), "疑問"];
    if (r.resolved) tags.push("解決済み");
    r = { ...r, type: "memo", notes: [body, (r.notes || "").trim()].filter(Boolean).join("\n\n"), tags };
    delete r.text; delete r.resolved;
  }
  if (Array.isArray(r.questionItems)) {
    const items = r.questionItems.filter((q) => q && (q.text || "").trim());
    r = { ...r };
    if (items.length) {
      const lines = items.map((q) => `疑問${q.resolved ? "（解決済み）" : ""}: ${q.text.trim()}`);
      const base = (r.notes || "").trim();
      r.notes = (base ? base + "\n\n" : "") + lines.join("\n\n");
      r.tags = [...(r.tags || []), "疑問"];
      if (items.every((q) => q.resolved)) r.tags.push("解決済み");
    }
    delete r.questionItems;
  }
  if (["memo", "message"].includes(r.type)) {
    if (!r.links) r = { ...r, links: r.youtubeUrl ? [{ id: uid(), url: r.youtubeUrl, label: "" }] : [] };
    else if (r.links.some((l) => l.label === undefined)) r = { ...r, links: r.links.map((l) => ({ label: "", ...l })) };
  }
  /* 「参考資料」は廃止した。URLはメモ欄に直接貼る作りに変えたので、
     これまでに登録された分をメモ欄の末尾へ移してから、項目そのものを外す。
     消さずに移すこと。ここで捨てると、利用者の記録が黙って失われる */
  if (Array.isArray(r.links)) {
    const lines = r.links.filter((l) => l && (l.url || "").trim())
      .map((l) => ((l.label || "").trim() ? `${l.label.trim()} ${l.url.trim()}` : l.url.trim()));
    r = { ...r };
    if (lines.length) {
      const base = (r.notes || "").trim();
      r.notes = (base ? base + "\n\n" : "") + lines.join("\n");
    }
    delete r.links;
    delete r.youtubeUrl;
  }
  /* 「その他」から「テーマ」と「書」を廃止した。
     テーマは短ければタグへ、長ければメモ欄の先頭へ。書はタグへ移す */
  if (r.type === "memo" && (r.theme !== undefined || r.book !== undefined)) {
    const theme = (r.theme || "").trim();
    const book = (r.book || "").trim();
    const add = [];
    if (book) add.push(book);
    r = { ...r };
    if (theme && theme.length <= 24 && !theme.includes("\n")) add.push(theme);
    else if (theme) {
      const base = (r.notes || "").trim();
      r.notes = theme + (base ? "\n\n" + base : "");
    }
    if (add.length) r.tags = [...(r.tags || []), ...add];
    delete r.theme;
    delete r.book;
  }
  if (!Array.isArray(r.tags)) r = { ...r, tags: [] };
  else r = { ...r, tags: normalizeTags(r.tags) };
  if (r.type === "reading" && r.notes === undefined) {
    r = { ...r, notes: (r.impressiveVerses || []).map((v) => v.text).filter(Boolean).join("\n\n") };
  }
  if (r.type === "message" && r.notes === undefined) {
    r = { ...r, notes: (r.appearedVerses || []).map((v) => v.text).filter(Boolean).join("\n\n") };
  }
  if (r.type === "memorization" && !r.date) {
    r = { ...r, date: r.createdAt ? r.createdAt.slice(0, 10) : todayStr() };
  }
  return r;
}

/* ============================================================
   共通UIパーツ
   ============================================================ */
function Field({ label, children, hint, help }) {
  return (
    <div className="block mb-5">
      <span className="flex items-center gap-1 text-[13.5px] font-bold text-neutral-700 mb-1.5 tracking-wide">
        {label}
        {help && <HelpTip text={help} label={typeof label === "string" ? label : undefined} />}
      </span>
      {children}
      {hint && <span className="block text-[12.5px] text-neutral-500 mt-1.5">{hint}</span>}
    </div>
  );
}

/* ============================================================
   「？」を押しているあいだだけ出る説明
   画面に説明文を出しっぱなしにすると、慣れた人には邪魔になる。
   吹き出しは画面いっぱいに対して位置を決めている（position: fixed）。
   入力欄は縦に流れる箱の中にあるため、その中に置くと端が切れてしまうため
   ============================================================ */
/* 大きさと丸みは指定（style）で直接与えている。
   縦横を同じ数にしておけば、まわりの並び方に関係なく必ず真円になる */
function HelpTip({ text, label }) {
  const btnRef = useRef(null);
  const [box, setBox] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  /* 消すときは、すぐ取り去らずに一度うすくしてから。ぱっと消えると目が驚く */
  const close = useCallback(() => {
    clearTimers();
    setLeaving(true);
    timers.current.push(setTimeout(() => { setBox(null); setLeaving(false); }, 200));
  }, []);

  const open = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const W = 240;
    const vw = window.innerWidth || 360;
    /* 画面の端からはみ出さないように寄せる */
    let left = r.left + r.width / 2 - W / 2;
    left = Math.max(12, Math.min(left, vw - W - 12));
    clearTimers();
    setLeaving(false);
    setBox({ left, top: r.bottom + 8, width: W, arrow: r.left + r.width / 2 - left });
    /* 時間では消さない。読み終わる速さは人それぞれなので、
       消すのは「周りを触ったとき」と「もう一度「？」を押したとき」だけにする */
  };

  useEffect(() => {
    if (!box || leaving) return;
    /* 説明が出ているあいだに別の場所を触ったら、待たずに消す。
       押した本人（「？」自身）は下のトグルで扱うので、ここでは除く */
    const onDown = (e) => { if (btnRef.current && btnRef.current.contains(e.target)) return; close(); };
    /* 開いたそのひと押しで閉じてしまわないよう、ひと呼吸おいてから聞き始める */
    const id = setTimeout(() => {
      document.addEventListener("pointerdown", onDown, true);
      window.addEventListener("scroll", close, true);
      window.addEventListener("resize", close);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [box, leaving, close]);

  const shown = !!box && !leaving;
  return (
    <>
      <button ref={btnRef} type="button" aria-label={label ? `${label}の説明` : "説明を見る"} aria-expanded={shown}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); shown ? close() : open(); }}
        onContextMenu={(e) => e.preventDefault()}
        className={"shrink-0 border flex items-center justify-center font-bold leading-none ft-tap ft-tap-icon "
          + (shown ? "border-th-800 bg-th-800 text-white" : "border-neutral-300 bg-white text-neutral-400")}
        style={{ width: 18, height: 18, borderRadius: 9999, fontSize: 11 }}>?</button>
      {box && (
        /* 重なり順は指定（style）で直接与える。クラス任せにすると、
           まわりの箱より下に潜り込むことがある（実際、聖句の入力欄で隠れていた） */
        <span className={"fixed pointer-events-none " + (leaving ? "ft-tip-out" : "ft-tip")}
          style={{ left: box.left, top: box.top, width: box.width, zIndex: 2147483000 }}>
          <span className="absolute -top-1.5 w-3 h-3 rotate-45 bg-neutral-900 rounded-[2px]"
            style={{ left: Math.max(8, Math.min(box.arrow - 6, box.width - 20)) }} />
          <span className="relative block rounded-xl bg-neutral-900 text-white text-[12.5px] leading-relaxed px-3 py-2.5 shadow-xl">{text}</span>
        </span>
      )}
    </>
  );
}

/* ============================================================
   記録をちょっと見る小窓
   「この箇所を含む記録」から呼ぶ。画面を移らずに中身を確かめられる。
   画面ごと移ってしまうと、読んでいた記録に戻るのが面倒なため
   ============================================================ */
function RecordPeekDialog({ record, onOpen, onClose }) {
  const [closing, close] = useClosing(onClose, 200);
  if (!record) return null;
  return (
    <div className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147482000 }} onClick={close}>
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box "
        + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 shrink-0">
          <TypeBadge type={record.type} />
          <span className="text-[12.5px] font-bold text-neutral-500">{record.date}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="ml-auto min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={22} /></button>
        </div>

        <div className="ft-sheet-body overflow-y-auto px-4 py-4">
          <p className="font-display text-[16px] text-neutral-900 mb-2 tracking-wide">{recordTitle(record)}</p>
          <TagChips tags={record.tags} className="mb-4" />
          <div className="space-y-4">
            {recordSections(record).map((sc, i) => (
              <div key={i}>
                {sc.label && (
                  <span className="block text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">{sc.label}</span>
                )}
                <HighlightedText text={sc.text} className="text-[14.5px] text-neutral-900 leading-relaxed whitespace-pre-line" />
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
          <button type="button" onClick={() => onOpen(record)} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>この記録を開く</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   タグを選ぶダイアログ
   入力画面と検索画面で共通に使う。
   一覧を画面に出しっぱなしにすると、タグが増えるほど画面を圧迫するので、
   選ぶときだけ開く形にしている
   ============================================================ */
function TagPickDialog({ title, selected, known, onApply, onCancel, onCreate, note }) {
  const [picked, setPicked] = useState(normalizeTags(selected));
  const [draft, setDraft] = useState("");
  const [closing, close] = useClosing(onCancel, 200);

  const q = draft.trim().toLowerCase();
  const list = normalizeTags(known);
  const shown = q ? list.filter((t) => t.toLowerCase().includes(q)) : list;
  /* 打ち込んだ言葉がまだ無いときだけ、新しく作れるようにする */
  const canCreate = !!onCreate && !!draft.trim()
    && !list.some((t) => t.toLowerCase() === draft.trim().toLowerCase());

  const toggle = (t) => setPicked((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const create = () => {
    const t = normalizeTags([draft])[0];
    if (!t) return;
    onCreate(t);
    setPicked((prev) => prev.includes(t) ? prev : [...prev, t]);
    setDraft("");
  };

  return (
    <div className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147483000 }} onClick={close}>
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box "
        + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <span className="font-display text-[17px] text-neutral-900 tracking-wide">{title}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
        </div>

        <div className="px-4 pt-3 shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <TextInput value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder={onCreate ? "さがす／新しく作る" : "さがす"}
                onKeyDown={(e) => { if (e.key === "Enter" && canCreate) { e.preventDefault(); create(); } }} />
            </div>
            {/* 出たり消えたりすると目がちらつくので、いつも同じ場所に置いておき、
                打ち込んだ言葉がまだ一覧に無いときだけ押せるようにする */}
            {onCreate && (
              <button type="button" onClick={create} disabled={!canCreate}
                className={(canCreate ? BTN_PRIMARY : BTN_BASE + " bg-neutral-100 border-2 border-neutral-200 text-neutral-400")
                  + " " + BTN_H + " px-3.5 text-[14.5px] shrink-0"}><Plus size={15} /> 作る</button>
            )}
          </div>
          {note && <p className="text-[12.5px] text-neutral-500 mt-2">{note}</p>}
        </div>

        <div className="ft-sheet-body overflow-y-auto px-4 py-3">
          {shown.length === 0 ? (
            <p className="text-[13.5px] text-neutral-500 py-6 text-center">
              {list.length === 0 ? "まだタグがありません。" : "見つかりませんでした。"}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {shown.map((t) => {
                const on = picked.includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggle(t)} aria-pressed={on}
                    className={"text-[13.5px] font-bold px-3 py-1.5 rounded-full border-2 ft-tap "
                      + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={() => onApply(normalizeTags(picked))}
            className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
            決定{picked.length > 0 ? `（${picked.length}）` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   入力画面のタグ欄
   ふだんは付いているタグと1つのボタンだけ。選ぶときにダイアログを開く
   ============================================================ */
function TagField({ value, onChange, knownTags, onCreateTag }) {
  const tags = normalizeTags(value);
  const [open, setOpen] = useState(false);
  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((t) => (
            <span key={t} className="ft-chip inline-flex items-center gap-1 rounded-full bg-th-50 border-2 border-th-200 pl-3 pr-1 py-1">
              <span className="text-[13.5px] font-bold text-th-900">{t}</span>
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`${t} を外す`}
                className="w-6 h-6 flex items-center justify-center rounded-full text-th-800/60 hover:text-red-700 ft-tap ft-tap-icon"><X size={14} /></button>
            </span>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen(true)}
        className={BTN_SECONDARY + " " + BTN_H + " px-3.5 text-[14.5px]"}>
        <Plus size={15} /> {tags.length ? "タグを選び直す" : "タグを選ぶ・作る"}
      </button>
      {open && (
        <TagPickDialog title="タグを選ぶ" selected={tags} known={knownTags}
          note="打ち込んでさがせます。まだ無い言葉は「作る」で登録できます。"
          onCreate={onCreateTag}
          onApply={(v) => { onChange(v); setOpen(false); }}
          onCancel={() => setOpen(false)} />
      )}
    </div>
  );
}

/* 閲覧画面などで、タグを並べて見せる */
function TagChips({ tags, className }) {
  const list = normalizeTags(tags);
  if (!list.length) return null;
  return (
    <div className={"flex flex-wrap gap-1.5 " + (className || "")}>
      {list.map((t) => (
        <span key={t} className="text-[12.5px] font-bold px-2.5 py-1 rounded-full bg-th-50 text-th-900 border border-th-200">{t}</span>
      ))}
    </div>
  );
}

/* 件数のバッジ。**必ず真円にすること。**
   以前は min-w と左右の余白で作っていたため、桁が増えると横長の楕円になっていた。
   縦横を同じ数で固定し、桁が増えたときは文字のほうを小さくして収める */
function CountBadge({ n, size = 22, className = "" }) {
  if (!n || n <= 0) return null;
  const txt = n > 99 ? "99+" : String(n);
  const fs = txt.length >= 3 ? size * 0.36 : txt.length === 2 ? size * 0.44 : size * 0.52;
  return (
    <span className={"bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 tabular-nums leading-none " + className}
      style={{ width: size, height: size, borderRadius: 9999, fontSize: Math.round(fs * 10) / 10 }}>{txt}</span>
  );
}

/* 入力欄の文字は必ず16px以上にすること（ft-input が受け持つ）。
   iPhoneのSafariは、16pxより小さい入力欄に触れると画面を勝手に拡大する。
   拡大されると横にも動くようになり、書きづらくなる。
   文字の大きさの設定（小・中・大）からも、入力欄だけは外している */
const inputCls = "w-full rounded-xl bg-white border-2 border-neutral-300 px-3.5 py-3 ft-input leading-normal text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-th-800/20 focus:border-th-800 h-[48px]";

/* 共通のボタン配色。主要な操作はすべて同じ深いティールに統一している */
/* iPhoneの切り欠き（ノッチ・ダイナミックアイランド）に隠れないための上余白。
   index.html で viewport-fit=cover にしているため、自分で余白を取る必要がある */
const SAFE_TOP = (extra) => ({ paddingTop: `calc(env(safe-area-inset-top) + ${extra}px)` });

const BTN_H = "btn-h"; // 全ボタン共通の高さ（実際の値はグローバルCSSの .btn-h で定義）
/* 押したときの手ごたえ。少し沈み、色がわずかに暗くなる。
   離すとすっと戻る（戻りのほうを少し長くすると気持ちよく感じる） */
/* 沈み方はグローバルCSSの .ft-tap にまとめてある。
   押した手ごたえをボタンごとに書くと、少しずつ深さや速さがずれていく。
   1か所にまとめておけば、全体の手ざわりをここだけで整えられる */
const BTN_BASE = "rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 ft-tap";
const BTN_PRIMARY = BTN_BASE + " bg-th-900 text-white hover:bg-th-800 shadow-sm";
const BTN_SECONDARY = BTN_BASE + " bg-white border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50";
const BTN_DANGER = BTN_BASE + " bg-rose-800 text-white hover:bg-rose-900 shadow-sm";
const BTN_DANGER_SOFT = BTN_BASE + " bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-50";
const BTN_QUIET = BTN_BASE + " text-neutral-500 hover:bg-neutral-100";
function TextInput(props) { return <input {...props} className={inputCls + " " + (props.className || "")} />; }

/* ============================================================
   ドラム式（ホイール）ピッカー
   ・スクロールのスナップを使い、実機の操作感に近い形で回して選ぶ
   ・中央の帯が現在の選択位置。離すと一番近い項目に吸い付く
   ============================================================ */
const WHEEL_ITEM_H = 40;
const WHEEL_VISIBLE = 5;

function WheelColumn({ items, value, onChange, minWidth = 72 }) {
  const boxRef = useRef(null);
  const offsetRef = useRef(0);          // px：0 = 先頭の項目が中央
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const activeRef = useRef(false);      // ドラッグ or 慣性アニメ中
  const lastYRef = useRef(0);
  const startYRef = useRef(0);
  const movedRef = useRef(false);
  const lastTRef = useRef(0);
  const velRef = useRef(0);             // px/ms
  const [offset, setOffsetState] = useState(0);

  const itemsRef = useRef(items); itemsRef.current = items;
  const onChangeRef = useRef(onChange); onChangeRef.current = onChange;
  const valueRef = useRef(value); valueRef.current = value;

  /* ドラムが1項目ぶん進むたびに、ごく短く震わせて「カチッ」を返す。
     ・対応していない端末（iPhoneのSafariなど）では何も起こらない。害はない
     ・勢いよく回したときに震えっぱなしにならないよう、40msに1回までにしている
     ・「動きの演出」を切っているときは鳴らさない */
  const prefsForTick = React.useContext(PrefsContext);
  const lastTickRef = useRef(0);
  const tick = () => {
    if (prefsForTick && prefsForTick.motion === false) return;
    const now = performance.now();
    if (now - lastTickRef.current < 40) return;
    lastTickRef.current = now;
    try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(4); } catch (e) { /* 使えなくても構わない */ }
  };

  const count = items.length;
  const maxOffset = Math.max(0, (count - 1) * WHEEL_ITEM_H);
  const idxOf = (v) => { const i = items.findIndex((it) => it.value === v); return i < 0 ? 0 : i; };

  const applyOffset = (v) => { offsetRef.current = v; setOffsetState(v); };
  const clampIdx = (i) => Math.max(0, Math.min(itemsRef.current.length - 1, i));

  /* 中央に来ている項目が変わったら即座に確定する（決定ボタンとのズレを防ぐ） */
  const commitFromOffset = () => {
    const idx = clampIdx(Math.round(offsetRef.current / WHEEL_ITEM_H));
    const item = itemsRef.current[idx];
    if (item && item.value !== valueRef.current) {
      valueRef.current = item.value;
      tick();
      onChangeRef.current(item.value);
    }
  };

  const stopAnim = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };

  /* 一番近い項目へ吸い付かせる */
  const snap = () => {
    const target = clampIdx(Math.round(offsetRef.current / WHEEL_ITEM_H)) * WHEEL_ITEM_H;
    const start = offsetRef.current;
    const delta = target - start;
    if (Math.abs(delta) < 0.5) { applyOffset(target); commitFromOffset(); activeRef.current = false; return; }
    const dur = 260;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out
      applyOffset(start + delta * e);
      commitFromOffset();
      if (p < 1) { rafRef.current = requestAnimationFrame(step); }
      else { rafRef.current = null; activeRef.current = false; commitFromOffset(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  /* 指を離した後の慣性（勢いを保ったまま、だんだん減速して止まる） */
  const startInertia = () => {
    let v = velRef.current;
    if (Math.abs(v) < 0.05) { snap(); return; }
    const OVER = WHEEL_ITEM_H * 0.9; // 端で少しだけはみ出せる余白
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(34, now - last);
      last = now;
      v *= Math.pow(0.945, dt / 16.67);  // 指数的に減速
      let next = offsetRef.current + v * dt;
      if (next < -OVER) { next = -OVER; v = 0; }
      if (next > maxOffset + OVER) { next = maxOffset + OVER; v = 0; }
      applyOffset(next);
      commitFromOffset();
      const outOfRange = next < 0 || next > maxOffset;
      if (Math.abs(v) > 0.015 && !outOfRange) { rafRef.current = requestAnimationFrame(step); }
      else { rafRef.current = null; snap(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  /* 外から値が変わった時だけ位置を合わせる（操作中は触らない） */
  useEffect(() => {
    if (activeRef.current) return;
    const idx = idxOf(value);
    applyOffset(idx * WHEEL_ITEM_H);
  }, [value, count]); // eslint-disable-line

  useEffect(() => () => stopAnim(), []);

  const onPointerDown = (e) => {
    stopAnim();
    draggingRef.current = true;
    activeRef.current = true;
    movedRef.current = false;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTRef.current = performance.now();
    velRef.current = 0;
    try { boxRef.current.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dy = e.clientY - lastYRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    lastYRef.current = e.clientY;
    lastTRef.current = now;
    if (Math.abs(e.clientY - startYRef.current) > 4) movedRef.current = true;
    const instant = -dy / dt;
    velRef.current = velRef.current * 0.7 + instant * 0.3; // なめらかに平均化
    const OVER = WHEEL_ITEM_H * 0.9;
    const cur = offsetRef.current;
    // 端をはみ出している時だけ引っぱりを弱くして、行き止まり感を出す
    const resist = cur < 0 || cur > maxOffset ? 0.35 : 1;
    let next = cur - dy * resist;
    next = Math.max(-OVER, Math.min(maxOffset + OVER, next));
    applyOffset(next);
    commitFromOffset();
    e.preventDefault();
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (performance.now() - lastTRef.current > 120) velRef.current = 0; // 止めてから離した時は流さない
    startInertia();
  };

  const onWheelEvent = (e) => {
    stopAnim();
    activeRef.current = true;
    const next = Math.max(-WHEEL_ITEM_H * 0.9, Math.min(maxOffset + WHEEL_ITEM_H * 0.9, offsetRef.current + e.deltaY));
    applyOffset(next);
    commitFromOffset();
    clearTimeout(onWheelEvent._t);
    onWheelEvent._t = setTimeout(() => { velRef.current = 0; snap(); }, 90);
  };

  const tapTo = (i) => {
    stopAnim();
    activeRef.current = true;
    velRef.current = 0;
    const start = offsetRef.current;
    const target = i * WHEEL_ITEM_H;
    const t0 = performance.now();
    const dur = 260;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      applyOffset(start + (target - start) * e);
      commitFromOffset();
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else { rafRef.current = null; activeRef.current = false; commitFromOffset(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const centerPad = WHEEL_ITEM_H * ((WHEEL_VISIBLE - 1) / 2);
  const activeIdx = clampIdx(Math.round(offset / WHEEL_ITEM_H));

  /* ネイティブに（passive:false で）登録する。
     React経由だとブラウザ側にスクロールを持っていかれ、上方向の動きが効かないことがあるため */
  const handlersRef = useRef({});
  handlersRef.current = { onPointerDown, onPointerMove, onPointerUp, onWheelEvent };
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const down = (e) => handlersRef.current.onPointerDown(e);
    const move = (e) => handlersRef.current.onPointerMove(e);
    const up = (e) => handlersRef.current.onPointerUp(e);
    const wheel = (e) => { e.preventDefault(); handlersRef.current.onWheelEvent(e); };
    el.addEventListener("pointerdown", down, { passive: false });
    el.addEventListener("pointermove", move, { passive: false });
    el.addEventListener("pointerup", up, { passive: false });
    el.addEventListener("pointercancel", up, { passive: false });
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative overflow-hidden select-none"
      style={{ height: WHEEL_ITEM_H * WHEEL_VISIBLE, minWidth, touchAction: "none", cursor: "grab" }}
    >
      <div style={{ transform: `translateY(${centerPad - offset}px)` }}>
        {items.map((it, i) => {
          const dist = Math.abs(i - offset / WHEEL_ITEM_H);
          const isActive = i === activeIdx;
          return (
            <div
              key={it.value === "" ? `__empty${i}` : String(it.value)}
              onClick={() => { if (movedRef.current) { movedRef.current = false; return; } tapTo(i); }}
              className="flex items-center justify-center"
              style={{
                height: WHEEL_ITEM_H,
                opacity: Math.max(0.22, 1 - dist * 0.3),
                transform: `scale(${Math.max(0.76, 1 - dist * 0.09)})`,
                fontWeight: isActive ? 700 : 500,
                /* 選ばれている行はテーマカラー。色の数値を直接書かないこと。
                   書き決めにすると、テーマを変えたときにここだけ緑のまま残る */
                color: isActive ? "var(--th-800)" : "#404040",
                fontSize: isActive ? "17px" : "16px",
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WheelSheet({ title, onClose, onConfirm, children }) {
  return (
    <div className="ft-sheet-wrap flex items-end justify-center" style={{ zIndex: 2147483000 }} onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl border-t border-neutral-200 shadow-xl anim-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <span className="font-display text-[15.5px] text-neutral-900">{title}</span>
          <button type="button" onClick={onClose} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        <div className="relative px-4 pt-3">
          <div
            className="pointer-events-none absolute left-4 right-4 border-y-2 border-th-700/35 bg-th-50/40 rounded-md"
            style={{ height: WHEEL_ITEM_H, top: `calc(0.75rem + ${WHEEL_ITEM_H * ((WHEEL_VISIBLE - 1) / 2)}px)` }}
          />
          <div className="relative flex justify-center gap-2">{children}</div>
        </div>
        <div className="px-4 pt-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
          <button type="button" onClick={onConfirm} className={BTN_PRIMARY + " w-full " + BTN_H + " text-[15.5px]"}>決定</button>
        </div>
      </div>
    </div>
  );
}

/* 1列のドラム選択フィールド（書・章・節・年・月などで共用） */
function DrumSelect({ value, onChange, options, placeholder = "選択", title, className, disabled }) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(value ?? "");
  const items = [{ value: "", label: placeholder }, ...options];
  const current = options.find((o) => o.value === value);

  const openSheet = () => { if (disabled) return; setTemp(value ?? ""); setOpen(true); };
  const confirm = () => { onChange(temp === "" ? "" : temp); setOpen(false); };

  return (
    <>
      <button type="button" onClick={openSheet} disabled={disabled}
        className={inputCls + " flex items-center justify-between text-left disabled:opacity-50 " + (className || "")}>
        <span className={current ? "text-neutral-900 truncate" : "text-neutral-400 truncate"}>{current ? current.label : placeholder}</span>
        <ChevronDown size={18} className="text-neutral-500 shrink-0 ml-2" />
      </button>
      {open && (
        <WheelSheet title={title || placeholder} onClose={() => setOpen(false)} onConfirm={confirm}>
          <WheelColumn items={items} value={temp} onChange={setTemp} minWidth={180} />
        </WheelSheet>
      )}
    </>
  );
}

/* 日付：年・月・日の3連ドラム。onChangeは従来通り e.target.value 形式で返す */
function DateInput({ className, value, onChange }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const parse = (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    if (m) return { y: +m[1], mo: +m[2], d: +m[3] };
    return { y: today.getFullYear(), mo: today.getMonth() + 1, d: today.getDate() };
  };
  const [tmp, setTmp] = useState(() => parse(value));

  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() - 12 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(tmp.y, tmp.mo, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const openSheet = () => { setTmp(parse(value)); setOpen(true); };
  const confirm = () => {
    const d = Math.min(tmp.d, new Date(tmp.y, tmp.mo, 0).getDate());
    const str = `${tmp.y}-${String(tmp.mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    onChange && onChange({ target: { value: str } });
    setOpen(false);
  };

  const p = value ? parse(value) : null;
  return (
    <>
      <button type="button" onClick={openSheet}
        className={"h-[48px] rounded-xl border-2 border-neutral-300 bg-white flex items-center justify-between px-3 text-left " + (className || "w-[170px]")}>
        <span className={p ? "text-[15.5px] text-neutral-900" : "text-[15.5px] text-neutral-400"}>
          {p ? `${p.y}/${p.mo}/${p.d}` : "日付を選択"}
        </span>
        <ChevronDown size={18} className="text-neutral-500 shrink-0 ml-1" />
      </button>
      {open && (
        <WheelSheet title="日付を選択" onClose={() => setOpen(false)} onConfirm={confirm}>
          <WheelColumn minWidth={92} value={tmp.y} onChange={(y) => setTmp((t) => ({ ...t, y }))}
            items={years.map((y) => ({ value: y, label: `${y}年` }))} />
          <WheelColumn minWidth={72} value={tmp.mo} onChange={(mo) => setTmp((t) => ({ ...t, mo }))}
            items={months.map((m) => ({ value: m, label: `${m}月` }))} />
          <WheelColumn minWidth={72} value={Math.min(tmp.d, daysInMonth)} onChange={(d) => setTmp((t) => ({ ...t, d }))}
            items={days.map((d) => ({ value: d, label: `${d}日` }))} />
        </WheelSheet>
      )}
    </>
  );
}

function TextArea({ value, onChange, className, minRows, ...rest }) {
  const ref = useRef(null);
  /* 中身に合わせて高さを測り直す。
     測るときに一度 height を auto に戻すが、そのあいだ欄が縮むため、
     何もしないとまわりの巻き物（スクロール位置）が動いてしまう。
     「長い文章を書き始めると画面が勝手にずれる」のはこれが原因だった。
     測る前に位置を覚えておき、直後に戻すこと */
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    const holders = [];
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (p.scrollHeight > p.clientHeight + 1) holders.push([p, p.scrollTop]);
    }
    const winY = window.scrollY;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    holders.forEach(([p, top]) => { if (p.scrollTop !== top) p.scrollTop = top; });
    if (window.scrollY !== winY) window.scrollTo(0, winY);
  };
  useEffect(() => { resize(); }, [value]);
  const style = minRows ? { minHeight: `${minRows * 1.7 + 1.5}em` } : undefined;
  /* rows={1} は必ず付けること。
     textarea は何も指定しないと「2行ぶん」の高さから始まるため、
     1行だけの欄が、となりの入力欄より2〜3割ほど背の高い箱に見えてしまう。
     実際の高さは下の resize() が中身に合わせて決めるので、
     rows を1にしても書き足せば普通に伸びる。
     minRows を渡した欄は minHeight のほうが効くので、見た目は変わらない */
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} onInput={resize} style={style} className={inputCls + " resize-none overflow-hidden " + (className || "")} {...rest} />;
}
function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={inputCls + " appearance-none pr-10"}>{children}</select>
      <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}
/* 連続した数値を [開始, 終了] の範囲にまとめる */
function chapterRanges(nums) {
  const sorted = [...new Set(nums || [])].sort((a, b) => a - b);
  if (!sorted.length) return [];
  const out = [];
  let s = sorted[0], p = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const c = sorted[i];
    if (c === p + 1) { p = c; continue; }
    out.push([s, p]);
    s = c; p = c;
  }
  return out;
}

/* 章の複数選択。小さなマスを狙うのをやめ、ドラムで「◯章から◯章まで」を足していく方式 */
function ChapterMultiSelect({ book, selected, onChange }) {
  const b = bookByName(book);
  const total = b ? b.chapters : 0;
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

  useEffect(() => { setFrom(1); setTo(1); }, [book]);

  const chosen = selected || [];
  const chapterOptions = Array.from({ length: total }, (_, i) => ({ value: i + 1, label: `${i + 1}章` }));
  const toOptions = chapterOptions.filter((o) => o.value >= from);

  const addRange = () => {
    const lo = Math.min(from, to), hi = Math.max(from, to);
    const set = new Set(chosen);
    for (let i = lo; i <= hi; i++) set.add(i);
    onChange([...set].sort((a, c) => a - c));
  };
  const removeRange = (s, e) => onChange(chosen.filter((n) => n < s || n > e));

  if (!b) return <p className="text-[14.5px] text-neutral-500">先に読んだ箇所の書を選んでください</p>;

  const ranges = chapterRanges(chosen);
  return (
    <div className="rounded-xl bg-white border-2 border-neutral-300 p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <span className="block text-[12.5px] font-bold text-neutral-500 mb-1">開始</span>
          <DrumSelect value={from} onChange={(v) => { setFrom(v); if (v > to) setTo(v); }} options={chapterOptions} placeholder="章" title="開始の章" />
        </div>
        <span className="text-neutral-400 font-bold pb-3.5 shrink-0">〜</span>
        <div className="flex-1 min-w-0">
          <span className="block text-[12.5px] font-bold text-neutral-500 mb-1">終了</span>
          <DrumSelect value={to} onChange={setTo} options={toOptions} placeholder="章" title="終わりの章" />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={addRange} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
          <Plus size={16} /> この範囲を追加
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        <button type="button" onClick={() => onChange(Array.from({ length: total }, (_, i) => i + 1))}
          className="flex-1 min-h-[38px] rounded-lg text-[12.5px] font-bold text-th-800 hover:bg-th-50">全{total}章を選択</button>
        {chosen.length > 0 && (
          <button type="button" onClick={() => onChange([])}
            className="flex-1 min-h-[38px] rounded-lg text-[12.5px] font-bold text-neutral-500 hover:bg-neutral-100">選択をクリア</button>
        )}
      </div>

      <div className="border-t-2 border-neutral-100 mt-3 pt-3">
        {ranges.length === 0 ? (
          <p className="text-[13.5px] text-neutral-500">まだ選ばれていません</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ranges.map(([s, e]) => (
              <span key={`${s}-${e}`} className="inline-flex items-center gap-1 rounded-full bg-th-50 border-2 border-th-200 pl-3 pr-1 py-1 ft-chip">
                <span className="text-[13.5px] font-bold text-th-900">{s === e ? `${s}章` : `${s}-${e}章`}</span>
                <button type="button" onClick={() => removeRange(s, e)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-th-700 hover:bg-th-100"><X size={15} /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* 旧約は39巻、新約は27巻 */
const OT_COUNT = 39;
/* compact ＝ 旧約・新約の切り替えを、選ぶ欄の左に並べて1行に収める。
   探すの絞り込みで使う。縦に積むと、それだけで2行ぶんの高さになるため */
function BookSelect({ value, onChange, compact }) {
  const isNew = value ? bookIndexOf(value) >= OT_COUNT : false;
  const [testament, setTestament] = useState(isNew ? "new" : "old");
  useEffect(() => { if (value) setTestament(bookIndexOf(value) >= OT_COUNT ? "new" : "old"); }, [value]);
  const list = testament === "old" ? BOOKS.slice(0, OT_COUNT) : BOOKS.slice(OT_COUNT);
  const toggle = (
    <div className={compact ? "flex gap-1 shrink-0" : "flex gap-1.5 mb-2"}>
      {[["old", "旧約"], ["new", "新約"]].map(([k, label]) => (
        <button key={k} type="button" onClick={() => setTestament(k)}
          className={(compact ? "px-2 min-h-[40px] " : "flex-1 " + BTN_H + " ") + "ft-tap rounded-lg border-2 text-[13.5px] font-bold "
            + (testament === k ? "border-th-700 bg-th-50 text-th-900" : "border-neutral-200 bg-white text-neutral-500")}>
          {label}
        </button>
      ))}
    </div>
  );
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {toggle}
        <div className="flex-1 min-w-0">
          <DrumSelect value={value} onChange={onChange} placeholder="書を選択"
            title={testament === "old" ? "旧約聖書から選ぶ" : "新約聖書から選ぶ"}
            options={list.map((b) => ({ value: b.name, label: b.name }))} />
        </div>
      </div>
    );
  }
  return (
    <div>
      {toggle}
      <DrumSelect
        value={value}
        onChange={onChange}
        placeholder="書を選択"
        title={testament === "old" ? "旧約聖書から選ぶ" : "新約聖書から選ぶ"}
        options={list.map((b) => ({ value: b.name, label: b.name }))}
      />
    </div>
  );
}
/* タップした部品が、ほんの一瞬うすくなってから画面が変わるようにする。
   押したことが手に伝わり、切り替わりも唐突でなくなる */
/* 押してから「画面が動きはじめる」までの間。
   ここで決まるのは動きはじめる時刻だけで、
   画面が滑ってくる速さ（.anim-right の0.26秒）とは別物。
   下の .ft-tap-pressed を45msで暗くしているので、
   暗くなりきった直後に動きはじめる勘定になっている。
   ここを縮めるときは、必ず .ft-tap-pressed の速さも一緒に見ること。
   暗くなる途中で切り替わると、押した手ごたえが見えないまま消える */
function useTapThen(fn, ms = 60) {
  const [pressed, setPressed] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);
  const run = useCallback((...args) => {
    if (!fn || pressed) return;
    setPressed(true);
    t.current = setTimeout(() => { fn(...args); setPressed(false); }, ms);
  }, [fn, pressed, ms]);
  return [pressed, run];
}
const TAP_DIM = "brightness-90 opacity-80";

/* 押すと少し暗くなり、ひと呼吸おいてから画面が変わるボタン */
function TapButton({ onClick, className = "", children, delay, ...rest }) {
  const [pressed, go] = useTapThen(onClick, delay);
  return (
    <button onClick={go} {...rest}
      className={className + " ft-tap " + (pressed ? "ft-tap-pressed" : "")}>
      {children}
    </button>
  );
}

/* ピン留め／ブックマークの目印ボタン */
function MarkButton({ on, onClick, label, icon }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={on}
      className={"w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 ft-tap ft-tap-icon "
        + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-400")}>
      {/* 付けた瞬間だけ弾ませたいので、key を変えて描き直させている */}
      <span key={on ? "on" : "off"} className={"flex " + (on ? "ft-mark" : "")}>{icon}</span>
    </button>
  );
}

/* 本文の中の聖書箇所を、テーマカラーで見えるようにする。
   括弧つきの引用（節まであるもの）はまとめて色を付け、
   本文中に出てくる「ヨハネの福音書 3:16」のような書き方にも色を付ける */
function HighlightedText({ text, className }) {
  if (!text) return null;
  /* URLは押せるリンクにしたいので、先にURLの前後で切り分け、
     URLでない部分だけ、これまでどおり聖書箇所の色付けをかける */
  const segs = splitByUrl(text);

  return (
    <p className={className}>
      {segs.map((sg, i) => sg.url
        ? (
          <a key={i} href={sg.url} target="_blank" rel="noopener noreferrer"
            className="text-th-800 font-bold underline decoration-th-300 underline-offset-2 break-all">{sg.text}</a>
        )
        : <React.Fragment key={i}>{highlightRefs(sg.text)}</React.Fragment>)}
    </p>
  );
}

/* 本文の中の聖書箇所に色を付ける。返すのは文字と<span>の並び */
function highlightRefs(text) {
  if (!text) return null;
  const marks = [];
  /* 「聖句に追加」の対象になる範囲（本文＋聖書箇所）を、そのまま色付けの範囲に使う。
     判定は splitByCitations に任せること。ここに同じ判定を書き直すと、
     色が付く範囲と聖句に追加される範囲が食い違う */
  splitByCitations(text).forEach((seg) => marks.push([seg.start, seg.end]));
  /* 引用になっていない、ただの聖書箇所も色を付ける（本文のない箇所など） */
  let m;
  REF_REGEX.lastIndex = 0;
  while ((m = REF_REGEX.exec(text)) !== null) {
    const a = m.index, b = m.index + m[0].length;
    if (!marks.some(([s2, e2]) => a >= s2 && b <= e2)) marks.push([a, b]);
  }
  if (!marks.length) return text;
  marks.sort((x, y) => x[0] - y[0]);
  const merged = [];
  marks.forEach((r) => {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  });
  const parts = [];
  let pos = 0;
  merged.forEach(([a, b], i) => {
    if (a > pos) parts.push(text.slice(pos, a));
    parts.push(<span key={i} className="text-th-800 font-bold">{text.slice(a, b)}</span>);
    pos = b;
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return parts;
}

function RecognizedRefs({ text }) {
  const refs = parseBibleRefs(text);
  if (!refs.length) return null;
  return <div className="flex flex-wrap gap-1.5 mt-2">{refs.map((r, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-th-50 text-th-800 border border-th-300 ft-chip">{formatRef(r)}</span>)}</div>;
}
/* テキスト中に含まれる聖句引用ごとに、その部分だけを聖句へ追加できるようにする */
/* 本文と、そのあとに続く聖書箇所を「ひとつの引用」として切り出す。
   ここが「聖句に追加」の対象範囲になり、閲覧画面の色付けもこの範囲を使う。
   **同じ判定を2か所に書かないこと。** 別々に書くと、色が付く範囲と
   聖句に追加される範囲が食い違う（実際そうなっていた）。

   引用と見なす書き方は2つ。
   ① 括弧に入れる … 本文（ヨハネの福音書 3:16）
   ② 行の終わりに置く … 本文のあとで改行し、その行に「ヨハネの第一の手紙 2:27」
   ②は、行の終わりであることを条件にしている。
   文の途中に出てくる箇所（「ヨハネ 3:16 について考えた」など）まで拾うと、
   引用でないものを引用と見なしてしまうため。
   返すのは { start, end, text, ref }。start〜end が色を付ける範囲 */
function splitByCitations(text) {
  if (!text) return [];
  const blankLineRegex = /\n[ \t]*\n/g;

  /* 引用の目印になる箇所を、文の前から順に集める */
  const marks = [];
  /* 全角の（）も見る。日本語で書くとこちらのほうが多い */
  const paren = /[（(][^）)]*[）)]/g;
  let m;
  while ((m = paren.exec(text)) !== null) {
    const refs = parseBibleRefs(m[0]);
    if (refs.length && refs[0].verse) marks.push({ from: m.index, to: m.index + m[0].length, ref: refs[0] });
  }
  const inParen = (i) => marks.some((k) => i >= k.from && i < k.to);
  /* 先に位置だけ全部集めてから中身を調べること。
     調べる途中で parseBibleRefs を呼ぶと、同じ正規表現の読み取り位置が
     先頭に戻されて、いつまでも終わらなくなる */
  const hits = [];
  REF_REGEX.lastIndex = 0;
  let r;
  while ((r = REF_REGEX.exec(text)) !== null) hits.push({ index: r.index, str: r[0] });
  for (const h of hits) {
    if (inParen(h.index)) continue;
    const refs = parseBibleRefs(h.str);
    if (!refs.length || !refs[0].verse) continue;
    /* その行の終わりに置かれているか。うしろは空白か、訳名のような短い添え書きだけ */
    const after = text.slice(h.index + h.str.length);
    const rest = (after.match(/^[^\n]*/) || [""])[0];
    if (!/^[\s　]*(（[^）\n]{0,12}）|\([^)\n]{0,12}\))?[\s　]*$/.test(rest)) continue;
    marks.push({ from: h.index, to: h.index + h.str.length + rest.length, ref: refs[0] });
  }
  marks.sort((a, b) => a.from - b.from);

  const segments = [];
  let lastEnd = 0;
  for (const k of marks) {
    if (k.from < lastEnd) continue;
    /* 直前の引用（または文頭）から今回までの範囲で、いちばん近い空行の直後が本文の始まり */
    const zone = text.slice(lastEnd, k.from);
    let start = lastEnd, bl;
    blankLineRegex.lastIndex = 0;
    while ((bl = blankLineRegex.exec(zone)) !== null) start = lastEnd + bl.index + bl[0].length;
    while (start < k.from && /\s/.test(text[start])) start++;
    const body = text.slice(start, k.from).trim();
    if (body) {
      /* 聖句に追加する文は「本文＋書 章:節」の形にし、括弧や訳名は含めない */
      segments.push({ start, end: k.to, text: body + "\n" + formatRef(k.ref), ref: k.ref });
    }
    lastEnd = k.to;
  }
  return segments;
}
function MemorizeLink({ text, allRecords, onQuickMemorize }) {
  const memName = useTypeName().memorization || "聖句";
  const segments = useMemo(() => splitByCitations(text), [text]);
  if (!segments.length) return null;
  return (
    <div className="flex flex-col items-start gap-1.5 mt-2">
      {segments.map((seg, i) => {
        const already = (allRecords || []).some((m) => m.type === "memorization" && sameRef(primaryRef(m.text), seg.ref));
        return already ? (
          <span key={i} className="inline-flex items-center gap-1 text-[12.5px] font-bold text-emerald-700"><Check size={13} strokeWidth={3} /> {formatRef(seg.ref)} を{memName}に追加済み</span>
        ) : (
          <button key={i} type="button" onClick={() => onQuickMemorize(seg.text)} className="inline-flex items-center gap-1 text-[12.5px] font-bold text-amber-700 hover:text-amber-900"><Star size={13} /> {formatRef(seg.ref)} を{memName}に追加</button>
        );
      })}
    </div>
  );
}

/* 閉じるときの動きを見せてから、実際に閉じる。
   ボタンを押した瞬間に消えると素っ気ないため、少しだけ待つ */
function useClosing(onClose, ms = 230) {
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const startClose = useCallback((...args) => {
    setClosing((c) => {
      if (c) return c;
      timer.current = setTimeout(() => onClose && onClose(...args), ms);
      return true;
    });
  }, [onClose, ms]);
  return [closing, startClose];
}

/* 重なって出る画面が開いているあいだ、うしろの画面（本体）を動かないようにする。
   iPhoneでは、入力欄に触れてキーボードが出るとき、
   手前が position:fixed でも、うしろの画面のほうが勝手に動いてしまう。
   「ちょうど良い位置に合わせて書き始めたのに、位置がずれる」のはこれが原因。
   何枚か重なることがあるので、枚数を数えて最後の1枚が閉じたときだけ元に戻す */
let overlayCount = 0;
function useLockBackground() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const body = document.body;
    if (overlayCount === 0) {
      body.dataset.ftPrevOverflow = body.style.overflow || "";
      body.style.overflow = "hidden";
    }
    overlayCount += 1;
    return () => {
      overlayCount -= 1;
      if (overlayCount <= 0) {
        overlayCount = 0;
        body.style.overflow = body.dataset.ftPrevOverflow || "";
        delete body.dataset.ftPrevOverflow;
      }
    };
  }, []);
}

/* 重なって出る画面の入れ物。出るときと戻るときの動きを受け持つ */
function OverlayScreen({ from = "right", closing, children, zIndex = 50 }) {
  useLockBackground();
  const inCls = from === "bottom" ? "anim-up" : "anim-right";
  const outCls = from === "bottom" ? "anim-down-out" : "anim-right-out";
  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      <div className={"absolute inset-0 bg-black/25 " + (closing ? "anim-fade-out" : "anim-fade")} />
      <div className={"absolute inset-0 " + (closing ? outCls : inCls)}>{children}</div>
    </div>
  );
}

/* 読み込み中の目印。少し時間がかかる処理で使う */
function Spinner({ size = 22, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={"spin " + className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
/* 画面の真ん中に出す「探しています」。
   ボタンの上に小さく出すだけだと気づきにくいので、
   画面全体を薄く覆って、真ん中で大きく回す */
function LoadingOverlay({ label = "読み込んでいます" }) {
  return (
    <div className="ft-sheet-wrap flex items-center justify-center anim-fade" style={{ zIndex: 2147481000 }}>
      <div className="absolute inset-0 bg-neutral-50/75" />
      <div className="relative flex flex-col items-center text-th-800">
        <Spinner size={56} />
        <p className="text-[14.5px] font-bold text-neutral-600 mt-4">{label}</p>
      </div>
    </div>
  );
}

function LoadingBlock({ label = "読み込んでいます" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-th-800">
      <Spinner size={30} />
      <p className="text-[12.5px] font-bold text-neutral-500 mt-3">{label}</p>
    </div>
  );
}

/* 途中保存のアイコン。左が「保存する」、右が「保存できた」 */
function SaveArrowIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5 L12 14.5" />
      <path d="M6.5 9.5 L12 15 L17.5 9.5" />
      <path d="M5 20.5 L19 20.5" />
    </svg>
  );
}
function SaveCheckIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" />
    </svg>
  );
}

/* 今ある文の末尾に聖書箇所を足す */
const appendRef = (cur, ref) => {
  const base = (cur || "").replace(/\s+$/, "");
  return base ? base + " " + ref : ref;
};

/* 書・章・節を選んでテキストへ挿入するミニピッカー */
function RefInserter({ onInsert, onPickRange, label }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState(null);
  const [chapterEnd, setChapterEnd] = useState("");
  const [verse, setVerse] = useState("");
  const [verseEnd, setVerseEnd] = useState("");

  const reset = () => { setBook(""); setChapter(null); setChapterEnd(""); setVerse(""); setVerseEnd(""); };
  const multiChapter = chapterEnd !== "" && Number(chapterEnd) > Number(chapter || 0);
  const confirm = () => {
    if (!book || !chapter) return;
    let ref;
    if (multiChapter) {
      ref = `${book} ${chapter}章-${chapterEnd}章`;
    } else if (verse) {
      ref = `${book} ${chapter}:${verse}`;
      if (verseEnd) ref += `-${verseEnd}`;
    } else {
      ref = `${book} ${chapter}章`;
    }
    if (onPickRange) {
      /* 通読の「読んだ箇所」用。文字ではなく、書と章の並びを返す */
      const from = Number(chapter);
      const to = multiChapter ? Number(chapterEnd) : from;
      const chapters = [];
      for (let i = from; i <= to; i++) chapters.push(i);
      onPickRange({ book, chapters, passageText: ref });
    } else {
      onInsert(ref);
    }
    reset();
    setOpen(false);
  };

  const close = () => { reset(); setOpen(false); };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-th-800 mt-2 min-h-[32px] ft-tap">
        <BookOpen size={13} /> {label || "書・章・節を選んで挿入"}
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center px-5" style={{ zIndex: 2147483100 }} onClick={close}>
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <span className="font-display text-[15.5px] text-neutral-900">聖書箇所を選ぶ</span>
              <button type="button" onClick={close} aria-label="閉じる"
                className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
            </div>
            <div className="p-4 space-y-2.5">
      <BookSelect value={book} onChange={(v) => { setBook(v); setChapter(null); setVerse(""); setVerseEnd(""); }} />
      {book && (
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-[13.5px] font-bold text-neutral-600">章</span>
                <DrumSelect
                  value={chapter ?? ""}
                  onChange={(v) => { setChapter(v === "" ? null : v); setChapterEnd(""); setVerse(""); setVerseEnd(""); }}
                  placeholder="—"
                  title="章を選択"
                  options={Array.from({ length: bookByName(book)?.chapters || 0 }, (_, i) => ({ value: i + 1, label: `${i + 1}章` }))}
                />
                <span className="text-neutral-500 font-bold shrink-0">〜</span>
                <DrumSelect
                  value={chapterEnd === "" ? "" : Number(chapterEnd)}
                  onChange={(v) => { setChapterEnd(v === "" ? "" : String(v)); if (v !== "") { setVerse(""); setVerseEnd(""); } }}
                  placeholder="—"
                  title="終わりの章を選択"
                  disabled={!chapter}
                  options={Array.from({ length: bookByName(book)?.chapters || 0 }, (_, i) => i + 1)
                    .filter((n) => !chapter || n > Number(chapter))
                    .map((n) => ({ value: n, label: `${n}章` }))}
                />
              </div>
            )}
      {chapter && (
              <div className={"flex items-center gap-2 " + (multiChapter ? "opacity-40 pointer-events-none" : "")}>
                <span className="w-8 shrink-0 text-[13.5px] font-bold text-neutral-600">節</span>
          <DrumSelect
            value={verse === "" ? "" : Number(verse)}
            onChange={(v) => { setVerse(v === "" ? "" : String(v)); setVerseEnd(""); }}
            placeholder="—"
            title="節を選択"
            options={Array.from({ length: 176 }, (_, i) => ({ value: i + 1, label: `${i + 1}節` }))}
          />
          <span className="text-neutral-400 font-bold shrink-0">〜</span>
          <DrumSelect
            value={verseEnd === "" ? "" : Number(verseEnd)}
            onChange={(v) => setVerseEnd(v === "" ? "" : String(v))}
            placeholder="—"
            title="終わりの節を選択"
            disabled={!verse}
            options={Array.from({ length: 176 }, (_, i) => i + 1)
              .filter((n) => !verse || n > Number(verse))
              .map((n) => ({ value: n, label: `${n}節` }))}
          />
        </div>
      )}
            <div className="flex gap-2 px-4 pb-4 pt-1">
              <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
              <button type="button" onClick={confirm} disabled={!book || !chapter} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>挿入する</button>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 入力欄1つ分の削除確認。記録そのものの削除（赤）と区別できるよう、こちらは橙色にしている */
/* 今月・今年の聖句が、ほかの記録にすでに付いているときの確認 */
function HighlightTakeoverDialog({ what, existing, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">{what}には、すでに別の聖句があります</h3>
        <div className="rounded-xl border-2 border-neutral-200 bg-neutral-50 px-3 py-2.5 mb-3">
          <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(existing.text, 3)}</p>
        </div>
        <p className="text-[13.5px] text-neutral-600 mb-5 leading-relaxed">
          こちらの記録に変えると、上の記録からは外れます。変えますか。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
          <button onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>変える</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmItemDeleteDialog({ label, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center px-6" style={{ zIndex: 2147483100 }}>
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">{label}を削除します</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">この入力欄と、入力した内容が消えます。記録そのものは削除されません。</p>
        <div className="flex gap-2.5">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>削除</button>
        </div>
      </div>
    </div>
  );
}

/* QuestionList（疑問メモの入力欄）は廃止した。
   疑問はタグで表せるようになったため。移行は migrateRecord が受け持つ */
/* ============================================================
   画面端スワイプで「戻る」ジェスチャー
   ・画面左端に専用の透明な帯（stripRef）を敷き、そこだけで検知する
     （下の方にあるボタン類に判定を邪魔されず、上から下まで感度を均一にするため）
   ・指の動きにリアルタイムで追従し、離した時にしきい値/速度で判定
   ============================================================ */
function useEdgeSwipeBack(onBack, canClose) {
  const stripRef = useRef(null);
  const screenRef = useRef(null);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const canCloseRef = useRef(canClose);
  canCloseRef.current = canClose;

  useEffect(() => {
    const strip = stripRef.current;
    const screen = screenRef.current;
    if (!strip || !screen) return;

    const THRESHOLD = 0.14; // 画面幅に対してこの割合を超えたら「戻る」確定
    const VELOCITY_THRESHOLD = 0.18; // px/ms：速く払った場合はしきい値未満でも確定
    const SETTLE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // 戻る確定：すっと吸い込まれるように抜ける
    const SPRING_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // キャンセル：跳ねずに元の位置へスッと収まる

    let active = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let width = 1;
    let pointerId = null;

    let clearTimer = null;
    const setTransform = (x, animate, easing, duration) => {
      clearTimeout(clearTimer);
      screen.style.transition = animate ? `transform ${duration}ms ${easing}` : "none";
      screen.style.transform = x === 0 ? "translateX(0px)" : `translateX(${x}px)`;
      if (x === 0) {
        // 元の位置に戻り切ったら inline style を消す
        // （transform が残っていると、上に重ねるシート類の基準位置がずれてしまうため）
        const wait = animate ? duration + 30 : 0;
        clearTimer = setTimeout(() => { screen.style.transition = ""; screen.style.transform = ""; }, wait);
      }
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startTime = performance.now();
      width = screen.offsetWidth || window.innerWidth || 375;
      pointerId = e.pointerId;
    };

    const onPointerMove = (e) => {
      if (!active) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        if (dx <= 0 || Math.abs(dy) > Math.abs(dx) * 1.3) { active = false; return; }
        dragging = true;
        try { strip.setPointerCapture(pointerId); } catch (err) { /* noop */ }
      }
      const clamped = Math.max(0, Math.min(dx, width));
      setTransform(clamped, false);
      e.preventDefault();
    };

    const finish = (e) => {
      if (!active) return;
      active = false;
      if (!dragging) return;
      dragging = false;
      const dx = Math.max(0, Math.min(e.clientX - startX, width));
      const dt = Math.max(1, performance.now() - startTime);
      const velocity = dx / dt;
      const passed = dx / width > THRESHOLD || velocity > VELOCITY_THRESHOLD;
      if (passed) {
        if (canCloseRef.current && !canCloseRef.current()) {
          setTransform(0, true, SPRING_EASE, 340);
          return;
        }
        const remaining = width - dx;
        const duration = Math.max(110, Math.min(220, remaining / 1.3));
        setTransform(width, true, SETTLE_EASE, duration);
        setTimeout(() => onBackRef.current && onBackRef.current(), duration);
      } else {
        setTransform(0, true, SPRING_EASE, 340);
      }
    };

    strip.addEventListener("pointerdown", onPointerDown);
    strip.addEventListener("pointermove", onPointerMove, { passive: false });
    strip.addEventListener("pointerup", finish);
    strip.addEventListener("pointercancel", finish);
    return () => {
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", finish);
      strip.removeEventListener("pointercancel", finish);
      clearTimeout(clearTimer);
    };
  }, []);

  return { stripRef, screenRef };
}

/* ほっこりした羊。記録が無い場所に置いて、画面が寂しくならないようにしている */
function SheepMascot({ size = 132, withNotes = false, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      {withNotes && (
        <g fill="#D6D3D1">
          <circle cx="18" cy="36" r="3.4" /><rect x="20" y="22" width="1.8" height="15" rx="0.9" />
          <circle cx="32" cy="25" r="2.8" /><rect x="33.6" y="13" width="1.6" height="13" rx="0.8" />
        </g>
      )}
      {/* 脚 */}
      <g fill="#D6D3D1">
        <rect x="50" y="80" width="10" height="21" rx="5" />
        <rect x="78" y="80" width="10" height="21" rx="5" />
      </g>
      {/* 耳（顔の後ろ） */}
      <g fill="#E7E5E4">
        <ellipse cx="94" cy="59" rx="7" ry="4.6" transform="rotate(-30 94 59)" />
        <ellipse cx="123" cy="59" rx="7" ry="4.6" transform="rotate(30 123 59)" />
      </g>
      {/* もこもこの体 */}
      <g fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="2.5">
        <circle cx="52" cy="60" r="19" />
        <circle cx="70" cy="50" r="21" />
        <circle cx="88" cy="59" r="18" />
        <circle cx="61" cy="74" r="17" />
        <circle cx="82" cy="75" r="16" />
      </g>
      {/* 顔 */}
      <ellipse cx="108" cy="69" rx="15" ry="14" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="2.5" />
      <g fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="2.5">
        <circle cx="101" cy="58" r="7.5" />
        <circle cx="113" cy="57" r="6.5" />
      </g>
      <circle cx="103" cy="70" r="2.1" fill="#57534E" />
      <circle cx="114" cy="70" r="2.1" fill="#57534E" />
      <path d="M106 76.5 q2.6 2.6 5.2 0" stroke="#A8A29E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* 首もとの鈴（アプリの色） */}
      <circle cx="95" cy="81" r="3.8" fill="#0F766E" opacity="0.9" />
    </svg>
  );
}

/* ろば */
function DonkeyMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <g fill="#C7C2BE">
        <rect x="46" y="78" width="9" height="24" rx="4.5" /><rect x="62" y="80" width="9" height="22" rx="4.5" />
        <rect x="84" y="78" width="9" height="24" rx="4.5" /><rect x="98" y="80" width="9" height="22" rx="4.5" />
      </g>
      <path d="M40 60 q-10 8 -7 19" stroke="#C7C2BE" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="80" r="4.5" fill="#A8A29E" />
      <path d="M95 46 L113 26 L129 40 L111 60 Z" fill="#DAD5D1" />
      <ellipse cx="113" cy="14" rx="5" ry="12" transform="rotate(-16 113 14)" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="130" cy="16" rx="5" ry="12" transform="rotate(14 130 16)" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="72" cy="62" rx="34" ry="21" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="122" cy="36" rx="15" ry="13" fill="#E3DFDB" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="132" cy="44" rx="8.5" ry="7" fill="#F2EFEC" stroke="#C7C2BE" strokeWidth="2" />
      <circle cx="130" cy="43" r="1.3" fill="#8A827C" /><circle cx="135" cy="44.5" r="1.3" fill="#8A827C" />
      <circle cx="119" cy="33" r="2.1" fill="#57534E" />
      <path d="M110 24 q6 -4 11 -1" stroke="#A8A29E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M102 50 q7 6 13 2" stroke="#0F766E" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* ハト（オリーブの枝をくわえている） */
function DoveMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 165 112" width={size} height={size * 112 / 165} className={className} aria-hidden="true">
      <path d="M44 64 Q20 52 8 58 Q16 66 8 76 Q26 78 46 72 Z" fill="#F5F5F4" stroke="#E0DEDB" strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke="#E0A83C" strokeWidth="3" strokeLinecap="round"><path d="M68 84 v9" /><path d="M82 84 v9" /></g>
      <ellipse cx="74" cy="62" rx="33" ry="23" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <circle cx="104" cy="45" r="15" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <path d="M118 45 L130 49 L118 52 Z" fill="#E8B44A" stroke="#D9A23C" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="107" cy="42" r="2.2" fill="#57534E" />
      <ellipse cx="70" cy="58" rx="24" ry="13" transform="rotate(-14 70 58)" fill="#F5F5F4" stroke="#E0DEDB" strokeWidth="2.5" />
      <path d="M58 60 q13 -3 22 2" stroke="#E5E3E0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M130 49 q11 3 19 0" stroke="#0F766E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="141" cy="43" rx="5.5" ry="3.2" transform="rotate(-26 141 43)" fill="#0F766E" opacity="0.85" />
      <ellipse cx="150" cy="52" rx="5.5" ry="3.2" transform="rotate(18 150 52)" fill="#0F766E" opacity="0.85" />
    </svg>
  );
}

/* さかな */
function FishMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <path d="M104 58 L142 34 Q136 58 142 82 Z" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="68" cy="58" rx="40" ry="27" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <ellipse cx="74" cy="34" rx="14" ry="7" transform="rotate(-12 74 34)" fill="#F2F0EE" stroke="#E0DEDB" strokeWidth="2.2" />
      <ellipse cx="66" cy="82" rx="13" ry="6.5" transform="rotate(10 66 82)" fill="#F2F0EE" stroke="#E0DEDB" strokeWidth="2.2" />
      <circle cx="42" cy="52" r="3.2" fill="#57534E" />
      <path d="M30 63 q5 4 10 1" stroke="#A8A29E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M88 42 q6 16 0 32" stroke="#0F766E" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="36" r="3" fill="#0F766E" opacity="0.4" />
      <circle cx="15" cy="26" r="2" fill="#0F766E" opacity="0.3" />
    </svg>
  );
}

/* らくだ */
function CamelMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <g fill="#CFC7BD">
        <rect x="48" y="76" width="9" height="26" rx="4.5" /><rect x="64" y="78" width="9" height="24" rx="4.5" />
        <rect x="86" y="76" width="9" height="26" rx="4.5" /><rect x="100" y="78" width="9" height="24" rx="4.5" />
      </g>
      <path d="M42 58 q-9 8 -6 17" stroke="#CFC7BD" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M98 44 L114 22 L128 34 L110 58 Z" fill="#E3D9CB" />
      <ellipse cx="74" cy="60" rx="34" ry="20" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="74" cy="42" rx="20" ry="13" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="112" cy="16" rx="4" ry="6" transform="rotate(-20 112 16)" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2" />
      <ellipse cx="120" cy="30" rx="13" ry="11" fill="#EDE5D9" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="130" cy="37" rx="8" ry="6.5" fill="#F5EFE6" stroke="#CFC7BD" strokeWidth="2" />
      <circle cx="128" cy="36" r="1.2" fill="#8A827C" /><circle cx="133" cy="37" r="1.2" fill="#8A827C" />
      <circle cx="117" cy="27" r="2" fill="#57534E" />
      <path d="M64 40 q10 -5 20 -1" stroke="#0F766E" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* ぶどう */
function GrapesMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <path d="M75 30 q2 -10 -6 -16" stroke="#A8A29E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <ellipse cx="56" cy="16" rx="12" ry="7" transform="rotate(-24 56 16)" fill="#0F766E" opacity="0.7" />
      <ellipse cx="88" cy="18" rx="10" ry="6" transform="rotate(20 88 18)" fill="#0F766E" opacity="0.5" />
      <g fill="#FFFFFF" stroke="#DDD9D5" strokeWidth="2.5">
        <circle cx="58" cy="42" r="11" /><circle cx="76" cy="40" r="11" /><circle cx="93" cy="44" r="11" />
        <circle cx="66" cy="58" r="11" /><circle cx="84" cy="58" r="11" />
        <circle cx="57" cy="74" r="10" /><circle cx="75" cy="75" r="11" /><circle cx="93" cy="72" r="10" />
        <circle cx="66" cy="90" r="10" /><circle cx="84" cy="89" r="10" />
      </g>
    </svg>
  );
}

const DEFAULT_MASCOT_COUNT = 6;
function DefaultMascot({ variant = 0, size = 132, withNotes = false, className = "" }) {
  if (variant === 1) return <DonkeyMascot size={size} className={className} />;
  if (variant === 2) return <DoveMascot size={size} className={className} />;
  if (variant === 3) return <FishMascot size={size} className={className} />;
  if (variant === 4) return <CamelMascot size={size} className={className} />;
  if (variant === 5) return <GrapesMascot size={size} className={className} />;
  return <SheepMascot size={size} withNotes={withNotes} className={className} />;
}

/* アップロードしたイラストを画面のあちこちに散らすための仕組み。
   未登録のときは ひつじ・ろば・ハト が場所ごとに出る */
const ArtworkContext = React.createContext([]);
const PrefsContext = React.createContext(null);
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0;
  return h;
}
/* どの seed がどの画面かの一覧。イラスト設定画面で「どこに出るか」を見せるために使う */
const MASCOT_GROUPS = [
  { key: "reading" },
  { key: "message" },
  { key: "memorization" },
  { key: "memo" },
  { key: "empty" },
];
/* イラストのまとまりの見出し。
   **書き決めにしないこと。** 記録の種類の名前はカスタマイズ画面で変えられるので、
   書き決めにすると「通読」を別の名前にしたときに、ここだけ古い名前が残ってしまう */
function mascotGroupLabel(key, typeNames) {
  if (key === "empty") return "からっぽの画面";
  return `${typeNameOf(key, typeNames)}・ほか`;
}
function typeNameOf(key, typeNames) {
  return (typeNames && typeNames[key]) || TYPE_LABELS[key] || key;
}
/* 場所の名前。記録画面のものは `form` を持たせてあり、種類の名前から作る */
function mascotSpotLabel(spot, typeNames) {
  if (!spot) return "";
  return spot.form ? `${typeNameOf(spot.form, typeNames)}の記録画面` : spot.label;
}
/* 各グループが受け持つ場所。記録の種類ごとに「その種類の画面」＋「共通の場所」を分担する */
const MASCOT_SPOTS = [
  /* からっぽの画面 */
  { seed: "calendar-empty", group: "empty", label: "日ごとの記録・記録のない日" },
  { seed: "records-empty", group: "empty", label: "記録一覧・記録なし" },
  { seed: "search-empty", group: "empty", label: "探す・結果なし" },
  { seed: "book-empty", group: "empty", label: "書別・記録なし" },
  /* 通読 */
  { seed: "form-reading", group: "reading", form: "reading" },
  /* 学び */
  { seed: "form-message", group: "message", form: "message" },
  { seed: "records-end", group: "message", label: "記録一覧の最後" },
  /* 聖句 */
  { seed: "form-memorization", group: "memorization", form: "memorization" },
  { seed: "home-banner", group: "memorization", label: "ホーム上部" },
  /* その他 */
  { seed: "form-memo", group: "memo", form: "memo" },
  { seed: "progress-foot", group: "memo", label: "実績の最後" },
  { seed: "menu", group: "memo", label: "メニュー" },
  { seed: "tags-empty", group: "empty", label: "タグの整理・タグなし" },
  { seed: "help", group: "memo", label: "ヘルプ画面" },
];

/* 一覧の並び順で順ぐりに割り当てる（デフォルトの絵を選ぶときに使う） */
/* はじめからの絵は「分類ごと」に決める。
   画面のカスタマイズで見えている見本と、実際に出る絵を必ず一致させるため、
   MASCOT_GROUPS の並び順をそのまま絵の番号として使う。
   （以前は MASCOT_SPOTS の並び順で決めていたため、見本と実物がずれていた） */
function slotFor(seed, count) {
  if (count <= 0) return 0;
  const spot = MASCOT_SPOTS.find((sp) => sp.seed === seed);
  const i = spot ? MASCOT_GROUPS.findIndex((g) => g.key === spot.group) : -1;
  return (i >= 0 ? i : hashSeed(seed)) % count;
}
/* その場所を受け持つグループに登録された絵を探す。
   誰も登録していないグループの場所には、はじめから用意した絵が出る */
function pickArtwork(seed, artworks) {
  if (!artworks || !artworks.length) return null;
  const spot = MASCOT_SPOTS.find((sp) => sp.seed === seed);
  if (!spot) return null;
  const pool = artworks.filter((a) => a.group === spot.group);
  if (!pool.length) return null;
  const order = MASCOT_SPOTS.filter((sp) => sp.group === spot.group).findIndex((sp) => sp.seed === seed);
  return pool[(order < 0 ? 0 : order) % pool.length];
}
function Mascot({ seed = "a", size = 132, withNotes = false, className = "" }) {
  const artworks = React.useContext(ArtworkContext);
  const prefs = React.useContext(PrefsContext);
  if (prefs && prefs.showMascots === false) return null;
  const art = pickArtwork(seed, artworks);
  if (!art) return <DefaultMascot variant={slotFor(seed, DEFAULT_MASCOT_COUNT)} size={size} withNotes={withNotes} className={className} />;
  return (
    <img src={art.src} alt="" aria-hidden="true"
      className={"object-contain " + className}
      style={{ width: size, height: size, maxWidth: "100%" }} />
  );
}


/* ============================================================
   果樹を育てる（ホーム画面）
   通読した日数と記録の件数の**両方**が条件に届くと、次の段階へ進む。
   最後の段階は「100日かつ153件」なので、日数だけ経っても実らない。
   **画面に出す文には「100日」と書かないこと。**
   日数だけで実るかのように読めてしまい、実際と食い違う
   ============================================================ */
/* 育てられる実。ripe=熟した色、mid=色づき始め、blossom=花の色 */
const FRUITS = [
  { key: "apple",  label: "りんご",   ripe: "#E2685C", mid: "#E8A88F", blossom: "#F9DCD8", shape: "round" },
  { key: "pear",   label: "梨",       ripe: "#D8C077", mid: "#DDD3A2", blossom: "#FFFFFF", shape: "pear" },
  { key: "peach",  label: "桃",       ripe: "#F0A0AA", mid: "#F4C6CA", blossom: "#F9CBD3", shape: "round" },
  { key: "orange", label: "オレンジ", ripe: "#E8994A", mid: "#EDC08D", blossom: "#FFF6E4", shape: "round" },
  { key: "cherry", label: "さくらんぼ", ripe: "#D8556B", mid: "#E294A2", blossom: "#FBDEE5", shape: "cherry" },
];
const fruitByKey = (k) => FRUITS.find((f) => f.key === k) || FRUITS[0];

const SOIL_D = "#C9A883", SOIL_L = "#DCC0A0";
const LEAF_D = "#5FA985", LEAF_L = "#7FC3A0", TRUNK = "#B2896B", TRUNK_D = "#9A7357";
const YOUNG = "#8FBF92";

/* 2色を混ぜる。青い実にほんのり品種の色を混ぜ、何を育てているか分かるようにする */
function blend(a, b, t) {
  const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(a), [r2, g2, b2] = h(b);
  const m = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

/* 土の山。全ステージ共通の足元 */
function Soil() {
  return (
    <g>
      <ellipse cx="60" cy="116" rx="46" ry="12" fill={SOIL_D} />
      <ellipse cx="60" cy="113" rx="46" ry="11" fill={SOIL_L} />
      <ellipse cx="44" cy="112" rx="4" ry="2" fill={SOIL_D} opacity="0.55" />
      <ellipse cx="74" cy="115" rx="5" ry="2" fill={SOIL_D} opacity="0.45" />
      <ellipse cx="60" cy="108" rx="3" ry="1.6" fill={SOIL_D} opacity="0.4" />
    </g>
  );
}

/* 葉っぱ1枚 */
function Leaf({ x, y, rot = 0, len = 13, w = 8, color = LEAF_L }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q${len * 0.55} ${-w} ${len} 0 Q${len * 0.55} ${w} 0 0 Z`} fill={color} />
      <path d={`M2 0 L${len - 2} 0`} stroke="#FFFFFF" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    </g>
  );
}

/* 幹と枝 */
function Trunk() {
  return (
    <g>
      <path d="M54 116 Q56 96 55.5 80 L64.5 80 Q64 96 66 116 Z" fill={TRUNK} />
      <path d="M60 100 L46 88" stroke={TRUNK_D} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 94 L74 84" stroke={TRUNK_D} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/* こんもりした葉のかたまり */
function Canopy({ full = true }) {
  return full ? (
    <g>
      <circle cx="60" cy="60" r="27" fill={LEAF_D} />
      <circle cx="38" cy="74" r="18" fill={LEAF_D} />
      <circle cx="82" cy="74" r="18" fill={LEAF_D} />
      <circle cx="60" cy="76" r="20" fill={LEAF_L} />
      <circle cx="46" cy="58" r="16" fill={LEAF_L} />
      <circle cx="76" cy="60" r="15" fill={LEAF_L} />
    </g>
  ) : (
    <g>
      <circle cx="60" cy="70" r="21" fill={LEAF_D} />
      <circle cx="44" cy="80" r="14" fill={LEAF_D} />
      <circle cx="76" cy="80" r="14" fill={LEAF_D} />
      <circle cx="58" cy="78" r="15" fill={LEAF_L} />
      <circle cx="50" cy="66" r="12" fill={LEAF_L} />
    </g>
  );
}

/* 実のなる位置 */
const SPOTS = [[44, 62], [72, 54], [60, 84], [84, 74], [36, 80], [64, 66]];

function Fruit({ x, y, r, color, shape, stem = true }) {
  if (shape === "cherry") {
    return (
      <g>
        {stem && <>
          <path d={`M${x - 4} ${y - r} Q${x - 2} ${y - r - 8} ${x + 3} ${y - r - 10}`} stroke="#7FA86B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M${x + 5} ${y - r + 1} Q${x + 5} ${y - r - 7} ${x + 3} ${y - r - 10}`} stroke="#7FA86B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>}
        <circle cx={x - 4} cy={y} r={r * 0.82} fill={color} />
        <circle cx={x + 5} cy={y + 1.5} r={r * 0.82} fill={color} />
        <circle cx={x - 5.5} cy={y - 1.5} r={r * 0.24} fill="#FFFFFF" opacity="0.55" />
      </g>
    );
  }
  if (shape === "pear") {
    return (
      <g>
        {stem && <path d={`M${x} ${y - r * 1.15} L${x} ${y - r * 1.55}`} stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />}
        <path d={`M${x} ${y - r * 1.2}
                  C${x - r * 0.62} ${y - r * 0.9} ${x - r * 0.5} ${y - r * 0.15} ${x - r * 0.92} ${y + r * 0.35}
                  C${x - r * 1.2} ${y + r * 1.1} ${x + r * 1.2} ${y + r * 1.1} ${x + r * 0.92} ${y + r * 0.35}
                  C${x + r * 0.5} ${y - r * 0.15} ${x + r * 0.62} ${y - r * 0.9} ${x} ${y - r * 1.2} Z`} fill={color} />
        <ellipse cx={x - r * 0.35} cy={y + r * 0.3} rx={r * 0.2} ry={r * 0.3} fill="#FFFFFF" opacity="0.5" />
      </g>
    );
  }
  return (
    <g>
      {stem && <path d={`M${x} ${y - r * 0.95} L${x + 0.5} ${y - r - 4}`} stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />}
      <circle cx={x} cy={y} r={r} fill={color} />
      <ellipse cx={x - r * 0.34} cy={y - r * 0.32} rx={r * 0.22} ry={r * 0.3} fill="#FFFFFF" opacity="0.5" transform={`rotate(-25 ${x - r * 0.34} ${y - r * 0.32})`} />
      {stem && <path d={`M${x + 1} ${y - r - 2} q6 -3 8 1 q-6 3 -8 -1 Z`} fill={LEAF_L} />}
    </g>
  );
}

function Blossom({ x, y, r, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.72} rx={r * 0.42} ry={r * 0.6} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r={r * 0.34} fill="#F2C14E" />
    </g>
  );
}

function Sparkle({ x, y, s = 4, color = "#F2C14E", twinkle = false, delay = 0 }) {
  return (
    <path
      className={twinkle ? "ft-sparkle" : undefined}
      style={twinkle ? { animationDelay: `${delay}s` } : undefined}
      d={`M${x} ${y - s} Q${x + s * 0.28} ${y - s * 0.28} ${x + s} ${y} Q${x + s * 0.28} ${y + s * 0.28} ${x} ${y + s} Q${x - s * 0.28} ${y + s * 0.28} ${x - s} ${y} Q${x - s * 0.28} ${y - s * 0.28} ${x} ${y - s} Z`}
      fill={color} />
  );
}

/* 10段階の果樹。stage は 1〜10 */
function FruitTree({ stage = 1, fruit = "apple", size = 150, className = "", sparkle = false }) {
  const f = fruitByKey(fruit);
  const s = Math.min(10, Math.max(1, stage));
  return (
    <svg viewBox="0 0 120 132" width={size} height={size * 132 / 120} className={className} aria-hidden="true">
      <Soil />

      {/* 今日の記録が入った日は、木のまわりがきらめく */}
      {sparkle && (
        <g>
          <Sparkle x={60} y={13} s={6} twinkle delay={0} />
          <Sparkle x={27} y={26} s={4.5} twinkle delay={0.5} />
          <Sparkle x={94} y={22} s={5} twinkle delay={0.9} />
          <Sparkle x={12} y={56} s={3.5} twinkle delay={1.4} />
          <Sparkle x={109} y={50} s={4} twinkle delay={1.9} />
        </g>
      )}

      {s === 1 && (
        <g>
          <ellipse cx="60" cy="106" rx="5" ry="3.6" fill="#A98763" />
          <ellipse cx="58.5" cy="105" rx="2" ry="1.4" fill="#C4A284" />
          <Sparkle x={30} y={92} s={4} color="#E7D6B8" />
          <Sparkle x={90} y={86} s={5} color="#E7D6B8" />
          <Sparkle x={74} y={100} s={3} color="#E7D6B8" />
        </g>
      )}

      {s === 2 && (
        <g>
          <path d="M60 110 Q59 102 60 96" stroke={YOUNG} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Leaf x={60} y={96} rot={-32} len={14} w={8.5} color={LEAF_L} />
        </g>
      )}

      {s === 3 && (
        <g>
          <path d="M60 110 Q59 100 60 90" stroke={YOUNG} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <Leaf x={59} y={91} rot={-152} len={16} w={9.5} color={LEAF_L} />
          <Leaf x={61} y={91} rot={-28} len={16} w={9.5} color={LEAF_D} />
        </g>
      )}

      {s === 4 && (
        <g>
          <path d="M60 112 Q58 96 60 80" stroke={TRUNK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 94 L50 87" stroke={TRUNK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M60 88 L71 82" stroke={TRUNK} strokeWidth="2.6" strokeLinecap="round" />
          <Leaf x={50} y={87} rot={-160} len={14} w={8} color={LEAF_D} />
          <Leaf x={71} y={82} rot={-20} len={14} w={8} color={LEAF_L} />
          <Leaf x={59} y={80} rot={-145} len={13} w={7.5} color={LEAF_L} />
          <Leaf x={61} y={79} rot={-38} len={13} w={7.5} color={LEAF_D} />
        </g>
      )}

      {s === 5 && (<g><Trunk /><Canopy full={false} /></g>)}

      {s >= 6 && (<g><Trunk /><Canopy /></g>)}

      {s === 6 && SPOTS.slice(0, 5).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.6" fill={f.blossom} />
          <circle cx={x} cy={y} r="2.4" fill={f.mid} opacity="0.7" />
        </g>
      ))}

      {s === 7 && SPOTS.map(([x, y], i) => <Blossom key={i} x={x} y={y} r={i % 2 ? 7 : 8.4} color={f.blossom} />)}

      {s === 8 && SPOTS.slice(0, 4).map(([x, y], i) => (
        <Fruit key={i} x={x} y={y} r={5} color={blend(YOUNG, f.ripe, 0.18)} shape={f.shape} stem={false} />
      ))}

      {s === 9 && SPOTS.slice(0, 5).map(([x, y], i) => (
        <Fruit key={i} x={x} y={y} r={7.6} color={i % 2 ? f.mid : YOUNG} shape={f.shape} />
      ))}

      {s === 10 && (
        <g>
          {SPOTS.map(([x, y], i) => <Fruit key={i} x={x} y={y} r={9.4} color={f.ripe} shape={f.shape} />)}
          <Sparkle x={22} y={54} s={5} twinkle delay={0.2} />
          <Sparkle x={100} y={46} s={6} twinkle delay={0.8} />
          <Sparkle x={96} y={96} s={4} twinkle delay={1.2} />
          <Sparkle x={26} y={96} s={4} twinkle delay={1.7} />
        </g>
      )}
    </svg>
  );
}

/* 10段階。days=通読した日数、count=記録の件数（かつ判定） */
const STAGES = [
  { n: 1,  name: "ふかふかの土",         days: 0,   count: 0,
    verse: "良い地に蒔かれたものとは、みことばを聞いて悟る人のことです。本当に実を結び、あるものは百倍、あるものは六十倍、あるものは三十倍の実を結びます。", ref: "マタイの福音書 13:23" },
  { n: 2,  name: "ちいさな芽",           days: 1,   count: 1,
    verse: "見よ、わたしは新しいことを行う。\n今、それが芽生えている。\nあなたがたは、それを知らないのか。\n必ず、わたしは荒野に道を、\n荒れ地に川を設ける。", ref: "イザヤ書 43:19" },
  { n: 3,  name: "かわいい双葉",         days: 3,   count: 4,
    verse: "私が植えて、アポロが水を注ぎました。しかし、成長させたのは神です。", ref: "コリント人への手紙 第一 3:6" },
  { n: 4,  name: "本葉と小枝",           days: 7,   count: 12,
    verse: "主のおしえを喜びとし\n昼も夜も　そのおしえを口ずさむ人。\nその人は\n流れのほとりに植えられた木。\n時が来ると実を結び\nその葉は枯れず\nそのなすことはすべて栄える。", ref: "詩篇 1:2-3" },
  { n: 5,  name: "青々とした若木",       days: 15,  count: 24,
    verse: "しかし、主を待ち望む者は新しく力を得、\n鷲のように、翼を広げて上ることができる。\n走っても力衰えず、歩いても疲れない。", ref: "イザヤ書 40:31" },
  { n: 6,  name: "小さなつぼみ",         days: 30,  count: 47,
    verse: "神のなさることは、すべて時にかなって美しい。", ref: "伝道者の書 3:11" },
  { n: 7,  name: "可憐な花（満開）",     days: 45,  count: 69,
    verse: "しかし、わたしが与える水を飲む人は、いつまでも決して渇くことがありません。わたしが与える水は、その人の内で泉となり、永遠のいのちへの水が湧き出ます。", ref: "ヨハネの福音書 4:14" },
  { n: 8,  name: "青くて小さな実",       days: 62,  count: 94,
    verse: "しかし、御霊の実は、愛、喜び、平安、寛容、親切、善意、誠実、柔和、自制です。このようなものに反対する律法はありません。", ref: "ガラテヤ人への手紙 5:22-23" },
  { n: 9,  name: "大きく膨らんだ実",     days: 80,  count: 123,
    verse: "私を強くしてくださる方によって、私はどんなことでもできるのです。", ref: "ピリピ人への手紙 4:13" },
  { n: 10, name: "熟した美味しそうな実", days: 100, count: 153,
    verse: "ですから、私の愛する兄弟たち。堅く立って、動かされることなく、いつも主のわざに励みなさい。あなたがたは、自分たちの労苦が主にあって無駄でないことを知っているのですから。", ref: "コリント人への手紙 第一 15:58" },
];

/* 記録の日付。無ければ作成日を使う */
const recDate = (r) => (r && (r.date || (r.createdAt || "").slice(0, 10))) || "";

/* 日数も件数も、記録の種類を問わずすべて数える。
   木がきらめく条件「今日なにか記録したか」と揃えている。
   日数は記録に付けた日付の種類数（同じ日に何件書いても1日）。 */
function cycleCounts(records, startedAt) {
  const inCycle = (records || []).filter((r) => r && recDate(r) >= startedAt);
  const days = new Set(inCycle.map(recDate).filter(Boolean));
  return { days: days.size, count: inCycle.length };
}

/* 条件を満たしている一番上の段階を返す */
function stageOf(days, count) {
  let cur = STAGES[0];
  for (const st of STAGES) if (days >= st.days && count >= st.count) cur = st;
  return cur;
}

/* 画面右上の三本線メニュー。各画面から共通で開けるようにコンテキストで配る */
const MenuContext = React.createContext(null);
/* 書き出していない記録の件数。三本線のバッジなどで使う */
const UnsavedContext = React.createContext(0);

/* 重なって出る画面のヘッダに置く三本線。記録の作成・編集画面には出さない */
/* 三本線と、その右上に出す未保存の印。
   印は必ず「アイコンを包んだ span」を基準に置くこと。
   以前はボタンの角からの距離（top:12 / right:9 など）で置いていた。
   この置き方はボタンとアイコンの大きさが特定の組み合わせのときしか合わず、
   タブの見出し（ボタン56px・アイコン32px）では印がアイコンに重なっていた。
   アイコン基準にしておけば、どの大きさの組み合わせでも必ず右上に出る */
function MenuIconWithBadge({ size, unsaved, ringClass }) {
  return (
    <span className="relative inline-flex">
      <Menu size={size} strokeWidth={2.4} />
      {unsaved > 0 && (
        <span className={"absolute bg-amber-500 border-2 " + ringClass}
          style={{ top: -5, right: -5, width: 14, height: 14, borderRadius: 9999 }} />
      )}
    </span>
  );
}

function MenuButton({ size = 46 }) {
  const openMenu = React.useContext(MenuContext);
  const unsaved = React.useContext(UnsavedContext);
  if (!openMenu) return null;
  return (
    <button onClick={openMenu} aria-label={unsaved > 0 ? `メニュー（未保存 ${unsaved}件）` : "メニュー"}
      className="relative flex items-center justify-center rounded-xl text-neutral-800 hover:bg-neutral-200/70 ft-tap ft-tap-icon shrink-0"
      style={{ minWidth: size, minHeight: size }}>
      <MenuIconWithBadge size={26} unsaved={unsaved} ringClass="border-white" />
    </button>
  );
}

/* 画面の説明文は置かない。使い方はメニューの「ヘルプ」と「？」にまとめてある。
   説明が無くなったぶん、画面名は大きくしてある */
function ScreenHeader({ title, right }) {
  const openMenu = React.useContext(MenuContext);
  const unsaved = React.useContext(UnsavedContext);
  return (
    <div className="px-5 pb-2.5 sticky top-0 bg-neutral-50 z-10 border-b border-neutral-200" style={SAFE_TOP(18)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0"><h1 className="font-display text-[27px] text-neutral-900 tracking-wide truncate">{title}</h1></div>
        <div className="flex items-center gap-1 shrink-0">
          {right}
          {openMenu && (
            <button onClick={openMenu} aria-label={unsaved > 0 ? `メニュー（未保存 ${unsaved}件）` : "メニュー"}
              className="relative flex items-center justify-center rounded-xl text-neutral-800 hover:bg-neutral-200/70 ft-tap ft-tap-icon shrink-0"
              style={{ minWidth: 56, minHeight: 56 }}>
              <MenuIconWithBadge size={32} unsaved={unsaved} ringClass="border-neutral-50" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* 右から出てくる一般的なドロワーメニュー */
function MenuRow({ it }) {
  const [pressed, go] = useTapThen(it.onClick);
  return (
    <button onClick={go}
      className={"w-full flex items-center gap-3 px-5 py-4 text-left min-h-[60px] ft-tap ft-tap-card "
        + (pressed ? "bg-neutral-200 ft-tap-pressed" : "hover:bg-neutral-50")}>
      <span className="w-10 h-10 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0 text-th-800">{it.icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-display text-[17px] text-neutral-900 tracking-wide">{it.label}</span>
        {it.desc && <span className="block text-[12.5px] text-neutral-500 mt-0.5">{it.desc}</span>}
      </span>
      <CountBadge n={it.badge} size={22} />
      <ChevronRight size={18} className="text-neutral-400 shrink-0" />
    </button>
  );
}

function SideMenu({ open, onClose, items, footer, instant }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    let t;
    if (open) {
      setMounted(true);
      t = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(t);
    }
    /* 画面へ移るときは、メニューが左へ滑って消える動きを見せない。
       元の画面はそのままで、新しい画面だけが右から来るようにするため */
    if (instant) {
      /* 画面へ移るときは、メニューを動かさずその場で消す。
         ただし要素を即座に外すと、その位置にある別のものがタップを拾って
         違う画面が開いてしまう。透明なまま少しの間だけ残して受け止める */
      setShown(false);
      setShield(true);
      const q = setTimeout(() => { setShield(false); setMounted(false); }, 320);
      return () => clearTimeout(q);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [open]); // eslint-disable-line

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return (
    <div className="fixed inset-0" style={{ zIndex: 2147483200 }}>
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        style={{ opacity: shown ? 1 : 0, transition: "opacity 240ms cubic-bezier(0.16,1,0.3,1)" }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[84%] max-w-[340px] bg-white shadow-xl flex flex-col"
        style={{ transform: shown ? "translateX(0)" : "translateX(100%)", transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="flex items-center justify-between px-5 pb-4 border-b border-neutral-200 shrink-0" style={SAFE_TOP(16)}>
          <span className="font-display text-[18px] text-neutral-900">メニュー</span>
          <button onClick={onClose} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 ft-seq">
          {items.map((it) => (
            <MenuRow key={it.label} it={it} />
          ))}
        </div>
        {footer && (
          <div className="border-t border-neutral-200 px-5 py-4 shrink-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* YouTubeの埋め込み再生は廃止した。
   メモ欄に貼られたURLは、種類を問わず同じように押せるリンクとして描いている
   （HighlightedText が受け持つ） */

/* ============================================================
   種類ラベル / バッジ
   ============================================================ */
/* 「疑問」は廃止した。古い記録は migrateRecord で「その他」へ移している。
   万一残っていても壊れないよう、TYPE_COLORS には控えを残してある */
const TYPE_LABELS = { reading: "通読", message: "学び", memorization: "聖句", memo: "その他" };
/* 探すの「記録の種類」で並べる順。TYPE_LABELS の並びをそのまま使う */
const SEARCH_TYPES = ["reading", "message", "memorization", "memo"];
const TYPE_BADGE = {
  reading: "bg-blue-50 text-blue-800 border border-blue-200",
  message: "bg-amber-50 text-amber-800 border border-amber-200",
  memorization: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  memo: "bg-neutral-100 text-neutral-700 border border-neutral-300",
  /* 「疑問」は廃止したが、万一残っていても色が付くように控えを残す */
  question: "bg-rose-50 text-rose-800 border border-rose-200",
};
function TypeBadge({ type }) { const N = useTypeName(); return <span className={"text-[11.5px] font-bold px-2 py-0.5 rounded-full " + TYPE_BADGE[type]}>{N[type] || TYPE_LABELS[type]}</span>; }

/* tags はどの種類の記録にも共通で持たせる自由なラベル。
   決まった一覧を持たず、これまでに使った言葉を集めて候補にするので、
   新しいタグが増えても探す側の作りを直す必要はない */
function emptyRecord(type) {
  const base = { id: uid(), type, createdAt: new Date().toISOString(), tags: [] };
  if (type === "reading") return { ...base, date: todayStr(), book: "", chapters: [], passageText: "", notes: "" };
  if (type === "message") return { ...base, date: todayStr(), passageText: "", mainVerseText: "", notes: "" };
  if (type === "memorization") return { ...base, date: todayStr(), text: "", note: "", monthYear: null, monthMonth: null, themeYear: null };
  /* その他は「日付・メモ・タグ」だけの、いちばん自由な記録 */
  return { ...base, date: todayStr(), notes: "" };
}

/* ============================================================
   削除確認ダイアログ
   ============================================================ */
function ConfirmDeleteDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">この記録を削除しますか？</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">記録そのものが消えます。この操作は取り消せません。</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button onClick={onConfirm} className={BTN_DANGER + " flex-1 " + BTN_H + " text-[14.5px]"}>削除する</button>
        </div>
      </div>
    </div>
  );
}

function ExitConfirmDialog({ onSave, onDiscard, onStay }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">保存されていない内容があります</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">この記録を保存しますか？保存しない場合、入力した内容は失われます。</p>
        <div className="flex gap-2.5 mb-2.5">
          <button onClick={onDiscard} className={BTN_DANGER_SOFT + " flex-1 " + BTN_H + " text-[14.5px]"}>保存しない</button>
          <button onClick={onSave} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>保存する</button>
        </div>
        <button onClick={onStay} className={BTN_QUIET + " w-full " + BTN_H + " text-[14.5px]"}>キャンセル</button>
      </div>
    </div>
  );
}

/* 同じ箇所に残した過去の記録を、静かに思い出させるパネル */
function PastNotesPanel({ notes }) {
  const [open, setOpen] = useState(false);
  if (!notes.length) return null;
  return (
    <div className="mb-5 rounded-xl border-2 border-amber-200 bg-amber-50/60 overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-3.5 py-3 text-left min-h-[48px] ft-tap ft-tap-card">
        <Sparkles size={16} className="text-amber-700 shrink-0" />
        <span className="flex-1 text-[13.5px] font-bold text-amber-900">この箇所には過去のメモがあります（{notes.length}件）</span>
        <ChevronDown size={17} className={"text-amber-700 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 ft-open-y">
          {notes.map((r) => (
            <div key={r.id} className="rounded-lg bg-white border border-amber-200 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <TypeBadge type={r.type} />
                <span className="text-[11.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>
              </div>
              <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(recordFullDisplay(r), 4)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   記録フォーム
   ============================================================ */
function RecordForm({ initial, draft, onSave, onCancel, onDelete, allRecords, onQuickMemorize, captions, onAutoDraft, typeLocked, knownTags, onCreateTag }) {
  const startRecord = () => (initial ? migrateRecord(initial) : (draft || emptyRecord(initial?.type || "reading")));
  const [type, setType] = useState(initial?.type || draft?.type || "reading");
  const [record, setRecord] = useState(startRecord);
  const [confirmDelete, setConfirmDelete] = useState(false);
  /* 今月・今年の聖句を、ほかの記録から付け替えるとき。
     ここでは記録を書き換えず、どれから外すかだけ覚えておき、
     保存が押されたときに実際の付け替えを行う。
     先に外してしまうと、そのあと「キャンセル」されたときに
     元の記録だけ印が消える、という取り返しのつかないことが起きる */
  const [takeover, setTakeover] = useState(null);
  const [steal, setSteal] = useState({ month: null, year: null });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [baseline, setBaseline] = useState(() => JSON.stringify(startRecord()));

  /* 種類を変えたら中身を作り直す。
     画面を開いた直後には作り直さない。開いた直後にも走らせると、
     「続きから」で引き継いだ内容や書きかけの下書きが消えてしまう。
     「何回目の実行か」で判定すると、Reactの厳格モードでは処理が2回走るため
     すり抜けてしまう。そこで「前回どの種類で用意したか」を覚えておき、
     変わったときだけ作り直す（何回走っても結果が同じになる） */
  const preparedForRef = useRef(type);
  useEffect(() => {
    if (preparedForRef.current === type) return;
    preparedForRef.current = type;
    if (!initial) {
      const fresh = emptyRecord(type);
      setRecord(fresh);
      setBaseline(JSON.stringify(fresh));
    }
  }, [type]); // eslint-disable-line
  const set = (patch) => setRecord((r) => ({ ...r, ...patch }));
  const save = () => onSave({ ...record, type, updatedAt: new Date().toISOString() }, { steal });

  /* 途中保存。画面を閉じずにその時点の内容を残す。
     押した手ごたえが伝わるよう、ボタン自身がしばらく「保存しました」に変わる。
     2回目以降も毎回変わるので、押せたことが必ず分かる */
  const [savedAt, setSavedAt] = useState(null);
  const [justSaved, setJustSaved] = useState(false);
  const justSavedTimer = useRef(null);
  useEffect(() => () => clearTimeout(justSavedTimer.current), []);
  const saveAndStay = () => {
    const rec = { ...record, type, updatedAt: new Date().toISOString() };
    onSave(rec, { keepOpen: true, steal });
    setBaseline(JSON.stringify(record));
    const d = new Date();
    setSavedAt(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    setJustSaved(true);
    clearTimeout(justSavedTimer.current);
    justSavedTimer.current = setTimeout(() => setJustSaved(false), 1800);
  };

  /* 自動下書き。入力が止まって少ししたら、そっと控えを取る。
     アプリが背面に回ったときや閉じられるときは、その場ですぐ控える */
  const recRef = useRef(record);
  recRef.current = record;
  const typeRef = useRef(type);
  typeRef.current = type;
  useEffect(() => {
    if (!onAutoDraft) return;
    const t = setTimeout(() => onAutoDraft({ ...record, type }), 800);
    return () => clearTimeout(t);
  }, [record, type]); // eslint-disable-line
  useEffect(() => {
    if (!onAutoDraft) return;
    const flush = () => onAutoDraft({ ...recRef.current, type: typeRef.current });
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, []); // eslint-disable-line

  const isDirty = () => JSON.stringify(record) !== baseline;
  const guardClose = () => {
    if (isDirty()) { setShowExitConfirm(true); return false; }
    return true;
  };
  const [closing, close] = useClosing(onCancel);
  const [savingClose, setSavingClose] = useState(false);
  const saveTimer = useRef(null);
  useEffect(() => () => clearTimeout(saveTimer.current), []);
  const handleCloseAttempt = () => { if (guardClose()) close(); };
  /* 保存したら、記録の画面が下へ消えてから実際に保存される */
  const saveWithExit = () => {
    if (savingClose) return;
    setSavingClose(true);
    saveTimer.current = setTimeout(() => save(), 230);
  };

  /* いま扱っている聖書箇所に、過去の記録があれば拾い上げる */
  const pastNotes = useMemo(() => {
    let refs = [];
    if (type === "reading" && record.book) refs = (record.chapters || []).map((c) => ({ book: record.book, chapter: c }));
    else if (type === "message") refs = parseBibleRefs(record.passageText || "");
    if (!refs.length) return [];
    return (allRecords || [])
      .filter((r) => r.id !== record.id && recordFullDisplay(r).trim())
      .filter((r) => recordRefs(r).some((x) => refs.some((t) => x.book === t.book && x.chapter === t.chapter)))
      .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))
      .slice(0, 6);
  }, [type, record.book, record.chapters, record.passageText, record.id, allRecords]);

  const typeNames = useTypeName();
  const formTitle = initial ? "記録を編集" : (typeLocked ? `${typeNames[type] || TYPE_LABELS[type] || ""}を記録` : "新しい記録");
  const yearOptions = Array.from({ length: 7 }, (_, i) => curYear() - 3 + i);

  /* 今月・今年の聖句を付けようとしたとき、すでに別の記録に付いていないか調べる。
     付いていれば確認を出し、「変える」を選ばれたときだけ、
     どれから外すかを覚えておく（実際に外すのは保存のとき） */
  const holderOfMonth = (y, m) => (allRecords || []).find(
    (r) => r.type === "memorization" && r.id !== record.id && r.monthYear === y && r.monthMonth === m);
  const holderOfYear = (y) => (allRecords || []).find(
    (r) => r.type === "memorization" && r.id !== record.id && r.themeYear === y);

  const wantMonth = (y, m) => {
    if (!y || !m) { set({ monthYear: y || null, monthMonth: m || null }); return; }
    const other = holderOfMonth(y, m);
    if (!other) { setSteal((p) => ({ ...p, month: null })); set({ monthYear: y, monthMonth: m }); return; }
    setTakeover({ kind: "month", what: `${y}年${m}月の聖句`, existing: other,
      apply: () => { setSteal((p) => ({ ...p, month: other.id })); set({ monthYear: y, monthMonth: m }); } });
  };
  const wantYear = (y) => {
    if (!y) { set({ themeYear: null }); return; }
    const other = holderOfYear(y);
    if (!other) { setSteal((p) => ({ ...p, year: null })); set({ themeYear: y }); return; }
    setTakeover({ kind: "year", what: `${y}年の聖句`, existing: other,
      apply: () => { setSteal((p) => ({ ...p, year: other.id })); set({ themeYear: y }); } });
  };

  const { stripRef, screenRef } = useEdgeSwipeBack(onCancel, guardClose);

  return (
    <OverlayScreen from="bottom" closing={closing || savingClose}>
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-4 pb-4 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <h2 className="font-display text-[20px] text-neutral-900 flex-1 min-w-0 truncate pl-1 tracking-wide">{formTitle}</h2>
        {savedAt && (
          <span className={"text-[11.5px] font-bold shrink-0 tabular-nums " + (isDirty() ? "text-neutral-400" : "text-th-800/80")}>最終保存 {savedAt}</span>
        )}
        <button onClick={saveAndStay} aria-label={justSaved ? "保存しました" : "途中保存する"}
          disabled={!isDirty() && !justSaved}
          className={"relative w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 ft-tap ft-tap-icon "
            + (justSaved ? "border-th-800 bg-th-800 text-white"
               : isDirty() ? "border-th-700/40 bg-th-50 text-th-900"
               : "border-neutral-200 bg-neutral-100 text-neutral-400")}>
          {/* 保存できた合図。輪がひと粒だけ広がって消える */}
          {justSaved && <span aria-hidden="true" className="absolute inset-0 rounded-xl border-2 border-th-800 ft-ring" />}
          {/* 2つのアイコンを重ねて置き、入れ替わるように見せる */}
          <span className={"absolute inset-0 flex items-center justify-center transition-all duration-200 "
            + (justSaved ? "opacity-0 scale-75 translate-y-1" : "opacity-100 scale-100 translate-y-0")}>
            <SaveArrowIcon size={22} />
          </span>
          <span className={"absolute inset-0 flex items-center justify-center transition-all duration-200 "
            + (justSaved ? "opacity-100 scale-100" : "opacity-0 scale-50")}>
            <SaveCheckIcon size={22} />
          </span>
        </button>
        <button onClick={handleCloseAttempt} aria-label="閉じる" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 shrink-0"><X size={22} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {!initial && (
          <div className="flex flex-wrap gap-3 mb-5">
            {/* ＋から種類を選んで入った場合は、種類の選び直し欄は出さない */}
            {!typeLocked && (
              <div className="w-[104px] shrink-0">
                <span className="block text-[13.5px] font-bold text-neutral-700 mb-1.5 tracking-wide">種類</span>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
              </div>
            )}
            <div className="shrink-0">
              <span className="block text-[13.5px] font-bold text-neutral-700 mb-1.5 tracking-wide">日付</span>
              <DateInput className="w-[148px]" value={record.date} onChange={(e) => set({ date: e.target.value })} />
            </div>
          </div>
        )}

        {/* タグはどの種類にも共通なので、種類ごとの分岐の外に置いている */}
        {initial && (
          <Field label="日付"><DateInput value={record.date} onChange={(e) => set({ date: e.target.value })} /></Field>
        )}
        <Field label="タグ" help="記録の種類とは別に、自由なラベルを何個でも付けられます。ここで付けたタグは「探す」でそのまま絞り込みに使えます。">
          <TagField value={record.tags} onChange={(v) => set({ tags: v })} knownTags={knownTags} onCreateTag={onCreateTag} />
        </Field>

        {type === "reading" && (
          <>
            <Field label="読んだ箇所" help="「書・章・節を選ぶ」から選ぶと、通読の実績にも自動で反映されます。">
              <TextInput value={record.passageText || ""} onChange={(e) => set({ passageText: e.target.value })} />
              <RecognizedRefs text={record.passageText} />
              <RefInserter label="書・章・節を選ぶ"
                onPickRange={({ book, chapters, passageText }) => set({ book, chapters, passageText: appendRef(record.passageText, passageText) })} />
            </Field>
            <PastNotesPanel notes={pastNotes} />
            <Field label="メモ" help="URLをそのまま貼れます。閲覧画面では押せるリンクになり、押すとブラウザで開きます。">
              <TextArea value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={3} />
              <RecognizedRefs text={record.notes} />
              <RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />
              <MemorizeLink text={record.notes} allRecords={allRecords} onQuickMemorize={onQuickMemorize} />
            </Field>
          </>
        )}

        {type === "message" && (
          <>
            <Field label="聖書箇所">
              <TextInput value={record.passageText} onChange={(e) => set({ passageText: e.target.value })} />
              <RecognizedRefs text={record.passageText} />
              <RefInserter onInsert={(ref) => set({ passageText: appendRef(record.passageText, ref) })} />
            </Field>
            <PastNotesPanel notes={pastNotes} />
            <Field label="主題聖句" help="聖書のことばを書いておくと、下に出る「聖句に追加」から、そのまま聖句の記録として残せます。">
              <TextArea value={record.mainVerseText} onChange={(e) => set({ mainVerseText: e.target.value })} minRows={2} />
              <RecognizedRefs text={record.mainVerseText} />
              <RefInserter onInsert={(ref) => set({ mainVerseText: appendRef(record.mainVerseText, ref) })} />
              <MemorizeLink text={record.mainVerseText} allRecords={allRecords} onQuickMemorize={onQuickMemorize} />
            </Field>
            <Field label="メモ" help="URLをそのまま貼れます。閲覧画面では押せるリンクになり、押すとブラウザで開きます。">
              <TextArea value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={7} />
              <RecognizedRefs text={record.notes} />
              <RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />
              <MemorizeLink text={record.notes} allRecords={allRecords} onQuickMemorize={onQuickMemorize} />
            </Field>
          </>
        )}

        {type === "memorization" && (
          <>
            <Field label="聖書のことば" help="末尾に（ヨハネの福音書 3:16）のように箇所を書いておくと、同じ箇所の記録どうしがつながります。">
              {/* 学びの「主題聖句」と同じ高さ（2行ぶん）にそろえている */}
              <TextArea value={record.text} onChange={(e) => set({ text: e.target.value })} minRows={2} />
              <RecognizedRefs text={record.text} />
              <RefInserter onInsert={(ref) => set({ text: appendRef(record.text, ref) })} />
            </Field>
            <Field label="メモ">
              <TextArea value={record.note} onChange={(e) => set({ note: e.target.value })} minRows={2} />
              <RefInserter onInsert={(ref) => set({ note: appendRef(record.note, ref) })} />
            </Field>
            <div className="relative rounded-xl border-2 border-neutral-300 bg-white p-4 mb-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none min-h-[40px] mb-1">
                <input type="checkbox" checked={!!record.monthYear}
                  onChange={(e) => e.target.checked ? wantMonth(curYear(), curMonth()) : (setSteal((p) => ({ ...p, month: null })), set({ monthYear: null, monthMonth: null }))}
                  className="w-5 h-5 accent-th-700" />
                <span className="text-[14.5px] font-bold text-neutral-800 flex items-center gap-1.5"><BookMarked size={15} className="text-th-800" /> 今月の聖句にする</span>
              </label>
              <span className="absolute right-3 top-3"><HelpTip label="今月の聖句" text="選んだ月のあいだ、ホーム画面に表示されます。" /></span>
              {record.monthYear && (
                <div className="flex gap-2 mt-2">
                  <div className="flex-1"><DrumSelect value={record.monthYear} onChange={(v) => wantMonth(v, record.monthMonth)} placeholder="年" title="年を選択" options={yearOptions.map((y) => ({ value: y, label: `${y}年` }))} /></div>
                  <div className="flex-1"><DrumSelect value={record.monthMonth} onChange={(v) => wantMonth(record.monthYear, v)} placeholder="月" title="月を選択" options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))} /></div>
                </div>
              )}
            </div>
            <div className="relative rounded-xl border-2 border-th-700/30 bg-th-50/40 p-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none min-h-[40px] mb-1">
                <input type="checkbox" checked={!!record.themeYear}
                  onChange={(e) => e.target.checked ? wantYear(curYear()) : (setSteal((p) => ({ ...p, year: null })), set({ themeYear: null }))}
                  className="w-5 h-5 accent-th-700" />
                <span className="text-[14.5px] font-bold text-neutral-800 flex items-center gap-1.5"><Sparkles size={15} className="text-th-800" /> 今年の聖句にする</span>
              </label>
              <span className="absolute right-3 top-3"><HelpTip label="今年の聖句" text="1年を通して、ホーム画面のいちばん上に表示されます。" /></span>
              {record.themeYear && (
                <div className="mt-2">
                  <DrumSelect value={record.themeYear} onChange={(v) => wantYear(v)} placeholder="年" title="年を選択" options={yearOptions.map((y) => ({ value: y, label: `${y}年` }))} />
                </div>
              )}
            </div>
          </>
        )}

        {type === "memo" && (
          <>
            <Field label="メモ" help="URLをそのまま貼れます。閲覧画面では押せるリンクになり、押すとブラウザで開きます。">
              <TextArea value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={7} />
              <RecognizedRefs text={record.notes} />
              <RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />
            </Field>
          </>
        )}

        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="opacity-70"><Mascot seed={"form-" + type} size={84} /></div>
          {((captions && captions[type]) || "").trim() && (
            <p className="text-[12.5px] text-neutral-500 mt-1 text-center px-4">{captions[type]}</p>
          )}
        </div>
      </div>

      <div className="shrink-0 flex gap-2.5 px-5 py-4 border-t border-neutral-200 bg-white max-w-2xl mx-auto w-full" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
        {initial && <button onClick={() => setConfirmDelete(true)} className={BTN_DANGER_SOFT + " flex-1 " + BTN_H + " text-[14.5px]"}><Trash2 size={16} /> 削除</button>}
        <TapButton onClick={handleCloseAttempt} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</TapButton>
        <TapButton onClick={saveWithExit} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>保存</TapButton>
      </div>
      </div>

      {takeover && (
        <HighlightTakeoverDialog what={takeover.what} existing={takeover.existing}
          onConfirm={() => { takeover.apply(); setTakeover(null); }}
          onCancel={() => setTakeover(null)} />
      )}
      {confirmDelete && <ConfirmDeleteDialog onConfirm={() => onDelete(record.id)} onCancel={() => setConfirmDelete(false)} />}
      {showExitConfirm && (
        <ExitConfirmDialog
          onSave={() => { setShowExitConfirm(false); save(); }}
          onDiscard={() => { setShowExitConfirm(false); onCancel(); }}
          onStay={() => setShowExitConfirm(false)}
        />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   重複登録の確認ダイアログ
   ============================================================ */
function DuplicateDialog({ existing, onRegister, onViewExisting, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-3">同じ聖句が登録済みです</h3>
        <div className="rounded-xl bg-neutral-50 border-2 border-neutral-200 p-3 mb-4">
          <p className="text-[13.5px] font-bold text-th-800 mb-1">{formatRef(primaryRef(existing.text))}</p>
          <p className="text-[13.5px] text-neutral-700 line-clamp-3">{existing.text}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button onClick={onRegister} className={BTN_PRIMARY + " " + BTN_H + " text-[15.5px]"}>それでも登録する</button>
          <button onClick={onViewExisting} className={BTN_SECONDARY + " " + BTN_H + " text-[15.5px]"}>以前の登録内容を見る</button>
          <button onClick={onCancel} className={BTN_QUIET + " " + BTN_H + " text-[14.5px]"}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   記録の表示ヘルパ
   ============================================================ */
function recordTitle(r) {
  if (r.type === "reading") return `${r.book || "（書が未選択）"} ${formatChapterList(r.chapters)}`;
  if (r.type === "message") return r.passageText || formatRef(primaryRef(r.mainVerseText)) || "学び";
  if (r.type === "memorization") return formatRef(primaryRef(r.text)) || "聖句";
  if (r.type === "memo") return (r.tags || [])[0] || (r.notes || "").split("\n")[0].slice(0, 40) || "その他";
  return "";
}
function recordSnippet(r) {
  if (r.type === "reading") return r.notes || "";
  if (r.type === "message") return r.mainVerseText || r.notes || "";
  if (r.type === "memorization") return r.text || "";
  if (r.type === "memo") return r.notes || "";
  return "";
}
/* 記録の中身を「項目名つきのかたまり」で返す。
   項目名は画面側で小さなラベルとして描くので、ここでは記号を付けない */
function recordSections(r) {
  if (!r) return [];
  if (r.type === "reading") return r.notes ? [{ label: null, text: r.notes }] : [];
  if (r.type === "message") {
    const out = [];
    if (r.mainVerseText) out.push({ label: "主題聖句", text: r.mainVerseText });
    if (r.notes) out.push({ label: "メモ", text: r.notes });
    return out;
  }
  if (r.type === "memorization") {
    const out = [];
    if (r.text) out.push({ label: null, text: r.text });
    if (r.note) out.push({ label: "メモ", text: r.note });
    return out;
  }
  if (r.type === "memo") return r.notes ? [{ label: null, text: r.notes }] : [];
  return [];
}
/* 何行かだけ見せたいときは、CSSではなくここで文字そのものを切ること。
   line-clamp と whitespace-pre-line を一緒に使うと、iPhoneのSafariでは
   見た目だけ切り詰められ、箱の高さは全文ぶん確保されてしまう。
   （たたみ部品の中に、大きな余白ができる原因になっていた） */
function clampText(text, lines, maxChars = 220) {
  const s = String(text == null ? "" : text).replace(/\n{3,}/g, "\n\n").trim();
  if (!s) return "";
  const arr = s.split("\n");
  let out = arr.slice(0, lines).join("\n");
  let cut = arr.length > lines;
  if (out.length > maxChars) { out = out.slice(0, maxChars); cut = true; }
  return cut ? out.replace(/\s+$/, "") + "…" : out;
}

/* 一覧のプレビューや書き出し用。こちらは1本の文字列にする */
function recordFullDisplay(r) {
  return recordSections(r).map((sc) => (sc.label ? sc.label + "\n" : "") + sc.text).join("\n\n");
}
function RecordCard({ r, onClick }) {
  const [pressed, go] = useTapThen(onClick);
  const chips = chipRefs(recordRefs(r));
  return (
    <button onClick={go}
      className={(pressed ? "brightness-90 opacity-80 " : "") + "w-full text-left border border-neutral-200 bg-white rounded-2xl px-4 py-3.5 flex flex-col gap-1.5 relative ft-tap ft-tap-card hover:bg-neutral-50/70"}>
      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type={r.type} />
        {r.date && <span className="text-[12.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>}
        {r.pinned && <Pin size={15} className="text-th-800 shrink-0" fill="currentColor" strokeWidth={1.5} />}
        {r.bookmarked && <Bookmark size={15} className="text-th-800 shrink-0" fill="currentColor" strokeWidth={1.5} />}
      </div>
      <div className="text-[15.5px] text-neutral-900 font-bold">{recordTitle(r)}</div>
      {recordSnippet(r) && <div className="text-[13.5px] text-neutral-600 whitespace-pre-line">{clampText(recordSnippet(r), 3)}</div>}
      {chips.length > 0 && <div className="flex flex-wrap gap-1.5 mt-0.5">{chips.map((c, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{c.book}{c.chapter ? ` ${c.chapter}` : ""}</span>)}</div>}
    </button>
  );
}

/* ============================================================
   ① ホーム画面（今年の聖句・今月の聖句・カレンダー）
   ============================================================ */
function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function startOfWeek(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0, 0, 0, 0); return r; }

function CalendarView({ records, onOpenDay }) {
  const [viewMode, setViewMode] = useState("week"); // week | month
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);

  const byDate = useMemo(() => {
    const map = {};
    records.filter((r) => ["reading", "message"].includes(r.type) && r.date).forEach((r) => { (map[r.date] = map[r.date] || []).push(r); });
    return map;
  }, [records]);

  const shiftMonth = (delta) => { let m = cursor.m + delta, y = cursor.y; if (m < 0) { m = 11; y -= 1; } if (m > 11) { m = 0; y += 1; } setCursor({ y, m }); setSelectedDate(null); };
  const shiftWeek = (delta) => { setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() + delta * 7); return d; }); setSelectedDate(null); };
  /* 押した向きへ、カレンダーが紙送りされるように見せる。
     dir は「どちらへ動かしたか」、seq は「何回動かしたか」。
     seq を key に混ぜているのは、同じ向きに続けて押しても毎回動かすため */
  const [flip, setFlip] = useState({ dir: 0, seq: 0 });
  const shift = (delta) => {
    setFlip((f) => ({ dir: delta, seq: f.seq + 1 }));
    return viewMode === "week" ? shiftWeek(delta) : shiftMonth(delta);
  };
  const flipCls = flip.dir === 0 ? "" : flip.dir > 0 ? "ft-page-l" : "ft-page-r";

  /* 期間ジャンプ（年・月を選んで一気に移動） */
  const [jumpOpen, setJumpOpen] = useState(false);
  const shownY = viewMode === "week" ? weekStart.getFullYear() : cursor.y;
  const shownM = viewMode === "week" ? weekStart.getMonth() + 1 : cursor.m + 1;
  const [jumpY, setJumpY] = useState(shownY);
  const [jumpM, setJumpM] = useState(shownM);
  const openJump = () => { setJumpY(shownY); setJumpM(shownM); setJumpOpen(true); };
  const doJump = () => {
    if (viewMode === "week") setWeekStart(startOfWeek(new Date(jumpY, jumpM - 1, 1)));
    else setCursor({ y: jumpY, m: jumpM - 1 });
    setSelectedDate(null);
    setJumpOpen(false);
  };
  const goToday = () => {
    const now = new Date();
    if (viewMode === "week") setWeekStart(startOfWeek(now));
    else setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setSelectedDate(null);
  };
  const yearsForJump = (() => {
    const years = new Set([new Date().getFullYear(), shownY]);
    records.forEach((r) => { if (r.date) years.add(Number(r.date.slice(0, 4))); });
    const arr = [...years].filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
    const lo = arr[0] - 1, hi = arr[arr.length - 1] + 1;
    return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  })();


  const renderDayCell = (d, ds, key) => {
    const list = byDate[ds]; const has = !!list; const isSelected = selectedDate === ds;
    const types = has ? new Set(list.map((r) => r.type)) : new Set();
    const dow = new Date(ds + "T00:00:00").getDay();
    const plainColor = dow === 0 ? "text-rose-600" : dow === 6 ? "text-sky-700" : "text-neutral-700";
    const hoverBg = dow === 0 ? "hover:bg-rose-50" : dow === 6 ? "hover:bg-sky-50" : "hover:bg-neutral-100";
    return (
      /* 選んだ瞬間だけ弾ませたいので、選択の有無を key に混ぜて描き直させている */
      <button key={key + (isSelected ? "-s" : "")} onClick={() => { setSelectedDate(ds); onOpenDay(ds); }}
        className={"aspect-square min-h-[40px] rounded-lg text-[14.5px] font-bold flex items-center justify-center relative border-2 ft-tap " +
          (isSelected ? "bg-th-800 border-th-800 text-white ft-daypop"
            : has ? "bg-th-50 border-th-300 text-th-900"
              : `border-transparent ${plainColor} ${hoverBg}`)}>
        {d}
        {has && !isSelected && (
          <span className="absolute bottom-1 flex gap-0.5">
            {types.has("reading") && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            {types.has("message") && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
          </span>
        )}
      </button>
    );
  };

  let monthCells = [];
  if (viewMode === "month") {
    const first = new Date(cursor.y, cursor.m, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    for (let i = 0; i < startWeekday; i++) monthCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) monthCells.push(d);
  }

  const weekDays = viewMode === "week" ? Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }) : [];
  const weekEnd = weekDays[6];

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setViewMode("week")} className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (viewMode === "week" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>週間</button>
        <button onClick={() => setViewMode("month")} className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (viewMode === "month" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>月間</button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} aria-label="前へ" className="min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 ft-tap ft-tap-icon shadow-sm"><ChevronLeft size={26} /></button>
        <div className="flex items-center gap-1">
          <button onClick={openJump} className="flex items-center gap-1 px-2 min-h-[44px] rounded-lg hover:bg-neutral-100">
            <span className="font-display text-[17px] text-neutral-900">{shownY}年 {shownM}月</span>
            <ChevronDown size={16} className="text-neutral-500" />
          </button>
          <button onClick={goToday} className="min-h-[36px] px-2.5 rounded-lg text-[12.5px] font-bold text-th-800 hover:bg-th-50">今日</button>
        </div>
        <button onClick={() => shift(1)} aria-label="次へ" className="min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 ft-tap ft-tap-icon shadow-sm"><ChevronRight size={26} /></button>
      </div>

      {jumpOpen && (
        <WheelSheet title="表示する期間" onClose={() => setJumpOpen(false)} onConfirm={doJump}>
          <WheelColumn minWidth={96} value={jumpY} onChange={setJumpY} items={yearsForJump.map((y) => ({ value: y, label: `${y}年` }))} />
          <WheelColumn minWidth={78} value={jumpM} onChange={setJumpM} items={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))} />
        </WheelSheet>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-[12.5px] font-bold mb-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div key={d} className={i === 0 ? "text-rose-600" : i === 6 ? "text-sky-700" : "text-neutral-500"}>{d}</div>
        ))}
      </div>

      {viewMode === "week" ? (
        <div key={"w" + flip.seq} className={"grid grid-cols-7 gap-1 " + flipCls}>{weekDays.map((d) => renderDayCell(d.getDate(), ymd(d), ymd(d)))}</div>
      ) : (
        <div key={"m" + flip.seq} className={"grid grid-cols-7 gap-1 " + flipCls}>
          {monthCells.map((d, i) => d === null ? <div key={i} /> : renderDayCell(d, `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, i))}
        </div>
      )}

    </div>
  );
}

/* 今年・今月の聖句カード。「続きから」など他のカードと同じ形にそろえている */
function VerseCard({ label, text, open, onToggle }) {
  return (
    <button onClick={onToggle}
      className="w-full text-left rounded-2xl border-2 border-th-700/25 bg-white p-4 mb-3 flex items-start gap-3 ft-tap ft-tap-card shadow-sm">
      <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0">
        <BookMarked size={20} className="text-th-800" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11.5px] font-bold tracking-wider text-th-800/70">{label}</span>
        <span className="block text-[14.5px] leading-relaxed text-neutral-900 whitespace-pre-line mt-0.5">{open ? text : clampText(text, 2)}</span>
      </span>
      <ChevronDown size={18} className={"text-neutral-400 shrink-0 mt-3 ft-chev " + (open ? "ft-chev-on" : "")} />
    </button>
  );
}

/* 直近の通読から「次に読む箇所」を割り出す */
/* 通読のつづき。最後に読んだところの次を出す */
function computeNextReading(records) {
  const readings = records.filter((r) => r.type === "reading" && r.book);
  if (readings.length === 0) return { book: BOOKS[0].name, chapter: 1, first: true };
  const sorted = [...readings].sort((a, b) => (b.date || "").localeCompare(a.date || "")
    || (b.createdAt || "").localeCompare(a.createdAt || ""));
  const last = sorted[0];
  const chapters = (last.chapters || []).filter((c) => typeof c === "number");
  const maxCh = chapters.length ? Math.max(...chapters) : 0;
  const b = BOOKS.find((x) => x.name === last.book);
  if (b && maxCh < b.chapters) return { book: last.book, chapter: maxCh + 1 };
  const i = BOOKS.findIndex((x) => x.name === last.book);
  const nextBook = BOOKS[(i + 1) % BOOKS.length];
  return { book: nextBook.name, chapter: 1, newBook: true, finished: last.book };
}

/* 「ここから始めましょう」「続きから」の案内。記録画面のいちばん上に置く */
function ContinueCard({ records, onStart }) {
  const next = useMemo(() => computeNextReading(records), [records]);
  if (!next) return null;
  return (
    <button
      onClick={() => onStart({ book: next.book, chapters: [next.chapter] })}
      className="w-full text-left rounded-2xl border-2 border-th-700/25 bg-white p-4 mb-4 flex items-center gap-3 ft-tap ft-tap-card shadow-sm"
    >
      <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0">
        <BookOpen size={20} className="text-th-800" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11.5px] font-bold tracking-wider text-th-800/70">
          {next.first ? "ここから始めましょう" : next.newBook ? `${next.finished} を読み終えました。次は` : "続きから"}
        </span>
        <span className="block font-display text-[18px] text-neutral-900 truncate">{next.book} {next.chapter}章</span>
      </span>
      <ChevronRight size={20} className="text-neutral-400 shrink-0" />
    </button>
  );
}

function HighlightBanner({ records }) {
  const [openKey, setOpenKey] = useState(null);
  const yearly = useMemo(() => {
    const list = records.filter((r) => r.type === "memorization" && r.themeYear === curYear());
    return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))[0] || null;
  }, [records]);
  const monthly = useMemo(() => {
    const list = records.filter((r) => r.type === "memorization" && r.monthYear === curYear() && r.monthMonth === curMonth());
    return list[0] || null;
  }, [records]);

  if (!yearly && !monthly) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-3 mb-3 flex items-center gap-3">
        <Mascot seed="home-banner" size={56} className="shrink-0" />
        <p className="text-[12.5px] text-neutral-500 flex-1">
          聖句の記録で「今年の聖句にする」「今月の聖句にする」を選ぶと、ここに出ます。
        </p>
      </div>
    );
  }

  return (
    <>
      {yearly && (
        <VerseCard
          label={`${curYear()}年の聖句`}
          text={yearly.text}
          open={openKey === "y"}
          onToggle={() => setOpenKey(openKey === "y" ? null : "y")}
        />
      )}
      {monthly && (
        <VerseCard
          label={`${curMonth()}月の聖句`}
          text={monthly.text}
          open={openKey === "m"}
          onToggle={() => setOpenKey(openKey === "m" ? null : "m")}
        />
      )}
    </>
  );
}

/* しばらく保存していない・記録がたまってきた、どちらかのときに知らせる */
const BACKUP_REMIND_COUNT = 10;
function BackupReminder({ records, prefs, onOpenBackup }) {
  const n = unsavedCount(records, prefs);
  if (!records.length || n === 0) return null;
  const last = prefs && prefs.lastBackup ? new Date(prefs.lastBackup) : null;
  const days = last ? Math.floor((Date.now() - last.getTime()) / 86400000) : null;
  const byDays = !last || days >= BACKUP_REMIND_DAYS;
  const byCount = n >= BACKUP_REMIND_COUNT;
  if (!byDays && !byCount) return null;
  const lastLabel = last ? `${last.getFullYear()}年${last.getMonth() + 1}月${last.getDate()}日` : null;
  return (
    <button onClick={onOpenBackup}
      className="w-full text-left rounded-2xl border-2 border-amber-200 bg-amber-50/70 px-4 py-3 mb-3 flex items-center gap-3 ft-tap ft-tap-card">
      <span className="relative w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
        <Download size={18} />
        <CountBadge n={n} size={20} className="absolute -top-1.5 -right-1.5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-bold text-amber-900">まだ書き出していない記録が{n}件あります</span>
        <span className="block text-[12.5px] text-neutral-600">
          {lastLabel ? `前回の保存： ${lastLabel}` : "まだ一度も保存していません"}
        </span>
      </span>
      <ChevronRight size={18} className="text-amber-700/60 shrink-0" />
    </button>
  );
}

/* 育てる実を選ぶダイアログ */
function FruitPickDialog({ title, note, current, onPick, onCancel }) {
  const [sel, setSel] = useState(current || FRUITS[0].key);
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-1.5">{title}</h3>
        {note && <p className="text-[12.5px] text-neutral-500 leading-relaxed mb-3">{note}</p>}
        {/* 実を選び直すたびに、木がふわっと差し替わる */}
        <div key={sel} className="flex justify-center mb-2 ft-grow">
          <FruitTree stage={10} fruit={sel} size={150} />
        </div>
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          {FRUITS.map((f) => (
            <button key={f.key} onClick={() => setSel(f.key)}
              className={"rounded-xl border-2 py-2 px-1 text-[11.5px] font-bold ft-tap " + (sel === f.key ? "border-th-700 bg-th-50 text-th-900" : "border-neutral-200 bg-white text-neutral-500")}>
              <span className="block w-full flex justify-center mb-0.5">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <circle cx="12" cy="14" r="8" fill={f.ripe} />
                  <path d="M12 6 L12 3" stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          {onCancel && <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>あとで</button>}
          <button onClick={() => onPick(sel)} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>これを植える</button>
        </div>
      </div>
    </div>
  );
}

/* 育てる実を変えるときの注意喚起 */
function ConfirmReplantDialog({ fruit, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">木を植え直します</h3>
        <p className="text-[13.5px] text-neutral-700 leading-relaxed mb-2">
          {fruitByKey(fruit).label}の種を新しく蒔きます。今の木は土からのやり直しになり、
          <span className="font-bold">育ってきた日数と件数は0から数え直し</span>になります。
        </p>
        <p className="text-[12.5px] text-neutral-500 leading-relaxed mb-5">
          これまでの記録と、収穫した実は消えません。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
          <button onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>植え直す</button>
        </div>
      </div>
    </div>
  );
}

/* 収穫したときのダイアログ */
function HarvestDialog({ fruit, onReplant, onLater }) {
  const f = fruitByKey(fruit);
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop text-center">
        <div className="flex justify-center mb-1 ft-grow">
          <FruitTree stage={10} fruit={fruit} size={160} />
        </div>
        <h3 className="font-display text-[18px] text-neutral-900 mb-1.5">{f.label}を収穫しました</h3>
        <p className="text-[13.5px] text-neutral-600 leading-relaxed mb-5">
          ここまで、よく歩まれました。収穫した実は、メニューの「収穫した実」に残ります。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onLater} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>このままにする</button>
          <button onClick={onReplant} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>次の種を植える</button>
        </div>
      </div>
    </div>
  );
}

/* ホーム画面の果樹。イラストとみことばだけを見せる */
/* ホーム画面の木の大きさ。
   **植える前と植えたあとで必ず同じ数にすること。**
   別々にしていたため、植える前だけ小さく見えていた。
   ここはホーム画面のいちばん大事な絵なので、大きめにとってある */
const TREE_SIZE = 220;

function TreeArea({ records, garden, onStart, onHarvest }) {
  const cycle = garden.cycle;
  if (!cycle) {
    return (
      <button onClick={onStart} className="w-full flex flex-col items-center pt-1 pb-4 ft-tap">
        <span className="flex ft-grow"><FruitTree stage={1} fruit="apple" size={TREE_SIZE} /></span>
        <span className="text-[15.5px] font-bold text-th-900 mt-1">種を選んで植える</span>
      </button>
    );
  }
  const { days, count } = cycleCounts(records, cycle.startedAt);
  const st = stageOf(days, count);
  const ripe = st.n === 10;
  const today = todayStr();
  const hasToday = (records || []).some((r) => r && recDate(r) === today);
  /* 実が熟して、まだ収穫していないときだけ、木がゆっくり息をする。
     「押せますよ」を言葉ではなく動きで伝えるため。それ以外の日は静かなまま */
  const canHarvest = ripe && !cycle.harvested;
  const inner = (
    <>
      {/* 立ち上がりと呼吸は別の要素に分けている。
          ひとつの要素に2つ重ねると、あとに書いたほうだけが効いてしまうため */}
      <span className="flex ft-grow">
        <span className={"flex " + (canHarvest ? "ft-breathe" : "")}>
          <FruitTree stage={st.n} fruit={cycle.fruit} size={TREE_SIZE} sparkle={hasToday} />
        </span>
      </span>
      <p className="text-[13.5px] text-neutral-700 leading-relaxed whitespace-pre-line text-center mt-2 px-2">{st.verse}</p>
      <p className="text-[12.5px] text-neutral-500 mt-1.5">{st.ref}</p>
    </>
  );
  if (canHarvest) {
    return (
      <button onClick={onHarvest} className="w-full flex flex-col items-center pt-1 pb-4 ft-tap" aria-label="実を収穫する">
        {inner}
      </button>
    );
  }
  return <div className="w-full flex flex-col items-center pt-1 pb-4">{inner}</div>;
}

/* ＋を押したときに出る、記録の種類を選ぶシート */
const TYPE_GUIDE = [
  { key: "reading",      icon: <BookOpen size={22} />,     desc: "今日読んだ箇所と、感じたこと" },
  { key: "message",      icon: <Play size={22} />,          desc: "礼拝や集会で聞いた話" },
  { key: "memorization", icon: <Star size={22} />,          desc: "心にとめておきたいことば" },
  { key: "memo",         icon: <BookMarked size={22} />,    desc: "テーマごとの覚え書き" },
];

function TypeRow({ t, names, descs, onPick }) {
  const [pressed, go] = useTapThen(() => onPick(t.key));
  return (
    <button type="button" onClick={go}
      className={"w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left ft-tap ft-tap-card "
        + (pressed ? "bg-neutral-200 ft-tap-pressed" : "hover:bg-neutral-50")}>
      <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center text-th-800 shrink-0">{t.icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15.5px] font-bold text-neutral-900">{(names && names[t.key]) || TYPE_LABELS[t.key]}</span>
        <span className="block text-[12.5px] text-neutral-500 mt-0.5">{(descs && descs[t.key]) || t.desc}</span>
      </span>
      <ChevronRight size={18} className="text-neutral-400 shrink-0" />
    </button>
  );
}

function TypePickSheet({ onPick, onCancel, descs, names }) {
  const [closing, close] = useClosing(onCancel, 240);
  return (
    <div className="ft-sheet-wrap flex items-end justify-center" style={{ zIndex: 2147483000 }} onClick={close}>
      <div className={"absolute inset-0 bg-black/40 " + (closing ? "anim-fade-out" : "anim-fade")} />
      <div className={"relative w-full max-w-lg bg-white rounded-t-2xl border-t border-neutral-200 shadow-xl "
          + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <span className="font-display text-[15.5px] text-neutral-900">何を記録しますか</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        <div className="p-2 ft-seq">
          {TYPE_GUIDE.map((t) => (
            <TypeRow key={t.key} t={t} names={names} descs={descs} onPick={onPick} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* 前回、保存しないまま閉じられた記録を知らせるカード */
function DraftDialog({ draft, onResume, onDiscard, names }) {
  if (!draft) return null;
  const label = (names && names[draft.rec.type]) || TYPE_LABELS[draft.rec.type] || "記録";
  const when = draft.savedAt ? new Date(draft.savedAt) : null;
  const whenText = when && !isNaN(when)
    ? `${when.getMonth() + 1}月${when.getDate()}日 ${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`
    : null;
  return (
    <div className="fixed inset-0 z-[75] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
          <Pencil size={20} className="text-amber-600" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-bold tracking-wider text-amber-700">書きかけの{label}があります</p>
          {whenText && <p className="text-[12.5px] text-neutral-500 mt-0.5">{whenText} まで入力</p>}
        </div>
      </div>
      <div className="flex gap-2.5 mt-5">
        <button onClick={onDiscard} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>破棄する</button>
        <button onClick={onResume} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>続きを書く</button>
      </div>
      </div>
    </div>
  );
}

function HomeScreen({ records, prefs, onOpenBackup, garden, onStartCycle, onHarvest }) {
  return (
    /* 下の帯（タブ）に隠れない分だけの余白。＋ボタンが無い画面なので pb-28 まで要らない */
    <div className="pb-20">
      <ScreenHeader title="ホーム" />
      {/* ヘッダは動かさず、中身だけがそっと立ち上がる（ヘッダは sticky なので動かすとぶれる） */}
      <div className="px-5 pt-4 ft-rise">
        <HighlightBanner records={records} />
        <TreeArea records={records} garden={garden} onStart={onStartCycle} onHarvest={onHarvest} />
        <BackupReminder records={records} prefs={prefs} onOpenBackup={onOpenBackup} />
      </div>
    </div>
  );
}

/* ============================================================
   ② 記録画面
   ============================================================ */
function RecordScreen({ records, onOpenDetail, onStartReading }) {
  /* 直近で保存・編集したものから10件。
     作った日ではなく「最後に手を入れた日」で並べること。
     古い記録を書き直したときに、下のほうに埋もれてしまわないようにするため */
  const recent = useMemo(() => [...records]
    .sort((a, b) => ((b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")))
    .slice(0, 10), [records]);
  return (
    <div className="pb-28">
      <ScreenHeader title="記録" />
      <div className="px-5 pt-4 ft-rise">
        {/* 通読のつづきは、記録画面のいちばん上に置く */}
        <ContinueCard records={records} onStart={onStartReading} />
        <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-3">最近の記録</h3>
        <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
          {recent.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-6 text-center flex flex-col items-center">
              <Mascot seed="records-empty" size={140} withNotes />
              <p className="text-[14.5px] font-bold text-neutral-700 mb-1 mt-2">最初の一歩を記録しませんか</p>
              <p className="text-[13.5px] text-neutral-500">右下の＋から、今日読んだ箇所や心に残ったことばを残せます。</p>
            </div>
          )}
          {recent.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
        </div>
        {recent.length > 0 && (
          <div className="flex flex-col items-center pt-6 pb-2 opacity-75">
            <Mascot seed="records-end" size={96} />
            <p className="text-[12.5px] text-neutral-500 mt-1">ここまで読みました</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ③ 検索画面
   ============================================================ */
/* 絞り込みのボタン。記録の種類など、押して切り替えるものは
   すべてこれを使う。見た目と押し心地をばらけさせないため */
function FilterPill({ on, onClick, children }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={"text-[12.5px] font-bold px-3 py-1 rounded-full border-2 ft-tap "
        + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
      {children}
    </button>
  );
}

function SearchScreen({ records, setRecords, openDetail, allKnownTags }) {
  const typeNames = useTypeName();
  const [keyword, setKeyword] = useState("");
  const [filterBook, setFilterBook] = useState("");
  /* 選んだタグ。複数選ぶと「すべて含む」で絞り込む */
  const [filterTags, setFilterTags] = useState([]);
  const [tagDialog, setTagDialog] = useState(false);
  /* 記録の種類。こちらは複数選ぶと「どれかに当てはまる」で絞り込む。
     タグは「すべて含む」、種類は「どれか」。目的が違うので、あえて揃えていない */
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const activeFilterCount = [filterBook, filterFrom, filterTo].filter(Boolean).length
    + filterTags.length + filterTypes.length;

  /* 検索は「検索」ボタンを押したときに実行する。
     押した条件だけを applied に取り込み、結果はそれをもとに作る */
  const [applied, setApplied] = useState({ keyword: "", book: "", tags: [], types: [], from: "", to: "" });
  const [searched, setSearched] = useState(false); // 一度でも検索したか
  const [searching, setSearching] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const searchTimer = useRef(null);
  useEffect(() => () => clearTimeout(searchTimer.current), []);
  const runSearch = () => {
    setSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setApplied({ keyword, book: filterBook, tags: filterTags, types: filterTypes, from: filterFrom, to: filterTo });
      setResultKey((k) => k + 1);
      setSearched(true);
      setFiltersOpen(false); // 結果が見やすいように、絞り込みは閉じる
      setSearching(false);
    }, 380);
  };
  const dirty = applied.keyword !== keyword || applied.book !== filterBook
    || applied.tags.join("\u0000") !== filterTags.join("\u0000")
    || applied.types.join("\u0000") !== filterTypes.join("\u0000")
    || applied.from !== filterFrom || applied.to !== filterTo;
  /* 探す手がかりが何かひとつでもあるか。
     **絞り込みを増やしたら、必ずここにも足すこと。**
     足し忘れると、その絞り込みだけを選んでも検索ボタンが押せないままになる */
  const hasCriteria = !!keyword.trim() || !!filterBook || filterTags.length > 0
    || filterTypes.length > 0 || !!filterFrom || !!filterTo;
  const canSearch = hasCriteria && dirty;

  const baseFiltered = useMemo(() => records.filter((r) => {
    if (applied.keyword.trim()) {
      const hay = (recordAllText(r) + " " + recordTitle(r)).toLowerCase();
      if (!hay.includes(applied.keyword.trim().toLowerCase())) return false;
    }
    /* 種類は「選んだもののどれか」。ひとつも選んでいなければ全部が対象 */
    if (applied.types.length && !applied.types.includes(r.type)) return false;
    /* タグは記録に持たせた文字をそのまま照らし合わせるだけなので、
       新しいタグが増えても、ここを直す必要はない */
    if (applied.tags.length) {
      const has = (r.tags || []).map((t) => t.toLowerCase());
      if (!applied.tags.every((t) => has.includes(t.toLowerCase()))) return false;
    }
    if (applied.from || applied.to) {
      if (!r.date) return false;
      if (applied.from && r.date < applied.from) return false;
      if (applied.to && r.date > applied.to) return false;
    }
    if (applied.book) {
      const refs = recordRefs(r);
      if (!refs.some((ref) => ref.book === applied.book)) return false;
    }
    return true;
  }), [records, applied]);

  const [sortMode, setSortMode] = useState("book");
  const sortedRecords = useMemo(() => {
    const arr = [...baseFiltered];
    if (sortMode === "dateDesc") arr.sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
    else if (sortMode === "dateAsc") arr.sort((a, b) => (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || ""));
    else arr.sort(compareForSearch);
    return arr;
  }, [baseFiltered, sortMode]);

  /* 選べるタグは、外から渡された一覧（登録済み＋実際に使われている分） */
  const knownTags = allKnownTags || [];

  return (
    /* 下の帯（タブ）に隠れない分だけの余白。＋ボタンが無い画面なので pb-28 まで要らない */
    <div className="pb-20">
      <ScreenHeader title="探す" />
      <div className="px-5 pt-4 space-y-3 ft-rise">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && canSearch) runSearch(); }} />
          </div>
          <button type="button" onClick={runSearch} disabled={searching || !canSearch}
            className={BTN_PRIMARY + " " + BTN_H + " px-4 text-[14.5px] shrink-0"}>
            {searching ? <Spinner size={16} /> : <Search size={16} />}検索
          </button>
        </div>

        <button onClick={() => setFiltersOpen((v) => !v)} className="w-full flex items-center justify-between min-h-[44px] rounded-xl border-2 border-neutral-300 px-3.5 bg-white ft-tap ft-tap-card">
          <span className="flex items-center gap-1.5 text-[14.5px] font-bold text-neutral-700">
            <SlidersHorizontal size={16} /> 絞り込み{activeFilterCount > 0 ? `（${activeFilterCount}）` : ""}
          </span>
          <ChevronDown size={18} className={"text-neutral-500 ft-chev " + (filtersOpen ? "ft-chev-on" : "")} />
        </button>

        {filtersOpen && (
          /* iPhoneで開いたとき、はじめの状態がスクロールなしで収まるように、
             余白と行数をきつめに詰めている。ここを広げるときは実機の高さに注意 */
          <div className="space-y-2.5 rounded-xl border-2 border-neutral-200 bg-neutral-50 p-2.5 ft-open">
            <div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold text-neutral-600 mb-1">
                記録の種類
                <HelpTip label="記録の種類" text="いくつでも選べます。ひとつも選ばないときは、すべての種類が対象になります。" />
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_TYPES.map((t) => (
                  <FilterPill key={t} on={filterTypes.includes(t)}
                    onClick={() => setFilterTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}>
                    {typeNames[t] || TYPE_LABELS[t]}
                  </FilterPill>
                ))}
              </div>
            </div>

            <div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold text-neutral-600 mb-1">
                タグ
                <HelpTip label="タグ" text="記録に付けたタグで絞り込めます。複数選ぶと、そのすべてが付いた記録だけが残ります。" />
              </span>
              {/* 一覧は出しっぱなしにしない。タグが増えるほど画面を圧迫するため。
                  形は記録画面の「タグを選ぶ・作る」とそろえている */}
              {/* 並びは記録画面のタグ欄と同じ（選んだ札が上、ボタンが下） */}
              {filterTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {filterTags.map((t) => (
                    <span key={t} className="ft-chip inline-flex items-center gap-0.5 rounded-full bg-th-50 border-2 border-th-200 pl-2.5 pr-0.5 py-0.5">
                      <span className="text-[12.5px] font-bold text-th-900">{t}</span>
                      <button type="button" onClick={() => setFilterTags((prev) => prev.filter((x) => x !== t))} aria-label={`${t} を外す`}
                        className="w-5 h-5 flex items-center justify-center rounded-full text-th-800/60 hover:text-red-700 ft-tap ft-tap-icon"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => setTagDialog(true)}
                className={BTN_SECONDARY + " " + BTN_H + " px-3.5 text-[14.5px]"}>
                <Plus size={15} /> {filterTags.length ? "タグを選び直す" : "タグを選ぶ"}
              </button>
            </div>

            <div>
              <span className="block text-[12.5px] font-bold text-neutral-600 mb-1">書</span>
              <BookSelect compact value={filterBook} onChange={(v) => setFilterBook(v)} />
            </div>

            <div>
              <span className="block text-[12.5px] font-bold text-neutral-600 mb-1">期間</span>
              <div className="flex items-center gap-1">
                <DateInput className="flex-1 min-w-0" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                {/* 日付を選ぶ画面には取り消しが無いので、外す手だてをここに置いておく。
                    入っているときだけ出るので、はじめの高さは増えない */}
                {filterFrom && <button type="button" onClick={() => setFilterFrom("")} aria-label="開始日を外す"
                  className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-700 ft-tap ft-tap-icon"><X size={15} /></button>}
                <span className="text-neutral-400 font-bold shrink-0">〜</span>
                <DateInput className="flex-1 min-w-0" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                {filterTo && <button type="button" onClick={() => setFilterTo("")} aria-label="終了日を外す"
                  className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-700 ft-tap ft-tap-icon"><X size={15} /></button>}
              </div>
            </div>

            {activeFilterCount > 0 && (
              /* 上に線と余白を置いて、期間の日付と間違えて押さないようにしている */
              <div className="pt-3.5 mt-1.5 border-t border-neutral-200">
                <button onClick={() => { setFilterBook(""); setFilterTags([]); setFilterTypes([]); setFilterFrom(""); setFilterTo(""); }}
                  className={BTN_DANGER_SOFT + " w-full " + BTN_H + " text-[14.5px]"}>
                  <X size={15} /> 絞り込みをクリア
                </button>
              </div>
            )}
          </div>
        )}

        {/* 件数と並べ替えは、探したあとにだけ出す。
            探す前は並べ替える対象そのものが無いので、置いておくと迷いのもとになる */}
        {searched && !searching && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase">
              {sortedRecords.length}件
            </h3>
            <div className="w-[150px] shrink-0">
              <Select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                <option value="book">目次順</option>
                <option value="dateDesc">新しい順</option>
                <option value="dateAsc">古い順</option>
              </Select>
            </div>
          </div>
        )}
        {tagDialog && (
          <TagPickDialog title="タグで絞り込む" selected={filterTags} known={knownTags}
            note="複数選ぶと、そのすべてが付いた記録だけが残ります。"
            onApply={(v) => { setFilterTags(v); setTagDialog(false); }}
            onCancel={() => setTagDialog(false)} />
        )}

        {searching && <LoadingOverlay label="探しています" />}
        {searching || !searched ? null : (
        <div key={resultKey} className="ft-seq space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:items-start">
          {sortedRecords.length === 0 && (
            <div className="flex flex-col items-center py-6 lg:col-span-2 no-anim">
              <Mascot seed="search-empty" size={118} />
              <p className="text-[14.5px] text-neutral-500 mt-1">該当する記録がありません</p>
            </div>
          )}
          {sortedRecords.map((r) => (
            <RecordCard key={r.id} r={r} onClick={() => openDetail(r)} />
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ④ 実績
   ============================================================ */
/* 「何章読んだか」を書ごとに数える。実績画面と書ごとの画面で共通に使う */
function chapterCountsByBook(records) {
  const map = {};
  records.filter((r) => r.type === "reading" && r.book).forEach((r) => {
    if (!map[r.book]) map[r.book] = {};
    (r.chapters || []).forEach((c) => { map[r.book][c] = (map[r.book][c] || 0) + 1; });
  });
  return map;
}

const tileColor = (n) => (n === 0 ? "bg-neutral-200" : n === 1 ? "bg-th-600" : n === 2 ? "bg-th-800" : "bg-amber-500");

/* 読んだ回数を色で表すタイル。書ごとの画面の上部に出す */
function ChapterTiles({ book, counts }) {
  const info = bookByName(book);
  if (!info) return null;
  const readCount = Object.keys(counts || {}).length;
  const done = readCount === info.chapters && info.chapters > 0;
  return (
    <div className={"rounded-2xl border-2 p-4 mb-4 " + (done ? "border-amber-300 bg-amber-50" : "border-neutral-200 bg-white")}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[13.5px] font-bold text-neutral-700 flex items-center gap-1.5">
          {done && <Award size={15} className="text-amber-600" />}通読の達成度
        </span>
        <span className={"ml-auto text-[12.5px] font-bold px-2 py-0.5 rounded-full " + (readCount > 0 ? "bg-th-100 text-th-900" : "bg-neutral-100 text-neutral-500")}>
          {readCount}/{info.chapters}章
        </span>
      </div>
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: info.chapters }, (_, idx) => idx + 1).map((c) => (
          <div key={c} title={`${c}章：${(counts || {})[c] || 0}回`} style={{ width: 14, height: 14 }}
            className={"rounded-[2px] " + tileColor((counts || {})[c] || 0)} />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[11.5px] font-bold text-neutral-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neutral-200 inline-block" /> 未読</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-th-600 inline-block" /> 1回</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-th-800 inline-block" /> 2回</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> 3回以上</span>
      </div>
    </div>
  );
}

/* 細い進捗バー */
function MiniBar({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <span className="block h-1.5 rounded-full bg-neutral-200 overflow-hidden">
      <span className="block h-full rounded-full bg-th-700" style={{ width: `${pct}%` }} />
    </span>
  );
}

function ProgressScreen({ records, onOpenDetail, onOpenBook, onOpenDay }) {
  const countByBook = useMemo(() => chapterCountsByBook(records), [records]);

  const totalChapters = BOOKS.reduce((s, b) => s + b.chapters, 0);
  const uniqueRead = BOOKS.reduce((s, b) => s + Object.keys(countByBook[b.name] || {}).length, 0);
  const pct = totalChapters ? Math.round((uniqueRead / totalChapters) * 100) : 0;

  /* 最後に読んだ書が入っているまとまりだけ、はじめから開いておく */
  const initialOpen = useMemo(() => {
    const last = [...records]
      .filter((r) => r.type === "reading" && r.book)
      .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))[0];
    if (!last) return [];
    const i = bookIndexOf(last.book);
    const g = BOOK_GROUPS.find((x) => i >= x.from && i <= x.to);
    return g ? [g.label] : [];
  }, [records]);

  const [openGroups, setOpenGroups] = useState(initialOpen);
  const toggleGroup = (label) =>
    setOpenGroups((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  return (
    <div className="pb-28">
      <ScreenHeader title="実績" />
      <div className="px-5 pt-4 ft-rise">
        <div className="rounded-2xl bg-gradient-to-br from-th-700 to-th-900 text-white p-5 mb-3 flex items-center gap-4">
          <Award size={30} className="shrink-0 opacity-90" />
          <div className="flex-1">
            <div className="text-[12.5px] font-bold opacity-80 tracking-wide">通読の達成度（初回既読）</div>
            <div className="text-[24px] font-display leading-tight">{uniqueRead} / {totalChapters} 章</div>
          </div>
          <div className="text-[28px] font-display">{pct}%</div>
        </div>

        <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-3 mt-6">日ごとの記録</h3>
        <CalendarView records={records} onOpenDay={onOpenDay} />

        <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-3 mt-8">書ごとの記録</h3>
        <div className="space-y-2.5">
          {BOOK_GROUPS.map((g) => {
            const books = BOOKS.slice(g.from, g.to + 1);
            const gTotal = books.reduce((s, b) => s + b.chapters, 0);
            const gRead = books.reduce((s, b) => s + Object.keys(countByBook[b.name] || {}).length, 0);
            const gDone = books.filter((b) => Object.keys(countByBook[b.name] || {}).length === b.chapters).length;
            const open = openGroups.includes(g.label);
            return (
              <div key={g.label} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <button type="button" onClick={() => toggleGroup(g.label)}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[56px] text-left ft-tap ft-tap-card active:bg-neutral-50">
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14.5px] font-bold text-neutral-900">{g.label}</span>
                    <span className="block text-[11.5px] text-neutral-500 mt-0.5">
                      {books.length}巻 ・ {gRead}/{gTotal}章{gDone > 0 ? ` ・ ${gDone}巻読了` : ""}
                    </span>
                    <span className="block mt-1.5"><MiniBar value={gRead} total={gTotal} /></span>
                  </span>
                  <ChevronDown size={18} className={"text-neutral-400 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
                </button>
                {open && (
                  <div className="border-t-2 border-neutral-100 ft-open-y">
                    {books.map((b) => {
                      const counts = countByBook[b.name] || {};
                      const readCount = Object.keys(counts).length;
                      const recCount = records.filter((r) => recordRefs(r).some((ref) => ref.book === b.name)).length;
                      const done = readCount === b.chapters && b.chapters > 0;
                      return (
                        <button key={b.name} type="button" onClick={() => onOpenBook(b.name)}
                          className={"w-full flex items-center gap-3 px-4 py-2.5 min-h-[52px] text-left border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 ft-tap ft-tap-card " + (done ? "bg-amber-50/60" : "")}>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-1.5">
                              {done && <Award size={13} className="text-amber-600 shrink-0" />}
                              <span className="text-[13.5px] font-bold text-neutral-900 truncate">{b.name}</span>
                            </span>
                            <span className="block mt-1.5"><MiniBar value={readCount} total={b.chapters} /></span>
                          </span>
                          <span className="flex flex-col items-end shrink-0 gap-0.5">
                            <span className={"text-[11.5px] font-bold px-2 py-0.5 rounded-full " + (readCount > 0 ? "bg-th-100 text-th-900" : "bg-neutral-100 text-neutral-500")}>
                              {readCount}/{b.chapters}章
                            </span>
                            <span className="text-[11.5px] font-bold text-neutral-500">記録{recCount}件</span>
                          </span>
                          <ChevronRight size={15} className="text-neutral-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center pt-8 pb-2 opacity-70">
          <Mascot seed="progress-foot" size={100} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   書をタップしたとき：その書が含まれる記録の一覧
   ============================================================ */
/* ある1日の記録の一覧。実績の「日ごとの記録」で日付を押すと開く */
function DayRecordsScreen({ date, records, onClose, onOpenDetail }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const list = useMemo(() => {
    const all = records.filter((r) => r.date === date);
    const pinned = all.filter((r) => r.pinned);
    const rest = all.filter((r) => !r.pinned);
    return [...pinned, ...rest];
  }, [records, date]);

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">{date}</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {list.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Mascot seed="calendar-empty" size={124} />
            <p className="text-[14.5px] text-neutral-500 mt-1">この日はまだ記録がありません</p>
          </div>
        ) : (
          <>
            <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-3">{list.length}件の記録</h3>
            <div className="space-y-2.5 ft-seq lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
              {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
            </div>
          </>
        )}
      </div>
    </div>
    </OverlayScreen>
  );
}

function BookRecordsScreen({ book, records, onClose, onOpenDetail }) {
  const [sortMode, setSortMode] = useState("book");
  const sortFn = (a, b) => {
    if (sortMode === "dateDesc") return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
    if (sortMode === "dateAsc") return (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || "");
    return compareForSearch(a, b);
  };
  /* ピン留めした記録を先に、そのあと並べ替えの順で */
  const list = useMemo(() => {
    const all = records.filter((r) => recordRefs(r).some((ref) => ref.book === book));
    const pinned = all.filter((r) => r.pinned).sort(sortFn);
    const rest = all.filter((r) => !r.pinned).sort(sortFn);
    return [...pinned, ...rest];
  }, [records, book, sortMode]);
  const counts = useMemo(() => chapterCountsByBook(records)[book] || {}, [records, book]);
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);

  return (
    <OverlayScreen from="right" closing={closing}>
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-5 pb-4 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 flex-1 min-w-0 truncate tracking-wide">{book}</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <ChapterTiles book={book} counts={counts} />
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase">{list.length}件の記録</p>
          <div className="ml-auto w-[150px]">
            <Select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
              <option value="book">目次順</option>
              <option value="dateDesc">新しい順</option>
              <option value="dateAsc">古い順</option>
            </Select>
          </div>
        </div>
        <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
          {list.length === 0 && (
            <div className="flex flex-col items-center py-6 lg:col-span-2">
              <Mascot seed="book-empty" size={118} />
              <p className="text-[14.5px] text-neutral-500 mt-1">この書を含む記録はまだありません</p>
            </div>
          )}
          {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
        </div>
              </div>
      </div>
    </OverlayScreen>
  );
}

/* ============================================================
   記録の詳細画面（検索結果タップ時に表示。右上の「編集」で編集画面へ）
   ============================================================ */
/* いま開いている記録と、同じ聖書箇所を含む他の記録を集める */
function relatedRecords(records, target) {
  const refs = recordRefs(target).filter((x) => x.book);
  if (!refs.length) return [];
  const hit = (r) => recordRefs(r).some((x) =>
    refs.some((t) => x.book === t.book && (t.chapter == null || x.chapter == null || x.chapter === t.chapter)));
  return records
    .filter((r) => r.id !== target.id && hit(r))
    .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))
    .slice(0, 20);
}
/* from ＝ どちらから出てくるか。ふつうは右から。
   ちょっと見る小窓から「この記録を開く」で来たときだけ、下からせり上がる。
   小窓が下から出ているので、そのまま続けて上がってくるほうが自然なため */
function RecordDetailScreen({ record, allRecords, onClose, onEdit, onOpenDetail, onToggleMark, from = "right" }) {
  /* 関連する記録を押したときも、右から新しい画面が来るように見せる */
  const [swapping, setSwapping] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [peek, setPeek] = useState(null);
  const swapTimer = useRef(null);
  useEffect(() => () => clearTimeout(swapTimer.current), []);
  const goRelated = (r) => {
    if (swapping) return;
    setSwapping(true);
    swapTimer.current = setTimeout(() => { onOpenDetail(r); setSwapping(false); }, 60);
  };
  const chips = chipRefs(recordRefs(record));
  const related = useMemo(() => relatedRecords(allRecords || [], record), [allRecords, record]);
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);

  return (
    <OverlayScreen from={from} closing={closing || swapping}>
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-5 pb-4 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[17px] text-neutral-900 flex-1 min-w-0 truncate">{recordTitle(record)}</h2>
        <MenuButton />
      </div>

      <button onClick={onEdit} aria-label="この記録を編集"
        className="absolute bottom-8 right-5 z-20 w-16 h-16 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab">
        <Pencil size={26} />
      </button>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {/* 上から「見出し」「本文」「関連」の3つのかたまり。
            かたまりの間だけを広くとり、中は詰める。
            余白を項目ごとにばらばらに付けると、詰まって見える所と空きすぎる所が混ざる */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <TypeBadge type={record.type} />
          {record.date && <span className="text-[12.5px] font-bold text-neutral-500">{record.date}</span>}
          <span className="ml-auto flex items-center gap-1">
            <MarkButton on={!!record.pinned} onClick={() => onToggleMark(record.id, "pinned")}
              label="ピン留め" icon={<Pin size={18} />} />
            <MarkButton on={!!record.bookmarked} onClick={() => onToggleMark(record.id, "bookmarked")}
              label="ブックマーク" icon={<Bookmark size={18} />} />
          </span>
        </div>
        <TagChips tags={record.tags} className="mb-5" />

        <div className="space-y-5">
          {recordSections(record).map((sc, i) => (
            <div key={i}>
              {sc.label && (
                <span className="block text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-1.5">{sc.label}</span>
              )}
              <HighlightedText text={sc.text} className="text-[15.5px] text-neutral-900 leading-relaxed whitespace-pre-line" />
            </div>
          ))}
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-neutral-200">
            {chips.map((c, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{c.book}{c.chapter ? ` ${c.chapter}` : ""}</span>)}
          </div>
        )}

        {/* 今月・今年の聖句として登録されていれば、それが分かるようにする。
            入力画面を開かないと分からないのは不親切なため */}
        {record.type === "memorization" && (record.monthYear || record.themeYear) && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {record.monthYear && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-full bg-th-50 text-th-900 border-2 border-th-200">
                <BookMarked size={14} /> {record.monthYear}年{record.monthMonth}月の聖句
              </span>
            )}
            {record.themeYear && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-full bg-th-800 text-white border-2 border-th-800">
                <Sparkles size={14} /> {record.themeYear}年の聖句
              </span>
            )}
          </div>
        )}

        {/* 入力画面の「この箇所には過去のメモがあります」と同じ、たたんだ見せ方に揃えている。
            開くまでは1行で済むので、本文の下がすっきりする */}
        {related.length > 0 && (<div className="mt-5">
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50/60 overflow-hidden">
            <button type="button" onClick={() => setRelatedOpen((v) => !v)} aria-expanded={relatedOpen}
              className="w-full flex items-center gap-2 px-3.5 py-3 text-left min-h-[48px] ft-tap ft-tap-card">
              <Sparkles size={16} className="text-amber-700 shrink-0" />
              <span className="flex-1 text-[13.5px] font-bold text-amber-900">この箇所を含む記録があります（{related.length}件）</span>
              <ChevronDown size={17} className={"text-amber-700 shrink-0 ft-chev " + (relatedOpen ? "ft-chev-on" : "")} />
            </button>
            {relatedOpen && (
              <div className="px-3 pb-3 space-y-2 ft-open-y">
                {related.map((r) => (
                  <button key={r.id} type="button" onClick={() => setPeek(r)}
                    className="w-full text-left rounded-lg bg-white border border-amber-200 px-3 py-2.5 ft-tap ft-tap-card">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={r.type} />
                      <span className="text-[11.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>
                    </div>
                    <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(recordFullDisplay(r), 4)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>)}

        {peek && (
          <RecordPeekDialog record={peek}
            onOpen={(r) => { setPeek(null); onOpenDetail(r, "bottom"); }}
            onClose={() => setPeek(null)} />
        )}
      </div>
      </div>
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
/* クリップボードへのコピー。新しい方式がだめなら古い方式も試す */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* 次の方法へ */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) { return false; }
}

/* ファイルとして保存できなかったときに出す確認ダイアログ */
function SaveFallbackDialog({ onCopy, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">ファイルとして保存できませんでした</h3>
        <p className="text-[13.5px] text-neutral-600 mb-2 leading-relaxed">
          この画面ではファイル保存が使えません。データをコピーして、メモアプリなどに貼り付けて保管してください。
        </p>
        <p className="text-[12.5px] text-neutral-500 mb-5 leading-relaxed">
          ホーム画面に追加したアプリから開くと、ファイルとして保存できます。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
          <button onClick={onCopy} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>コピーする</button>
        </div>
      </div>
    </div>
  );
}

function buildBackupText(records) {
  const lines = [];
  /* アプリ名の見出しは入れない。ファイル名で分かるようにしてあるので、
     読むときに邪魔になるだけ（依頼により削除） */
  lines.push(`書き出し日時: ${new Date().toLocaleString("ja-JP")}`);
  lines.push(`件数: ${records.length}件`);
  lines.push("");
  const sorted = [...records].sort((a, b) => (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || ""));
  sorted.forEach((r) => {
    lines.push("----------------------------------------");
    lines.push(`[${TYPE_LABELS[r.type] || r.type}]` + (r.date ? ` ${r.date}` : ""));
    lines.push(recordTitle(r));
    const body = recordFullDisplay(r);
    if (body) lines.push(body);
    if ((r.tags || []).length) lines.push("タグ: " + r.tags.join(" / "));
    lines.push("");
  });
  return lines.join("\n");
}
/* ============================================================
   イラスト管理画面
   ============================================================ */
function ArtworkScreen({ artworks, onChange, captions, onSaveCaptions, prefs, onSavePrefs, onClose, typeDesc, onSaveTypeDesc }) {
  const [closing, close] = useClosing(onClose);
  const [descDraft, setDescDraft] = useState((typeDesc && typeDesc.desc) || DEFAULT_TYPE_DESC);
  const [nameDraft, setNameDraft] = useState((typeDesc && typeDesc.name) || DEFAULT_TYPE_NAME);
  const [openType, setOpenType] = useState(null);
  const [draft, setDraft] = useState(artworks);
  const [capDraft, setCapDraft] = useState(captions);
  const [prefDraft, setPrefDraft] = useState(prefs);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [targetGroup, setTargetGroup] = useState(MASCOT_GROUPS[0].key);
  const inputRef = useRef(null);

  const dirty =
    JSON.stringify(draft.map((a) => [a.id, a.group])) !== JSON.stringify(artworks.map((a) => [a.id, a.group])) ||
    JSON.stringify(capDraft) !== JSON.stringify(captions) ||
    JSON.stringify(prefDraft) !== JSON.stringify(prefs);
  const guardCloseRef = useRef(() => true);
  const { stripRef, screenRef } = useEdgeSwipeBack(onClose, () => guardCloseRef.current());

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = ART_MAX - draft.length;
    if (room <= 0) { setMsg({ kind: "warn", text: `登録できるのは${ART_MAX}枚までです。` }); return; }
    setBusy(true);
    const added = [];
    for (const f of files.slice(0, room)) {
      try { added.push({ id: uid(), src: await shrinkImage(f), group: targetGroup }); }
      catch (err) { /* 読み込めない画像は飛ばす */ }
    }
    setBusy(false);
    if (!added.length) { setMsg({ kind: "err", text: "画像を読み込めませんでした。" }); return; }
    setDraft([...draft, ...added]);
    setOpenGroup(targetGroup);
    const gl = mascotGroupLabel(targetGroup, nameDraft);
    setMsg({ kind: "warn", text: `「${gl}」に${added.length}枚を追加しました。下の「保存」を押すと反映されます。` });
  };

  const save = async () => {
    setSaving(true);
    const a = await onChange(draft);
    const c = await onSaveCaptions(capDraft);
    if (onSaveTypeDesc) await onSaveTypeDesc({ desc: descDraft, name: nameDraft });
    const pr = await onSavePrefs(prefDraft);
    setSaving(false);
    const ok = (!a || a.ok) && (!c || c.ok) && (!pr || pr.ok);
    if (ok) { onClose(); return; }
    setMsg({ kind: "err", text: "保存できませんでした：" + (((a && a.message) || (c && c.message) || (pr && pr.message)) || "原因不明") });
  };

  /* 未保存のまま閉じようとしたら確認する（記録画面と同じ動き） */
  const guardClose = () => {
    if (dirty) { setShowExitConfirm(true); return false; }
    return true;
  };
  const handleCloseAttempt = () => { if (guardClose()) onClose(); };
  guardCloseRef.current = guardClose;

  const msgStyle = msg
    ? msg.kind === "ok" ? "bg-th-50 border-th-200 text-th-900"
      : msg.kind === "warn" ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-rose-50 border-rose-200 text-rose-900"
    : "";


  return (
    <OverlayScreen from="right" closing={closing}>
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
        <div className="flex items-center gap-2 px-4 pb-4 border-b border-neutral-200 shrink-0 bg-white" style={SAFE_TOP(16)}>
          <button onClick={handleCloseAttempt} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</button>
          <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">画面のカスタマイズ</h2>
          <MenuButton />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {msg && <div className={"rounded-xl border-2 px-3.5 py-3 mb-4 text-[13.5px] font-bold " + msgStyle}>{msg.text}</div>}

          <h3 className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-2">テーマカラー</h3>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {THEMES.map((t) => {
              const on = prefDraft.theme === t.key;
              return (
                <button key={t.key} onClick={() => setPrefDraft({ ...prefDraft, theme: t.key })}
                  className={"rounded-xl border-2 p-2.5 flex flex-col items-center gap-1.5 ft-tap " + (on ? "border-neutral-800 bg-white" : "border-neutral-200 bg-white")}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: t.swatch }}>
                    {on && <Check size={16} className="text-white ft-check-in" strokeWidth={3} />}
                  </span>
                  <span className={"text-[12.5px] " + (on ? "font-bold text-neutral-900" : "text-neutral-600")}>{t.label}</span>
                </button>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
            文字の大きさ
            <HelpTip label="文字の大きさ" text="画面の文字をまとめて大きくできます。入力欄の文字は、書きやすさのため大きさを変えていません。" />
          </h3>
          <div className="flex gap-1.5 mb-6">
            {FONT_SIZES.map((f) => {
              const on = (prefDraft.fontSize || "s") === f.key;
              return (
                <button key={f.key} type="button" onClick={() => setPrefDraft({ ...prefDraft, fontSize: f.key })}
                  aria-pressed={on}
                  className={"flex-1 " + BTN_H + " rounded-xl border-2 font-bold ft-tap "
                    + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
                  {/* 見本になるよう、それぞれの大きさで書いてある */}
                  <span style={{ fontSize: f.key === "s" ? 14.5 : f.key === "m" ? 16.5 : 19 }}>{f.label}</span>
                </button>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
            動きの演出
            <HelpTip label="動きの演出" text="切ると、画面の切り替わりや、押したときに沈む動きが止まります。読み込み中の表示だけは残ります。" />
          </h3>
          <label className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 mb-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={prefDraft.motion !== false}
              onChange={(e) => setPrefDraft({ ...prefDraft, motion: e.target.checked })}
              className="w-5 h-5 accent-th-800" />
            <span className="text-[14.5px] font-bold text-neutral-800 flex-1">押したときの動きをつける</span>
          </label>
          <div className="mb-6" />

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
            記録の種類
            <HelpTip label="記録の種類" text="種類の名前と、＋を押したときに出る案内を、自分の言葉に変えられます。" />
          </h3>
          <div className="space-y-2.5 mb-6">
            {Object.keys(TYPE_LABELS).map((k) => {
              const open = openType === k;
              return (
                <div key={k} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                  <button type="button" onClick={() => setOpenType(open ? null : k)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 min-h-[52px] text-left ft-tap ft-tap-card active:bg-neutral-50">
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14.5px] font-bold text-neutral-900">{(nameDraft && nameDraft[k]) || TYPE_LABELS[k]}</span>
                      <span className="block text-[12.5px] text-neutral-500 truncate">{(descDraft && descDraft[k]) || ""}</span>
                    </span>
                    <ChevronDown size={18} className={"text-neutral-400 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
                  </button>
                  {open && (
                    <div className="px-3.5 pb-3.5 border-t-2 border-neutral-100 pt-3 space-y-2.5 ft-open-y">
                      <div>
                        <p className="text-[11.5px] font-bold text-neutral-500 mb-1">名前</p>
                        <TextInput value={(nameDraft && nameDraft[k]) || ""} onChange={(e) => setNameDraft({ ...nameDraft, [k]: e.target.value })} />
                      </div>
                      <div>
                        <p className="text-[11.5px] font-bold text-neutral-500 mb-1">説明</p>
                        {/* 高さは上の「名前」の入力欄とそろえる。書き足すと自然に伸びる */}
                        <TextArea value={(descDraft && descDraft[k]) || ""} onChange={(e) => setDescDraft({ ...descDraft, [k]: e.target.value })} className="ft-h-field" />
                      </div>
                      <button type="button"
                        onClick={() => { setNameDraft({ ...nameDraft, [k]: DEFAULT_TYPE_NAME[k] }); setDescDraft({ ...descDraft, [k]: DEFAULT_TYPE_DESC[k] }); }}
                        className="text-[12.5px] font-bold text-th-800 underline min-h-[32px]">初期表示に戻す</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
            イラスト
            <HelpTip label="イラスト" text={`画面ごとに、好きな絵と「ひとこと」を設定できます。まとまりを開いて絵を追加すると、その中の場所に順番に使われます。登録できるのは全部で${ART_MAX}枚までです。`} />
          </h3>
          <label className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={prefDraft.showMascots !== false}
              onChange={(e) => setPrefDraft({ ...prefDraft, showMascots: e.target.checked })}
              className="w-5 h-5 accent-th-800" />
            <span className="text-[14.5px] font-bold text-neutral-800 flex-1">イラストを表示する</span>
          </label>


          <div className={"space-y-2.5 mb-6 " + (prefDraft.showMascots === false ? "hidden" : "")}>
            {MASCOT_GROUPS.map((g) => {
              const mine = draft.filter((a) => a.group === g.key);
              const spots = MASCOT_SPOTS.filter((sp) => sp.group === g.key);
              const open = openGroup === g.key;
              return (
                <div key={g.key} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenGroup(open ? null : g.key)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 ft-tap ft-tap-card">
                    <div className="w-14 h-14 shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden">
                      {mine.length > 0
                        ? <img src={mine[0].src} alt="" className="max-w-full max-h-full object-contain" />
                        : <DefaultMascot variant={MASCOT_GROUPS.findIndex((x) => x.key === g.key)} size={52} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] font-bold text-neutral-900">{mascotGroupLabel(g.key, nameDraft)}</p>
                      <p className="text-[12.5px] text-neutral-500 truncate">
                        {mine.length > 0 ? `自分の絵 ${mine.length}枚` : "はじめからの絵"}
                        <span className="text-neutral-500">・{spots.length}か所</span>
                      </p>
                      {g.key !== "empty" && (capDraft[g.key] || "").trim() && (
                        <p className="text-[12.5px] text-neutral-500 truncate">“{capDraft[g.key]}”</p>
                      )}
                    </div>
                    <span className="w-12 h-12 shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <ChevronDown size={26} className={"ft-chev " + (open ? "ft-chev-on" : "")} />
                    </span>
                  </button>

                  {open && (
                    <div className="border-t-2 border-neutral-100 px-3 py-3 space-y-3 ft-open-y">
                      <button
                        onClick={() => { setTargetGroup(g.key); inputRef.current && inputRef.current.click(); }}
                        disabled={busy || draft.length >= ART_MAX}
                        className={BTN_SECONDARY + " w-full " + BTN_H + " text-[14.5px]"}>
                        <Plus size={16} /> ここに絵を追加
                      </button>
                      <div>
                        <p className="text-[11.5px] text-neutral-400 mb-1">出てくる場所</p>
                        <div className="flex flex-wrap gap-1">
                          {spots.map((sp) => (
                            <span key={sp.seed} className="text-[11.5px] px-2 py-0.5 rounded-full bg-neutral-50 text-neutral-400 border border-neutral-200">{mascotSpotLabel(sp, nameDraft)}</span>
                          ))}
                        </div>
                      </div>
                      {mine.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {mine.map((a) => (
                            <div key={a.id} className="relative w-20 h-20 rounded-lg border-2 border-neutral-200 bg-neutral-50 flex items-center justify-center">
                              <img src={a.src} alt="" className="max-w-full max-h-full object-contain p-1" />
                              <button onClick={() => setPendingId(a.id)} aria-label="削除"
                                className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-rose-700 hover:bg-rose-50">
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {g.key !== "empty" && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[11.5px] font-bold text-neutral-500 flex items-center gap-2">ひとこと
                              <button type="button" onClick={() => setCapDraft({ ...capDraft, [g.key]: DEFAULT_CAPTIONS[g.key] || "" })}
                                className="text-[11.5px] font-bold text-th-800 underline">初期表示に戻す</button>
                            </p>
                          </div>
                          <TextArea value={capDraft[g.key] || ""} onChange={(e) => setCapDraft({ ...capDraft, [g.key]: e.target.value })} className="ft-h-field" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={addFiles} className="hidden" />

        </div>

        <div className="shrink-0 flex gap-2.5 border-t border-neutral-200 bg-white px-5 py-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
          <TapButton onClick={handleCloseAttempt} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</TapButton>
          <button onClick={save} disabled={saving} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
      {showExitConfirm && (
        <ExitConfirmDialog
          onSave={() => { setShowExitConfirm(false); save(); }}
          onDiscard={() => { setShowExitConfirm(false); onClose(); }}
          onStay={() => setShowExitConfirm(false)}
        />
      )}
      {pendingId && (
        <ConfirmItemDeleteDialog label="イラスト"
          onConfirm={() => { setDraft(draft.filter((a) => a.id !== pendingId)); setPendingId(null); setMsg({ kind: "warn", text: "下の「保存」を押すと反映されます。" }); }}
          onCancel={() => setPendingId(null)} />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
/* ブックマークした記録の一覧。三本線メニューから開く */
function BookmarkScreen({ records, onClose, onOpenDetail }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const [sortMode, setSortMode] = useState("book");
  const list = useMemo(() => {
    const marked = (records || []).filter((r) => r.bookmarked);
    return marked.sort((a, b) => {
      if (sortMode === "dateDesc") return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
      if (sortMode === "dateAsc") return (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || "");
      return compareForSearch(a, b);
    });
  }, [records, sortMode]);

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">ブックマーク</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[12.5px] font-bold tracking-wider text-neutral-500 uppercase">{list.length}件</p>
          <div className="ml-auto w-[150px]">
            <Select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
              <option value="book">目次順</option>
              <option value="dateDesc">新しい順</option>
              <option value="dateAsc">古い順</option>
            </Select>
          </div>
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-6 flex flex-col items-center">
            <Mascot seed="records-empty" size={118} />
            <p className="text-[13.5px] text-neutral-500 mt-2 text-center">記録を見る画面の右上にある<br />しおりの印を押すと、ここに集まります。</p>
          </div>
        ) : (
          <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
            {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
          </div>
        )}
      </div>
    </div>
    </OverlayScreen>
  );
}

/* 収穫した実の記録。三本線メニューから開く */
/* ============================================================
   タグの整理
   増えすぎたタグや、書き間違えたタグを直す場所。
   名前を変えたり消したりすると、記録に付いているタグにも同じことをする。
   一覧だけ直して記録を放っておくと、名前が食い違ってしまうため
   ============================================================ */
function TagManageScreen({ tags, records, onAdd, onRename, onDelete, onClose }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const [draft, setDraft] = useState("");
  const [renaming, setRenaming] = useState(null);   // { from, to }
  const [deleting, setDeleting] = useState(null);

  const list = normalizeTags(tags);
  const countOf = (t) => (records || []).filter((r) => (r.tags || []).some((x) => x === t)).length;
  const canAdd = !!draft.trim() && !list.some((t) => t.toLowerCase() === draft.trim().toLowerCase());
  const renameOk = renaming && !!renaming.to.trim() && renaming.to.trim() !== renaming.from
    && !list.some((t) => t.toLowerCase() === renaming.to.trim().toLowerCase());

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">タグの整理</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 mb-5">
          <div className="flex-1 min-w-0">
            <TextInput value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="新しいタグ"
              onKeyDown={(e) => { if (e.key === "Enter" && canAdd) { e.preventDefault(); onAdd(draft.trim()); setDraft(""); } }} />
          </div>
          <button type="button" disabled={!canAdd}
            onClick={() => { onAdd(draft.trim()); setDraft(""); }}
            className={(canAdd ? BTN_PRIMARY : BTN_BASE + " bg-neutral-100 border-2 border-neutral-200 text-neutral-400")
              + " " + BTN_H + " px-3.5 text-[14.5px] shrink-0"}><Plus size={15} /> 追加</button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Mascot seed="tags-empty" size={118} />
            <p className="text-[14.5px] text-neutral-500 mt-1">まだタグがありません</p>
          </div>
        ) : (
          <div className="space-y-2 ft-seq">
            {list.map((t) => {
              const n = countOf(t);
              return (
                <div key={t} className="flex items-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-3.5 py-2.5">
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15.5px] font-bold text-neutral-900 truncate">{t}</span>
                    <span className="block text-[12.5px] text-neutral-500">{n > 0 ? `${n}件の記録で使用中` : "まだ使われていません"}</span>
                  </span>
                  <button type="button" onClick={() => setRenaming({ from: t, to: t })} aria-label={`${t} の名前を変える`}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 ft-tap ft-tap-icon"><Pencil size={16} /></button>
                  <button type="button" onClick={() => setDeleting({ tag: t, n })} aria-label={`${t} を削除`}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 border-rose-200 text-rose-700 hover:bg-rose-50 ft-tap ft-tap-icon"><Trash2 size={16} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renaming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop">
            <h3 className="font-display text-[17px] text-neutral-900 mb-3">タグの名前を変える</h3>
            <TextInput value={renaming.to} onChange={(e) => setRenaming({ ...renaming, to: e.target.value })} />
            <p className="text-[12.5px] text-neutral-500 mt-2 mb-5 leading-relaxed">
              このタグが付いている記録も、まとめて新しい名前に変わります。
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setRenaming(null)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
              <button disabled={!renameOk} onClick={() => { onRename(renaming.from, renaming.to.trim()); setRenaming(null); }}
                className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>変える</button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border-2 border-neutral-200 shadow-xl anim-pop">
            <h3 className="font-display text-[17px] text-neutral-900 mb-2">「{deleting.tag}」を削除しますか</h3>
            <p className="text-[13.5px] text-neutral-600 mb-5 leading-relaxed">
              {deleting.n > 0
                ? `${deleting.n}件の記録から、このタグが外れます。記録そのものは消えません。`
                : "この一覧から消えます。記録には使われていません。"}
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setDeleting(null)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
              <button onClick={() => { onDelete(deleting.tag); setDeleting(null); }}
                className={BTN_DANGER + " flex-1 " + BTN_H + " text-[14.5px]"}>削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </OverlayScreen>
  );
}

/* ============================================================
   ヘルプ画面
   使い方は、ここと「？」の吹き出しの2か所にまとめている。
   画面に説明文を常に出しておくと、慣れた人には邪魔になるため
   ============================================================ */
const HELP_SECTIONS = [
  {
    title: "記録をつける",
    items: [
      ["＋を押して始める", "記録タブの右下にある＋から、種類を選んで書き始めます。種類は「通読」「学び」「聖句」「その他」の4つです。"],
      ["書きかけでも消えない", "入力の途中でも自動で下書きが残ります。右上のボタンを押すと、その場で保存できます。輪がひとつ広がったら、保存できた合図です。"],
      ["書・章・節を選んで入れる", "入力欄の下にある「書・章・節を選んで挿入」から選ぶと、正しい書き方で文章に足せます。章をまたぐとき（創世記 2章-5章）も選べます。"],
    ],
  },
  {
    title: "タグ",
    items: [
      ["どの記録にも付けられる", "種類とは別に、自由なラベルを何個でも付けられます。「祈り」「日曜礼拝」「家族」のように、あとで思い出しやすい言葉を登録できます。"],
      ["前に使ったタグから選ぶ", "一度登録したタグは一覧に残ります。打ち込んでさがすことも、押して付けることもできます。"],
      ["探すときの手がかりになる", "「探す」の絞り込みで、タグを選んで横断的に取り出せます。複数選ぶと、そのすべてが付いた記録だけが残ります。"],
    ],
  },
  {
    title: "メモ欄とリンク",
    items: [
      ["URLはそのまま貼る", "メモ欄にURLを貼っておくと、閲覧画面では押せるリンクになります。押すとブラウザで開きます。"],
    ],
  },
  {
    title: "探す",
    items: [
      ["言葉で探す", "上の欄に言葉を入れて「検索」を押します。本文だけでなく、タグや聖書箇所も探しに含まれます。"],
      ["絞り込む", "記録の種類・タグ・書・期間で絞り込めます。あとで調べたいことは、タグを付けておくと後から取り出せます。"],
    ],
  },
  {
    title: "実績と実り",
    items: [
      ["読んだところが色づく", "実績タブでは、通読の記録から66巻それぞれの読んだ回数が色で分かります。"],
      ["続けるほど実る", "ホームの木は、記録を重ねるほど育ちます。収穫した実はメニューから振り返れます。"],
    ],
  },
  {
    title: "そなえ",
    items: [
      ["ときどき書き出す", "メニューの「バックアップ」から、記録とイラストをまとめて書き出せます。機種を変えるときや、もしものときに元へ戻せます。"],
      ["見た目を変える", "メニューの「画面のカスタマイズ」から、色や記録の種類の名前、イラストを変えられます。押したときの動きも、ここで止められます。"],
    ],
  },
];

function HelpScreen({ onClose }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const [open, setOpen] = useState(HELP_SECTIONS[0].title);

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">ヘルプ</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="space-y-2.5 ft-seq">
          {HELP_SECTIONS.map((sec) => {
            const on = open === sec.title;
            return (
              <div key={sec.title} className="rounded-2xl border-2 border-neutral-200 bg-white overflow-hidden">
                <button onClick={() => setOpen(on ? null : sec.title)}
                  className="w-full flex items-center gap-2 px-4 py-3 min-h-[56px] text-left ft-tap ft-tap-card">
                  <span className="flex-1 font-display text-[15.5px] text-neutral-900">{sec.title}</span>
                  <ChevronDown size={18} className={"text-neutral-400 shrink-0 ft-chev " + (on ? "ft-chev-on" : "")} />
                </button>
                {on && (
                  <div className="border-t-2 border-neutral-100 px-4 py-3 space-y-3.5 ft-open-y">
                    {sec.items.map(([h, body]) => (
                      <div key={h}>
                        <p className="text-[14.5px] font-bold text-th-900 mb-0.5">{h}</p>
                        <p className="text-[13.5px] text-neutral-600 leading-relaxed">{body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center pt-6 pb-2">
          <div className="opacity-70"><Mascot seed="help" size={104} /></div>
        </div>
      </div>
    </div>
    </OverlayScreen>
  );
}

function GardenScreen({ garden, records, onClose, onChangeFruit }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const [pick, setPick] = useState(false);
  const [pending, setPending] = useState(null); // 植え直しの確認待ち
  const harvests = [...(garden.harvests || [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const tally = FRUITS.map((f) => ({ f, n: harvests.filter((h) => h.fruit === f.key).length }));
  const cycle = garden.cycle;
  const cc = cycle ? cycleCounts(records, cycle.startedAt) : null;
  const cur = cc ? stageOf(cc.days, cc.count) : null;

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">収穫した実</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {cycle && (
          <div className="rounded-2xl border-2 border-th-700/25 bg-white p-4 mb-4 flex items-center gap-4">
            <FruitTree stage={cur.n} fruit={cycle.fruit} size={86} />
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-bold tracking-wider text-th-800/70">育てている木</p>
              <p className="text-[14.5px] font-bold text-neutral-900">{fruitByKey(cycle.fruit).label}・{cur.name}</p>
              <button onClick={() => setPick(true)} className={BTN_SECONDARY + " mt-2 " + BTN_H + " px-3 text-[13.5px]"}>育てる実を変える</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-5">
          {tally.map(({ f, n }) => (
            <div key={f.key} className={"rounded-xl border-2 py-2.5 text-center " + (n > 0 ? "border-th-700/25 bg-white" : "border-neutral-200 bg-neutral-100/60")}>
              <span className="flex justify-center mb-1">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  <circle cx="12" cy="14" r="8" fill={n > 0 ? f.ripe : "#D6D3D1"} />
                  <path d="M12 6 L12 3" stroke={n > 0 ? "#8A6B4F" : "#D6D3D1"} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="block text-[11.5px] font-bold text-neutral-700 leading-tight">{f.label}</span>
              <span className={"block text-[12.5px] font-bold " + (n > 0 ? "text-th-900" : "text-neutral-500")}>{n}</span>
            </div>
          ))}
        </div>

        {harvests.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-300 p-6 flex flex-col items-center">
            <FruitTree stage={1} fruit="apple" size={120} />
            <p className="text-[12.5px] text-neutral-500 mt-2 text-center">これまでの実りが、ここに並びます。</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {harvests.map((h, i) => (
              <div key={h.id || i} className="rounded-2xl border border-neutral-200 bg-white p-3 flex items-center gap-3">
                <FruitTree stage={10} fruit={h.fruit} size={64} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] font-bold text-neutral-900">{fruitByKey(h.fruit).label}</p>
                  <p className="text-[12.5px] text-neutral-500">{h.date} に収穫</p>
                </div>
                <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-th-100 text-th-900 shrink-0">{harvests.length - i}個目</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {pick && (
        <FruitPickDialog
          title="育てる実を変える"
          note="選ぶと、育ってきた日数と件数は0から数え直しになります。"
          current={cycle ? cycle.fruit : FRUITS[0].key}
          onPick={(k) => { setPick(false); setPending(k); }}
          onCancel={() => setPick(false)}
        />
      )}

      {pending && (
        <ConfirmReplantDialog
          fruit={pending}
          onConfirm={() => { const k = pending; setPending(null); onChangeFruit(k); }}
          onCancel={() => { setPending(null); setPick(true); }}
        />
      )}
    </div>
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
function BackupScreen({ records, artworks, garden, tagMaster, prefs, captions, typeDesc, onClose, onRestore, onBackedUp }) {
  const [closing, close] = useClosing(onClose);
  const readableText = useMemo(() => buildBackupText(records), [records]);
  const jsonText = useMemo(() => JSON.stringify({
    app: "bible-tracker", version: 5, exportedAt: new Date().toISOString(),
    records, artworks: artworks || [], garden: garden || DEFAULT_GARDEN,
    /* タグの一覧も一緒に書き出す。これが無いと、機種を変えたときに
       まだ使っていないタグが消え、また作り直すことになる */
    tags: tagMaster || [],
    /* 画面の設定も一緒に書き出す（version 5 から）。
       テーマ色・文字の大きさ・記録の種類の名前・ひとことなど、
       せっかく整えたものが機種を変えるたびに消えてしまわないように。
       最終バックアップ日（lastBackup）は入れない。
       それは「この端末でいつ書き出したか」であって、持ち運ぶものではないため */
    prefs: prefs ? { ...prefs, lastBackup: undefined } : undefined,
    captions: captions || undefined,
    typeDesc: typeDesc || undefined,
  }, null, 2), [records, artworks, garden, tagMaster, prefs, captions, typeDesc]);
  const [previewMode, setPreviewMode] = useState("readable"); // readable | json
  const [previewOpen, setPreviewOpen] = useState(false);
  const [msg, setMsg] = useState(null); // {kind:'ok'|'warn'|'err', text}
  const [fallbackOpen, setFallbackOpen] = useState(false); // 保存に失敗したときのダイアログ
  const fileInputRef = useRef(null);

  const sizeKb = Math.max(1, Math.round(new Blob([jsonText]).size / 1024));
  const embedded = typeof window !== "undefined" && window.self !== window.top;

  const saveData = async () => {
    /* ファイルの名前だけ見て「Footprintsのデータ」と分かるようにする。
       日付を後ろに置くと、並べたときに古い順に揃う。
       記号は半角のハイフンだけにすること。空白や日本語を混ぜると、
       共有や送信の途中で文字が化けることがある */
    const filename = `Footprints-backup-${todayStr()}.json`;

    // 1) 共有シート（iPhoneはここから「ファイルに保存」で任意の場所に保存できる）
    //    ※ await を挟むと iOS が「ユーザー操作による呼び出し」と認識しなくなるため、最初に試す
    try {
      const file = new File([jsonText], filename, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Footprints のバックアップ" });
        onBackedUp && onBackedUp();
        setMsg(null);
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // キャンセルされた場合は何もしない
    }

    // 2) 保存先のフォルダを直接選べる方法（対応環境: 主にPCのChrome/Edgeなど）
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: "Footprints のバックアップ", accept: { "application/json": [".json"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(jsonText);
        await writable.close();
        onBackedUp && onBackedUp();
        setMsg({ kind: "ok", text: "指定した場所に保存しました。" });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }

    // 3) ダウンロード
    //    ※ 埋め込み表示ではダウンロード指定が無視され、この画面自体がJSONに移動して
    //      戻れなくなってしまうため、埋め込みのときは行わない
    if (!embedded) {
      try {
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 20000);
        onBackedUp && onBackedUp();
        setMsg({ kind: "ok", text: `「${filename}」を保存しました。` });
        return;
      } catch (e) { /* 次の方法へ */ }
    }

    // 4) どの方法でも保存できなかったときは、ダイアログで知らせてコピーを促す
    setMsg(null);
    setFallbackOpen(true);
  };

  /* ダイアログの「コピーする」を押したとき */
  const copyFromFallback = async () => {
    const ok = await copyToClipboard(jsonText);
    setFallbackOpen(false);
    if (ok) {
      onBackedUp && onBackedUp();
      setMsg({ kind: "warn", text: "データをコピーしました。メモアプリなどに貼り付けて保管してください。" });
    } else {
      setPreviewMode("json");
      setPreviewOpen(true);
      setMsg({ kind: "err", text: "コピーできませんでした。下の「内容を確認する」を開き、復元用データを長押しして手動でコピーしてください。" });
    }
  };

  const copyText = async (text, label) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setMsg({ kind: "ok", text: `${label}をコピーしました。` });
    } else {
      setPreviewOpen(true);
      setMsg({ kind: "err", text: "コピーできませんでした。下のプレビューから手動でコピーしてください。" });
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result);
        let recs, arts = null, gard = null, tgs = null, setting = null;
        if (Array.isArray(data)) recs = data;                       // 旧形式（記録のみ）
        else if (data && Array.isArray(data.records)) {             // 新形式
          recs = data.records;
          if (Array.isArray(data.artworks)) arts = data.artworks;
          if (data.garden && typeof data.garden === "object") gard = data.garden;
          if (Array.isArray(data.tags)) tgs = data.tags;            // タグの一覧（version 4 から）
          /* 画面の設定（version 5 から）。古いファイルには入っていないので、
             そのときは今の設定をそのまま残す */
          setting = {
            prefs: data.prefs && typeof data.prefs === "object" ? data.prefs : null,
            captions: data.captions && typeof data.captions === "object" ? data.captions : null,
            typeDesc: data.typeDesc && typeof data.typeDesc === "object" ? data.typeDesc : null,
          };
        } else throw new Error("invalid");
        await onRestore(recs, arts, gard, tgs, setting);
        setMsg({
          kind: "ok",
          text: `${recs.length}件の記録` + (arts && arts.length ? `と${arts.length}枚のイラスト` : "") + "を読み込みました。",
        });
      } catch (err) {
        setMsg({ kind: "err", text: "読み込みに失敗しました。正しいバックアップファイル（.json）を選んでください。" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const { stripRef, screenRef } = useEdgeSwipeBack(onClose);

  const msgStyle = msg
    ? msg.kind === "ok" ? "bg-th-50 border-th-200 text-th-900"
      : msg.kind === "warn" ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-rose-50 border-rose-200 text-rose-900"
    : "";

  return (
    <OverlayScreen from="right" closing={closing}>
      <div ref={stripRef} className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-neutral-50 flex flex-col">
        <div className="flex items-center gap-2 px-4 pb-4 border-b border-neutral-200 shrink-0 bg-white" style={SAFE_TOP(16)}>
          <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-neutral-700 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
          <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">バックアップ</h2>
          <MenuButton />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-4 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] text-neutral-900">{records.length}</span>
              <span className="text-[13.5px] font-bold text-neutral-600">件の記録</span>
              {(artworks || []).length > 0 && (
                <span className="text-[13.5px] font-bold text-neutral-500">＋ イラスト{artworks.length}枚</span>
              )}
              <span className="text-[12.5px] text-neutral-500 ml-auto">約{sizeKb}KB</span>
            </div>
            {/* 何が入っているかを言葉でも書いておく。
                「設定は戻るのか」が分からないままだと、機種変更のときに不安になる */}
            <div className="mt-2">
              <p className="text-[12.5px] text-neutral-500 leading-relaxed">
                記録・イラスト・果樹・タグの一覧に加えて、テーマ色や文字の大きさ、
                記録の種類の名前、ひとことなどの設定も一緒に保存されます。
              </p>
</div>
          </div>

          <div className="space-y-2.5 mb-4">
            <div className="flex justify-end">
              <HelpTip label="バックアップ" text="記録と登録したイラストをまとめて1つのファイルに書き出します。機種を変えるときや、もしものときは「データ復元」で元に戻せます。" />
            </div>
            <button onClick={saveData} className={BTN_PRIMARY + " w-full " + BTN_H + " text-[15.5px]"}>
              <Download size={18} /> データを保存
            </button>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className={BTN_SECONDARY + " w-full " + BTN_H + " text-[15.5px]"}>
              <Upload size={18} /> データ復元
            </button>
            <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
          </div>

          {msg && (
            <div className={"rounded-xl border-2 px-3.5 py-3 mb-4 text-[13.5px] font-bold " + msgStyle}>{msg.text}</div>
          )}

          <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <button onClick={() => setPreviewOpen((v) => !v)} className="w-full flex items-center gap-2 px-4 py-3 min-h-[52px] text-left ft-tap ft-tap-card">
              <span className="flex-1 text-[13.5px] font-bold text-neutral-700">内容を確認する</span>
              <ChevronDown size={18} className={"text-neutral-500 ft-chev " + (previewOpen ? "ft-chev-on" : "")} />
            </button>
            {previewOpen && (
              <div className="px-4 pb-4 border-t-2 border-neutral-100 pt-3 ft-open-y">
                <div className="flex gap-2 mb-2.5">
                  <button onClick={() => setPreviewMode("readable")}
                    className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (previewMode === "readable" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>読みやすい形式</button>
                  <button onClick={() => setPreviewMode("json")}
                    className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (previewMode === "json" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>復元用データ</button>
                </div>
                <textarea readOnly value={previewMode === "readable" ? readableText : jsonText}
                  className="w-full h-56 rounded-xl border-2 border-neutral-300 p-3.5 text-[12.5px] leading-relaxed font-mono text-neutral-800 resize-none bg-neutral-50" />
                <button
                  onClick={() => copyText(previewMode === "readable" ? readableText : jsonText, previewMode === "readable" ? "読みやすい形式のテキスト" : "復元用データ")}
                  className={BTN_SECONDARY + " w-full " + BTN_H + " text-[14.5px] mt-2.5"}>コピー</button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 mt-6">
            <p className="text-[13.5px] font-bold text-amber-900 mb-2">記録が消えてしまうとき</p>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed mb-2">
              記録は、この端末のブラウザの中に保存されています。書いた時点で自動的に残るので、
              アプリを閉じても消えることはありません。
            </p>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed mb-2">
              ただし、次のようなときは記録ごと失われてしまいます。
            </p>
            <ul className="text-[13.5px] text-neutral-700 leading-relaxed space-y-1 mb-2">
              <li>・ Safariの「履歴とWebサイトデータを消去」をしたとき</li>
              <li>・ ホーム画面に追加したアプリを削除したとき</li>
              <li>・ 機種変更で、新しい端末に持ち替えたとき</li>
              <li>・ 別の端末や、別のブラウザで開いたとき（記録は端末ごとに分かれています）</li>
            </ul>
            <p className="text-[13.5px] text-neutral-700 leading-relaxed">
              どれも前ぶれなく起こることがあります。時々このページで保存しておけば、
              そのときも「データ復元」で元どおりに戻せます。
            </p>
          </div>
        </div>
      </div>

      {fallbackOpen && (
        <SaveFallbackDialog onCopy={copyFromFallback} onCancel={() => setFallbackOpen(false)} />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   ボトムナビゲーション
   ============================================================ */
const TABS = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "record", label: "記録", icon: BookOpen },
  { key: "search", label: "探す", icon: Search },
  { key: "progress", label: "実績", icon: TrendingUp },
];
function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-lg lg:max-w-5xl mx-auto flex">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => onChange(key)} className="flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] relative ft-tap">
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-th-800 rounded-full ft-tabbar" />}
              {/* 選ばれた瞬間だけ弾ませたいので、key を変えて描き直させている */}
              <Icon key={isActive ? "on" : "off"} size={21}
                className={(isActive ? "text-th-800 ft-tabpop" : "text-neutral-500")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={"text-[11.5px] tracking-tight whitespace-nowrap " + (isActive ? "text-th-800 font-bold" : "text-neutral-500 font-medium")}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   App
   ============================================================ */
/* 何かの拍子に画面が真っ白になっても、記録を取り出せるようにするための最後の砦。
   テーマ色のCSSはApp内にあるため、ここでは見た目を直接指定している
   （CSSが一切読めていない状態でも、必ず読めるようにするため） */
const EB_BOX = { minHeight: "100vh", background: "#FAFAF9", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "sans-serif" };
const EB_BTN = { width: "100%", minHeight: "40px", borderRadius: "12px", fontSize: "14.5px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" };

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false, copied: null }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { try { console.error("画面の表示に失敗しました", error); } catch (e) { /* noop */ } }

  async rescue() {
    try {
      const raw = await storageGet(STORAGE_KEY);
      if (!raw) { this.setState({ copied: "empty" }); return; }
      const ok = await copyToClipboard(raw);
      this.setState({ copied: ok ? "ok" : "ng" });
    } catch (e) { this.setState({ copied: "ng" }); }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { copied } = this.state;
    return (
      <div style={EB_BOX}>
        <div style={{ maxWidth: "384px", width: "100%" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#1C1917", margin: "0 0 8px" }}>画面を表示できませんでした</h1>
          <p style={{ fontSize: "13.5px", color: "#57534E", lineHeight: 1.7, margin: "0 0 8px" }}>
            記録は消えていません。この端末の中にそのまま残っています。
          </p>
          <p style={{ fontSize: "13.5px", color: "#57534E", lineHeight: 1.7, margin: "0 0 20px" }}>
            まず「もう一度開く」をお試しください。それでも直らないときは、下のボタンで記録を取り出し、メモアプリなどに貼り付けて保管してください。
          </p>
          <button onClick={() => { try { window.location.reload(); } catch (e) { /* noop */ } }}
            style={{ ...EB_BTN, background: "#134E4A", color: "#fff", border: "0", marginBottom: "10px" }}>もう一度開く</button>
          <button onClick={() => this.rescue()}
            style={{ ...EB_BTN, background: "#fff", color: "#44403C", border: "2px solid #D6D3D1" }}>記録をコピーして取り出す</button>
          {copied === "ok" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#134E4A", marginTop: "12px" }}>コピーしました。メモアプリなどに貼り付けて保管してください。</p>}
          {copied === "ng" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#9F1239", marginTop: "12px" }}>コピーできませんでした。</p>}
          {copied === "empty" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#57534E", marginTop: "12px" }}>取り出せる記録が見つかりませんでした。</p>}
        </div>
      </div>
    );
  }
}

export default function App() {
  return <ErrorBoundary><AppMain /></ErrorBoundary>;
}

function AppMain() {
  const [records, setRecordsState] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [draftSaved, setDraftSaved] = useState(null); // 書きかけの記録（前回アプリを閉じたときの控え）
  const [typePick, setTypePick] = useState(false);   // ＋を押したあとの種類選び
  const [typeLocked, setTypeLocked] = useState(false); // 種類を選んでから入る流れかどうか
  const [viewing, setViewing] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [viewingDay, setViewingDay] = useState(null);
  const [dupState, setDupState] = useState(null);
  const [backupOpen, setBackupOpen] = useState(false);
  const [artOpen, setArtOpen] = useState(false);
  const [gardenOpen, setGardenOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [typeDesc, setTypeDesc] = useState({ desc: { ...DEFAULT_TYPE_DESC }, name: { ...DEFAULT_TYPE_NAME } });
  const [garden, setGarden] = useState({ ...DEFAULT_GARDEN });
  const [pickFruit, setPickFruit] = useState(false);
  const [harvestOf, setHarvestOf] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuInstant, setMenuInstant] = useState(false);
  /* メニューから別の画面へ移るとき。
     いま開いている画面を必ず閉じてから、次を開くこと。
     閉じずに開くと2枚が重なったままになり、あとに書いてあるほう
     （＝「収穫した実」）だけが手前に出続けてしまう。
     重なって出る画面はどれも同じ高さ（z-index 50）なので、
     並び順がそのまま前後関係になる点に注意 */
  const goFromMenu = (fn) => {
    setMenuInstant(true);
    setBackupOpen(false);
    setArtOpen(false);
    setBookmarkOpen(false);
    setGardenOpen(false);
    setHelpOpen(false);
    setTagsOpen(false);
    fn();
    setMenuOpen(false);
  };
  const [artworks, setArtworks] = useState([]);
  const [tagMaster, setTagMaster] = useState([]);
  const [captions, setCaptions] = useState({ ...DEFAULT_CAPTIONS });
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS });

  useEffect(() => {
    loadRecords()
      .then((r) => { setRecordsState((Array.isArray(r) ? r : []).map(migrateRecord).filter(Boolean)); })
      .catch(() => { setRecordsState([]); })
      .finally(() => { setLoaded(true); });
  }, []);
  useEffect(() => { loadArtworks().then(setArtworks); }, []);
  useEffect(() => { loadCaptions().then(setCaptions); }, []);
  useEffect(() => { loadTagMaster().then(setTagMaster); }, []);
  useEffect(() => { loadPrefs().then(setPrefs); }, []);
  useEffect(() => { loadGarden().then(setGarden); }, []);
  useEffect(() => { loadTypeDesc().then(setTypeDesc); }, []);
  const saveTypeDesc = useCallback(async (d) => { setTypeDesc(d); return await persistTypeDesc(d); }, []);
  useEffect(() => { loadDraft().then((d) => { if (d && hasContent(d.rec)) setDraftSaved(d); }); }, []);

  /* 入力中の内容を控える。空っぽなら控えない */
  const handleAutoDraft = useCallback((rec) => {
    if (!rec || !hasContent(rec)) { clearDraft(); return; }
    persistDraft({ rec, savedAt: new Date().toISOString() });
  }, []);

  /* 書きかけの続きを開く */
  const resumeDraft = () => {
    if (!draftSaved) return;
    const rec = draftSaved.rec;
    const exists = records.some((r) => r.id === rec.id);
    setIsNew(!exists);
    setTypeLocked(!exists);
    setEditing(rec);
    setDraftSaved(null);
  };
  const discardDraft = () => { clearDraft(); setDraftSaved(null); };

  const saveGarden = useCallback((g) => { setGarden(g); persistGarden(g); }, []);

  /* 種を植える（初回・植え替え・収穫後の新しいサイクル） */
  const plantFruit = useCallback((fruit) => {
    setGarden((g) => {
      const next = { ...g, cycle: { fruit, startedAt: todayStr(), harvested: false } };
      persistGarden(next);
      return next;
    });
    setPickFruit(false);
  }, []);

  /* 熟した実をとる。図鑑に残してから、次の種のダイアログへ */
  const harvestFruit = useCallback(() => {
    setGarden((g) => {
      if (!g.cycle || g.cycle.harvested) return g;
      const rec = { id: uid(), fruit: g.cycle.fruit, date: todayStr(), startedAt: g.cycle.startedAt };
      const next = { cycle: { ...g.cycle, harvested: true }, harvests: [...(g.harvests || []), rec] };
      persistGarden(next);
      setHarvestOf(g.cycle.fruit);
      return next;
    });
  }, []);

  const unsavedNow = unsavedCount(records, prefs);

  const markBackedUp = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, lastBackup: new Date().toISOString() };
      persistPrefs(next);
      return next;
    });
  }, []);

  const savePrefs = useCallback(async (next) => {
    const res = await persistPrefs(next);
    if (res.ok) setPrefs(next);
    return res;
  }, []);

  /* テーマカラーを画面全体へ反映する */
  useEffect(() => {
    const theme = THEMES.find((t) => t.key === prefs.theme) || THEMES[0];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(`--th-${k}`, v));
  }, [prefs]);

  /* 選べるタグの一覧。
     一覧に登録した分と、記録に実際に付いている分を合わせて出す。
     こうしておけば、前の版から引き継いだ記録のタグも最初から選べる */
  const knownTags = useMemo(() => normalizeTags([...tagMaster, ...allTagsOf(records)]), [tagMaster, records]);
  /* 新しく作られたタグは一覧に控える。記録を消してもタグは選べるまま残る */
  const addTagToMaster = useCallback((t) => {
    setTagMaster((prev) => {
      const next = normalizeTags([...prev, t]);
      if (next.length !== prev.length) persistTagMaster(next);
      return next;
    });
  }, []);

  /* タグの名前を変える。一覧と記録の両方に同じことをすること。
     片方だけ直すと、記録に古い名前が残って食い違う */
  const renameTag = useCallback((from, to) => {
    setTagMaster((prev) => {
      const next = normalizeTags(prev.map((t) => (t === from ? to : t)));
      persistTagMaster(next);
      return next;
    });
    setRecords((prev) => prev.map((r) => ((r.tags || []).includes(from)
      ? { ...r, tags: normalizeTags(r.tags.map((t) => (t === from ? to : t))) } : r)));
  }, []); // eslint-disable-line
  /* タグを消す。記録からも外すが、記録そのものは消さない */
  const deleteTag = useCallback((tag) => {
    setTagMaster((prev) => {
      const next = prev.filter((t) => t !== tag);
      persistTagMaster(next);
      return next;
    });
    setRecords((prev) => prev.map((r) => ((r.tags || []).includes(tag)
      ? { ...r, tags: r.tags.filter((t) => t !== tag) } : r)));
  }, []); // eslint-disable-line

  const saveCaptions = useCallback(async (map) => {
    const res = await persistCaptions(map);
    if (res.ok) setCaptions(map);
    return res;
  }, []);

  const saveArtworks = useCallback(async (list) => {
    const res = await persistArtworks(list);
    if (res.ok) setArtworks(list);
    return res;
  }, []);

  useEffect(() => {
    try {
      let meta = document.querySelector('meta[name="robots"]');
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "robots"); document.head.appendChild(meta); }
      meta.setAttribute("content", "noindex, nofollow");
    } catch (e) { /* noop */ }
  }, []);

  const setRecords = useCallback((updater) => {
    setRecordsState((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; persistRecords(next); return next; });
  }, []);

  const openEdit = (r) => { setIsNew(false); setTypeLocked(false); setEditing(r); };
  const openNew = () => setTypePick(true);
  const startNewOfType = (t) => {
    setTypePick(false);
    setIsNew(true);
    setTypeLocked(true);
    setEditing(emptyRecord(t));
  };
  const closeForm = () => { setEditing(null); setIsNew(false); setTypeLocked(false); clearDraft(); setDraftSaved(null); };
  const openNewReading = (patch) => { setIsNew(true); setTypeLocked(true); setEditing({ ...emptyRecord("reading"), ...patch }); setTab("record"); };
  /* from を指定すると、その向きから画面が出てくる。
     指定しなければ、これまでどおり右から */
  const [viewingFrom, setViewingFrom] = useState("right");
  const openDetail = (r, from) => { setViewing(r); setViewingFrom(from === "bottom" ? "bottom" : "right"); };
  /* ピン留め・ブックマークの切り替え */
  const toggleMark = useCallback((id, key) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)));
    setViewing((prev) => (prev && prev.id === id ? { ...prev, [key]: !prev[key] } : prev));
  }, []);
  const closeDetail = () => setViewing(null);
  const editFromDetail = () => { openEdit(viewing); };
  const openBook = (book) => setViewingBook(book);
  const closeBook = () => setViewingBook(null);
  const closeDay = () => setViewingDay(null);
  /* 書ごとの記録一覧は閉じずに重ねる。戻ったとき、元の一覧に戻れるようにするため */
  const openDetailFromBook = (r) => openDetail(r);

  const commitSaveOrAdd = (rec) => {
    setRecords((prev) => { const exists = prev.some((p) => p.id === rec.id); return exists ? prev.map((p) => (p.id === rec.id ? rec : p)) : [...prev, rec]; });
  };


  const handleSave = (rec, opts) => {
    /* 「今月・今年の聖句」を付け替えたとき、元の記録から外す。
       外すのは保存のときだけ。チェックした時点で外すと、
       そのあとキャンセルされたときに元の記録だけ印が消えてしまう */
    const steal = opts && opts.steal;
    if (steal && (steal.month || steal.year)) {
      setRecords((prev) => prev.map((r) => {
        let out = r;
        if (steal.month && r.id === steal.month) out = { ...out, monthYear: null, monthMonth: null };
        if (steal.year && r.id === steal.year) out = { ...out, themeYear: null };
        return out;
      }));
    }
    /* 途中保存：記録を残すだけで画面は閉じない。
       新規だった場合はここで実在の記録になるので、以後は同じ記録を上書きしていく */
    if (opts && opts.keepOpen) {
      const clean = rec.type === "memorization" ? { ...rec, text: truncateAtCitation(rec.text) } : rec;
      /* 同じ記録を上書きしていくので、何度押しても増えない。
         画面の状態（新規か編集か）はあえて変えない。
         ここで切り替えると入力欄が作り直され、打っている途中の
         カーソルが外れてしまうため */
      commitSaveOrAdd(clean);
      setViewing((prev) => (prev && prev.id === clean.id ? clean : prev));
      clearDraft();
      return;
    }
    if (rec.type === "memorization") {
      const cleanText = truncateAtCitation(rec.text);
      const cleanRec = { ...rec, text: cleanText };
      const ref = primaryRef(cleanText);
      const dup = ref && records.find((m) => m.type === "memorization" && m.id !== rec.id && sameRef(primaryRef(m.text), ref));
      if (dup) { setDupState({ pending: cleanRec, existing: dup, fromForm: true }); return; }
      commitSaveOrAdd(cleanRec); closeForm();
      setViewing((prev) => (prev && prev.id === cleanRec.id ? cleanRec : prev));
        return;
    }
    commitSaveOrAdd(rec); closeForm();
    setViewing((prev) => (prev && prev.id === rec.id ? rec : prev));
  };
  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((p) => p.id !== id));
    closeForm();
    setViewing((prev) => (prev && prev.id === id ? null : prev));
  };

  const handleQuickMemorize = (rawText) => {
    const text = truncateAtCitation(rawText);
    const ref = primaryRef(text);
    const dup = ref && records.find((m) => m.type === "memorization" && sameRef(primaryRef(m.text), ref));
    const pending = { id: uid(), type: "memorization", text, monthYear: null, monthMonth: null, createdAt: new Date().toISOString() };
    if (dup) { setDupState({ pending, existing: dup, fromForm: false }); return; }
    commitSaveOrAdd(pending);
  };
  const handleRestore = async (importedRecords, importedArtworks, importedGarden, importedTags, importedSetting) => {
    /* 画面の設定を戻す。入っていない項目は今のまま残すこと。
       最終バックアップ日だけは、この端末のものを守る */
    if (importedSetting) {
      if (importedSetting.prefs) {
        await savePrefs({ ...prefs, ...importedSetting.prefs, lastBackup: prefs.lastBackup });
      }
      if (importedSetting.captions) await saveCaptions({ ...captions, ...importedSetting.captions });
      if (importedSetting.typeDesc) {
        await saveTypeDesc({
          name: { ...typeDesc.name, ...(importedSetting.typeDesc.name || {}) },
          desc: { ...typeDesc.desc, ...(importedSetting.typeDesc.desc || {}) },
        });
      }
    }
    /* タグの一覧は足し合わせる。今ある分を消さないこと */
    if (Array.isArray(importedTags) && importedTags.length) {
      setTagMaster((prev) => {
        const next = normalizeTags([...prev, ...importedTags]);
        if (next.length !== prev.length) persistTagMaster(next);
        return next;
      });
    }
    setRecords((prev) => {
      const map = new Map(prev.map((r) => [r.id, r]));
      importedRecords.forEach((r) => { const m = r && r.id ? migrateRecord(r) : null; if (m) map.set(r.id, m); });
      return Array.from(map.values());
    });
    if (Array.isArray(importedArtworks) && importedArtworks.length) {
      const map = new Map(artworks.map((a) => [a.id, a]));
      importedArtworks.forEach((a) => { if (a && a.id && a.src) map.set(a.id, a); });
      await saveArtworks(Array.from(map.values()).slice(0, ART_MAX));
    }
    /* 果樹の記録。古い形式のファイルには入っていないので、その時は今のまま残す */
    if (importedGarden && typeof importedGarden === "object") {
      const cyc = importedGarden.cycle;
      const next = {
        cycle: cyc && cyc.fruit && cyc.startedAt ? cyc : garden.cycle,
        harvests: Array.isArray(importedGarden.harvests)
          ? Array.from(new Map([...(garden.harvests || []), ...importedGarden.harvests]
              .filter((h) => h && h.fruit && h.date).map((h) => [h.id || h.date + h.fruit, h])).values())
          : (garden.harvests || []),
      };
      saveGarden(next);
    }
  };

  if (!loaded) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><p className="text-neutral-500 text-[14.5px] font-bold">読み込み中…</p></div>;

  return (
    <ArtworkContext.Provider value={artworks}>
    <PrefsContext.Provider value={prefs}>
    <UnsavedContext.Provider value={unsavedNow}>
    <TypeNameContext.Provider value={typeDesc.name}>
    <MenuContext.Provider value={() => setMenuOpen(true)}>
    {/* ft-root ＝ 動きの効き先。「動きの演出」を切ると ft-still が付いて、すべて止まる */}
    <div className={"min-h-screen bg-neutral-50 font-sans text-neutral-900 ft-root "
      + (prefs.motion === false ? "ft-still " : "")
      + ("ft-font-" + (prefs.fontSize || "s"))}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@700;900&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif; font-weight: 900; }
        .font-sans, body { font-family: 'Noto Sans JP', sans-serif; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .btn-h { min-height: 40px; }
        /* 1行ぶんの入力欄の高さ。ひと組で並ぶ「名前」と「説明」のように、
           1行の入力欄（input）と書き足せる欄（textarea）の高さをそろえるために使う */
        .ft-h-field { min-height: 48px; }

        /* タップの質を上げるための共通設定。
           - 押したときの青い枠や灰色の膜（端末が勝手に出すもの）を消す
           - 押した瞬間に反応するよう、待ち時間をなくす
           - 文字が選択されてしまい、押した感じが濁るのを防ぐ */
        button, [role="button"], label, a {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        button { -webkit-user-select: none; user-select: none; }
        /* 押している間は、離した後より速く反応させる（沈むのは速く、戻りはゆっくり） */
        button:active { transition-duration: 60ms; }

        /* 画面の切り替わりを、さりげなく伝えるための動き。
           大きく動かすと画面が揺れて煩わしいので、10px前後・0.2秒に抑えている。
           端末側で「視差効果を減らす」設定になっている場合は動かさない */
        @keyframes ft-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ft-fade-out { from { opacity: 1; } to { opacity: 0; } }
        /* 重なって出る画面：右から出て、右へ戻る */
        @keyframes ft-right-in  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes ft-right-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
        /* 記録の入力画面：下から出て、下へ消える */
        @keyframes ft-up-in    { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ft-down-out { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes ft-sheet-down { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes ft-spin { to { transform: rotate(360deg); } }
        /* 今日の記録が入った日の、木のきらめき。ゆっくり瞬く */
        @keyframes ft-twinkle {
          0%, 100% { opacity: 0.30; transform: scale(0.78); }
          45%      { opacity: 1;    transform: scale(1.12); }
          70%      { opacity: 0.72; transform: scale(0.95); }
        }
        .ft-sparkle { animation: ft-twinkle 2.6s ease-in-out infinite;
                      transform-origin: center; transform-box: fill-box; }
        @keyframes ft-pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        /* 下から出るシート：いったん少し行き過ぎて、定位置に戻る */
        @keyframes ft-sheet-up {
          0%   { transform: translateY(100%); }
          72%  { transform: translateY(-8px); }
          88%  { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }

        /* fill-mode は backwards にすること。both だと終わったあとも transform が残り、
           中にある position:fixed の要素（ダイアログなど）の位置の基準がずれてしまう */
        .anim-right     { animation: ft-right-in 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        .anim-right-out { animation: ft-right-out 0.22s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-up        { animation: ft-up-in 0.28s cubic-bezier(0.22,1,0.36,1) backwards; }
        .anim-down-out  { animation: ft-down-out 0.24s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-sheet     { animation: ft-sheet-up 0.36s cubic-bezier(0.33,1,0.5,1) backwards; }
        .anim-sheet-out { animation: ft-sheet-down 0.24s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-fade      { animation: ft-fade-in 0.2s ease-out backwards; }
        .anim-fade-out  { animation: ft-fade-out 0.2s ease-out forwards; }
        .anim-pop       { animation: ft-pop 0.26s cubic-bezier(0.34,1.4,0.5,1) backwards; }
        .spin           { animation: ft-spin 0.75s linear infinite; }
        .no-anim, .no-anim * { animation: none !important; }

        /* ============================================================
           手ざわりの演出
           押したときの沈み、現れるときのひと呼吸、開いた合図など。
           どれも「数px・0.2〜0.4秒」に収めてある。大きく動かすと
           画面が揺れて煩わしくなるため、この範囲を超えないこと。
           ・fill-mode は必ず backwards（both だと終了後も transform が残り、
             中にある position:fixed の要素の位置の基準がずれる）
           ・動く入れ物の中に position:fixed の要素を置かないこと
           ============================================================ */

        /* --- 押した手ごたえ（全ボタン共通の土台） ---
           沈むのは速く（70ms）、戻りはゆっくり。これだけで指に返る感じが出る。
           ボタンごとに書かず、必ずこのクラスを使うこと */
        .ft-tap { transition: transform 0.24s cubic-bezier(0.22,1,0.36,1), filter 0.22s ease-out; }
        .ft-tap:active { transform: scale(0.955); filter: brightness(0.95); transition-duration: 70ms; }
        /* 大きなカードは沈みを控えめに、小さなアイコンは深めにすると同じ強さに感じる */
        .ft-tap.ft-tap-card:active { transform: scale(0.982); }
        .ft-tap.ft-tap-icon:active { transform: scale(0.88); }
        .ft-tap:disabled { transform: none; filter: none; }
        /* 押されてから画面が変わるまでの、ひと呼吸のあいだ沈めておく状態。
           ここは素早く暗くする。既定の0.24秒のままだと、
           暗くなりきる前に画面が切り替わってしまい、押した手ごたえが見えない */
        .ft-tap-pressed { transform: scale(0.96); filter: brightness(0.9); transition-duration: 45ms; }
        .ft-tap-card.ft-tap-pressed { transform: scale(0.982); }

        /* --- ぽん、と現れる（チップ・チェックなど小さな部品） --- */
        @keyframes ft-bloom { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
        .ft-chip { animation: ft-bloom 0.26s cubic-bezier(0.34,1.45,0.5,1) backwards; }

        /* --- そっと立ち上がる（各タブの中身） --- */
        @keyframes ft-rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        .ft-rise { animation: ft-rise 0.28s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* タブの入れ物そのものは、透明度だけで切り替える。
           ここで位置を動かすと、中の sticky なヘッダがぶれてしまう */
        .ft-tabswap { animation: ft-fade-in 0.2s ease-out backwards; }

        /* --- 下のタブ：選んだアイコンが軽く弾み、下線が伸びる --- */
        @keyframes ft-tabpop { 0% { transform: scale(1); } 34% { transform: scale(1.24); } 100% { transform: scale(1); } }
        .ft-tabpop { animation: ft-tabpop 0.38s cubic-bezier(0.34,1.3,0.5,1) backwards; }
        /* 下線は左右中央に寄せる指定（translateX(-50%)）が既に入っている。
           それを書き足しておかないと、伸びている間だけ左へずれてしまう */
        @keyframes ft-tabbar {
          from { transform: translateX(-50%) scaleX(0.1); opacity: 0.3; }
          to   { transform: translateX(-50%) scaleX(1);   opacity: 1; }
        }
        .ft-tabbar { animation: ft-tabbar 0.32s cubic-bezier(0.22,1,0.36,1) backwards; }

        /* --- ＋ボタン：記録タブに来たとき、くるりと出てくる --- */
        @keyframes ft-fab-in {
          0%   { opacity: 0; transform: scale(0.5) rotate(-90deg); }
          62%  { opacity: 1; transform: scale(1.09) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .ft-fab { animation: ft-fab-in 0.44s cubic-bezier(0.3,1.2,0.4,1) backwards; }

        /* --- 保存できたときの、ひと粒の波紋 --- */
        @keyframes ft-ring { 0% { opacity: 0.5; transform: scale(0.72); } 100% { opacity: 0; transform: scale(2.2); } }
        .ft-ring { animation: ft-ring 0.62s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* --- 目印（ピン・ブックマーク）を付けた瞬間 --- */
        @keyframes ft-mark {
          0% { transform: scale(1); } 28% { transform: scale(0.82); }
          64% { transform: scale(1.18); } 100% { transform: scale(1); }
        }
        .ft-mark { animation: ft-mark 0.44s cubic-bezier(0.34,1.2,0.5,1) backwards; }

        /* --- 折りたたみを開いたとき ---
           ft-open は透明度だけ。中にドラム（position:fixed のシート）がある場所で使う。
           ft-open-y はわずかに上から降りてくる。中に fixed が無い場所だけで使うこと */
        .ft-open   { animation: ft-fade-in 0.22s ease-out backwards; }
        @keyframes ft-open-y { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
        .ft-open-y { animation: ft-open-y 0.24s cubic-bezier(0.22,1,0.36,1) backwards; }

        /* --- ▽印の回転。ばね気味にすると開閉が楽しくなる --- */
        .ft-chev { transition: transform 0.34s cubic-bezier(0.34,1.45,0.5,1); }
        .ft-chev-on { transform: rotate(180deg); }

        /* --- 順にひょいひょい現れる（シートの行・メニューの行・検索結果） --- */
        @keyframes ft-stagger { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
        .ft-seq > * { animation: ft-stagger 0.32s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-seq > *:nth-child(1) { animation-delay: 0.02s; }
        .ft-seq > *:nth-child(2) { animation-delay: 0.05s; }
        .ft-seq > *:nth-child(3) { animation-delay: 0.08s; }
        .ft-seq > *:nth-child(4) { animation-delay: 0.11s; }
        .ft-seq > *:nth-child(5) { animation-delay: 0.14s; }
        .ft-seq > *:nth-child(6) { animation-delay: 0.17s; }
        .ft-seq > *:nth-child(7) { animation-delay: 0.20s; }
        .ft-seq > *:nth-child(n+8) { animation-delay: 0.22s; }

        /* --- カレンダーの日めくり。押した向きへ紙が送られるように --- */
        @keyframes ft-page-l { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes ft-page-r { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
        .ft-page-l { animation: ft-page-l 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-page-r { animation: ft-page-r 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* 選んだ日にちが、ぽんと前に出る */
        @keyframes ft-daypop { 0% { transform: scale(0.72); } 58% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .ft-daypop { animation: ft-daypop 0.34s cubic-bezier(0.34,1.3,0.5,1) backwards; }

        /* --- 果樹 --- */
        /* 画面に出るとき、根から立ち上がるように */
        @keyframes ft-grow { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: none; } }
        .ft-grow { animation: ft-grow 0.55s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* 収穫できるときだけ、木がゆっくり息をして「押せる」ことを伝える */
        @keyframes ft-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
        .ft-breathe { animation: ft-breathe 3.4s ease-in-out infinite; transform-origin: 50% 90%; }

        /* ============================================================
           文字の大きさ（小・中・大）
           クラス名ごとに大きさを上書きする形にしている。
           画面のあちこちに書かれた text-[…] を全部書き換えるのは現実的でなく、
           ここ1か所で切り替えられるほうが取り違えが起きない。
           **入力欄（.ft-input）は対象にしない。**
           16pxより小さいとiPhoneが勝手に画面を拡大してしまうため、常に16pxに固定する
           ============================================================ */
        .ft-input { font-size: 16px; }

        /* 文字の大きさ「中」。小さい字はしっかり、もともと大きい見出しは控えめに増やす。
           全部を同じ倍率で拡げると、見出しが画面の幅に収まらなくなる */
        .ft-font-m .text-\\[11\\.5px\\] { font-size: 13px; }
        .ft-font-m .text-\\[12\\.5px\\] { font-size: 14px; }
        .ft-font-m .text-\\[13\\.5px\\] { font-size: 15.5px; }
        .ft-font-m .text-\\[14\\.5px\\] { font-size: 16.5px; }
        .ft-font-m .text-\\[15\\.5px\\] { font-size: 17.5px; }
        .ft-font-m .text-\\[16px\\] { font-size: 17px; }
        .ft-font-m .text-\\[17px\\] { font-size: 18.5px; }
        .ft-font-m .text-\\[18px\\] { font-size: 19.5px; }
        .ft-font-m .text-\\[20px\\] { font-size: 21.5px; }
        .ft-font-m .text-\\[24px\\] { font-size: 26px; }
        .ft-font-m .text-\\[26px\\] { font-size: 28px; }
        .ft-font-m .text-\\[27px\\] { font-size: 29px; }
        .ft-font-m .text-\\[28px\\] { font-size: 30px; }

        /* 文字の大きさ「大」。小さい字はしっかり、もともと大きい見出しは控えめに増やす。
           全部を同じ倍率で拡げると、見出しが画面の幅に収まらなくなる */
        .ft-font-l .text-\\[11\\.5px\\] { font-size: 15px; }
        .ft-font-l .text-\\[12\\.5px\\] { font-size: 16px; }
        .ft-font-l .text-\\[13\\.5px\\] { font-size: 17.5px; }
        .ft-font-l .text-\\[14\\.5px\\] { font-size: 19px; }
        .ft-font-l .text-\\[15\\.5px\\] { font-size: 20px; }
        .ft-font-l .text-\\[16px\\] { font-size: 18.5px; }
        .ft-font-l .text-\\[17px\\] { font-size: 20px; }
        .ft-font-l .text-\\[18px\\] { font-size: 21px; }
        .ft-font-l .text-\\[20px\\] { font-size: 23.5px; }
        .ft-font-l .text-\\[24px\\] { font-size: 28px; }
        .ft-font-l .text-\\[26px\\] { font-size: 30.5px; }
        .ft-font-l .text-\\[27px\\] { font-size: 31.5px; }
        .ft-font-l .text-\\[28px\\] { font-size: 32.5px; }

        /* --- 下からせり上がる小窓 ---
           高さは dvh（いま実際に見えている高さ）で決めること。
           vh は iPhone だとブラウザの帯を含んだ高さになるため、
           画面より下に伸びてしまい、いちばん下のボタンが見えなくなる */
        /* margin: 0 は必ず付けること。
           小窓を「縦に間隔をあける入れ物（space-y-*）」の中に置くと、
           位置を決める指定とは別に外側の余白が足され、画面ぶんだけ下へずれる。
           探すの絞り込みで、いちばん下のボタンが隠れる原因になっていた */
        .ft-sheet-wrap { position: fixed; left: 0; right: 0; top: 0; height: 100vh; margin: 0; }
        .ft-sheet-box  { max-height: 82vh; }
        @supports (height: 100dvh) {
          .ft-sheet-wrap { height: 100dvh; }
          .ft-sheet-box  { max-height: 82dvh; }
        }
        /* 中の「一覧」の場所。**flex-1 を使わないこと。**
           flex-1 は基準の高さが0なので、まわりに余りが無いと高さ0までつぶれ、
           タグの札が途中で切れて見える。基準を中身ぶんにしたうえで、
           はみ出すときだけ縮んでスクロールするようにしている */
        .ft-sheet-body { flex: 1 1 auto; min-height: 0; }

        /* --- 「？」の吹き出し --- */
        @keyframes ft-tip { from { opacity: 0; transform: translateY(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
        .ft-tip { animation: ft-tip 0.16s cubic-bezier(0.22,1,0.36,1) backwards; }
        @keyframes ft-tip-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-3px); } }
        .ft-tip-out { animation: ft-tip-out 0.2s ease-in forwards; }

        /* --- テーマ色を選んだときのチェック --- */
        @keyframes ft-check-in { 0% { opacity: 0; transform: scale(0) rotate(-45deg); } 100% { opacity: 1; transform: none; } }
        .ft-check-in { animation: ft-check-in 0.3s cubic-bezier(0.34,1.5,0.5,1) backwards; }

        /* ============================================================
           動きを止めるとき
           ・端末側の「視差効果を減らす」設定
           ・カスタマイズ画面の「動きの演出」を切ったとき（.ft-still）
           止めるのは動きだけ。読み込み中のくるくる（.spin）は残す
           ============================================================ */
        .ft-still *:not(.spin), .ft-still *:not(.spin)::before, .ft-still *:not(.spin)::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .ft-still .ft-sparkle { animation: none !important; opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .ft-root *:not(.spin), .ft-root *:not(.spin)::before, .ft-root *:not(.spin)::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .ft-root .ft-sparkle { animation: none !important; opacity: 1; transform: none; }
        }

        :root{
          --th-50:#F0FDFA; --th-100:#CCFBF1; --th-200:#99F6E4; --th-300:#5EEAD4;
          --th-600:#0D9488; --th-700:#0F766E; --th-800:#115E59; --th-900:#134E4A;
        }

        /* テーマカラー。--th-* を差し替えると配色が一括で変わる */
        .bg-th-50{background-color:var(--th-50)} .bg-th-100{background-color:var(--th-100)}
        .bg-th-600{background-color:var(--th-600)} .bg-th-700{background-color:var(--th-700)}
        .bg-th-800{background-color:var(--th-800)} .bg-th-900{background-color:var(--th-900)}
        .bg-th-50\\/40{background-color:color-mix(in srgb, var(--th-50) 40%, transparent)}
        .hover\\:bg-th-50:hover{background-color:var(--th-50)} .hover\\:bg-th-100:hover{background-color:var(--th-100)}
        .hover\\:bg-th-800:hover{background-color:var(--th-800)} .hover\\:bg-th-900:hover{background-color:var(--th-900)}
        .text-th-700{color:var(--th-700)} .text-th-800{color:var(--th-800)} .text-th-900{color:var(--th-900)}
        .text-th-800\\/70{color:color-mix(in srgb, var(--th-800) 70%, transparent)}
        .hover\\:text-th-900:hover{color:var(--th-900)}
        .border-th-200{border-color:var(--th-200)} .border-th-300{border-color:var(--th-300)}
        .border-th-700{border-color:var(--th-700)} .border-th-800{border-color:var(--th-800)} .border-th-900{border-color:var(--th-900)}
        .border-th-700\\/25{border-color:color-mix(in srgb, var(--th-700) 25%, transparent)}
        .border-th-700\\/30{border-color:color-mix(in srgb, var(--th-700) 30%, transparent)}
        .border-th-700\\/35{border-color:color-mix(in srgb, var(--th-700) 35%, transparent)}
        .border-th-700\\/40{border-color:color-mix(in srgb, var(--th-700) 40%, transparent)}
        .focus\\:border-th-800:focus{border-color:var(--th-800)}
        .focus\\:ring-th-800\\/20:focus{box-shadow:0 0 0 4px color-mix(in srgb, var(--th-800) 20%, transparent)}
        .focus-within\\:border-th-800:focus-within{border-color:var(--th-800)}
        .focus-within\\:ring-th-800\\/20:focus-within{box-shadow:0 0 0 4px color-mix(in srgb, var(--th-800) 20%, transparent)}
        .accent-th-700{accent-color:var(--th-700)} .accent-th-800{accent-color:var(--th-800)}
        .from-th-700{--tw-gradient-from:var(--th-700);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
        .to-th-900{--tw-gradient-to:var(--th-900)}
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-lg lg:max-w-5xl mx-auto min-h-screen relative bg-neutral-50">
        {/* 入れ物は透明度だけで切り替える。ここで位置を動かすと、中の sticky なヘッダがぶれる */}
        <div key={tab} className="ft-tabswap">
        {tab === "home" && <HomeScreen records={records} prefs={prefs} onOpenBackup={() => setBackupOpen(true)} garden={garden} onStartCycle={() => setPickFruit(true)} onHarvest={harvestFruit} />}
        {tab === "record" && <RecordScreen records={records} onOpenDetail={openDetail} onStartReading={openNewReading} />}
        {tab === "search" && <SearchScreen records={records} setRecords={setRecords} openDetail={openDetail} allKnownTags={knownTags} />}
        {tab === "progress" && <ProgressScreen records={records} onOpenDetail={openDetail} onOpenBook={openBook} onOpenDay={setViewingDay} />}
        </div>

        {/* ＋は動く入れ物の外に置く。中に入れると、切り替えの動きの間だけ
            位置の基準がその入れ物になり、上から落ちてくるように見えてしまう */}
        {tab === "record" && (
          <button onClick={openNew} aria-label="新しい記録を追加"
            className="fixed bottom-24 right-5 z-20 w-16 h-16 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab">
            <Plus size={30} />
          </button>
        )}

        <BottomNav active={tab} onChange={setTab} />

        {viewingDay && (
          <DayRecordsScreen date={viewingDay} records={records} onClose={closeDay} onOpenDetail={openDetailFromBook} />
        )}
        {viewingBook && (
          <BookRecordsScreen book={viewingBook} records={records} onClose={closeBook} onOpenDetail={openDetailFromBook} />
        )}

        {viewing && (
          /* **ここに key を付けないこと。**
             一度 key={viewing.id} を付けたところ、保存したあとに閲覧画面が
             二重に残り、戻るたびに同じ画面が出てくる不具合になった。
             （並んだきょうだいの中で、ひとつだけ key を持たせると起きる）
             出てくる向きの動きは from の切り替えでやり直されるので、key は要らない */
          <RecordDetailScreen record={viewing} allRecords={records} onClose={closeDetail} onEdit={editFromDetail}
            onOpenDetail={openDetail} onToggleMark={toggleMark} from={viewingFrom} />
        )}

        {draftSaved && <DraftDialog draft={draftSaved} onResume={resumeDraft} onDiscard={discardDraft} names={typeDesc.name} />}

        {typePick && <TypePickSheet onPick={startNewOfType} onCancel={() => setTypePick(false)} descs={typeDesc.desc} names={typeDesc.name} />}

        {editing && (
          <RecordForm key={editing.id} initial={isNew ? null : editing} draft={isNew ? editing : null}
            onSave={handleSave} onCancel={closeForm} onDelete={handleDelete}
            allRecords={records} onQuickMemorize={handleQuickMemorize} captions={captions}
            onAutoDraft={handleAutoDraft} typeLocked={typeLocked}
            knownTags={knownTags} onCreateTag={addTagToMaster} />
        )}

        {dupState && (
          <DuplicateDialog existing={dupState.existing}
            onRegister={() => { const p = dupState.pending; const from = dupState.fromForm; setDupState(null); commitSaveOrAdd(p); if (from) closeForm(); }}
            onViewExisting={() => { const ex = dupState.existing; setDupState(null); setIsNew(false); setEditing(ex); }}
            onCancel={() => setDupState(null)} />
        )}

        {backupOpen && <BackupScreen records={records} artworks={artworks} garden={garden} tagMaster={tagMaster}
          prefs={prefs} captions={captions} typeDesc={typeDesc} onClose={() => setBackupOpen(false)} onRestore={handleRestore} onBackedUp={markBackedUp} />}

        {artOpen && <ArtworkScreen artworks={artworks} onChange={saveArtworks} captions={captions} onSaveCaptions={saveCaptions} prefs={prefs} onSavePrefs={savePrefs} onClose={() => setArtOpen(false)} typeDesc={typeDesc} onSaveTypeDesc={saveTypeDesc} />}

        {bookmarkOpen && <BookmarkScreen records={records} onClose={() => setBookmarkOpen(false)} onOpenDetail={openDetail} />}

        {tagsOpen && <TagManageScreen tags={knownTags} records={records}
        onAdd={addTagToMaster} onRename={renameTag} onDelete={deleteTag}
        onClose={() => setTagsOpen(false)} />}
      {helpOpen && <HelpScreen onClose={() => setHelpOpen(false)} />}
      {gardenOpen && <GardenScreen garden={garden} records={records} onClose={() => setGardenOpen(false)} onChangeFruit={plantFruit} />}

        {pickFruit && (
          <FruitPickDialog
            title="育てる実を選ぶ"
            note="時間をかけて、ひとつの実を育てます。"
            current={garden.cycle ? garden.cycle.fruit : FRUITS[0].key}
            onPick={plantFruit}
            onCancel={() => setPickFruit(false)}
          />
        )}

        {harvestOf && (
          <HarvestDialog
            fruit={harvestOf}
            onReplant={() => { setHarvestOf(null); setPickFruit(true); }}
            onLater={() => setHarvestOf(null)}
          />
        )}


        <SideMenu
          open={menuOpen}
          instant={menuInstant}
          onClose={() => { setMenuInstant(false); setMenuOpen(false); }}
          items={[
            {
              label: "画面のカスタマイズ",
              desc: "テーマカラー・イラスト・ひとこと",
              icon: <ImagePlus size={20} />,
              onClick: () => goFromMenu(() => setArtOpen(true)),
            },
            {
              label: "ブックマーク",
              desc: `${records.filter((r) => r.bookmarked).length}件の記録`,
              icon: <Bookmark size={20} />,
              onClick: () => goFromMenu(() => setBookmarkOpen(true)),
            },
            {
              label: "収穫した実",
              desc: garden.cycle
                ? `${fruitByKey(garden.cycle.fruit).label}を育てています・収穫 ${(garden.harvests || []).length}個`
                : "記録を重ねて実を育てる",
              icon: <Sparkles size={20} />,
              onClick: () => goFromMenu(() => setGardenOpen(true)),
            },
            {
              label: "タグの整理",
              desc: (knownTags.length ? `${knownTags.length}個のタグ` : "タグの追加・名前の変更・削除"),
              icon: <BookMarked size={20} />,
              onClick: () => goFromMenu(() => setTagsOpen(true)),
            },
            {
              label: "バックアップ",
              desc: "記録とイラストの保存",
              icon: <Download size={20} />,
              badge: unsavedNow,
              onClick: () => goFromMenu(() => setBackupOpen(true)),
            },
          ]}
          footer={
            /* さりげなく置きつつ、押す場所は行いっぱいに広げてある。
               気づいたときに指がどこに当たっても開けるように */
            <TapButton onClick={() => goFromMenu(() => setHelpOpen(true))}
              className="w-full flex items-center gap-3 -my-1 py-2 rounded-xl text-left hover:bg-neutral-50 ft-tap-card">
              <Mascot seed="menu" size={48} className="shrink-0" />
              <span className="flex-1 min-w-0 text-[14.5px] font-bold text-neutral-700">使い方を見る</span>
              <ChevronRight size={18} className="text-neutral-400 shrink-0" />
            </TapButton>
          }
        />
      </div>
    </div>
    </MenuContext.Provider>
    </TypeNameContext.Provider>
    </UnsavedContext.Provider>
    </PrefsContext.Provider>
    </ArtworkContext.Provider>
  );
}
