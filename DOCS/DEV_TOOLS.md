# Dev Mode Tools

מסמך זה מתאר כלים שמיועדים **לפיתוח בלבד** (DEV) כדי לבדוק תוכן/שכבות בלי לשבור Policy אמיתי.

---

## 1) Force unlock layer (Level A)

### למה זה קיים?

בחלק מה-Packs יש `minLayer` גבוה (למשל Numbers ב-layer 2).
כשעובדים עם ילד חדש (layer 0) אי אפשר להיכנס לתוכן כדי לבדוק אותו.

לכן יש **Dev override** שמאפשר לקבוע שכבה פתוחה ידנית — רק ב-DEV.

---

### איך מפעילים (Console)

פתח DevTools → Console והריץ:

```js
localStorage.setItem('dev.levelA.unlockedLayer', '4');
location.reload();
```

דוגמאות:

'2' כדי לפתוח עד שכבה 2

'4' כדי לפתוח הכל

איך מבטלים (Console)
localStorage.removeItem('dev.levelA.unlockedLayer');
location.reload();

הערות חשובות

זה עובד רק ב-DEV (import.meta.env.DEV).

אין לזה UI ואין לזה השפעה בפרודקשן.

המפתח נשמר ב-localStorage, לכן הוא ממשיך גם אחרי רענון עד שמוחקים אותו.

Key reference

localStorage key: dev.levelA.unlockedLayer

location: src/content/policy/levelA/unlock.ts

אם תרצה, אפשר גם להוסיף שורה קצרה ב־`DOCS/ADDING_A_PACK.md` שמזכירה את זה כטיפ בדיקות (אבל הייתי משאיר את זה בקובץ נפרד כדי לא לערבב “תוכן” עם “כלי פיתוח”).
