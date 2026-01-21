# Vale a Pena - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a car research site showing used car prices (FIPE) and maintenance parts costs from multiple sources.

**Architecture:** Next.js 14 App Router frontend with Firebase backend (Hosting + Firestore + Cloud Functions). Scraping runs on scheduled Cloud Functions and caches results in Firestore.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Firebase (Firestore, Functions, Hosting), Puppeteer/Cheerio for scraping

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Step 1: Create Next.js project with TypeScript and Tailwind**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted, accept defaults (Yes for all).

**Step 2: Verify installation**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

**Step 3: Stop dev server and commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 2: Configure Firebase

**Files:**
- Create: `src/lib/firebase.ts`
- Create: `.env.local`
- Modify: `package.json` (add firebase dependency)

**Step 1: Install Firebase SDK**

Run: `npm install firebase`

**Step 2: Create Firebase config file**

Create `src/lib/firebase.ts`:
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
```

**Step 3: Create environment template**

Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Step 4: Add .env.local to .gitignore**

Verify `.gitignore` contains `.env.local` (Next.js adds it by default).

**Step 5: Commit**

```bash
git add src/lib/firebase.ts package.json package-lock.json .gitignore
git commit -m "feat: add Firebase configuration"
```

---

## Task 3: Create TypeScript Types

**Files:**
- Create: `src/types/index.ts`

**Step 1: Create types file**

Create `src/types/index.ts`:
```typescript
export interface Carro {
  id: string;
  marca: string;
  modelo: string;
  anos: number[];
  specs: CarroSpecs;
  imagemUrl: string;
  fipe: FipeRange;
  buscas: number;
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
  id: string;
  nome: string;
  precoMin: number;
  precoMax: number;
  links: PecaLink[];
  atualizadoEm: Date;
}

export interface PecaLink {
  site: 'mercadolivre' | 'autozone' | 'olx';
  url: string;
  preco: number;
}

export interface CarroComPecas extends Carro {
  pecas: Peca[];
}
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 4: Create Utility Functions

**Files:**
- Create: `src/lib/utils.ts`

**Step 1: Create utils file**

Create `src/lib/utils.ts`:
```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

**Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add utility functions"
```

---

## Task 5: Create FIPE API Helper

**Files:**
- Create: `src/lib/fipe.ts`

**Step 1: Create FIPE API helper**

Create `src/lib/fipe.ts`:
```typescript
const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

export interface FipeMarca {
  codigo: string;
  nome: string;
}

export interface FipeModelo {
  codigo: number;
  nome: string;
}

export interface FipeAno {
  codigo: string;
  nome: string;
}

export interface FipePreco {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
}

export async function getMarcas(): Promise<FipeMarca[]> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas`);
  return res.json();
}

export async function getModelos(marcaCodigo: string): Promise<{ modelos: FipeModelo[] }> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos`);
  return res.json();
}

export async function getAnos(marcaCodigo: string, modeloCodigo: number): Promise<FipeAno[]> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
  return res.json();
}

export async function getPreco(marcaCodigo: string, modeloCodigo: number, anoCodigo: string): Promise<FipePreco> {
  const res = await fetch(`${FIPE_BASE_URL}/carros/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`);
  return res.json();
}
```

**Step 2: Commit**

```bash
git add src/lib/fipe.ts
git commit -m "feat: add FIPE API helper functions"
```

---

## Task 6: Create Firestore Data Functions

**Files:**
- Create: `src/lib/carros.ts`

**Step 1: Create Firestore data functions**

Create `src/lib/carros.ts`:
```typescript
import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  increment,
  updateDoc
} from 'firebase/firestore';
import { Carro, CarroComPecas, Peca } from '@/types';

export async function getCarrosPopulares(limitCount: number = 8): Promise<Carro[]> {
  const q = query(
    collection(db, 'carros'),
    orderBy('buscas', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Carro));
}

export async function searchCarros(searchTerm: string): Promise<Carro[]> {
  const carrosRef = collection(db, 'carros');
  const snapshot = await getDocs(carrosRef);

  const searchLower = searchTerm.toLowerCase();
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Carro))
    .filter(carro =>
      carro.marca.toLowerCase().includes(searchLower) ||
      carro.modelo.toLowerCase().includes(searchLower) ||
      `${carro.marca} ${carro.modelo}`.toLowerCase().includes(searchLower)
    )
    .slice(0, 10);
}

export async function getCarroBySlug(marca: string, modelo: string): Promise<CarroComPecas | null> {
  const carrosRef = collection(db, 'carros');
  const snapshot = await getDocs(carrosRef);

  const carroDoc = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.marca.toLowerCase().replace(/[^a-z0-9]/g, '-') === marca &&
           data.modelo.toLowerCase().replace(/[^a-z0-9]/g, '-') === modelo;
  });

  if (!carroDoc) return null;

  const carro = { id: carroDoc.id, ...carroDoc.data() } as Carro;

  // Get pecas subcollection
  const pecasSnapshot = await getDocs(collection(db, 'carros', carroDoc.id, 'pecas'));
  const pecas = pecasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Peca));

  return { ...carro, pecas };
}

export async function incrementBuscas(carroId: string): Promise<void> {
  const carroRef = doc(db, 'carros', carroId);
  await updateDoc(carroRef, {
    buscas: increment(1)
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/carros.ts
git commit -m "feat: add Firestore data functions for carros"
```

---

## Task 7: Create SearchBar Component

**Files:**
- Create: `src/components/SearchBar.tsx`

**Step 1: Create SearchBar component**

Create `src/components/SearchBar.tsx`:
```typescript
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
          placeholder="Digite o modelo do carro... ex: Mercedes C250"
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
          {results.map((carro) => (
            <button
              key={carro.id}
              onClick={() => handleSelect(carro)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{carro.marca} {carro.modelo}</p>
                <p className="text-sm text-gray-500">{carro.anos[0]} - {carro.anos[carro.anos.length - 1]}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/SearchBar.tsx
git commit -m "feat: add SearchBar component with autocomplete"
```

---

## Task 8: Create CarroCard Component

**Files:**
- Create: `src/components/CarroCard.tsx`

**Step 1: Create CarroCard component**

Create `src/components/CarroCard.tsx`:
```typescript
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
      className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
    >
      <div className="aspect-video bg-gray-100 relative">
        {carro.imagemUrl ? (
          <img
            src={carro.imagemUrl}
            alt={`${carro.marca} ${carro.modelo}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🚗</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{carro.marca}</h3>
        <p className="text-gray-600">{carro.modelo}</p>
        <p className="text-sm text-gray-400 mt-1">
          {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
        </p>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">FIPE</p>
          <p className="font-semibold text-blue-600">
            {formatCurrency(carro.fipe.min)} - {formatCurrency(carro.fipe.max)}
          </p>
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/CarroCard.tsx
git commit -m "feat: add CarroCard component"
```

---

## Task 9: Create CarrosPopulares Component

**Files:**
- Create: `src/components/CarrosPopulares.tsx`

**Step 1: Create CarrosPopulares component**

Create `src/components/CarrosPopulares.tsx`:
```typescript
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
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
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

**Step 2: Commit**

```bash
git add src/components/CarrosPopulares.tsx
git commit -m "feat: add CarrosPopulares component"
```

---

## Task 10: Create PecaCard Component

**Files:**
- Create: `src/components/PecaCard.tsx`

**Step 1: Create PecaCard component**

Create `src/components/PecaCard.tsx`:
```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/PecaCard.tsx
git commit -m "feat: add PecaCard component"
```

---

## Task 11: Create AdBanner Component

**Files:**
- Create: `src/components/AdBanner.tsx`

**Step 1: Create AdBanner component (placeholder)**

Create `src/components/AdBanner.tsx`:
```typescript
interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = 'default', className = '' }: AdBannerProps) {
  // TODO: Replace with actual AdSense code after approval
  // <ins className="adsbygoogle"
  //   style={{ display: 'block' }}
  //   data-ad-client="ca-pub-XXXXXXX"
  //   data-ad-slot={slot}
  //   data-ad-format="auto"
  //   data-full-width-responsive="true" />

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 ${className}`}>
      <p className="py-4">Espaço para Anúncio</p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/AdBanner.tsx
git commit -m "feat: add AdBanner placeholder component"
```

---

## Task 12: Create Home Page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Step 1: Update globals.css**

Replace `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

**Step 2: Update layout.tsx**

Replace `src/app/layout.tsx` with:
```typescript
import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Update page.tsx (Home)**

Replace `src/app/page.tsx` with:
```typescript
import SearchBar from '@/components/SearchBar';
import CarrosPopulares from '@/components/CarrosPopulares';
import AdBanner from '@/components/AdBanner';
import { getCarrosPopulares } from '@/lib/carros';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  let carrosPopulares = [];

  try {
    carrosPopulares = await getCarrosPopulares(8);
  } catch (error) {
    console.error('Error fetching popular cars:', error);
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vale a Pena?
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Descubra o custo real de manter um carro usado antes de comprar
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner className="h-24" />
      </div>

      {/* Popular Cars */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <CarrosPopulares carros={carrosPopulares} />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
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
git commit -m "feat: implement home page with search and popular cars"
```

---

## Task 13: Create Car Detail Page

**Files:**
- Create: `src/app/carro/[marca]/[modelo]/page.tsx`

**Step 1: Create car detail page**

Create directories and `src/app/carro/[marca]/[modelo]/page.tsx`:
```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarroBySlug, incrementBuscas } from '@/lib/carros';
import { formatCurrency, formatPriceRange, unslugify } from '@/lib/utils';
import PecaCard from '@/components/PecaCard';
import AdBanner from '@/components/AdBanner';
import { Metadata } from 'next';

interface PageProps {
  params: { marca: string; modelo: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const marca = unslugify(params.marca);
  const modelo = unslugify(params.modelo);

  return {
    title: `${marca} ${modelo} - Vale a Pena? | Preço FIPE e Peças`,
    description: `Veja o preço FIPE e custo das peças de manutenção do ${marca} ${modelo}. Descubra se vale a pena comprar esse carro usado.`,
  };
}

export default async function CarroPage({ params }: PageProps) {
  const carro = await getCarroBySlug(params.marca, params.modelo);

  if (!carro) {
    notFound();
  }

  // Increment search count (fire and forget)
  incrementBuscas(carro.id).catch(console.error);

  // Calculate total maintenance cost estimate
  const custoMin = carro.pecas.reduce((sum, p) => sum + p.precoMin, 0);
  const custoMax = carro.pecas.reduce((sum, p) => sum + p.precoMax, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Vale a Pena?
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Car Info Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
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

            {/* Specs */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {carro.marca} {carro.modelo}
              </h1>
              <p className="text-gray-500 mb-6">
                {carro.anos[0]} - {carro.anos[carro.anos.length - 1]}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Motor</span>
                  <span className="font-medium">{carro.specs.motor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Potência</span>
                  <span className="font-medium">{carro.specs.potencia}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Combustível</span>
                  <span className="font-medium">{carro.specs.combustivel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Câmbio</span>
                  <span className="font-medium">{carro.specs.cambio}</span>
                </div>
              </div>

              {/* FIPE Price */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Preço FIPE</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatPriceRange(carro.fipe.min, carro.fipe.max)}
                </p>
                <p className="text-xs text-blue-500 mt-1">Variação conforme ano/versão</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <AdBanner className="h-24 mb-8" />

        {/* Parts Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Peças de Manutenção
          </h2>
          <div className="grid gap-4">
            {carro.pecas.map((peca) => (
              <PecaCard key={peca.id} peca={peca} />
            ))}
          </div>
        </section>

        {/* Cost Summary */}
        <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">
            Custo Estimado de Manutenção Anual
          </h2>
          <p className="text-4xl font-bold mb-2">
            {formatPriceRange(custoMin, custoMax)}
          </p>
          <p className="text-green-100 text-sm">
            Baseado nas peças de desgaste comum. O custo real pode variar conforme uso e condição do veículo.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vale a Pena? - Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/carro/
git commit -m "feat: implement car detail page with specs and parts"
```

---

## Task 14: Initialize Firebase Project

**Files:**
- Create: `firebase.json`
- Create: `.firebaserc`

**Step 1: Install Firebase CLI tools**

Run: `npm install -g firebase-tools`

**Step 2: Login to Firebase**

Run: `firebase login`

**Step 3: Initialize Firebase in project**

Run: `firebase init`

Select:
- Firestore
- Functions (TypeScript)
- Hosting (configure for Next.js)

**Step 4: Update firebase.json for Next.js**

Replace `firebase.json` with:
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "predeploy": ["npm --prefix functions run build"]
  },
  "hosting": {
    "source": ".",
    "frameworksBackend": {
      "region": "us-east1"
    }
  }
}
```

**Step 5: Create Firestore rules**

Create `firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carros/{carroId} {
      allow read: if true;
      allow write: if false;

      match /pecas/{pecaId} {
        allow read: if true;
        allow write: if false;
      }
    }
  }
}
```

**Step 6: Commit**

```bash
git add firebase.json .firebaserc firestore.rules firestore.indexes.json
git commit -m "feat: configure Firebase hosting, firestore and functions"
```

---

## Task 15: Create Seed Script for Initial Data

**Files:**
- Create: `scripts/seed.ts`
- Modify: `package.json`

**Step 1: Install ts-node for scripts**

Run: `npm install -D ts-node @types/node`

**Step 2: Create seed script**

Create `scripts/seed.ts`:
```typescript
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

    // Add pecas subcollection
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
```

**Step 3: Add script to package.json**

Add to `package.json` scripts:
```json
"seed": "ts-node scripts/seed.ts"
```

**Step 4: Add serviceAccountKey.json to .gitignore**

Add `serviceAccountKey.json` to `.gitignore`

**Step 5: Commit**

```bash
git add scripts/seed.ts package.json .gitignore
git commit -m "feat: add database seed script with initial cars and parts"
```

---

## Task 16: Setup Cloud Functions for Scraping

**Files:**
- Modify: `functions/src/index.ts`
- Create: `functions/src/scrapers/mercadolivre.ts`

**Step 1: Install dependencies in functions folder**

```bash
cd functions
npm install cheerio axios
npm install -D @types/cheerio
cd ..
```

**Step 2: Create MercadoLivre scraper**

Create `functions/src/scrapers/mercadolivre.ts`:
```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedPeca {
  nome: string;
  preco: number;
  url: string;
}

export async function scrapeMercadoLivre(
  marca: string,
  modelo: string,
  pecaNome: string
): Promise<ScrapedPeca[]> {
  const query = encodeURIComponent(`${pecaNome} ${marca} ${modelo}`);
  const url = `https://lista.mercadolivre.com.br/${query}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results: ScrapedPeca[] = [];

    $('.ui-search-result__wrapper').slice(0, 5).each((_, element) => {
      const title = $(element).find('.ui-search-item__title').text().trim();
      const priceText = $(element).find('.price-tag-fraction').first().text().replace(/\./g, '');
      const price = parseInt(priceText, 10);
      const link = $(element).find('a.ui-search-link').attr('href') || '';

      if (title && price && link) {
        results.push({
          nome: title,
          preco: price,
          url: link
        });
      }
    });

    return results;
  } catch (error) {
    console.error(`Error scraping MercadoLivre for ${pecaNome}:`, error);
    return [];
  }
}
```

**Step 3: Create main function**

Replace `functions/src/index.ts`:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { scrapeMercadoLivre } from './scrapers/mercadolivre';

admin.initializeApp();
const db = admin.firestore();

export const atualizarPecas = functions.pubsub
  .schedule('0 8,20 * * *') // Run at 8am and 8pm
  .timeZone('America/Sao_Paulo')
  .onRun(async () => {
    console.log('Starting pecas update...');

    const carrosSnapshot = await db.collection('carros').get();

    for (const carroDoc of carrosSnapshot.docs) {
      const carro = carroDoc.data();
      const pecasSnapshot = await carroDoc.ref.collection('pecas').get();

      for (const pecaDoc of pecasSnapshot.docs) {
        const peca = pecaDoc.data();

        // Scrape MercadoLivre
        const mlResults = await scrapeMercadoLivre(
          carro.marca,
          carro.modelo,
          peca.nome
        );

        if (mlResults.length > 0) {
          const precos = mlResults.map(r => r.preco).filter(p => p > 0);
          const precoMin = Math.min(...precos);
          const precoMax = Math.max(...precos);

          await pecaDoc.ref.update({
            precoMin,
            precoMax,
            links: mlResults.slice(0, 3).map(r => ({
              site: 'mercadolivre',
              url: r.url,
              preco: r.preco
            })),
            atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`Updated ${peca.nome} for ${carro.marca} ${carro.modelo}`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('Pecas update complete!');
    return null;
  });

export const incrementarBuscas = functions.https.onCall(async (data) => {
  const { carroId } = data;
  if (!carroId) return { success: false };

  await db.collection('carros').doc(carroId).update({
    buscas: admin.firestore.FieldValue.increment(1)
  });

  return { success: true };
});
```

**Step 4: Commit**

```bash
git add functions/
git commit -m "feat: add Cloud Functions for scraping and updating parts prices"
```

---

## Task 17: Final Setup and Deploy

**Step 1: Update .env.local with real Firebase credentials**

Get credentials from Firebase Console and update `.env.local`

**Step 2: Download service account key**

Firebase Console > Project Settings > Service Accounts > Generate new private key
Save as `serviceAccountKey.json` in project root

**Step 3: Run seed script**

Run: `npm run seed`

**Step 4: Test locally**

Run: `npm run dev`
Navigate to http://localhost:3000

**Step 5: Deploy to Firebase**

Run: `firebase deploy`

**Step 6: Final commit**

```bash
git add .
git commit -m "chore: ready for production deployment"
```

---

## Summary

MVP includes:
- Home page with search autocomplete and popular cars
- Car detail page with FIPE price and parts list
- Firestore database with initial data
- Cloud Function for scheduled scraping (MercadoLivre)
- Ad banner placeholders ready for AdSense
