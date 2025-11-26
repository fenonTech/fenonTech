import React, { useState, useEffect } from "react";
import "./ExpenseModal.css";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseData) => void;
  editData?: ExpenseData;
  isEditMode?: boolean;
}

export interface ExpenseData {
  category: string;
  value: string;
  date: string;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    category: "",
    value: "",
    date: "",
  });

  const [errors, setErrors] = useState<Partial<ExpenseData>>({});

  // Atualizar formData quando editData mudar
  useEffect(() => {
    if (editData && isEditMode) {
      setFormData(editData);
    } else {
      setFormData({
        category: "",
        value: "",
        date: "",
      });
    }
    setErrors({});
  }, [editData, isEditMode, isOpen]);

  const categories = [
    "Alimentação",
    "Transporte",
    "Casa",
    "Saúde",
    "Educação",
    "Lazer",
    "Roupas",
    "Serviços",
    "Conta",
    "Outros",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof ExpenseData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseData> = {};

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Valor é obrigatório";
    } else {
      // Validar se o valor é um número válido
      const numericValue = formData.value
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      if (isNaN(Number(numericValue)) || Number(numericValue) <= 0) {
        newErrors.value = "Valor deve ser um número válido maior que zero";
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

    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      category: "",
      value: "",
      date: "",
    });
    setErrors({});
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não for número ou vírgula
    const numericValue = value.replace(/[^\d,]/g, "");

    // Se não tem vírgula, adiciona
    if (!numericValue.includes(",")) {
      const digits = numericValue.replace(/\D/g, "");
      if (digits.length > 2) {
        const reais = digits.slice(0, -2);
        const centavos = digits.slice(-2);
        return `${reais},${centavos}`;
      }
      return digits;
    }

    return numericValue;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatCurrency(value);

    setFormData((prev) => ({
      ...prev,
      value: formattedValue,
    }));

    if (errors.value) {
      setErrors((prev) => ({
        ...prev,
        value: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditMode ? "Editar Despesa" : "Adicionar Despesa"}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="value">Valor (R$)</label>
              <input
                type="text"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleValueChange}
                placeholder="0,00"
                className={`form-input value-input ${
                  errors.value ? "error" : ""
                }`}
                autoFocus
              />
              {errors.value && (
                <span className="error-message">{errors.value}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${errors.category ? "error" : ""}`}
              >
                <option value="">Selecionar categoria</option>
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
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`form-input ${errors.date ? "error" : ""}`}
              />
              {errors.date && (
                <span className="error-message">{errors.date}</span>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {isEditMode ? "Salvar Alterações" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
