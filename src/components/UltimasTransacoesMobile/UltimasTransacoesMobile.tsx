import React, { useState } from "react";
import "./UltimasTransacoesMobile.css";
import lupa from "/src/assets/lupa.png";
import receitaIcon from "/src/assets/receita.png";
import despesaIcon from "/src/assets/despesa.png";
import editarIcon from "/src/assets/editar.png";
import { createSafeDate } from "../../utils";

interface Transacao {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  valor: number;
  data: string; // Data formatada para exibição (DD/MM)
  dataOriginal?: string; // Data original da API para filtro (YYYY-MM-DD)
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

  const getTransactionText = (tipo: "entrada" | "saida") => {
    return tipo === "entrada" ? "Entrada" : "Saída";
  };

  // Função para filtrar transações por data
  const filterTransactionsByDate = (transactions: Transacao[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas de data

    return transactions.filter((transacao) => {
      let transactionDate: Date;

      // Se temos data original (YYYY-MM-DD), usar ela
      if (transacao.dataOriginal) {
        transactionDate = createSafeDate(transacao.dataOriginal);
      } else if (transacao.data && transacao.data !== "--/--") {
        // Tentar converter data formatada DD/MM de volta para Date
        const [day, month] = transacao.data.split("/");
        const year = today.getFullYear(); // Assumir ano atual se não foi informado
        transactionDate = new Date(year, parseInt(month) - 1, parseInt(day));
      } else {
        // Se não tem data válida, não filtrar
        return true;
      }

      transactionDate.setHours(0, 0, 0, 0);

      switch (selectedFilter) {
        case "atual":
          return transactionDate <= today;
        case "futuros":
          return transactionDate > today;
        case "todos":
        default:
          return true;
      }
    });
  };

  // Aplicar filtros nas transações
  const filteredByDate = filterTransactionsByDate(transacoes);
  
  // Aplicar filtro de busca
  const filteredTransactions = filteredByDate.filter((transacao) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transacao.categoria.toLowerCase().includes(searchLower) ||
      transacao.tipo.toLowerCase().includes(searchLower) ||
      transacao.valor.toString().includes(searchTerm) ||
      transacao.data.includes(searchTerm)
    );
  });

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
            <option value="todos">Todas</option>
            <option value="atual">Atuais</option>
            <option value="futuros">Futuras</option>
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
          {filteredTransactions.map((transacao) => (
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
                <div className="transaction-date">{transacao.data}</div>
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
                {filteredTransactions.length}
              </span>
            </div>
            <div className="footer-item">
              <span className="footer-label">Valor Total:</span>
              <span className="footer-value">
                {isBalanceVisible
                  ? formatCurrency(
                      filteredTransactions.reduce(
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
