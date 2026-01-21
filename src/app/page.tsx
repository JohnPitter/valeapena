import SearchBar from '@/components/SearchBar';
import CarrosPopulares from '@/components/CarrosPopulares';
import AdBanner from '@/components/AdBanner';
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
    <main className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vale a Pena?
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Descubra o custo real de manter um carro usado antes de comprar
          </p>
          <SearchBar />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <AdBanner className="h-24" />
      </div>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CarrosPopulares carros={carrosPopulares} />
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
