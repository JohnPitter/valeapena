import { Peca } from '@/types';
import { formatPriceRange } from '@/lib/utils';

interface PecaCardProps {
  peca: Peca;
}

const siteIcons: Record<string, string> = {
  mercadolivre: '🛒',
  autozone: '🔧',
  olx: '📦',
};

const siteNames: Record<string, string> = {
  mercadolivre: 'MercadoLivre',
  autozone: 'AutoZone',
  olx: 'OLX',
};

export default function PecaCard({ peca }: PecaCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{peca.nome}</h3>
        <span className="text-lg font-bold text-green-600">
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
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            <span>{siteIcons[link.site]}</span>
            <span>{siteNames[link.site]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
