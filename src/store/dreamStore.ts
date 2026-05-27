import { create } from 'zustand';

import type { LocaleKeys } from '../types/i18n';
import { MOCK_DREAM_HISTORY, type MockSymbol } from '../mocks/appMockData';

export type DreamRecord = {
  id: string;
  titleKey: keyof LocaleKeys | string;
  dreamContentKey: keyof LocaleKeys | string;
  interpretationKey: keyof LocaleKeys | string;
  emotionKey: keyof LocaleKeys | string;
  emotionColor: string;
  createdAtKey: keyof LocaleKeys | string;
  aiKeywords?: Array<keyof LocaleKeys | string>;
  symbolism?: MockSymbol[];
  confidenceScore?: number;
  isFavorite?: boolean;
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

const INITIAL_HISTORY: DreamRecord[] = MOCK_DREAM_HISTORY.map(item => ({
  ...item,
  aiKeywords: [...item.aiKeywords],
}));

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
