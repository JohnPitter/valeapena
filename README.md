<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Descubra o custo real de manter um carro usado antes de comprar**

*Plataforma brasileira para avaliar carros usados de luxo com precos FIPE e custos de manutencao*

[Overview](#overview) •
[Funcionalidades](#funcionalidades) •
[Instalacao](#instalacao) •
[Scripts](#scripts) •
[CI/CD](#cicd) •
[Documentacao](#documentacao) •
[Contribuindo](#contribuindo)

</div>

---

## Overview

Vale a Pena? e uma plataforma brasileira que ajuda compradores a avaliar carros usados de luxo ("resto de rico") mostrando precos FIPE e custos de pecas de manutencao com links diretos para marketplaces.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────>│    Firebase     │<────│    Backend      │
│   (Next.js)     │     │   (Firestore)   │     │   (Node.js)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                              ┌──────────────────────────┼──────────────────────────┐
                              v                          v                          v
                        ┌──────────┐              ┌──────────┐              ┌──────────┐
                        │ FIPE API │              │    ML    │              │   OLX    │
                        └──────────┘              └──────────┘              └──────────┘
```

---

## Funcionalidades

| Feature | Descricao |
|---------|-----------|
| **Busca por Carros** | Pesquisa com autocomplete por marca e modelo |
| **Precos FIPE** | Faixa de precos atualizada via API FIPE |
| **Pecas de Manutencao** | Lista de pecas comuns com precos de marketplaces |
| **Solicitacao de Carros** | Sistema para solicitar carros nao catalogados |
| **Notificacoes por Email** | Alertas quando o carro solicitado estiver disponivel |
| **Scraping Automatico** | Atualizacao periodica de precos de pecas |

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

## Instalacao

### Requisitos

| Requisito | Versao |
|-----------|--------|
| Node.js | >= 18 |
| npm | >= 9 |
| Firebase CLI | >= 13 |

### Inicio Rapido

```bash
# Clone o repositorio
git clone https://github.com/JohnPitter/valeapena.git
cd valeapena

# Instale as dependencias do Frontend
npm install

# Instale as dependencias do Backend
cd backend && npm install && cd ..

# Configure as variaveis de ambiente
cp .env.example .env.local
cp backend/.env.example backend/.env

# Inicie o Frontend (Terminal 1)
npm run dev

# Inicie o Backend (Terminal 2)
cd backend && npm run dev
```

Para o guia completo de setup, consulte [docs/SETUP.md](docs/SETUP.md).

---

## Scripts

### Frontend

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Inicia servidor de producao |
| `npm run lint` | Executa ESLint |
| `npm run seed` | Popula Firestore com dados iniciais |

### Backend

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia servidor com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run start` | Inicia servidor de producao |

---

## CI/CD

O projeto utiliza GitHub Actions para integracao e deploy continuos.

### Workflows

| Workflow | Trigger | Descricao |
|----------|---------|-----------|
| **CI** | Push/PR para `main` | Lint e build do frontend e backend |
| **Deploy** | Push para `main` | Deploy frontend (Firebase) e backend (Railway) |
| **Preview** | PR para `main` | Deploy de preview no Firebase |

Para detalhes sobre configuracao de secrets e deploy, consulte [docs/CI_CD.md](docs/CI_CD.md).

---

## Roadmap

- [x] Frontend base com Next.js
- [x] Integracao Firebase Firestore
- [x] Componentes de busca e listagem
- [x] Backend com Express
- [x] Proxy FIPE API
- [x] Scraper Mercado Livre
- [x] Sistema de solicitacoes
- [x] Notificacoes por email
- [x] Jobs de scraping agendados
- [x] Redesign dark theme
- [x] CI/CD com GitHub Actions
- [x] Scraper OLX
- [x] Scraper iCarros
- [x] Dashboard administrativo
- [x] Autenticacao de usuarios
- [ ] Deploy producao

---

## Documentacao

| Documento | Descricao |
|-----------|-----------|
| [docs/SETUP.md](docs/SETUP.md) | Guia completo de setup |
| [docs/CI_CD.md](docs/CI_CD.md) | Documentacao de CI/CD |
| [docs/API.md](docs/API.md) | Documentacao da API Backend |

---

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudancas (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Suporte

- Abra uma [issue](https://github.com/JohnPitter/valeapena/issues) para reportar bugs
- Use [discussions](https://github.com/JohnPitter/valeapena/discussions) para perguntas

---

<div align="center">

**[Voltar ao topo](#vale-a-pena)**

</div>
