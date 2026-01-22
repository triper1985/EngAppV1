// src/visuals/itemVisualRegistry.ts
import type { ImageSourcePropType } from 'react-native';

/**
 * Item visuals registry (Content Items)
 * ------------------------------------
 * Static require() so bundlers can include assets for RN + web.
 *
 * Convention:
 * - Assets live under: src/assets/content/items/<category>/
 * - File names match itemId: <itemId>.png
 * - Categories are for organization only (logic comes from content/groups)
 */

const ITEM_VISUALS: Record<string, ImageSourcePropType> = {
  // ======================
  // Foundations
  // ======================
  hello: require('../assets/content/items/foundations/hello.png'),
  bye: require('../assets/content/items/foundations/bye.png'),
  yes: require('../assets/content/items/foundations/yes.png'),
  no: require('../assets/content/items/foundations/no.png'),
  please: require('../assets/content/items/foundations/please.png'),
  thank_you: require('../assets/content/items/foundations/thank_you.png'),

  happy: require('../assets/content/items/foundations/happy.png'),
  sad: require('../assets/content/items/foundations/sad.png'),
  angry: require('../assets/content/items/foundations/angry.png'),
  scared: require('../assets/content/items/foundations/scared.png'),
  tired: require('../assets/content/items/foundations/tired.png'),
  calm: require('../assets/content/items/foundations/calm.png'),

  // ======================
  // Listening & Actions
  // ======================
  clap: require('../assets/content/items/listening/clap.png'),
  jump: require('../assets/content/items/listening/jump.png'),
  run: require('../assets/content/items/listening/run.png'),
  stop: require('../assets/content/items/listening/stop.png'),
  listen: require('../assets/content/items/listening/listen.png'),
  look: require('../assets/content/items/listening/look.png'),
  sit: require('../assets/content/items/listening/sit.png'),
  stand: require('../assets/content/items/listening/stand.png'),

  // ======================
  // Animals — Farm
  // ======================
  cow: require('../assets/content/items/animals/cow.png'),
  sheep: require('../assets/content/items/animals/sheep.png'),
  pig: require('../assets/content/items/animals/pig.png'),
  horse: require('../assets/content/items/animals/horse.png'),
  chicken: require('../assets/content/items/animals/chicken.png'),
  duck: require('../assets/content/items/animals/duck.png'),
  goat: require('../assets/content/items/animals/goat.png'),
  dog: require('../assets/content/items/animals/dog.png'),

  // ======================
  // Animals — Sea
  // ======================
  fish: require('../assets/content/items/animals/fish.png'),
  dolphin: require('../assets/content/items/animals/dolphin.png'),
  shark: require('../assets/content/items/animals/shark.png'),
  octopus: require('../assets/content/items/animals/octopus.png'),
  crab: require('../assets/content/items/animals/crab.png'),
  sea_turtle: require('../assets/content/items/animals/sea_turtle.png'),
  whale: require('../assets/content/items/animals/whale.png'),
  seahorse: require('../assets/content/items/animals/seahorse.png'),

  // ======================
  // Animals — Jungle
  // ======================
  lion: require('../assets/content/items/animals/lion.png'),
  tiger: require('../assets/content/items/animals/tiger.png'),
  elephant: require('../assets/content/items/animals/elephant.png'),
  monkey: require('../assets/content/items/animals/monkey.png'),
  giraffe: require('../assets/content/items/animals/giraffe.png'),
  zebra: require('../assets/content/items/animals/zebra.png'),
  parrot: require('../assets/content/items/animals/parrot.png'),
  snake: require('../assets/content/items/animals/snake.png'),

  // ======================
  // Space (Interest) — add later
  // ======================
  // rocket: require('../assets/content/items/space/rocket.png'),
};

export function getItemVisualImage(itemId: string): ImageSourcePropType | null {
  if (!itemId) return null;
  return ITEM_VISUALS[itemId] ?? null;
}
