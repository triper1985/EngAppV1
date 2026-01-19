// src/App.tsx
import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';

import type { ChildProfile } from './types';
import { ChildrenStore } from './storage/childrenStore';

import { HomeScreen } from './screens/child/HomeScreen';
import { ChildHubScreen } from './screens/child/ChildHubScreen';
import { RewardsShopScreen } from './screens/rewards/RewardsShopScreen';

import { LearnFlow } from './screens/learn';
import { ParentHomeScreen } from './screens/parent/ParentHomeScreen';
import { ParentProgressScreen } from './screens/parent/ParentProgressScreen';
import { ParentChildEditorScreen } from './screens/parent/ParentChildEditorScreen';
import { ParentUsersScreen } from './screens/parent/ParentUsersScreen';
import { ParentPinSettingsScreen } from './screens/parent/ParentPinSettingsScreen';
import { ParentAudioSettingsScreen } from './screens/parent/ParentAudioSettingsScreen';
import { ParentChildAudioSettingsScreen } from './screens/parent/ParentChildAudioSettingsScreen';

// V4
import { SpecialPacksScreen } from './screens/interest/SpecialPacksScreen';
import { SpecialPackUnitsScreen } from './screens/interest/SpecialPackUnitsScreen';
import { SpecialPackUnitScreen } from './screens/interest/SpecialPackUnitScreen';
import { GamesHubScreen } from './screens/games/GamesHubScreen';

import { I18nProvider } from './i18n/I18nContext';

import { AuthProvider, useAuth } from './screens/auth/AuthProvider';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';


type Screen =
  | 'home'
  | 'childHub'
  | 'learn'
  | 'rewardsShop'
  // V4
  | 'specialPacks'
  | 'specialPackUnits'
  | 'specialPackUnit'
  | 'gamesHub'
  // Auth
  | 'login'
  | 'register'
  // Parent
  | 'parentHome'
  | 'parentProgress'
  | 'parentChildSettings'
  | 'parentUsers'
  | 'parentPin'
  | 'parentAudioSettings'
  | 'parentChildAudioSettings';

type SpecialMode = 'learn' | 'quiz';

function isParentScreen(screen: Screen) {
  return (
    screen === 'parentHome' ||
    screen === 'parentProgress' ||
    screen === 'parentChildSettings' ||
    screen === 'parentUsers' ||
    screen === 'parentPin' ||
    screen === 'parentAudioSettings' ||
    screen === 'parentChildAudioSettings'
  );
}

// safe localStorage access (web-only)
function getWebLocalStorage(): Storage | null {
  return (globalThis as any)?.localStorage ?? null;
}

function AppInner() {
  const { isReady, session } = useAuth();

  const [screen, setScreen] = useState<Screen>('home');

  const [users, setUsers] = useState<ChildProfile[]>([]);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);

  // Parent selection state
  const [parentSelectedChildId, setParentSelectedChildId] = useState<string | null>(null);

  // Parent UI language should be stable (not depend on last selected child)
  const [parentLocale, setParentLocale] = useState<'en' | 'he'>(() => {
    const ls = getWebLocalStorage();
    if (!ls) return 'en';
    const v = ls.getItem('parentLocale');
    return v === 'he' ? 'he' : 'en';
  });

  useEffect(() => {
    const ls = getWebLocalStorage();
    if (!ls) return;
    ls.setItem('parentLocale', parentLocale);
  }, [parentLocale]);

  // V4 navigation state
  const [specialPackId, setSpecialPackId] = useState<string | null>(null);
  const [specialGroupId, setSpecialGroupId] = useState<string | null>(null);
  const [specialMode, setSpecialMode] = useState<SpecialMode>('learn');

  function syncUsersFromStore(forceActive = true) {
    ChildrenStore.ensureDefaultsIfEmpty();
    const nextUsers = ChildrenStore.list();
    setUsers(nextUsers);

    // keep parent selected child stable if possible
    if (!parentSelectedChildId && nextUsers[0]) {
      setParentSelectedChildId(nextUsers[0].id);
    } else if (parentSelectedChildId) {
      const stillExists = nextUsers.some((u) => u.id === parentSelectedChildId);
      if (!stillExists) setParentSelectedChildId(nextUsers[0]?.id ?? null);
    }

    if (!forceActive) return;

    if (activeChild) {
      const fresh = nextUsers.find((u) => u.id === activeChild.id) ?? null;
      setActiveChild(fresh);
    }
  }

  useEffect(() => {
    syncUsersFromStore(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard: Parent screens require login
  useEffect(() => {
    if (!isReady) return;
    if (isParentScreen(screen) && !session) {
      setScreen('login');
    }
  }, [isReady, session, screen]);

  const ui = (() => {
    // Loading auth state (only matters when we need it)
    if (!isReady && (screen === 'login' || screen === 'register' || isParentScreen(screen))) {
      return (
        <View style={{ padding: 16 }}>
          <Text>Loading…</Text>
        </View>
      );
    }

    // -------------------------
    // AUTH
    // -------------------------
    if (screen === 'login') {
      return (
        <LoginScreen
          onGoRegister={() => setScreen('register')}
          onLoggedIn={() => setScreen('parentHome')}
          onBack={() => setScreen('home')}
        />
      );
    }

    if (screen === 'register') {
      return (
        <RegisterScreen
          onGoLogin={() => setScreen('login')}
          onRegistered={() => setScreen('parentHome')}
          onBack={() => setScreen('home')}
        />
      );
    }

    // -------------------------
    // HOME
    // -------------------------
    if (screen === 'home') {
      return (
<HomeScreen
  users={users}
  onUserChanged={(userId: string) => {
    const child = users.find((u) => u.id === userId);
    if (!child) return;

    // אם המטרה של onUserChanged היא “לשמור בחירה”/לעדכן state
    setActiveChild(child);
  }}
  onSelectChild={(userId: string) => {
    const child = users.find((u) => u.id === userId);
    if (!child) return;

    setActiveChild(child);
    setScreen('childHub');
  }}
  onEnterParent={() => {
    if (!session) setScreen('login');
    else setScreen('parentHome');
  }}
/>



      );
    }

    // -------------------------
    // CHILD HUB
    // -------------------------
    if (screen === 'childHub' && activeChild) {
      return (
        <ChildHubScreen
          child={activeChild}
          onBack={() => setScreen('home')}
          onChildUpdated={(updated: ChildProfile) => {
            setActiveChild(updated);
            syncUsersFromStore(false);
          }}
          onStartLearn={() => setScreen('learn')}
          onOpenRewardsShop={() => setScreen('rewardsShop')}
          // V4
          onOpenSpecialPacks={() => setScreen('specialPacks')}
          onOpenGames={() => setScreen('gamesHub')}
        />
      );
    }

    // -------------------------
    // SPECIAL PACKS (V4)
    // -------------------------
    if (screen === 'specialPacks' && activeChild) {
      return (
        <SpecialPacksScreen
          child={activeChild}
          onBack={() => setScreen('childHub')}
          onOpenPack={(packId: string) => {
            setSpecialPackId(packId);
            setSpecialGroupId(null);
            setScreen('specialPackUnits');
          }}
        />
      );
    }

    if (screen === 'specialPackUnits' && activeChild) {
      return (
        <SpecialPackUnitsScreen
          child={activeChild}
          packId={specialPackId}
          onBack={() => setScreen('specialPacks')}
          onOpenGroup={(groupId: string, mode: SpecialMode) => {
            setSpecialGroupId(groupId);
            setSpecialMode(mode);
            setScreen('specialPackUnit');
          }}
        />
      );
    }

    if (
      screen === 'specialPackUnit' &&
      activeChild &&
      specialPackId &&
      specialGroupId
    ) {
      return (
        <SpecialPackUnitScreen
          child={activeChild}
          packId={specialPackId as any}
          groupId={specialGroupId as any}
          mode={specialMode}
          onBack={() => setScreen('specialPackUnits')}
        />
      );
    }

    // -------------------------
    // GAMES HUB (V4)
    // -------------------------
    if (screen === 'gamesHub' && activeChild) {
      return (
        <GamesHubScreen
          child={activeChild}
          onBack={() => setScreen('childHub')}
        />
      );
    }

    // -------------------------
    // REWARDS SHOP
    // -------------------------
    if (screen === 'rewardsShop' && activeChild) {
      return (
        <RewardsShopScreen
          child={activeChild}
          onBack={() => setScreen('childHub')}
          onChildUpdated={(updated: ChildProfile) => {
            setActiveChild(updated);
            syncUsersFromStore(false);
          }}
        />
      );
    }

    // -------------------------
    // PARENT (requires session)
    // -------------------------
    if (isParentScreen(screen)) {
      // session guard already handled by effect, but keep safe:
      if (!session) return null;

      if (screen === 'parentHome') {
        return (
          <ParentHomeScreen
            users={users}
            parentLocale={parentLocale}
            onChangeParentLocale={(loc) => setParentLocale(loc)}
            onExit={() => setScreen('home')}
            onOpenProgress={() => setScreen('parentProgress')}
            onOpenChildSettings={() => setScreen('parentChildSettings')}
            onOpenUsers={() => setScreen('parentUsers')}
            onOpenParentPin={() => setScreen('parentPin')}
            onOpenAudioSettings={() => setScreen('parentAudioSettings')}
          />
        );
      }

      if (screen === 'parentProgress') {
        return (
          <ParentProgressScreen
            users={users}
            selectedChildId={parentSelectedChildId}
            onSelectChild={(id) => setParentSelectedChildId(id)}
            onBack={() => setScreen('parentHome')}
          />
        );
      }

      if (screen === 'parentChildSettings') {
        return (
          <ParentChildEditorScreen
            users={users}
            selectedChildId={parentSelectedChildId}
            onSelectChild={(id) => setParentSelectedChildId(id)}
            onUsersChanged={(next) => {
              setUsers(next);
              if (!parentSelectedChildId && next[0])
                setParentSelectedChildId(next[0].id);
            }}
            onOpenChildAudio={() => setScreen('parentChildAudioSettings')}
            onBack={() => setScreen('parentHome')}
          />
        );
      }

      if (screen === 'parentChildAudioSettings' && parentSelectedChildId) {
        const child = users.find((u) => u.id === parentSelectedChildId) ?? null;
        if (!child) return null;

        return (
          <ParentChildAudioSettingsScreen
            child={child}
            onBack={() => setScreen('parentChildSettings')}
            onChildUpdated={(updated) => {
              setUsers((prev) =>
                prev.map((u) => (u.id === updated.id ? updated : u))
              );
            }}
          />
        );
      }

      if (screen === 'parentUsers') {
        return (
          <ParentUsersScreen
            users={users}
            onUsersChanged={(next) => {
              setUsers(next);
              if (!parentSelectedChildId && next[0])
                setParentSelectedChildId(next[0].id);
            }}
            onBack={() => setScreen('parentHome')}
          />
        );
      }

      if (screen === 'parentAudioSettings') {
        return <ParentAudioSettingsScreen onBack={() => setScreen('parentHome')} />;
      }

      if (screen === 'parentPin') {
        return <ParentPinSettingsScreen onBack={() => setScreen('parentHome')} />;
      }
    }

    // -------------------------
    // LEARN FLOW
    // -------------------------
    if (screen === 'learn' && activeChild) {
      return (
        <LearnFlow
          child={activeChild}
          onBack={() => setScreen('childHub')}
          onChildUpdated={(updated: ChildProfile) => {
            setActiveChild(updated);
            syncUsersFromStore(false);
          }}
        />
      );
    }

    // Native-safe fallback (NO HTML)
    return (
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Unknown screen</Text>
        <Pressable
          onPress={() => setScreen('home')}
          style={{ paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' }}
        >
          <Text>Go Home</Text>
        </Pressable>
      </View>
    );
  })();

  return (
<I18nProvider
  child={activeChild ?? null}
  forcedLocale={isParentScreen(screen) ? parentLocale : undefined}
>
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    {ui}
  </View>
</I18nProvider>

  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
