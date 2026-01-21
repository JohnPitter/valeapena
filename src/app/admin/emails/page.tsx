'use client';

import { useEffect, useState } from 'react';

interface Email {
  id: string;
  para: string;
  tipo: string;
  status: 'pendente' | 'enviado' | 'erro';
  tentativas: number;
  criadoEm: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-600',
  enviado: 'bg-green-600',
  erro: 'bg-red-600',
};

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/emails`);
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/admin/emails/${id}/retry`, { method: 'POST' });
      fetchEmails();
    } catch (error) {
      console.error('Error retrying email:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Fila de Emails</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Para</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Tentativas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Data</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-white">{email.para}</td>
                  <td className="px-6 py-4 text-slate-400">{email.tipo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 ${statusColors[email.status]} text-white text-xs rounded`}>
                      {email.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{email.tentativas}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(email.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {email.status === 'erro' && (
                      <button
                        onClick={() => handleRetry(email.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                      >
                        Reenviar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {emails.length === 0 && (
            <p className="text-center text-slate-500 py-8">Nenhum email na fila</p>
          )}
        </div>
      )}
    </div>
  );
}
