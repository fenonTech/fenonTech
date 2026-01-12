# 📡 Serviços de API - Documentação

## 📁 Estrutura Centralizada

Todos os serviços de API estão centralizados na pasta `src/services/` e são compartilhados entre **Mobile** e **Desktop**.

```
src/services/
├── authService.ts           # 🔐 Autenticação e credenciais
├── helpers.ts               # 🔧 Funções auxiliares
├── index.ts                 # 📦 Barrel exports
├── api/
│   ├── transactionService.ts  # 💰 Transações (receitas/despesas)
│   ├── dashboardService.ts    # 📊 Dashboard
│   └── categoryService.ts     # 🏷️ Categorias
```

---

## 🚀 Como Usar

### 1️⃣ Importação Centralizada

```typescript
// ✅ Importar tudo de uma vez
import {
  authService,
  transactionService,
  dashboardService,
  categoryService,
} from "@/services";

// ✅ Ou importar apenas o necessário
import { transactionService } from "@/services";
```

---

## 🔐 AuthService

Gerencia autenticação e credenciais do usuário.

```typescript
import { authService } from "@/services";

// Salvar credenciais
authService.saveUserCredentials({
  telefone: "11999999999",
  codigoTemp: "abc123",
});

// Obter credenciais
const { telefone, codigoTemp } = authService.getUserCredentials();

// Verificar se está autenticado
if (authService.isAuthenticated()) {
  // Usuário logado
}

// Limpar credenciais (logout)
authService.clearUserCredentials();
```

---

## 💰 TransactionService

Gerencia todas as operações de transações (receitas e despesas).

### Criar Transações

```typescript
import { transactionService } from "@/services";

// Criar uma receita
await transactionService.createIncome({
  date: "2025-01-15",
  category: "Salário",
  value: 5000,
});

// Criar uma despesa
await transactionService.createExpense({
  date: "2025-01-15",
  category: "Alimentação",
  value: 150,
});

// Criar transação genérica
await transactionService.createTransaction({
  date: "2025-01-15",
  category: "Freelance",
  value: 1000,
  isIncome: true, // true = receita, false = despesa
});
```

### Buscar Transações

```typescript
// Buscar todas as receitas
const incomes = await transactionService.getIncomes();

// Buscar todas as despesas
const expenses = await transactionService.getExpenses();

// Buscar TODAS as transações (receitas + despesas)
const allTransactions = await transactionService.getAllTransactions();
```

### Atualizar Transações

```typescript
// Atualizar uma receita
await transactionService.updateIncome({
  transactionCode: 123,
  date: "2025-01-16",
  category: "Salário",
  value: 5500,
});

// Atualizar uma despesa
await transactionService.updateExpense({
  transactionCode: 456,
  date: "2025-01-16",
  category: "Transporte",
  value: 200,
});
```

### Deletar Transações

```typescript
// Deletar uma receita
await transactionService.deleteIncome(123);

// Deletar uma despesa
await transactionService.deleteExpense(456);
```

---

## 📊 DashboardService

Gerencia dados do dashboard.

```typescript
import { dashboardService } from "@/services";

// Buscar todos os dados do dashboard
const dashboardData = await dashboardService.getDashboardData();

// Buscar apenas resumo financeiro
const { totalReceitas, totalDespesas, saldo } =
  await dashboardService.getFinancialSummary();
```

---

## 🏷️ CategoryService

Gerencia categorias de transações.

```typescript
import { categoryService } from "@/services";

// Buscar todas as categorias
const categories = await categoryService.getCategories();

// Buscar apenas categorias de receitas
const incomeCategories = await categoryService.getIncomeCategories();

// Buscar apenas categorias de despesas
const expenseCategories = await categoryService.getExpenseCategories();

// Obter categorias padrão (fallback quando API falha)
const defaultCategories = categoryService.getDefaultCategories();

// Criar nova categoria
await categoryService.createCategory({
  name: "Nova Categoria",
  type: "expense",
});

// Deletar categoria
await categoryService.deleteCategory("category-id-123");
```

---

## 🔧 Helpers

Funções auxiliares para formatação e cálculos.

### Formatação de Valores

```typescript
import { formatMoneyDisplay, parseMoneyValue } from "@/services";

// Formatar número para exibição
const formatted = formatMoneyDisplay(1234.56); // "R$ 1.234,56"

// Converter string para número
const value = parseMoneyValue("R$ 1.234,56"); // 1234.56
```

### Formatação de Datas

```typescript
import {
  formatDateForApi,
  formatDateForDisplay,
  formatDateForInput,
  isFutureDate,
} from "@/services";

// Formatar para API (ISO)
const isoDate = formatDateForApi("2025-01-15"); // "2025-01-15T00:00:00"

// Formatar para exibição (DD/MM/YYYY)
const display = formatDateForDisplay("2025-01-15T00:00:00"); // "15/01/2025"

// Formatar para input (YYYY-MM-DD)
const inputDate = formatDateForInput("2025-01-15T00:00:00"); // "2025-01-15"

// Verificar se é data futura
const isFuture = isFutureDate("2025-12-31"); // true/false
```

### Cálculos Financeiros

```typescript
import {
  calculateTotal,
  calculateBalance,
  groupByCategory,
  groupByMonth,
} from "@/services";

// Calcular total
const total = calculateTotal(transactions); // soma de values

// Calcular saldo
const balance = calculateBalance(5000, 3000); // 2000

// Agrupar por categoria
const byCategory = groupByCategory(transactions);
// { "Alimentação": 500, "Transporte": 300 }

// Agrupar por mês
const byMonth = groupByMonth(transactions);
// { "2025-01": 1000, "2025-02": 1500 }
```

### Filtros

```typescript
import {
  filterByPeriod,
  filterByCategory,
  filterFutureTransactions,
  filterPastTransactions,
} from "@/services";

// Filtrar por período
const periodTransactions = filterByPeriod(
  transactions,
  "2025-01-01",
  "2025-01-31"
);

// Filtrar por categoria
const categoryTransactions = filterByCategory(transactions, "Alimentação");

// Apenas transações futuras
const futureTransactions = filterFutureTransactions(transactions);

// Apenas transações passadas
const pastTransactions = filterPastTransactions(transactions);
```

---

## 📦 Tipos TypeScript

Todos os tipos estão exportados e podem ser importados:

```typescript
import type {
  UserCredentials,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFromApi,
  LocalTransaction,
  DashboardData,
  Category,
} from "@/services";
```

---

## ✨ Exemplo Completo em um Componente React

```typescript
import { useEffect, useState } from "react";
import { transactionService, dashboardService } from "@/services";
import type { LocalTransaction } from "@/services";

export const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [summary, setSummary] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Buscar dados em paralelo
      const [allTransactions, financialSummary] = await Promise.all([
        transactionService.getAllTransactions(),
        dashboardService.getFinancialSummary(),
      ]);

      setTransactions(allTransactions);
      setSummary(financialSummary);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncome = async () => {
    try {
      await transactionService.createIncome({
        date: "2025-01-15",
        category: "Salário",
        value: 5000,
      });

      // Recarregar dados
      await loadData();
    } catch (error) {
      console.error("Erro ao criar receita:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Dashboard Financeiro</h1>

      <div className="summary">
        <p>Receitas: R$ {summary.totalReceitas}</p>
        <p>Despesas: R$ {summary.totalDespesas}</p>
        <p>Saldo: R$ {summary.saldo}</p>
      </div>

      <button onClick={handleCreateIncome}>Adicionar Receita</button>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.category} - {transaction.formattedValue}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🎯 Benefícios desta Estrutura

✅ **Centralização**: Todas as APIs em um único lugar  
✅ **Compartilhamento**: Mesmo código para mobile e desktop  
✅ **Tipagem**: TypeScript completo em todos os serviços  
✅ **Organização**: Separação clara por domínio (auth, transactions, etc)  
✅ **Manutenção**: Fácil de encontrar e atualizar código  
✅ **Reutilização**: Helpers compartilhados evitam duplicação  
✅ **Consistência**: Mesmo padrão de código em toda aplicação

---

## 🔄 Migração dos Serviços Antigos

Os serviços antigos (`apiService.ts` e `transactionApiService.ts`) ainda estão disponíveis por compatibilidade, mas devem ser gradualmente substituídos pelos novos serviços:

❌ **Antigo**:

```typescript
import { transactionApiService } from "@/services";
```

✅ **Novo**:

```typescript
import { transactionService } from "@/services";
```

---

## 📝 Observações Importantes

1. **Autenticação**: Todos os serviços usam automaticamente as credenciais do `authService`
2. **Erro Handling**: Todos os métodos lançam erros que devem ser tratados com try/catch
3. **Logging**: Console logs informativos em desenvolvimento (📤 📥 ✅ ❌)
4. **Tipos**: Sempre use os tipos TypeScript exportados para melhor IntelliSense
