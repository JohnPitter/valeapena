<div align="center">

# Vale a Pena?

**Descubra o custo real de manter um carro usado antes de comprar**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](https://valeapena.com.br) • [Documentação](#arquitetura) • [Contribuir](#contribuindo)

</div>

---

## Sobre

**Vale a Pena?** é uma plataforma brasileira que ajuda compradores a avaliar carros usados de luxo ("resto de rico") mostrando preços FIPE e custos de peças de manutenção com links diretos para marketplaces.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Firebase     │◀────│    Backend      │
│   (Next.js)     │     │   (Firestore)   │     │   (Node.js)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                              ┌──────────────────────────┼──────────────────────────┐
                              ▼                          ▼                          ▼
                        ┌──────────┐              ┌──────────┐              ┌──────────┐
                        │ FIPE API │              │    ML    │              │   OLX    │
                        └──────────┘              └──────────┘              └──────────┘
```

---

## Funcionalidades

| Feature | Descrição |
|---------|-----------|
| **Busca por Carros** | Pesquisa com autocomplete por marca e modelo |
| **Preços FIPE** | Faixa de preços atualizada via API FIPE |
| **Peças de Manutenção** | Lista de peças comuns com preços de marketplaces |
| **Solicitação de Carros** | Sistema para solicitar carros não catalogados |
| **Notificações por Email** | Alertas quando o carro solicitado estiver disponível |
| **Scraping Automático** | Atualização periódica de preços de peças |

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | Firebase Firestore |
| **Scraping** | Axios, Cheerio |
| **Email** | SendGrid |
| **Deploy** | Firebase Hosting (frontend), Railway/Render (backend) |

---

## Pré-requisitos

| Requisito | Versão |
|-----------|--------|
| Node.js | >= 18 |
| npm | >= 9 |
| Firebase CLI | >= 13 |

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/valeapena.git
cd valeapena
```

### 2. Instale as dependências do Frontend

```bash
npm install
```

### 3. Instale as dependências do Backend

```bash
cd backend
npm install
cd ..
```

### 4. Configure as variáveis de ambiente

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):

```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@valeapena.com.br
SCRAPING_FREQUENCY_HOURS=12
EMAIL_FREQUENCY_MINUTES=5
FRONTEND_URL=http://localhost:3000
```

### 5. Inicie os servidores

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

---

## Estrutura do Projeto

```
valeapena/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   └── carro/[marca]/[modelo]/     # Car detail page
│   ├── components/
│   │   ├── SearchBar.tsx               # Search with autocomplete
│   │   ├── CarroCard.tsx               # Car card component
│   │   ├── PecaCard.tsx                # Part card component
│   │   ├── CarrosPopulares.tsx         # Popular cars section
│   │   ├── CategoriasMarcas.tsx        # Brand categories
│   │   └── SolicitarCarroModal.tsx     # Request car modal
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase client
│   │   ├── carros.ts                   # Car queries
│   │   └── fipe.ts                     # FIPE API helpers
│   └── types/
│       └── index.ts                    # TypeScript interfaces
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Express server
│   │   ├── config/
│   │   │   └── firebase.ts             # Firebase Admin SDK
│   │   ├── routes/
│   │   │   ├── fipe.ts                 # FIPE API proxy
│   │   │   └── solicitacoes.ts         # Request endpoints
│   │   ├── scrapers/
│   │   │   └── mercadolivre.ts         # ML scraper
│   │   ├── services/
│   │   │   ├── carroService.ts         # Car CRUD
│   │   │   ├── pecaService.ts          # Parts CRUD
│   │   │   ├── solicitacaoService.ts   # Request handling
│   │   │   └── emailService.ts         # SendGrid
│   │   ├── jobs/
│   │   │   └── scheduler.ts            # Cron jobs
│   │   └── types/
│   │       └── index.ts                # Backend types
│   └── package.json
├── scripts/
│   └── seed.ts                         # Database seeder
├── docs/
│   └── plans/                          # Implementation plans
└── package.json
```

---

## API Endpoints

### FIPE (Proxy)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/fipe/marcas` | Lista todas as marcas |
| `GET` | `/api/fipe/marcas/:codigo/modelos` | Lista modelos de uma marca |
| `GET` | `/api/fipe/marcas/:marca/modelos/:modelo/anos` | Lista anos disponíveis |
| `GET` | `/api/fipe/marcas/:marca/modelos/:modelo/anos/:ano` | Detalhes de um ano específico |

### Solicitações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/solicitacoes` | Criar solicitação de carro |

**Body:**
```json
{
  "marca": "Porsche",
  "modelo": "Cayenne",
  "codigoFipe": "025001-0",
  "anos": [2015, 2016],
  "email": "usuario@email.com"
}
```

---

## Firestore Collections

### `carros/{carroId}`

```typescript
{
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
  specs: {
    motor: string;
    combustivel: string;
    cambio: string;
    potencia: string;
  };
  imagemUrl: string;
  fipe: { min: number; max: number };
  buscas: number;
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
}
```

### `carros/{carroId}/pecas/{pecaId}`

```typescript
{
  nome: string;
  precoMin: number;
  precoMax: number;
  links: Array<{
    site: 'mercadolivre' | 'olx' | 'icarros';
    url: string;
    preco: number;
  }>;
  atualizadoEm: Timestamp;
}
```

### `solicitacoes/{id}`

```typescript
{
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
```

---

## Scripts

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run seed` | Popula Firestore com dados iniciais |

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run start` | Inicia servidor de produção |

---

## Roadmap

- [x] Frontend base com Next.js
- [x] Integração Firebase Firestore
- [x] Componentes de busca e listagem
- [x] Backend com Express
- [x] Proxy FIPE API
- [x] Scraper Mercado Livre
- [x] Sistema de solicitações
- [x] Notificações por email
- [x] Jobs de scraping agendados
- [x] Redesign dark theme
- [ ] Scraper OLX
- [ ] Scraper iCarros
- [ ] Dashboard administrativo
- [ ] Autenticação de usuários
- [ ] Deploy produção

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com por Vale a Pena?

</div>
