import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Server, Sparkles, Copy, Check } from 'lucide-react';
import type { AnalysisRecord } from '../types';

interface AnalysisCardProps {
  analysis: AnalysisRecord;
  isNew?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, isNew = false }) => {
  const [isExpanded, setIsExpanded] = useState(isNew);
  const [isCopied, setIsCopied] = useState(false);

  const formattedDate = new Date(analysis.created_at).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis.result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (/^\d+\./.test(line)) {
        return (
          <h4 key={i} className="font-semibold text-slate-800 mt-4 mb-2 flex items-center gap-2">
            <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-md">
              {line.match(/^\d+/)?.[0]}
            </span>
            {line.replace(/^\d+\.\s*/, '')}
          </h4>
        );
      }
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return (
          <li key={i} className="ml-4 text-slate-600 text-sm leading-relaxed">
            {line.replace(/^[•-]\s*/, '')}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="text-slate-600 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div 
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
        ${isNew 
          ? 'border-rose-300 shadow-lg shadow-rose-100 ring-1 ring-rose-200' 
          : 'border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100'
        }`}
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-50 
                               text-rose-700 text-xs font-semibold border border-rose-100">
                <Server size={12} />
                {analysis.service_name}
              </span>
              {isNew && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 
                                 text-amber-700 text-xs font-semibold border border-amber-100 animate-pulse">
                  <Sparkles size={12} />
                  Новый
                </span>
              )}
            </div>
            <p className="text-sm text-slate-700 font-medium truncate">
              {analysis.question}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <Clock size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 
                         transition-colors"
              title="Копировать результат"
            >
              {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 
                              hover:bg-rose-50 transition-colors">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-50">
          <div className="pt-4 prose prose-sm max-w-none">
            {formatResult(analysis.result)}
          </div>
        </div>
      )}
    </div>
  );
};
