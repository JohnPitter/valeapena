import { Peca } from '@/types';
import { formatPriceRange } from '@/lib/utils';

interface PecaCardProps {
  peca: Peca;
}

const siteIcons: Record<string, string> = {
  mercadolivre: '🛒',
  autozone: '🔧',
  olx: '📦',
  icarros: '🚘',
};

const siteNames: Record<string, string> = {
  mercadolivre: 'MercadoLivre',
  autozone: 'AutoZone',
  olx: 'OLX',
  icarros: 'iCarros',
};

export default function PecaCard({ peca }: PecaCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white">{peca.nome}</h3>
        <span className="text-lg font-bold text-emerald-400">
          {formatPriceRange(peca.precoMin, peca.precoMax)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {peca.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-sm text-slate-300 transition-colors"
          >
            <span>{siteIcons[link.site]}</span>
            <span>{siteNames[link.site]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
