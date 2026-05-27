import axios from 'axios';

import { NativeModules } from 'react-native';

import { clearAuthToken, getAuthToken } from './storage';

type NativeConfig = {
  API_BASE_URL_DEV?: string;
  API_BASE_URL_PROD?: string;
};

type GoFrameResponse<T> = {
  code: number;
  message: string;
  data: T;
};

const nativeConfig = NativeModules.RNCConfig as NativeConfig | undefined;

function getRequiredBaseUrl(): string {
  const key = __DEV__ ? 'API_BASE_URL_DEV' : 'API_BASE_URL_PROD';
  const value = nativeConfig?.[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function isGoFrameResponse(value: unknown): value is GoFrameResponse<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const response = value as Record<string, unknown>;
  return typeof response.code === 'number' && 'data' in response;
}

export const http = axios.create({
  baseURL: getRequiredBaseUrl(),
  timeout: 30000,
});

http.interceptors.request.use(config => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  response => {
    if (!isGoFrameResponse(response.data)) {
      return response.data;
    }

    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'Request failed');
    }

    return response.data.data;
  },
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthToken();
    }

    return Promise.reject(error);
  },
);

export default http;
