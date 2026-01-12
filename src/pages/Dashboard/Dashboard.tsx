import React, { useMemo, useEffect } from "react";
import "./Dashboard.css";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import ExpensesPieChart from "../../components/ExpensesPieChart";
import PageHeader from "../../components/PageHeader";
import FinancialCardGrid from "../../components/FinancialCardGrid";
import CategoryBudgetCard from "../../components/CategoryBudgetCard";
import { useFilter } from "../../contexts/FilterContext";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import { dashboardService } from "../../services/api/dashboardService";
import { formatTableDate } from "../../utils";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";
import simboloMenuBolsoContasAPagar from "../../assets/simboloMenuBolsoContasAPagar.png";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFilter();

  // Estados locais para os dados do dashboard
  const [saldo, setSaldo] = React.useState(0);
  const [contasAReceber, setContasAReceber] = React.useState(0);
  const [contasAPagar, setContasAPagar] = React.useState(0);
  const [transacoes, setTransacoes] = React.useState<any[]>([]);

  // Carregar dados do dashboard sempre que o filtro mudar
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log(
          `🔄 Carregando dashboard: mês=${
            selectedMonth + 1
          }, ano=${selectedYear}`
        );

        // Chamar nova API com filtro de mês e ano
        const data = await dashboardService.getDashboardData(
          selectedMonth + 1, // API usa 1-12, FilterContext usa 0-11
          selectedYear
        );

        // Atualizar estados
        setSaldo(data.saldo);
        setContasAReceber(data.contasAReceber);
        setContasAPagar(data.contasAPagar);
        setTransacoes(data.transacoes);

        console.log("✅ Dashboard carregado com sucesso");
      } catch (error) {
        console.error("❌ Erro ao carregar dashboard:", error);
      }
    };

    loadDashboardData();
  }, [selectedMonth, selectedYear]); // Recarregar quando o filtro mudar

  // Formatar transações para a tabela
  const allTransactions = useMemo(() => {
    return transacoes.map((transacao) => {
      return {
        id: transacao.codigo.toString(),
        date: formatTableDate(transacao.data_pagamento),
        description: transacao.descricao || transacao.tipo,
        category: transacao.tipo,
        value: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(transacao.valor),
        type: transacao.is_entrada ? ("income" as const) : ("expense" as const),
      };
    });
  }, [transacoes]);

  // Dados vazios para gráficos e tabelas que ainda não foram implementados
  const bills = useMemo(() => [], []);
  const categoryBarsData = useMemo(() => [], []);
  const categoryData = useMemo(() => [], []);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  const transactionColumns: TableColumn[] = [
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
      render: (value, row) => (
        <span className={`category ${row?.type}`}>{value}</span>
      ),
    },
    {
      key: "value",
      label: "Valor",
      render: (value, row) => (
        <span className={`value ${row?.type}`}>{value}</span>
      ),
    },
  ];

  const billsColumns: TableColumn[] = [
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
    <div className="dashboard">
      {/* Filtro de Mês e Ano */}
      <PageHeader
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        className="dashboard-header"
      />

      {/* Cards principais - DESKTOP */}
      <FinancialCardGrid
        cards={[
          {
            title: "Saldo Atual",
            value: formatValue(saldo),
            icon: dinheiroSaldo,
            type: "neutral",
          },
          {
            title: "Valores a Receber",
            value: formatValue(contasAReceber),
            icon: sacoDeDinheiro,
            type: "positive",
            onClick: () => onNavigate?.("receitas"),
          },
          {
            title: "Contas a Pagar",
            value: formatValue(contasAPagar),
            icon: setaParaBaixo,
            type: "negative",
            onClick: () => onNavigate?.("despesas"),
          },
        ]}
        isBalanceVisible={isBalanceVisible}
        onToggleVisibility={toggleBalanceVisibility}
      />

      {/* Primeira Linha - Transações + Gráfico Pizza */}
      <div className="dashboard-first-row">
        {/* Últimas Transações */}
        <TransactionTable
          title="Últimas Transações"
          columns={transactionColumns}
          data={allTransactions}
          className="transactions-card"
          showSummary={true}
          summaryCountLabel="Transações"
          valueKey="value"
        />

        {/* Despesas por categoria (gráfico de pizza) */}
        <ExpensesPieChart
          title="Despesas por categoria"
          totalLabel="TOTAL DESPESAS"
          totalValue={formatValue(0)}
          categories={categoryData}
          className="expenses-chart-card"
        />
      </div>

      {/* Segunda Linha - Contas + Visão Categoria */}
      <div className="dashboard-second-row">
        {/* Contas a pagar */}
        <TransactionTable
          title="Contas a pagar"
          columns={billsColumns}
          data={bills}
          showIcon={true}
          icon={simboloMenuBolsoContasAPagar}
          iconPosition="left"
          showSummary={true}
          summaryCountLabel="Contas"
          valueKey="value"
          className="bills-table-orange"
        />

        {/* Visão por categoria */}
        <CategoryBudgetCard data={categoryBarsData} />
      </div>
    </div>
  );
};

export default Dashboard;
