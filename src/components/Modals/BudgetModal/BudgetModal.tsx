import React, { useState, useEffect } from "react";
import "../TransactionModal.css";
import type { Budget } from "../../../types/transactions";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Omit<Budget, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
  editingBudget?: Budget | null;
  mode?: "add" | "edit";
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  editingBudget,
  mode = "add",
}) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    category: "",
    plannedAmount: "",
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    type: "expense" as "expense" | "income",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categorias predefinidas
  const expenseCategories = [
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

  const incomeCategories = [
    "Salário",
    "Freelance",
    "Vendas",
    "Investimentos",
    "Aluguel Recebido",
    "Prêmios",
    "Outros",
  ];

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  useEffect(() => {
    if (editingBudget && mode === "edit") {
      setFormData({
        category: editingBudget.category,
        plannedAmount: editingBudget.formattedValue
          ? editingBudget.formattedValue
              .replace(/[R$\s]/g, "")
              .replace(",", ".")
          : editingBudget.plannedAmount.toString(),
        month: editingBudget.month,
        year: editingBudget.year,
        type: editingBudget.type,
      });
    } else {
      setFormData({
        category: "",
        plannedAmount: "",
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        type: "expense",
      });
    }
    setErrors({});
  }, [editingBudget, mode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }

    if (!formData.plannedAmount) {
      newErrors.plannedAmount = "Valor planejado é obrigatório";
    } else {
      const numValue = parseFloat(formData.plannedAmount.replace(",", "."));
      if (isNaN(numValue) || numValue <= 0) {
        newErrors.plannedAmount = "Valor deve ser um número positivo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const numValue = parseFloat(formData.plannedAmount.replace(",", "."));

    const budgetData = {
      category: formData.category,
      plannedAmount: numValue,
      month: parseInt(formData.month.toString()),
      year: parseInt(formData.year.toString()),
      type: formData.type,
      formattedValue: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numValue),
    };

    if (mode === "edit" && editingBudget && onUpdate) {
      onUpdate({
        ...editingBudget,
        ...budgetData,
        updatedAt: new Date(),
      });
    } else {
      onSave(budgetData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (editingBudget && onDelete) {
      if (window.confirm("Tem certeza que deseja excluir este planejamento?")) {
        onDelete(editingBudget.id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const categories =
    formData.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {mode === "edit" ? "Editar Planejamento" : "Novo Planejamento"}
          </h2>
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
            <label htmlFor="type">Tipo *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>

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

          <div className="form-group">
            <label htmlFor="plannedAmount">Valor Planejado *</label>
            <input
              type="text"
              id="plannedAmount"
              name="plannedAmount"
              value={formData.plannedAmount}
              onChange={handleInputChange}
              placeholder="0,00"
              className={errors.plannedAmount ? "error" : ""}
            />
            {errors.plannedAmount && (
              <span className="error-message">{errors.plannedAmount}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="month">Mês *</label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Ano *</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
                {mode === "edit"
                  ? "Salvar Alterações"
                  : "Adicionar Planejamento"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
export type { BudgetModalProps };
export type BudgetData = Omit<Budget, "id" | "createdAt" | "updatedAt">;
