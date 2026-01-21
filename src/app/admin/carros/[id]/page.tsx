'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Carro {
  id: string;
  marca: string;
  modelo: string;
  imagemUrl: string;
  specs: {
    motor: string;
    combustivel: string;
    cambio: string;
    potencia: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EditCarroPage() {
  const params = useParams();
  const router = useRouter();
  const [carro, setCarro] = useState<Carro | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    fetchCarro();
  }, [params.id]);

  const fetchCarro = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/carros/${params.id}`);
      const data = await res.json();
      setCarro(data);
    } catch (error) {
      console.error('Error fetching carro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carro) return;

    setSaving(true);
    try {
      await fetch(`${API_URL}/api/admin/carros/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carro),
      });
      router.push('/admin/carros');
    } catch (error) {
      console.error('Error saving carro:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      await fetch(`${API_URL}/api/admin/carros/${params.id}/scrape`, { method: 'POST' });
      alert('Scraping iniciado! As pecas serao atualizadas em breve.');
    } catch (error) {
      console.error('Error starting scrape:', error);
    } finally {
      setScraping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!carro) {
    return <p className="text-slate-400">Carro nao encontrado</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Editar {carro.marca} {carro.modelo}
      </h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-slate-400 mb-2">URL da Imagem</label>
          <input
            type="text"
            value={carro.imagemUrl}
            onChange={(e) => setCarro({ ...carro, imagemUrl: e.target.value })}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-2">Motor</label>
            <input
              type="text"
              value={carro.specs.motor}
              onChange={(e) => setCarro({ ...carro, specs: { ...carro.specs, motor: e.target.value } })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Potencia</label>
            <input
              type="text"
              value={carro.specs.potencia}
              onChange={(e) => setCarro({ ...carro, specs: { ...carro.specs, potencia: e.target.value } })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Combustivel</label>
            <input
              type="text"
              value={carro.specs.combustivel}
              onChange={(e) => setCarro({ ...carro, specs: { ...carro.specs, combustivel: e.target.value } })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Cambio</label>
            <input
              type="text"
              value={carro.specs.cambio}
              onChange={(e) => setCarro({ ...carro, specs: { ...carro.specs, cambio: e.target.value } })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={handleScrape}
            disabled={scraping}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            {scraping ? 'Iniciando...' : 'Atualizar Pecas'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/carros')}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
