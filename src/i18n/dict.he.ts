// src/i18n/dict.he.ts
export const DICT_HE: Record<string, string> = {
  // -----------------------------------------
  // Learn - Common
  // -----------------------------------------
  'learn.common.childLabel': 'משתמש:',
  'learn.common.back': 'חזרה',
  'learn.common.backOk': '✅ חזרה',
  'learn.common.unitNotFound': 'היחידה לא נמצאה',

  'learn.layer.empty.noContent': 'אין יחידות עדיין.',

  // -----------------------------------------
  // Learn - Flow / State
  // -----------------------------------------
  'learn.flow.invalidState': 'LearnFlow: invalid state',

  // -----------------------------------------
  // Learn - Groups (Legacy screen name kept)
  // -----------------------------------------
  'learn.groups.title': 'לימודי בסיס',
  'learn.groups.subtitle': 'בוחרים נושא, ואז רואים בפנים מה פתוח ומה נעול.',
  'learn.groups.progressLabel': 'התקדמות:',
  'learn.groups.unitsLabel': 'יחידות',
  'learn.groups.noUnitsYet': 'אין יחידות עדיין',
  'learn.groups.buttonLocked': '🔒 נעול',
  'learn.groups.buttonEnter': 'כניסה →',
  'learn.groups.locked.noUnits': 'אין יחידות בקבוצה',
  'learn.groups.locked.prereq': 'נעול עד שמסיימים את הדרישות המקדימות',
  'learn.groups.locked.layer': 'נפתח החל משכבה {layer}',
  'learn.groups.partial.layer': 'יחידות נוספות ייפתחו בשכבה {layer}',
  'learn.groups.currentLayer': 'שכבה נוכחית: {layer}',

  // -----------------------------------------
  // Learn - Layer screens
  // -----------------------------------------
  'learn.layer.header': 'שכבה {n}',
  'learn.layer.0.title': 'התמצאות ורגשות',
  'learn.layer.0.desc': 'היכרות ראשונית: ברכות פשוטות וזיהוי רגשות.',
  'learn.layer.1.title': 'הקשבה וצלילים',
  'learn.layer.1.desc': 'ביצוע הוראות קצרות וזיהוי צלילים.',
  'learn.layer.2.title': 'אוצר מילים בסיסי',
  'learn.layer.2.desc': 'בונים מילים יומיומיות ומתחילים חבילות עניין.',
  // Layer 3 now includes both letters + numbers
  'learn.layer.3.title': 'אותיות ומספרים',
  'learn.layer.3.desc': 'אותיות גדולות/קטנות + מספרים בסיסיים.',
  'learn.layer.4.title': 'זיהוי מוקדם',
  'learn.layer.4.desc': 'מילות ראייה וזיהוי מוקדם (ללא כתיבה חופשית).',

  // -----------------------------------------
  // Learn - Units list
  // -----------------------------------------
  'learn.units.title': 'יחידות לימוד',
  'learn.units.subtitle':
    'בחר יחידה ללימוד. אחרי שסיימת לראות את כל הפריטים — הבוחן נפתח.',
  'learn.units.tipLockedToday':
    'טיפ: אפשר ללחוץ תרגול במסך הבוחן כדי לחזק, ולנסות שוב מחר.',
  'learn.units.tooltip.learnLocked': 'צריך להשלים יחידות קודמות לפני לימוד',
  'learn.units.tooltip.lockedByLayer': 'נפתח החל משכבה {layer}',
  'learn.units.tooltip.quizDailyLimit': 'הבוחן ננעל אחרי 3 ניסיונות עד מחר',

  'learn.units.toast.quizLockedToday': '🔒 הבוחן נעול עד סוף היום',
  'learn.units.toast.lockedByLayer': '🔒 נפתח החל משכבה {layer}',
  'learn.units.toast.quizOpensAfterLearn': '🧠 הבוחן נפתח אחרי שמסיימים לימוד',
  'learn.units.toast.unitLocked': '🔒 היחידה עדיין נעולה',

  'learn.units.learn.start': '▶️ התחל לימוד',
  'learn.units.learn.continue': '⏩ המשך לימוד',
  'learn.units.learn.review': '🔁 חזור על לימוד',
  'learn.units.learn.lockedByLayer': '🔒 נעול',

  'learn.units.quiz.start': '🧠 התחל בוחן',
  'learn.units.quiz.retry': '🏁 בוחן חוזר',
  'learn.units.quiz.lockedToday': '🔒 בוחן נעול היום',
  'learn.units.quiz.locked': '🔒 נעול',
  'learn.units.quiz.finishLearnFirst': '🔒 בוחן (סיים לימוד קודם)',
  'learn.units.quiz.lockedByLayer': '🔒 נעול (נפתח משכבה {layer})',

  'learn.units.status.locked': '🔒 נעול (צריך להשלים יחידות קודמות)',
  'learn.units.status.lockedByLayer': '🔒 נעול עד שכבה {layer}',
  'learn.units.status.learnProgress': '📚 לימוד: {seen}/{total}',
  'learn.units.status.quizLockedToday':
    '🔒 הבוחן נעול עד סוף היום (3 ניסיונות)',
  'learn.units.status.readyForQuiz': '🧠 מוכן לבוחן (PASS {pass}%+)',
  'learn.units.status.completedBest': '🏁 הושלם • Best: {best}%',

  'learn.units.locked.layerTitle': 'נעול לפי שכבת הרמה',
  'learn.units.locked.layerDesc':
    'הנושא הזה נפתח החל משכבה {layer}. המשיכו לתרגל שכבות קודמות.',

  // -----------------------------------------
  // Learn - Unit Learn screen
  // -----------------------------------------
  'learn.learn.titleFallback': 'לימוד',
  'learn.learn.confirmExit':
    'עוד לא סיימנו 😊\nההתקדמות נשמרת, אבל בטוח שרוצים לצאת?',
  'learn.learn.noItemsTitle': 'אין פריטים ביחידה',
  'learn.learn.noItemsSubtitle': 'אין פריטים ביחידה (אולי חסר בקטלוג).',
  'learn.learn.doneTitle': 'כל הכבוד! 🎉',
  'learn.learn.doneSubtitle': 'סיימת את הלימוד: {title}',
  'learn.learn.buttonReview': '🔁 חזרה על היחידה',
  'learn.learn.buttonGoQuiz': '🧠 מעבר לבוחן',
  'learn.learn.buttonBackToUnits': 'חזרה ליחידות',
  'learn.learn.toastHeard': 'שמענו ✅',
  'learn.learn.toastNext': 'ממשיכים…',
  'learn.learn.buttonHear': '🔊 שמע',
  'learn.learn.buttonNext': '➡️ הבא',
  'learn.learn.tooltipNeedHear': 'קודם נשמע לפחות פעם אחת 😊',
  'learn.learn.tip': 'טיפ: אפשר ללחוץ "שמע" שוב אם רוצים.',

  // -----------------------------------------
  // Learn - Quiz screen
  // -----------------------------------------
  'learn.quiz.titleFallback': 'בוחן',
  'learn.quiz.titleShort': 'בוחן',
  'learn.quiz.lockedTodayTitle': '🔒 הבוחן נעול להיום',
  'learn.quiz.lockedTodayAttempts': 'עשית כבר {attempts}/3 ניסיונות היום',
  'learn.quiz.lockedTodayHint':
    'אפשר לתרגל את מה שטעית בו, ולנסות שוב מחר (או שהורה יפתח).',
  'learn.quiz.buttonPractice': '🧩 תרגול',
  'learn.quiz.notEnoughItemsTitle': 'אין מספיק פריטים',
  'learn.quiz.notEnoughItemsSubtitle':
    'אין מספיק פריטים לבוחן (או שחסרים בקטלוג).',
  'learn.quiz.passedTitle': '🎉 אלופים!',
  'learn.quiz.unitLabel': 'יחידה: {title}',
  'learn.quiz.failedTitle': '💪 כמעט!',
  'learn.quiz.failedSubtitle': 'בוא נתרגל או ננסה שוב 🙂',
  'learn.quiz.attemptsToday': 'ניסיונות היום: {attempts}/3{willLock}',
  'learn.quiz.willLockSuffix': ' • הבוחן ננעל להיום',
  'learn.quiz.buttonPracticeWrong': '🧩 תרגול על מה שטעיתי',
  'learn.quiz.buttonRetryNow': '🔁 נסה שוב עכשיו',
  'learn.quiz.hearAndChoose': '🎧 שמע ובחר',
  'learn.quiz.buttonHear': '🔊 שמע',
  'learn.quiz.scoreLine': 'Score: {correct}/{done}',
  'learn.quiz.toastCoins': 'כל הכבוד! קיבלת {bonus} מטבעות',

  // -----------------------------------------
  // Learn - Practice screen
  // -----------------------------------------
  'learn.practice.titleFallback': 'תרגול',
  'learn.practice.titleShort': 'תרגול',
  'learn.practice.notEnoughTitle': 'אין עדיין מספיק פריטים לתרגול',
  'learn.practice.notEnoughSubtitle': 'אין מספיק פריטים כדי ליצור תרגול כרגע.',
  'learn.practice.doneTitle': '🧩 סיימנו תרגול!',
  'learn.practice.doneFocused': 'תרגלנו בעיקר את מה שטעית בו היום ✅',
  'learn.practice.doneGeneral': 'תרגלנו את היחידה ✅',
  'learn.practice.correctLine': '{correct}/{total} נכון',
  'learn.practice.buttonTryQuiz': '🧠 נסה בוחן',
  'learn.practice.subtitleFocused': 'נתרגל את מה שטעית בו היום',
  'learn.practice.subtitleGeneral': 'נתרגל את היחידה',

  // -----------------------------------------
  // Child Hub
  // -----------------------------------------
  'childHub.title': 'מרכז הילד',
  'childHub.greeting': 'היי {name} 👋',
  'childHub.startLearning': '📚 התחל ללמוד',
  'childHub.specialPacks': '✨ חבילות מיוחדות',
  'childHub.games': '🎮 משחקים',
  'childHub.iconShop': '🛍️ חנות אייקונים',
  'childHub.changeIcon': 'שנה אייקון',
  'childHub.show': 'הצג',
  'childHub.hide': 'הסתר',
  'childHub.iconNotUnlocked': 'האייקון הזה עדיין לא פתוח.',
  'childHub.iconSelected': 'האייקון נבחר!',

  // -----------------------------------------
  // Games Hub
  // -----------------------------------------
  'gamesHub.title': 'משחקים',
  'gamesHub.header': '🎮 משחקים (בקרוב)',
  'gamesHub.intro': 'משחקים קצרים לתרגול מילים ותמונות יהיו כאן.',
  'gamesHub.badge': 'בקרוב',
  'gamesHub.game1.title': 'התאמת מילה ↔ תמונה',
  'gamesHub.game1.desc':
    'לוחצים על מילה כדי לשמוע, ומחברים בקו לתמונה המתאימה.',
  'gamesHub.game2.title': 'זיכרון תמונות',
  'gamesHub.game2.desc': 'מוצאים זוגות תואמים של תמונות/מילים.',
  'gamesHub.game3.title': 'מצא את התמונה',
  'gamesHub.game3.desc':
    'שומעים מילה ובוחרים את התמונה הנכונה מתוך כמה אפשרויות.',

  // -----------------------------------------
  // Special Packs (hub + units shells)
  // -----------------------------------------
  'specialPacks.title': 'חבילות מיוחדות',
  'specialPacks.noneSelected':
    'עדיין לא נבחרו חבילות מיוחדות. בקשו מהורה להוסיף!',
  'specialPacks.enter': 'כניסה',

  'specialPackUnits.title': 'קבוצות',
  'specialPackUnits.wordCount': '{count} מילים',
  'specialPackUnits.learn': 'לימוד',
  'specialPackUnits.quiz': 'בוחן',
  'specialPackUnits.noGroups': 'אין עדיין קבוצות.',
  'specialPackUnits.packFallback': 'חבילה',
  'specialPackUnits.packNotFound': 'החבילה לא נמצאה.',

  'specialPackUnit.title': '{mode}',
  'specialPackUnit.wordsInGroup': 'מילים בקבוצה: {count}',
  'specialPackUnit.v4NavOnly': 'V4 הוא שלד ניווט בלבד.',
  'specialPackUnit.futureReal': 'מסך לימוד/בוחן אמיתי יגיע בגרסה עתידית.',
  'specialPackUnit.soonHere': 'בקרוב: מסך {mode} אמיתי יופיע כאן.',
  'specialPackUnit.titleLearn': 'לימוד',
  'specialPackUnit.titleQuiz': 'בוחן',

  // -----------------------------------------
  // Content labels (Packs / Groups)
  // -----------------------------------------
  'content.pack.foundations.title': 'יסודות',
  'content.pack.foundations.desc':
    'המילים הראשונות: שלום/ביי, כן/לא, ורגשות בסיסיים.',
  'content.group.orientation.title': 'היכרות',
  'content.group.emotions.title': 'רגשות',

  'content.pack.listening.title': 'הקשבה וצלילים',
  'content.pack.listening.desc': 'הקשב והגב: פעולות פשוטות ומילות קשב.',
  'content.group.sounds_actions.title': 'פעולות',
  'content.group.classroom_attention.title': 'קשב',

  'content.pack.colors.title': 'צבעים',
  'content.pack.colors.desc':
    'צבעים לרמת Beginner: תשובות חזותיות בלבד, ללא צורך בקריאה באנגלית.',
  'content.group.colors_basics.title': 'צבעים – בסיס',
  'content.group.colors_neutrals.title': 'צבעים – ניטרלי',
  'content.group.colors_fun.title': 'צבעים – כיף',

  'content.pack.numbers.title': 'מספרים',
  'content.pack.numbers.desc': 'לומדים לומר ולזהות מספרים (שמיעה → סימן).',

  // Space (official localization example)
  'content.pack.space.title': 'חלל',
  'content.pack.space.desc': 'יסודות החלל: לומדים מילים לפי שמיעה ואייקונים.',
  'content.group.space_basics.title': 'חלל – בסיס',

  // Animals (Core)
  'content.pack.animals.title': 'חיות',
  'content.pack.animals.desc': 'חיות בסיסיות (חווה, ים, ג׳ונגל).',
  'content.group.animals_farm.title': 'חיות – חווה',
  'content.group.animals_sea.title': 'חיות – ים',
  'content.group.animals_jungle.title': 'חיות – ג׳ונגל',

  // -----------------------------------------
  // Beginner Track (Groups & Units)
  // -----------------------------------------
  'beginner.group.numbers.title': 'מספרים',
  'beginner.group.numbers.desc': 'לומדים לומר ולזהות מספרים (שמיעה → סימן).',
  'beginner.group.letters.title': 'אותיות',
  'beginner.group.letters.desc': 'לומדים לזהות אותיות (שמיעה → סימן).',

  // Numbers units (new split)
  'beginner.unit.numbers_1_5.title': 'מספרים 1–5',
  'beginner.unit.numbers_6_10.title': 'מספרים 6–10',
  'beginner.unit.numbers_11_15.title': 'מספרים 11–15',
  'beginner.unit.numbers_16_20.title': 'מספרים 16–20',
  'beginner.unit.numbers_21_25.title': 'מספרים 21–25',
  'beginner.unit.numbers_26_30.title': 'מספרים 26–30',

  // Numbers units (legacy keys kept for safety)
  'beginner.unit.numbers_1_10.title': 'מספרים 1–10',
  'beginner.unit.numbers_11_20.title': 'מספרים 11–20',
  'beginner.unit.numbers_21_30.title': 'מספרים 21–30',

  // Numbers advanced
  'beginner.unit.tens_10_50.title': 'עשרות (10–50)',
  'beginner.unit.tens_60_90.title': 'עשרות (60–90)',
  'beginner.unit.tens_10_90.title': 'עשרות (10–90)',
  'beginner.unit.hundreds_100_900.title': 'מאות (100–900)',
  'beginner.unit.thousands_1000_9000.title': 'אלפים (1000–9000)',

  // Letters units
  'beginner.unit.letters_a_f.title': 'אותיות A–F',
  'beginner.unit.letters_g_l.title': 'אותיות G–L',
  'beginner.unit.letters_m_r.title': 'אותיות M–R',
  'beginner.unit.letters_s_z.title': 'אותיות S–Z',

  // -----------------------------------------
  // Parent - Common
  // -----------------------------------------
  'parent.common.back': 'חזרה',
  'parent.common.open': 'פתח',
  'parent.common.savedOk': 'נשמר ✅',

  // -----------------------------------------
  // Parent - Home
  // -----------------------------------------
  'parent.home.title': 'מצב הורה',
  'parent.home.languageTitle': 'שפת ממשק',
  'parent.home.language.en': 'אנגלית',
  'parent.home.language.he': 'עברית',

  'parent.home.firstChildHint': 'טיפ: שפת הלימוד של {name} תלויה ברמה שנבחרה.',
  'parent.home.noChildrenHint': 'אין עדיין ילדים. אפשר ליצור במסך "משתמשים".',

  'parent.home.progressTitle': 'התקדמות',
  'parent.home.progressSubtitle': 'צפה מה כל ילד סיים',

  'parent.home.childSettingsTitle': 'הגדרות ילד',
  'parent.home.childSettingsSubtitle': 'ערוך רמה, חבילות והעדפות',

  'parent.home.usersTitle': 'משתמשים',
  'parent.home.usersSubtitle': 'הוסף / מחק ילדים',

  'parent.home.pinTitle': 'קוד הורה',
  'parent.home.pinSubtitle': 'שנה או בטל את מחסום הקוד',

  // -----------------------------------------
  // Parent Gate (PIN entry)
  // -----------------------------------------
  'parent.gate.title': 'מצב הורה',
  'parent.gate.subtitle': 'הכניסו PIN כדי להיכנס למסכי ההורה',
  'parent.gate.button.show': 'הצג',
  'parent.gate.button.hide': 'הסתר',
  'parent.gate.button.enter': 'כניסה',
  'parent.gate.lockedInfo': 'נעול זמנית: עוד {seconds} שניות',
  'parent.gate.error.locked': 'נעול זמנית. נסו שוב בעוד {seconds} שניות.',
  'parent.gate.error.minDigits': 'הכניסו לפחות 4 ספרות.',
  'parent.gate.error.tooManyAttempts': 'יותר מדי ניסיונות. ננעלתם לדקה אחת.',
  'parent.gate.error.wrongPin': 'PIN שגוי. נשארו {left} ניסיונות.',

  // -----------------------------------------
  // Parent - Users
  // -----------------------------------------
  'parent.users.title': 'משתמשים',

  // UserList (component)
  'parent.users.list.title': 'משתמשים',
  'parent.users.list.add': '➕ הוספת ילד…',
  'parent.users.list.empty': 'אין עדיין ילדים.',
  'parent.users.row.edit': 'עריכה',
  'parent.users.row.delete': 'מחיקה',

  // Users screen errors
  'parent.users.error.nameRequired': 'צריך להזין שם.',
  'parent.users.error.nameExists': 'שם כזה כבר קיים.',

  // Users modals
  'parent.users.modal.addTitle': 'הוספת ילד',
  'parent.users.modal.addHint': 'הקלידו שם לילד (לדוגמה: נועה).',
  'parent.users.modal.addPlaceholder': 'שם הילד',

  'parent.users.modal.renameTitle': 'שינוי שם לילד',
  'parent.users.modal.renameHint': 'שינוי שם עבור {name}',
  'parent.users.modal.renamePlaceholder': 'שם חדש',

  'parent.users.modal.deleteTitle': 'למחוק את הילד?',
  'parent.users.modal.deleteHint':
    'המחיקה תסיר את {name} ותאפס את ההתקדמות שלו.',

  // Users buttons
  'parent.users.button.cancel': 'ביטול',
  'parent.users.button.add': 'הוסף',
  'parent.users.button.save': 'שמור',
  'parent.users.button.delete': 'מחק',

  // -----------------------------------------
  // Parent - Progress
  // -----------------------------------------
  'parent.progress.title': 'התקדמות',
  'parent.progress.childLabel': 'משתמש:',
  'parent.progress.backToGroups': '← חזרה לקבוצות',

  'parent.progress.recommendationTitle': 'המלצה לרמה A',
  'parent.progress.reco.complete': 'רמה A הושלמה. כל הכבוד!',
  'parent.progress.reco.readyForNext': 'מוכן לפתוח שכבה {layer}.',
  'parent.progress.reco.practiceLayer': 'המשיכו לתרגל שכבה {layer}.',

  'parent.progress.currentLayer': 'שכבה נוכחית: {layer}',
  'parent.progress.suggestedNextLayer': 'שכבה מומלצת הבאה: {layer}',
  'parent.progress.focusPacks': 'חבילות מיקוד: {packs}',

  'parent.progress.noChildSelected': 'לא נבחר ילד.',
  'parent.progress.noGroupSelected': 'לא נבחרה קבוצה.',

  // Progress – Groups
  'parent.progress.groups.completed': 'הושלמו: {completed}/{total}',
  'parent.progress.completed': 'הושלמו: {done}/{total}',

  // Progress – Units screen
  'parent.progress.units.backToGroups': '← חזרה לקבוצות',
  'parent.progress.units.resetAll': '♻️ איפוס כל ההתקדמות',
  'parent.progress.units.confirmResetAll': 'לאפס את כל ההתקדמות של הילד?',
  'parent.progress.units.toastResetAllDone': 'איפוס כל ההתקדמות ✅',
  // legacy/alternate key kept
  'parent.progress.units.toast.resetAllDone': 'איפוס כל ההתקדמות ✅',

  'parent.progress.units.passInfo':
    'PASS בבוחן: {pass}% • נעילה אחרי 3 ניסיונות ביום',
  'parent.progress.units.policyLine':
    'PASS בבוחן: {pass}% • נעילה אחרי 3 ניסיונות ביום',

  'parent.progress.units.toast.unlockedQuizToday': 'שחררתי בוחן (היום) ✅',
  'parent.progress.units.toast.resetAttemptsToday': 'איפסתי ניסיונות (היום) ✅',

  'parent.progress.units.status.locked': '🔒 נעול',
  'parent.progress.units.status.learn': '📚 לימוד ({seen}/{total})',
  'parent.progress.units.status.quiz': '🧠 מוכן לבוחן ({seen}/{total})',
  'parent.progress.units.status.quizReady': '🧠 מוכן לבוחן ({seen}/{total})',
  'parent.progress.units.status.completed': '🏁 הושלם ({best}%)',

  'parent.progress.units.attemptsToday': 'ניסיונות היום: {attempts}/3',
  'parent.progress.units.lockedToday': '🔒 נעול היום',
  'parent.progress.units.lockedTodaySuffix': ' • 🔒 נעול היום',

  'parent.progress.units.unlockQuizToday': '🔓 שחרור בוחן (היום)',
  'parent.progress.units.resetAttemptsToday': '🧼 איפוס ניסיונות (היום)',

  'parent.progress.units.action.unlockQuizToday': '🔓 שחרור בוחן (היום)',
  'parent.progress.units.action.resetAttemptsToday': '🧼 איפוס ניסיונות (היום)',

  'parent.progress.units.toastUnlockQuizToday': 'שחררתי בוחן (היום) ✅',
  'parent.progress.units.toastResetAttemptsToday': 'איפסתי ניסיונות (היום) ✅',

  'parent.progress.units.noActions': '(אין פעולות הורה ליחידה הזו כרגע)',

  // -----------------------------------------
  // Parent - Child Settings (new + legacy editor keys kept)
  // -----------------------------------------
  'parent.childSettings.title': 'הגדרות ילד',
  'parent.childSettings.selectChildTitle': 'בחירת ילד',
  'parent.childSettings.selectedLabel': 'נבחר:',
  'parent.childSettings.levelTitle': 'רמה',
  'parent.childSettings.currentLabel': 'נוכחי:',
  'parent.childSettings.interestPacksTitle': 'חבילות עניין',
  'parent.childSettings.interestPacksSubtitle':
    'חבילות אופציונליות למוטיבציה. חבילות הליבה תמיד פעילות.',
  'parent.childSettings.pack.enabled': 'מופעל',
  'parent.childSettings.pack.enable': 'הפעל',
  'parent.childSettings.noInterestPacks': 'אין עדיין חבילות עניין זמינות.',

  // Legacy editor keys (kept for safety)
  'parent.childEditor.title': 'הגדרות ילד',
  'parent.childEditor.selectChild': 'בחירת ילד',
  'parent.childEditor.selected': 'נבחר:',
  'parent.childEditor.level': 'רמה',
  'parent.childEditor.current': 'נוכחי:',
  'parent.childEditor.interestPacks.title': 'חבילות עניין (מוטיבציה)',
  'parent.childEditor.interestPacks.subtitle':
    'חבילות אופציונליות לילד. חבילות חובה תמיד פעילות.',
  'parent.childEditor.interestPacks.enable': 'הפעל',
  'parent.childEditor.interestPacks.enabled': 'מופעל',
  'parent.childEditor.interestPacks.empty': 'אין עדיין חבילות עניין זמינות.',

  // -----------------------------------------
  // Parent - PIN Settings
  // -----------------------------------------
  'parent.pin.title': 'קוד הורה',
  'parent.pin.hint': 'בחרו קוד חדש (לפחות 4 ספרות).',
  'parent.pin.placeholder': 'קוד חדש (4+ ספרות)',
  'parent.pin.error.minDigits': 'קוד הורה חייב להיות לפחות 4 ספרות.',
  'parent.pin.toast.saved': 'נשמר ✅',
  'parent.pin.toast.reset': 'אופס ✅',

  // Multiple key variants used across versions (kept)
  'parent.pin.statusLabel': 'סטטוס:',
  'parent.pin.status.label': 'סטטוס:',

  'parent.pin.status.set': 'קוד הורה מוגדר',
  'parent.pin.status.none': 'אין קוד הורה מוגדר',
  'parent.pin.status.notSet': 'אין קוד מוגדר',

  'parent.pin.input.placeholder': 'קוד חדש (4+ ספרות)',
  'parent.pin.button.save': 'שמירה',
  'parent.pin.button.reset': 'איפוס',
  'parent.pin.button.cancel': 'ביטול',
  'parent.pin.button.resetConfirm': 'איפוס',

  'parent.pin.reset.title': 'לאפס קוד?',
  'parent.pin.reset.desc': 'זה יאפס את הקוד לברירת מחדל 1234.',
  'parent.pin.reset.cancel': 'ביטול',
  'parent.pin.reset.confirm': 'איפוס',

  'parent.pin.toast.tooShort': 'הקוד חייב להיות לפחות 4 ספרות ⚠️',

  'parent.pin.modal.resetTitle': 'לאפס קוד הורה?',
  'parent.pin.modal.resetDesc': 'זה יאפס את הקוד לברירת מחדל 1234.',
  'parent.home.audioTitle': 'הגדרות שמע',
  'parent.home.audioSubtitle': 'קול, מהירות ואפקטים',
  'parent.audio.title': 'הגדרות שמע',
  'parent.audio.ttsTitle': 'דיבור (TTS)',
  'parent.audio.speedTitle': 'מהירות דיבור',
  'parent.audio.voiceTitle': 'קול',
  'parent.audio.voiceAuto': 'אוטומטי (לפי שפה)',
  'parent.audio.voiceHint':
    'הרשימה תלויה בדפדפן/מכשיר. אם אין קולות זמינים, בחר אוטומטי.',
  'parent.audio.fxTitle': 'אפקטים (FX)',
  'parent.audio.testButton': 'השמע דוגמה',
  'parent.audio.sampleText': 'שלום! זהו משפט בדיקה.',
  'parent.audio.speedSlow': 'איטי',
  'parent.audio.speedNormal': 'רגיל',
  'parent.audio.on': 'פעיל',
  'parent.audio.off': 'כבוי',

  // ✅ V11.4 — per-child audio
  'parent.childAudio.buttonOpen': 'שמע לילד',
  'parent.childAudio.title': '{name} — שמע',
  'parent.childAudio.modeTitle': 'מצב הגדרות',
  'parent.childAudio.modeGlobal': 'ברירת מחדל',
  'parent.childAudio.modeOverride': 'הגדרה אישית',
  'parent.childAudio.modeGlobalHint':
    'הילד משתמש בהגדרות השמע הכלליות של ההורה.',
  'parent.childAudio.modeOverrideHint':
    'הגדרות אישיות לילד זה בלבד (מחליף ברירת מחדל).',
  'parent.childAudio.disabledBecauseGlobal': 'כדי לערוך, עבור ל"הגדרה אישית".',
  'parent.childAudio.effectiveTitle': 'הגדרות בפועל (תצוגה)',
  'parent.childAudio.effective.tts': 'TTS פעיל',
  'parent.childAudio.effective.speed': 'מהירות',
  'parent.childAudio.effective.voice': 'קול',
  'parent.childAudio.effective.fx': 'FX פעיל',
  'parent.childAudio.voiceAuto': 'אוטומטי',
  'parent.childAudio.resetButton': 'איפוס לברירת מחדל',
  'parent.childAudio.resetOk': 'איפוס לברירת מחדל בוצע',
  'parent.childAudio.saveButton': 'שמירה',

    // -----------------------------------------
  // Aliases (expo-router / native shells) — keep legacy keys working
  // -----------------------------------------

  // Child hub (new keys used in native screens)
  'child.hub.title': 'מרכז הילד',
  'child.hub.learn': '📚 התחל ללמוד',
  'child.hub.rewards': '🛍️ תגמולים',
  'child.hub.specialPacks': '✨ חבילות מיוחדות',
  'child.hub.games': '🎮 משחקים',

  // Parent home (new keys used in native screens)
  'parent.home.childrenCount': 'מספר ילדים: {n}',

  'parent.home.progress': 'התקדמות',
  'parent.home.childSettings': 'הגדרות ילד',
  'parent.home.manageChildren': 'משתמשים',
  'parent.home.audio': 'הגדרות שמע',
  'parent.home.pin': 'קוד הורה',
'parent.home.nativeShellNote':
  'הערה: ממשק ההורה המלא עדיין זמין בווב. המסך הזה בנייטיב הוא שלד ניווט מינימלי.',
'parent.audio.nativeShellNote':
  'ממשק הגדרות השמע של ההורה זמין כרגע בווב. גרסת נייטיב תגיע בהמשך.',
'parent.childAudio.nativeShellNote':
  'הגדרות שמע מותאמות לילד זמינות כרגע בווב. גרסת נייטיב תגיע בהמשך.',
  // -----------------------------------------
  // Parent - PIN Settings (Native / V11.4+)
  // -----------------------------------------
  'parent.pin.statusTitle': 'סטטוס',
  'parent.pin.status.loading': 'טוען…',
  'parent.pin.status.enabled': 'פעיל',
  'parent.pin.status.disabled': 'כבוי',

  'parent.pin.setTitle': 'הגדרת קוד',
  'parent.pin.changeTitle': 'שינוי קוד',

  'parent.pin.currentHint': 'קוד נוכחי',
  'parent.pin.currentPlaceholder': 'הזן קוד נוכחי',

  'parent.pin.newHint': 'קוד חדש',
  'parent.pin.newPlaceholder': 'הזן קוד חדש (מינימום 4 ספרות)',

  'parent.pin.confirmHint': 'אישור קוד חדש',
  'parent.pin.confirmPlaceholder': 'הזן שוב את הקוד החדש',

  'parent.pin.clear': 'איפוס',
  'parent.pin.save': 'שמירה',
  'parent.pin.saveChange': 'שמירה',

  'parent.pin.toast.cleared': 'הקוד אופס',
  'parent.pin.error.currentWrong': 'הקוד הנוכחי שגוי',
  'parent.pin.error.currentWrongToClear': 'כדי לאפס צריך להזין קוד נוכחי נכון',
  'parent.pin.error.newTooShort': 'הקוד החדש חייב להיות לפחות 4 ספרות',
  'parent.pin.error.confirmMismatch': 'האישור לא תואם לקוד החדש',
  'learn.common.ok': 'אישור',
  'learn.common.cancel': 'ביטול',
  'learn.common.confirm': 'אישור',
  'learn.learn.confirmExitTitle': 'רגע לפני שיוצאים…',

};
