import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize with service account
// Download from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Carros "Resto de Rico" mais pesquisados no Brasil
const carrosIniciais = [
  // ============ BMW ============
  {
    marca: 'BMW',
    modelo: '320i',
    anos: [2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 Turbo',
      potencia: '184cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // BMW 3 Series preto - Unsplash por Urte Juskauskaite
    imagemUrl: 'https://images.unsplash.com/photo-1582475186343-f25aa92e3be3?w=800&auto=format&fit=crop',
    fipe: { min: 85000, max: 145000 },
    buscas: 450
  },
  {
    marca: 'BMW',
    modelo: '328i',
    anos: [2012, 2013, 2014, 2015, 2016],
    specs: {
      motor: '2.0 Turbo',
      potencia: '245cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // BMW M3 preto - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop',
    fipe: { min: 95000, max: 155000 },
    buscas: 320
  },
  {
    marca: 'BMW',
    modelo: 'X1',
    anos: [2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 Turbo',
      potencia: '184cv a 231cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // BMW X1 branco - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop',
    fipe: { min: 75000, max: 130000 },
    buscas: 380
  },
  {
    marca: 'BMW',
    modelo: 'X3',
    anos: [2012, 2013, 2014, 2015, 2016, 2017],
    specs: {
      motor: '2.0 Turbo',
      potencia: '184cv a 306cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // BMW X3 - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?w=800&auto=format&fit=crop',
    fipe: { min: 95000, max: 165000 },
    buscas: 290
  },

  // ============ MERCEDES-BENZ ============
  {
    marca: 'Mercedes-Benz',
    modelo: 'C180',
    anos: [2012, 2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '1.6 Turbo',
      potencia: '156cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas'
    },
    // Mercedes C-Class branco - Unsplash por Peter Broomfield
    imagemUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    fipe: { min: 75000, max: 125000 },
    buscas: 420
  },
  {
    marca: 'Mercedes-Benz',
    modelo: 'C200',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '2.0 Turbo',
      potencia: '184cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 9 marchas'
    },
    // Mercedes sedan preto - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop',
    fipe: { min: 120000, max: 175000 },
    buscas: 350
  },
  {
    marca: 'Mercedes-Benz',
    modelo: 'C250',
    anos: [2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 Turbo',
      potencia: '211cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas'
    },
    // Mercedes C-Class prata - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&auto=format&fit=crop',
    fipe: { min: 110000, max: 165000 },
    buscas: 280
  },
  {
    marca: 'Mercedes-Benz',
    modelo: 'CLA 200',
    anos: [2014, 2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '1.6 Turbo / 2.0 Turbo',
      potencia: '156cv a 184cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas DCT'
    },
    // Mercedes CLA branco - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop',
    fipe: { min: 95000, max: 160000 },
    buscas: 310
  },
  {
    marca: 'Mercedes-Benz',
    modelo: 'GLA 200',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '1.6 Turbo / 2.0 Turbo',
      potencia: '156cv a 184cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 7 marchas DCT'
    },
    // Mercedes GLA cinza - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1520050206757-275e0a28e5fb?w=800&auto=format&fit=crop',
    fipe: { min: 90000, max: 145000 },
    buscas: 340
  },

  // ============ AUDI ============
  {
    marca: 'Audi',
    modelo: 'A3 Sedan',
    anos: [2014, 2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '1.4 TFSI / 2.0 TFSI',
      potencia: '150cv a 220cv',
      combustivel: 'Gasolina',
      cambio: 'Automático S-Tronic 7 marchas'
    },
    // Audi sedan preto - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop',
    fipe: { min: 80000, max: 140000 },
    buscas: 360
  },
  {
    marca: 'Audi',
    modelo: 'A4',
    anos: [2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 TFSI',
      potencia: '190cv a 252cv',
      combustivel: 'Gasolina',
      cambio: 'Automático S-Tronic 7 marchas'
    },
    // Audi A4 cinza - Unsplash por Martin Katler
    imagemUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop',
    fipe: { min: 95000, max: 175000 },
    buscas: 300
  },
  {
    marca: 'Audi',
    modelo: 'A5 Sportback',
    anos: [2012, 2013, 2014, 2015, 2016, 2017],
    specs: {
      motor: '2.0 TFSI',
      potencia: '211cv a 252cv',
      combustivel: 'Gasolina',
      cambio: 'Automático Multitronic / S-Tronic'
    },
    // Audi A5 vermelho - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop',
    fipe: { min: 90000, max: 160000 },
    buscas: 250
  },
  {
    marca: 'Audi',
    modelo: 'Q3',
    anos: [2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '1.4 TFSI / 2.0 TFSI',
      potencia: '150cv a 220cv',
      combustivel: 'Gasolina',
      cambio: 'Automático S-Tronic 6/7 marchas'
    },
    // Audi Q3 cinza SUV - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bc?w=800&auto=format&fit=crop',
    fipe: { min: 85000, max: 145000 },
    buscas: 320
  },

  // ============ LAND ROVER ============
  {
    marca: 'Land Rover',
    modelo: 'Range Rover Evoque',
    anos: [2012, 2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 Turbo / 2.2 Diesel',
      potencia: '190cv a 240cv',
      combustivel: 'Gasolina / Diesel',
      cambio: 'Automático 9 marchas'
    },
    // Range Rover Evoque preto - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop',
    fipe: { min: 95000, max: 170000 },
    buscas: 400
  },
  {
    marca: 'Land Rover',
    modelo: 'Discovery Sport',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '2.0 Turbo / 2.2 Diesel',
      potencia: '180cv a 240cv',
      combustivel: 'Gasolina / Diesel',
      cambio: 'Automático 9 marchas'
    },
    // Land Rover Discovery cinza - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&auto=format&fit=crop',
    fipe: { min: 130000, max: 200000 },
    buscas: 280
  },

  // ============ VOLVO ============
  {
    marca: 'Volvo',
    modelo: 'XC60',
    anos: [2012, 2013, 2014, 2015, 2016, 2017],
    specs: {
      motor: '2.0 T5 Turbo / 3.0 T6',
      potencia: '245cv a 306cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 6/8 marchas'
    },
    // Volvo XC60 vermelho no campo - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&auto=format&fit=crop',
    fipe: { min: 85000, max: 150000 },
    buscas: 270
  },
  {
    marca: 'Volvo',
    modelo: 'V40',
    anos: [2013, 2014, 2015, 2016, 2017, 2018],
    specs: {
      motor: '2.0 T4 / T5 Turbo',
      potencia: '180cv a 245cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 6 marchas'
    },
    // Volvo V40 cinza - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop',
    fipe: { min: 70000, max: 115000 },
    buscas: 200
  },

  // ============ JAGUAR ============
  {
    marca: 'Jaguar',
    modelo: 'XE',
    anos: [2015, 2016, 2017, 2018, 2019],
    specs: {
      motor: '2.0 Turbo',
      potencia: '200cv a 300cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // Jaguar sedan preto - Unsplash
    imagemUrl: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&auto=format&fit=crop',
    fipe: { min: 120000, max: 200000 },
    buscas: 180
  },
  {
    marca: 'Jaguar',
    modelo: 'XF',
    anos: [2012, 2013, 2014, 2015, 2016, 2017],
    specs: {
      motor: '2.0 Turbo / 3.0 V6',
      potencia: '240cv a 340cv',
      combustivel: 'Gasolina',
      cambio: 'Automático 8 marchas'
    },
    // Jaguar esportivo prata - Unsplash por Campbell
    imagemUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    fipe: { min: 90000, max: 160000 },
    buscas: 150
  }
];

// Peças específicas por marca com links reais do Mercado Livre
const pecasPorMarca: Record<string, Array<{
  nome: string;
  precoMin: number;
  precoMax: number;
  links: Array<{ site: string; url: string; preco: number }>;
}>> = {
  'BMW': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 280,
      precoMax: 650,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-bmw-320i', preco: 321 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-bmw-320i-original', preco: 450 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 250,
      precoMax: 550,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-traseira-bmw-320i', preco: 340 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-de-freio-traseira-bmw-320i-original', preco: 480 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro',
      precoMin: 450,
      precoMax: 1200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-bmw-320i', preco: 580 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-bmw-320i-original', preco: 950 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro',
      precoMin: 380,
      precoMax: 950,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-bmw-320i', preco: 450 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-bmw', preco: 680 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 45,
      precoMax: 180,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-bmw-320i', preco: 65 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-bmw-original', preco: 120 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 80,
      precoMax: 280,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-bmw-320i', preco: 110 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-bmw-original', preco: 195 }
      ]
    },
    {
      nome: 'Filtro de Combustível',
      precoMin: 120,
      precoMax: 380,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-combustivel-bmw-320i', preco: 180 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-combustivel-bmw', preco: 280 }
      ]
    },
    {
      nome: 'Filtro de Ar Condicionado',
      precoMin: 60,
      precoMax: 200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-cabine-bmw-320i', preco: 85 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-condicionado-bmw', preco: 140 }
      ]
    },
    {
      nome: 'Kit Correia Dentada',
      precoMin: 1200,
      precoMax: 3500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-correia-dentada-bmw', preco: 1800 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-correia-bmw-320i', preco: 2500 }
      ]
    },
    {
      nome: 'Velas de Ignição (jogo)',
      precoMin: 280,
      precoMax: 800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/vela-ignicao-bmw-320i', preco: 380 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/jogo-velas-bmw-320i', preco: 520 }
      ]
    },
    {
      nome: 'Bobina de Ignição',
      precoMin: 350,
      precoMax: 1100,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-ignicao-bmw-320i', preco: 450 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-bmw-original', preco: 780 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 600,
      precoMax: 1800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-bmw-320i', preco: 850 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-3660439481-par-amortecedor-dianteiro-bmw-x1-x-drive-f48-2016-ate-2019-_JM', preco: 1200 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 450,
      precoMax: 1400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-bmw-320i', preco: 620 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-bmw', preco: 950 }
      ]
    },
    {
      nome: 'Bateria 70Ah AGM',
      precoMin: 650,
      precoMax: 1400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-bmw-320i', preco: 780 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-1764515999-bateria-moura-agm-70ah-volvo-xc60-audi-a3-mini-cooper-_JM', preco: 920 }
      ]
    },
    {
      nome: 'Kit Embreagem',
      precoMin: 1500,
      precoMax: 4500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-embreagem-bmw', preco: 2200 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/embreagem-bmw-320i', preco: 3200 }
      ]
    }
  ],
  'Mercedes-Benz': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 350,
      precoMax: 750,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-mercedes-c180', preco: 420 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-dianteira-mercedes-c180', preco: 550 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 280,
      precoMax: 650,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-traseira-mercedes-c180', preco: 380 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-traseira-mercedes-classe-c', preco: 500 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro',
      precoMin: 480,
      precoMax: 1350,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-mercedes-c180', preco: 620 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-mercedes-classe-c', preco: 980 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro',
      precoMin: 400,
      precoMax: 1100,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-mercedes-c180', preco: 520 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-traseiro-mercedes', preco: 780 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 55,
      precoMax: 200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-de-oleo-mercedes-c-180', preco: 75 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-mercedes-c180', preco: 140 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 90,
      precoMax: 320,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-mercedes-c180', preco: 140 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-mercedes-classe-c', preco: 220 }
      ]
    },
    {
      nome: 'Filtro de Ar Condicionado',
      precoMin: 70,
      precoMax: 280,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-cabine-mercedes-c180', preco: 95 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-condicionado-mercedes', preco: 180 }
      ]
    },
    {
      nome: 'Kit Revisão (Filtros + Óleo)',
      precoMin: 450,
      precoMax: 1200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-filtros-mercedes-c180', preco: 520 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-oleo-mercedes-c180', preco: 850 }
      ]
    },
    {
      nome: 'Velas de Ignição (jogo)',
      precoMin: 320,
      precoMax: 900,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/vela-ignicao-mercedes-c180', preco: 420 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/jogo-velas-mercedes', preco: 620 }
      ]
    },
    {
      nome: 'Bobina de Ignição',
      precoMin: 380,
      precoMax: 1200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-ignicao-mercedes-c180', preco: 520 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-mercedes-original', preco: 850 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 650,
      precoMax: 2000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-mercedes-c180', preco: 920 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-mercedes-classe-c', preco: 1400 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 500,
      precoMax: 1600,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-mercedes-c180', preco: 720 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-mercedes', preco: 1100 }
      ]
    },
    {
      nome: 'Bateria 70Ah AGM',
      precoMin: 700,
      precoMax: 1500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-mercedes-c180', preco: 850 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-agm-mercedes', preco: 1050 }
      ]
    },
    {
      nome: 'Bomba de Combustível',
      precoMin: 1200,
      precoMax: 3500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bomba-combustivel-mercedes-c180', preco: 1800 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bomba-combustivel-mercedes', preco: 2500 }
      ]
    },
    {
      nome: 'Compressor Ar Condicionado',
      precoMin: 2500,
      precoMax: 8500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/compressor-ar-condicionado-mercedes-c180', preco: 3500 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/compressor-ar-mercedes', preco: 5500 }
      ]
    }
  ],
  'Audi': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 300,
      precoMax: 700,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-audi-a4', preco: 380 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-dianteira-audi-a3', preco: 520 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 260,
      precoMax: 600,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-traseira-audi-a4', preco: 340 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-traseira-audi', preco: 480 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro',
      precoMin: 420,
      precoMax: 1100,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-audi-a4', preco: 550 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-audi-a3', preco: 850 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro',
      precoMin: 350,
      precoMax: 900,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-audi-a4', preco: 450 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-traseiro-audi', preco: 680 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 50,
      precoMax: 180,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-audi-a4', preco: 70 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-audi-a3', preco: 125 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 85,
      precoMax: 300,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-audi-a4', preco: 120 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-audi', preco: 200 }
      ]
    },
    {
      nome: 'Kit Correia Dentada',
      precoMin: 1100,
      precoMax: 3200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-correia-dentada-audi-a4', preco: 1600 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-correia-audi', preco: 2300 }
      ]
    },
    {
      nome: 'Velas de Ignição (jogo)',
      precoMin: 300,
      precoMax: 850,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/vela-ignicao-audi-a4', preco: 400 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/jogo-velas-audi', preco: 580 }
      ]
    },
    {
      nome: 'Bobina de Ignição',
      precoMin: 320,
      precoMax: 1000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-ignicao-audi-a4', preco: 420 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bobina-audi', preco: 720 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 580,
      precoMax: 1700,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-audi-a4', preco: 820 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-1770709688-par-amortecedores-dianteiros-audi-a4-24-v6-30v-1999-2000-_JM', preco: 1200 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 420,
      precoMax: 1300,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-audi-a4', preco: 580 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-3092038547-amortecedor-traseiro-audi-a4-25-v6-24v-tdi-1999-2000-_JM', preco: 920 }
      ]
    },
    {
      nome: 'Bateria 70Ah AGM',
      precoMin: 680,
      precoMax: 1400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-audi-a4', preco: 820 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-agm-audi', preco: 1000 }
      ]
    },
    {
      nome: 'Kit Embreagem DSG',
      precoMin: 2500,
      precoMax: 7000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/kit-embreagem-dsg-audi', preco: 3800 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/embreagem-s-tronic-audi', preco: 5200 }
      ]
    },
    {
      nome: 'Sensor de Estacionamento',
      precoMin: 180,
      precoMax: 500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/sensor-estacionamento-audi-a4', preco: 250 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/sensor-re-audi', preco: 380 }
      ]
    }
  ],
  'Land Rover': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 450,
      precoMax: 950,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-range-rover-evoque', preco: 580 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-dianteira-evoque', preco: 720 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 380,
      precoMax: 800,
      links: [
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-2024511145-pastilha-de-freio-traseira-range-rover-evoque-_JM', preco: 480 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-traseira-evoque', preco: 650 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro (par)',
      precoMin: 900,
      precoMax: 2500,
      links: [
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-4452814918-par-disco-freio-dianteiro-range-rover-evoque-20-16v-2018-_JM', preco: 1200 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-evoque', preco: 1800 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro (par)',
      precoMin: 700,
      precoMax: 1800,
      links: [
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-3973718009-disco-freio-traseiro-r-rover-evoque-20-2018-2025-solido-_JM', preco: 850 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-3569722689-par-disco-freio-traseiro-range-rover-evoque-20-16v-2020-trw-_JM', preco: 1200 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 75,
      precoMax: 280,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-range-rover-evoque', preco: 110 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-land-rover', preco: 180 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 120,
      precoMax: 400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-range-rover-evoque', preco: 180 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-evoque', preco: 280 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 1200,
      precoMax: 3500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-range-rover-evoque', preco: 1800 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-evoque', preco: 2500 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 900,
      precoMax: 2800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-range-rover-evoque', preco: 1400 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-evoque', preco: 2000 }
      ]
    },
    {
      nome: 'Pneu 235/60 R18 (unidade)',
      precoMin: 650,
      precoMax: 1500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pneu-235-60-r18-range-rover-evoque', preco: 850 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pneu-evoque', preco: 1100 }
      ]
    },
    {
      nome: 'Bomba de Água',
      precoMin: 800,
      precoMax: 2500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bomba-agua-range-rover-evoque', preco: 1200 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bomba-agua-land-rover', preco: 1800 }
      ]
    },
    {
      nome: 'Válvula Termostática',
      precoMin: 450,
      precoMax: 1200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/valvula-termostatica-evoque', preco: 650 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/termostatica-range-rover', preco: 900 }
      ]
    },
    {
      nome: 'Bateria 80Ah',
      precoMin: 850,
      precoMax: 1800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-range-rover-evoque', preco: 1100 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-land-rover', preco: 1400 }
      ]
    }
  ],
  'Volvo': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 380,
      precoMax: 850,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-volvo-xc60', preco: 480 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-dianteira-volvo', preco: 650 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 320,
      precoMax: 700,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-traseira-volvo-xc60', preco: 420 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-traseira-volvo', preco: 580 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro (par)',
      precoMin: 800,
      precoMax: 2000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-volvo-xc60', preco: 1050 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-volvo', preco: 1500 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro (par)',
      precoMin: 550,
      precoMax: 1400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-volvo-xc60', preco: 700 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-traseiro-volvo', preco: 1000 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 60,
      precoMax: 220,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-volvo-xc60', preco: 90 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pecas-volvo-xc60', preco: 150 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 100,
      precoMax: 350,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-volvo-xc60', preco: 170 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-volvo', preco: 250 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 750,
      precoMax: 2200,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-volvo-xc60', preco: 1100 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-volvo', preco: 1600 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 400,
      precoMax: 1500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-volvo-xc60', preco: 650 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-volvo', preco: 1000 }
      ]
    },
    {
      nome: 'Bateria Principal',
      precoMin: 789,
      precoMax: 1800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-volvo-xc60', preco: 950 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-1764515999-bateria-moura-agm-70ah-volvo-xc60-audi-a3-mini-cooper-_JM', preco: 1200 }
      ]
    },
    {
      nome: 'Bateria Auxiliar',
      precoMin: 450,
      precoMax: 900,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-auxiliar-volvo-xc60', preco: 550 },
        { site: 'mercadolivre', url: 'https://produto.mercadolivre.com.br/MLB-1377956979-bateria-auxiliar-volvo-xc60-t5-20152017-original-31358957-_JM', preco: 649 }
      ]
    },
    {
      nome: 'Mola de Suspensão Dianteira',
      precoMin: 600,
      precoMax: 1500,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/mola-suspensao-volvo-xc60', preco: 900 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/mola-dianteira-volvo', preco: 1200 }
      ]
    }
  ],
  'Jaguar': [
    {
      nome: 'Pastilha de Freio Dianteira',
      precoMin: 450,
      precoMax: 1000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-jaguar-xe', preco: 580 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-jaguar-xf', preco: 780 }
      ]
    },
    {
      nome: 'Pastilha de Freio Traseira',
      precoMin: 380,
      precoMax: 850,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-freio-traseira-jaguar', preco: 480 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/pastilha-traseira-jaguar-xe', preco: 680 }
      ]
    },
    {
      nome: 'Disco de Freio Dianteiro',
      precoMin: 700,
      precoMax: 1800,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-dianteiro-jaguar', preco: 950 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-jaguar-xe', preco: 1400 }
      ]
    },
    {
      nome: 'Disco de Freio Traseiro',
      precoMin: 550,
      precoMax: 1400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-freio-traseiro-jaguar', preco: 720 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/disco-traseiro-jaguar-xf', preco: 1100 }
      ]
    },
    {
      nome: 'Filtro de Óleo',
      precoMin: 80,
      precoMax: 280,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-jaguar-xe', preco: 120 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-oleo-jaguar', preco: 200 }
      ]
    },
    {
      nome: 'Filtro de Ar',
      precoMin: 130,
      precoMax: 420,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-jaguar-xe', preco: 200 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/filtro-ar-jaguar', preco: 320 }
      ]
    },
    {
      nome: 'Amortecedor Dianteiro',
      precoMin: 1000,
      precoMax: 3000,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-dianteiro-jaguar', preco: 1500 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-jaguar-xe', preco: 2200 }
      ]
    },
    {
      nome: 'Amortecedor Traseiro',
      precoMin: 800,
      precoMax: 2400,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-jaguar', preco: 1200 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/amortecedor-traseiro-jaguar-xf', preco: 1800 }
      ]
    },
    {
      nome: 'Bateria 80Ah AGM',
      precoMin: 900,
      precoMax: 1900,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-jaguar-xe', preco: 1100 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/bateria-jaguar', preco: 1500 }
      ]
    },
    {
      nome: 'Velas de Ignição (jogo)',
      precoMin: 400,
      precoMax: 1100,
      links: [
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/vela-ignicao-jaguar', preco: 550 },
        { site: 'mercadolivre', url: 'https://lista.mercadolivre.com.br/jogo-velas-jaguar-xe', preco: 800 }
      ]
    }
  ]
};

// Função para criar slug a partir de marca e modelo
function createSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seed() {
  console.log('🚗 Iniciando seed do banco de dados...');
  console.log('📊 Total de carros a serem adicionados:', carrosIniciais.length);

  for (const carro of carrosIniciais) {
    const slug = `${createSlug(carro.marca)}/${createSlug(carro.modelo)}`;

    // Adicionar o carro com o slug como ID do documento
    const carroData = {
      ...carro,
      slug,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const carroRef = await db.collection('carros').add(carroData);
    console.log(`✅ Adicionado: ${carro.marca} ${carro.modelo} (${carro.anos[0]}-${carro.anos[carro.anos.length - 1]})`);

    // Buscar peças específicas para a marca
    const pecas = pecasPorMarca[carro.marca] || pecasPorMarca['BMW']; // Fallback para BMW se não encontrar

    for (const peca of pecas) {
      await carroRef.collection('pecas').add({
        nome: peca.nome,
        precoMin: peca.precoMin,
        precoMax: peca.precoMax,
        links: peca.links,
        atualizadoEm: new Date()
      });
    }
    console.log(`   📦 Adicionadas ${pecas.length} peças para ${carro.modelo}`);
  }

  console.log('\n🎉 Seed completo!');
  console.log(`📈 Total: ${carrosIniciais.length} carros com peças e links reais do Mercado Livre`);
}

seed().catch(console.error);
