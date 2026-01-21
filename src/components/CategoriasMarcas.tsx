import Link from 'next/link';

const MARCAS = [
  { nome: 'BMW', logo: '🔵', slug: 'bmw', modelos: 12 },
  { nome: 'Mercedes-Benz', logo: '⭐', slug: 'mercedes-benz', modelos: 15 },
  { nome: 'Audi', logo: '⚫', slug: 'audi', modelos: 10 },
  { nome: 'Land Rover', logo: '🟢', slug: 'land-rover', modelos: 6 },
  { nome: 'Volvo', logo: '🔷', slug: 'volvo', modelos: 8 },
  { nome: 'Jaguar', logo: '🐆', slug: 'jaguar', modelos: 5 },
];

export default function CategoriasMarcas() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {MARCAS.map((marca) => (
        <Link
          key={marca.slug}
          href={`/marca/${marca.slug}`}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 text-center transition-all hover:scale-105"
        >
          <span className="text-4xl mb-3 block">{marca.logo}</span>
          <p className="font-semibold text-white">{marca.nome}</p>
          <p className="text-sm text-slate-500">{marca.modelos} modelos</p>
        </Link>
      ))}
    </div>
  );
}
