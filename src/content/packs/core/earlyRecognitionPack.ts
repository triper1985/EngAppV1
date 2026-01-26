// src/content/packs/core/earlyRecognitionPack.ts
import type { ContentItem, ContentPack } from '../../types';

/**
 * Layer 4 (Level A) — Early Recognition
 * ------------------------------------
 * Goal: fast visual discrimination + simple concept recognition,
 * without requiring reading.
 *
 * NOTE:
 * - Visuals use text/emoji so it works immediately on RN+web.
 * - English 'en' labels exist for TTS, but the answer UI stays visual.
 */
const items: ContentItem[] = [
  // Directions (visual glyphs)
  { id: 'dir_up', en: 'up', visual: { kind: 'text', he: '⬆️' }, tags: ['recognition', 'direction'] },
  { id: 'dir_down', en: 'down', visual: { kind: 'text', he: '⬇️' }, tags: ['recognition', 'direction'] },
  { id: 'dir_left', en: 'left', visual: { kind: 'text', he: '⬅️' }, tags: ['recognition', 'direction'] },
  { id: 'dir_right', en: 'right', visual: { kind: 'text', he: '➡️' }, tags: ['recognition', 'direction'] },

  // Similar-shape discrimination (pick the correct one visually)
  { id: 'shape_circle', en: 'circle', visual: { kind: 'text', he: '●' }, tags: ['recognition', 'shape'] },
  { id: 'shape_dot', en: 'dot', visual: { kind: 'text', he: '•' }, tags: ['recognition', 'shape'] },
  { id: 'shape_square', en: 'square', visual: { kind: 'text', he: '■' }, tags: ['recognition', 'shape'] },
  { id: 'shape_square_hollow', en: 'square', visual: { kind: 'text', he: '□' }, tags: ['recognition', 'shape'] },
  { id: 'shape_triangle', en: 'triangle', visual: { kind: 'text', he: '▲' }, tags: ['recognition', 'shape'] },
  { id: 'shape_triangle_hollow', en: 'triangle', visual: { kind: 'text', he: '△' }, tags: ['recognition', 'shape'] },

  // Faces (fast recognition)
  { id: 'face_happy', en: 'happy', visual: { kind: 'text', he: '🙂' }, tags: ['recognition', 'emotion'] },
  { id: 'face_sad', en: 'sad', visual: { kind: 'text', he: '🙁' }, tags: ['recognition', 'emotion'] },
  { id: 'face_surprised', en: 'surprised', visual: { kind: 'text', he: '😮' }, tags: ['recognition', 'emotion'] },
];

export const earlyRecognitionPack: ContentPack = {
  id: 'early_recognition',
  title: 'Early Recognition',
  titleKey: 'content.pack.early_recognition.title',
  description: '',
  descriptionKey: 'content.pack.early_recognition.desc',
  emoji: '👀',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['core', 'beginnerBridge', 'recognition'],
  },
  meta: {
    tags: ['core', 'beginnerBridge'],
  },
  items,
  groups: [
    {
      id: 'early_recognition_directions',
      title: 'Directions',
      titleKey: 'content.group.early_recognition_directions.title',
      itemIds: ['dir_up', 'dir_down', 'dir_left', 'dir_right'],
      policy: { minLayer: 4, skills: ['recognition'] },
    },
    {
      id: 'early_recognition_shapes',
      title: 'Similar Shapes',
      titleKey: 'content.group.early_recognition_shapes.title',
      itemIds: [
        'shape_circle',
        'shape_dot',
        'shape_square',
        'shape_square_hollow',
        'shape_triangle',
        'shape_triangle_hollow',
      ],
      policy: { minLayer: 4, skills: ['recognition'] },
    },
    {
      id: 'early_recognition_faces',
      title: 'Faces',
      titleKey: 'content.group.early_recognition_faces.title',
      itemIds: ['face_happy', 'face_sad', 'face_surprised'],
      policy: { minLayer: 4, skills: ['recognition', 'emotions'] },
    },
  ],
  units: [
    {
      id: 'early_recognition_directions_learn',
      title: 'Directions — Learn',
      titleKey: 'content.group.early_recognition_directions.title',
      kind: 'learn',
      groupId: 'early_recognition_directions',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition'] },
    },
    {
      id: 'early_recognition_directions_quiz',
      title: 'Directions — Quiz',
      titleKey: 'content.group.early_recognition_directions.title',
      kind: 'quiz',
      groupId: 'early_recognition_directions',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition'] },
    },

    {
      id: 'early_recognition_shapes_learn',
      title: 'Shapes — Learn',
      titleKey: 'content.group.early_recognition_shapes.title',
      kind: 'learn',
      groupId: 'early_recognition_shapes',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition'] },
    },
    {
      id: 'early_recognition_shapes_quiz',
      title: 'Shapes — Quiz',
      titleKey: 'content.group.early_recognition_shapes.title',
      kind: 'quiz',
      groupId: 'early_recognition_shapes',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition'] },
    },

    {
      id: 'early_recognition_faces_learn',
      title: 'Faces — Learn',
      titleKey: 'content.group.early_recognition_faces.title',
      kind: 'learn',
      groupId: 'early_recognition_faces',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition', 'emotions'] },
    },
    {
      id: 'early_recognition_faces_quiz',
      title: 'Faces — Quiz',
      titleKey: 'content.group.early_recognition_faces.title',
      kind: 'quiz',
      groupId: 'early_recognition_faces',
      policy: { levelTag: 'A', minLayer: 4, skills: ['recognition', 'emotions'] },
    },
  ],
};
