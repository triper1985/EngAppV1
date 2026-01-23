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
  // Layer 2 — Core Vocabulary
  // ======================
  // Home
  home_bed: require('../assets/content/items/home/bed.png'),
  home_chair: require('../assets/content/items/home/chair.png'),
  home_table: require('../assets/content/items/home/table.png'),
  home_door: require('../assets/content/items/home/door.png'),
  home_window: require('../assets/content/items/home/window.png'),

  // Clothes
  clothes_shirt: require('../assets/content/items/clothes/shirt.png'),
  clothes_pants: require('../assets/content/items/clothes/pants.png'),
  clothes_shoes: require('../assets/content/items/clothes/shoes.png'),
  clothes_hat: require('../assets/content/items/clothes/hat.png'),

  // Food
  food_apple: require('../assets/content/items/food/apple.png'),
  food_banana: require('../assets/content/items/food/banana.png'),
  food_bread: require('../assets/content/items/food/bread.png'),
  food_milk: require('../assets/content/items/food/milk.png'),
  food_water: require('../assets/content/items/food/water.png'),

  // Transport
  transport_car: require('../assets/content/items/transport/car.png'),
  transport_bus: require('../assets/content/items/transport/bus.png'),
  transport_train: require('../assets/content/items/transport/train.png'),
  transport_bike: require('../assets/content/items/transport/bike.png'),

  // Toys
  toys_ball: require('../assets/content/items/toys/ball.png'),
  toys_doll: require('../assets/content/items/toys/doll.png'),
  toys_teddy: require('../assets/content/items/toys/teddy.png'),
  toys_blocks: require('../assets/content/items/toys/blocks.png'),

  // ======================
  // Layer 3 — Letter → Word
  // ======================
  // Reuse existing icons
  lw_apple_icon: require('../assets/content/items/food/apple.png'),
  lw_ball_icon: require('../assets/content/items/toys/ball.png'),
  lw_cat_icon: require('../assets/content/items/letter_words/cat.png'),
  lw_dog_icon: require('../assets/content/items/animals/dog.png'),
  lw_fish_icon: require('../assets/content/items/animals/fish.png'),
  lw_goat_icon: require('../assets/content/items/animals/goat.png'),
  lw_hat_icon: require('../assets/content/items/clothes/hat.png'),
  lw_lion_icon: require('../assets/content/items/animals/lion.png'),
  lw_pig_icon: require('../assets/content/items/animals/pig.png'),
  lw_whale_icon: require('../assets/content/items/animals/whale.png'),
  lw_zebra_icon: require('../assets/content/items/animals/zebra.png'),

  // New icons (items/letter_words)
  lw_egg_icon: require('../assets/content/items/letter_words/egg.png'),
  lw_icecream_icon: require('../assets/content/items/letter_words/icecream.png'),
  lw_juice_icon: require('../assets/content/items/letter_words/juice.png'),
  lw_kite_icon: require('../assets/content/items/letter_words/kite.png'),
  lw_moon_icon: require('../assets/content/items/letter_words/moon.png'),
  lw_nose_icon: require('../assets/content/items/letter_words/nose.png'),
  lw_orange_icon: require('../assets/content/items/letter_words/orange.png'),
  lw_queen_icon: require('../assets/content/items/letter_words/queen.png'),
  lw_robot_icon: require('../assets/content/items/letter_words/robot.png'),
  lw_sun_icon: require('../assets/content/items/letter_words/sun.png'),
  lw_tree_icon: require('../assets/content/items/letter_words/tree.png'),
  lw_umbrella_icon: require('../assets/content/items/letter_words/umbrella.png'),
  lw_van_icon: require('../assets/content/items/letter_words/van.png'),
  lw_xylophone_icon: require('../assets/content/items/letter_words/xylophone.png'),
  lw_yoyo_icon: require('../assets/content/items/letter_words/yoyo.png'),
};

export function getItemVisualImage(itemId: string): ImageSourcePropType | null {
  if (!itemId) return null;
  return ITEM_VISUALS[itemId] ?? null;
}
