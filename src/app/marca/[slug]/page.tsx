import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarrosByMarca } from '@/lib/carros';
import CarroCard from '@/components/CarroCard';
import { Metadata } from 'next';

const MARCAS: Record<string, { nome: string; logo: string }> = {
  'bmw': { nome: 'BMW', logo: '🔵' },
  'mercedes-benz': { nome: 'Mercedes-Benz', logo: '⭐' },
  'audi': { nome: 'Audi', logo: '⚫' },
  'land-rover': { nome: 'Land Rover', logo: '🟢' },
  'volvo': { nome: 'Volvo', logo: '🔷' },
  'jaguar': { nome: 'Jaguar', logo: '🐆' },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const marca = MARCAS[slug];

  if (!marca) {
    return { title: 'Marca nao encontrada' };
  }

  return {
    title: `${marca.nome} - Vale a Pena? | Carros e Precos de Pecas`,
    description: `Veja todos os carros ${marca.nome} disponiveis. Compare precos FIPE e custos de manutencao.`,
  };
}

export default async function MarcaPage({ params }: PageProps) {
  const { slug } = await params;
  const marca = MARCAS[slug];

  if (!marca) {
    notFound();
  }

  const carros = await getCarrosByMarca(slug);

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Vale a <span className="text-blue-500">Pena</span>?
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{marca.logo}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{marca.nome}</h1>
            <p className="text-slate-400">{carros.length} {carros.length === 1 ? 'modelo disponivel' : 'modelos disponiveis'}</p>
          </div>
        </div>

        {carros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carros.map((carro) => (
              <CarroCard key={carro.id} carro={carro} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-4">
              Ainda nao temos carros {marca.nome} cadastrados.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Ver todos os carros
            </Link>
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
