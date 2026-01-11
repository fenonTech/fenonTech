import React, { useState } from "react";
import "./UltimasTransacoesMobile.css";
import lupa from "/src/assets/lupa.png";
import receitaIcon from "/src/assets/receita.png";
import despesaIcon from "/src/assets/despesa.png";
import editarIcon from "/src/assets/editar.png";

interface Transacao {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  valor: number;
  data: string;
}

interface UltimasTransacoesMobileProps {
  transacoes: Transacao[];
  onSearch?: (searchTerm: string) => void;
  onFilterChange?: (filter: string) => void;
  showFooter?: boolean;
  totalTransacoes?: number;
  valorTotal?: number;
  isBalanceVisible?: boolean;
  onEditTransaction?: (transacao: Transacao) => void;
}

const UltimasTransacoesMobile: React.FC<UltimasTransacoesMobileProps> = ({
  transacoes,
  onSearch,
  onFilterChange,
  showFooter = false,
  totalTransacoes,
  valorTotal,
  isBalanceVisible = true,
  onEditTransaction,
  // onDeleteTransaction removido pois não está sendo usado
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  const getTransactionText = (tipo: "entrada" | "saida") => {
    return tipo === "entrada" ? "Entrada" : "Saída";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <div className="ultimas-transacoes-container">
      <div className="ultimas-transacoes-header">
        <h3 className="ultimas-transacoes-title">Transações</h3>
        <div className="ultimas-transacoes-controls">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="transaction-filter-select"
          >
            <option value="todos">Todos</option>
            <option value="atual">Atual</option>
            <option value="futuros">Futuros</option>
          </select>
          <div className="ultimas-transacoes-search">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <img src={lupa} alt="Pesquisar" className="search-icon" />
          </div>
        </div>
      </div>

      <div className="ultimas-transacoes-mobile">
        <div className="ultimas-transacoes-list">
          {transacoes.map((transacao) => (
            <div key={transacao.id} className="ultimas-transacoes-item">
              <div className="transaction-icon-container">
                <img
                  src={transacao.tipo === "entrada" ? receitaIcon : despesaIcon}
                  alt={transacao.tipo === "entrada" ? "Receita" : "Despesa"}
                  className={`transaction-icon ${transacao.tipo}`}
                />
              </div>

              <div className="transaction-info">
                <div className="transaction-type">
                  {getTransactionText(transacao.tipo)}
                </div>
                <div className="transaction-category">
                  {transacao.categoria}
                </div>
              </div>

              <div className="transaction-amount-date">
                <div className="transaction-amount">
                  {formatCurrency(transacao.valor)}
                </div>
                <div className="transaction-date">
                  {formatDate(transacao.data)}
                </div>
              </div>

              {/* Botão Editar - só aparece quando callback está definido */}
              {onEditTransaction && (
                <div className="transaction-edit">
                  <button
                    className="transaction-edit-btn"
                    onClick={() => onEditTransaction(transacao)}
                    aria-label="Editar transação"
                  >
                    <img src={editarIcon} alt="Editar" className="edit-icon" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with totals */}
        {showFooter && (
          <div className="ultimas-transacoes-mobile-footer">
            <div className="footer-item">
              <span className="footer-label">Transações:</span>
              <span className="footer-value">
                {totalTransacoes || transacoes.length}
              </span>
            </div>
            <div className="footer-item">
              <span className="footer-label">Valor Total:</span>
              <span className="footer-value">
                {isBalanceVisible
                  ? valorTotal !== undefined
                    ? formatCurrency(valorTotal)
                    : formatCurrency(
                        transacoes.reduce(
                          (acc, t) =>
                            acc + (t.tipo === "entrada" ? t.valor : -t.valor),
                          0
                        )
                      )
                  : "R$ •••••"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimasTransacoesMobile;
