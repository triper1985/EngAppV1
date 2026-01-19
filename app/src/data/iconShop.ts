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

  // examples (תוסיף/תשנה איך שבא לך):
  // crown: 10,
  // dragon: 20,
};

export function getIconPrice(iconId: string): number {
  const p = ICON_PRICES[iconId];
  return typeof p === 'number' ? p : DEFAULT_ICON_PRICE;
}

export function isIconFree(iconId: string): boolean {
  return getIconPrice(iconId) <= 0;
}
