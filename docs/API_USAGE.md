# 🌐 Configuração e Uso da API

Este documento explica como usar a configuração centralizada da API no projeto.

## 📋 Estrutura de Arquivos

```
src/
├── config/
│   ├── api.config.ts       # URLs e endpoints da API
│   ├── axios.config.ts     # Configuração do Axios
│   └── index.ts           # Exportações centralizadas
└── services/
    └── exampleApiService.ts # Exemplo de serviço
```

## ⚙️ Configuração

### 1. Trocar entre Teste e Produção

Edite o arquivo `src/config/api.config.ts` e **comente/descomente** as linhas:

```typescript
// ✅ Desenvolvimento (Teste) - ATIVA
export const API_BASE_URL =
// //   "https://n8n.srv1056458.hstgr.cloud/webhook-test/meuBolso";

// 🚀 Produção - DESCOMENTE ESTA E COMENTE A DE CIMA
export const API_BASE_URL = "https://n8n.srv1056458.hstgr.cloud/webhook/meuBolso";
```

**Como trocar:**

1. Para usar **TESTE**: Deixe a primeira linha descomentada
2. Para usar **PRODUÇÃO**: Comente a primeira linha e descomente a segunda

**URLs configuradas:**

### 2. Adicionar Novos Endpoints

No arquivo `src/config/api.config.ts`, adicione ao objeto `API_ENDPOINTS`:

```typescript
export const API_ENDPOINTS = {
  // Seus novos endpoints aqui
  users: {
    list: "/users",
    create: "/users",
    update: (id: string) => `/users/${id}`,
  },
};
```

## 🚀 Como Usar a API

### Opção 1: Usar a função `api` diretamente (Simples e Rápido)

```typescript
import { api, API_ENDPOINTS } from "../config";

// GET - Buscar dados
const response = await api.get("/transactions");
const data = response.data;

// POST - Criar novo
const newItem = await api.post("/transactions", {
  type: "income",
  value: 1000,
  date: "2025-11-25",
});

// PUT - Atualizar
const updated = await api.put(`/transactions/${id}`, {
  value: 1500,
});

// DELETE - Deletar
await api.delete(`/transactions/${id}`);
```

### Opção 2: Criar um Serviço (Recomendado para organização)

Crie um arquivo em `src/services/`:

```typescript
// src/services/transactionService.ts
import { api, API_ENDPOINTS } from "../config";

export const transactionService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.transactions.list);
    return response.data.data;
  },

  async create(data: any) {
    const response = await api.post(API_ENDPOINTS.transactions.create, data);
    return response.data.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(API_ENDPOINTS.transactions.update(id), data);
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(API_ENDPOINTS.transactions.delete(id));
  },
};
```

### Opção 3: Usar em Componentes React

```typescript
import React, { useEffect, useState } from "react";
import { api } from "../config";

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/transactions");
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return <div>{/* Seu componente */}</div>;
}
```

## 🔧 Recursos Incluídos

### ✅ Interceptors Configurados

- **Request Interceptor:** Logs automáticos em desenvolvimento
- **Response Interceptor:** Tratamento de erros global (401, 403, 404, 500, etc.)

### ✅ Timeout

- Timeout padrão de 30 segundos para todas as requisições

### ✅ Headers Padrão

- `Content-Type: application/json`
- `Accept: application/json`

### ✅ Logs em Desenvolvimento

- Todas as requisições e respostas são logadas no console quando `ENVIRONMENT = 'development'`

## 📦 Tipos TypeScript

```typescript
import type { ApiResponse, ApiError } from "../config";

// Usar em seus serviços
interface MyData {
  id: string;
  name: string;
}

const response = await api.get<MyData[]>("/endpoint");
// response.data.data é tipado como MyData[]
```

## 🎯 Exemplos Práticos

### Criar uma Receita

```typescript
import { api } from "../config";

const createIncome = async () => {
  try {
    const response = await api.post("/incomes", {
      category: "Salário",
      value: 5000,
      date: "2025-11-25",
      description: "Salário mensal",
    });

    console.log("Receita criada:", response.data);
  } catch (error) {
    console.error("Erro ao criar receita:", error);
  }
};
```

### Buscar Despesas do Mês

```typescript
import { api } from "../config";

const getMonthExpenses = async (year: number, month: number) => {
  try {
    const response = await api.get("/expenses", {
      params: { year, month },
    });

    return response.data.data;
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    throw error;
  }
};
```

### Atualizar uma Transação

```typescript
import { api } from "../config";

const updateTransaction = async (id: string, updates: any) => {
  try {
    const response = await api.put(`/transactions/${id}`, updates);
    console.log("Transação atualizada:", response.data);
  } catch (error) {
    console.error("Erro ao atualizar:", error);
  }
};
```

## 🔒 Autenticação (Quando necessário)

Para adicionar autenticação, edite `src/config/axios.config.ts`:

```typescript
// No interceptor de request
apiClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📝 Notas

- ✅ Sempre use `try/catch` ao fazer requisições
- ✅ Configure `ENVIRONMENT` antes de fazer deploy
- ✅ Verifique os logs do console em desenvolvimento
- ✅ Crie serviços específicos para melhor organização
- ✅ Use TypeScript para tipar suas respostas

## 🆘 Troubleshooting

### Erro CORS

- Verifique se o backend permite requisições do seu domínio

### Timeout

- Ajuste o valor em `src/config/axios.config.ts` (timeout: 30000)

### URL errada

- Verifique se o `ENVIRONMENT` está correto em `api.config.ts`
