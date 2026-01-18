// src/content/dev/runChecks.ts
/**
 * Dev-only checks runner
 * ----------------------
 * מריץ בדיקות תשתית (validate + compatibility) ומדפיס ל-console.
 * Opt-in בלבד: לא מיובא אוטומטית לשום מקום.
 */

import { listBuiltInPacks, validateBuiltInPacks } from '../index';

import { validatePacksBeginnerCompatibility } from '../compatibility/beginnerTrackCompatibility';

type Issue = {
  level: 'error' | 'warn';
  code: string;
  message: string;
  packId?: string;
  unitId?: string;
  path?: string;
};

function printIssues(title: string, issues: Issue[]) {
  if (issues.length === 0) {
    console.log(`✅ ${title}: no issues`);
    return;
  }

  console.group(`⚠️ ${title} (${issues.length})`);
  for (const i of issues) {
    const prefix = i.level === 'error' ? '❌' : '⚠️';
    const where =
      [
        i.packId && `pack=${i.packId}`,
        i.unitId && `unit=${i.unitId}`,
        i.path && `path=${i.path}`,
      ]
        .filter(Boolean)
        .join(' | ') || '—';

    const line = `${prefix} [${i.level.toUpperCase()}] ${i.code}: ${i.message}`;
    if (i.level === 'error') {
      console.error(line);
    } else {
      console.warn(line);
    }
    console.log(`   ↳ ${where}`);
  }
  console.groupEnd();
}

export function runContentChecks() {
  const packs = listBuiltInPacks();

  console.group('🧪 Content Foundation – Checks');

  const structureIssues = validateBuiltInPacks();
  printIssues('Structure validation', structureIssues);

  const compatIssues = validatePacksBeginnerCompatibility(packs);
  printIssues('BeginnerTrack compatibility', compatIssues);

  const hasErrors = [...structureIssues, ...compatIssues].some(
    (i) => i.level === 'error'
  );

  if (hasErrors) {
    console.log('❌ Checks finished with ERRORS');
  } else {
    console.log('✅ Checks finished successfully');
  }

  console.groupEnd();

  return {
    ok: !hasErrors,
    structureIssues,
    compatIssues,
  };
}
