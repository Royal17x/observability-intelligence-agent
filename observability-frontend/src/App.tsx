import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { AnalysisForm } from './components/AnalysisForm';
import { AnalysisList } from './components/AnalysisList';
import { useAnalysis } from './hooks/useAnalysis';
import { Activity, TrendingUp, Shield } from 'lucide-react';

const App: React.FC = () => {
  const {
    analyses,
    currentAnalysis,
    isLoading,
    isHistoryLoading,
    error,
    submitAnalysis,
    refreshHistory,
    clearError,
    clearCurrentAnalysis,
  } = useAnalysis();

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    if (currentAnalysis) {
      const timer = setTimeout(() => {
        clearCurrentAnalysis();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentAnalysis, clearCurrentAnalysis]);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                <Activity size={20} className="text-rose-400 mb-2" />
                <p className="text-2xl font-bold text-slate-800">{analyses.length}</p>
                <p className="text-xs text-slate-400">Всего анализов</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                <TrendingUp size={20} className="text-emerald-400 mb-2" />
                <p className="text-2xl font-bold text-slate-800">
                  {analyses.filter(a => a.result.toLowerCase().includes('проблем')).length}
                </p>
                <p className="text-xs text-slate-400">С проблемами</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm">
                <Shield size={20} className="text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-slate-800">
                  {analyses.filter(a => a.result.toLowerCase().includes('стабильн') || 
                                        a.result.toLowerCase().includes('норм')).length}
                </p>
                <p className="text-xs text-slate-400">Стабильно</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Новый анализ</h2>
              <p className="text-sm text-slate-400 mb-6">
                Выберите сервис и задайте вопрос AI-агенту
              </p>
              <AnalysisForm 
                onSubmit={submitAnalysis}
                isLoading={isLoading}
                error={error}
                onClearError={clearError}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <AnalysisList 
            analyses={analyses}
            isLoading={isHistoryLoading}
            currentAnalysisId={currentAnalysis?.id}
            onRefresh={refreshHistory}
          />
        </div>
      </div>
    </Layout>
  );
};

export default App;
