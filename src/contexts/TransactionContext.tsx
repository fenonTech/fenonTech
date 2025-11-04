import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Income, Expense, Bill, Budget } from "../types/transactions";

interface TransactionState {
  incomes: Income[];
  expenses: Expense[];
  receivables: Bill[];
  payables: Bill[];
  budgets: Budget[];
}

type TransactionAction =
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "UPDATE_EXPENSE"; payload: Expense }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "ADD_RECEIVABLE"; payload: Bill }
  | { type: "UPDATE_RECEIVABLE"; payload: Bill }
  | { type: "DELETE_RECEIVABLE"; payload: string }
  | { type: "ADD_PAYABLE"; payload: Bill }
  | { type: "UPDATE_PAYABLE"; payload: Bill }
  | { type: "DELETE_PAYABLE"; payload: string }
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: Budget }
  | { type: "DELETE_BUDGET"; payload: string }
  | { type: "LOAD_DATA"; payload: TransactionState };

interface TransactionContextType extends TransactionState {
  addIncome: (income: Omit<Income, "id" | "createdAt" | "updatedAt">) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  addExpense: (
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addReceivable: (
    receivable: Omit<Bill, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateReceivable: (receivable: Bill) => void;
  deleteReceivable: (id: string) => void;
  addPayable: (payable: Omit<Bill, "id" | "createdAt" | "updatedAt">) => void;
  updatePayable: (payable: Bill) => void;
  deletePayable: (id: string) => void;
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
    case "ADD_EXPENSE":
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
    case "ADD_RECEIVABLE":
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
    case "ADD_PAYABLE":
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
    case "LOAD_DATA":
      return action.payload;
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

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = localStorage.getItem("fenontech-transactions");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        dispatch({ type: "LOAD_DATA", payload: parsedData });
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem("fenontech-transactions", JSON.stringify(state));
  }, [state]);

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

  const updateIncome = (income: Income) => {
    const updatedIncome = {
      ...income,
      updatedAt: new Date(),
      formattedValue: formatCurrency(income.value),
    };
    dispatch({ type: "UPDATE_INCOME", payload: updatedIncome });
  };

  const deleteIncome = (id: string) => {
    dispatch({ type: "DELETE_INCOME", payload: id });
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

  const updateExpense = (expense: Expense) => {
    const updatedExpense = {
      ...expense,
      updatedAt: new Date(),
      formattedValue: formatCurrency(expense.value),
    };
    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
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

  const updateReceivable = (receivable: Bill) => {
    const updatedReceivable = {
      ...receivable,
      updatedAt: new Date(),
      formattedValue: formatCurrency(receivable.value),
    };
    dispatch({ type: "UPDATE_RECEIVABLE", payload: updatedReceivable });
  };

  const deleteReceivable = (id: string) => {
    dispatch({ type: "DELETE_RECEIVABLE", payload: id });
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

  const updatePayable = (payable: Bill) => {
    const updatedPayable = {
      ...payable,
      updatedAt: new Date(),
      formattedValue: formatCurrency(payable.value),
    };
    dispatch({ type: "UPDATE_PAYABLE", payload: updatedPayable });
  };

  const deletePayable = (id: string) => {
    dispatch({ type: "DELETE_PAYABLE", payload: id });
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
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    addReceivable,
    updateReceivable,
    deleteReceivable,
    addPayable,
    updatePayable,
    deletePayable,
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
