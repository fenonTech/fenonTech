import React, { useState } from "react";
import { useTransaction } from "../../contexts/TransactionContext";
import type { Budget } from "../../types/transactions";
import { CategoryManager } from "../CategoryManager";
import "./GeralTab.css";

const MONTHS = [
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

const EXPENSE_CATEGORIES = [
  { name: "Alimentação", icon: "🍔" },
  { name: "Transporte", icon: "🚗" },
  { name: "Moradia", icon: "🏠" },
  { name: "Saúde", icon: "💊" },
  { name: "Educação", icon: "📚" },
  { name: "Lazer", icon: "🎮" },
  { name: "Vestuário", icon: "👔" },
  { name: "Tecnologia", icon: "💻" },
  { name: "Serviços", icon: "🔧" },
  { name: "Outros", icon: "📦" },
];

const INCOME_CATEGORIES = [
  { name: "Salário", icon: "💰" },
  { name: "Freelance", icon: "💼" },
  { name: "Investimentos", icon: "📈" },
  { name: "Vendas", icon: "🛒" },
  { name: "Prêmios", icon: "🏆" },
  { name: "Outros", icon: "💵" },
];

interface CategoryAccordionProps {
  category: string;
  icon: string;
  type: "expense" | "income";
  year: number;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  icon,
  type,
  year,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [bulkValue, setBulkValue] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragAction, setDragAction] = useState<"select" | "deselect">("select");
  const { budgets, addBudget, updateBudget } = useTransaction();

  const handleValueChange = (month: number, value: string) => {
    // Remove formatação e converte para número
    const numericValue = value.replace(/\D/g, "");
    const amount = parseFloat(numericValue) / 100;

    if (isNaN(amount) || amount === 0) {
      // Se valor for 0 ou inválido, remove o budget se existir
      const existingBudget = budgets.find(
        (b: Budget) =>
          b.category === category &&
          b.month === month &&
          b.year === year &&
          b.type === type
      );
      if (existingBudget) {
        // TODO: Adicionar deleteBudget quando necessário
      }
      return;
    }

    // Verifica se já existe budget para essa categoria/mês/ano
    const existingBudget = budgets.find(
      (b: Budget) =>
        b.category === category &&
        b.month === month &&
        b.year === year &&
        b.type === type
    );

    if (existingBudget) {
      updateBudget({
        ...existingBudget,
        plannedAmount: amount,
      });
    } else {
      addBudget({
        category,
        plannedAmount: amount,
        month,
        year,
        type,
        formattedValue: "", // Será gerado automaticamente no context
      });
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getBudgetValue = (month: number): string => {
    const budget = budgets.find(
      (b: Budget) =>
        b.category === category &&
        b.month === month &&
        b.year === year &&
        b.type === type
    );
    return budget ? formatCurrency(budget.plannedAmount) : "";
  };

  const getTotalPlanned = (): number => {
    return budgets
      .filter(
        (b: Budget) =>
          b.category === category && b.year === year && b.type === type
      )
      .reduce((sum: number, b: Budget) => sum + b.plannedAmount, 0);
  };

  const toggleMonth = (monthIndex: number) => {
    setSelectedMonths((prev) =>
      prev.includes(monthIndex)
        ? prev.filter((m) => m !== monthIndex)
        : [...prev, monthIndex]
    );
  };

  const handleMonthMouseDown = (monthIndex: number) => {
    const isSelected = selectedMonths.includes(monthIndex);
    setDragAction(isSelected ? "deselect" : "select");
    setIsDragging(true);
    toggleMonth(monthIndex);
  };

  const handleMonthMouseEnter = (monthIndex: number) => {
    if (!isDragging) return;

    const isSelected = selectedMonths.includes(monthIndex);
    if (dragAction === "select" && !isSelected) {
      setSelectedMonths((prev) => [...prev, monthIndex]);
    } else if (dragAction === "deselect" && isSelected) {
      setSelectedMonths((prev) => prev.filter((m) => m !== monthIndex));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenModal = () => {
    setSelectedMonths([]);
    setBulkValue("");
    setIsModalOpen(true);
  };

  const handleSelectAll = () => {
    setSelectedMonths(MONTHS.map((_, index) => index));
  };

  const handleDeselectAll = () => {
    setSelectedMonths([]);
  };

  const handleBulkFill = () => {
    const numericValue = bulkValue.replace(/\D/g, "");
    const amount = parseFloat(numericValue) / 100;

    if (isNaN(amount) || amount === 0) return;

    selectedMonths.forEach((monthIndex) => {
      const existingBudget = budgets.find(
        (b: Budget) =>
          b.category === category &&
          b.month === monthIndex &&
          b.year === year &&
          b.type === type
      );

      if (existingBudget) {
        updateBudget({
          ...existingBudget,
          plannedAmount: amount,
        });
      } else {
        addBudget({
          category,
          plannedAmount: amount,
          month: monthIndex,
          year,
          type,
          formattedValue: "",
        });
      }
    });

    // Limpa e fecha o modal
    setSelectedMonths([]);
    setBulkValue("");
    setIsModalOpen(false);
  };

  return (
    <div className="category-accordion">
      <button
        className={`accordion-header ${isExpanded ? "expanded" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="accordion-title">
          <span className="category-icon">{icon}</span>
          <span className="category-name">{category}</span>
          <span className="category-total">
            Total: {formatCurrency(getTotalPlanned())}
          </span>
        </div>
        <svg
          className={`accordion-arrow ${isExpanded ? "rotated" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {isExpanded && (
        <div className="accordion-content">
          <button className="bulk-fill-button" onClick={handleOpenModal}>
            📅 Preencher Meses
          </button>

          <div className="months-list">
            {MONTHS.map((monthName, index) => (
              <div key={index} className="month-row">
                <label className="month-label">{monthName}</label>
                <input
                  type="text"
                  className="month-input"
                  placeholder="R$ 0"
                  value={getBudgetValue(index)}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  onFocus={(e) => {
                    if (e.target.value === "") e.target.value = "R$ ";
                  }}
                  onBlur={(e) => {
                    if (
                      e.target.value === "R$ " ||
                      e.target.value === "R$ 0,00"
                    ) {
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Preencher Meses em Lote</h3>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div
              className="modal-body"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="month-selection">
                <div className="selection-header">
                  <p className="selection-label">
                    Selecione os meses (arraste para selecionar vários):
                  </p>
                  <div className="selection-actions">
                    <button
                      className="select-all-button"
                      onClick={handleSelectAll}
                    >
                      Todos
                    </button>
                    <button
                      className="deselect-all-button"
                      onClick={handleDeselectAll}
                    >
                      Nenhum
                    </button>
                  </div>
                </div>
                <div className="months-grid">
                  {MONTHS.map((monthName, index) => (
                    <button
                      key={index}
                      className={`month-chip ${
                        selectedMonths.includes(index) ? "selected" : ""
                      }`}
                      onMouseDown={() => handleMonthMouseDown(index)}
                      onMouseEnter={() => handleMonthMouseEnter(index)}
                      onTouchStart={() => handleMonthMouseDown(index)}
                    >
                      {monthName.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="value-input-section">
                <label className="value-label">Valor para os meses:</label>
                <input
                  type="text"
                  className="bulk-value-input"
                  placeholder="R$ 0,00"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  onFocus={(e) => {
                    if (e.target.value === "") e.target.value = "R$ ";
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => {
                  setSelectedMonths([]);
                  setBulkValue("");
                  setIsModalOpen(false);
                }}
              >
                Cancelar
              </button>
              <button
                className="confirm-button"
                onClick={handleBulkFill}
                disabled={selectedMonths.length === 0 || !bulkValue}
              >
                Preencher {selectedMonths.length} meses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GeralTab: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [customExpenseCategories, setCustomExpenseCategories] = useState<
    Array<{ name: string; icon: string }>
  >([]);
  const [customIncomeCategories, setCustomIncomeCategories] = useState<
    Array<{ name: string; icon: string }>
  >([]);
  const [removedExpenseCategories, setRemovedExpenseCategories] = useState<
    string[]
  >([]);
  const [removedIncomeCategories, setRemovedIncomeCategories] = useState<
    string[]
  >([]);

  const { budgets, deleteBudget } = useTransaction();

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Combine default and custom categories, excluding removed ones
  const allExpenseCategories = [
    ...EXPENSE_CATEGORIES.filter(
      (cat) => !removedExpenseCategories.includes(cat.name)
    ),
    ...customExpenseCategories,
  ];
  const allIncomeCategories = [
    ...INCOME_CATEGORIES.filter(
      (cat) => !removedIncomeCategories.includes(cat.name)
    ),
    ...customIncomeCategories,
  ];

  const filteredExpenseCategories = allExpenseCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const filteredIncomeCategories = allIncomeCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const handleAddCategory = (category: {
    name: string;
    icon: string;
    type: "expense" | "income";
  }) => {
    if (category.type === "expense") {
      setCustomExpenseCategories((prev) => [
        ...prev,
        { name: category.name, icon: category.icon },
      ]);
    } else {
      setCustomIncomeCategories((prev) => [
        ...prev,
        { name: category.name, icon: category.icon },
      ]);
    }
  };

  const handleDeleteCategory = (
    categoryName: string,
    type: "expense" | "income"
  ) => {
    // Delete all budgets for this category
    const budgetsToDelete = budgets.filter(
      (budget) => budget.category === categoryName && budget.type === type
    );

    budgetsToDelete.forEach((budget) => {
      if (budget.id) {
        deleteBudget(budget.id);
      }
    });

    // Check if it's a default category or custom category
    const isDefaultExpense = EXPENSE_CATEGORIES.some(
      (cat) => cat.name === categoryName
    );
    const isDefaultIncome = INCOME_CATEGORIES.some(
      (cat) => cat.name === categoryName
    );

    if (type === "expense") {
      if (isDefaultExpense) {
        // Add to removed list if it's a default category
        setRemovedExpenseCategories((prev) => [...prev, categoryName]);
      } else {
        // Remove from custom list if it's a custom category
        setCustomExpenseCategories((prev) =>
          prev.filter((cat) => cat.name !== categoryName)
        );
      }
    } else {
      if (isDefaultIncome) {
        // Add to removed list if it's a default category
        setRemovedIncomeCategories((prev) => [...prev, categoryName]);
      } else {
        // Remove from custom list if it's a custom category
        setCustomIncomeCategories((prev) =>
          prev.filter((cat) => cat.name !== categoryName)
        );
      }
    }
  };

  const hasPlannedBudgets = (
    categoryName: string,
    type: "expense" | "income"
  ): boolean => {
    return budgets.some(
      (budget) => budget.category === categoryName && budget.type === type
    );
  };

  return (
    <div className="geral-tab">
      <div className="geral-header">
        <h2>Planejamento Anual por Categoria</h2>
        <div className="header-controls">
          <CategoryManager
            expenseCategories={allExpenseCategories}
            incomeCategories={allIncomeCategories}
            customExpenseCategoryNames={allExpenseCategories.map((c) => c.name)}
            customIncomeCategoryNames={allIncomeCategories.map((c) => c.name)}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            hasPlannedBudgets={hasPlannedBudgets}
          />
          <div className="filter-container">
            <input
              type="text"
              placeholder="🔍 Filtrar categorias..."
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-filter"
            />
          </div>
          <div className="year-selector">
            <label>Ano:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="year-select"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h3 className="section-title">
          <span className="title-icon">�</span>
          Despesas Planejadas
        </h3>
        {filteredExpenseCategories.length > 0 ? (
          filteredExpenseCategories.map((cat) => (
            <CategoryAccordion
              key={`expense-${cat.name}`}
              category={cat.name}
              icon={cat.icon}
              type="expense"
              year={selectedYear}
            />
          ))
        ) : (
          <p className="no-categories">Nenhuma categoria encontrada</p>
        )}
      </div>

      <div className="categories-section">
        <h3 className="section-title">
          <span className="title-icon">�</span>
          Receitas Planejadas
        </h3>
        {filteredIncomeCategories.length > 0 ? (
          filteredIncomeCategories.map((cat) => (
            <CategoryAccordion
              key={`income-${cat.name}`}
              category={cat.name}
              icon={cat.icon}
              type="income"
              year={selectedYear}
            />
          ))
        ) : (
          <p className="no-categories">Nenhuma categoria encontrada</p>
        )}
      </div>
    </div>
  );
};

export default GeralTab;
