import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';
import { scrapeMercadoLivre, PECAS_COMUNS } from '../scrapers/mercadolivre.js';
import { scrapeOlx } from '../scrapers/olx.js';
import { scrapeIcarros } from '../scrapers/icarros.js';
import { Peca, PecaLink } from '../types/index.js';

export async function scrapePecasForCarro(
  carroId: string,
  marca: string,
  modelo: string
): Promise<void> {
  const pecasRef = db.collection('carros').doc(carroId).collection('pecas');

  for (const pecaNome of PECAS_COMUNS) {
    console.log(`Scraping ${pecaNome} for ${marca} ${modelo}...`);

    // Run all scrapers in parallel
    const [mlResults, olxResults, icarrosResults] = await Promise.all([
      scrapeMercadoLivre(marca, modelo, pecaNome),
      scrapeOlx(marca, modelo, pecaNome),
      scrapeIcarros(marca, modelo, pecaNome),
    ]);

    const allResults = [...mlResults, ...olxResults, ...icarrosResults];

    if (allResults.length === 0) {
      console.log(`No results for ${pecaNome}`);
      continue;
    }

    const precos = allResults.map(r => r.preco);

    const links: PecaLink[] = [
      ...mlResults.slice(0, 2).map(r => ({ site: 'mercadolivre' as const, url: r.url, preco: r.preco })),
      ...olxResults.slice(0, 2).map(r => ({ site: 'olx' as const, url: r.url, preco: r.preco })),
      ...icarrosResults.slice(0, 2).map(r => ({ site: 'icarros' as const, url: r.url, preco: r.preco })),
    ];

    const peca: Omit<Peca, 'id'> = {
      nome: pecaNome,
      precoMin: Math.min(...precos),
      precoMax: Math.max(...precos),
      links,
      atualizadoEm: Timestamp.now(),
    };

    await pecasRef.doc(slugify(pecaNome)).set(peca);
    console.log(`Saved ${pecaNome}: R$${peca.precoMin} - R$${peca.precoMax} (${links.length} links)`);
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export { PECAS_COMUNS };
