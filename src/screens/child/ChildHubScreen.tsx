// src/screens/child/ChildHubScreen.tsx
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { IconPicker } from '../../components/IconPicker';
import { iconToDisplay } from '../../data/icons';

import { ChildrenStore } from '../../storage/childrenStore';
import { Button } from '../../ui/Button';
import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { useToast } from '../../ui/useToast';
import { useI18n } from '../../i18n/I18nContext';
import { getUnlockedLayerSnapshotA } from '../../content';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;

  onStartLearn: () => void;
  onOpenRewardsShop: () => void;

  // V4
  onOpenSpecialPacks: () => void;
  onOpenGames: () => void;
};

export function ChildHubScreen({
  child,
  onBack,
  onChildUpdated,
  onStartLearn,
  onOpenRewardsShop,
  onOpenSpecialPacks,
  onOpenGames,
}: Props) {
  const [iconPanelOpen, setIconPanelOpen] = useState(false);

  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const { toast, showToast } = useToast(1800);

  const unlocked = getUnlockedLayerSnapshotA(child);
  const interestLocked = (unlocked.unlockedLayer as number) < 2;

  const unlockedIconIds = useMemo(() => {
    const base = new Set<string>(child.unlockedIconIds ?? []);
    if (child.iconId) base.add(child.iconId);
    return Array.from(base.values());
  }, [child.unlockedIconIds, child.iconId]);

  function refreshChildFromStore() {
    const latest = ChildrenStore.getById(child.id) ?? child;
    onChildUpdated(latest);
  }

  const arrow = isRtl ? '←' : '→';
  const changeIconLabel = `${iconToDisplay(child.iconId)} ${t(
    'childHub.changeIcon'
  )} • ${iconPanelOpen ? t('childHub.hide') : t('childHub.show')} ${arrow}`;

  return (
    <ScrollView contentContainerStyle={[styles.container, { alignItems: 'stretch' }]}>
      <TopBar title={t('childHub.title')} onBack={onBack} dir={dir} />

      <View style={{ marginTop: 14 }}>
        <Text style={[styles.greeting, isRtl && styles.rtl]}>
          {t('childHub.greeting', { name: child.name })}
        </Text>

        <View style={styles.toastWrap}>
          {!!toast && <Text style={[styles.toastText, isRtl && styles.metaRtl]}>{toast}</Text>}
        </View>

        <View style={[styles.actionsRow, isRtl && styles.rowRtl]}>
          <Button variant="primary" onClick={onStartLearn}>
            {t('childHub.startLearning')}
          </Button>

          <Button
            onClick={onOpenSpecialPacks}
            disabled={interestLocked}
            title={
              interestLocked
                ? isRtl
                  ? 'חבילות עניין נפתחות משכבה 2'
                  : 'Interest packs unlock from layer 2'
                : undefined
            }
          >
            {t('childHub.specialPacks')}
          </Button>

          <Button onClick={onOpenGames}>{t('childHub.games')}</Button>

          <Button onClick={onOpenRewardsShop}>{t('childHub.iconShop')}</Button>
        </View>

        {/* Change Icon */}
        <View style={{ marginTop: 14 }}>
          <Button
            onClick={() => setIconPanelOpen((v) => !v)}
            style={styles.fullWidthBtn}
          >
            {changeIconLabel}
          </Button>

          {iconPanelOpen && (
            <View style={{ marginTop: 10 }}>
              <Card style={{ padding: 12 }}>
                <IconPicker
                  value={child.iconId}
                  unlockedIconIds={unlockedIconIds}
                  onPick={(iconId: string) => {
                    // support both APIs (older/newer)
                    const ok = (ChildrenStore as any).setSelectedIcon
                      ? (ChildrenStore as any).setSelectedIcon(child.id, iconId)
                      : (ChildrenStore as any).setActiveIcon
                        ? (ChildrenStore as any).setActiveIcon(child.id, iconId).ok
                        : false;

                    if (!ok) {
                      showToast(t('childHub.iconNotUnlocked'));
                      return;
                    }

                    showToast(t('childHub.iconSelected'));
                    refreshChildFromStore();
                  }}
                />
              </Card>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 820,
    alignSelf: 'center',
    width: '100%',
  },

  greeting: { fontSize: 18, fontWeight: '900' },

  toastWrap: { marginTop: 10, minHeight: 22, justifyContent: 'center' },
  toastText: { fontSize: 16 },

  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },

  rowRtl: { flexDirection: 'row-reverse' as const },

  fullWidthBtn: { alignSelf: 'stretch' },

  rtl: { textAlign: 'right' as const },
  metaRtl: { textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
