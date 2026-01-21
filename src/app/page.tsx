import SearchBar from '@/components/SearchBar';
import CarrosPopulares from '@/components/CarrosPopulares';
import CategoriasMarcas from '@/components/CategoriasMarcas';
import { getCarrosPopulares } from '@/lib/carros';

export const revalidate = 3600;

export default async function Home() {
  let carrosPopulares: any[] = [];

  try {
    carrosPopulares = await getCarrosPopulares(8);
  } catch (error) {
    console.error('Error fetching popular cars:', error);
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Vale a <span className="text-blue-500">Pena</span>?
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Descubra o custo real de manter um carro usado antes de comprar
          </p>
          <SearchBar />
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span>Populares:</span>
            <button className="hover:text-blue-400 transition-colors">BMW 320i</button>
            <button className="hover:text-blue-400 transition-colors">Mercedes C250</button>
            <button className="hover:text-blue-400 transition-colors">Audi A4</button>
          </div>
        </div>
      </section>

      {/* Marcas Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Explore por Marca</h2>
        <CategoriasMarcas />
      </section>

      {/* Popular Cars */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CarrosPopulares carros={carrosPopulares} />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
