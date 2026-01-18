// src/screens/learn/UnitQuizScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import { shuffle, sampleDistinct } from './learnUtils';
import type { ContentItem } from '../../content/types';

import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
  QUIZ_PASS_SCORE,
} from '../../tracks/beginnerTrack';

import {
  getQuizAttemptsToday,
  isQuizLockedToday,
  recordQuizFailAttempt,
  resetQuizDailyStateOnPass,
  setBestQuizScore,
} from '../../tracks/beginnerProgress';

import {
  getItemsForPackIds,
  ensureRequiredSelected,
} from '../../packs/packsCatalog';

// ✅ V11.1: audio layer (replaces tts)
import { playFx, speakContentItem, stopTTS } from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';
import { coinsBonusForQuizPass } from '../../rewards/coins';

import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { useToast } from '../../ui/useToast';

import { useI18n } from '../../i18n/I18nContext';

function renderItemVisual(it: ContentItem, size: number) {
  const v = it.visual;

  if (v.kind === 'color') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 24,
          background: v.hex,
          margin: '0 auto',
          border: '2px solid #00000012',
        }}
      />
    );
  }

  if (v.kind === 'image') {
    return <div style={{ fontSize: Math.round(size * 0.6) }}>🖼️</div>;
  }

  return <div style={{ fontSize: Math.round(size * 0.8) }}>{v.he}</div>;
}

type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
  onStartPractice: (unitId: UnitId) => void;
  onRetryQuiz: () => void;
};

type Question = {
  correctId: string;
  optionIds: string[];
};

function fireConfetti() {
  const c = (window as any).confetti;
  if (!c) return;
  c({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
}

// ---------------------------
// Better distractors for numbers
// ---------------------------
function parseNumericVisual(it: ContentItem): number | null {
  const v = it.visual;
  if (v.kind !== 'text') return null;

  const raw = (v.he ?? '').trim();
  if (!raw) return null;

  const n = Number(raw.replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(n)) return null;

  return n;
}

function getPreferredDistractors(
  correctId: string,
  ids: string[],
  byId: Map<string, ContentItem>,
  needCount: number
): string[] {
  if (needCount <= 0) return [];

  const correctItem = byId.get(correctId);
  if (!correctItem)
    return shuffle(ids.filter((x) => x !== correctId)).slice(0, needCount);

  const correctN = parseNumericVisual(correctItem);
  if (correctN === null) {
    return shuffle(ids.filter((x) => x !== correctId)).slice(0, needCount);
  }

  const candidates = ids
    .filter((x) => x !== correctId)
    .map((id) => {
      const it = byId.get(id);
      const n = it ? parseNumericVisual(it) : null;
      const dist = n === null ? -1 : Math.abs(n - correctN);
      return { id, dist };
    });

  const numeric = candidates.filter((c) => c.dist >= 0);
  const nonNumeric = candidates.filter((c) => c.dist < 0);

  const sorted = numeric
    .sort((a, b) => {
      if (b.dist !== a.dist) return b.dist - a.dist;
      return Math.random() - 0.5;
    })
    .map((c) => c.id);

  const out: string[] = [];
  for (const id of sorted) {
    out.push(id);
    if (out.length >= needCount) return out;
  }

  const fallback = shuffle(nonNumeric.map((c) => c.id));
  for (const id of fallback) {
    out.push(id);
    if (out.length >= needCount) break;
  }

  return out.slice(0, needCount);
}

export function UnitQuizScreen({
  child,
  unitId,
  onBack,
  onChildUpdated,
  onStartPractice,
  onRetryQuiz,
}: Props) {
  const { t, dir } = useI18n();
  const { toast, showToast, clearToast } = useToast(1800);

  const unit: UnitDef | undefined = useMemo(
    () => BEGINNER_UNITS.find((u) => u.id === unitId),
    [unitId]
  );

  const unitTitle = useMemo(() => {
    if (!unit) return '';
    return unit.titleKey ? t(unit.titleKey) : unit.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, t]);

  const catalog = useMemo(() => {
    const packIds = ensureRequiredSelected(child.selectedPackIds ?? ['basic']);
    return getItemsForPackIds(packIds);
  }, [child.selectedPackIds]);

  const unitItems = useMemo(() => {
    if (!unit) return [];
    return resolveUnitItems(unit, catalog);
  }, [unit, catalog]);

  const byId = useMemo(
    () => new Map(unitItems.map((it) => [it.id, it])),
    [unitItems]
  );

  const questions: Question[] = useMemo(() => {
    if (!unit || unitItems.length === 0) return [];
    const ids = unitItems.map((it) => it.id);

    const qCount = Math.min(6, ids.length);
    const correctIds = sampleDistinct(ids, qCount);

    return correctIds.map((correctId) => {
      const optionCount = Math.min(4, Math.max(3, ids.length));
      const needDistractors = optionCount - 1;

      const distractors = getPreferredDistractors(
        correctId,
        ids,
        byId,
        needDistractors
      );

      return { correctId, optionIds: shuffle([correctId, ...distractors]) };
    });
  }, [unit, unitItems, byId]);

  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const wrongIdsRef = useRef<Set<string>>(new Set());
  const lastAutoSpeakKey = useRef<string>('');

  // ✅ V11.3: debounce for manual "Hear" button
  const lastSpeakAtRef = useRef<number>(0);

  const [finished, setFinished] = useState<null | {
    score: number;
    passed: boolean;
  }>(null);
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const attempts = getQuizAttemptsToday(child, unitId);
  const lockedToday = isQuizLockedToday(child, unitId);

  useEffect(() => {
    setQIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setLocked(false);
    wrongIdsRef.current = new Set();
    setFinished(null);
    setPersisted(false);
    lastAutoSpeakKey.current = '';
    clearToast();
  }, [unitId, clearToast]);

  const q = questions[qIndex];
  const correctItem = q ? byId.get(q.correctId) : undefined;

  useEffect(() => {
    if (lockedToday) return;
    if (finished) return;
    if (!q) return;
    if (!correctItem) return;

    const key = `${unitId}:${qIndex}:${correctItem.id}`;
    if (lastAutoSpeakKey.current === key) return;
    lastAutoSpeakKey.current = key;

    const tt = window.setTimeout(() => {
      stopTTS();
      if (lockedToday) return;
      if (finished) return;
      speakContentItem(correctItem, {}, child);
    }, 120);

    return () => window.clearTimeout(tt);
  }, [unitId, qIndex, q, correctItem, lockedToday, finished]);

  function persistChild(updated: ChildProfile) {
    ChildrenStore.upsert(updated);
    onChildUpdated(updated);
  }

  function saveScoreAndDailyState(score: number, passed: boolean) {
    const latest = ChildrenStore.getById(child.id) ?? child;

    let next = setBestQuizScore(latest, unitId, score);

    if (passed) {
      next = resetQuizDailyStateOnPass(next, unitId);
    } else {
      next = recordQuizFailAttempt(
        next,
        unitId,
        Array.from(wrongIdsRef.current.values())
      );
    }

    persistChild(next);
  }

  useEffect(() => {
    if (!finished) return;
    if (persisted) return;

    saveScoreAndDailyState(finished.score, finished.passed);

    if (finished.passed) {
      fireConfetti();

      const latest = ChildrenStore.getById(child.id) ?? child;
      const bonus = coinsBonusForQuizPass(latest);

      if (bonus > 0) {
        ChildrenStore.addCoins(child.id, bonus);
        const updatedChild = ChildrenStore.getById(child.id) ?? latest;
        onChildUpdated(updatedChild);

        showToast(t('learn.quiz.toastCoins', { bonus: String(bonus) }));
      }
    }

    setPersisted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (!unit) {
    return (
      <div
        style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.quiz.titleFallback')}
          onBack={onBack}
        />
        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {t('learn.common.unitNotFound')}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const topTitle = `${unitTitle} — ${t('learn.quiz.titleShort')}`;

  if (lockedToday) {
    return (
      <div
        style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={topTitle}
          onBack={onBack}
        />

        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 28 }}>
                {t('learn.quiz.lockedTodayTitle')}
              </div>

              <div style={{ marginTop: 8, fontSize: 16, opacity: 0.85 }}>
                {t('learn.quiz.lockedTodayAttempts', {
                  attempts: String(attempts),
                })}
              </div>

              <div style={{ marginTop: 10, fontSize: 14, opacity: 0.75 }}>
                {t('learn.quiz.lockedTodayHint')}
              </div>

              <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => onStartPractice(unitId)}
                >
                  {t('learn.quiz.buttonPractice')}
                </Button>

                <Button fullWidth onClick={onBack}>
                  {t('learn.common.back')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (unitItems.length === 0 || questions.length === 0) {
    return (
      <div
        style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={topTitle}
          onBack={onBack}
        />

        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {t('learn.quiz.notEnoughItemsTitle')}
            </div>
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              {t('learn.quiz.notEnoughItemsSubtitle')}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (finished) {
    const { score, passed } = finished;

    const attemptsAfterFail = passed ? attempts : Math.min(3, attempts + 1);
    const willLock = !passed && attemptsAfterFail >= 3;

    return (
      <div
        style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={topTitle}
          onBack={onBack}
        />

        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              {passed ? (
                <>
                  <div style={{ fontWeight: 900, fontSize: 30 }}>
                    {t('learn.quiz.passedTitle')}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, opacity: 0.85 }}>
                    {t('learn.quiz.unitLabel', { title: unitTitle })}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 900, fontSize: 30 }}>
                    {t('learn.quiz.failedTitle')}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, opacity: 0.85 }}>
                    {t('learn.quiz.failedSubtitle')}
                  </div>
                </>
              )}

              <div style={{ fontSize: 56, marginTop: 10 }}>{score}%</div>

              {!passed && (
                <div style={{ marginTop: 10, fontSize: 14, opacity: 0.75 }}>
                  {t('learn.quiz.attemptsToday', {
                    attempts: String(attemptsAfterFail),
                    willLock: willLock ? t('learn.quiz.willLockSuffix') : '',
                  })}
                </div>
              )}

              <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                {!passed && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onStartPractice(unitId)}
                  >
                    {t('learn.quiz.buttonPracticeWrong')}
                  </Button>
                )}

                {!passed && !willLock && (
                  <Button fullWidth onClick={onRetryQuiz}>
                    {t('learn.quiz.buttonRetryNow')}
                  </Button>
                )}

                <Button fullWidth onClick={onBack}>
                  {t('learn.common.backOk')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((qIndex + 1) / questions.length) * 100);
  const correctId = q.correctId;

  return (
    <div
      style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
    >
      <TopBar
        backLabel={t('learn.common.back')}
        dir={dir}
        title={topTitle}
        onBack={onBack}
        right={
          <div style={{ fontSize: 13, opacity: 0.75, alignSelf: 'center' }}>
            {qIndex + 1}/{questions.length}
          </div>
        }
      />

      <div style={{ marginTop: 14 }}>
        <Card>
          {toast && (
            <div
              style={{
                marginBottom: 12,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid #eee',
                background: '#fafafa',
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {toast}
            </div>
          )}

          <div style={{ height: 10, background: '#eee', borderRadius: 999 }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: '#bbb',
                borderRadius: 999,
                transition: 'width 200ms ease',
              }}
            />
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 22 }}>
              {t('learn.quiz.hearAndChoose')}
            </div>

            <div style={{ marginTop: 10 }}>
              <Button
                variant="primary"
                onClick={() => {
                  if (!correctItem) return;

                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  playFx('tap');
                  stopTTS();
                  speakContentItem(correctItem, {}, child);
                }}
                disabled={!correctItem}
                style={{ fontSize: 18, padding: '12px 18px' }}
              >
                {t('learn.quiz.buttonHear')}
              </Button>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {q.optionIds.map((id) => {
              const it = byId.get(id);
              if (!it) return null;

              const isCorrect = id === correctId;
              const isSelected = selected === id;

              let border = '2px solid #e6e6e6';
              let bg = '#fff';

              if (locked) {
                if (isSelected && isCorrect) {
                  border = '3px solid #2ecc71';
                  bg = '#f0fff6';
                } else if (isSelected && !isCorrect) {
                  border = '3px solid #e74c3c';
                  bg = '#fff3f3';
                }
              }

              return (
                <button
                  key={id}
                  disabled={locked}
                  style={{
                    border,
                    background: bg,
                    borderRadius: 18,
                    padding: '18px 10px',
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    cursor: locked ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => {
                    if (locked) return;

                    setSelected(id);
                    setLocked(true);

                    if (isCorrect) setCorrectCount((c) => c + 1);
                    else wrongIdsRef.current.add(correctId);

                    window.setTimeout(() => {
                      setSelected(null);
                      setLocked(false);

                      const nextIndex = qIndex + 1;

                      if (nextIndex >= questions.length) {
                        const finalCorrect = isCorrect
                          ? correctCount + 1
                          : correctCount;
                        const score = Math.round(
                          (finalCorrect / questions.length) * 100
                        );
                        const passed = score >= QUIZ_PASS_SCORE;
                        setFinished({ score, passed });
                      } else {
                        setQIndex(nextIndex);
                      }
                    }, 700);
                  }}
                >
                  {renderItemVisual(it, 86)}
                </button>
              );
            })}
          </div>

          {qIndex > 0 && (
            <div
              style={{
                marginTop: 14,
                fontSize: 13,
                opacity: 0.75,
                textAlign: 'center',
              }}
            >
              {t('learn.quiz.scoreLine', {
                correct: String(correctCount),
                done: String(qIndex),
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
