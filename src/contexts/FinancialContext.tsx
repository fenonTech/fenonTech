import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, FinancialSummary, Category, Bank } from '../types';
import { apiService } from '../services';

interface FinancialState {
  transactions: Transaction[];
  summary: FinancialSummary | null;
  categories: Category[];
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

type FinancialAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_SUMMARY'; payload: FinancialSummary }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_BANKS'; payload: Bank[] }
  | { type: 'UPDATE_BANK'; payload: Bank };

const initialState: FinancialState = {
  transactions: [],
  summary: null,
  categories: [],
  banks: [],
  loading: false,
  error: null,
};

function financialReducer(state: FinancialState, action: FinancialAction): FinancialState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [...state.transactions, action.payload],
        loading: false 
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
        loading: false
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        loading: false
      };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload, loading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false };
    case 'SET_BANKS':
      return { ...state, banks: action.payload, loading: false };
    case 'UPDATE_BANK':
      return {
        ...state,
        banks: state.banks.map(b => 
          b.id === action.payload.id ? action.payload : b
        ),
        loading: false
      };
    default:
      return state;
  }
}

interface FinancialContextType {
  state: FinancialState;
  // Transações
  loadTransactions: (filters?: any) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  // Resumo
  loadSummary: (period?: string) => Promise<void>;
  // Categorias
  loadCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  // Bancos
  loadBanks: () => Promise<void>;
  syncBank: (bankId: string) => Promise<void>;
  // Webhooks
  handleWebhookData: (event: string, data: any) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  // Transações
  const loadTransactions = async (filters?: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getTransactions(filters);
      if (response.success && response.data) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao carregar transações' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar transações' });
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.createTransaction(transaction);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
        
        // Enviar para N8N
        await apiService.sendToN8N({
          event: 'transaction.created',
          data: response.data,
          timestamp: new Date().toISOString(),
          source: 'meu-bolso-app'
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao criar transação' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar transação' });
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.updateTransaction(id, transaction);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_TRANSACTION', payload: response.data });
        
        // Enviar para N8N
        await apiService.sendToN8N({
          event: 'transaction.updated',
          data: response.data,
          timestamp: new Date().toISOString(),
          source: 'meu-bolso-app'
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao atualizar transação' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar transação' });
    }
  };

  const deleteTransaction = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.deleteTransaction(id);
      if (response.success) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        
        // Enviar para N8N
        await apiService.sendToN8N({
          event: 'transaction.deleted',
          data: { id },
          timestamp: new Date().toISOString(),
          source: 'meu-bolso-app'
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao deletar transação' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar transação' });
    }
  };

  // Resumo
  const loadSummary = async (period?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getFinancialSummary(period);
      if (response.success && response.data) {
        dispatch({ type: 'SET_SUMMARY', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao carregar resumo' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar resumo' });
    }
  };

  // Categorias
  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const createCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const response = await apiService.createCategory(category);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CATEGORIES', payload: [...state.categories, response.data] });
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  // Bancos
  const loadBanks = async () => {
    try {
      const response = await apiService.getBanks();
      if (response.success && response.data) {
        dispatch({ type: 'SET_BANKS', payload: response.data });
      }
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  };

  const syncBank = async (bankId: string) => {
    try {
      const response = await apiService.syncBank(bankId);
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_BANK', payload: response.data });
      }
    } catch (error) {
      console.error('Erro ao sincronizar banco:', error);
    }
  };

  // Handler para webhooks recebidos
  const handleWebhookData = (event: string, data: any) => {
    switch (event) {
      case 'transaction.created':
        dispatch({ type: 'ADD_TRANSACTION', payload: data });
        break;
      case 'transaction.updated':
        dispatch({ type: 'UPDATE_TRANSACTION', payload: data });
        break;
      case 'transaction.deleted':
        dispatch({ type: 'DELETE_TRANSACTION', payload: data.id });
        break;
      case 'summary.updated':
        dispatch({ type: 'SET_SUMMARY', payload: data });
        break;
      default:
        console.warn('Evento de webhook não reconhecido:', event);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadTransactions();
    loadSummary();
    loadCategories();
    loadBanks();
  }, []);

  const contextValue: FinancialContextType = {
    state,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadSummary,
    loadCategories,
    createCategory,
    loadBanks,
    syncBank,
    handleWebhookData,
  };

  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial deve ser usado dentro de um FinancialProvider');
  }
  return context;
}