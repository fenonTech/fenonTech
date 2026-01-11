import React, { useState, useEffect } from "react";
import "./TransactionModal.css";
import type { Expense } from "../../types/transactions";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  editingExpense?: Expense | null;
  mode?: "add" | "edit";
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  editingExpense,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    category: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categorias predefinidas para despesas
  const categories = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Roupas",
    "Tecnologia",
    "Serviços",
    "Outros",
  ];

  useEffect(() => {
    if (editingExpense && mode === "edit") {
      // Converter a data para formato ISO
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      // Formatar valor para exibição
      const formatValueForDisplay = (value: number): string => {
        return value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      };

      setFormData({
        category: editingExpense.category,
        value: formatValueForDisplay(editingExpense.value),
        date: formatDateForInput(editingExpense.date),
      });
    } else {
      setFormData({
        category: "",
        value: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [editingExpense, mode, isOpen]);

  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    // Converte para número e divide por 100 para ter centavos
    const numValue = parseFloat(numbers) / 100;

    // Formata como moeda brasileira
    return numValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "value") {
      const formattedValue = formatCurrencyInput(value);
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }

    if (!formData.value) {
      newErrors.value = "Valor é obrigatório";
    } else {
      const numValue = parseFloat(
        formData.value.replace(/\./g, "").replace(",", ".")
      );
      if (isNaN(numValue) || numValue <= 0) {
        newErrors.value = "Valor deve ser um número positivo";
      }
    }

    if (!formData.date) {
      newErrors.date = "Data é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const numValue = parseFloat(
      formData.value.replace(/\./g, "").replace(",", ".")
    );

    const expenseData = {
      description: formData.category, // Usar categoria como descrição
      category: formData.category,
      value: numValue,
      date: formData.date,
      type: "expense" as const,
      formattedValue: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numValue),
    };

    if (mode === "edit" && editingExpense && onUpdate) {
      onUpdate({
        ...editingExpense,
        ...expenseData,
        updatedAt: new Date(),
      });
    } else {
      onSave(expenseData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingExpense && onDelete) {
      if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
        onDelete(editingExpense.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === "edit" ? "Editar Despesa" : "Nova Despesa"}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="category">Categoria *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error-message">{errors.category}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="value">Valor *</label>
              <input
                type="text"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="0,00"
                className={errors.value ? "error" : ""}
              />
              {errors.value && (
                <span className="error-message">{errors.value}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date">Data *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={errors.date ? "error" : ""}
              />
              {errors.date && (
                <span className="error-message">{errors.date}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Excluir
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                {mode === "edit" ? "Salvar Alterações" : "Adicionar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
export type { ExpenseModalProps };
export type ExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;
