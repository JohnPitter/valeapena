import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';
import { scrapeMercadoLivre, PECAS_COMUNS } from '../scrapers/mercadolivre.js';
import { Peca, PecaLink } from '../types/index.js';

export async function scrapePecasForCarro(
  carroId: string,
  marca: string,
  modelo: string
): Promise<void> {
  const pecasRef = db.collection('carros').doc(carroId).collection('pecas');

  for (const pecaNome of PECAS_COMUNS) {
    console.log(`Scraping ${pecaNome} for ${marca} ${modelo}...`);

    const mlResults = await scrapeMercadoLivre(marca, modelo, pecaNome);

    if (mlResults.length === 0) {
      console.log(`No results for ${pecaNome}`);
      continue;
    }

    const precos = mlResults.map(r => r.preco);
    const links: PecaLink[] = mlResults.slice(0, 3).map(r => ({
      site: 'mercadolivre' as const,
      url: r.url,
      preco: r.preco,
    }));

    const peca: Omit<Peca, 'id'> = {
      nome: pecaNome,
      precoMin: Math.min(...precos),
      precoMax: Math.max(...precos),
      links,
      atualizadoEm: Timestamp.now(),
    };

    await pecasRef.doc(slugify(pecaNome)).set(peca);
    console.log(`Saved ${pecaNome}: R$${peca.precoMin} - R$${peca.precoMax}`);
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
