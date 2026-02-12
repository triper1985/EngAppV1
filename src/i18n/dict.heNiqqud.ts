// src/i18n/dict.heNiqqud.ts
/**
 * Hebrew with Niqqud (child-only override)
 * ----------------------------------------
 * This dictionary is used ONLY in child UI (Beginner), to ensure readable Hebrew.
 * Parent UI never uses niqqud (even in Hebrew).
 *
 * Add keys gradually as you verify they look and sound right.
 */
export const DICT_HE_NIQQUD: Record<string, string> = {
  // Common (child-facing)
  'learn.common.back': 'חֲזָרָה',
  'learn.common.backOk': '✅ חֲזָרָה',
  'learn.common.cancel': 'בִּטּוּל',
  'learn.common.confirm': 'אִישּׁוּר',
  'learn.common.next': 'הַבָּא',
  'learn.common.start': 'הַתְחָלָה',
  'learn.common.ok': 'אוֹקֵיי',
  'learn.common.childLabel': 'מִשְׁתַּמֵּשׁ:',
  'learn.common.unitNotFound': 'הַיְּחִידָה לֹא נִמְצְאָה',
  // Learn (unit screen)
  'learn.learn.buttonHear': '🎤 שְׁמַע',
  'learn.learn.buttonHearHe': '🇮🇱 בְּעִבְרִית',
  'learn.learn.buttonNext': 'הַבָּא ➡️',
  'learn.learn.tip': 'טִיפּ: אֶפְשָׁר לִלְחֹץ "שְׁמַע" שׁוּב אִם רוֹצִים.',


  // Child Hub
  'childHub.title': 'מֶרְכַּז הַיֶּלֶד',
  'childHub.greeting': 'הַיֵּי {name} 👋',
  'childHub.startLearning': '📚 הַתְחֵל לִלְמוֹד',
  'childHub.games': '🎮 מִשְׂחָקִים',
  'childHub.iconShop': '🛍️ חֲנוּת אִיקוֹנִים',
  'childHub.specialPacks': '✨ חֲבִילוֹת מְיֻחָדוֹת',
  'childHub.changeIcon': 'שַׁנֵּה אִיקוֹן',
  'childHub.show': 'הַצֵּג',
  'childHub.hide': 'הַסְתֵּר',
  'childHub.iconSelected': 'הָאִיקוֹן נִבְחַר!',
  'childHub.iconNotUnlocked': 'הָאִיקוֹן הַזֶּה עֲדַיִן לֹא פָּתוּחַ.',

  // Learn / Layers
  'learn.groups.title': 'לִמּוּדֵי בָּסִיס',
  'learn.groups.subtitle': 'בּוֹחֲרִים נוֹשֵׂא, וְאָז רוֹאִים בִּפְנִים מָה פָּתוּחַ וּמָה נָעוּל.',
  'learn.groups.progressLabel': 'הִתְקַדְּמוּת:',
  'learn.groups.unitsLabel': 'יְחִידוֹת לִמּוּד',

  // Learn Units
  'learn.units.title': 'יְחִידוֹת לִמּוּד',
  'learn.units.subtitle':
    'בְּחַר יְחִידָה לִלְמוֹד. אַחֲרֵי שֶׁסִּיַּמְתָּ לִרְאוֹת אֶת כָּל הַפְּרִיטִים — הַבֹּחַן נִפְתָּח.',
  'learn.units.tipLockedToday': 'טִיפּ: אֶפְשָׁר לִלְחוֹץ "שְׁמַע" שׁוּב אִם רוֹצִים.',
  'learn.units.tooltip.learnLocked': 'צָרִיךְ לְהַשְׁלִים יְחִידוֹת קוֹדְמוֹת לִפְנֵי לִמּוּד',
  'learn.units.tooltip.lockedByLayer': 'נִפְתָּח הַחֵל מִשְּׁכָבָה {layer}',
  'learn.units.tooltip.quizDailyLimit': 'הַבֹּחַן נִנְעָל אַחֲרֵי 3 נִסָּיוֹנוֹת עַד מָחָר',
  'learn.units.toast.quizLockedToday': '🔒 הַבֹּחַן נָעוּל עַד סוֹף הַיּוֹם',
  'learn.units.toast.lockedByLayer': '🔒 נִפְתָּח הַחֵל מִשְּׁכָבָה {layer}',
  'learn.units.toast.quizOpensAfterLearn': '🧠 הַבֹּחַן נִפְתָּח אַחֲרֵי שֶׁמְּסַיְּמִים לִמּוּד',
  'learn.units.toast.unitLocked': '🔒 הַיְּחִידָה עֲדַיִן נָעוּלָה',
  'learn.units.learn.start': '▶️ הַתְחֵל לִמּוּד',
  'learn.units.learn.continue': '⏩ הַמְשֵׁךְ לִמּוּד',
  'learn.units.learn.review': '🔁 חֲזֹר עַל לִמּוּד',
  'learn.units.learn.lockedByLayer': '🔒 נָעוּל',
  'learn.units.quiz.start': '🧠 הַתְחֵל בֹּחַן',
  'learn.units.quiz.retry': '🏁 בֹּחַן חוֹזֵר',
  'learn.units.quiz.lockedToday': '🔒 בֹּחַן נָעוּל הַיּוֹם',
  'learn.units.quiz.locked': '🔒 נָעוּל',
  'learn.units.quiz.finishLearnFirst': '🔒 בֹּחַן (סַיֵּם לִמּוּד קוֹדֶם)',
  'learn.units.quiz.lockedByLayer': '🔒 נָעוּל (נִפְתָּח מִשְּׁכָבָה {layer})',
  'learn.units.status.locked': '🔒 נָעוּל (צָרִיךְ לְהַשְׁלִים יְחִידוֹת קוֹדְמוֹת)',
  'learn.units.status.lockedByLayer': '🔒 נָעוּל עַד שְׁכָבָה {layer}',
  'learn.units.status.learnProgress': '📚 לִמּוּד: {seen}/{total}',
  'learn.units.status.quizLockedToday': '🔒 בֹּחַן נָעוּל הַיּוֹם',
  'learn.units.status.readyForQuiz': '🧠 מוּכָן לַבֹּחַן (PASS {pass}%+)',
  'learn.units.status.completedBest': '🏁 הוּשְׁלַם • Best: {best}%',
  'learn.units.locked.layerTitle': 'נָעוּל לְפִי שְׁכָבָה',
  'learn.units.locked.layerDesc': 'הַיְּחִידָה תִּפָּתַח כְּשֶׁתַּגִּיעַ לַשְּׁכָבָה הַנְּכוֹנָה.',
  'learn.groups.noUnitsYet': 'אֵין יְחִידוֹת עֲדַיִן.',
  'learn.groups.buttonLocked': 'נָעוּל',
  'learn.groups.buttonEnter': 'כְּנִיסָה →',
  'learn.groups.locked.noUnits': 'אֵין יְחִידוֹת עֲדַיִן.',
  'learn.groups.locked.prereq': 'הַשְּׁלֵם יְחִידוֹת קוֹדְמוֹת כְּדֵי לִפְתֹּחַ.',
  'learn.groups.locked.layer': 'נָעוּל עַד שֶׁתַּסִּיֵּם אֶת שְׁכָבָה {n}.',
  'learn.groups.partial.layer': 'כִּמְעַט! הַמְשֵׁךְ בְּשְׁכָבָה {n}.',
  'learn.groups.currentLayer': 'זוֹ הַשְּׁכָבָה הַנּוֹכְחִית שֶׁלְּךָ.',

  'learn.layer.header': 'שְׁכָבָה {n}',
  'learn.layer.empty.noContent': 'אֵין יְחִידוֹת עֲדַיִן.',

  'learn.layer.0.title': 'הִתְמַצְּאוּת וּרְגָשׁוֹת',
  'learn.layer.0.desc': 'הַכָּרוּת רִאשׁוֹנִית: בְּרָכוֹת פְּשׁוּטוֹת וְזִהוּי רְגָשׁוֹת.',
  'learn.layer.1.title': 'הַקְשָׁבָה וּצְלִילִים',
  'learn.layer.1.desc': 'בִּצּוּעַ הוֹרָאוֹת קְצָרוֹת וְזִהוּי צְלִילִים.',
  'learn.layer.2.title': 'אוֹצַר מִלִּים בְּסִיסִי',
  'learn.layer.2.desc': 'בּוֹנִים מִלִּים יוֹמְיוֹמִיּוֹת וּמַתְחִילִים חֲבִילוֹת עִנְיָן.',
  'learn.layer.3.title': 'אוֹתִיּוֹת וּמִסְפָּרִים',
  'learn.layer.3.desc': 'אוֹתִיּוֹת גְּדוֹלוֹת + מִסְפָּרִים בְּסִיסִיִּים.',
  'learn.layer.4.title': 'זִהוּי מֻקְדָּם',
  'learn.layer.4.desc': 'מִלּוֹת רְאִיָּה וְזִהוּי מֻקְדָּם (לְלֹא כְּתִיבָה חָפְשִׁית).',

  // Units list
  // Quiz
  'learn.quiz.titleShort': 'בֹּחַן',
  'learn.quiz.titleFallback': 'בֹּחַן',
  'learn.quiz.unitLabel': 'יְחִידָה: {title}',
  'learn.quiz.hearAndChoose': '🎧 שְׁמַע וּבְחַר',
  'learn.quiz.buttonHear': '🔊 שְׁמַע',
  'learn.quiz.buttonHearHe': '🇮🇱 בְּעִבְרִית',
  'learn.quiz.buttonPractice': '🧩 תִּרְגּוּל',
  'learn.quiz.buttonPracticeWrong': '🧩 תִּרְגּוּל עַל מַה שֶׁטָּעִיתִי',
  'learn.quiz.buttonRetryNow': '🔁 נַסֵּה שׁוּב עַכְשָׁיו',
  'learn.quiz.failedTitle': '💪 כִּמְעַט!',
  'learn.quiz.failedSubtitle': 'בּוֹא נִתְרַגֵּל אוֹ נְנַסֶּה שׁוּב 🙂',
  'learn.quiz.passedTitle': '🎉 אַלּוּפִים!',
  'learn.quiz.toastCoins': 'כָּל הַכָּבוֹד! קִבַּלְתָּ {bonus} מַטְבֵּעוֹת',
  'learn.quiz.attemptsToday': 'נִסָּיוֹנוֹת הַיּוֹם: {n}/3{willLock}',
  'learn.quiz.willLockSuffix': ' • הַבֹּחַן נִנְעָל לְהַיּוֹם',
  'learn.quiz.lockedTodayTitle': '🔒 הַבֹּחַן נָעוּל לְהַיּוֹם',
  'learn.quiz.lockedTodayAttempts': 'עָשִׂיתָ כְּבָר {n}/3 נִסָּיוֹנוֹת הַיּוֹם',
  'learn.quiz.lockedTodayHint':
    'אֶפְשָׁר לְתַרְגֵּל אֶת מַה שֶׁטָּעִיתָ בּוֹ, וְלְנַסּוֹת שׁוּב מָחָר (אוֹ שֶׁהוֹרֶה יִפְתַּח).',
  'learn.quiz.notEnoughItemsTitle': 'אֵין מַסְפִּיק פְּרִיטִים',
  'learn.quiz.notEnoughItemsSubtitle':
    'אֵין מַסְפִּיק פְּרִיטִים לַבֹּחַן (אוֹ שֶׁחֲסֵרִים בַּקָּטָלוֹג).',

  // Practice
  'learn.practice.titleShort': 'תִּרְגּוּל',
  'learn.practice.titleFallback': 'תִּרְגּוּל',
  'learn.practice.subtitleGeneral': 'נְתַרְגֵּל אֶת הַיְּחִידָה',
  'learn.practice.subtitleFocused': 'נְתַרְגֵּל אֶת מַה שֶׁטָּעִיתָ בּוֹ הַיּוֹם',
  'learn.practice.buttonTryQuiz': '🧠 נַסֵּה בֹּחַן',
  'learn.practice.correctLine': '{correct}/{total} נָכוֹן',
  'learn.practice.doneTitle': '🧩 סִיַּמְנוּ תִּרְגּוּל!',
  'learn.practice.doneGeneral': 'תִּרְגַּלְנוּ אֶת הַיְּחִידָה ✅',
  'learn.practice.doneFocused': 'תִּרְגַּלְנוּ בְּעִקָּר אֶת מַה שֶׁטָּעִיתָ בּוֹ הַיּוֹם ✅',
  'learn.practice.notEnoughTitle': 'אֵין עֲדַיִן מַסְפִּיק פְּרִיטִים לְתִרְגּוּל',
  'learn.practice.notEnoughSubtitle': 'אֵין מַסְפִּיק פְּרִיטִים כְּדֵי לִיצֹר תִּרְגּוּל כָּרֶגַע.',

  // Packs / Groups (child-facing) — with Niqqud
  'content.pack.animals.title': 'חַיּוֹת',
  'content.pack.animals.desc': 'חַיּוֹת בְּסִיסִיּוֹת (חַוָה, יָם, ג׳וּנְגֶל).',

  'content.pack.clothes.title': 'בְּגָדִים',
  'content.pack.clothes.desc': 'בְּגָדִים בְּסִיסִיִּים.',

  'content.pack.colors.title': 'צְבָעִים',
  'content.pack.colors.desc':
    'צְבָעִים לְרָמַת Beginner: תְּשׁוּבוֹת חֲזוּתִיּוֹת בִּלְבַד, לְלֹא צוֹרֶךְ בִּקְרִיאָה בְּאַנְגְּלִית.',

  'content.pack.early_recognition.title': 'זִיהוּי מֻקְדָּם',
  'content.pack.early_recognition.desc': 'זִיהוּי מָהִיר וְהַתְאָמָה חֲזוּתִית.',

  'content.pack.food.title': 'אֹכֶל',
  'content.pack.food.desc': 'אֹכֶל וּשְׁתִיָּה בְּסִיסִיִּים.',


  // Interest — Fun Food (New)
  'content.pack.food_fun.title': 'מַאֲכָלִים טְעִימִים',


  'content.pack.foundations.title': 'יְסוֹדוֹת',
  'content.pack.foundations.desc':
    'הַמִּלִּים הָרִאשׁוֹנוֹת: שָׁלוֹם/בַּיי, כֵּן/לֹא, וּרְגָשׁוֹת בְּסִיסִיִּים.',

  'content.pack.home.title': 'בַּבַּיִת',
  'content.pack.home.desc': 'דְּבָרִים נְפוּצִים בַּבַּיִת.',

  'content.pack.letter_words.title': 'אוֹת → מִלָּה',
  'content.pack.letter_words.desc': 'חִבּוּר בֵּין אוֹת לְמִלָּה (A → Apple).',

  'content.pack.listening.title': 'הַקְשָׁבָה וְצְלִילִים',
  'content.pack.listening.desc': 'הַקְשֵׁב וְהַגֵּב: פְּעוּלוֹת פְּשׁוּטוֹת וּמִלּוֹת קֶשֶׁב.',

  'content.pack.numbers.title': 'מִסְפָּרִים',
  'content.pack.numbers.desc': 'לוֹמְדִים לוֹמַר וּלְזַהוֹת מִסְפָּרִים (שְׁמִיעָה → סִימָן).',

  'content.pack.space.title': 'חָלָל',


  'content.pack.toys.title': 'צַעֲצוּעִים',
  'content.pack.toys.desc': 'צַעֲצוּעִים וּמִשְׂחָקִים.',

  'content.pack.transport.title': 'תַּחְבּוּרָה',
  'content.pack.transport.desc': 'דְּרָכִים לָנוּעַ מִמָּקוֹם לְמָקוֹם.',

  'content.group.animals_farm.title': 'חַיּוֹת – חַוָה',
  'content.group.animals_jungle.title': 'חַיּוֹת – ג׳וּנְגֶל',
  'content.group.animals_sea.title': 'חַיּוֹת – יָם',

  'content.group.classroom_attention.title': 'קֶשֶׁב',
  'content.group.clothes.title': 'בְּגָדִים',

  'content.group.colors_basics.title': 'צְבָעִים – בָּסִיס',
  'content.group.colors_fun.title': 'צְבָעִים – כֵּיף',
  'content.group.colors_neutrals.title': 'צְבָעִים – נֵיטְרָלִי',

  'content.group.early_recognition_directions.title': 'כִּוּוּנִים',
  'content.group.early_recognition_faces.title': 'פָּנִים',
  'content.group.early_recognition_shapes.title': 'צוּרוֹת דּוֹמוֹת',

  'content.group.emotions.title': 'רְגָשׁוֹת',
  'content.group.food.title': 'אֹכֶל',
  'content.group.food_fun_treats.title': 'מַאֲכָלִים מְפַנְּקִים',
  'content.group.home.title': 'בַּבַּיִת',
  'content.group.letter_words.title': 'אוֹת → מִלָּה',
  'content.group.orientation.title': 'הִכָּרוּת',
  'content.group.sounds_actions.title': 'פְּעוּלוֹת',
  'content.group.space_basics.title': 'חָלָל – בָּסִיס',
  'content.group.toys.title': 'צַעֲצוּעִים',
  'content.group.transport.title': 'תַּחְבּוּרָה',
  // Added: Units/Buttons/Beginner unit titles
  'learn.learn.tooltipNeedHear': 'קֹדֶם נִשְׁמַע לְפָחוֹת פַּעַם אַחַת 😊',
  'beginner.unit.letters_a_f.title': 'אוֹתִיּוֹת A–F',
  'beginner.unit.letters_g_l.title': 'אוֹתִיּוֹת G–L',
  'beginner.unit.letters_m_r.title': 'אוֹתִיּוֹת M–R',
  'beginner.unit.letters_s_z.title': 'אוֹתִיּוֹת S–Z',
  'beginner.unit.numbers_1_5.title': 'מִסְפָּרִים 1–5',
  'beginner.unit.numbers_6_10.title': 'מִסְפָּרִים 6–10',
  'beginner.unit.numbers_11_15.title': 'מִסְפָּרִים 11–15',
  'beginner.unit.numbers_16_20.title': 'מִסְפָּרִים 16–20',
  'beginner.unit.numbers_21_25.title': 'מִסְפָּרִים 21–25',


  // -----------------------------------------
  // Rewards / Icon Shop (Child - Niqqud)
  // -----------------------------------------
  'rewards.shop.screenTitle': "חֲנוּת אֵיקוֹנִים",
  'rewards.shop.childLabel': "יֶלֶד",
  'rewards.shop.coinsPill': "מַטְבְּעוֹת: {coins}",
  'rewards.shop.tab.shop': "חֲנוּת",
  'rewards.shop.tab.owned': "שֶׁלִּי",
  'rewards.toast.notEnoughCoins': "אֵין מַסְפִּיק מַטְבְּעוֹת.",
  'rewards.toast.purchaseFailed': "לֹא הִצְלַחְתִּי לְהַשְׁלִים אֶת הַקְּנִיָּה.",
  'rewards.toast.purchasedFor': "קָנִיתָ {label} בְּ־{price} מַטְבְּעוֹת!",
  'rewards.toast.unlocked': "פָּתַחְתָּ {label}!",
  'rewards.toast.notUnlocked': "הָאֵיקוֹן הַזֶּה עֲדַיִן לֹא פָּתוּחַ.",
  'rewards.toast.changeFailed': "לֹא הִצְלַחְתִּי לְהַחֲלִיף אֵיקוֹן.",
  'rewards.toast.iconSelected': "הָאֵיקוֹן נִבְחַר!",
  'rewards.shop.cardTitle': "חֲנוּת אֵיקוֹנִים",
  'rewards.shop.cardSubtitle': "פּוֹתְחִים אֵיקוֹנִים חֲדָשִׁים עִם מַטְבְּעוֹת",
  'rewards.shop.filter.all': "הַכֹּל ({count})",
  'rewards.shop.filter.canBuy': "אֶפְשָׁר לִקְנוֹת ({count})",
  'rewards.shop.filter.free': "חִנָּם",

  'rewards.shop.category.all': 'כָּל הַקַּטֶּגוֹרְיוֹת',
  'rewards.shop.category.animals': 'חַיּוֹת',
  'rewards.shop.category.space': 'חָלָל',
  'rewards.shop.category.sports': 'סְפּוֹרְט',
  'rewards.shop.category.food': 'אוֹכֶל',
  'rewards.shop.category.nature': 'טֶבַע',
  'rewards.shop.category.fantasy': 'פַנְטַזְיָה',
  'rewards.shop.category.faces': 'פָּנִים',
  'rewards.shop.category.objects': 'חֲפָצִים',
  'rewards.shop.info.allUnlocked': "🎉 כָּל הָאֵיקוֹנִים פְּתוּחִים!",
  'rewards.shop.info.noMatch': "אֵין מַשֶּׁהוּ שֶׁמַּתְאִים לַסִּנּוּן הַזֶּה.",
  'rewards.shop.priceLabel': "מְחִיר",
  'rewards.shop.price.free': "חִנָּם",
  'rewards.shop.price.coins': "{price} מַטְבְּעוֹת",
  'rewards.shop.action.getFree': "לָקַחַת חִנָּם",
  'rewards.shop.action.buy': "לִקְנוֹת",
  'rewards.shop.action.needMore': "חֲסֵרִים עוֹד {need}",
  'rewards.shop.info.notEnoughCoins': "אֵין מַסְפִּיק מַטְבְּעוֹת.",
  'rewards.shop.confirm.title': "אִשּׁוּר קְנִיָּה",
  'rewards.shop.confirm.price': "מְחִיר",
  'rewards.shop.confirm.coinsWord': "מַטְבְּעוֹת",
  'rewards.shop.confirm.afterPurchase': "אַחֲרֵי הַקְּנִיָּה:",
  'rewards.shop.confirm.cancel': "בִּטּוּל",
  'rewards.shop.confirm.buy': "קְנִיָּה",
  'rewards.picker.title': "בְּחִירַת אֵיקוֹן",
  'rewards.picker.subtitle': "בְּחַר אֵיקוֹן פָּתוּחַ",
  'rewards.picker.empty': "עֲדַיִן אֵין אֵיקוֹנִים פְּתוּחִים. לֵךְ לַחֲנוּת כְּדֵי לִפְתֹּחַ אֶת הָרִאשׁוֹן.",
  'rewards.picker.selected': "נִבְחַר:",


    // ======================
  // Layer 4 — Core Expansion
  // ======================
  'content.pack.l4_shapes.title': 'צוּרוֹת',
  'content.pack.l4_shapes.desc': 'זִיהוּי צוּרוֹת בְּסִיסִיּוֹת.',
  'beginner.unit.l4_shapes_basic.title': 'צוּרוֹת בְּסִיסִיּוֹת',
  'beginner.unit.l4_shapes_more.title': 'עוֹד צוּרוֹת',
  'content.pack.l4_directions.title': 'כִּוּוּנִים',
  'content.pack.l4_directions.desc': 'זִיהוּי כִּוּוּנִים וְחִצִּים.',
  'beginner.unit.l4_directions_basic.title': 'לְמַעְלָה / לְמַטָּה / יָמִין / שְׂמֹאל',
  'beginner.unit.l4_directions_diagonal.title': 'אַלְכְּסוֹן',
  'content.pack.l4_spatial.title': 'יַחֲסֵי מָקוֹם',
  'content.pack.l4_spatial.desc': 'הֲבָנַת יַחֲסֵי מָקוֹם פְּשׁוּטִים.',
  'beginner.unit.l4_spatial_inout.title': 'בִּפְנִים / בַּחוּץ',
  'beginner.unit.l4_spatial_relations.title': 'יַחֲסִים',
  'content.pack.l4_emotions.title': 'רְגָשׁוֹת',
  'content.pack.l4_emotions.desc': 'זִיהוּי רְגָשׁוֹת בְּסִיסִיִּים.',
  'beginner.unit.l4_emotions_basic.title': 'רְגָשׁוֹת בְּסִיסִיִּים',
  'beginner.unit.l4_emotions_more.title': 'עוֹד רְגָשׁוֹת',
  'content.pack.l4_symbols.title': 'סְמָלִים',
  'content.pack.l4_symbols.desc': 'זִיהוּי סְמָלִים נְפוֹצִים.',
  'beginner.unit.l4_symbols_yesno.title': 'כֵּן / לֹא',
  'beginner.unit.l4_symbols_controls.title': 'כַּפְתּוֹרִים',
  'beginner.unit.l4_symbols_math.title': 'פְּלוּס / מִינוּס',
  'content.pack.l4_patterns.title': 'דְּפוּסִים',
  'content.pack.l4_patterns.desc': 'מְצִיאַת מָה בָּא אַחֲרֵי בְּדְּפוּס.',
  'beginner.unit.l4_patterns_ab.title': 'דְּפוּס אַ-ב',
  'beginner.unit.l4_patterns_aba.title': 'דְּפוּס אַ-ב-אַ',
  'beginner.unit.l4_patterns_abc.title': 'דְּפוּס אַ-ב-ג',
  'beginner.unit.l4_patterns_aabb.title': 'דְּפוּס אַ-אַ-ב-ב',

  // ===== V12.3 Interest expansions =====
  'content.pack.food_fun.desc': 'פֵּרוֹת, יְרָקוֹת וְאַרוּחוֹת טְעִימוֹת.',
  'content.group.food_fun_fruits.title': 'אוֹכֶל – פֵּרוֹת',
  'content.group.food_fun_vegetables.title': 'אוֹכֶל – יְרָקוֹת',
  'content.group.food_fun_meals_snacks.title': 'אוֹכֶל – אֲרוּחוֹת וְחֲטִיפִים',

  'content.pack.space.desc': 'מִלִּים בְּסִיסִיּוֹת עַל חָלָל עִם אִיקוֹנִים וְשֶׁמַע.',
  'content.group.space_objects.title': 'חָלָל – גַּרְמֵי שָׁמַיִם',
  'content.group.space_tech.title': 'חָלָל – טֶכְנוֹלוֹגְיָה',

  'content.pack.animals_more.title': 'עוֹד חַיּוֹת',
  'content.pack.animals_more.desc': 'עוֹד חַיּוֹת לִלְמוֹד וּלְהַכִּיר.',
  'content.group.animals_more_pets.title': 'חַיּוֹת – בַּיִת',
  'content.group.animals_more_wild.title': 'חַיּוֹת – טֶבַע',

  'content.pack.transport_more.title': 'עוֹד תַּחְבּוּרָה',
  'content.pack.transport_more.desc': 'עוֹד דְּרָכִים לָנוּעַ וְלִנְסֹעַ.',
  'content.group.transport_more_land.title': 'תַּחְבּוּרָה – יַבָּשָׁה',
  'content.group.transport_more_air_sea.title': 'תַּחְבּוּרָה – אֲוִיר וְיָם',

  'content.pack.clothes_more.title': 'עוֹד בְּגָדִים',
  'content.pack.clothes_more.desc': 'עוֹד דְּבָרִים שֶׁאֶפְשָׁר לִלְבּוֹשׁ.',
  'content.group.clothes_more_basics.title': 'בְּגָדִים – עוֹד',

  'content.pack.home_more.title': 'הַבַּיִת שֶׁלִּי',
  'content.pack.home_more.desc': 'חֲדָרִים וַחֲפָצִים בַּבַּיִת.',
  'content.group.home_more_rooms.title': 'בַּיִת – חֲדָרִים',
  'content.group.home_more_things.title': 'בַּיִת – חֲפָצִים',

  'content.pack.jobs.title': 'מִקְצוֹעוֹת',
  'content.pack.jobs.desc': 'אֲנָשִׁים שֶׁעוֹזְרִים וְעוֹבְדִים.',
  'content.group.jobs_emergency.title': 'מִקְצוֹעוֹת – חֵרוּם',
  'content.group.jobs_community.title': 'מִקְצוֹעוֹת – קְהִילָּה',
  'content.group.jobs_build_fix.title': 'מִקְצוֹעוֹת – בְּנִיָּה וְתִקּוּן',

  'beginner.layer.0.title': 'יְסוֹדוֹת',
  'beginner.layer.1.title': 'הַקְשָׁבָה וּפְקוּדוֹת',
  'beginner.layer.2.title': 'אוֹצַר מִלִּים מוּחָשִׁי',
  'beginner.layer.3.title': 'סְמָלִים',
  'beginner.layer.4.title': 'מִיקְס וּמִשְׂחָק',
  'parent.progress.overallProgress': 'הִתְקַדְּמוּת כְּלָלִית: {layerName}',
  'parent.progress.viewing.layers': 'צְפִיָּה: שְׁכָבוֹת',
  'parent.progress.viewing.layer': 'צְפִיָּה: {layerName}',
  'parent.progress.viewing.interest': 'צְפִיָּה: חֲבִילוֹת עִנְיָן',
  'parent.progress.viewing.units': 'צְפִיָּה: {layerName} → {groupName}',
  'parent.progress.viewing.group': 'צְפִיָּה: {groupName}',
  'parent.progress.viewing.unitsInterest': 'צְפִיָּה: {groupName}',
  'parent.progress.backToPacks': 'חֲזָרָה לַחֲבִילוֹת',
  'parent.progress.units.backToPacks': 'חֲזָרָה',
  'parent.progress.packs.layerTitle': 'חֲבִילוֹת: {layerName}',

  // מִשְׂחָקִים (Playable)
  'gamesHub.play': 'שַׂחֵק',
  'gamesHub.gameListen.title': 'שְׁמַע וּבְחַר',
  'gamesHub.gameListen.desc': 'שׁוֹמְעִים מִלָּה וּבוֹחֲרִים אֶת הַתְּמוּנָה הַנְּכוֹנָה.',
  'gamesHub.gamePairs.title': 'זּוּגוֹת זִכָּרוֹן',
  'gamesHub.gamePairs.desc': 'הוֹפְכִים קְלָפִים וּמוֹצְאִים זּוּגוֹת תּוֹאֲמִים.',
  'gamesHub.gameTap.title': 'גַּע בַּתְּמוּנָה הַנְּכוֹנָה',
  'gamesHub.gameTap.desc': 'גַּע בַּתְּמוּנָה הַנְּכוֹנָה בִּמְהִירוּת.',
  'gamesHub.gamePhonics.title': 'צְלִילִים וְאוֹתִיּוֹת',
  'gamesHub.gamePhonics.desc': 'הַתְאָמַת אוֹת לְצְלִיל.',
// Games Hub — Locked state
  'gamesHub.locked.title': 'הַמִּשְׂחָקִים נְעוּלִים',
  'gamesHub.locked.desc': 'סַיֵּם אֶת שְׁכָבָה 2 כְּדֵי לִפְתֹּחַ מִשְׂחָקִים.',
  'gamesHub.locked.cta': 'לֵךְ לִלְמוֹד',

  // מִשְׂחָקִים (Common)
  'games.common.playAgain': 'שַׂחֵק שׁוּב',
  'games.common.back': 'חֲזָרָה',
  'games.common.restart': 'הַתְחֵל מֵחָדָשׁ',
  'games.common.wellDone': 'כָּל הַכָּבוֹד! 🎉',
  'games.common.tryAgain': 'נַסֵּה שׁוּב',
  'games.common.correct': 'נָכוֹן!',
  'games.common.completed': 'הֻשְׁלַם',
  'games.common.empty': 'אֵין עֲדַיִן פְּרִיטִים',
  'games.matching.title': 'הַתְאָמַת זּוּגוֹת',
  'games.matching.prompt': 'מְצָא אֶת הַזּוּגוֹת הַתּוֹאֲמִים',
  'games.listening.title': 'שְׁמַע וּבְחַר',
  'games.listening.prompt': 'שְׁמַע וּבְחַר אֶת הַתְּמוּנָה הַנְּכוֹנָה',
  'games.listening.repeat': 'שְׁמַע שׁוּב',


  'learn.learn.toastCoins': "הִרְוַחְתָּ {bonus} מַטְבְּעוֹת!",
  'learn.practice.coinsLine': "הִרְוַחְתָּ {bonus} מַטְבְּעוֹת!",
  'games.common.coinsLine': "הִרְוַחְתָּ {bonus} מַטְבְּעוֹת!",

    // Games (shared UI strings)
  'games.listen.repeat': 'שְׁמַע שׁוּב',
  'games.feedback.correct': 'כָּל הַכָּבוֹד!',
  'games.feedback.wrong': 'לֹא נָכוֹן',
  'games.feedback.timeout': 'הַזְּמַן נִגְמַר ⏳',
  'games.done.title': 'כָּל הַכָּבוֹד!',
  'games.done.desc': 'סִיַּמְתָּ אֶת הַמִּשְׂחָק.',
  'games.done.back': 'חֲזָרָה',
  'games.done.completed': 'הֻשְׁלַם',
  'games.done.earned': 'הִרְוַחְתָּ {count} מַטְבְּעוֹת',

  'games.matching.hint': 'מְצָא אֶת הַזּוּגוֹת הַתּוֹאֲמִים. לְחַץ עַל כַּרְטִיס מִלָּה כְּדֵי לִשְׁמֹעַ אוֹתָהּ.',

  'games.results.correct': 'נְכוֹנוֹת',
  'games.results.wrong': 'שְׁגוּיוֹת',
  'games.results.timeout': 'נִגְמַר הַזְּמַן',
  'games.results.avgTime': 'זְמַן מְמוּצָּע',
  'games.results.coins': 'מַטְבְּעוֹת שֶׁהִרְוַחְתָּ',

};