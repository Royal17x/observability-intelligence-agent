import React from 'react';
import { History, RefreshCw } from 'lucide-react';
import { AnalysisCard } from './AnalysisCard';
import { LoadingSpinner } from './LoadingSpinner';
import type { AnalysisRecord } from '../types';

interface AnalysisListProps {
  analyses: AnalysisRecord[];
  isLoading: boolean;
  currentAnalysisId?: string | null;
  onRefresh: () => void;
}

export const AnalysisList: React.FC<AnalysisListProps> = ({ 
  analyses, 
  isLoading, 
  currentAnalysisId,
  onRefresh 
}) => {
  if (analyses.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="bg-rose-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <History size={28} className="text-rose-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">История пуста</h3>
        <p className="text-sm text-slate-400">Запустите первый анализ, чтобы увидеть результаты</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <History size={20} className="text-rose-400" />
          История анализов
          <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">
            {analyses.length}
          </span>
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-rose-500 
                     disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {isLoading && analyses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <AnalysisCard 
              key={analysis.id} 
              analysis={analysis} 
              isNew={analysis.id === currentAnalysisId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
