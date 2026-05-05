import { useState, useCallback } from 'react';
import { api, ApiError } from '../services/api';
import type { AnalysisRequest, AnalysisResponse, AnalysisRecord } from '../types';

interface UseAnalysisReturn {
  analyses: AnalysisRecord[];
  currentAnalysis: AnalysisResponse | null;
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string | null;
  submitAnalysis: (request: AnalysisRequest) => Promise<void>;
  refreshHistory: () => Promise<void>;
  clearError: () => void;
  clearCurrentAnalysis: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const response = await api.getAnalyses();
      setAnalyses(response.analyses);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const submitAnalysis = useCallback(async (request: AnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const response = await api.analyze(request);
      setCurrentAnalysis(response);
      await refreshHistory();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshHistory]);

  const clearError = useCallback(() => setError(null), []);
  const clearCurrentAnalysis = useCallback(() => setCurrentAnalysis(null), []);

  return {
    analyses,
    currentAnalysis,
    isLoading,
    isHistoryLoading,
    error,
    submitAnalysis,
    refreshHistory,
    clearError,
    clearCurrentAnalysis,
  };
}
