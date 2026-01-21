'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Carro {
  id: string;
  marca: string;
  modelo: string;
  anos: number[];
  buscas: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminCarrosPage() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCarros();
  }, []);

  const fetchCarros = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/carros`);
      const data = await res.json();
      setCarros(data.carros || []);
    } catch (error) {
      console.error('Error fetching carros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este carro?')) return;

    try {
      await fetch(`${API_URL}/api/admin/carros/${id}`, { method: 'DELETE' });
      setCarros(carros.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting carro:', error);
    }
  };

  const filteredCarros = carros.filter(c =>
    `${c.marca} ${c.modelo}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Carros</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por marca ou modelo..."
          className="w-full max-w-md px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Marca</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Modelo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Anos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Buscas</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCarros.map((carro) => (
                <tr key={carro.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-white">{carro.marca}</td>
                  <td className="px-6 py-4 text-white">{carro.modelo}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{carro.buscas}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/carros/${carro.id}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(carro.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCarros.length === 0 && (
            <p className="text-center text-slate-500 py-8">Nenhum carro encontrado</p>
          )}
        </div>
      )}
    </div>
  );
}
