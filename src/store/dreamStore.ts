import { create } from 'zustand';

import type { LocaleKeys } from '../types/i18n';
import { COLORS } from '../types/theme';

export type DreamRecord = {
  id: string;
  titleKey: keyof LocaleKeys;
  dreamContentKey: keyof LocaleKeys;
  interpretationKey: keyof LocaleKeys;
  emotionKey: keyof LocaleKeys;
  emotionColor: string;
  createdAtKey: keyof LocaleKeys;
};

type DreamState = {
  streamingContent: string;
  isStreaming: boolean;
  history: DreamRecord[];
  appendChunk: (chunk: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  setHistory: (history: DreamRecord[]) => void;
  clearStream: () => void;
};

const INITIAL_HISTORY: DreamRecord[] = [
  {
    id: 'moon-garden',
    titleKey: 'dreamOneTitle',
    dreamContentKey: 'dreamOneContent',
    interpretationKey: 'dreamOneInterpretation',
    emotionKey: 'dreamOneEmotion',
    emotionColor: COLORS.primaryAccent,
    createdAtKey: 'dreamOneDate',
  },
  {
    id: 'orange-train',
    titleKey: 'dreamTwoTitle',
    dreamContentKey: 'dreamTwoContent',
    interpretationKey: 'dreamTwoInterpretation',
    emotionKey: 'dreamTwoEmotion',
    emotionColor: COLORS.secondaryAccent,
    createdAtKey: 'dreamTwoDate',
  },
];

export const useDreamStore = create<DreamState>(set => ({
  streamingContent: '',
  isStreaming: false,
  history: INITIAL_HISTORY,
  appendChunk: (chunk: string): void => {
    set(state => ({ streamingContent: `${state.streamingContent}${chunk}` }));
  },
  setStreaming: (isStreaming: boolean): void => {
    set({ isStreaming });
  },
  setHistory: (history: DreamRecord[]): void => {
    set({ history });
  },
  clearStream: (): void => {
    set({ streamingContent: '', isStreaming: false });
  },
}));
