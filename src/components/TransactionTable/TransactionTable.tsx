import React from "react";
import "./TransactionTable.css";

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TransactionTableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  className?: string;
  showIcon?: boolean;
  icon?: string;
  iconPosition?: "top-right" | "left";
  emptyMessage?: string;
  showSummary?: boolean;
  summaryCountLabel?: string; // ex: "Entradas", "Transações", "Contas"
  valueKey?: string; // chave do objeto que contém o valor monetário
  showActions?: boolean; // mostrar botões de editar/excluir - Mantido para compatibilidade, mas não usado
  onEdit?: (item: any, index: number) => void;
  onDelete?: (item: any, index: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  title,
  columns,
  data,
  className = "",
  showIcon = false,
  icon,
  iconPosition = "top-right",
  emptyMessage = "Nenhum registro encontrado",
  showSummary = false,
  summaryCountLabel = "Registros",
  valueKey = "value",
  showActions = false, // Não utilizado mais - Coluna de ações removida
  onEdit, // Mantido para compatibilidade
  onDelete, // Mantido para compatibilidade
}) => {
  // Função para extrair valor numérico de string monetária
  const parseMoneyValue = (value: string): number => {
    if (!value) return 0;
    // Remove "R$", espaços, pontos e substitui vírgula por ponto
    const cleanValue = value
      .replace(/R\$\s?/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    return parseFloat(cleanValue) || 0;
  };

  // Calcular totais automaticamente se showSummary estiver ativo
  const calculateSummary = () => {
    if (!showSummary || data.length === 0) {
      return { count: 0, total: 0, formattedTotal: "R$ 0,00" };
    }

    const total = data.reduce((sum, row) => {
      const value = row[valueKey];
      return sum + parseMoneyValue(value);
    }, 0);

    const formattedTotal = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(total);

    return {
      count: data.length,
      total,
      formattedTotal,
    };
  };

  const summary = calculateSummary();

  // Ignorar o warning de variáveis não usadas
  void showActions;
  void onEdit;
  void onDelete;

  return (
    <div className={`transaction-table-card ${className}`}>
      <h3 className="card-header">{title}</h3>

      {showIcon && icon && iconPosition === "top-right" && (
        <div className="table-icon">
          <img src={icon} alt={title} />
        </div>
      )}

      {showIcon && icon && iconPosition === "left" ? (
        <div className="bills-container">
          <div className="bills-icon">
            <img src={icon} alt={title} />
          </div>
          <div className="table-container">
            {data.length === 0 ? (
              <div className="empty-state">
                <p>{emptyMessage}</p>
              </div>
            ) : (
              <table className="data-table">
                <thead></thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.key} data-label={column.label}>
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </td>
                      ))}
                      {showActions && (
                        <td className="actions-cell" data-label="Ações">
                          <div className="action-buttons">
                            {onEdit && (
                              <button
                                className="btn-edit"
                                onClick={() => onEdit(row, index)}
                                title="Editar"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="table-container">
          {data.length === 0 ? (
            <div className="empty-state">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  {showActions && <th className="actions-header">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key} data-label={column.label}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                    {showActions && (
                      <td className="actions-cell" data-label="Ações">
                        <div className="action-buttons">
                          {onEdit && (
                            <button
                              className="btn-edit"
                              onClick={() => onEdit(row, index)}
                              title="Editar"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showSummary && (
        <div className="table-summary">
          <span className="summary-count">
            {summaryCountLabel}: {summary.count}
          </span>
          <span className="summary-total">Total: {summary.formattedTotal}</span>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
