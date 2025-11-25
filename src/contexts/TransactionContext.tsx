import React, { createContext, useContext, useReducer } from "react";
import type { Income, Expense, Bill, Budget } from "../types/transactions";
import { transactionApiService } from "../services";

interface TransactionState {
  incomes: Income[];
  expenses: Expense[];
  receivables: Bill[];
  payables: Bill[];
  budgets: Budget[];
}

type TransactionAction =
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "ADD_INCOME_COMPLETE"; payload: Income } // Para transações da API com id
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "CLEAR_INCOMES" }
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "ADD_EXPENSE_COMPLETE"; payload: Expense } // Para transações da API com id
  | { type: "UPDATE_EXPENSE"; payload: Expense }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "CLEAR_EXPENSES" }
  | { type: "ADD_RECEIVABLE"; payload: Bill }
  | { type: "ADD_RECEIVABLE_COMPLETE"; payload: Bill } // Para transações da API com id
  | { type: "UPDATE_RECEIVABLE"; payload: Bill }
  | { type: "DELETE_RECEIVABLE"; payload: string }
  | { type: "CLEAR_RECEIVABLES" }
  | { type: "ADD_PAYABLE"; payload: Bill }
  | { type: "ADD_PAYABLE_COMPLETE"; payload: Bill } // Para transações da API com id
  | { type: "UPDATE_PAYABLE"; payload: Bill }
  | { type: "DELETE_PAYABLE"; payload: string }
  | { type: "CLEAR_PAYABLES" }
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: Budget }
  | { type: "DELETE_BUDGET"; payload: string };

interface TransactionContextType extends TransactionState {
  addIncome: (income: Omit<Income, "id" | "createdAt" | "updatedAt">) => void;
  addIncomeComplete: (income: Income) => void; // Para transações da API com id
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  clearIncomes: () => void;
  addExpense: (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => void;
  addExpenseComplete: (expense: Expense) => void; // Para transações da API com id
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  addReceivable: (
    receivable: Omit<Bill, "id" | "createdAt" | "updatedAt">
  ) => void;
  addReceivableComplete: (receivable: Bill) => void; // Para transações da API com id
  updateReceivable: (receivable: Bill) => void;
  deleteReceivable: (id: string) => void;
  clearReceivables: () => void;
  addPayable: (payable: Omit<Bill, "id" | "createdAt" | "updatedAt">) => void;
  addPayableComplete: (payable: Bill) => void; // Para transações da API com id
  updatePayable: (payable: Bill) => void;
  deletePayable: (id: string) => void;
  clearPayables: () => void;
  addBudget: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

const initialState: TransactionState = {
  incomes: [],
  expenses: [],
  receivables: [],
  payables: [],
  budgets: [],
};

function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case "ADD_INCOME":
      return { ...state, incomes: [...state.incomes, action.payload] };
    case "ADD_INCOME_COMPLETE":
      return { ...state, incomes: [...state.incomes, action.payload] };
    case "UPDATE_INCOME":
      return {
        ...state,
        incomes: state.incomes.map((income) =>
          income.id === action.payload.id ? action.payload : income
        ),
      };
    case "DELETE_INCOME":
      return {
        ...state,
        incomes: state.incomes.filter((income) => income.id !== action.payload),
      };
    case "CLEAR_INCOMES":
      return { ...state, incomes: [] };
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "ADD_EXPENSE_COMPLETE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };
    case "CLEAR_EXPENSES":
      return { ...state, expenses: [] };
    case "ADD_RECEIVABLE":
      return { ...state, receivables: [...state.receivables, action.payload] };
    case "ADD_RECEIVABLE_COMPLETE":
      return { ...state, receivables: [...state.receivables, action.payload] };
    case "UPDATE_RECEIVABLE":
      return {
        ...state,
        receivables: state.receivables.map((receivable) =>
          receivable.id === action.payload.id ? action.payload : receivable
        ),
      };
    case "DELETE_RECEIVABLE":
      return {
        ...state,
        receivables: state.receivables.filter(
          (receivable) => receivable.id !== action.payload
        ),
      };
    case "CLEAR_RECEIVABLES":
      return { ...state, receivables: [] };
    case "ADD_PAYABLE":
      return { ...state, payables: [...state.payables, action.payload] };
    case "ADD_PAYABLE_COMPLETE":
      return { ...state, payables: [...state.payables, action.payload] };
    case "UPDATE_PAYABLE":
      return {
        ...state,
        payables: state.payables.map((payable) =>
          payable.id === action.payload.id ? action.payload : payable
        ),
      };
    case "DELETE_PAYABLE":
      return {
        ...state,
        payables: state.payables.filter(
          (payable) => payable.id !== action.payload
        ),
      };
    case "CLEAR_PAYABLES":
      return { ...state, payables: [] };
    case "ADD_BUDGET":
      return { ...state, budgets: [...state.budgets, action.payload] };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload),
      };
    default:
      return state;
  }
}

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const addIncome = (
    incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">
  ) => {
    const income: Income = {
      ...incomeData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      formattedValue: formatCurrency(incomeData.value),
    };
    dispatch({ type: "ADD_INCOME", payload: income });
  };

  const addIncomeComplete = (income: Income) => {
    dispatch({ type: "ADD_INCOME_COMPLETE", payload: income });
  };

  const updateIncome = (income: Income) => {
    const updatedIncome = {
      ...income,
      updatedAt: new Date(),
      formattedValue: formatCurrency(income.value),
    };
    dispatch({ type: "UPDATE_INCOME", payload: updatedIncome });
  };

  const deleteIncome = async (id: string) => {
    try {
      // Chamar API para deletar no backend
      const transactionCode = parseInt(id, 10);
      await transactionApiService.deleteIncome(transactionCode);

      // Deletar localmente após sucesso na API
      dispatch({ type: "DELETE_INCOME", payload: id });
    } catch (error) {
      console.error("❌ Erro ao deletar receita:", error);
      // Mesmo com erro na API, deletar localmente para não travar a UI
      dispatch({ type: "DELETE_INCOME", payload: id });
    }
  };

  const clearIncomes = () => {
    dispatch({ type: "CLEAR_INCOMES" });
  };

  const addExpense = (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    const expense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      formattedValue: formatCurrency(expenseData.value),
    };
    dispatch({ type: "ADD_EXPENSE", payload: expense });
  };

  const addExpenseComplete = (expense: Expense) => {
    dispatch({ type: "ADD_EXPENSE_COMPLETE", payload: expense });
  };

  const updateExpense = (expense: Expense) => {
    const updatedExpense = {
      ...expense,
      updatedAt: new Date(),
      formattedValue: formatCurrency(expense.value),
    };
    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });
  };

  const deleteExpense = async (id: string) => {
    try {
      // Chamar API para deletar no backend
      const transactionCode = parseInt(id, 10);
      await transactionApiService.deleteExpense(transactionCode);

      // Deletar localmente após sucesso na API
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    } catch (error) {
      console.error("❌ Erro ao deletar despesa:", error);
      // Mesmo com erro na API, deletar localmente para não travar a UI
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    }
  };

  const clearExpenses = () => {
    dispatch({ type: "CLEAR_EXPENSES" });
  };

  const addReceivable = (
    receivableData: Omit<Bill, "id" | "createdAt" | "updatedAt">
  ) => {
    const receivable: Bill = {
      ...receivableData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      formattedValue: formatCurrency(receivableData.value),
    };
    dispatch({ type: "ADD_RECEIVABLE", payload: receivable });
  };

  const addReceivableComplete = (receivable: Bill) => {
    dispatch({ type: "ADD_RECEIVABLE_COMPLETE", payload: receivable });
  };

  const updateReceivable = (receivable: Bill) => {
    const updatedReceivable = {
      ...receivable,
      updatedAt: new Date(),
      formattedValue: formatCurrency(receivable.value),
    };
    dispatch({ type: "UPDATE_RECEIVABLE", payload: updatedReceivable });
  };

  const deleteReceivable = async (id: string) => {
    try {
      // Chamar API para deletar no backend (receivable é uma receita futura)
      const transactionCode = parseInt(id, 10);
      await transactionApiService.deleteIncome(transactionCode);
      console.log("✅ Conta a receber deletada na API com sucesso!");

      // Deletar localmente após sucesso na API
      dispatch({ type: "DELETE_RECEIVABLE", payload: id });
    } catch (error) {
      console.error("❌ Erro ao deletar conta a receber:", error);
      // Mesmo com erro na API, deletar localmente para não travar a UI
      dispatch({ type: "DELETE_RECEIVABLE", payload: id });
    }
  };

  const clearReceivables = () => {
    dispatch({ type: "CLEAR_RECEIVABLES" });
  };

  const addPayable = (
    payableData: Omit<Bill, "id" | "createdAt" | "updatedAt">
  ) => {
    const payable: Bill = {
      ...payableData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      formattedValue: formatCurrency(payableData.value),
    };
    dispatch({ type: "ADD_PAYABLE", payload: payable });
  };

  const addPayableComplete = (payable: Bill) => {
    dispatch({ type: "ADD_PAYABLE_COMPLETE", payload: payable });
  };

  const updatePayable = (payable: Bill) => {
    const updatedPayable = {
      ...payable,
      updatedAt: new Date(),
      formattedValue: formatCurrency(payable.value),
    };
    dispatch({ type: "UPDATE_PAYABLE", payload: updatedPayable });
  };

  const deletePayable = async (id: string) => {
    try {
      // Chamar API para deletar no backend (payable é uma despesa futura)
      const transactionCode = parseInt(id, 10);
      await transactionApiService.deleteExpense(transactionCode);
      console.log("✅ Conta a pagar deletada na API com sucesso!");

      // Deletar localmente após sucesso na API
      dispatch({ type: "DELETE_PAYABLE", payload: id });
    } catch (error) {
      console.error("❌ Erro ao deletar conta a pagar:", error);
      // Mesmo com erro na API, deletar localmente para não travar a UI
      dispatch({ type: "DELETE_PAYABLE", payload: id });
    }
  };

  const clearPayables = () => {
    dispatch({ type: "CLEAR_PAYABLES" });
  };

  const addBudget = (
    budgetData: Omit<Budget, "id" | "createdAt" | "updatedAt">
  ) => {
    const budget: Budget = {
      ...budgetData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      formattedValue: formatCurrency(budgetData.plannedAmount),
    };
    dispatch({ type: "ADD_BUDGET", payload: budget });
  };

  const updateBudget = (budget: Budget) => {
    const updatedBudget = {
      ...budget,
      updatedAt: new Date(),
      formattedValue: formatCurrency(budget.plannedAmount),
    };
    dispatch({ type: "UPDATE_BUDGET", payload: updatedBudget });
  };

  const deleteBudget = (id: string) => {
    dispatch({ type: "DELETE_BUDGET", payload: id });
  };

  const value: TransactionContextType = {
    ...state,
    addIncome,
    addIncomeComplete,
    updateIncome,
    deleteIncome,
    clearIncomes,
    addExpense,
    addExpenseComplete,
    updateExpense,
    deleteExpense,
    clearExpenses,
    addReceivable,
    addReceivableComplete,
    updateReceivable,
    deleteReceivable,
    clearReceivables,
    addPayable,
    addPayableComplete,
    updatePayable,
    deletePayable,
    clearPayables,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
