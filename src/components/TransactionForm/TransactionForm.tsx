import React, { useState } from 'react';
import type { Transaction } from '../../types';
import { useTransactions, useWebhooks } from '../../hooks';
import './TransactionForm.css';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { addTransaction, loading } = useTransactions();
  const { sendToN8N } = useWebhooks();
  
  const [formData, setFormData] = useState({
    type: 'receita' as 'receita' | 'despesa',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'completed',
        tags: [],
      };

      // Adicionar transação (já envia para N8N automaticamente via context)
      await addTransaction(transaction);
      
      // Opcional: enviar evento adicional para N8N
      await sendToN8N('form.transaction.submitted', {
        ...transaction,
        source: 'manual-form'
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="transaction-form-overlay">
      <div className="transaction-form">
        <h2>Nova Transação</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div className="form-group">
            <label>Valor:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria:</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;