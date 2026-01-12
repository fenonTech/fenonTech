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
import { authService } from "../../services/authService";
import { formatTableDate, isDateTodayOrBefore } from "../../utils";
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

  // Verificar parâmetros de URL e fazer login automático
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const telefone = urlParams.get("telefone");
    const codigo = urlParams.get("codigo");

    // Se tem parâmetros na URL, sempre fazer login novamente
    if (telefone && codigo) {
      console.log("🔑 Parâmetros detectados na URL, iniciando novo login...");

      const doLogin = async () => {
        try {
          // Limpar localStorage existente antes de fazer novo login
          authService.clearUserCredentials();
          console.log("🧹 localStorage limpo");

          // Fazer login com os parâmetros da URL
          const response = await authService.login(
            decodeURIComponent(telefone),
            codigo
          );

          if (response.status && response.token) {
            console.log("✅ Login via URL bem-sucedido");
            console.log("💾 Novo token salvo no localStorage");
            // Limpar parâmetros da URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
            // Recarregar a página para aplicar autenticação
            window.location.reload();
          } else {
            console.error("❌ Falha no login:", response.message);
          }
        } catch (error) {
          console.error("❌ Erro ao fazer login via URL:", error);
        }
      };

      doLogin();
    }
  }, []);

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

  // Preparar contas a pagar (despesas futuras)
  const bills = useMemo(() => {
    return transacoes
      .filter((t) => !t.is_entrada && !isDateTodayOrBefore(t.data_pagamento))
      .map((transacao) => ({
        id: transacao.codigo.toString(),
        date: formatTableDate(transacao.data_pagamento),
        description: transacao.descricao || transacao.tipo,
        category: transacao.tipo,
        value: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(transacao.valor),
        type: "expense" as const,
      }));
  }, [transacoes]);

  // Agrupar despesas por categoria para o gráfico de pizza
  const categoryData = useMemo(() => {
    // Categorias pré-cadastradas com cores fixas
    const predefinedCategories = [
      { name: "Alimentação", color: "#FF6B6B" },
      { name: "Transporte", color: "#4ECDC4" },
      { name: "Moradia", color: "#45B7D1" },
      { name: "Lazer", color: "#96CEB4" },
      { name: "Saúde", color: "#FFEAA7" },
      { name: "Educação", color: "#DDA0DD" },
      { name: "Mercado", color: "#98D8C8" },
      { name: "Outros", color: "#B0BEC5" },
    ];

    // Filtrar apenas despesas (não receitas) já pagas
    const expenses = transacoes.filter(
      (t) => !t.is_entrada && isDateTodayOrBefore(t.data_pagamento)
    );

    if (expenses.length === 0) {
      return [];
    }

    // Agrupar despesas por categoria
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const category = expense.tipo?.toLowerCase() || "outros";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.valor;
    });

    const totalExpenseValue = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    // Mapear categorias pré-definidas com dados reais
    return predefinedCategories
      .map((predefCategory) => {
        const categoryKey = predefCategory.name.toLowerCase();
        const value = categoryTotals[categoryKey] || 0;
        return {
          name: predefCategory.name,
          percentage:
            totalExpenseValue > 0
              ? Math.round((value / totalExpenseValue) * 100)
              : 0,
          color: predefCategory.color,
        };
      })
      .filter((cat) => cat.percentage > 0);
  }, [transacoes]);

  // Calcular total de despesas para exibir no gráfico
  const totalDespesas = useMemo(() => {
    return transacoes
      .filter((t) => !t.is_entrada && isDateTodayOrBefore(t.data_pagamento))
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transacoes]);

  // Dados para visão por categoria (apenas despesas)
  const categoryBarsData = useMemo(() => {
    // Filtrar apenas despesas
    const expenses = transacoes.filter((t) => !t.is_entrada);

    if (expenses.length === 0) {
      return [];
    }

    // Agrupar por categoria
    const categoryMap = new Map<string, { spent: number; planned: number }>();

    expenses.forEach((expense) => {
      const categoryName = expense.tipo || expense.descricao || "Outros";

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { spent: 0, planned: 0 });
      }

      const categoryData = categoryMap.get(categoryName)!;
      categoryData.planned += expense.valor;

      // Se já foi pago (data <= hoje), adiciona ao gasto
      if (isDateTodayOrBefore(expense.data_pagamento)) {
        categoryData.spent += expense.valor;
      }
    });

    // Cores fixas para cada categoria
    const categoryColors: { [key: string]: string } = {
      alimentação: "#FF6B6B",
      transporte: "#4ECDC4",
      moradia: "#45B7D1",
      lazer: "#96CEB4",
      saúde: "#FFEAA7",
      educação: "#DDA0DD",
      mercado: "#98D8C8",
      outros: "#B0BEC5",
    };

    // Converter para array e ordenar por valor planejado
    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spent: data.spent,
        planned: data.planned,
        percentage:
          data.planned > 0 ? Math.round((data.spent / data.planned) * 100) : 0,
        color: categoryColors[name.toLowerCase()] || "#B0BEC5",
      }))
      .sort((a, b) => b.planned - a.planned)
      .slice(0, 6); // Mostrar apenas top 6 categorias
  }, [transacoes]);

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
          totalValue={formatValue(totalDespesas)}
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
