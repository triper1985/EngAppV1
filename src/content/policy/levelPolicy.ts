// src/content/policy/levelPolicy.ts
import type { ChildProfile } from '../../types';
import type { ContentItem, VisualSpec } from '../types';

export type LevelPolicy = {
  /**
   * Beginner: אסור להסתמך על קריאת אנגלית.
   * כלומר, תשובות Quiz חייבות להיות חזותיות.
   */
  quizAnswersMustBeVisual: boolean;

  /**
   * Beginner: מותר fallback בעברית אם אין צבע/תמונה.
   * ברמות מתקדמות: כנראה false.
   */
  allowHebrewFallbackAnswer: boolean;
};

export function getLevelPolicy(child: ChildProfile): LevelPolicy {
  const lvl = child.levelId ?? 'beginner';

  if (lvl === 'beginner') {
    return {
      quizAnswersMustBeVisual: true,
      allowHebrewFallbackAnswer: true,
    };
  }

  // default for future levels (placeholder; נחדד כשנגיע לרמות)
  return {
    quizAnswersMustBeVisual: false,
    allowHebrewFallbackAnswer: false,
  };
}

/**
 * Helper קטן: האם visual נחשב "visual answer"?
 * (text נחשב fallback, לא primary visual)
 */
export function isPrimaryVisual(v: VisualSpec): boolean {
  return v.kind === 'color' || v.kind === 'image';
}

/**
 * בודק אם item "מותר" לשימוש כתשובה ב-Quiz ברמת הילד
 */
export function itemAllowedAsQuizAnswer(
  child: ChildProfile,
  item: ContentItem
): boolean {
  const policy = getLevelPolicy(child);

  if (!policy.quizAnswersMustBeVisual) return true;

  if (isPrimaryVisual(item.visual)) return true;

  // text fallback
  return policy.allowHebrewFallbackAnswer && item.visual.kind === 'text';
}
