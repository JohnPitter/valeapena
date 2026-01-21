import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedPeca } from '../types/index.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrapeOlx(
  marca: string,
  modelo: string,
  pecaNome: string
): Promise<ScrapedPeca[]> {
  const query = encodeURIComponent(`${pecaNome} ${marca} ${modelo}`);
  const url = `https://www.olx.com.br/autos-e-pecas/pecas-e-acessorios?q=${query}`;

  try {
    await delay(DELAY_MS);

    const { data } = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    const $ = cheerio.load(data);
    const results: ScrapedPeca[] = [];

    $('[data-ds-component="DS-AdCard"]').slice(0, 5).each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2').text().trim();
      const priceText = $el.find('[data-ds-component="DS-Text"]').first().text();
      const link = $el.find('a').attr('href');

      if (title && priceText && link) {
        const preco = parseInt(priceText.replace(/\D/g, ''), 10);
        if (!isNaN(preco) && preco > 0) {
          results.push({
            nome: title,
            preco,
            url: link.startsWith('http') ? link : `https://www.olx.com.br${link}`,
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error(`Error scraping OLX for ${pecaNome}:`, error);
    return [];
  }
}
