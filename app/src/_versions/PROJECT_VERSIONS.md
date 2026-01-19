# 📘 Project Versions — Unified History & Decisions

מסמך זה מאגד את **כל הגרסאות V1–V11.4** של הפרויקט, כולל:

- מטרות
- החלטות מוצר שננעלו
- תשתיות לוגיות ונתוניות
- נקודות יציבות (Stable / Locked)
- הקשר ברור בין גרסאות

המסמך משמש כ־**Source of Truth היסטורי** ומיועד:

- להמשך פיתוח
- handoff לצ’אטים/צוותים עתידיים
- מניעת רגרסיות וחזרות אחורה

---

## 📑 תוכן עניינים

1. V1 – Foundations  
   1.1 V1-structure  
   1.2 V1-learn-polish  
   1.3 V1-rewards-shop
2. V2 – Content Foundation
3. V3 – Bridge Content to V1
4. V4 – Interest Learning & Games Hub
5. V5.5 – Stable Infrastructure
6. V6 – Planning (Level A / Beginner)
7. V7 – Level A Logic & Data Foundation
8. V8 – Learning Navigation & UX (Layers-First)
9. V9 – Learn Cleanup & Parent i18n
10. V10 – Level A Content Expansion
11. V11 – Audio · Visual · Engagement

- V11.1 Audio Migration
- V11.2 Parent Audio Settings
- V11.3 Audio Runtime Improvements
- V11.4 Per-Child Audio Overrides

---

## V1 — Foundations

### V1-structure 🔒

**מטרה:** נעילת מבנה פרויקט יציב לפני פיתוח פיצ’רים.

**ננעל:**

- מבנה תיקיות (screens / learn / parent / child / content / audio וכו’)
- Learn Flow בסיסי
- ChildrenStore כ־source of truth

⛔ אין לבצע ריפקטור מבני ללא גרסה ייעודית.

---

### V1-learn-polish

**מטרה:** ליטוש זרימת Learn / Quiz / Practice ללא שינוי ארכיטקטורה.

**עקרונות:**

- UX ברור לילד
- אין שינוי API בין מסכים
- enforcement של 3 ניסיונות ביום

---

### V1-rewards-shop

**מטרה:** מערכת מוטיבציה מבוססת coins.

**ננעל:**

- Icon Shop
- רכישה עם coins
- icon פעיל אחד לילד
- ללא השפעה על gameplay

---

## V2 — Content Foundation 🔒

**מטרה:** תשתית תוכן סקלבילית ללא UI.

**ננעל:**

- Pack / Group / Unit / ContentItem
- Policy לפי Level (Beginner)
- Validation + Compatibility checks

**הערה:** Learn Flow עדיין לא “מודע” ל־Packs.

---

## V3 — Bridge Content to V1 🔒

**מטרה:** חיבור Opt-in של Content Foundation למסלול Beginner הקיים.

**ננעל:**

- beginnerTrack כ־adapter בלבד
- Core Packs מול Interest Packs
- Start Learning מציג רק מסלול בסיס

---

## V4 — Interest Learning & Games Hub 🔒

**מטרה:** הרחבת Child Hub.

**ננעל:**

- Interest Packs כ־Hub נפרד
- Games Hub כ־placeholder
- ללא שינוי ב־Start Learning

---

## V5.5 — Stable Infrastructure 🔒

**מטרה:** ייצוב מלא אחרי שינויים עמוקים.

**תוקן:**

- i18n (HE/EN, RTL/LTR)
- איחוד ContentItem
- החזרת TTS
- תיקון באג קריטי של לולאה כפולה בלמידה

📌 נקודת יציבות רשמית לפרויקט.

---

## V6 — Planning (Level A / Beginner)

**מטרה:** תכנון מוצרי ללא קוד.

**הוגדר:**

- Beginner = ילד שאינו קורא אנגלית
- שפת UI ≠ שפת לימוד
- שכבות 0–4 בתוך Level A
- Core Packs מול Interest Packs
- סוגי משחקים לפי שכבה

---

## V7 — Level A Logic & Data Foundation 🔒

**מטרה:** סגירת כל הלוגיקה והמדיניות של Level A.

**ננעל:**

- Layers 0–4 בפועל
- Gating מלא לפי שכבה
- Progress + Recommendation (ללא auto-level-up)
- Content Packs כ־Source of Truth

---

## V8 — Learning Navigation & UX (Layers-First) 🔒

**מטרה:** פישוט UX של הלמידה.

**ננעל:**

- LearnHomeScreen (שכבות בלבד)
- LearnLayerScreen (קבוצות לשכבה אחת)
- חזרה היררכית ברורה

⚠️ UX זמני אך יציב.

---

## V9 — Learn Cleanup & Parent i18n 🔒

**מטרה:** ניקוי legacy ויישור קו הורה/ילד.

**ננעל:**

- Beginner Track = מקור אמת
- learnNavigationA.ts = VM יחיד
- i18n מלא, ללא hardcoded strings
- Parent Progress תואם Learn

---

## V10 — Level A Content Expansion 🔒

**מטרה:** מילוי תוכן אמיתי (ללא שינוי UX).

**כולל:**

- Foundations, Sounds, Colors, Numbers, Letters
- Interest Pack: Space
- התאמות TTS לילדים

---

## V11 — Audio · Visual · Engagement

### V11.1 — Audio Migration 🔒

מעבר מלא מ־`src/tts` ל־`src/audio`.

---

### V11.2 — Parent Audio Settings 🔒

מסך הורה לשליטה גלובלית:

- Voice / Speed / TTS / FX
- Persistence

---

### V11.3 — Audio Runtime Improvements 🔒

- stopTTS אוטומטי
- FX hooks
- debounce ל־“שמע”

---

### V11.4 — Per-Child Audio Overrides 🔒

**מטרה:** שליטה פר ילד.

**ננעל:**

- audioProfile ב־ChildProfile
- effectiveAudioSettings לפי ילד
- UI הורה ייעודי
- מוכן ל־V12 (Auth + Sync)

---

## 🧭 סטטוס סופי

- ✅ Level A יציב, מדורג, ומוכן להרחבה
- ✅ Audio Layer גמיש (global + per-child)
- 🔒 V1–V11.4 ננעלו

**הגרסה הבאה:**  
**V12 — Auth, Sync & Parent Account**
