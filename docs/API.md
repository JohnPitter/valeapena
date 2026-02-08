# Backend API

[Voltar ao README](../README.md)

---

## Visao Geral

O backend e construido com Node.js, Express e TypeScript. Fornece endpoints para consulta de carros, precos FIPE, pecas de manutencao e scraping de marketplaces.

---

## Base URL

| Ambiente | URL |
|----------|-----|
| Desenvolvimento | `http://localhost:3001` |
| Producao | Configurado via `NEXT_PUBLIC_API_URL` |

---

## Endpoints

### Carros

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/carros` | Lista carros populares |
| GET | `/api/carros/search?q={query}` | Busca carros por marca/modelo |
| GET | `/api/carros/:marca/:modelo` | Detalhes de um carro especifico |

### FIPE

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/fipe/:marca/:modelo` | Preco FIPE do carro |

### Pecas

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/pecas/:carroId` | Lista pecas de manutencao com precos |

### Solicitacoes

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/solicitacoes` | Solicitar catalogacao de um novo carro |
| GET | `/api/solicitacoes` | Listar solicitacoes (admin) |

### Scraping

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/scraping/atualizar` | Disparar atualizacao de precos manualmente (admin) |

---

## Estrutura do Firestore

```
carros/{carroId}
  ├── marca           # String - Marca do carro
  ├── modelo          # String - Modelo do carro
  ├── anos[]          # Array - Anos de fabricacao
  ├── specs           # Map - Especificacoes tecnicas
  ├── imagemUrl       # String - URL da imagem
  ├── fipe            # Map - {min, max} precos FIPE
  ├── buscas          # Number - Contador de buscas
  └── pecas/{pecaId}
        ├── nome              # String - Nome da peca
        ├── precoMin          # Number - Preco minimo encontrado
        ├── precoMax          # Number - Preco maximo encontrado
        ├── links[]           # Array - {site, url, preco}
        └── atualizadoEm     # Timestamp - Ultima atualizacao
```

---

## Scraping

O backend executa scraping automatico de precos de pecas em 3 marketplaces:

| Marketplace | Modulo |
|-------------|--------|
| Mercado Livre | `scrapers/mercadolivre.ts` |
| OLX | `scrapers/olx.ts` |
| iCarros | `scrapers/icarros.ts` |

### Job Agendado

O job `atualizarPecas` executa 2x por dia (8h e 20h, horario de Sao Paulo) para atualizar precos de pecas.

**Rate Limiting:** Delay de 2 segundos entre requisicoes para evitar bloqueio.

---

## Autenticacao

Endpoints administrativos requerem autenticacao via Firebase Auth. O token JWT deve ser enviado no header:

```
Authorization: Bearer {firebase-id-token}
```

---

## Erros

Respostas de erro seguem o formato:

```json
{
  "error": "Descricao do erro",
  "code": "ERROR_CODE"
}
```

| Codigo HTTP | Descricao |
|-------------|-----------|
| 400 | Requisicao invalida |
| 401 | Nao autenticado |
| 403 | Sem permissao |
| 404 | Recurso nao encontrado |
| 500 | Erro interno do servidor |
