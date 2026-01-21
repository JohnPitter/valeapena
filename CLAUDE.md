# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Vale a Pena?" is a Brazilian car research website that helps users evaluate used luxury cars ("resto de rico") by showing FIPE prices and maintenance parts costs with links to marketplaces.

## Commands

```bash
npm run dev          # Start Next.js dev server (default port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run seed         # Populate Firestore with initial car data (requires serviceAccountKey.json)
firebase deploy      # Deploy to Firebase (hosting + functions)
```

For Cloud Functions:
```bash
cd functions && npm run build    # Build functions
cd functions && npm run serve    # Run functions locally with emulator
```

## Architecture

### Frontend (Next.js App Router)
- `src/app/page.tsx` - Home page with search bar and popular cars grid
- `src/app/carro/[marca]/[modelo]/page.tsx` - Car detail page with specs, FIPE price, and parts list
- `src/components/` - React components (SearchBar with autocomplete, CarroCard, PecaCard, AdBanner)

### Data Layer
- `src/lib/firebase.ts` - Firebase client initialization (uses env vars)
- `src/lib/carros.ts` - Firestore queries (getCarrosPopulares, searchCarros, getCarroBySlug)
- `src/lib/fipe.ts` - FIPE API helpers (parallelum.com.br)
- `src/types/index.ts` - TypeScript interfaces (Carro, Peca, CarroSpecs, etc.)

### Backend (Firebase Cloud Functions)
- `functions/src/index.ts` - Scheduled functions for scraping and updating prices
- `functions/src/scrapers/mercadolivre.ts` - MercadoLivre scraper using cheerio
- `atualizarPecas` runs 2x/day (8am, 8pm São Paulo time) to update parts prices
- `incrementarBuscas` - HTTPS callable to increment car search counter

### Firestore Structure
```
carros/{carroId}
  ├── marca, modelo, anos[], specs, imagemUrl, fipe{min,max}, buscas
  └── pecas/{pecaId}
        ├── nome, precoMin, precoMax
        ├── links[{site, url, preco}]
        └── atualizadoEm
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

For seeding, place `serviceAccountKey.json` in project root (download from Firebase Console).

## Key Patterns

- URLs use slugified marca/modelo: `/carro/mercedes-benz/c250`
- SearchBar uses debounced client-side filtering (300ms)
- Home page uses ISR with 1-hour revalidation
- Parts scraping uses 2-second delays between requests to avoid rate limiting

## Development Principles

1. **Arquitetura Limpa** - Separação clara de responsabilidades entre camadas
2. **Performance (Big O)** - Otimizar algoritmos considerando complexidade computacional
3. **Mitigação de CVEs** - Código seguro contra vulnerabilidades conhecidas (OWASP Top 10)
4. **Resiliência e Cache** - Serviços tolerantes a falhas com estratégias de cache
5. **Design Moderno Contextual** - UI/UX adaptado ao contexto e público-alvo
6. **Pirâmide de Testes** - Unit > Integration > E2E para garantir funcionalidades
7. **Segurança de Dados** - Prevenção contra vazamento de informações sensíveis
8. **Logs e Observabilidade** - Logging em todos os fluxos para debugging e monitoramento
9. **Design System** - Componentes consistentes e reutilizáveis
10. **Construção por Fases** - Planejamento e execução em etapas incrementais
11. **Changelog** - Documentar alterações em `CHANGELOG.md`
12. **Build Funcional** - Sempre manter build passando, remover imports não utilizados

## Agent Behavior

1. **Timeout de Comandos** - Cancelar ou transformar em background task se demorar muito
2. **Novas Abordagens** - Se uma solução não funcionar, pesquisar na internet e tentar alternativas
3. **Economia de Tokens** - Foco na implementação, menos resumos desnecessários
4. **Debugging Visual** - Usar MCP Playwright para investigar problemas via screenshots, logs da aplicação e console do navegador
5. **Refinamento Iterativo** - Se o problema persistir, refinar ou refatorar a aplicação
