const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

import type { AnalysisRequest, AnalysisResponse, AnalysesListResponse } from '../types';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export const api = {
  analyze: async (request: AnalysisRequest): Promise<AnalysisResponse> => {
    return fetchWithError<AnalysisResponse>(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getAnalyses: async (): Promise<AnalysesListResponse> => {
    return fetchWithError<AnalysesListResponse>(`${API_BASE_URL}/analyses`);
  },

  healthCheck: async (): Promise<{ message: string }> => {
    return fetchWithError<{ message: string }>(`${API_BASE_URL}/`);
  },

  getServices: async (): Promise<string[]> => {
    return fetchWithError<{ services: string[] }>(`${API_BASE_URL}/services`)
      .then(r => r.services);
  },
};
