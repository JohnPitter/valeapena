import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize with service account
// Download from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const carrosIniciais = [
  {
    marca: 'Mercedes-Benz',
    modelo: 'C180',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '1.6 Turbo',
      potencia: '156cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas'
    },
    imagemUrl: '',
    fipe: { min: 95000, max: 145000 },
    buscas: 150
  },
  {
    marca: 'Mercedes-Benz',
    modelo: 'C250',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '2.0 Turbo',
      potencia: '211cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas'
    },
    imagemUrl: '',
    fipe: { min: 110000, max: 165000 },
    buscas: 200
  },
  {
    marca: 'BMW',
    modelo: '320i',
    anos: [2015, 2016, 2017, 2018, 2019, 2020],
    specs: {
      motor: '2.0 Turbo',
      potencia: '184cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    imagemUrl: '',
    fipe: { min: 100000, max: 175000 },
    buscas: 300
  },
  {
    marca: 'Audi',
    modelo: 'A4',
    anos: [2016, 2017, 2018, 2019, 2020],
    specs: {
      motor: '2.0 TFSI',
      potencia: '190cv',
      combustivel: 'Gasolina',
      cambio: 'Automático S-Tronic 7 marchas'
    },
    imagemUrl: '',
    fipe: { min: 120000, max: 185000 },
    buscas: 180
  }
];

const pecasPadrao = [
  { nome: 'Pastilha de Freio Dianteira', precoMin: 150, precoMax: 400 },
  { nome: 'Pastilha de Freio Traseira', precoMin: 120, precoMax: 350 },
  { nome: 'Disco de Freio Dianteiro', precoMin: 300, precoMax: 800 },
  { nome: 'Disco de Freio Traseiro', precoMin: 250, precoMax: 700 },
  { nome: 'Filtro de Óleo', precoMin: 40, precoMax: 150 },
  { nome: 'Filtro de Ar', precoMin: 60, precoMax: 200 },
  { nome: 'Filtro de Combustível', precoMin: 80, precoMax: 250 },
  { nome: 'Filtro de Cabine', precoMin: 50, precoMax: 180 },
  { nome: 'Kit Correia Dentada', precoMin: 800, precoMax: 2500 },
  { nome: 'Velas de Ignição (jogo)', precoMin: 200, precoMax: 600 },
  { nome: 'Bobina de Ignição', precoMin: 300, precoMax: 900 },
  { nome: 'Amortecedor Dianteiro', precoMin: 400, precoMax: 1200 },
  { nome: 'Amortecedor Traseiro', precoMin: 350, precoMax: 1000 },
  { nome: 'Bateria', precoMin: 400, precoMax: 900 },
  { nome: 'Kit Embreagem', precoMin: 1200, precoMax: 3500 }
];

async function seed() {
  console.log('Seeding database...');

  for (const carro of carrosIniciais) {
    const carroRef = await db.collection('carros').add(carro);
    console.log(`Added carro: ${carro.marca} ${carro.modelo}`);

    for (const peca of pecasPadrao) {
      await carroRef.collection('pecas').add({
        ...peca,
        links: [
          { site: 'mercadolivre', url: 'https://mercadolivre.com.br', preco: peca.precoMin },
          { site: 'olx', url: 'https://olx.com.br', preco: peca.precoMax }
        ],
        atualizadoEm: new Date()
      });
    }
    console.log(`Added ${pecasPadrao.length} pecas for ${carro.modelo}`);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
