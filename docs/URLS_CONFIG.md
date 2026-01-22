# Configuração de URLs

Este arquivo documenta como funciona a configuração centralizada de URLs do projeto.

## Arquivo Principal

O arquivo `src/config/urls.config.ts` contém todas as URLs da aplicação centralizadas.

## Estrutura

```typescript
const LANDING_PAGE_BASE_URL = "https://www.meubolsoia.com.br/landingpage";

export const APP_URLS = {
  LANDING_PAGE_BASE: LANDING_PAGE_BASE_URL,
  LOGIN: `${LANDING_PAGE_BASE_URL}/index.html#/login`,
  PLANOS: `${LANDING_PAGE_BASE_URL}/index.html#/planos`,
  RENOVAR: `${LANDING_PAGE_BASE_URL}/index.html#/renovar`,
  DASHBOARD_BASE: "https://www.meubolsoia.com.br/dashboard",
} as const;
```

## Como Usar

Para usar as URLs configuradas, importe `APP_URLS` da configuração:

```typescript
import { APP_URLS } from "../config";

// Exemplo de uso
window.location.href = APP_URLS.LOGIN;
window.location.href = APP_URLS.PLANOS;
window.location.href = APP_URLS.RENOVAR;
```

## Mudança de Ambiente

Para alternar entre diferentes ambientes (produção/teste), basta modificar a variável `LANDING_PAGE_BASE_URL` no arquivo `urls.config.ts`:

### Produção

```typescript
const LANDING_PAGE_BASE_URL = "https://www.meubolsoia.com.br/landingpage";
```

### Teste (localhost)

```typescript
const LANDING_PAGE_BASE_URL = "http://localhost:5176/landingpage";
```

### Teste (outro domínio)

```typescript
const LANDING_PAGE_BASE_URL = "https://test.fenontech.com.br/landingpage";
```

## Arquivos que Usam as URLs

Os seguintes arquivos foram atualizados para usar a configuração centralizada:

- `src/components/AuthGuard.tsx`
- `src/components/Layout.tsx`
- `src/components/SubscriptionModal/SubscriptionModal.tsx`
- `src/pages/SessionExpired/SessionExpired.tsx`
- `src/pages/SubscriptionError/SubscriptionError.tsx`

## Vantagens

1. **Centralização**: Uma única fonte de verdade para todas as URLs
2. **Facilidade de teste**: Mudança rápida entre ambientes
3. **Manutenibilidade**: Atualização em um só lugar
4. **Type Safety**: TypeScript garante que as URLs estão corretas
5. **Consistency**: Todas as URLs seguem o mesmo padrão
