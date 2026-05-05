import { Server, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface ServiceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DEFAULT_SERVICES = [
  { value: 'flagr', label: 'Flagr' },
  { value: 'order-service', label: 'Order Service' },
  { value: 'payment-service', label: 'Payment Service' },
  { value: 'notification-service', label: 'Notification Service' },
  { value: 'api-gateway', label: 'API Gateway' },
];

export const ServiceSelector: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="relative">
      <label htmlFor="service-select" className="block text-sm font-medium text-slate-700 mb-1.5">
        Сервис
      </label>
      <div className="relative">
        <Server
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-rose-200 rounded-xl text-slate-700 
                     focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent
                     appearance-none cursor-pointer transition-shadow"
        >
          <option value="" disabled>Выберите сервис...</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
};
