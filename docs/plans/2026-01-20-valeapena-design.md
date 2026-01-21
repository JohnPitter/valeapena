# Vale a Pena? - Design do Sistema

## Visão Geral

Site para pesquisa de carros usados ("resto de rico") mostrando especificações, preço FIPE e custo de peças de manutenção com links para compra.

## Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Firebase (Hosting + Firestore + Cloud Functions)
- **APIs:** Tabela FIPE (parallelum.com.br)
- **Scraping:** MercadoLivre, AutoZone, OLX
- **Monetização:** Google AdSense

## Páginas

### Home (`/`)
- Barra de pesquisa com autocomplete
- Grid de carros mais pesquisados
- Banner de anúncio abaixo da busca

### Detalhes (`/carro/[marca]/[modelo]`)
- Imagem do carro + especificações
- Preço FIPE (range por ano)
- Lista de peças com preços e links
- Resumo de custo de manutenção anual
- Banner de anúncio

## Estrutura do Firestore

```
carros/
  └── {carroId}/
        ├── marca: string
        ├── modelo: string
        ├── anos: number[]
        ├── specs: { motor, combustivel, cambio }
        ├── imagemUrl: string
        ├── fipe: { min: number, max: number }
        ├── buscas: number
        └── pecas/
              └── {pecaId}/
                    ├── nome: string
                    ├── precoMin: number
                    ├── precoMax: number
                    ├── links: [{ site, url, preco }]
                    └── atualizadoEm: timestamp
```

## Cloud Functions

1. **atualizarPecas** - Roda 2x/dia, faz scraping e atualiza preços
2. **atualizarFipe** - Roda 1x/semana, busca preços FIPE atualizados
3. **incrementarBuscas** - Incrementa contador de popularidade

## Peças Rastreadas (15 itens)

1. Pastilha de freio dianteira
2. Pastilha de freio traseira
3. Disco de freio dianteiro
4. Disco de freio traseiro
5. Filtro de óleo
6. Filtro de ar
7. Filtro de combustível
8. Filtro de cabine
9. Correia dentada (kit)
10. Velas de ignição
11. Bobina de ignição
12. Amortecedor dianteiro
13. Amortecedor traseiro
14. Bateria
15. Embreagem (kit)

## Estrutura de Pastas

```
valeapena/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── carro/[marca]/[modelo]/page.tsx
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── CarrosPopulares.tsx
│   │   ├── CarroCard.tsx
│   │   ├── PecaCard.tsx
│   │   └── AdBanner.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── fipe.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── functions/
│   ├── src/
│   │   ├── scraper/
│   │   │   ├── mercadolivre.ts
│   │   │   ├── autozone.ts
│   │   │   └── olx.ts
│   │   ├── atualizarPecas.ts
│   │   └── atualizarFipe.ts
│   └── package.json
├── firebase.json
└── package.json
```

## Carros Iniciais

Mercedes: C180, C250, E250
BMW: 320i, 328i, X1
Audi: A3, A4, A5, Q3
VW: Jetta, Passat, Tiguan
Volvo: XC60, S60
Land Rover: Evoque

## MVP

1. Home com busca e carros populares
2. Página de detalhes com FIPE + peças
3. Scraping funcionando para MercadoLivre
4. AdSense configurado

## Considerações

- Scraping pode quebrar se sites mudarem HTML
- Usar delays/proxy para evitar bloqueios
- AdSense requer conteúdo antes de aprovar
