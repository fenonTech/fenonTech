# 🌍 Configuração de Ambientes

Esta pasta contém as configurações de ambiente para desenvolvimento e produção.

## 🌐 URL da API - IMPORTANTE

**URL Base Atual:** `https://backend-pearl-rho-82.vercel.app/api`

### ⚠️ Para Mudar a URL da API:

Edite **apenas UM arquivo** e a mudança será aplicada em toda aplicação:

1. **Desenvolvimento**: edite `environment.development.ts`
2. **Produção**: edite `environment.production.ts`

Altere o valor em `api.baseUrl`:

```typescript
api: {
  baseUrl: "https://sua-nova-url.com/api",  // ← Mude aqui
  timeout: 30000,
}
```

## 📁 Estrutura

```
environments/
├── environment.development.ts # Config TypeScript para DEV
├── environment.production.ts  # Config TypeScript para PROD
└── environment.ts             # Seletor automático de ambiente
```

## 🚀 Como Usar

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

- API: `https://backend-pearl-rho-82.vercel.app/api`
- Landing Page: `localhost:5174`
- Dashboard: `localhost:5173`
- Logs habilitados
- Debug habilitado

### Production (PROD)

- API: `https://backend-pearl-rho-82.vercel.app/api`
- Landing Page: `www.fenontech.com.br/landingpage`
- Dashboard: `www.fenontech.com.br/dashboard`
- Logs desabilitados
- Debug desabilitado

## ✅ Vantagens desta Configuração

- ✅ **Centralizado** - Mude a URL da API em um só lugar
- ✅ **Automático** - Seleciona o ambiente certo automaticamente
- ✅ **Type-safe** - TypeScript valida as configurações
- ✅ **Fácil manutenção** - Um arquivo por ambiente
