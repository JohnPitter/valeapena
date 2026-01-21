import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarroBySlug, incrementBuscas } from '@/lib/carros';
import { formatCurrency, formatPriceRange, unslugify } from '@/lib/utils';
import PecaCard from '@/components/PecaCard';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ marca: string; modelo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca, modelo } = await params;
  const marcaName = unslugify(marca);
  const modeloName = unslugify(modelo);

  return {
    title: `${marcaName} ${modeloName} - Vale a Pena? | Preco FIPE e Pecas`,
    description: `Veja o preco FIPE e custo das pecas de manutencao do ${marcaName} ${modeloName}. Descubra se vale a pena comprar esse carro usado.`,
  };
}

export default async function CarroPage({ params }: PageProps) {
  const { marca, modelo } = await params;
  const carro = await getCarroBySlug(marca, modelo);

  if (!carro) {
    notFound();
  }

  incrementBuscas(carro.id).catch(console.error);

  const custoMin = carro.pecas.reduce((sum, p) => sum + p.precoMin, 0);
  const custoMax = carro.pecas.reduce((sum, p) => sum + p.precoMax, 0);

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
        <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-video bg-slate-700 rounded-xl overflow-hidden">
              {carro.imagemUrl ? (
                <img
                  src={carro.imagemUrl}
                  alt={`${carro.marca} ${carro.modelo}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🚗</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {carro.marca} {carro.modelo}
              </h1>
              <p className="text-slate-400 mb-6">
                {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Motor</span>
                  <span className="font-medium text-white">{carro.specs.motor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Potencia</span>
                  <span className="font-medium text-white">{carro.specs.potencia}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Combustivel</span>
                  <span className="font-medium text-white">{carro.specs.combustivel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Cambio</span>
                  <span className="font-medium text-white">{carro.specs.cambio}</span>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-400 font-medium mb-1">Preco FIPE</p>
                <p className="text-2xl font-bold text-blue-300">
                  {formatPriceRange(carro.fipe.min, carro.fipe.max)}
                </p>
                <p className="text-xs text-blue-400/70 mt-1">Variacao conforme ano/versao</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Pecas de Manutencao
          </h2>
          <div className="grid gap-4">
            {carro.pecas.map((peca) => (
              <PecaCard key={peca.id} peca={peca} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">
            Custo Estimado de Manutencao Anual
          </h2>
          <p className="text-4xl font-bold mb-2">
            {formatPriceRange(custoMin, custoMax)}
          </p>
          <p className="text-green-100 text-sm">
            Baseado nas pecas de desgaste comum. O custo real pode variar conforme uso e condicao do veiculo.
          </p>
        </section>
      </div>

      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
