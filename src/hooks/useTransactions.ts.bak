import { useState, useEffect } from 'react';
import type { Transaction } from '../types';
import { useFinancial } from '../contexts';

export function useTransactions(filters?: {
  type?: 'receita' | 'despesa';
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { state, loadTransactions, createTransaction, updateTransaction, deleteTransaction } = useFinancial();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    loadTransactions(filters);
  }, [filters]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLocalLoading(true);
    try {
      await createTransaction(transaction);
    } finally {
      setLocalLoading(false);
    }
  };

  const editTransaction = async (id: string, transaction: Partial<Transaction>) => {
    setLocalLoading(true);
    try {
      await updateTransaction(id, transaction);
    } finally {
      setLocalLoading(false);
    }
  };

  const removeTransaction = async (id: string) => {
    setLocalLoading(true);
    try {
      await deleteTransaction(id);
    } finally {
      setLocalLoading(false);
    }
  };

  return {
    transactions: state.transactions,
    loading: state.loading || localLoading,
    error: state.error,
    addTransaction,
    editTransaction,
    removeTransaction,
    refresh: () => loadTransactions(filters),
  };
}