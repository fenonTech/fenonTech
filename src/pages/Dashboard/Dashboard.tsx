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
import { useDashboardData } from "../../hooks/queries";
import { authService } from "../../services/authService";
import { formatTableDate, isDateTodayOrBefore } from "../../utils";
import dinheiroSaldo from "../../assets/dinheiroSaldo.png";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import setaParaBaixo from "../../assets/setaParaBaixo.png";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFilter();

  // React Query - Busca dados do dashboard com cache automático
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useDashboardData(
    selectedMonth + 1, // API usa 1-12, FilterContext usa 0-11
    selectedYear,
  );

  // Extrair dados do dashboard (com valores padrão)
  const saldo = dashboardData?.saldo ?? 0;
  const contasAReceber = dashboardData?.contasAReceber ?? 0;
  const contasAPagar = dashboardData?.contasAPagar ?? 0;
  const transacoes = dashboardData?.transacoes ?? [];

  // Verificar parâmetros de URL e fazer login automático
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const telefone = urlParams.get("telefone");
    const codigo = urlParams.get("codigo");

    // Se tem parâmetros na URL, sempre fazer login novamente
    if (telefone && codigo) {
      console.log("🔑 Parâmetros detectados na URL, iniciando novo login...");
      console.log("🌍 Ambiente:", window.location.origin);

      const doLogin = async () => {
        try {
          // Limpar localStorage existente antes de fazer novo login
          authService.clearUserCredentials();
          console.log("🧹 localStorage limpo");

          // Preparar payload
          const telefoneDecodificado = decodeURIComponent(telefone);
          console.log("📦 Payload para API de login:", {
            telefone: telefoneDecodificado,
            codigo: codigo,
          });
          console.log("📦 Payload RAW (antes decode):", {
            telefone: telefone,
            codigo: codigo,
          });

          // Fazer login com os parâmetros da URL
          const response = await authService.login(
            telefoneDecodificado,
            codigo,
          );

          console.log("📥 Resposta da API:", response);

          if (response.status && response.token) {
            console.log("✅ Login via URL bem-sucedido");
            console.log("💾 Novo token salvo no localStorage");
            // Limpar parâmetros da URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
            // Recarregar a página para aplicar autenticação
            window.location.reload();
          } else {
            console.error("❌ Falha no login:", response.message);
            console.error("❌ Status code:", response.status_code);
            console.error("❌ Resposta completa:", response);
          }
        } catch (error: any) {
          console.error("❌ Erro ao fazer login via URL:", error);
          console.error("❌ Erro detalhes:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        }
      };

      doLogin();
    }
  }, []);

  // Formatar transações para a tabela
  const allTransactions = useMemo(() => {
    return transacoes
      .map((transacao) => {
        return {
          id: transacao.codigo.toString(),
          date: formatTableDate(transacao.data_pagamento),
          description: transacao.descricao || transacao.tipo,
          category: transacao.tipo,
          value: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(transacao.valor),
          type: transacao.is_entrada
            ? ("income" as const)
            : ("expense" as const),
          originalDate: transacao.data_pagamento,
        };
      })
      .sort((a, b) => {
        // Ordenar por data decrescente (mais recente primeiro)
        return (
          new Date(b.originalDate).getTime() -
          new Date(a.originalDate).getTime()
        );
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
    // Cores pré-definidas para categorias conhecidas
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

    // Cores extras para categorias dinâmicas
    const extraColors = [
      "#E74C3C",
      "#3498DB",
      "#2ECC71",
      "#F39C12",
      "#9B59B6",
      "#1ABC9C",
      "#E67E22",
      "#34495E",
    ];

    // Filtrar apenas despesas (não receitas) já pagas do mês/ano selecionado
    const expenses = transacoes.filter((t) => {
      if (t.is_entrada || !isDateTodayOrBefore(t.data_pagamento)) {
        return false;
      }

      // Filtrar pelo mês e ano selecionado
      const [year, month] = t.data_pagamento.split("-").map(Number);
      return month === selectedMonth + 1 && year === selectedYear;
    });

    if (expenses.length === 0) {
      return [];
    }

    // Agrupar despesas por categoria
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      // Usar apenas tipo como categoria
      const category = (expense.tipo || "outros").toLowerCase().trim();
      categoryTotals[category] =
        (categoryTotals[category] || 0) + expense.valor;
    });

    const totalExpenseValue = Object.values(categoryTotals).reduce(
      (sum, value) => sum + value,
      0,
    );

    if (totalExpenseValue === 0) {
      return [];
    }

    // Criar array com todas as categorias encontradas
    let colorIndex = 0;
    return Object.entries(categoryTotals)
      .map(([category, value]) => {
        // Usar cor pré-definida ou cor extra
        let color = categoryColors[category];
        if (!color) {
          color = extraColors[colorIndex % extraColors.length];
          colorIndex++;
        }

        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          percentage: Math.round((value / totalExpenseValue) * 100),
          color: color,
        };
      })
      .filter((cat) => cat.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);
  }, [transacoes, selectedMonth, selectedYear]);

  // Calcular total de despesas para exibir no gráfico (do mês/ano selecionado)
  const totalDespesas = useMemo(() => {
    return transacoes
      .filter((t) => {
        if (t.is_entrada || !isDateTodayOrBefore(t.data_pagamento)) {
          return false;
        }

        // Filtrar pelo mês e ano selecionado
        const [year, month] = t.data_pagamento.split("-").map(Number);
        return month === selectedMonth + 1 && year === selectedYear;
      })
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transacoes, selectedMonth, selectedYear]);

  // Dados para visão por categoria (apenas despesas)
  const categoryBarsData = useMemo(() => {
    // Filtrar apenas despesas que já foram pagas do mês/ano selecionado
    const expenses = transacoes.filter((t) => {
      if (t.is_entrada || !isDateTodayOrBefore(t.data_pagamento)) {
        return false;
      }

      // Filtrar pelo mês e ano selecionado
      const [year, month] = t.data_pagamento.split("-").map(Number);
      return month === selectedMonth + 1 && year === selectedYear;
    });

    if (expenses.length === 0) {
      return [];
    }

    // Agrupar por categoria
    const categoryMap = new Map<string, number>();

    expenses.forEach((expense) => {
      const categoryName = (expense.tipo || "Outros").toLowerCase().trim();
      const currentValue = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentValue + expense.valor);
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

    // Calcular total gasto
    const totalSpent = Array.from(categoryMap.values()).reduce(
      (sum, val) => sum + val,
      0,
    );

    // Converter para array e ordenar por valor gasto
    const allCategories = Array.from(categoryMap.entries())
      .map(([name, spent]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        spent: spent,
        planned: spent, // Usar o valor gasto como planejado
        percentage: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0,
        color: categoryColors[name.toLowerCase()] || "#B0BEC5",
      }))
      .sort((a, b) => b.spent - a.spent);

    // Retornar todas as categorias (sem limite)
    return allCategories;
  }, [transacoes, selectedMonth, selectedYear]);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();

  const transactionColumns: TableColumn[] = [
    {
      key: "date",
      label: "Pagamento",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
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
      label: "Pagamento",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span>{value}</span>,
    },
    {
      key: "value",
      label: "Valor",
      render: (value) => <span className="value expense">{value}</span>,
    },
  ];

  return (
    <div className="dashboard">
      {/* Loading state */}
      {isLoading && (
        <div className="dashboard-loading">
          <p>Carregando dados do dashboard...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="dashboard-error">
          <p>Erro ao carregar dados. Tente novamente.</p>
        </div>
      )}

      {/* Conteúdo principal */}
      {!isLoading && !isError && (
        <>
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
              showSummary={true}
              summaryCountLabel="Contas"
              valueKey="value"
              className="bills-table-orange"
            />

            {/* Visão por categoria */}
            <CategoryBudgetCard data={categoryBarsData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
