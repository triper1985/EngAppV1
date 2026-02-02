// src/data/iconShop.ts

// אייקונים שמתחילים "פתוחים" לכל ילד
export const FREE_DEFAULT_ICON_IDS = ['star', 'basketball', 'rocket'] as const;

// 0 = Free (לא קונים בחנות, אמור להיות פתוח מראש)
// אם אין מחיר מוגדר -> נופל ל-DEFAULT_ICON_PRICE
export const DEFAULT_ICON_PRICE = 5;

export const ICON_PRICES: Record<string, number> = {
  star: 0,
  basketball: 0,
  rocket: 0,

  // Animals (tier 1)
  tiger: 5,
  lion: 5,
  panda: 5,
  dog: 5,
  cat: 5,
  dolphin: 10,
  turtle: 10,

  // Space
  planet: 5,
  astronaut: 10,
  ufo: 15,

  // Sports
  soccer: 5,
  tennis: 5,

  // Food
  pizza: 10,
  icecream: 10,
  cake: 10,

  // Nature
  sun: 5,
  rainbow: 10,
  tree: 5,
  flower: 5,

  // Fantasy
  unicorn: 10,
  dragon: 20,
  crown: 15,

  // Faces
  cool: 5,
  happy: 5,
};

export function getIconPrice(iconId: string): number {
  const p = ICON_PRICES[iconId];
  return typeof p === 'number' ? p : DEFAULT_ICON_PRICE;
}

export function isIconFree(iconId: string): boolean {
  return getIconPrice(iconId) <= 0;
}
