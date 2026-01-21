import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedPeca } from '../types/index.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrapeMercadoLivre(
  marca: string,
  modelo: string,
  pecaNome: string
): Promise<ScrapedPeca[]> {
  const query = `${pecaNome} ${marca} ${modelo}`.replace(/\s+/g, '-');
  const url = `https://lista.mercadolivre.com.br/${query}_NoIndex_True`;

  try {
    await delay(DELAY_MS);

    const { data } = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    const $ = cheerio.load(data);
    const results: ScrapedPeca[] = [];

    $('.ui-search-layout__item').slice(0, 5).each((_, el) => {
      const $el = $(el);
      const title = $el.find('.ui-search-item__title').text().trim();
      const priceText = $el.find('.andes-money-amount__fraction').first().text();
      const link = $el.find('a.ui-search-link').attr('href');

      if (title && priceText && link) {
        const preco = parseInt(priceText.replace(/\D/g, ''), 10);
        if (!isNaN(preco) && preco > 0) {
          results.push({
            nome: title,
            preco,
            url: link.split('?')[0],
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error(`Error scraping ML for ${pecaNome}:`, error);
    return [];
  }
}

export const PECAS_COMUNS = [
  'Pastilha de freio dianteira',
  'Pastilha de freio traseira',
  'Disco de freio dianteiro',
  'Disco de freio traseiro',
  'Filtro de óleo',
  'Filtro de ar',
  'Filtro de combustível',
  'Filtro de cabine',
  'Vela de ignição',
  'Bobina de ignição',
  'Amortecedor dianteiro',
  'Amortecedor traseiro',
  'Correia dentada',
  'Tensor correia dentada',
  'Bomba d\'água',
];
