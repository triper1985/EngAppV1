// src/screens/learn/UnitPracticeScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';

import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
} from '../../tracks/beginnerTrack';

import {
  getItemsForPackIds,
  ensureRequiredSelected,
} from '../../packs/packsCatalog';

// ✅ V11.1: audio layer (replaces tts)
import { playFx, speakContentItem, stopTTS } from '../../audio';

import { getFailedIdsToday } from '../../tracks/beginnerProgress';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { shuffle } from './learnUtils';
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

  // optional: smooth “practice → quiz”
  onStartQuiz?: (unitId: UnitId) => void;
};

type Question = {
  correctId: string;
  optionIds: string[];
};

export function UnitPracticeScreen({
  child,
  unitId,
  onBack,
  onStartQuiz,
}: Props) {
  const { t, dir } = useI18n();

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

  const failedIds = useMemo(
    () => getFailedIdsToday(child, unitId),
    [child, unitId]
  );

  const byId = useMemo(
    () => new Map(unitItems.map((it) => [it.id, it])),
    [unitItems]
  );

  const questions: Question[] = useMemo(() => {
    if (!unit || unitItems.length === 0) return [];

    const availableIds = unitItems.map((it) => it.id);
    const focused = failedIds.filter((id) => availableIds.includes(id));
    const practiceIds = focused.length > 0 ? focused : availableIds;

    const qCount = Math.min(6, practiceIds.length);
    const correctIds = shuffle(practiceIds).slice(0, qCount);

    return correctIds.map((correctId) => {
      const optionCount = Math.min(4, Math.max(3, availableIds.length));
      const distractors = shuffle(
        availableIds.filter((x) => x !== correctId)
      ).slice(0, optionCount - 1);

      return { correctId, optionIds: shuffle([correctId, ...distractors]) };
    });
  }, [unit, unitItems, failedIds]);

  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const lastAutoSpeakKey = useRef<string>('');
  const lastSpeakAtRef = useRef(0);

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  useEffect(() => {
    setQIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setLocked(false);
    lastAutoSpeakKey.current = '';
  }, [unitId]);

  const focusedAvailable = useMemo(
    () => failedIds.filter((id) => byId.has(id)).length,
    [failedIds, byId]
  );

  // ✅ compute these BEFORE any conditional return
  const done = qIndex >= questions.length;
  const q = questions[qIndex];
  const correctItem = q ? byId.get(q.correctId) : undefined;

  // ✅ Hook must ALWAYS be called (no conditional returns before it)
  useEffect(() => {
    if (done) return;
    if (!correctItem) return;

    const key = `${unitId}:${qIndex}:${correctItem.id}`;
    if (lastAutoSpeakKey.current === key) return;
    lastAutoSpeakKey.current = key;

    const tt = window.setTimeout(() => {
      stopTTS();
      speakContentItem(correctItem, {}, child);
    }, 120);

    return () => window.clearTimeout(tt);
  }, [unitId, qIndex, correctItem, done]);

  // -----------------------------------------
  // Render
  // -----------------------------------------

  if (!unit) {
    return (
      <div
        style={{ padding: 24, maxWidth: 760, margin: '0 auto', direction: dir }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.practice.titleFallback')}
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

  const topTitle = `${unitTitle} — ${t('learn.practice.titleShort')}`;

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
              {t('learn.practice.notEnoughTitle')}
            </div>
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              {t('learn.practice.notEnoughSubtitle')}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (done) {
    const score = Math.round((correctCount / questions.length) * 100);

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
              <div style={{ fontWeight: 900, fontSize: 30 }}>
                {t('learn.practice.doneTitle')}
              </div>

              {focusedAvailable > 0 ? (
                <div style={{ marginTop: 8, opacity: 0.8 }}>
                  {t('learn.practice.doneFocused')}
                </div>
              ) : (
                <div style={{ marginTop: 8, opacity: 0.8 }}>
                  {t('learn.practice.doneGeneral')}
                </div>
              )}

              <div style={{ fontSize: 56, marginTop: 10 }}>{score}%</div>
              <div style={{ fontSize: 16, opacity: 0.8 }}>
                {t('learn.practice.correctLine', {
                  correct: String(correctCount),
                  total: String(questions.length),
                })}
              </div>

              <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                {onStartQuiz && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onStartQuiz(unitId)}
                  >
                    {t('learn.practice.buttonTryQuiz')}
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
  const subtitle =
    focusedAvailable > 0
      ? t('learn.practice.subtitleFocused')
      : t('learn.practice.subtitleGeneral');

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
          <div style={{ fontSize: 13, opacity: 0.75 }}>{subtitle}</div>

          <div
            style={{
              marginTop: 10,
              height: 10,
              background: '#eee',
              borderRadius: 999,
            }}
          >
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

              const isCorrect = id === q.correctId;
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

                    window.setTimeout(() => {
                      setSelected(null);
                      setLocked(false);
                      setQIndex((i) => i + 1);
                    }, 700);
                  }}
                >
                  {renderItemVisual(it, 78)}
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
