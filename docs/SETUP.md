# Guia de Setup

[Voltar ao README](../README.md)

---

## Requisitos

| Requisito | Versao |
|-----------|--------|
| Node.js | >= 18 |
| npm | >= 9 |
| Firebase CLI | >= 13 |

---

## Passo 1: Clone o repositorio

```bash
git clone https://github.com/JohnPitter/valeapena.git
cd valeapena
```

---

## Passo 2: Instale as dependencias

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend
npm install
cd ..
```

---

## Passo 3: Configure as variaveis de ambiente

Copie os arquivos de exemplo e configure suas credenciais:

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

### Variaveis do Frontend (.env.local)

| Variavel | Descricao |
|----------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key do Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain do Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID do Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket do Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase |
| `NEXT_PUBLIC_API_URL` | URL do backend (ex: http://localhost:3001) |

### Variaveis do Backend (backend/.env)

Configure as credenciais do Firebase Admin SDK e demais servicos conforme o arquivo `.env.example` do backend.

---

## Passo 4: Firebase Service Account

Para o script de seed e funcoes administrativas, voce precisa da service account key:

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Va em **Project Settings > Service Accounts**
3. Clique em **Generate New Private Key**
4. Salve o arquivo como `serviceAccountKey.json` na raiz do projeto

**Importante:** Este arquivo nao deve ser commitado (ja esta no `.gitignore`).

---

## Passo 5: Inicie os servidores

**Terminal 1 - Frontend:**

```bash
npm run dev
```

O frontend estara disponivel em `http://localhost:3000`.

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
```

O backend estara disponivel em `http://localhost:3001`.

---

## Passo 6: Popular dados iniciais (opcional)

```bash
npm run seed
```

Este comando popula o Firestore com dados iniciais de carros para desenvolvimento.

---

## Verificacao

Apos iniciar ambos os servidores:

1. Acesse `http://localhost:3000`
2. A pagina inicial deve carregar com a barra de busca
3. Se o seed foi executado, carros populares devem aparecer na grid
