// src/screens/learn/UnitLearnScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';

import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
} from '../../tracks/beginnerTrack';

import { getBeginnerProgress } from '../../tracks/beginnerProgress';
import {
  getItemsForPackIds,
  ensureRequiredSelected,
} from '../../packs/packsCatalog';

// ✅ V11.1: audio layer
import { playFx, speakContentItem, stopTTS } from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
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

  // visual text (numbers/letters/emoji)
  return <div style={{ fontSize: Math.round(size * 0.8) }}>{v.he}</div>;
}

type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void; // back to Units
  onChildUpdated: (updated: ChildProfile) => void;
  onStartQuiz?: (unitId: UnitId) => void; // ✅ V10 behavior (go to quiz)
};

export function UnitLearnScreen({
  child,
  unitId,
  onBack,
  onChildUpdated,
  onStartQuiz,
}: Props) {
  const { t, dir } = useI18n();

  const catalog = useMemo(() => {
    const packs = ensureRequiredSelected(child.selectedPackIds ?? []);
    return getItemsForPackIds(packs);
  }, [child.selectedPackIds]);

  const unit: UnitDef | undefined = useMemo(
    () => BEGINNER_UNITS.find((u) => u.id === unitId),
    [unitId]
  );

  const unitItems = useMemo(() => {
    if (!unit) return [];
    return resolveUnitItems(unit, catalog);
  }, [unit, catalog]);

  const [index, setIndex] = useState(0);
  const [heardThisItem, setHeardThisItem] = useState(false);
  const lastSpeakAtRef = useRef(0);

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const { toast, showToast, clearToast } = useToast(1600);

  /**
   * ✅ FIX (V5.5 / V10 stable):
   * start index only on enter (unitId change), not on every progress update.
   */
  useEffect(() => {
    const total = unitItems.length;
    if (total === 0) {
      setIndex(0);
      setHeardThisItem(false);
      clearToast();
      return;
    }

    const latest = ChildrenStore.getById(child.id) ?? child;
    const latestProg = getBeginnerProgress(latest);
    const seenCount = latestProg.units?.[unitId]?.seenItemIds?.length ?? 0;

    let startIndex = 0;
    if (seenCount > 0 && seenCount < total) startIndex = seenCount;
    else startIndex = 0;

    setIndex(startIndex);
    setHeardThisItem(false);
    clearToast();
  }, [unitId, unitItems.length, child.id, clearToast]);

  // ✅ Auto speak current item (V10-like delay, now via audio)
  useEffect(() => {
    if (!unitItems.length) return;
    if (index >= unitItems.length) return;

    const current = unitItems[Math.min(index, unitItems.length - 1)];
    if (!current) return;

    const tt = window.setTimeout(() => {
      stopTTS();
      speakContentItem(current, {}, child);
      setHeardThisItem(true);
    }, 120);

    return () => window.clearTimeout(tt);
  }, [index, unitItems]);

  function persistChild(updated: ChildProfile) {
    ChildrenStore.upsert(updated);
    onChildUpdated(updated);
  }

  function markSeen(itemId: string) {
    const latest = ChildrenStore.getById(child.id) ?? child;

    const bp = latest.beginnerProgress ?? ({ units: {} } as any);
    const units = bp.units ?? ({} as any);

    const up = units[unitId] ?? {
      unitId,
      seenItemIds: [],
      masteredItemIds: [],
    };

    const set = new Set<string>(up.seenItemIds ?? []);
    if (!set.has(itemId)) set.add(itemId);

    const nextChild: ChildProfile = {
      ...latest,
      beginnerProgress: {
        ...bp,
        units: {
          ...units,
          [unitId]: {
            ...up,
            unitId,
            seenItemIds: Array.from(set.values()),
            masteredItemIds: up.masteredItemIds ?? [],
          },
        },
      },
    };

    persistChild(nextChild);
  }

  function confirmExitLearn(): boolean {
    const total = unitItems.length;

    const latest = ChildrenStore.getById(child.id) ?? child;
    const latestProg = getBeginnerProgress(latest);
    const seenCount = latestProg.units?.[unitId]?.seenItemIds?.length ?? 0;

    const isReview = total > 0 && seenCount >= total; // ✅ finished learn => review mode
    if (isReview) return true; // ✅ no popup in review

    const notDone = index < total;
    const hasProgress = seenCount > 0 || index > 0;

    if (notDone && hasProgress) {
      return window.confirm(t('learn.learn.confirmExit'));
    }
    return true;
  }

  const total = unitItems.length;

  if (!unit) {
    return (
      <div
        style={{
          padding: 24,
          maxWidth: 760,
          margin: '0 auto',
          direction: dir,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.learn.titleFallback')}
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

  // ✅ i18n title for this unit
  const unitTitle = unit.titleKey ? t(unit.titleKey) : unit.title;

  if (unitItems.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          maxWidth: 760,
          margin: '0 auto',
          direction: dir,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={unitTitle}
          onBack={onBack}
        />
        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ fontWeight: 900, fontSize: 18 }}>
              {t('learn.learn.noItemsTitle')}
            </div>
            <div style={{ marginTop: 6, opacity: 0.75 }}>
              {t('learn.learn.noItemsSubtitle')}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ✅ DONE screen (V10) + Go to Quiz button
  if (index >= total) {
    return (
      <div
        style={{
          padding: 24,
          maxWidth: 760,
          margin: '0 auto',
          direction: dir,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={unitTitle}
          onBack={onBack}
        />

        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 30 }}>
                {t('learn.learn.doneTitle')}
              </div>
              <div style={{ marginTop: 8, fontSize: 16, opacity: 0.85 }}>
                {t('learn.learn.doneSubtitle', { title: unitTitle })}
              </div>

              <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    setIndex(0);
                    setHeardThisItem(false);
                    clearToast();
                  }}
                >
                  {t('learn.learn.buttonReview')}
                </Button>

                {onStartQuiz && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => onStartQuiz(unitId)}
                  >
                    {t('learn.learn.buttonGoQuiz')}
                  </Button>
                )}

                <Button fullWidth onClick={onBack}>
                  {t('learn.learn.buttonBackToUnits')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const current = unitItems[Math.min(index, total - 1)];
  const isLast = index >= total - 1;
  const progressText = `${Math.min(index + 1, total)} / ${total}`;

  // ✅ NEW: avoid duplicate line when visual is same as text (numbers/letters)
  const displayText =
    dir === 'rtl' ? current.he ?? current.en : current.en ?? current.he;

  const visualText = current.visual.kind === 'text' ? current.visual.he : null;

  // ✅ NEW RULE:
  // - If visual is a number (e.g. "1", "12") -> hide the text line always
  // - Else hide only if it duplicates the same text (letters case)
  const isNumericVisual = !!visualText && /^[0-9]+$/.test(visualText.trim());

  const hideTextLine =
    isNumericVisual ||
    (!!visualText && !!displayText && visualText.trim() === displayText.trim());

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 760,
        margin: '0 auto',
        direction: dir,
        textAlign: dir === 'rtl' ? 'right' : 'left',
      }}
    >
      <TopBar
        backLabel={t('learn.common.back')}
        dir={dir}
        title={unitTitle}
        onBack={() => {
          if (confirmExitLearn()) onBack();
        }}
        right={
          <div style={{ fontSize: 13, opacity: 0.75, alignSelf: 'center' }}>
            {progressText}
          </div>
        }
      />

      <div style={{ marginTop: 14 }}>
        <Card>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 18, textAlign: 'center' }}>
              {renderItemVisual(current, 160)}
            </div>

            {!hideTextLine && (
              <div
                style={{ fontSize: 28, fontWeight: 900, textAlign: 'center' }}
              >
                {displayText}
              </div>
            )}

            <div style={{ marginTop: 4, opacity: 0.75, textAlign: 'center' }}>
              {toast ? toast : null}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                onClick={() => {
                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  playFx('tap');
                  stopTTS();
                  speakContentItem(current, {}, child);
                  setHeardThisItem(true);
                  showToast(t('learn.learn.toastHeard'));
                }}
                style={{ fontSize: 18, padding: '12px 18px' }}
              >
                {t('learn.learn.buttonHear')}
              </Button>

              <Button
                variant="primary"
                disabled={!heardThisItem}
                onClick={() => {
                  markSeen(current.id);

                  if (isLast) {
                    setIndex(total); // ✅ go to Done
                    return;
                  }

                  setIndex((i) => i + 1);
                  setHeardThisItem(false);
                  showToast(t('learn.learn.toastNext'));
                }}
                style={{ fontSize: 18, padding: '12px 18px' }}
              >
                {t('learn.learn.buttonNext')}
              </Button>
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                opacity: 0.7,
                textAlign: 'center',
              }}
            >
              {t('learn.learn.tip')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
