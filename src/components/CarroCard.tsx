import Link from 'next/link';
import { Carro } from '@/types';
import { formatCurrency, slugify } from '@/lib/utils';

interface CarroCardProps {
  carro: Carro;
}

export default function CarroCard({ carro }: CarroCardProps) {
  const marcaSlug = slugify(carro.marca);
  const modeloSlug = slugify(carro.modelo);

  return (
    <Link
      href={`/carro/${marcaSlug}/${modeloSlug}`}
      className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
    >
      <div className="aspect-video bg-gray-100 relative">
        {carro.imagemUrl ? (
          <img
            src={carro.imagemUrl}
            alt={`${carro.marca} ${carro.modelo}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{carro.marca}</h3>
        <p className="text-gray-600">{carro.modelo}</p>
        <p className="text-sm text-gray-400 mt-1">
          {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
        </p>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">FIPE</p>
          <p className="font-semibold text-blue-600">
            {formatCurrency(carro.fipe.min)} - {formatCurrency(carro.fipe.max)}
          </p>
        </div>
      </div>
    </Link>
  );
}
