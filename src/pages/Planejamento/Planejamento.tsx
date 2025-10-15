import React, { useState } from "react";
import "./Planejamento.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import MonthYearSelector from "../../components/MonthYearSelector";
import useTabs from "../../hooks/useTabs";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";

interface PlannedReceita {
  id: string;
  description: string;
  value: string;
  category: "fixa" | "variavel";
  date: string;
}

interface PlannedDespesa {
  id: string;
  description: string;
  value: string;
  category: string;
  date: string;
}

const Planejamento: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [plannedReceitas, setPlannedReceitas] = useState<PlannedReceita[]>([]);
  const [plannedDespesas, setPlannedDespesas] = useState<PlannedDespesa[]>([]);

  // Formulário de receitas
  const [receitaForm, setReceitaForm] = useState({
    description: "",
    value: "",
    category: "fixa" as "fixa" | "variavel",
    date: "",
  });

  // Formulário de despesas
  const [despesaForm, setDespesaForm] = useState({
    description: "",
    value: "",
    category: "",
    date: "",
  });

  const { activeTab, switchTab } = useTabs("receitas");
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  const despesaCategories = [
    "Alimentação",
    "Transporte",
    "Casa",
    "Saúde",
    "Educação",
    "Lazer",
    "Roupas",
    "Outros",
  ];

  // Calcular totais
  const totalReceitas = plannedReceitas.reduce(
    (sum, receita) =>
      sum + parseFloat(receita.value.replace(/[^\d,]/g, "").replace(",", ".")),
    0
  );

  const totalDespesas = plannedDespesas.reduce(
    (sum, despesa) =>
      sum + parseFloat(despesa.value.replace(/[^\d,]/g, "").replace(",", ".")),
    0
  );

  const saldoProjetado = totalReceitas - totalDespesas;

  // Adicionar receita
  const handleAddReceita = (e: React.FormEvent) => {
    e.preventDefault();
    if (receitaForm.description && receitaForm.value && receitaForm.date) {
      const newReceita: PlannedReceita = {
        id: Date.now().toString(),
        ...receitaForm,
        value: `R$ ${receitaForm.value}`,
      };
      setPlannedReceitas([...plannedReceitas, newReceita]);
      setReceitaForm({
        description: "",
        value: "",
        category: "fixa",
        date: "",
      });
    }
  };

  // Adicionar despesa
  const handleAddDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      despesaForm.description &&
      despesaForm.value &&
      despesaForm.category &&
      despesaForm.date
    ) {
      const newDespesa: PlannedDespesa = {
        id: Date.now().toString(),
        ...despesaForm,
        value: `R$ ${despesaForm.value}`,
      };
      setPlannedDespesas([...plannedDespesas, newDespesa]);
      setDespesaForm({ description: "", value: "", category: "", date: "" });
    }
  };

  // Colunas da tabela de receitas
  const receitasColumns: TableColumn[] = [
    {
      key: "date",
      label: "Data",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "category",
      label: "Tipo",
      render: (value) => (
        <span className={`category ${value === "fixa" ? "fixa" : "variavel"}`}>
          {value === "fixa" ? "Fixa" : "Variável"}
        </span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value income">{value}</span>,
    },
  ];

  // Colunas da tabela de despesas
  const despesasColumns: TableColumn[] = [
    {
      key: "date",
      label: "Data",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "category",
      label: "Categoria",
      render: (value) => <span className="category expense">{value}</span>,
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value expense">{value}</span>,
    },
  ];

  return (
    <div className="planejamento">
      {/* Seleção de mês */}
      <div className="planejamento-header">
        <h2 className="planejamento-title">Planejamento Financeiro</h2>
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          className="header-style"
        />
      </div>

      {/* Cards de resumo */}
      <div className="planejamento-financial-cards">
        <FinancialCard
          title="Receitas Planejadas"
          value={formatValue(
            `R$ ${totalReceitas.toFixed(2).replace(".", ",")}`
          )}
          icon={sacoDeDinheiro}
          type="positive"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Despesas Planejadas"
          value={formatValue(
            `R$ ${totalDespesas.toFixed(2).replace(".", ",")}`
          )}
          icon={setaParaBaixo}
          type="negative"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Saldo Projetado"
          value={formatValue(
            `R$ ${Math.abs(saldoProjetado).toFixed(2).replace(".", ",")}`
          )}
          icon={dinheiroSaldo}
          type={saldoProjetado >= 0 ? "positive" : "negative"}
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Tabs */}
      <div className="planejamento-tabs">
        <button
          className={`tab-button ${activeTab === "receitas" ? "active" : ""}`}
          onClick={() => switchTab("receitas")}
        >
          Receitas
        </button>
        <button
          className={`tab-button ${activeTab === "despesas" ? "active" : ""}`}
          onClick={() => switchTab("despesas")}
        >
          Despesas
        </button>
        <button
          className={`tab-button ${
            activeTab === "visao-geral" ? "active" : ""
          }`}
          onClick={() => switchTab("visao-geral")}
        >
          Visão Geral
        </button>
      </div>

      {/* Tab Receitas */}
      <div
        className={`tab-content ${activeTab === "receitas" ? "active" : ""}`}
        style={{ display: activeTab === "receitas" ? "block" : "none" }}
      >
        <div className="planejamento-grid">
          {/* Formulário de Receitas */}
          <div className="planejamento-card form-card">
            <h3 className="card-header">Adicionar Receita</h3>
            <form onSubmit={handleAddReceita} className="planejamento-form">
              <div className="form-group">
                <label htmlFor="receita-descricao">Descrição</label>
                <input
                  id="receita-descricao"
                  type="text"
                  value={receitaForm.description}
                  onChange={(e) =>
                    setReceitaForm({
                      ...receitaForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ex: Salário, Freelancer..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="receita-valor">Valor</label>
                <input
                  id="receita-valor"
                  type="text"
                  value={receitaForm.value}
                  onChange={(e) =>
                    setReceitaForm({ ...receitaForm, value: e.target.value })
                  }
                  placeholder="Ex: 2500,00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="receita-categoria">Tipo</label>
                <select
                  id="receita-categoria"
                  value={receitaForm.category}
                  onChange={(e) =>
                    setReceitaForm({
                      ...receitaForm,
                      category: e.target.value as "fixa" | "variavel",
                    })
                  }
                  className="form-select"
                >
                  <option value="fixa">Fixa</option>
                  <option value="variavel">Variável</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="receita-data">Data de Recebimento</label>
                <input
                  id="receita-data"
                  type="date"
                  value={receitaForm.date}
                  onChange={(e) =>
                    setReceitaForm({ ...receitaForm, date: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <button type="submit" className="form-button">
                Adicionar Receita
              </button>
            </form>
          </div>

          {/* Tabela de Receitas */}
          <TransactionTable
            title="Receitas Planejadas"
            columns={receitasColumns}
            data={plannedReceitas}
            className="receitas-table"
            showSummary={true}
            summaryCountLabel="Receitas"
            valueKey="value"
          />
        </div>
      </div>

      {/* Tab Despesas */}
      <div
        className={`tab-content ${activeTab === "despesas" ? "active" : ""}`}
        style={{ display: activeTab === "despesas" ? "block" : "none" }}
      >
        <div className="planejamento-grid">
          {/* Formulário de Despesas */}
          <div className="planejamento-card form-card">
            <h3 className="card-header">Adicionar Despesa</h3>
            <form onSubmit={handleAddDespesa} className="planejamento-form">
              <div className="form-group">
                <label htmlFor="despesa-descricao">Descrição</label>
                <input
                  id="despesa-descricao"
                  type="text"
                  value={despesaForm.description}
                  onChange={(e) =>
                    setDespesaForm({
                      ...despesaForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ex: Aluguel, Supermercado..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="despesa-valor">Valor</label>
                <input
                  id="despesa-valor"
                  type="text"
                  value={despesaForm.value}
                  onChange={(e) =>
                    setDespesaForm({ ...despesaForm, value: e.target.value })
                  }
                  placeholder="Ex: 800,00"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="despesa-categoria">Categoria</label>
                <select
                  id="despesa-categoria"
                  value={despesaForm.category}
                  onChange={(e) =>
                    setDespesaForm({ ...despesaForm, category: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="">Selecione uma categoria</option>
                  {despesaCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="despesa-data">Data do Gasto</label>
                <input
                  id="despesa-data"
                  type="date"
                  value={despesaForm.date}
                  onChange={(e) =>
                    setDespesaForm({ ...despesaForm, date: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <button type="submit" className="form-button">
                Adicionar Despesa
              </button>
            </form>
          </div>

          {/* Tabela de Despesas */}
          <TransactionTable
            title="Despesas Planejadas"
            columns={despesasColumns}
            data={plannedDespesas}
            className="despesas-table"
            showSummary={true}
            summaryCountLabel="Despesas"
            valueKey="value"
          />
        </div>
      </div>

      {/* Tab Visão Geral */}
      <div
        className={`tab-content ${activeTab === "visao-geral" ? "active" : ""}`}
        style={{ display: activeTab === "visao-geral" ? "block" : "none" }}
      >
        <div className="visao-geral-grid">
          <TransactionTable
            title="Todas as Receitas"
            columns={receitasColumns}
            data={plannedReceitas}
            className="receitas-table"
            showSummary={true}
            summaryCountLabel="Receitas"
            valueKey="value"
          />

          <TransactionTable
            title="Todas as Despesas"
            columns={despesasColumns}
            data={plannedDespesas}
            className="despesas-table"
            showSummary={true}
            summaryCountLabel="Despesas"
            valueKey="value"
          />
        </div>
      </div>
    </div>
  );
};

export default Planejamento;
