# Design: Backend de Scraping + Redesign Frontend

**Data**: 2026-01-21
**Status**: Aprovado

## Visão Geral

Criar um backend dedicado para scraping de dados de carros e peças, com sistema de solicitações de usuários e notificações por email. Redesenhar o frontend com visual moderno inspirado no Webmotors.

## Arquitetura

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

## Decisões Técnicas

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Hospedagem Backend | Railway/Render/VPS | Controle total, cron jobs nativos |
| Notificações | Email via SendGrid | Confiável, boa deliverability |
| Fontes de Dados | FIPE + ML + OLX + iCarros | Cobertura ampla de preços |
| Seleção de Carros | Dropdowns guiados (FIPE) | Evita erros de parsing |
| Frequência Scraping | Configurável (env/admin) | Flexibilidade operacional |
| Limite de Carros | Sem limite (100 inicial) | Crescimento orgânico |

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

### `configuracoes/scraping`
```typescript
{
  frequenciaHoras: number;
  ultimaExecucao: Timestamp;
  ativo: boolean;
}
```

### `emails_queue/{id}`
```typescript
{
  para: string;
  tipo: 'carro_disponivel';
  dados: {
    marca: string;
    modelo: string;
    url: string;
  };
  status: 'pendente' | 'enviado' | 'erro';
  tentativas: number;
  criadoEm: Timestamp;
  enviadoEm: Timestamp | null;
}
```

## Estrutura do Backend

```
valeapena-backend/
├── src/
│   ├── index.ts                 # Entry point + Express
│   ├── config/
│   │   └── firebase.ts          # Firebase Admin SDK
│   ├── scrapers/
│   │   ├── fipe.ts              # API FIPE (parallelum)
│   │   ├── mercadolivre.ts      # Scraper ML
│   │   ├── olx.ts               # Scraper OLX
│   │   └── icarros.ts           # Scraper iCarros
│   ├── services/
│   │   ├── carroService.ts      # CRUD carros
│   │   ├── pecaService.ts       # CRUD peças
│   │   ├── solicitacaoService.ts# Processar solicitações
│   │   └── emailService.ts      # SendGrid
│   ├── jobs/
│   │   ├── scheduler.ts         # node-cron setup
│   │   ├── processarSolicitacoes.ts
│   │   └── atualizarPrecos.ts
│   └── routes/
│       ├── fipe.ts              # GET /api/fipe/marcas, modelos, anos
│       └── solicitacoes.ts      # POST /api/solicitacoes
├── package.json
├── tsconfig.json
└── .env
```

## API Endpoints

### FIPE (proxy para frontend)
- `GET /api/fipe/marcas` - Lista marcas
- `GET /api/fipe/marcas/:marca/modelos` - Lista modelos
- `GET /api/fipe/marcas/:marca/modelos/:modelo/anos` - Lista anos

### Solicitações
- `POST /api/solicitacoes` - Criar solicitação
  ```json
  {
    "marca": "Porsche",
    "modelo": "Cayenne",
    "codigoFipe": "025001-0",
    "anos": [2015, 2016],
    "email": "usuario@email.com"
  }
  ```

## Jobs de Scraping

### Job 1: Processar Solicitações
- Frequência: Configurável (padrão 12h)
- Busca solicitações com status "pendente"
- Para cada solicitação:
  1. Busca dados na FIPE API
  2. Scrapa peças no ML/OLX/iCarros
  3. Cria documento do carro
  4. Atualiza status para "concluido"
  5. Adiciona email na fila

### Job 2: Atualizar Preços
- Frequência: Configurável (padrão 24h)
- Para cada carro existente:
  1. Atualiza preço FIPE
  2. Scrapa preços de peças
  3. Atualiza documentos

## Sistema de Email

- Serviço: SendGrid
- Template: Carro disponível
- Retry: Máximo 3 tentativas
- Processamento: A cada 5 minutos

```typescript
// Template do email
{
  subject: "Seu carro está disponível no Vale a Pena!",
  body: `
    Olá!

    O ${marca} ${modelo} que você solicitou já está disponível.

    Acesse: ${url}

    Equipe Vale a Pena
  `
}
```

## Redesign Frontend

### Elementos Principais

1. **Hero Section**
   - Search bar centralizado
   - Placeholder dinâmico
   - Fundo com gradiente escuro
   - Sugestões de busca populares

2. **Seção "Mais Buscados"**
   - Grid de cards (imagens 16:9)
   - Hover com zoom sutil
   - Badge com faixa FIPE
   - Contador de buscas

3. **Navegação por Categorias**
   - Cards por marca com logos
   - Quantidade de modelos

4. **Modal de Solicitação**
   - 3 steps: Marca → Modelo → Anos
   - Dropdowns via FIPE API
   - Campo email com validação
   - Feedback de sucesso

5. **Página do Carro**
   - Layout duas colunas
   - Tabela de peças com filtros
   - Links para marketplaces

### Design System
- **Paleta**: Escura com acentos azul/verde
- **Tipografia**: Inter
- **Espaçamento**: Generoso (design respirável)

## Ordem de Implementação

1. Backend - Estrutura base + FIPE API + Firebase
2. Scrapers - ML primeiro, depois OLX/iCarros
3. Sistema de Solicitações - Firestore + Jobs
4. Email - SendGrid integration
5. Frontend - Redesign completo
6. Seed - Popular 100 carros iniciais

## Variáveis de Ambiente

### Backend (.env)
```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
SENDGRID_API_KEY=
SCRAPING_FREQUENCY_HOURS=12
```

### Frontend (.env.local)
```
NEXT_PUBLIC_FIREBASE_*=...
NEXT_PUBLIC_API_URL=https://api.valeapena.com.br
```
