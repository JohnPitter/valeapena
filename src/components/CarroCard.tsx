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
      className="group block bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-all"
    >
      <div className="aspect-video bg-slate-700 relative overflow-hidden">
        {carro.imagemUrl ? (
          <img
            src={carro.imagemUrl}
            alt={`${carro.marca} ${carro.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {formatCurrency(carro.fipe.min)}+
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white">{carro.marca}</h3>
        <p className="text-slate-400">{carro.modelo}</p>
        <p className="text-sm text-slate-500 mt-1">
          {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
          <span className="text-sm text-slate-500">FIPE</span>
          <span className="font-semibold text-blue-400">
            {formatCurrency(carro.fipe.min)} - {formatCurrency(carro.fipe.max)}
          </span>
        </div>
      </div>
    </Link>
  );
}
