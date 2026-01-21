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
  space: {
    kind: 'pack',
    id: 'space',
    emoji: '🚀',
    image: require('../assets/content/packs/space.png'),
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
