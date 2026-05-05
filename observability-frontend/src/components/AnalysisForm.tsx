import React, { useState, useCallback } from 'react';
import { Send, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { ServiceSelector } from './ServiceSelector';
import { LoadingSpinner } from './LoadingSpinner';
import type { AnalysisRequest } from '../types';

interface AnalysisFormProps {
  onSubmit: (request: AnalysisRequest) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const TIME_RANGES = [
  { value: 5, label: '5 минут' },
  { value: 15, label: '15 минут' },
  { value: 30, label: '30 минут' },
  { value: 60, label: '1 час' },
  { value: 180, label: '3 часа' },
  { value: 360, label: '6 часов' },
];

const PRESET_QUESTIONS = [
  'Что происходит с сервисом?',
  'Почему растёт latency?',
  'Есть ли ошибки в трейсах?',
  'Почему падает RPS?',
  'Какие операции тормозят?',
];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error,
  onClearError 
}) => {
  const [serviceName, setServiceName] = useState('');
  const [timeRange, setTimeRange] = useState(15);
  const [question, setQuestion] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!serviceName || !question.trim()) return;

    onSubmit({
      service_name: serviceName,
      time_range_minutes: timeRange,
      question: question.trim(),
    });
  }, [serviceName, timeRange, question, onSubmit]);

  const handlePresetClick = useCallback((preset: string) => {
    setQuestion(preset);
    setShowPresets(false);
    onClearError();
  }, [onClearError]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-rose-700 font-medium">Ошибка</p>
            <p className="text-sm text-rose-600 mt-0.5">{error}</p>
          </div>
          <button 
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <ServiceSelector 
        value={serviceName} 
        onChange={(val: string) => { setServiceName(val); onClearError(); }} 
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-rose-400" />
            Период анализа
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${timeRange === range.value 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-2">
            <MessageSquare size={16} className="text-rose-400" />
            Вопрос к AI-агенту
          </span>
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => { setQuestion(e.target.value); onClearError(); }}
          onFocus={() => setShowPresets(true)}
          placeholder="Опишите, что нужно проанализировать..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-slate-700 
                     placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-300 
                     focus:border-transparent resize-none transition-shadow"
        />

        {showPresets && !question && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-rose-100 rounded-xl shadow-lg 
                          shadow-rose-100/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="px-4 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Быстрые вопросы
            </p>
            {PRESET_QUESTIONS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-rose-50 
                           hover:text-rose-700 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !serviceName || !question.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-rose-500 
                   to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-200 
                   hover:shadow-xl hover:shadow-rose-300 hover:scale-[1.02] active:scale-[0.98]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   disabled:shadow-none transition-all duration-200"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={20} className="text-white" />
            <span>Анализирую...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Запустить анализ</span>
          </>
        )}
      </button>
    </form>
  );
};
