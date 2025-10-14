import React from "react";
import "./Receitas.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import useReceitasNavigation from "../../hooks/useReceitasNavigation";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import simboloMeuBolsoContasAReceberCard from "../../assets/simboloMeuBolsoContasAReceberCard.png";

interface ReceitaEntry {
  date: string;
  category: string;
  type: string;
  value: string;
}

interface ContasAReceberEntry {
  date: string;
  category: string;
  type: string;
  value: string;
}

const Receitas: React.FC = () => {
  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();
  const { activeCard, switchCard, cardData } = useReceitasNavigation("receita");

  const receitasData: ReceitaEntry[] = [
    { date: "06/10", category: "Salário", type: "Fixa", value: "R$ 5.000,00" },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
    {
      date: "10/10",
      category: "Freelancer",
      type: "Variável",
      value: "R$ 550,00",
    },
  ];

  const contasAReceberData: ContasAReceberEntry[] = [
    {
      date: "15/10",
      category: "Consultoria",
      type: "Pendente",
      value: "R$ 2.500,00",
    },
    {
      date: "15/10",
      category: "Consultoria",
      type: "Pendente",
      value: "R$ 2.500,00",
    },
    {
      date: "15/10",
      category: "Consultoria",
      type: "Pendente",
      value: "R$ 2.500,00",
    },
    {
      date: "15/10",
      category: "Consultoria",
      type: "Pendente",
      value: "R$ 2.500,00",
    },
    {
      date: "20/10",
      category: "Projeto",
      type: "Pendente",
      value: "R$ 1.800,00",
    },
    {
      date: "25/10",
      category: "Manutenção",
      type: "Atrasado",
      value: "R$ 900,00",
    },
  ];

  // Dados para o gráfico de barras (simulando os valores mensais)
  const monthlyData = [
    { month: "Jan", value: 85 },
    { month: "Fev", value: 75 },
    { month: "Mar", value: 95 },
    { month: "Abr", value: 80 },
    { month: "Mai", value: 85 },
    { month: "Jun", value: 100 },
    { month: "Jul", value: 90 },
    { month: "Ago", value: 95 },
    { month: "Set", value: 85 },
    { month: "Out", value: 100 },
    { month: "Nov", value: 0 },
    { month: "Dez", value: 0 },
  ];

  const maxValue = Math.max(...monthlyData.map((item) => item.value));

  // Definir colunas para a tabela de receitas
  const receitasColumns: TableColumn[] = [
    { key: "date", label: "Data" },
    { key: "category", label: "Categoria" },
    {
      key: "type",
      label: "Tipo",
      render: (value) => (
        <span className={`category ${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value income">{value}</span>,
    },
  ];

  // Definir colunas para a tabela de contas a receber
  const contasAReceberColumns: TableColumn[] = [
    { key: "date", label: "Data" },
    { key: "category", label: "Categoria" },
    {
      key: "type",
      label: "Tipo",
      render: (value) => (
        <span className={`category ${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value income">{value}</span>,
    },
  ];

  const getCardIcon = () => {
    switch (activeCard) {
      case "receita":
        return sacoDeDinheiro;
      case "contas-a-receber":
        return simboloMeuBolsoContasAReceberCard;
      default:
        return sacoDeDinheiro;
    }
  };

  return (
    <div className="receitas-page">
      {/* Cards principais - DESKTOP */}
      <div className="receitas-cards">
        <FinancialCard
          title="Receita do mês"
          value={formatValue("R$ 1.250,37")}
          icon={sacoDeDinheiro}
          type="positive"
          className="receita-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <FinancialCard
          title="Contas a receber"
          value={formatValue("R$ 600,00")}
          icon={simboloMeuBolsoContasAReceberCard}
          type="neutral"
          className="receita-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Navegação - APENAS MOBILE */}
      <div className="receitas-card-container">
        {/* Navegação dos Cards */}
        <div className="receitas-card-navigation">
          <button
            className={`nav-button ${activeCard === "receita" ? "active" : ""}`}
            onClick={() => switchCard("receita")}
          >
            Receita
          </button>
          <button
            className={`nav-button ${
              activeCard === "contas-a-receber" ? "active" : ""
            }`}
            onClick={() => switchCard("contas-a-receber")}
          >
            Contas a Receber
          </button>
        </div>

        {/* Card Único */}
        <div className="single-receitas-card">
          <FinancialCard
            title={cardData.title}
            value={formatValue(cardData.value)}
            icon={getCardIcon()}
            type={cardData.type}
            showToggle={true}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={toggleBalanceVisibility}
          />
        </div>
      </div>

      {/* Conteúdo Mobile - Apenas Tabela */}
      <div className="receitas-mobile-content mobile-only">
        <div className="dashboard-grid">
          {/* Mostrar tabela baseada no card ativo */}
          {activeCard === "receita" ? (
            <TransactionTable
              title="Últimas Entradas"
              columns={receitasColumns}
              data={receitasData}
              className="receitas-table-card"
              showSummary={true}
              summaryCountLabel="Entradas"
              valueKey="value"
            />
          ) : (
            <TransactionTable
              title="Contas a Receber"
              columns={contasAReceberColumns}
              data={contasAReceberData}
              className="receitas-table-card"
              showSummary={true}
              summaryCountLabel="Contas"
              valueKey="value"
            />
          )}
        </div>
      </div>

      {/* Conteúdo Desktop - Sempre Visível */}
      <div className="receitas-content desktop-content">
        {/* Primeira linha com tabelas */}
        <div className="receitas-tables-row">
          {/* Últimas Entradas */}
          <TransactionTable
            title="Últimas Entradas"
            columns={receitasColumns}
            data={receitasData}
            className="receitas-table-card"
            showSummary={true}
            summaryCountLabel="Entradas"
            valueKey="value"
          />

          {/* Contas a Receber */}
          <TransactionTable
            title="Contas a Receber"
            columns={contasAReceberColumns}
            data={contasAReceberData}
            className="receitas-table-card"
            showSummary={true}
            summaryCountLabel="Contas"
            valueKey="value"
          />
        </div>

        {/* Gráfico de Receitas Mensais */}
        <div className="receitas-card chart-card">
          <h3 className="card-header">Receitas por Mês</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {monthlyData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      opacity: item.value === 0 ? 0.3 : 1,
                    }}
                  ></div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receitas;
