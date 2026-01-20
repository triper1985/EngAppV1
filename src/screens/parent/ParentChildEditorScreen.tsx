// src/screens/parent/ParentChildEditorScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import type { ChildProfile, LevelId } from '../../types';
import { iconToDisplay } from '../../data/icons';

import { ChildrenStore } from '../../storage/childrenStore';
import { LEVELS, getLevel } from '../../data/levels';

import {
  listVisibleInterestPacks,
  isInterestPack,
  isHiddenPack,
} from '../../content/registry';
import { getPackTitle, getPackDescription } from '../../content/localize';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  onUsersChanged: (users: ChildProfile[]) => void;
  onOpenChildAudio: () => void;
  onBack: () => void;
};

export function ParentChildEditorScreen({
  users,
  selectedChildId,
  onSelectChild,
  onUsersChanged,
  onOpenChildAudio,
  onBack,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const isHe = isRtl; // מספיק לצרכי fallback קצר

  const [childId, setChildId] = useState<string>(selectedChildId ?? '');
  const [toast, setToast] = useState<string | null>(null);

  // keep selection in sync
  useEffect(() => {
    setChildId(selectedChildId ?? '');
  }, [selectedChildId]);

  // if no selectedChildId provided, pick first available (prevents "empty selection")
  useEffect(() => {
    if (!childId && users.length > 0) {
      const first = users[0];
      setChildId(first.id);
      onSelectChild(first.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users.length]);

  useEffect(() => {
    if (!toast) return;
    const tt = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(tt);
  }, [toast]);

  const child = useMemo(
    () => users.find((u) => u.id === childId) ?? null,
    [users, childId]
  );

  const interestPacks = useMemo(() => {
    return listVisibleInterestPacks().filter(
      (p) => isInterestPack(p) && !isHiddenPack(p)
    );
  }, []);

  function refreshUsers() {
    const fresh = ChildrenStore.list();
    onUsersChanged(fresh);
  }

  function showToast(msg: string) {
    setToast(msg);
  }

  function setLevel(levelId: LevelId) {
    if (!child) return;
    const updated = ChildrenStore.setLevelId(child.id, levelId);
    if (!updated) return;
    refreshUsers();
    showToast(t('parent.common.savedOk'));
  }

  function setInterestPackEnabled(packId: string, enabled: boolean) {
    if (!child) return;
    const updated = ChildrenStore.setPackEnabled(child.id, packId, enabled);
    if (!updated) return;
    refreshUsers();
    showToast(t('parent.common.savedOk'));
  }

  const selectedPackIds = new Set<string>(child?.selectedPackIds ?? []);
  const currentLevelId = (child?.levelId ?? 'beginner') as LevelId;

  // Enable / Disable labels with safe fallback (until you add i18n keys)
  function enableLabel() {
    const key = 'parent.childEditor.interestPacks.enable';
    const v = t(key);
    return v === key ? (isHe ? 'הפעל' : 'Enable') : v;
  }

  function disableLabel() {
    const key = 'parent.childEditor.interestPacks.disable';
    const v = t(key);
    return v === key ? (isHe ? 'בטל' : 'Disable') : v;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <TopBar
        title={t('parent.childEditor.title')}
        onBack={onBack}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {toast ? (
        <Text style={{ fontSize: 14, marginTop: 10, minHeight: 22, opacity: 0.85 }}>
          {toast}
        </Text>
      ) : null}

      {/* Select child */}
      <View style={{ marginTop: 14 }}>
        <Card>
          <Text
            style={{
              fontWeight: '900',
              marginBottom: 10,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.childEditor.selectChild')}
          </Text>

          {users.length === 0 ? (
            <Text style={{ opacity: 0.75, textAlign: isRtl ? 'right' : 'left' }}>
              {t('parent.progress.noChildSelected')}
            </Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: isRtl ? 'flex-end' : 'flex-start',
              }}
            >
              {users.map((u) => {
                const active = u.id === childId;

                return (
                  <View key={u.id} style={{ marginEnd: 10, marginBottom: 10 }}>
                    <Button
                      // ✅ FIX: selected child should be PRIMARY (black) like Progress screen
                      variant={active ? 'primary' : 'secondary'}
                      onClick={() => {
                        setChildId(u.id);
                        onSelectChild(u.id);
                      }}
                    >
                      {/* ✅ structured content so name never disappears */}
                      <View
                        style={{
                          flexDirection: isRtl ? 'row-reverse' : 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            marginStart: isRtl ? 8 : 0,
                            marginEnd: isRtl ? 0 : 8,
                            opacity: active ? 1 : 0.9,
                          }}
                        >
                          {iconToDisplay(u.iconId)}
                        </Text>

                        <Text
                          style={{
                            fontWeight: '800',
                            opacity: active ? 1 : 0.9,
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {u.name}
                        </Text>
                      </View>
                    </Button>
                  </View>
                );
              })}
            </View>
          )}

          {child ? (
            <>
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  opacity: 0.7,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {t('parent.childEditor.selected')}{' '}
                <Text style={{ fontWeight: '900' }}>{child.name}</Text>
              </Text>

              <View
                style={{
                  marginTop: 10,
                  alignItems: isRtl ? 'flex-end' : 'flex-start',
                }}
              >
                <Button variant="secondary" onClick={onOpenChildAudio}>
                  <View
                    style={{
                      flexDirection: isRtl ? 'row-reverse' : 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ marginStart: isRtl ? 8 : 0, marginEnd: isRtl ? 0 : 8 }}>
                      🎧
                    </Text>
                    <Text>{t('parent.childAudio.buttonOpen')}</Text>
                  </View>
                </Button>
              </View>
            </>
          ) : null}
        </Card>
      </View>

      {/* Level */}
      <View style={{ marginTop: 14 }}>
        <Card>
          <Text
            style={{
              fontWeight: '900',
              marginBottom: 10,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.childEditor.level')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: isRtl ? 'flex-end' : 'flex-start',
            }}
          >
            {LEVELS.map((l) => {
              const active = currentLevelId === l.id;

              // פה כן הגיוני להשאיר "primary" כדי להראות בחירה (זה לא כפתורי משתמשים)
              return (
                <View key={l.id} style={{ marginEnd: 8, marginBottom: 8 }}>
                  <Button
                    variant={active ? 'primary' : 'secondary'}
                    onClick={() => setLevel(l.id)}
                  >
                    {l.title}
                  </Button>
                </View>
              );
            })}
          </View>

          {child ? (
            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                opacity: 0.7,
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('parent.childEditor.current')}{' '}
              <Text style={{ fontWeight: '900' }}>
                {getLevel(child.levelId).title}
              </Text>
            </Text>
          ) : null}
        </Card>
      </View>

      {/* Interest Packs */}
      <View style={{ marginTop: 14 }}>
        <Card>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 16,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.childEditor.interestPacks.title')}
          </Text>

          <Text
            style={{
              marginTop: 6,
              opacity: 0.75,
              fontSize: 13,
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {t('parent.childEditor.interestPacks.subtitle')}
          </Text>

          <View style={{ marginTop: 12 }}>
            {interestPacks.map((p) => {
              const enabled = selectedPackIds.has(p.id);
              const title = getPackTitle(p, t);
              const desc = getPackDescription(p, t);

              return (
                <View
                  key={p.id}
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.08)',
                    borderRadius: 14,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: isRtl ? 'row-reverse' : 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 28, width: 38, textAlign: 'center' }}>
                      {p.emoji ?? '📦'}
                    </Text>

                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        style={{
                          fontWeight: '900',
                          textAlign: isRtl ? 'right' : 'left',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {title}
                      </Text>

                      {desc ? (
                        <Text
                          style={{
                            marginTop: 2,
                            fontSize: 12,
                            opacity: 0.7,
                            textAlign: isRtl ? 'right' : 'left',
                          }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {desc}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{ marginStart: isRtl ? 0 : 10, marginEnd: isRtl ? 10 : 0 }}>
                      <Button
                        variant="secondary"
                        onClick={() => setInterestPackEnabled(p.id, !enabled)}
                      >
                        {enabled ? disableLabel() : enableLabel()}
                      </Button>
                    </View>
                  </View>
                </View>
              );
            })}

            {interestPacks.length === 0 ? (
              <Text
                style={{
                  marginTop: 6,
                  opacity: 0.7,
                  fontSize: 13,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {t('parent.childEditor.interestPacks.empty')}
              </Text>
            ) : null}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
