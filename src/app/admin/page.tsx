'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalCarros: number;
  totalSolicitacoes: number;
  solicitacoesPendentes: number;
  emailsNaFila: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total de Carros', value: stats?.totalCarros ?? 0, icon: '🚗', color: 'blue' },
    { label: 'Solicitacoes Pendentes', value: stats?.solicitacoesPendentes ?? 0, icon: '📝', color: 'yellow' },
    { label: 'Total de Solicitacoes', value: stats?.totalSolicitacoes ?? 0, icon: '📋', color: 'green' },
    { label: 'Emails na Fila', value: stats?.emailsNaFila ?? 0, icon: '📧', color: 'purple' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600/20 border-blue-600',
    yellow: 'bg-yellow-600/20 border-yellow-600',
    green: 'bg-green-600/20 border-green-600',
    purple: 'bg-purple-600/20 border-purple-600',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`${colorClasses[card.color]} border rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-slate-400 text-sm">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
