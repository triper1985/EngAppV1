// src/screens/parent/ParentUsersScreen.tsx
import { useState } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import type { ChildProfile } from '../../types';

import { ChildrenStore } from '../../storage/childrenStore';
import { ParentReport } from '../../parentReport';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  onUsersChanged: (users: ChildProfile[]) => void;
  onBack: () => void;
};

type UiState =
  | { kind: 'none' }
  | { kind: 'add'; name: string; error?: string }
  | { kind: 'edit'; user: ChildProfile; name: string; error?: string }
  | { kind: 'delete'; user: ChildProfile };

export function ParentUsersScreen({ users, onUsersChanged, onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const [ui, setUi] = useState<UiState>({ kind: 'none' });

  const rowDir = isRtl ? 'row-reverse' : 'row';
  const alignText = isRtl ? 'right' : 'left';

  function tr(key: string, fallback: string, vars?: any) {
    const out = t(key as any, vars);
    return out === key ? fallback : out;
  }

  function refreshUsers() {
    onUsersChanged(ChildrenStore.list());
  }

  function closeUi() {
    setUi({ kind: 'none' });
  }

  function onBackPress() {
    if (ui.kind !== 'none') {
      closeUi();
      return;
    }
    onBack();
  }

  function submitAdd() {
    if (ui.kind !== 'add') return;

    const name = ui.name.trim();
    if (!name) {
      setUi({
        ...ui,
        error: tr('parent.users.error.nameRequired', 'Name is required'),
      });
      return;
    }

    const added = ChildrenStore.add(name);
    if (!added) {
      setUi({
        ...ui,
        error: tr('parent.users.error.nameExists', 'Name already exists'),
      });
      return;
    }

    refreshUsers();
    closeUi();
  }

  function submitEdit() {
    if (ui.kind !== 'edit') return;

    const name = ui.name.trim();
    if (!name) {
      setUi({
        ...ui,
        error: tr('parent.users.error.nameRequired', 'Name is required'),
      });
      return;
    }

    const ok = ChildrenStore.rename(ui.user.id, name);
    if (!ok) {
      setUi({
        ...ui,
        error: tr('parent.users.error.nameExists', 'Name already exists'),
      });
      return;
    }

    refreshUsers();
    closeUi();
  }

  function submitDelete() {
    if (ui.kind !== 'delete') return;

    try {
      ParentReport.resetAllForChild(ui.user.id);
    } catch (e) {
      console.log('[ParentUsers] resetAllForChild failed (non-fatal):', e);
    }

    try {
      ChildrenStore.remove(ui.user.id);
    } catch (e) {
      console.log('[ParentUsers] remove failed:', e);
    }

    refreshUsers();
    closeUi();
  }

  function submitDevAllUnlocked() {
    try {
      ChildrenStore.addDevAllUnlocked();
      refreshUsers();
    } catch (e) {
      console.log('[ParentUsers] addDevAllUnlocked failed:', e);
    }
  }

  const labelEdit = tr('parent.users.button.edit', isRtl ? 'ערוך' : 'Edit');
  const labelDelete = tr('parent.users.button.delete', isRtl ? 'מחק' : 'Delete');
  const labelAddUser = tr(
    'parent.users.button.addUser',
    isRtl ? 'הוסף משתמש' : 'Add user'
  );

  const labelCancel = tr('parent.users.button.cancel', isRtl ? 'ביטול' : 'Cancel');
  const labelAdd = tr('parent.users.button.add', isRtl ? 'הוסף' : 'Add');
  const labelSave = tr('parent.users.button.save', isRtl ? 'שמור' : 'Save');

  const titleAdd = tr('parent.users.modal.addTitle', isRtl ? 'הוספת משתמש' : 'Add user');
  const titleRename = tr(
    'parent.users.modal.renameTitle',
    isRtl ? 'שינוי שם' : 'Rename'
  );
  const hintAdd = tr(
    'parent.users.modal.addHint',
    isRtl ? 'הקלד שם לילד' : 'Enter a child name'
  );
  const hintRename = (name: string) =>
    tr(
      'parent.users.modal.renameHint',
      isRtl ? `שנה שם עבור ${name}` : `Rename ${name}`,
      { name }
    );

  const phAdd = tr(
    'parent.users.modal.addPlaceholder',
    isRtl ? 'שם הילד' : 'Child name'
  );
  const phRename = tr(
    'parent.users.modal.renamePlaceholder',
    isRtl ? 'שם חדש' : 'New name'
  );

  const titleDelete = tr(
    'parent.users.modal.deleteTitle',
    isRtl ? 'מחיקת משתמש' : 'Delete user'
  );
  const hintDelete = (name: string) =>
    tr('parent.users.modal.deleteHint', isRtl ? `למחוק את ${name}?` : `Delete ${name}?`, {
      name,
    });

  const labelDev = isRtl ? 'DEV: צור משתמש פתוח הכול' : 'DEV: Create unlocked user';

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <TopBar
        title={t('parent.users.title')}
        onBack={onBackPress}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {/* List */}
      <View style={{ marginTop: 12 }}>
        {users.length === 0 ? (
          <Text style={{ opacity: 0.75, textAlign: alignText }}>
            {tr('parent.users.empty', isRtl ? 'אין משתמשים' : 'No users yet')}
          </Text>
        ) : (
          users.map((u) => (
            <View key={u.id} style={{ marginBottom: 10 }}>
              <Card>
                <View style={{ flexDirection: rowDir, alignItems: 'center' }}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        fontWeight: '900',
                        fontSize: 16,
                        textAlign: alignText,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {u.name}
                    </Text>
                  </View>

                  <View style={{ marginStart: isRtl ? 0 : 10, marginEnd: isRtl ? 10 : 0 }}>
                    <Button
                      variant="secondary"
                      onClick={() => setUi({ kind: 'edit', user: u, name: u.name })}
                    >
                      {labelEdit}
                    </Button>
                  </View>

                  <View style={{ marginStart: isRtl ? 0 : 8, marginEnd: isRtl ? 8 : 0 }}>
                    <Button variant="secondary" onClick={() => setUi({ kind: 'delete', user: u })}>
                      {labelDelete}
                    </Button>
                  </View>
                </View>
              </Card>
            </View>
          ))
        )}
      </View>

      {/* Add + DEV buttons */}
      <View
        style={{
          marginTop: 6,
          flexDirection: rowDir,
          alignItems: 'center',
          justifyContent: isRtl ? 'flex-end' : 'flex-start',
          gap: 10,
        }}
      >
        <Button onClick={() => setUi({ kind: 'add', name: '' })}>{labelAddUser}</Button>

        {__DEV__ ? (
          <Button variant="secondary" onClick={submitDevAllUnlocked}>
            {labelDev}
          </Button>
        ) : null}
      </View>

      {/* Add / Edit inline form */}
      {ui.kind === 'add' || ui.kind === 'edit' ? (
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={{ fontWeight: '900', marginBottom: 8, textAlign: alignText }}>
              {ui.kind === 'add' ? titleAdd : titleRename}
            </Text>

            <Text style={{ fontSize: 13, opacity: 0.75, textAlign: alignText }}>
              {ui.kind === 'add' ? hintAdd : hintRename(ui.user.name)}
            </Text>

            <View style={{ marginTop: 10 }}>
              <TextInput
                value={ui.name}
                onChangeText={(txt) =>
                  setUi((prev) =>
                    prev.kind === 'add'
                      ? { ...prev, name: txt, error: undefined }
                      : prev.kind === 'edit'
                        ? { ...prev, name: txt, error: undefined }
                        : prev
                  )
                }
                placeholder={ui.kind === 'add' ? phAdd : phRename}
                autoFocus
                style={{
                  width: '100%',
                  fontSize: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.15)',
                  textAlign: alignText,
                }}
              />
            </View>

            {ui.error ? (
              <Text style={{ marginTop: 10, color: '#b00020', fontSize: 13, textAlign: alignText }}>
                {ui.error}
              </Text>
            ) : null}

            <View style={{ flexDirection: rowDir, marginTop: 14 }}>
              <View style={{ flex: 1, marginEnd: isRtl ? 10 : 10 }}>
                <Button variant="secondary" onClick={closeUi}>
                  {labelCancel}
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button variant="primary" onClick={ui.kind === 'add' ? submitAdd : submitEdit}>
                  {ui.kind === 'add' ? labelAdd : labelSave}
                </Button>
              </View>
            </View>
          </Card>
        </View>
      ) : null}

      {/* Delete confirm */}
      {ui.kind === 'delete' ? (
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={{ fontWeight: '900', marginBottom: 8, textAlign: alignText }}>
              {titleDelete}
            </Text>

            <Text style={{ fontSize: 13, opacity: 0.75, textAlign: alignText }}>
              {hintDelete(ui.user.name)}
            </Text>

            <View style={{ flexDirection: rowDir, marginTop: 14 }}>
              <View style={{ flex: 1, marginEnd: isRtl ? 10 : 10 }}>
                <Button variant="secondary" onClick={closeUi}>
                  {labelCancel}
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  variant="primary"
                  onClick={submitDelete}
                  style={{ backgroundColor: '#b00020', borderColor: '#b00020' } as any}
                >
                  {labelDelete}
                </Button>
              </View>
            </View>
          </Card>
        </View>
      ) : null}
    </ScrollView>
  );
}
