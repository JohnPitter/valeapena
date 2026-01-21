import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';
import axios from 'axios';
import { Carro, FipeRange } from '../types/index.js';
import { scrapePecasForCarro } from './pecaService.js';

const FIPE_BASE = 'https://parallelum.com.br/fipe/api/v1/carros';

export async function createCarroFromFipe(
  marcaId: string,
  modeloId: string,
  anos: string[]
): Promise<string> {
  // Fetch first year to get basic info
  const { data: firstYear } = await axios.get(
    `${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos/${anos[0]}`
  );

  // Fetch all years to get price range
  const prices: number[] = [];
  for (const ano of anos) {
    try {
      const { data } = await axios.get(
        `${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos/${ano}`
      );
      const preco = parseInt(data.Valor.replace(/\D/g, ''), 10);
      if (!isNaN(preco)) prices.push(preco);
    } catch (e) {
      console.error(`Error fetching price for year ${ano}`);
    }
  }

  const fipe: FipeRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  const anosNumeros = anos.map(a => parseInt(a.split('-')[0], 10));

  const carro: Omit<Carro, 'id'> = {
    marca: firstYear.Marca,
    modelo: firstYear.Modelo,
    codigoFipe: firstYear.CodigoFipe,
    anos: anosNumeros,
    specs: {
      motor: '-',
      combustivel: firstYear.Combustivel,
      cambio: '-',
      potencia: '-',
    },
    imagemUrl: '',
    fipe,
    buscas: 0,
    criadoEm: Timestamp.now(),
    atualizadoEm: Timestamp.now(),
  };

  const docRef = await db.collection('carros').add(carro);
  console.log(`Created carro ${carro.marca} ${carro.modelo} with ID ${docRef.id}`);

  // Scrape pecas
  await scrapePecasForCarro(docRef.id, carro.marca, carro.modelo);

  return docRef.id;
}

export async function carroExistsByFipe(codigoFipe: string): Promise<string | null> {
  const snapshot = await db.collection('carros')
    .where('codigoFipe', '==', codigoFipe)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}
