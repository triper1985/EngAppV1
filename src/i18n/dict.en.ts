// src/i18n/dict.en.ts
export const DICT_EN: Record<string, string> = {
  // -----------------------------------------
  // Learn - Common
  // -----------------------------------------
  'learn.common.childLabel': 'Child:',
  'learn.common.back': 'Back',
  'learn.common.backOk': '✅ Back',
  'learn.common.unitNotFound': 'Unit not found',

  'learn.layer.empty.noContent': 'No units yet.',

  // -----------------------------------------
  // Learn - Flow / State
  // -----------------------------------------
  'learn.flow.invalidState': 'LearnFlow: invalid state',

  // -----------------------------------------
  // Learn - Groups (Legacy screen name kept)
  // -----------------------------------------
  'learn.groups.title': 'Basic Learning',
  'learn.groups.subtitle':
    'Pick a topic to see what is open and what is locked.',
  'learn.groups.progressLabel': 'Progress:',
  'learn.groups.unitsLabel': 'units',
  'learn.groups.noUnitsYet': 'No units yet',
  'learn.groups.buttonLocked': '🔒 Locked',
  'learn.groups.buttonEnter': 'Enter →',
  'learn.groups.locked.noUnits': 'No units in this group',
  'learn.groups.locked.prereq': 'Locked until prerequisites are completed',
  'learn.groups.locked.layer': 'Unlocks from layer {layer}',
  'learn.groups.partial.layer': 'More units unlock at layer {layer}',
  'learn.groups.currentLayer': 'Current layer: {layer}',

  // -----------------------------------------
  // Learn - Layer screens
  // -----------------------------------------
  'learn.layer.header': 'Layer {n}',
  'learn.layer.0.title': 'Orientation & Emotions',
  'learn.layer.0.desc': 'Get comfortable: simple greetings and feelings.',
  'learn.layer.1.title': 'Listening & Sounds',
  'learn.layer.1.desc': 'Follow simple instructions and recognize sounds.',
  'learn.layer.2.title': 'Core Vocabulary',
  'learn.layer.2.desc': 'Build everyday words and start using interest packs.',
  // Layer 3 now includes both letters + numbers
  'learn.layer.3.title': 'Letters & Numbers',
  'learn.layer.3.desc': 'Upper/lowercase letters + basic numbers.',
  'learn.layer.4.title': 'Early Recognition',
  'learn.layer.4.desc': 'Sight words and early recognition (no free writing).',

  // -----------------------------------------
  // Learn - Units list
  // -----------------------------------------
  'learn.units.title': 'Learning Units',
  'learn.units.subtitle':
    'Choose a unit. After you see all items — the quiz unlocks.',
  'learn.units.tipLockedToday':
    'Tip: You can practice on the quiz screen to improve, then try again tomorrow.',
  'learn.units.tooltip.learnLocked': 'Finish previous units before learning',
  'learn.units.tooltip.lockedByLayer': 'Unlocks from layer {layer}',
  'learn.units.tooltip.quizDailyLimit':
    'After 3 attempts, the quiz locks until tomorrow',

  'learn.units.toast.quizLockedToday': '🔒 Quiz is locked until end of day',
  'learn.units.toast.lockedByLayer': '🔒 Opens from layer {layer}',
  'learn.units.toast.quizOpensAfterLearn':
    '🧠 Quiz unlocks after you finish learning',
  'learn.units.toast.unitLocked': '🔒 This unit is still locked',

  'learn.units.learn.start': '▶️ Start Learn',
  'learn.units.learn.continue': '⏩ Continue Learn',
  'learn.units.learn.review': '🔁 Review Learn',
  'learn.units.learn.lockedByLayer': '🔒 Locked',

  'learn.units.quiz.start': '🧠 Start Quiz',
  'learn.units.quiz.retry': '🏁 Quiz Retry',
  'learn.units.quiz.lockedToday': '🔒 Quiz locked today',
  'learn.units.quiz.locked': '🔒 Locked',
  'learn.units.quiz.finishLearnFirst': '🔒 Quiz (finish learn first)',
  'learn.units.quiz.lockedByLayer': '🔒 Locked (opens from layer {layer})',

  'learn.units.status.locked': '🔒 Locked (complete previous units)',
  'learn.units.status.lockedByLayer': '🔒 Locked until layer {layer}',
  'learn.units.status.learnProgress': '📚 Learn: {seen}/{total}',
  'learn.units.status.quizLockedToday':
    '🔒 Quiz locked until end of day (3 attempts)',
  'learn.units.status.readyForQuiz': '🧠 Ready for quiz (PASS {pass}%+)',
  'learn.units.status.completedBest': '🏁 Completed • Best: {best}%',

  'learn.units.locked.layerTitle': 'Locked by level layer',
  'learn.units.locked.layerDesc':
    'This topic opens from layer {layer}. Keep practicing earlier layers.',

  // -----------------------------------------
  // Learn - Unit Learn screen
  // -----------------------------------------
  'learn.learn.titleFallback': 'Learn',
  'learn.learn.confirmExit':
    'Not finished yet 😊\nProgress is saved, but are you sure you want to exit?',
  'learn.learn.noItemsTitle': 'No items in this unit',
  'learn.learn.noItemsSubtitle':
    'No items found for this unit (maybe missing from catalog).',
  'learn.learn.doneTitle': 'Great job! 🎉',
  'learn.learn.doneSubtitle': 'You finished: {title}',
  'learn.learn.buttonReview': '🔁 Review unit',
  'learn.learn.buttonGoQuiz': '🧠 Go to quiz',
  'learn.learn.buttonBackToUnits': 'Back to units',
  'learn.learn.toastHeard': 'Heard ✅',
  'learn.learn.toastNext': 'Next…',
  'learn.learn.buttonHear': '🔊 Hear',
  'learn.learn.buttonNext': '➡️ Next',
  'learn.learn.tooltipNeedHear': 'Hear at least once first 😊',
  'learn.learn.tip': 'Tip: You can press "Hear" again anytime.',

  // -----------------------------------------
  // Learn - Quiz screen
  // -----------------------------------------
  'learn.quiz.titleFallback': 'Quiz',
  'learn.quiz.titleShort': 'Quiz',
  'learn.quiz.lockedTodayTitle': '🔒 Quiz locked for today',
  'learn.quiz.lockedTodayAttempts':
    'You already did {attempts}/3 attempts today',
  'learn.quiz.lockedTodayHint':
    'You can practice what you missed, and try again tomorrow (or a parent can unlock).',
  'learn.quiz.buttonPractice': '🧩 Practice',
  'learn.quiz.notEnoughItemsTitle': 'Not enough items',
  'learn.quiz.notEnoughItemsSubtitle':
    'Not enough items for a quiz (or missing from catalog).',
  'learn.quiz.passedTitle': '🎉 Champions!',
  'learn.quiz.unitLabel': 'Unit: {title}',
  'learn.quiz.failedTitle': '💪 Almost!',
  'learn.quiz.failedSubtitle': "Let's practice or try again 🙂",
  'learn.quiz.attemptsToday': 'Attempts today: {attempts}/3{willLock}',
  'learn.quiz.willLockSuffix': ' • quiz will lock today',
  'learn.quiz.buttonPracticeWrong': '🧩 Practice what I missed',
  'learn.quiz.buttonRetryNow': '🔁 Try again now',
  'learn.quiz.hearAndChoose': '🎧 Hear and choose',
  'learn.quiz.buttonHear': '🔊 Hear',
  'learn.quiz.scoreLine': 'Score: {correct}/{done}',
  'learn.quiz.toastCoins': 'Great job! You got {bonus} coins',

  // -----------------------------------------
  // Learn - Practice screen
  // -----------------------------------------
  'learn.practice.titleFallback': 'Practice',
  'learn.practice.titleShort': 'Practice',
  'learn.practice.notEnoughTitle': 'Not enough items for practice yet',
  'learn.practice.notEnoughSubtitle':
    'Not enough items to generate practice right now.',
  'learn.practice.doneTitle': '🧩 Practice done!',
  'learn.practice.doneFocused': 'We practiced mostly what you missed today ✅',
  'learn.practice.doneGeneral': 'We practiced the unit ✅',
  'learn.practice.correctLine': '{correct}/{total} correct',
  'learn.practice.buttonTryQuiz': '🧠 Try quiz',
  'learn.practice.subtitleFocused': "Let's practice what you missed today",
  'learn.practice.subtitleGeneral': "Let's practice the unit",

  // -----------------------------------------
  // Child Hub
  // -----------------------------------------
  'childHub.title': 'Child Hub',
  'childHub.greeting': 'Hi {name} 👋',
  'childHub.startLearning': '📚 Start Learning',
  'childHub.specialPacks': '✨ Special Packs',
  'childHub.games': '🎮 Games',
  'childHub.iconShop': '🛍️ Icon Shop',
  'childHub.changeIcon': 'Change icon',
  'childHub.show': 'Show',
  'childHub.hide': 'Hide',
  'childHub.iconNotUnlocked': 'This icon is not unlocked yet.',
  'childHub.iconSelected': 'Icon selected!',

  // -----------------------------------------
  // Games Hub
  // -----------------------------------------
  'gamesHub.title': 'Games',
  'gamesHub.header': '🎮 Games (coming soon)',
  'gamesHub.intro':
    'Short games to practice words and pictures will live here.',
  'gamesHub.badge': 'Soon',
  'gamesHub.game1.title': 'Word ↔ Picture matching',
  'gamesHub.game1.desc':
    'Tap a word to hear it, then connect it to the matching picture.',
  'gamesHub.game2.title': 'Picture memory',
  'gamesHub.game2.desc': 'Find matching pairs of pictures/words.',
  'gamesHub.game3.title': 'Find the picture',
  'gamesHub.game3.desc':
    'Hear a word and pick the correct picture from several options.',

  // -----------------------------------------
  // Special Packs (hub + units shells)
  // -----------------------------------------
  'specialPacks.title': 'Special Packs',
  'specialPacks.noneSelected':
    'No special packs selected yet. Ask a parent to add some!',
  'specialPacks.enter': 'Enter',

  'specialPackUnits.title': 'Groups',
  'specialPackUnits.wordCount': '{count} words',
  'specialPackUnits.learn': 'Learn',
  'specialPackUnits.quiz': 'Quiz',
  'specialPackUnits.noGroups': 'No groups yet.',
  'specialPackUnits.packFallback': 'Pack',
  'specialPackUnits.packNotFound': 'Pack not found.',

  'specialPackUnit.title': '{mode}',
  'specialPackUnit.wordsInGroup': 'Words in group: {count}',
  'specialPackUnit.v4NavOnly': 'V4 is navigation scaffolding only.',
  'specialPackUnit.futureReal':
    'A real Learn/Quiz screen will arrive in a future version.',
  'specialPackUnit.soonHere': 'Soon: a real {mode} screen will appear here.',
  'specialPackUnit.titleLearn': 'Learn',
  'specialPackUnit.titleQuiz': 'Quiz',

  // -----------------------------------------
  // Content labels (Packs / Groups)
  // -----------------------------------------
  'content.pack.foundations.title': 'Foundations',
  'content.pack.foundations.desc':
    'Very first words: greetings, yes/no, and simple feelings.',
  'content.group.orientation.title': 'Orientation',
  'content.group.emotions.title': 'Emotions',

  'content.pack.listening.title': 'Listening & Sounds',
  'content.pack.listening.desc':
    'Listen and respond: simple actions and attention words.',
  'content.group.sounds_actions.title': 'Actions',
  'content.group.classroom_attention.title': 'Attention',

  'content.pack.colors.title': 'Colors',
  'content.pack.colors.desc':
    'Beginner colors: visual answers only, no English reading required.',
  'content.group.colors_basics.title': 'Colors – Basics',
  'content.group.colors_neutrals.title': 'Colors – Neutrals',
  'content.group.colors_fun.title': 'Colors – Fun',

  'content.pack.numbers.title': 'Numbers',
  'content.pack.numbers.desc':
    'Learn to say and recognize numbers (sound → symbol).',

  // Space (official localization example)
  'content.pack.space.title': 'Space',
  'content.pack.space.desc': 'Space basics: learn words by sound + icons.',
  'content.group.space_basics.title': 'Space – Basics',

  // Animals (Core)
  'content.pack.animals.title': 'Animals',
  'content.pack.animals.desc': 'Learn basic animals (farm, sea, jungle).',
  'content.group.animals_farm.title': 'Animals – Farm',
  'content.group.animals_sea.title': 'Animals – Sea',
  'content.group.animals_jungle.title': 'Animals – Jungle',

  // -----------------------------------------
  // Beginner Track (Groups & Units)
  // -----------------------------------------
  'beginner.group.numbers.title': 'Numbers',
  'beginner.group.numbers.desc':
    'Learn to say and recognize numbers (sound → symbol).',

  'beginner.group.letters.title': 'Letters',
  'beginner.group.letters.desc': 'Learn to recognize letters (sound → symbol).',

  // Numbers units (new split)
  'beginner.unit.numbers_1_5.title': 'Numbers 1–5',
  'beginner.unit.numbers_6_10.title': 'Numbers 6–10',
  'beginner.unit.numbers_11_15.title': 'Numbers 11–15',
  'beginner.unit.numbers_16_20.title': 'Numbers 16–20',
  'beginner.unit.numbers_21_25.title': 'Numbers 21–25',
  'beginner.unit.numbers_26_30.title': 'Numbers 26–30',

  // Numbers units (legacy keys kept for safety)
  'beginner.unit.numbers_1_10.title': 'Numbers 1–10',
  'beginner.unit.numbers_11_20.title': 'Numbers 11–20',
  'beginner.unit.numbers_21_30.title': 'Numbers 21–30',

  // Numbers advanced
  'beginner.unit.tens_10_50.title': 'Tens (10–50)',
  'beginner.unit.tens_60_90.title': 'Tens (60–90)',
  'beginner.unit.tens_10_90.title': 'Tens (10–90)',
  'beginner.unit.hundreds_100_900.title': 'Hundreds (100–900)',
  'beginner.unit.thousands_1000_9000.title': 'Thousands (1000–9000)',

  // Letters units
  'beginner.unit.letters_a_f.title': 'Letters A–F',
  'beginner.unit.letters_g_l.title': 'Letters G–L',
  'beginner.unit.letters_m_r.title': 'Letters M–R',
  'beginner.unit.letters_s_z.title': 'Letters S–Z',

  // -----------------------------------------
  // Parent - Common
  // -----------------------------------------
  'parent.common.back': 'Back',
  'parent.common.open': 'Open',
  'parent.common.savedOk': 'Saved ✅',

  // -----------------------------------------
  // Parent - Home
  // -----------------------------------------
  'parent.home.title': 'Parent Mode',
  'parent.home.languageTitle': 'Interface language',
  'parent.home.language.en': 'English',
  'parent.home.language.he': 'Hebrew',

  'parent.home.firstChildHint':
    'Tip: learning language for {name} depends on level.',
  'parent.home.noChildrenHint':
    'No children yet. Create one from the Users screen.',
  'parent.home.progressTitle': 'Progress',
  'parent.home.progressSubtitle': 'See what each child completed',
  'parent.home.childSettingsTitle': 'Child settings',
  'parent.home.childSettingsSubtitle': 'Edit level, packs, and preferences',
  'parent.home.usersTitle': 'Users',
  'parent.home.usersSubtitle': 'Add / remove children',
  'parent.home.pinTitle': 'Parent PIN',
  'parent.home.pinSubtitle': 'Change or disable the PIN gate',

  // -----------------------------------------
  // Parent - Gate (PIN entry)
  // -----------------------------------------
  'parent.gate.title': 'Parent Mode',
  'parent.gate.subtitle': 'Enter PIN to access parent screens',
  'parent.gate.button.show': 'Show',
  'parent.gate.button.hide': 'Hide',
  'parent.gate.button.enter': 'Enter',
  'parent.gate.lockedInfo': 'Temporarily locked: {seconds}s remaining',
  'parent.gate.error.locked': 'Temporarily locked. Try again in {seconds}s.',
  'parent.gate.error.minDigits': 'Please enter at least 4 digits.',
  'parent.gate.error.tooManyAttempts':
    'Too many attempts. Locked for one minute.',
  'parent.gate.error.wrongPin': 'Wrong PIN. {left} attempts left.',

  // -----------------------------------------
  // Parent - Users
  // -----------------------------------------
  'parent.users.title': 'Users',

  // UserList (component)
  'parent.users.list.title': 'Users',
  'parent.users.list.add': '➕ Add child…',
  'parent.users.list.empty': 'No children yet.',
  'parent.users.row.edit': 'Edit',
  'parent.users.row.delete': 'Delete',

  // Users screen errors
  'parent.users.error.nameRequired': 'Name is required.',
  'parent.users.error.nameExists': 'Name already exists.',

  // Users modals
  'parent.users.modal.addTitle': 'Add child',
  'parent.users.modal.addHint': 'Enter the child name (e.g., Noa).',
  'parent.users.modal.addPlaceholder': 'Child name',

  'parent.users.modal.renameTitle': 'Rename child',
  'parent.users.modal.renameHint': 'Rename {name}',
  'parent.users.modal.renamePlaceholder': 'New name',

  'parent.users.modal.deleteTitle': 'Delete child?',
  'parent.users.modal.deleteHint':
    'This will remove {name} and reset their progress.',

  // Users buttons
  'parent.users.button.cancel': 'Cancel',
  'parent.users.button.add': 'Add',
  'parent.users.button.save': 'Save',
  'parent.users.button.delete': 'Delete',

  // -----------------------------------------
  // Parent - Progress
  // -----------------------------------------
  'parent.progress.title': 'Progress',
  'parent.progress.childLabel': 'Child:',
  'parent.progress.backToGroups': '← Back to groups',

  'parent.progress.recommendationTitle': 'Level A recommendation',
  'parent.progress.reco.complete': 'Level A is complete. Great job!',
  'parent.progress.reco.readyForNext': 'Ready to unlock layer {layer}.',
  'parent.progress.reco.practiceLayer': 'Keep practicing layer {layer}.',

  'parent.progress.currentLayer': 'Current layer: {layer}',
  'parent.progress.suggestedNextLayer': 'Suggested next layer: {layer}',
  'parent.progress.focusPacks': 'Focus packs: {packs}',

  'parent.progress.noChildSelected': 'No child selected.',
  'parent.progress.noGroupSelected': 'No group selected.',

  // Progress – Groups screen
  'parent.progress.groups.completed': 'Completed: {completed}/{total}',
  'parent.progress.completed': 'Completed: {done}/{total}',

  // Progress – Units screen
  'parent.progress.units.backToGroups': '← Back to groups',
  'parent.progress.units.resetAll': '♻️ Reset all progress',
  'parent.progress.units.confirmResetAll': 'Reset all progress for this child?',

  // both toast key variants kept (used in different places)
  'parent.progress.units.toastResetAllDone': 'Reset all progress ✅',
  'parent.progress.units.toast.resetAllDone': 'Progress reset ✅',

  'parent.progress.units.passInfo':
    'PASS score: {pass}% • locks after 3 attempts/day',
  'parent.progress.units.policyLine':
    'Quiz PASS: {pass}% • Locks after 3 attempts per day',

  'parent.progress.units.toast.unlockedQuizToday': 'Quiz unlocked (today) ✅',
  'parent.progress.units.toast.resetAttemptsToday': 'Attempts reset (today) ✅',

  'parent.progress.units.status.locked': '🔒 Locked',
  'parent.progress.units.status.learn': '📚 Learn ({seen}/{total})',
  'parent.progress.units.status.quiz': '🧠 Ready for quiz ({seen}/{total})',
  'parent.progress.units.status.quizReady':
    '🧠 Ready for quiz ({seen}/{total})',
  'parent.progress.units.status.completed': '🏁 Completed ({best}%)',

  // NOTE: key uses {n} in your original; kept as-is for compatibility
  'parent.progress.units.attemptsToday': 'Attempts today: {n}/3',
  'parent.progress.units.lockedToday': '🔒 Locked today',
  'parent.progress.units.lockedTodaySuffix': ' • 🔒 locked today',

  'parent.progress.units.unlockQuizToday': '🔓 Unlock quiz (today)',
  'parent.progress.units.resetAttemptsToday': '🧼 Reset attempts (today)',

  'parent.progress.units.action.unlockQuizToday': '🔓 Unlock quiz (today)',
  'parent.progress.units.action.resetAttemptsToday':
    '🧼 Reset attempts (today)',

  'parent.progress.units.toastUnlockQuizToday': 'Unlocked quiz (today) ✅',
  'parent.progress.units.toastResetAttemptsToday': 'Reset attempts (today) ✅',

  'parent.progress.units.noActions':
    '(No parent actions for this unit right now)',

  // -----------------------------------------
  // Parent - Child Settings (new + legacy editor keys kept)
  // -----------------------------------------
  'parent.childSettings.title': 'Child Settings',
  'parent.childSettings.selectChildTitle': 'Select child',
  'parent.childSettings.selectedLabel': 'Selected:',
  'parent.childSettings.levelTitle': 'Level',
  'parent.childSettings.currentLabel': 'Current:',
  'parent.childSettings.interestPacksTitle': 'Interest Packs',
  'parent.childSettings.interestPacksSubtitle':
    'Optional packs for motivation. Core packs are always enabled.',
  'parent.childSettings.pack.enabled': 'Enabled',
  'parent.childSettings.pack.enable': 'Enable',
  'parent.childSettings.noInterestPacks': 'No interest packs available yet.',

  // Legacy editor keys (kept for safety)
  'parent.childEditor.title': 'Child settings',
  'parent.childEditor.selectChild': 'Select child',
  'parent.childEditor.selected': 'Selected:',
  'parent.childEditor.level': 'Level',
  'parent.childEditor.current': 'Current:',
  'parent.childEditor.interestPacks.title': 'Interest packs',
  'parent.childEditor.interestPacks.subtitle':
    'Optional packs for motivation. Core packs are always enabled.',
  'parent.childEditor.interestPacks.enable': 'Enable',
  'parent.childEditor.interestPacks.enabled': 'Enabled',
  'parent.childEditor.interestPacks.empty': 'No interest packs available yet.',

  // -----------------------------------------
  // Parent - PIN Settings
  // -----------------------------------------
  'parent.pin.title': 'Parent PIN',
  'parent.pin.hint': 'Choose a new PIN (at least 4 digits).',
  'parent.pin.placeholder': 'New PIN (4+ digits)',
  'parent.pin.error.minDigits': 'PIN must be at least 4 digits.',
  'parent.pin.toast.saved': 'Saved ✅',
  'parent.pin.toast.reset': 'Reset ✅',

  // Multiple key variants used across versions (kept)
  'parent.pin.statusLabel': 'Status:',
  'parent.pin.status.label': 'Status:',

  'parent.pin.status.set': 'PIN is set',
  'parent.pin.status.none': 'No PIN set',
  'parent.pin.status.notSet': 'No PIN set',

  'parent.pin.input.placeholder': 'New PIN (4+ digits)',
  'parent.pin.button.save': 'Save',
  'parent.pin.button.reset': 'Reset',
  'parent.pin.button.cancel': 'Cancel',
  'parent.pin.button.resetConfirm': 'Reset',

  'parent.pin.reset.title': 'Reset PIN?',
  'parent.pin.reset.desc': 'This will reset the PIN to default 1234.',
  'parent.pin.reset.cancel': 'Cancel',
  'parent.pin.reset.confirm': 'Reset',

  'parent.pin.toast.tooShort': 'PIN must be at least 4 digits ⚠️',

  'parent.pin.modal.resetTitle': 'Reset PIN?',
  'parent.pin.modal.resetDesc': 'This will reset the PIN to default 1234.',
  'parent.home.audioTitle': 'Audio settings',
  'parent.home.audioSubtitle': 'Voice, speed and effects',
  'parent.audio.title': 'Audio settings',
  'parent.audio.ttsTitle': 'Speech (TTS)',
  'parent.audio.speedTitle': 'Speech speed',
  'parent.audio.voiceTitle': 'Voice',
  'parent.audio.voiceAuto': 'Auto (by language)',
  'parent.audio.voiceHint':
    'The list depends on your browser/device. If no voices appear, keep Auto.',
  'parent.audio.fxTitle': 'Sound effects (FX)',
  'parent.audio.testButton': 'Play sample',
  'parent.audio.sampleText': 'Hello! This is a sample sentence.',
  'parent.audio.speedSlow': 'Slow',
  'parent.audio.speedNormal': 'Normal',
  'parent.audio.on': 'On',
  'parent.audio.off': 'Off',

  // ✅ V11.4 — per-child audio
  'parent.childAudio.buttonOpen': 'Child audio',
  'parent.childAudio.title': '{name} — Audio',
  'parent.childAudio.modeTitle': 'Settings mode',
  'parent.childAudio.modeGlobal': 'Use default',
  'parent.childAudio.modeOverride': 'Custom for this child',
  'parent.childAudio.modeGlobalHint':
    'This child uses the parent default audio settings.',
  'parent.childAudio.modeOverrideHint':
    'Override the default settings for this child only.',
  'parent.childAudio.disabledBecauseGlobal':
    'Switch to "Custom for this child" to edit.',
  'parent.childAudio.effectiveTitle': 'Effective settings (preview)',
  'parent.childAudio.effective.tts': 'TTS enabled',
  'parent.childAudio.effective.speed': 'Speed',
  'parent.childAudio.effective.voice': 'Voice',
  'parent.childAudio.effective.fx': 'FX enabled',
  'parent.childAudio.voiceAuto': 'Auto',
  'parent.childAudio.resetButton': 'Reset to default',
  'parent.childAudio.resetOk': 'Reset to default',
  'parent.childAudio.saveButton': 'Save',

    // -----------------------------------------
  // Aliases (expo-router / native shells) — keep legacy keys working
  // -----------------------------------------

  // Child hub (new keys used in native screens)
  'child.hub.title': 'Child Hub',
  'child.hub.learn': '📚 Start Learning',
  'child.hub.rewards': '🛍️ Rewards',
  'child.hub.specialPacks': '✨ Special Packs',
  'child.hub.games': '🎮 Games',

  // Parent home (new keys used in native screens)
  'parent.home.childrenCount': 'Children: {n}',

  'parent.home.progress': 'Progress',
  'parent.home.childSettings': 'Child settings',
  'parent.home.manageChildren': 'Users',
  'parent.home.audio': 'Audio settings',
  'parent.home.pin': 'Parent PIN',


'parent.home.nativeShellNote':
  'Note: The full parent UI is still available on web. This native screen is a minimal navigation shell.',

'parent.audio.nativeShellNote':
  'Parent audio defaults UI is currently available on web. Native port will come later.',
'parent.childAudio.nativeShellNote':
  'Per-child audio overrides are currently editable on web. Native port will come later.',
  // -----------------------------------------
  // Parent - PIN Settings (Native / V11.4+)
  // -----------------------------------------
  'parent.pin.statusTitle': 'Status',
  'parent.pin.status.loading': 'Loading…',
  'parent.pin.status.enabled': 'Enabled',
  'parent.pin.status.disabled': 'Disabled',

  'parent.pin.setTitle': 'Set PIN',
  'parent.pin.changeTitle': 'Change PIN',

  'parent.pin.currentHint': 'Current PIN',
  'parent.pin.currentPlaceholder': 'Enter current PIN',

  'parent.pin.newHint': 'New PIN',
  'parent.pin.newPlaceholder': 'Enter new PIN (min 4 digits)',

  'parent.pin.confirmHint': 'Confirm new PIN',
  'parent.pin.confirmPlaceholder': 'Re-enter new PIN',

  'parent.pin.clear': 'Clear',
  'parent.pin.save': 'Save',
  'parent.pin.saveChange': 'Save change',

  'parent.pin.toast.cleared': 'PIN cleared',
  'parent.pin.error.currentWrong': 'Current PIN is incorrect',
  'parent.pin.error.currentWrongToClear': 'Enter the correct current PIN to clear',
  'parent.pin.error.newTooShort': 'New PIN must be at least 4 digits',
  'parent.pin.error.confirmMismatch': 'PIN confirmation does not match',
  'learn.common.ok': 'OK',
  'learn.common.cancel': 'Cancel',
  'learn.common.confirm': 'Confirm',
  'learn.learn.confirmExitTitle': 'Exit learning?',

};
