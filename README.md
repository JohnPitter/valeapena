<div align="center">

# Vale a Pena?

**Descubra o custo real de manter um carro usado antes de comprar**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/JohnPitter/valeapena/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnPitter/valeapena/actions/workflows/ci.yml)
[![Deploy](https://github.com/JohnPitter/valeapena/actions/workflows/deploy.yml/badge.svg)](https://github.com/JohnPitter/valeapena/actions/workflows/deploy.yml)

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

Copie os arquivos de exemplo e configure suas credenciais:

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
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

## CI/CD

O projeto utiliza GitHub Actions para integração e deploy contínuos.

### Workflows

| Workflow | Trigger | Descrição |
|----------|---------|-----------|
| **CI** | Push/PR para `main` | Lint e build do frontend e backend |
| **Deploy** | Push para `main` | Deploy frontend (Firebase) e backend (Railway) |
| **Preview** | PR para `main` | Deploy de preview no Firebase |

### GitHub Secrets Necessários

Configure os seguintes secrets no repositório (`Settings > Secrets > Actions`):

| Secret | Descrição |
|--------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key do Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain do Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID do Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket do Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase |
| `NEXT_PUBLIC_API_URL` | URL do backend em produção |
| `FIREBASE_SERVICE_ACCOUNT` | JSON da service account (para deploy) |
| `RAILWAY_TOKEN` | Token de deploy do Railway |

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
- [x] CI/CD com GitHub Actions
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
