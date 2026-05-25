import { NativeModules } from 'react-native';

import http from '../lib/http';
import { getAuthToken } from '../lib/storage';

type NativeConfig = {
  API_BASE_URL_DEV?: string;
  API_BASE_URL_PROD?: string;
};

export type DreamEmotion = 'joy' | 'calm' | 'anxiety' | 'nightmare' | 'neutral';

export type DreamSymbol = {
  symbol: string;
  meaning: string;
};

export type DreamRecordDto = {
  id: string;
  title: string;
  content: string;
  interpretation: string;
  emotion: DreamEmotion;
  emotionColor: string;
  keywords: string[];
  symbols: DreamSymbol[];
  confidenceScore: number;
  lucidityScore?: number;
  guidance?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DreamListRequest = {
  keyword?: string;
  emotion?: DreamEmotion;
  favoriteOnly?: boolean;
  cursor?: string;
  limit?: number;
};

export type DreamListResponse = {
  items: DreamRecordDto[];
  nextCursor?: string;
  total: number;
};

export type CreateDreamAnalysisRequest = {
  content: string;
  emotion: DreamEmotion;
  locale: string;
};

export type DreamAnalysisStepKey =
  | 'image_match'
  | 'brainwave_decode'
  | 'graph_align'
  | 'done';

export type DreamAnalysisStep = {
  key: DreamAnalysisStepKey;
  label: string;
  status: 'pending' | 'active' | 'done';
};

export type DreamAnalysisResult = {
  title: string;
  theme: string;
  symbols: DreamSymbol[];
  keywords: string[];
  confidenceScore: number;
  lucidityScore: number;
  guidance: string;
  modelTier: 'standard' | 'premium';
};

export type CreateDreamAnalysisResponse = {
  dream: DreamRecordDto;
  analysis: DreamAnalysisResult;
  steps: DreamAnalysisStep[];
};

export type UpdateDreamRequest = {
  title?: string;
  content?: string;
  emotion?: DreamEmotion;
  isFavorite?: boolean;
};

export type HomeRecommendation = {
  dream: DreamRecordDto;
  score: number;
  tier: 'standard' | 'premium';
};

export type EmotionWavePoint = {
  date: string;
  label: string;
  value: number;
  emotion: DreamEmotion;
};

export type HomeStats = {
  totalDreams: number;
  currentStreakDays: number;
  recommendation?: HomeRecommendation;
  emotionWaves: EmotionWavePoint[];
  recentDreams: DreamRecordDto[];
};

export type ChatMessageType = 'message' | 'error' | 'done';

export type DreamChatMessage = {
  type: ChatMessageType;
  dreamContent?: string;
  content?: string;
  error?: string;
};

const nativeConfig = NativeModules.RNCConfig as NativeConfig | undefined;

function getRequiredBaseUrl(): string {
  const key = __DEV__ ? 'API_BASE_URL_DEV' : 'API_BASE_URL_PROD';
  const value = nativeConfig?.[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.replace(/\/$/, '');
}

function buildQuery(params: DreamListRequest): string {
  const query = new URLSearchParams();

  if (params.keyword) {
    query.set('keyword', params.keyword);
  }

  if (params.emotion) {
    query.set('emotion', params.emotion);
  }

  if (params.favoriteOnly !== undefined) {
    query.set('favoriteOnly', String(params.favoriteOnly));
  }

  if (params.cursor) {
    query.set('cursor', params.cursor);
  }

  if (params.limit !== undefined) {
    query.set('limit', String(params.limit));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export function listDreams(
  params: DreamListRequest = {},
): Promise<DreamListResponse> {
  return http.get<unknown, DreamListResponse>(
    `/v1/dreams${buildQuery(params)}`,
  );
}

export function getDream(dreamId: string): Promise<DreamRecordDto> {
  return http.get<unknown, DreamRecordDto>(`/v1/dreams/${dreamId}`);
}

export function createDreamAnalysis(
  payload: CreateDreamAnalysisRequest,
): Promise<CreateDreamAnalysisResponse> {
  return http.post<unknown, CreateDreamAnalysisResponse>(
    '/v1/dreams/analyze',
    payload,
  );
}

export function updateDream(
  dreamId: string,
  payload: UpdateDreamRequest,
): Promise<DreamRecordDto> {
  return http.put<unknown, DreamRecordDto>(`/v1/dreams/${dreamId}`, payload);
}

export function setDreamFavorite(
  dreamId: string,
  isFavorite: boolean,
): Promise<DreamRecordDto> {
  return http.patch<unknown, DreamRecordDto>(`/v1/dreams/${dreamId}/favorite`, {
    isFavorite,
  });
}

export function deleteDream(dreamId: string): Promise<void> {
  return http.delete<unknown, void>(`/v1/dreams/${dreamId}`);
}

export function getHomeStats(): Promise<HomeStats> {
  return http.get<unknown, HomeStats>('/v1/dreams/home');
}

export function getTodayRecommendation(): Promise<HomeRecommendation> {
  return http.get<unknown, HomeRecommendation>(
    '/v1/dreams/recommendation/today',
  );
}

export function createDreamChatWebSocket(): WebSocket {
  const token = getAuthToken();
  const encodedToken = token ? encodeURIComponent(token) : '';
  const wsBaseUrl = getRequiredBaseUrl().replace(/^http/, 'ws');

  return new WebSocket(`${wsBaseUrl}/chat/ws?token=${encodedToken}`);
}
