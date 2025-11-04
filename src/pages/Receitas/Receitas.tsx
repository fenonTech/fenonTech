import React, { useState } from "react";
import "./Receitas.css";
import { UnifiedFinancialCard } from "../../components/Cards";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import MonthYearSelector from "../../components/MonthYearSelector";
import { IncomeModal } from "../../components/Modals";

import { useTransaction } from "../../contexts/TransactionContext";
import { useBalanceVisibility } from "../../hooks/useBalanceVisibility";
import useReceitasNavigation from "../../hooks/useReceitasNavigation";
import sacoDeDinheiro from "../../assets/sacoDeDinheiro.png";
import simboloMeuBolsoContasAReceberCard from "../../assets/simboloMeuBolsoContasAReceberCard.png";

const Receitas: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();
  const { activeCard, switchCard } = useReceitasNavigation("receita");
  const {
    incomes,
    receivables,
    addIncome,
    updateIncome,
    deleteIncome,
    addReceivable,
    updateReceivable,
    deleteReceivable,
  } = useTransaction();

  // Função para adicionar nova receita/conta a receber
  const handleAddReceita = () => {
    setIsEditMode(false);
    setEditingIncome(null);
    setIsIncomeModalOpen(true);
  };

  // Função para editar receita
  const handleEditIncome = (income: any) => {
    // Usar os dados originais se disponíveis
    const incomeToEdit = income.originalData || income;
    setEditingIncome(incomeToEdit);
    setIsEditMode(true);
    setIsIncomeModalOpen(true);
  };

  // Função para excluir receita
  const handleDeleteIncome = (income: any) => {
    // Usar os dados originais se disponíveis
    const incomeToDelete = income.originalData || income;
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a receita "${
        incomeToDelete.category
      }" no valor de ${incomeToDelete.formattedValue || incomeToDelete.value}?`
    );

    if (confirmDelete) {
      // Verificar se é receita ou conta a receber pelo ID ou data
      const incomeDate = new Date(
        incomeToDelete.date || incomeToDelete.dueDate
      );
      const today = new Date();
      const isReceivable = incomeDate > today;

      if (isReceivable) {
        deleteReceivable(incomeToDelete.id);
      } else {
        deleteIncome(incomeToDelete.id);
      }
    }
  };

  // Função para fechar o modal
  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setIsEditMode(false);
    setEditingIncome(null);
  };

  // Função para salvar receita
  const handleSaveIncome = (incomeData: any) => {
    const amount =
      typeof incomeData.value === "string"
        ? parseFloat(incomeData.value.replace(/[^\d,]/g, "").replace(",", "."))
        : incomeData.value;
    const formattedValue = `R$ ${amount.toFixed(2).replace(".", ",")}`;

    // Corrigir problema da data - usar a data local sem conversão de timezone
    const [year, month, day] = incomeData.date.split("-").map(Number);
    const incomeDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparação correta
    const isContaAReceber = incomeDate > today;

    if (isEditMode && editingIncome) {
      // Modo edição - verificar se mudou de tipo (income <-> receivable)
      // Detectar tipo original pela data do item
      const originalDate = editingIncome.date || editingIncome.dueDate;
      const [origYear, origMonth, origDay] = originalDate
        .split("-")
        .map(Number);
      const originalItemDate = new Date(origYear, origMonth - 1, origDay);
      const todayForComparison = new Date();
      todayForComparison.setHours(0, 0, 0, 0);
      const wasReceivable = originalItemDate > todayForComparison;
      const changedType = wasReceivable !== isContaAReceber;

      const baseData = {
        id: editingIncome.id, // Usar o ID existente
        date: incomeData.date,
        description: incomeData.category,
        category: incomeData.category,
        value: amount,
        formattedValue,
        createdAt: editingIncome.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (changedType) {
        // Mudou de tipo: deletar do antigo e adicionar no novo
        if (wasReceivable) {
          deleteReceivable(editingIncome.id);
          const income = {
            ...baseData,
            type: "income" as const,
          };
          addIncome(income);
        } else {
          deleteIncome(editingIncome.id);
          const receivable = {
            ...baseData,
            dueDate: incomeData.date,
            status: "pending" as const,
            type: "receivable" as const,
          };
          addReceivable(receivable);
        }
      } else {
        // Mantém o mesmo tipo: apenas atualizar
        if (isContaAReceber) {
          const receivable = {
            ...baseData,
            dueDate: incomeData.date,
            status: editingIncome.status || ("pending" as const),
            type: "receivable" as const,
          };
          updateReceivable(receivable);
        } else {
          const income = {
            ...baseData,
            type: "income" as const,
          };
          updateIncome(income);
        }
      }
    } else {
      // Modo criação - adicionar nova receita
      const baseData = {
        date: incomeData.date,
        description: incomeData.category,
        category: incomeData.category,
        value: amount,
        formattedValue,
      };

      if (isContaAReceber) {
        // Adicionar conta a receber
        const receivable = {
          ...baseData,
          dueDate: incomeData.date,
          status: "pending" as const,
          type: "receivable" as const,
        };
        addReceivable(receivable);
      } else {
        const income = {
          ...baseData,
          type: "income" as const,
        };
        addIncome(income);
      }
    }

    // Fechar o modal após salvar
    handleCloseIncomeModal();
  };

  // Converter dados do contexto para formato das tabelas
  const formatIncomeData = (incomes: any[]) => {
    return incomes.map((income) => {
      // Parse correto da data para evitar problema de timezone
      const [year, month, day] = income.date.split("-").map(Number);
      const incomeDate = new Date(year, month - 1, day);

      return {
        id: income.id,
        date: incomeDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        category: income.category,
        type: income.description || "Variável",
        value: income.formattedValue,
        // Manter dados originais para edição
        originalDate: income.date,
        originalValue: income.value,
        originalData: income,
      };
    });
  };

  const formatReceivableData = (receivables: any[]) => {
    return receivables.map((receivable) => {
      // Parse correto da data para evitar problema de timezone
      const [year, month, day] = receivable.dueDate.split("-").map(Number);
      const dueDate = new Date(year, month - 1, day);

      return {
        id: receivable.id,
        date: dueDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        category: receivable.category,
        type: receivable.status === "pending" ? "Pendente" : "Pago",
        value: receivable.formattedValue,
        // Manter dados originais para edição
        originalDate: receivable.dueDate,
        originalValue: receivable.value,
        originalData: receivable,
      };
    });
  };

  // Calcular totais
  const totalIncomes = incomes.reduce((sum, income) => sum + income.value, 0);
  const totalReceivables = receivables.reduce(
    (sum, receivable) => sum + receivable.value,
    0
  );

  // Configuração das opções do card mobile
  const mobileCardOptions = [
    {
      key: "receita",
      label: "Receitas",
      title: "Receitas do mês",
      value: formatValue(`R$ ${totalIncomes.toFixed(2).replace(".", ",")}`),
      icon: sacoDeDinheiro,
      type: "positive" as const,
    },
    {
      key: "contas",
      label: "A Receber",
      title: "Valores a Receber",
      value: formatValue(`R$ ${totalReceivables.toFixed(2).replace(".", ",")}`),
      icon: simboloMeuBolsoContasAReceberCard,
      type: "positive" as const,
    },
  ];

  // Dados dinâmicos das tabelas
  const receitasData = formatIncomeData(incomes);
  const contasAReceberData = formatReceivableData(receivables);

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

  // Definir colunas para a tabela de Valores a Receber
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

  return (
    <div className="receitas-page">
      {/* Filtro de Mês e Ano */}
      <div className="receitas-header">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          className="header-style"
        />
      </div>

      {/* Cards principais - DESKTOP */}
      <div className="receitas-cards">
        <UnifiedFinancialCard
          title="Receita Atual"
          value={formatValue(`R$ ${totalIncomes.toFixed(2).replace(".", ",")}`)}
          icon={sacoDeDinheiro}
          type="positive"
          className="receita-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
        <UnifiedFinancialCard
          title="Valores a Receber"
          value={formatValue(
            `R$ ${totalReceivables.toFixed(2).replace(".", ",")}`
          )}
          icon={simboloMeuBolsoContasAReceberCard}
          type="neutral"
          className="receita-card-large"
          showToggle={true}
          isBalanceVisible={isBalanceVisible}
          onToggleVisibility={toggleBalanceVisibility}
        />
      </div>

      {/* Sistema de Navegação - APENAS MOBILE */}
      <MobileFinancialCard
        navigationOptions={mobileCardOptions}
        activeCard={activeCard}
        onCardSwitch={(cardKey) => switchCard(cardKey as any)}
        className="receitas-mobile-card"
      />

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
              showActions={true}
              onEdit={handleEditIncome}
              onDelete={handleDeleteIncome}
            />
          ) : (
            <TransactionTable
              title="Valores a Receber"
              columns={contasAReceberColumns}
              data={contasAReceberData}
              className="receitas-table-card"
              showSummary={true}
              summaryCountLabel="Contas"
              valueKey="value"
              showActions={true}
              onEdit={handleEditIncome}
              onDelete={handleDeleteIncome}
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
            showActions={true}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />

          {/* Valores a Receber */}
          <TransactionTable
            title="Valores a Receber"
            columns={contasAReceberColumns}
            data={contasAReceberData}
            className="receitas-table-card"
            showSummary={true}
            summaryCountLabel="Contas"
            valueKey="value"
            showActions={true}
            onEdit={handleEditIncome}
            onDelete={handleDeleteIncome}
          />
        </div>

        {/* Gráfico de Receitas Mensais */}
        <div className="receitas-card chart-card">
          <h3 className="card-header">Receitas por Mês</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {monthlyData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{
                        height: `${(item.value / maxValue) * 100}%`,
                        opacity: item.value === 0 ? 0.3 : 1,
                      }}
                      title={`${item.month}: R$ ${item.value
                        .toFixed(2)
                        .replace(".", ",")}`}
                    >
                      <span className="bar-tooltip">
                        R$ {item.value.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botão Flutuante de Adicionar */}
      <button
        className="floating-add-button"
        onClick={handleAddReceita}
        aria-label="Adicionar nova receita"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Modal de Receitas */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={handleCloseIncomeModal}
        onSave={handleSaveIncome}
        onUpdate={handleSaveIncome}
        onDelete={
          isEditMode
            ? (id: string) => {
                const incomeDate = new Date(editingIncome?.date);
                const today = new Date();
                const isReceivable = incomeDate > today;

                if (isReceivable) {
                  deleteReceivable(id);
                } else {
                  deleteIncome(id);
                }
                handleCloseIncomeModal();
              }
            : undefined
        }
        editingIncome={editingIncome}
        mode={isEditMode ? "edit" : "add"}
      />
    </div>
  );
};

export default Receitas;
