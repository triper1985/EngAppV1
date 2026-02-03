// src/games/common/useGameAudio.ts
import { useMemo } from 'react';
import type { ChildProfile } from '../../types';

import { getEffectiveAudioSettings, playFx, speakText } from '../../audio';

export function useGameAudio(child?: ChildProfile | null) {
  const settings = useMemo(() => getEffectiveAudioSettings(child), [child]);

  return useMemo(() => {
    return {
      // FX layer uses global audio settings internally.
      // (FX volume/enablement is not per-child yet.)
      tap: () => playFx('tap'),
      success: () => playFx('success'),
      error: () => playFx('error'),
      complete: () => playFx('complete'),
      speak: (text: string) => speakText(text, { settings }),
    };
  }, [settings]);
}
