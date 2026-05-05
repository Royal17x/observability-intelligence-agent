import React from 'react';
import { Activity, GitBranch, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-2 rounded-xl shadow-sm">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Observability Agent
              </h1>
              <p className="text-xs text-slate-400 -mt-0.5">AI-анализ production-систем</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <a 
              href="http://localhost:9090" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-500 transition-colors"
            >
              <Activity size={16} />
              <span className="hidden sm:inline">Prometheus</span>
            </a>
            <a 
              href="http://localhost:16686" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-500 transition-colors"
            >
              <GitBranch size={16} />
              <span className="hidden sm:inline">Jaeger</span>
            </a>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-rose-500 transition-colors"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">API Docs</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
