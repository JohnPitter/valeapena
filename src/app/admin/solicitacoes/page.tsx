'use client';

import { useEffect, useState } from 'react';

interface Solicitacao {
  id: string;
  marca: string;
  modelo: string;
  email: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  criadoEm: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-600',
  processando: 'bg-blue-600',
  concluido: 'bg-green-600',
  erro: 'bg-red-600',
};

export default function AdminSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/solicitacoes`);
      const data = await res.json();
      setSolicitacoes(data.solicitacoes || []);
    } catch (error) {
      console.error('Error fetching solicitacoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/admin/solicitacoes/${id}/process`, { method: 'POST' });
      fetchSolicitacoes();
    } catch (error) {
      console.error('Error processing solicitacao:', error);
    }
  };

  const filteredSolicitacoes = filter === 'all'
    ? solicitacoes
    : solicitacoes.filter(s => s.status === filter);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Solicitacoes</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'pendente', 'processando', 'concluido', 'erro'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Carro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Data</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredSolicitacoes.map((sol) => (
                <tr key={sol.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-white">{sol.marca} {sol.modelo}</td>
                  <td className="px-6 py-4 text-slate-400">{sol.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 ${statusColors[sol.status]} text-white text-xs rounded`}>
                      {sol.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(sol.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sol.status === 'pendente' && (
                      <button
                        onClick={() => handleProcess(sol.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                      >
                        Processar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSolicitacoes.length === 0 && (
            <p className="text-center text-slate-500 py-8">Nenhuma solicitacao encontrada</p>
          )}
        </div>
      )}
    </div>
  );
}
