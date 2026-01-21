import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarroBySlug, incrementBuscas } from '@/lib/carros';
import { formatCurrency, formatPriceRange, unslugify } from '@/lib/utils';
import PecaCard from '@/components/PecaCard';
import AdBanner from '@/components/AdBanner';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ marca: string; modelo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca, modelo } = await params;
  const marcaName = unslugify(marca);
  const modeloName = unslugify(modelo);

  return {
    title: `${marcaName} ${modeloName} - Vale a Pena? | Preço FIPE e Peças`,
    description: `Veja o preço FIPE e custo das peças de manutenção do ${marcaName} ${modeloName}. Descubra se vale a pena comprar esse carro usado.`,
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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Vale a Pena?
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {carro.marca} {carro.modelo}
              </h1>
              <p className="text-gray-500 mb-6">
                {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Motor</span>
                  <span className="font-medium">{carro.specs.motor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Potência</span>
                  <span className="font-medium">{carro.specs.potencia}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Combustível</span>
                  <span className="font-medium">{carro.specs.combustivel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Câmbio</span>
                  <span className="font-medium">{carro.specs.cambio}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Preço FIPE</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatPriceRange(carro.fipe.min, carro.fipe.max)}
                </p>
                <p className="text-xs text-blue-500 mt-1">Variação conforme ano/versão</p>
              </div>
            </div>
          </div>
        </section>

        <AdBanner className="h-24 mb-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Peças de Manutenção
          </h2>
          <div className="grid gap-4">
            {carro.pecas.map((peca) => (
              <PecaCard key={peca.id} peca={peca} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">
            Custo Estimado de Manutenção Anual
          </h2>
          <p className="text-4xl font-bold mb-2">
            {formatPriceRange(custoMin, custoMax)}
          </p>
          <p className="text-green-100 text-sm">
            Baseado nas peças de desgaste comum. O custo real pode variar conforme uso e condição do veículo.
          </p>
        </section>
      </div>

      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
