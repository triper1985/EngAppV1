// src/content/packs/interest/jobsPack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: Jobs
 * ---------------------------
 * 3 small units (balanced for Beginner):
 * - Emergency / Safety
 * - Community / Services
 * - Build / Fix
 *
 * Visuals are emoji-only (temporary).
 */
export const jobsPack: ContentPack = {
  id: 'jobs',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['jobs', 'vocab'],
  },

  title: 'Jobs',
  titleKey: 'content.pack.jobs.title',
  description: 'People who help and work.',
  descriptionKey: 'content.pack.jobs.desc',
  emoji: '🧑‍🚒',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    // Emergency / Safety
    { id: 'job_doctor', en: 'doctor', he: 'רופא', heNiqqud: 'רוֹפֵא', visual: { kind: 'text', he: '🧑‍⚕️' } },
    { id: 'job_nurse', en: 'nurse', he: 'אחות', heNiqqud: 'אָחוֹת', visual: { kind: 'text', he: '🧑‍⚕️' } },
    { id: 'job_firefighter', en: 'firefighter', he: 'כבאי', heNiqqud: 'כַּבַּאי', visual: { kind: 'text', he: '🧑‍🚒' } },
    { id: 'job_police', en: 'police officer', he: 'שוטר', heNiqqud: 'שׁוֹטֵר', visual: { kind: 'text', he: '👮' } },

    // Community / Services
    { id: 'job_teacher', en: 'teacher', he: 'מורה', heNiqqud: 'מוֹרֶה', visual: { kind: 'text', he: '🧑‍🏫' } },
    { id: 'job_chef', en: 'chef', he: 'שף', heNiqqud: 'שֵׁף', visual: { kind: 'text', he: '🧑‍🍳' } },
    { id: 'job_farmer', en: 'farmer', he: 'חקלאי', heNiqqud: 'חַקְלָאִי', visual: { kind: 'text', he: '🧑‍🌾' } },
    { id: 'job_driver', en: 'driver', he: 'נהג', heNiqqud: 'נַהָג', visual: { kind: 'text', he: '🧑‍✈️' } },

    // Build / Fix
    { id: 'job_builder', en: 'builder', he: 'בנאי', heNiqqud: 'בַּנַּאי', visual: { kind: 'text', he: '🧑‍🔧' } },
    { id: 'job_mechanic', en: 'mechanic', he: 'מכונאי', heNiqqud: 'מְכוֹנַאי', visual: { kind: 'text', he: '🧑‍🔧' } },
    { id: 'job_painter', en: 'painter', he: 'צבעי', heNiqqud: 'צַבָּעִי', visual: { kind: 'text', he: '🧑‍🎨' } },
    { id: 'job_dentist', en: 'dentist', he: 'רופא שיניים', heNiqqud: 'רוֹפֵא שִׁנַּיִם', visual: { kind: 'text', he: '🦷' } },
  ],

  groups: [
    {
      id: 'jobs_emergency',
      title: 'Jobs – Emergency',
      titleKey: 'content.group.jobs_emergency.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['job_doctor', 'job_nurse', 'job_firefighter', 'job_police'],
    },
    {
      id: 'jobs_community',
      title: 'Jobs – Community',
      titleKey: 'content.group.jobs_community.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['job_teacher', 'job_chef', 'job_farmer', 'job_driver'],
    },
    {
      id: 'jobs_build_fix',
      title: 'Jobs – Build & Fix',
      titleKey: 'content.group.jobs_build_fix.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['job_builder', 'job_mechanic', 'job_painter', 'job_dentist'],
    },
  ],

  units: [],
};
