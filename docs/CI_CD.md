# CI/CD

[Voltar ao README](../README.md)

---

## Visao Geral

O projeto utiliza GitHub Actions para integracao e deploy continuos com 3 workflows.

---

## Workflows

### CI (Integracao Continua)

| Propriedade | Valor |
|-------------|-------|
| **Trigger** | Push e Pull Request para `main` |
| **Jobs** | Lint e build do frontend e backend |

Etapas executadas:
1. Checkout do codigo
2. Setup Node.js
3. Instalacao de dependencias
4. Lint (ESLint)
5. Build de producao

### Deploy

| Propriedade | Valor |
|-------------|-------|
| **Trigger** | Push para `main` |
| **Frontend** | Deploy no Firebase Hosting |
| **Backend** | Deploy no Railway |

### Preview

| Propriedade | Valor |
|-------------|-------|
| **Trigger** | Pull Request para `main` |
| **Descricao** | Deploy de preview no Firebase para revisao |

---

## GitHub Secrets

Configure os seguintes secrets no repositorio em **Settings > Secrets > Actions**:

### Firebase

| Secret | Descricao |
|--------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key do Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain do Firebase |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID do Firebase |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket do Firebase |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase |
| `FIREBASE_SERVICE_ACCOUNT` | JSON da service account (para deploy) |

### Backend

| Secret | Descricao |
|--------|-----------|
| `NEXT_PUBLIC_API_URL` | URL do backend em producao |
| `RAILWAY_TOKEN` | Token de deploy do Railway |

---

## Configuracao Inicial

### Firebase Hosting

1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Faca login: `firebase login`
3. O projeto ja esta configurado em `firebase.json`

### Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Conecte o repositorio GitHub
3. Configure as variaveis de ambiente do backend
4. Gere um token de deploy e adicione como secret `RAILWAY_TOKEN`

---

## Deploy Manual

### Frontend

```bash
npm run build
firebase deploy --only hosting
```

### Backend

```bash
cd backend
npm run build
# Deploy via Railway CLI ou push para main
```
