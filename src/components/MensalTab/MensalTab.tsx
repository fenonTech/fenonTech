import React, { useState, useMemo } from "react";
import { useTransaction } from "../../contexts/TransactionContext";
import type { Budget, Income, Expense } from "../../types/transactions";
import "./MensalTab.css";

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

interface CategoryComparison {
  category: string;
  planned: number;
  actual: number;
  difference: number;
  percentUsed: number;
}

const MensalTab: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedType, setSelectedType] = useState<"expense" | "income">(
    "expense"
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { budgets, expenses, incomes, updateBudget, addBudget } =
    useTransaction();

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  // Calcula os totais reais por categoria no mês/ano selecionado
  const actualTotals = useMemo(() => {
    const transactions = selectedType === "expense" ? expenses : incomes;
    const totals: Record<string, number> = {};

    transactions.forEach((transaction: Expense | Income) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      ) {
        if (!totals[transaction.category]) {
          totals[transaction.category] = 0;
        }
        totals[transaction.category] += transaction.value;
      }
    });

    return totals;
  }, [expenses, incomes, selectedMonth, selectedYear, selectedType]);

  // Compara planejado vs realizado
  const comparisons = useMemo(() => {
    const result: CategoryComparison[] = [];
    const processedCategories = new Set<string>();

    // Primeiro, processa todas as categorias que têm budget
    budgets.forEach((budget: Budget) => {
      if (
        budget.month === selectedMonth &&
        budget.year === selectedYear &&
        budget.type === selectedType &&
        !processedCategories.has(budget.category)
      ) {
        const actual = actualTotals[budget.category] || 0;
        const difference = actual - budget.plannedAmount;
        const percentUsed =
          budget.plannedAmount > 0 ? (actual / budget.plannedAmount) * 100 : 0;

        result.push({
          category: budget.category,
          planned: budget.plannedAmount,
          actual,
          difference,
          percentUsed,
        });

        processedCategories.add(budget.category);
      }
    });

    // Depois, adiciona categorias que têm gastos mas não têm budget
    Object.entries(actualTotals).forEach(([category, actual]) => {
      if (!processedCategories.has(category)) {
        result.push({
          category,
          planned: 0,
          actual,
          difference: actual,
          percentUsed: 0,
        });
      }
    });

    // Ordena por categoria
    return result.sort((a, b) => a.category.localeCompare(b.category));
  }, [budgets, actualTotals, selectedMonth, selectedYear, selectedType]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleEditClick = (category: string, currentValue: number) => {
    setEditingCategory(category);
    setEditValue(currentValue > 0 ? formatCurrency(currentValue) : "");
  };

  const handleSavePlanned = (category: string) => {
    if (!editValue) {
      setEditingCategory(null);
      return;
    }

    const numericValue = editValue.replace(/\D/g, "");
    const amount = parseFloat(numericValue) / 100;

    if (isNaN(amount) || amount === 0) {
      setEditingCategory(null);
      return;
    }

    const existingBudget = budgets.find(
      (b: Budget) =>
        b.category === category &&
        b.month === selectedMonth &&
        b.year === selectedYear &&
        b.type === selectedType
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
        month: selectedMonth,
        year: selectedYear,
        type: selectedType,
        formattedValue: "",
      });
    }

    setEditingCategory(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const getDifferenceClass = (difference: number): string => {
    if (selectedType === "expense") {
      return difference > 0 ? "negative" : difference < 0 ? "positive" : "";
    } else {
      return difference > 0 ? "positive" : difference < 0 ? "negative" : "";
    }
  };

  const getPercentClass = (percent: number): string => {
    if (selectedType === "expense") {
      if (percent > 100) return "danger";
      if (percent > 80) return "warning";
      return "success";
    } else {
      if (percent < 50) return "danger";
      if (percent < 80) return "warning";
      return "success";
    }
  };

  const totals = useMemo(() => {
    return comparisons.reduce(
      (acc, item) => ({
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual,
        difference: acc.difference + item.difference,
      }),
      { planned: 0, actual: 0, difference: 0 }
    );
  }, [comparisons]);

  return (
    <div className="mensal-tab">
      <div className="mensal-header">
        <h2>Comparativo: Planejado x Realizado</h2>
        <div className="filters-row">
          <div className="filter-group">
            <label>Tipo:</label>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as "expense" | "income")
              }
              className="type-select"
            >
              <option value="expense">� Despesas</option>
              <option value="income">� Receitas</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Mês:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="month-select"
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
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

      <div className="summary-cards">
        <div className="summary-card planned">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <span className="card-label">
              {selectedType === "expense"
                ? "Previsto Gastar"
                : "Previsto Receber"}
            </span>
            <span className="card-value">{formatCurrency(totals.planned)}</span>
          </div>
        </div>

        <div className="summary-card actual">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <span className="card-label">
              {selectedType === "expense"
                ? "Realmente Gastou"
                : "Realmente Recebeu"}
            </span>
            <span className="card-value">{formatCurrency(totals.actual)}</span>
          </div>
        </div>

        <div
          className={`summary-card difference ${getDifferenceClass(
            totals.difference
          )}`}
        >
          <div className="card-icon">
            {selectedType === "expense"
              ? totals.difference > 0
                ? "🔴"
                : totals.difference < 0
                ? "🟢"
                : "➖"
              : totals.difference > 0
              ? "🟢"
              : totals.difference < 0
              ? "🔴"
              : "➖"}
          </div>
          <div className="card-content">
            <span className="card-label">
              {selectedType === "expense"
                ? totals.difference > 0
                  ? "Gastou a Mais"
                  : "Economizou"
                : totals.difference > 0
                ? "Recebeu a Mais"
                : "Recebeu a Menos"}
            </span>
            <span className="card-value">
              {formatCurrency(Math.abs(totals.difference))}
            </span>
          </div>
        </div>
      </div>

      {comparisons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">�</div>
          <h3>Nenhum dado para este mês</h3>
          <p>
            Você ainda não definiu{" "}
            {selectedType === "expense" ? "despesas" : "receitas"} planejadas
            para {MONTHS[selectedMonth]} de {selectedYear}.
          </p>
          <p className="empty-hint">
            💡 Dica: Use a aba "Geral" para planejar seus gastos mensais por
            categoria.
          </p>
        </div>
      ) : (
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Planejado</th>
                <th>Realizado</th>
                <th>Diferença</th>
                <th>% Utilizado</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item) => (
                <tr key={item.category}>
                  <td className="category-cell">
                    <span className="category-name">{item.category}</span>
                  </td>
                  <td className="planned-cell">
                    {editingCategory === item.category ? (
                      <div className="edit-input-container">
                        <input
                          type="text"
                          className="edit-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSavePlanned(item.category);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          onBlur={() => handleSavePlanned(item.category)}
                          autoFocus
                          placeholder="R$ 0,00"
                        />
                      </div>
                    ) : (
                      <div
                        className="editable-value"
                        onClick={() =>
                          handleEditClick(item.category, item.planned)
                        }
                        title="Clique para editar"
                      >
                        {formatCurrency(item.planned)}
                        <span className="edit-icon">✏️</span>
                      </div>
                    )}
                  </td>
                  <td className="actual-cell">{formatCurrency(item.actual)}</td>
                  <td
                    className={`difference-cell ${getDifferenceClass(
                      item.difference
                    )}`}
                  >
                    {item.difference > 0 && "+"}
                    {formatCurrency(item.difference)}
                  </td>
                  <td className="percent-cell">
                    <div className="percent-container">
                      <div className="percent-bar-bg">
                        <div
                          className={`percent-bar ${getPercentClass(
                            item.percentUsed
                          )}`}
                          style={{
                            width: `${Math.min(item.percentUsed, 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`percent-text ${getPercentClass(
                          item.percentUsed
                        )}`}
                      >
                        {item.percentUsed.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{formatCurrency(totals.planned)}</strong>
                </td>
                <td>
                  <strong>{formatCurrency(totals.actual)}</strong>
                </td>
                <td className={getDifferenceClass(totals.difference)}>
                  <strong>
                    {totals.difference > 0 && "+"}
                    {formatCurrency(totals.difference)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {totals.planned > 0
                      ? `${((totals.actual / totals.planned) * 100).toFixed(
                          0
                        )}%`
                      : "-"}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default MensalTab;
