import { Carro } from '@/types';
import CarroCard from './CarroCard';

interface CarrosPopularesProps {
  carros: Carro[];
}

export default function CarrosPopulares({ carros }: CarrosPopularesProps) {
  if (carros.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Mais Pesquisados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {carros.map((carro) => (
          <CarroCard key={carro.id} carro={carro} />
        ))}
      </div>
    </section>
  );
}
