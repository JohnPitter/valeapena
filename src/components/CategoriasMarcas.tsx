import Link from 'next/link';
import MarcaLogo from './MarcaLogo';

const MARCAS = [
  { nome: 'BMW', slug: 'bmw', modelos: 12 },
  { nome: 'Mercedes-Benz', slug: 'mercedes-benz', modelos: 15 },
  { nome: 'Audi', slug: 'audi', modelos: 10 },
  { nome: 'Land Rover', slug: 'land-rover', modelos: 6 },
  { nome: 'Volvo', slug: 'volvo', modelos: 8 },
  { nome: 'Jaguar', slug: 'jaguar', modelos: 5 },
];

export default function CategoriasMarcas() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {MARCAS.map((marca) => (
        <Link
          key={marca.slug}
          href={`/marca/${marca.slug}`}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 text-center transition-all hover:scale-105 flex flex-col items-center"
        >
          <MarcaLogo marca={marca.slug} className="w-16 h-16 mb-3" />
          <p className="font-semibold text-white">{marca.nome}</p>
          <p className="text-sm text-slate-500">{marca.modelos} modelos</p>
        </Link>
      ))}
    </div>
  );
}
