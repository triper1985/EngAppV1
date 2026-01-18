// src/components/UserList.tsx
import type { ChildProfile } from '../types';
import { iconToDisplay } from '../data/icons';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  onAdd: () => void;
  onEdit: (u: ChildProfile) => void;
  onDelete: (u: ChildProfile) => void;
};

export function UserList({ users, onAdd, onEdit, onDelete }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  return (
    <Card style={{ marginTop: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: isRtl ? 'flex-start' : 'flex-end',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          direction: dir,
        }}
      >
        <Button variant="primary" onClick={onAdd}>
          {t('parent.users.list.add')}
        </Button>
      </div>

      {users.length === 0 ? (
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            opacity: 0.75,
            direction: dir,
            textAlign: isRtl ? 'right' : 'left',
          }}
        >
          {t('parent.users.list.empty')}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {users.map((u) => (
            <UserRow key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </Card>
  );
}

function UserRow({
  user,
  onEdit,
  onDelete,
}: {
  user: ChildProfile;
  onEdit: (u: ChildProfile) => void;
  onDelete: (u: ChildProfile) => void;
}) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 14,
        padding: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        background: '#fff',
        direction: dir,
      }}
    >
      {/* Left/Right block (name + icon) */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexDirection: isRtl ? 'row-reverse' : 'row',
          textAlign: isRtl ? 'right' : 'left',
          minWidth: 0,
        }}
      >
        <span style={{ fontSize: 18 }}>{iconToDisplay(user.iconId)}</span>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>
            {user.name}{' '}
            <span style={{ opacity: 0.5, fontWeight: 500 }}>({user.id})</span>
          </div>
        </div>
      </div>

      {/* Actions block */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: isRtl ? 'flex-start' : 'flex-end',
        }}
      >
        <Button onClick={() => onEdit(user)}>
          {t('parent.users.row.edit')}
        </Button>
        <Button
          onClick={() => onDelete(user)}
          style={{ border: '1px solid #b00020', color: '#b00020' }}
        >
          {t('parent.users.row.delete')}
        </Button>
      </div>
    </div>
  );
}
