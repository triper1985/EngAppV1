// src/screens/learn/LearnFlow.tsx
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import type { UnitGroupId, UnitId } from '../../tracks/beginnerTrack';

import {
  LearnHomeScreen,
  LearnLayerScreen,
  LearnUnitsScreen,
  UnitLearnScreen,
  UnitQuizScreen,
  UnitPracticeScreen,
} from '.';

import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../../ui/Button';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

type LearnMode = 'home' | 'layer' | 'units' | 'learn' | 'quiz' | 'practice';

export function LearnFlow({ child, onBack, onChildUpdated }: Props) {
  const { t, dir } = useI18n();

  const [mode, setMode] = useState<LearnMode>('home');
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<UnitGroupId | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<UnitId | null>(null);

  const [quizKey, setQuizKey] = useState(0);

  if (mode === 'home') {
    return (
      <LearnHomeScreen
        child={child}
        onBack={onBack}
        onEnterLayer={(layerId) => {
          setActiveLayerId(layerId);
          setMode('layer');
        }}
      />
    );
  }

  if (mode === 'layer' && activeLayerId !== null) {
    return (
      <LearnLayerScreen
        child={child}
        layerId={activeLayerId}
        onBack={() => {
          setActiveGroupId(null);
          setActiveUnitId(null);
          setMode('home');
        }}
        onEnterGroup={(groupId) => {
          setActiveGroupId(groupId);
          setMode('units');
        }}
      />
    );
  }

  if (mode === 'units' && activeGroupId) {
    return (
      <LearnUnitsScreen
        child={child}
        groupId={activeGroupId}
        onBack={() => {
          setActiveUnitId(null);
          setMode(activeLayerId !== null ? 'layer' : 'home');
        }}
        onStartUnit={(unitId) => {
          setActiveUnitId(unitId);
          setMode('learn');
        }}
        onStartQuiz={(unitId) => {
          setActiveUnitId(unitId);
          setMode('quiz');
        }}
      />
    );
  }

  if (mode === 'learn' && activeUnitId) {
    return (
      <UnitLearnScreen
        child={child}
        unitId={activeUnitId}
        onBack={() => setMode('units')}
        onChildUpdated={onChildUpdated}
        onStartQuiz={(unitId) => {
          setActiveUnitId(unitId);
          setMode('quiz');
        }}
      />
    );
  }

  if (mode === 'quiz' && activeUnitId) {
    return (
      <UnitQuizScreen
        key={quizKey}
        child={child}
        unitId={activeUnitId}
        onBack={() => setMode('units')}
        onChildUpdated={onChildUpdated}
        onStartPractice={(unitId) => {
          setActiveUnitId(unitId);
          setMode('practice');
        }}
        onRetryQuiz={() => setQuizKey((k) => k + 1)}
      />
    );
  }

  if (mode === 'practice' && activeUnitId) {
    return (
      <UnitPracticeScreen
        child={child}
        unitId={activeUnitId}
        onBack={() => setMode('units')}
        onStartQuiz={(unitId) => {
          setActiveUnitId(unitId);
          setMode('quiz')}
        }
      />
    );
  }

  // RN-safe fallback (should never happen)
  return (
    <View style={[styles.fallback, dir === 'rtl' ? styles.rtl : null]}>
      <Text style={styles.fallbackTitle}>{t('learn.flow.invalidState')}</Text>
      <View style={{ marginTop: 12 }}>
        <Button onClick={onBack}>{t('learn.common.back')}</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { padding: 24 },
  fallbackTitle: { fontWeight: '900', fontSize: 18 },
  rtl: { direction: 'rtl' as any },
});
