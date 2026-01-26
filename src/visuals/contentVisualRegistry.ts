// src/visuals/contentVisualRegistry.ts
import type { ImageSourcePropType } from 'react-native';

/**
 * V12 (Option B) — Local visuals registry
 * --------------------------------------
 * Static require() so bundlers can include assets for RN + web.
 * Fallback is always emoji.
 */

export type VisualKind = 'layer' | 'pack' | 'unit';

export type VisualSpec = {
  kind: VisualKind;
  id: string;
  emoji?: string;
  image?: ImageSourcePropType; // require('...')
};

// -----------------
// Layers (0..4)
// -----------------
const LAYER_VISUALS: Record<string, VisualSpec> = {
  layer0: {
    kind: 'layer',
    id: 'layer0',
    emoji: '👂',
    image: require('../assets/content/layers/layer0.png'),
  },
  layer1: {
    kind: 'layer',
    id: 'layer1',
    emoji: '🔤',
    image: require('../assets/content/layers/layer1.png'),
  },
  layer2: {
    kind: 'layer',
    id: 'layer2',
    emoji: '🧩',
    image: require('../assets/content/layers/layer2.png'),
  },
  layer3: {
    kind: 'layer',
    id: 'layer3',
    emoji: '✍️',
    image: require('../assets/content/layers/layer3.png'),
  },
  layer4: {
    kind: 'layer',
    id: 'layer4',
    emoji: '🏁',
    image: require('../assets/content/layers/layer4.png'),
  },
};

// -----------------
// Packs / Groups
// -----------------
const PACK_VISUALS: Record<string, VisualSpec> = {
  basic: {
    kind: 'pack',
    id: 'basic',
    emoji: '🎒',
    image: require('../assets/content/packs/basic.png'),
  },
  foundations: {
    kind: 'pack',
    id: 'foundations',
    emoji: '🧱',
    image: require('../assets/content/packs/foundations.png'),
  },
  listening: {
    kind: 'pack',
    id: 'listening',
    emoji: '👂',
    image: require('../assets/content/packs/listening.png'),
  },
  numbers: {
    kind: 'pack',
    id: 'numbers',
    emoji: '🔢',
    image: require('../assets/content/packs/numbers.png'),
  },
  letters: {
    kind: 'pack',
    id: 'letters',
    emoji: '🔤',
    image: require('../assets/content/packs/letters.png'),
  },

  // ===== Layer 3 — NEW =====
  letter_words: {
    kind: 'pack',
    id: 'letter_words',
    emoji: '🔗',
    image: require('../assets/content/packs/letter_a.png'),
  },

  colors: {
    kind: 'pack',
    id: 'colors',
    emoji: '🎨',
    image: require('../assets/content/packs/colors.png'),
  },
  animals: {
    kind: 'pack',
    id: 'animals',
    emoji: '🐾',
    image: require('../assets/content/packs/animals.png'),
  },
  home: {
    kind: 'pack',
    id: 'home',
    emoji: '🏠',
    image: require('../assets/content/packs/home.png'),
  },
  clothes: {
    kind: 'pack',
    id: 'clothes',
    emoji: '👕',
    image: require('../assets/content/packs/clothes.png'),
  },
  food: {
    kind: 'pack',
    id: 'food',
    emoji: '🍎',
    image: require('../assets/content/packs/food.png'),
  },
  transport: {
    kind: 'pack',
    id: 'transport',
    emoji: '🚗',
    image: require('../assets/content/packs/transport.png'),
  },
  toys: {
    kind: 'pack',
    id: 'toys',
    emoji: '🧸',
    image: require('../assets/content/packs/toys.png'),
  },
  space: {
    kind: 'pack',
    id: 'space',
    emoji: '🚀',
    image: require('../assets/content/packs/space.png'),
  },
  early_recognition: {
    kind: 'pack',
    id: 'early_recognition',
    emoji: '👀',
    // Add an optional PNG here later:
    image: require('../assets/content/packs/early_recognition.png'),
  },

  // Layer 4 groups (LearnLayerScreen asks `getVisual('pack', groupId)`)
  early_recognition_directions: {
    kind: 'pack',
    id: 'early_recognition_directions',
    emoji: '🧭',
    image: require('../assets/content/packs/early_recognition.png'),
  },
  early_recognition_shapes: {
    kind: 'pack',
    id: 'early_recognition_shapes',
    emoji: '🔺',
    image: require('../assets/content/packs/early_recognition.png'),
  },
  early_recognition_faces: {
    kind: 'pack',
    id: 'early_recognition_faces',
    emoji: '🙂',
    image: require('../assets/content/packs/early_recognition.png'),
  },

};

// -----------------
// Units (optional)
// -----------------
const UNIT_VISUALS: Record<string, VisualSpec> = {
  // example:
  // animals_a_learn: {
  //   kind: 'unit',
  //   id: 'animals_a_learn',
  //   emoji: '🐾',
  //   image: require('../assets/content/units/animals_a_learn.png'),
  // },
};

export function getVisual(kind: VisualKind, id: string): VisualSpec | null {
  if (kind === 'layer') return LAYER_VISUALS[id] ?? null;
  if (kind === 'pack') return PACK_VISUALS[id] ?? null;
  return UNIT_VISUALS[id] ?? null;
}
