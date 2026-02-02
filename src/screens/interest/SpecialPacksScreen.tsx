// src/screens/interest/SpecialPacksScreen.tsx
import type { ChildProfile } from '../../types';
import type { ContentPackId } from '../../content/types';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

import {
  getPackById,
  listVisibleInterestPacks,
  isInterestPack,
  isHiddenPack,
} from '../../content/registry';
import { isPackUnlockedForChildA } from '../../content';
import { getPackDescription, getPackTitle } from '../../content/localize';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onOpenPack: (packId: ContentPackId) => void;
};

export function SpecialPacksScreen({ child, onBack, onOpenPack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const selectedIds = (child.selectedPackIds ?? []) as string[];

  const selectedInterestPacks = selectedIds
    .map((id) => getPackById(id as ContentPackId))
    .filter(Boolean)
    .filter((p) => isInterestPack(p!) && !isHiddenPack(p!));

  const availableInterest = listVisibleInterestPacks();
  const availableNotSelected = availableInterest.filter((p) => !selectedIds.includes(p.id));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={t('specialPacks.title')}
        onBack={onBack}
        backLabel={t('learn.common.back')}
        dir={dir}
      />

      {selectedInterestPacks.length === 0 ? (
        <Card style={{ marginTop: 14 }}>
          <Text style={[styles.h2, isRtl && styles.rtl]}>{t('specialPacks.noneSelected')}</Text>

          {availableNotSelected.length > 0 && (
            <Text style={[styles.muted, styles.mt8, isRtl && styles.rtl]}>
              {isRtl
                ? 'בקשו מהורה להפעיל חבילות כדי לפתוח אותן כאן.'
                : 'Ask a parent to enable packs to unlock them here.'}
            </Text>
          )}
        </Card>
      ) : (
        <View style={styles.stack}>
          {selectedInterestPacks.map((p) => {
            const title = getPackTitle(p!, t);
            const desc = getPackDescription(p!, t);

            const unlock = isPackUnlockedForChildA(child, p!);
            const locked = !unlock.unlocked;

            return (
              <Card key={p!.id}>
                <View style={[styles.row, isRtl && styles.rowRtl]}>
                  <View style={[styles.left, isRtl && styles.rowRtl]}>
                    <Text style={styles.emoji}>{p!.emoji ?? '📦'}</Text>

                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[styles.title, isRtl && styles.rtl]} numberOfLines={1}>
                        {title}
                      </Text>

                      {!!desc && (
                        <Text style={[styles.muted, styles.mt4, isRtl && styles.rtl]}>{desc}</Text>
                      )}
                    </View>
                  </View>

                  <Button
                    variant="primary"
                    onClick={() => onOpenPack(p!.id)}
                    disabled={locked}
                    title={
                      locked
                        ? isRtl
                          ? `נפתח משכבה ${unlock.requiredLayer}`
                          : `Unlocks from layer ${unlock.requiredLayer}`
                        : undefined
                    }
                  >
                    {locked ? (isRtl ? 'נעול' : 'Locked') : t('specialPacks.enter')}
                  </Button>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {availableNotSelected.length > 0 && (
        <View style={styles.mt16}>
          <Text style={[styles.sectionTitle, isRtl && styles.rtl]}>
            {isRtl ? 'זמינות (לא נבחרו):' : 'Available (not selected):'}
          </Text>

          <View style={styles.stack}>
            {availableNotSelected.map((p) => {
              const title = getPackTitle(p, t);
              const desc = getPackDescription(p, t);

              return (
                <Card key={p.id} style={{ opacity: 0.65 }}>
                  <View style={[styles.left, isRtl && styles.rowRtl]}>
                    <Text style={styles.emoji}>{p.emoji ?? '📦'}</Text>

                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[styles.title, isRtl && styles.rtl]} numberOfLines={1}>
                        {title}
                      </Text>

                      {!!desc && (
                        <Text style={[styles.muted, styles.mt4, isRtl && styles.rtl]}>{desc}</Text>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      )}
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

  stack: { marginTop: 14, gap: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rowRtl: { flexDirection: 'row-reverse' as const },

  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },

  emoji: { fontSize: 34 },
  title: { fontWeight: '900', fontSize: 18 },
  h2: { fontWeight: '900', fontSize: 16 },
  muted: { fontSize: 13, opacity: 0.75, lineHeight: 20 },

  sectionTitle: { fontWeight: '900', marginBottom: 8, opacity: 0.85 },

  rtl: { textAlign: 'right' as const },

  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
});

export default SpecialPacksScreen;
