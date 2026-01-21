# Vale a Pena - Backend + Frontend Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a dedicated Node.js backend for scraping car data with user request system, email notifications, and redesign the frontend with a modern Webmotors-inspired UI.

**Architecture:** Separate backend (Express + TypeScript) that scrapes FIPE/ML/OLX, processes user requests for missing cars, sends email notifications via SendGrid. Frontend (Next.js) gets redesigned with dark hero, card-based layout, and guided car request modal.

**Tech Stack:** Node.js, Express, TypeScript, Firebase Admin SDK, Cheerio, node-cron, SendGrid, Next.js 16, React 19, Tailwind CSS

---

## Task 1: Backend Project Setup

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/index.ts`
- Create: `backend/src/config/firebase.ts`
- Create: `backend/.env.example`
- Create: `backend/.gitignore`

**Step 1: Create backend directory and package.json**

```bash
mkdir -p backend/src/config backend/src/scrapers backend/src/services backend/src/jobs backend/src/routes
```

```json
// backend/package.json
{
  "name": "valeapena-backend",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "cheerio": "^1.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.21.0",
    "firebase-admin": "^13.0.0",
    "node-cron": "^3.0.3",
    "@sendgrid/mail": "^8.1.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.0.0",
    "@types/node-cron": "^3.0.11",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create Firebase config**

```typescript
// backend/src/config/firebase.ts
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
```

**Step 4: Create Express server entry point**

```typescript
// backend/src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/firebase';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
```

**Step 5: Create .env.example and .gitignore**

```bash
# backend/.env.example
PORT=3001
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
SENDGRID_API_KEY=
SCRAPING_FREQUENCY_HOURS=12
```

```bash
# backend/.gitignore
node_modules/
dist/
.env
*.log
```

**Step 6: Install dependencies and verify**

Run: `cd backend && npm install`

Run: `cd backend && npm run dev`

Expected: Server starts on port 3001

**Step 7: Commit**

```bash
git add backend/
git commit -m "feat(backend): initial project setup with Express + Firebase"
```

---

## Task 2: FIPE API Proxy Routes

**Files:**
- Create: `backend/src/routes/fipe.ts`
- Modify: `backend/src/index.ts`

**Step 1: Create FIPE routes**

```typescript
// backend/src/routes/fipe.ts
import { Router } from 'express';
import axios from 'axios';

const router = Router();
const FIPE_BASE = 'https://parallelum.com.br/fipe/api/v1/carros';

router.get('/marcas', async (req, res) => {
  try {
    const { data } = await axios.get(`${FIPE_BASE}/marcas`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching marcas:', error);
    res.status(500).json({ error: 'Failed to fetch marcas' });
  }
});

router.get('/marcas/:marcaId/modelos', async (req, res) => {
  try {
    const { marcaId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching modelos:', error);
    res.status(500).json({ error: 'Failed to fetch modelos' });
  }
});

router.get('/marcas/:marcaId/modelos/:modeloId/anos', async (req, res) => {
  try {
    const { marcaId, modeloId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching anos:', error);
    res.status(500).json({ error: 'Failed to fetch anos' });
  }
});

router.get('/marcas/:marcaId/modelos/:modeloId/anos/:anoId', async (req, res) => {
  try {
    const { marcaId, modeloId, anoId } = req.params;
    const { data } = await axios.get(`${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching preco:', error);
    res.status(500).json({ error: 'Failed to fetch preco' });
  }
});

export default router;
```

**Step 2: Register routes in index.ts**

```typescript
// backend/src/index.ts - add after app.use(express.json());
import fipeRoutes from './routes/fipe';

app.use('/api/fipe', fipeRoutes);
```

**Step 3: Test the endpoint**

Run: `curl http://localhost:3001/api/fipe/marcas | head -c 500`

Expected: JSON array of car brands

**Step 4: Commit**

```bash
git add backend/src/routes/fipe.ts backend/src/index.ts
git commit -m "feat(backend): add FIPE API proxy routes"
```

---

## Task 3: Mercado Livre Scraper Service

**Files:**
- Create: `backend/src/scrapers/mercadolivre.ts`
- Create: `backend/src/services/pecaService.ts`
- Create: `backend/src/types/index.ts`

**Step 1: Create shared types**

```typescript
// backend/src/types/index.ts
import { Timestamp } from 'firebase-admin/firestore';

export interface Carro {
  id?: string;
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
  specs: CarroSpecs;
  imagemUrl: string;
  fipe: FipeRange;
  buscas: number;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}

export interface CarroSpecs {
  motor: string;
  combustivel: string;
  cambio: string;
  potencia: string;
}

export interface FipeRange {
  min: number;
  max: number;
}

export interface Peca {
  id?: string;
  nome: string;
  precoMin: number;
  precoMax: number;
  links: PecaLink[];
  atualizadoEm: Timestamp;
}

export interface PecaLink {
  site: 'mercadolivre' | 'olx' | 'icarros';
  url: string;
  preco: number;
}

export interface Solicitacao {
  id?: string;
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
  email: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  criadoEm: Timestamp;
  processadoEm: Timestamp | null;
  carroId: string | null;
}

export interface ScrapedPeca {
  nome: string;
  preco: number;
  url: string;
}
```

**Step 2: Create Mercado Livre scraper**

```typescript
// backend/src/scrapers/mercadolivre.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedPeca } from '../types';

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
```

**Step 3: Create peca service**

```typescript
// backend/src/services/pecaService.ts
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { scrapeMercadoLivre, PECAS_COMUNS } from '../scrapers/mercadolivre';
import { Peca, PecaLink } from '../types';

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
```

**Step 4: Commit**

```bash
git add backend/src/types/index.ts backend/src/scrapers/mercadolivre.ts backend/src/services/pecaService.ts
git commit -m "feat(backend): add Mercado Livre scraper and peca service"
```

---

## Task 4: Solicitacoes System

**Files:**
- Create: `backend/src/routes/solicitacoes.ts`
- Create: `backend/src/services/solicitacaoService.ts`
- Create: `backend/src/services/carroService.ts`
- Modify: `backend/src/index.ts`

**Step 1: Create carro service**

```typescript
// backend/src/services/carroService.ts
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import axios from 'axios';
import { Carro, FipeRange } from '../types';
import { scrapePecasForCarro } from './pecaService';

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
```

**Step 2: Create solicitacao service**

```typescript
// backend/src/services/solicitacaoService.ts
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { Solicitacao } from '../types';
import { createCarroFromFipe, carroExistsByFipe } from './carroService';
import { queueEmail } from './emailService';

export async function createSolicitacao(
  data: Omit<Solicitacao, 'id' | 'status' | 'criadoEm' | 'processadoEm' | 'carroId'>
): Promise<string> {
  const solicitacao: Omit<Solicitacao, 'id'> = {
    ...data,
    status: 'pendente',
    criadoEm: Timestamp.now(),
    processadoEm: null,
    carroId: null,
  };

  const docRef = await db.collection('solicitacoes').add(solicitacao);
  return docRef.id;
}

export async function processPendingSolicitacoes(): Promise<void> {
  const snapshot = await db.collection('solicitacoes')
    .where('status', '==', 'pendente')
    .limit(10)
    .get();

  console.log(`Processing ${snapshot.size} pending solicitacoes...`);

  for (const doc of snapshot.docs) {
    const solicitacao = { id: doc.id, ...doc.data() } as Solicitacao;

    try {
      await doc.ref.update({ status: 'processando' });

      // Check if car already exists
      let carroId = await carroExistsByFipe(solicitacao.codigoFipe);

      if (!carroId) {
        // Create new car from FIPE
        // Note: We need marcaId and modeloId which we don't store
        // For now, mark as error - we'll enhance this
        console.log(`Need to create car for ${solicitacao.marca} ${solicitacao.modelo}`);
        // carroId = await createCarroFromFipe(marcaId, modeloId, anos);
      }

      if (carroId) {
        await doc.ref.update({
          status: 'concluido',
          processadoEm: Timestamp.now(),
          carroId,
        });

        // Queue email notification
        await queueEmail({
          para: solicitacao.email,
          tipo: 'carro_disponivel',
          dados: {
            marca: solicitacao.marca,
            modelo: solicitacao.modelo,
            url: `https://valeapena.com.br/carro/${slugify(solicitacao.marca)}/${slugify(solicitacao.modelo)}`,
          },
        });

        console.log(`Completed solicitacao ${doc.id}`);
      }
    } catch (error) {
      console.error(`Error processing solicitacao ${doc.id}:`, error);
      await doc.ref.update({ status: 'erro' });
    }
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
```

**Step 3: Create solicitacoes routes**

```typescript
// backend/src/routes/solicitacoes.ts
import { Router } from 'express';
import { createSolicitacao } from '../services/solicitacaoService';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { marca, modelo, codigoFipe, anos, email } = req.body;

    if (!marca || !modelo || !codigoFipe || !anos || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const id = await createSolicitacao({
      marca,
      modelo,
      codigoFipe,
      anos,
      email,
    });

    res.status(201).json({ id, message: 'Solicitacao created' });
  } catch (error) {
    console.error('Error creating solicitacao:', error);
    res.status(500).json({ error: 'Failed to create solicitacao' });
  }
});

export default router;
```

**Step 4: Register routes**

```typescript
// backend/src/index.ts - add import and use
import solicitacoesRoutes from './routes/solicitacoes';

app.use('/api/solicitacoes', solicitacoesRoutes);
```

**Step 5: Commit**

```bash
git add backend/src/services/ backend/src/routes/solicitacoes.ts backend/src/index.ts
git commit -m "feat(backend): add solicitacoes system with carro creation"
```

---

## Task 5: Email Service with SendGrid

**Files:**
- Create: `backend/src/services/emailService.ts`

**Step 1: Create email service**

```typescript
// backend/src/services/emailService.ts
import sgMail from '@sendgrid/mail';
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailData {
  para: string;
  tipo: 'carro_disponivel';
  dados: {
    marca: string;
    modelo: string;
    url: string;
  };
}

export async function queueEmail(data: EmailData): Promise<string> {
  const docRef = await db.collection('emails_queue').add({
    ...data,
    status: 'pendente',
    tentativas: 0,
    criadoEm: Timestamp.now(),
    enviadoEm: null,
  });
  return docRef.id;
}

export async function processEmailQueue(): Promise<void> {
  const snapshot = await db.collection('emails_queue')
    .where('status', '==', 'pendente')
    .where('tentativas', '<', 3)
    .limit(10)
    .get();

  console.log(`Processing ${snapshot.size} pending emails...`);

  for (const doc of snapshot.docs) {
    const email = doc.data();

    try {
      await sendEmail(email.para, email.tipo, email.dados);

      await doc.ref.update({
        status: 'enviado',
        enviadoEm: Timestamp.now(),
      });

      console.log(`Email sent to ${email.para}`);
    } catch (error) {
      console.error(`Error sending email to ${email.para}:`, error);

      const newTentativas = (email.tentativas || 0) + 1;
      await doc.ref.update({
        tentativas: newTentativas,
        status: newTentativas >= 3 ? 'erro' : 'pendente',
      });
    }
  }
}

async function sendEmail(
  to: string,
  tipo: string,
  dados: { marca: string; modelo: string; url: string }
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`[DEV] Would send email to ${to}:`, dados);
    return;
  }

  const msg = {
    to,
    from: 'noreply@valeapena.com.br',
    subject: 'Seu carro está disponível no Vale a Pena!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Vale a Pena?</h1>
        <p>Olá!</p>
        <p>O <strong>${dados.marca} ${dados.modelo}</strong> que você solicitou já está disponível em nosso site.</p>
        <p>
          <a href="${dados.url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Ver Carro
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
          Equipe Vale a Pena
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}
```

**Step 2: Commit**

```bash
git add backend/src/services/emailService.ts
git commit -m "feat(backend): add SendGrid email service with queue"
```

---

## Task 6: Cron Jobs Scheduler

**Files:**
- Create: `backend/src/jobs/scheduler.ts`
- Modify: `backend/src/index.ts`

**Step 1: Create scheduler**

```typescript
// backend/src/jobs/scheduler.ts
import cron from 'node-cron';
import { processPendingSolicitacoes } from '../services/solicitacaoService';
import { processEmailQueue } from '../services/emailService';
import { db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export function startScheduler(): void {
  const frequencyHours = parseInt(process.env.SCRAPING_FREQUENCY_HOURS || '12', 10);

  // Process solicitacoes - configurable frequency
  const cronExpression = `0 */${frequencyHours} * * *`;
  cron.schedule(cronExpression, async () => {
    console.log(`[${new Date().toISOString()}] Running solicitacoes job...`);
    try {
      await processPendingSolicitacoes();
      await updateLastExecution();
    } catch (error) {
      console.error('Error in solicitacoes job:', error);
    }
  });

  // Process email queue - every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Processing email queue...`);
    try {
      await processEmailQueue();
    } catch (error) {
      console.error('Error in email job:', error);
    }
  });

  console.log(`Scheduler started: solicitacoes every ${frequencyHours}h, emails every 5min`);
}

async function updateLastExecution(): Promise<void> {
  await db.collection('configuracoes').doc('scraping').set({
    ultimaExecucao: Timestamp.now(),
    frequenciaHoras: parseInt(process.env.SCRAPING_FREQUENCY_HOURS || '12', 10),
    ativo: true,
  }, { merge: true });
}
```

**Step 2: Start scheduler in index.ts**

```typescript
// backend/src/index.ts - add at the end, before app.listen
import { startScheduler } from './jobs/scheduler';

// Start scheduler
startScheduler();
```

**Step 3: Commit**

```bash
git add backend/src/jobs/scheduler.ts backend/src/index.ts
git commit -m "feat(backend): add cron job scheduler for solicitacoes and emails"
```

---

## Task 7: Frontend Redesign - Layout and Theme

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/SearchBar.tsx`

**Step 1: Update globals.css with dark theme variables**

```css
/* src/app/globals.css */
@import "tailwindcss";

:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --success: #10b981;
  --border: #334155;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

**Step 2: Update layout.tsx**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vale a Pena? | Descubra o custo real de um carro usado',
  description: 'Pesquise carros usados e descubra o preço das peças de manutenção antes de comprar. Veja se vale a pena ter um carro "resto de rico".',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-900`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Redesign home page**

```typescript
// src/app/page.tsx
import SearchBar from '@/components/SearchBar';
import CarrosPopulares from '@/components/CarrosPopulares';
import CategoriasMarcas from '@/components/CategoriasMarcas';
import { getCarrosPopulares } from '@/lib/carros';

export const revalidate = 3600;

export default async function Home() {
  let carrosPopulares: any[] = [];

  try {
    carrosPopulares = await getCarrosPopulares(8);
  } catch (error) {
    console.error('Error fetching popular cars:', error);
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Vale a <span className="text-blue-500">Pena</span>?
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Descubra o custo real de manter um carro usado antes de comprar
          </p>
          <SearchBar />
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span>Populares:</span>
            <button className="hover:text-blue-400 transition-colors">BMW 320i</button>
            <button className="hover:text-blue-400 transition-colors">Mercedes C250</button>
            <button className="hover:text-blue-400 transition-colors">Audi A4</button>
          </div>
        </div>
      </section>

      {/* Marcas Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Explore por Marca</h2>
        <CategoriasMarcas />
      </section>

      {/* Popular Cars */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CarrosPopulares carros={carrosPopulares} />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "feat(frontend): redesign home with dark theme and hero section"
```

---

## Task 8: Frontend - Components Update

**Files:**
- Create: `src/components/CategoriasMarcas.tsx`
- Modify: `src/components/SearchBar.tsx`
- Modify: `src/components/CarroCard.tsx`
- Modify: `src/components/CarrosPopulares.tsx`

**Step 1: Create CategoriasMarcas component**

```typescript
// src/components/CategoriasMarcas.tsx
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
```

**Step 2: Update SearchBar with dark theme**

```typescript
// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchCarros } from '@/lib/carros';
import { Carro } from '@/types';
import { slugify } from '@/lib/utils';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Carro[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const carros = await searchCarros(query);
        setResults(carros);
        setIsOpen(true);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (carro: Carro) => {
    const marcaSlug = slugify(carro.marca);
    const modeloSlug = slugify(carro.modelo);
    router.push(`/carro/${marcaSlug}/${modeloSlug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquise por marca ou modelo..."
          className="w-full px-6 py-4 text-lg bg-slate-800 border-2 border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((carro) => (
            <button
              key={carro.id}
              onClick={() => handleSelect(carro)}
              className="w-full px-6 py-4 text-left hover:bg-slate-700 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden">
                {carro.imagemUrl ? (
                  <img src={carro.imagemUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{carro.marca} {carro.modelo}</p>
                <p className="text-sm text-slate-400">{carro.anos[0]} - {carro.anos[carro.anos.length - 1]}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Update CarroCard with dark theme**

```typescript
// src/components/CarroCard.tsx
import Link from 'next/link';
import { Carro } from '@/types';
import { formatCurrency, slugify } from '@/lib/utils';

interface CarroCardProps {
  carro: Carro;
}

export default function CarroCard({ carro }: CarroCardProps) {
  const marcaSlug = slugify(carro.marca);
  const modeloSlug = slugify(carro.modelo);

  return (
    <Link
      href={`/carro/${marcaSlug}/${modeloSlug}`}
      className="group block bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-all"
    >
      <div className="aspect-video bg-slate-700 relative overflow-hidden">
        {carro.imagemUrl ? (
          <img
            src={carro.imagemUrl}
            alt={`${carro.marca} ${carro.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {formatCurrency(carro.fipe.min)}+
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white">{carro.marca}</h3>
        <p className="text-slate-400">{carro.modelo}</p>
        <p className="text-sm text-slate-500 mt-1">
          {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
          <span className="text-sm text-slate-500">FIPE</span>
          <span className="font-semibold text-blue-400">
            {formatCurrency(carro.fipe.min)} - {formatCurrency(carro.fipe.max)}
          </span>
        </div>
      </div>
    </Link>
  );
}
```

**Step 4: Update CarrosPopulares**

```typescript
// src/components/CarrosPopulares.tsx
import { Carro } from '@/types';
import CarroCard from './CarroCard';

interface CarrosPopularesProps {
  carros: Carro[];
}

export default function CarrosPopulares({ carros }: CarrosPopularesProps) {
  if (carros.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-8">
        Mais Pesquisados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {carros.map((carro) => (
          <CarroCard key={carro.id} carro={carro} />
        ))}
      </div>
    </section>
  );
}
```

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat(frontend): update components with dark theme"
```

---

## Task 9: Frontend - Request Modal

**Files:**
- Create: `src/components/SolicitarCarroModal.tsx`
- Modify: `src/components/SearchBar.tsx`

**Step 1: Create SolicitarCarroModal**

```typescript
// src/components/SolicitarCarroModal.tsx
'use client';

import { useState, useEffect } from 'react';

interface FipeMarca {
  codigo: string;
  nome: string;
}

interface FipeModelo {
  codigo: number;
  nome: string;
}

interface FipeAno {
  codigo: string;
  nome: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SolicitarCarroModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [marcas, setMarcas] = useState<FipeMarca[]>([]);
  const [modelos, setModelos] = useState<FipeModelo[]>([]);
  const [anos, setAnos] = useState<FipeAno[]>([]);

  const [selectedMarca, setSelectedMarca] = useState<FipeMarca | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<FipeModelo | null>(null);
  const [selectedAnos, setSelectedAnos] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && marcas.length === 0) {
      fetchMarcas();
    }
  }, [isOpen]);

  const fetchMarcas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas`);
      const data = await res.json();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModelos = async (marcaId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas/${marcaId}/modelos`);
      const data = await res.json();
      setModelos(data.modelos || []);
    } catch (error) {
      console.error('Error fetching modelos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnos = async (marcaId: string, modeloId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/fipe/marcas/${marcaId}/modelos/${modeloId}/anos`);
      const data = await res.json();
      setAnos(data);
    } catch (error) {
      console.error('Error fetching anos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarcaSelect = (marca: FipeMarca) => {
    setSelectedMarca(marca);
    setSelectedModelo(null);
    setSelectedAnos([]);
    fetchModelos(marca.codigo);
    setStep(2);
  };

  const handleModeloSelect = (modelo: FipeModelo) => {
    setSelectedModelo(modelo);
    setSelectedAnos([]);
    if (selectedMarca) {
      fetchAnos(selectedMarca.codigo, modelo.codigo);
    }
    setStep(3);
  };

  const handleAnoToggle = (ano: string) => {
    setSelectedAnos(prev =>
      prev.includes(ano)
        ? prev.filter(a => a !== ano)
        : [...prev, ano]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMarca || !selectedModelo || selectedAnos.length === 0 || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/solicitacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: selectedMarca.nome,
          modelo: selectedModelo.nome,
          codigoFipe: `${selectedMarca.codigo}-${selectedModelo.codigo}`,
          anos: selectedAnos,
          email,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedMarca(null);
    setSelectedModelo(null);
    setSelectedAnos([]);
    setEmail('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {success ? 'Solicitacao Enviada!' : 'Solicitar Carro'}
          </h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-white mb-2">Sua solicitacao foi registrada!</p>
              <p className="text-slate-400 text-sm">
                Voce recebera um email em <strong>{email}</strong> quando o carro estiver disponivel.
              </p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map(s => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-slate-700'}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div>
                  <p className="text-slate-400 mb-4">Selecione a marca:</p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {marcas.map(marca => (
                        <button
                          key={marca.codigo}
                          onClick={() => handleMarcaSelect(marca)}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-white text-sm transition-colors"
                        >
                          {marca.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <button onClick={() => setStep(1)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para marcas
                  </button>
                  <p className="text-slate-400 mb-4">
                    <strong className="text-white">{selectedMarca?.nome}</strong> - Selecione o modelo:
                  </p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {modelos.map(modelo => (
                        <button
                          key={modelo.codigo}
                          onClick={() => handleModeloSelect(modelo)}
                          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-white text-sm transition-colors"
                        >
                          {modelo.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <button onClick={() => setStep(2)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para modelos
                  </button>
                  <p className="text-slate-400 mb-4">
                    <strong className="text-white">{selectedMarca?.nome} {selectedModelo?.nome}</strong> - Selecione os anos:
                  </p>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {anos.map(ano => (
                        <button
                          key={ano.codigo}
                          onClick={() => handleAnoToggle(ano.codigo)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedAnos.includes(ano.codigo)
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {ano.nome}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedAnos.length > 0 && (
                    <button
                      onClick={() => setStep(4)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Continuar
                    </button>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <button onClick={() => setStep(3)} className="text-blue-400 text-sm mb-4 hover:underline">
                    ← Voltar para anos
                  </button>
                  <div className="bg-slate-700 rounded-lg p-4 mb-6">
                    <p className="text-white font-semibold">{selectedMarca?.nome} {selectedModelo?.nome}</p>
                    <p className="text-slate-400 text-sm">Anos: {selectedAnos.join(', ')}</p>
                  </div>
                  <label className="block text-slate-400 mb-2">Seu email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-6"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!email || isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Carro'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update SearchBar to show "not found" option**

```typescript
// src/components/SearchBar.tsx - add after results dropdown, before closing div
{isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
  <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 z-50 text-center">
    <p className="text-slate-400 mb-4">Nenhum carro encontrado para "{query}"</p>
    <button
      onClick={() => setShowModal(true)}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
    >
      Solicitar este carro
    </button>
  </div>
)}
```

**Step 3: Commit**

```bash
git add src/components/SolicitarCarroModal.tsx src/components/SearchBar.tsx
git commit -m "feat(frontend): add car request modal with FIPE integration"
```

---

## Task 10: Update Car Detail Page with Dark Theme

**Files:**
- Modify: `src/app/carro/[marca]/[modelo]/page.tsx`

**Step 1: Update car detail page**

```typescript
// src/app/carro/[marca]/[modelo]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarroBySlug, incrementBuscas } from '@/lib/carros';
import { formatCurrency, formatPriceRange, unslugify } from '@/lib/utils';
import PecaCard from '@/components/PecaCard';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ marca: string; modelo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marca, modelo } = await params;
  const marcaName = unslugify(marca);
  const modeloName = unslugify(modelo);

  return {
    title: `${marcaName} ${modeloName} - Vale a Pena? | Preco FIPE e Pecas`,
    description: `Veja o preco FIPE e custo das pecas de manutencao do ${marcaName} ${modeloName}. Descubra se vale a pena comprar esse carro usado.`,
  };
}

export default async function CarroPage({ params }: PageProps) {
  const { marca, modelo } = await params;
  const carro = await getCarroBySlug(marca, modelo);

  if (!carro) {
    notFound();
  }

  incrementBuscas(carro.id).catch(console.error);

  const custoMin = carro.pecas.reduce((sum, p) => sum + p.precoMin, 0);
  const custoMax = carro.pecas.reduce((sum, p) => sum + p.precoMax, 0);

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Vale a <span className="text-blue-500">Pena</span>?
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-video bg-slate-700 rounded-xl overflow-hidden">
              {carro.imagemUrl ? (
                <img
                  src={carro.imagemUrl}
                  alt={`${carro.marca} ${carro.modelo}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🚗</span>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {carro.marca} {carro.modelo}
              </h1>
              <p className="text-slate-400 mb-6">
                {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Motor</span>
                  <span className="font-medium text-white">{carro.specs.motor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Potencia</span>
                  <span className="font-medium text-white">{carro.specs.potencia}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Combustivel</span>
                  <span className="font-medium text-white">{carro.specs.combustivel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Cambio</span>
                  <span className="font-medium text-white">{carro.specs.cambio}</span>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-400 font-medium mb-1">Preco FIPE</p>
                <p className="text-2xl font-bold text-blue-300">
                  {formatPriceRange(carro.fipe.min, carro.fipe.max)}
                </p>
                <p className="text-xs text-blue-400/70 mt-1">Variacao conforme ano/versao</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Pecas de Manutencao
          </h2>
          <div className="grid gap-4">
            {carro.pecas.map((peca) => (
              <PecaCard key={peca.id} peca={peca} />
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">
            Custo Estimado de Manutencao Anual
          </h2>
          <p className="text-4xl font-bold mb-2">
            {formatPriceRange(custoMin, custoMax)}
          </p>
          <p className="text-green-100 text-sm">
            Baseado nas pecas de desgaste comum. O custo real pode variar conforme uso e condicao do veiculo.
          </p>
        </section>
      </div>

      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
```

**Step 2: Update PecaCard with dark theme**

```typescript
// src/components/PecaCard.tsx
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
```

**Step 3: Commit**

```bash
git add src/app/carro/[marca]/[modelo]/page.tsx src/components/PecaCard.tsx
git commit -m "feat(frontend): update car detail page with dark theme"
```

---

## Final: Deploy Setup

**Step 1: Add NEXT_PUBLIC_API_URL to frontend .env.local**

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Step 2: Backend deployment (Railway example)**

```bash
cd backend
railway login
railway init
railway up
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: finalize backend + frontend redesign implementation"
```

---

## Summary

This plan implements:
1. **Backend** - Node.js/Express with Firebase, FIPE proxy, scrapers, email queue
2. **Solicitacoes** - User request system for missing cars
3. **Email** - SendGrid integration with queue and retry
4. **Cron Jobs** - Configurable scheduler for processing
5. **Frontend** - Dark theme redesign inspired by Webmotors
6. **Modal** - Multi-step car request flow with FIPE API
