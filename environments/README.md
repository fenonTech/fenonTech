# 🌍 Configuração de Ambientes

Esta pasta contém as configurações de ambiente para desenvolvimento e produção.

## 📁 Estrutura

```
environments/
├── .env.development          # Variáveis de ambiente para DEV
├── .env.production           # Variáveis de ambiente para PROD
├── environment.development.ts # Config TypeScript para DEV
├── environment.production.ts  # Config TypeScript para PROD
└── environment.ts             # Seletor automático de ambiente
```

## 🚀 Como Usar

### Variáveis de Ambiente (.env)

O Vite usa automaticamente os arquivos `.env` baseado no comando:

- **Development**: `npm run dev` → usa `.env.development`
- **Production**: `npm run build` → usa `.env.production`

### TypeScript (Recomendado)

Importe o ambiente no seu código:

```typescript
import { environment } from "../environments/environment";

// Usar a URL da API
const apiUrl = environment.api.baseUrl;

// Verificar se está em produção
if (environment.production) {
  // Código específico de produção
}
```

## 🔧 Ambientes Disponíveis

### Development (DEV)

- API: `webhook-test/meuBolso` (ambiente de testes)
- Landing Page: `localhost:5174`
- Dashboard: `localhost:5173`
- Logs habilitados
- Debug habilitado

### Production (PROD)

- API: `webhook/meuBolso` (ambiente real)
- Landing Page: `www.fenontech.com.br/landingpage`
- Dashboard: `www.fenontech.com.br/dashboard`
- Logs desabilitados
- Debug desabilitado

## 📝 Notas

- Nunca commite arquivos `.env` com dados sensíveis
- Use `.env.example` como template
- As configurações TypeScript são type-safe e recomendadas
