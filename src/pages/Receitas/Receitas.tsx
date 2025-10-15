import React, { useState } from "react";
import "./Receitas.css";
import FinancialCard from "../../components/Cards/FinancialCard";
import MobileFinancialCard from "../../components/MobileFinancialCard";
import TransactionTable from "../../components/TransactionTable";
import type { TableColumn } from "../../components/TransactionTable";
import MonthYearSelector from "../../components/MonthYearSelector";
import { IncomeModal } from "../../components/Modals";
import type { IncomeData } from "../../components/Modals";
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
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isBalanceVisible, toggleBalanceVisibility, formatValue } =
    useBalanceVisibility();
  const { activeCard, switchCard } = useReceitasNavigation("receita");

  // Função para adicionar nova receita/conta a receber
  const handleAddReceita = () => {
    setIsEditMode(false);
    setEditingIncome(null);
    setIsIncomeModalOpen(true);
  };

  // Função para editar receita
  const handleEditIncome = (income: any) => {
    const incomeData: IncomeData = {
      category: income.category,
      value: income.value,
      date: income.date,
    };
    setEditingIncome(incomeData);
    setIsEditMode(true);
    setIsIncomeModalOpen(true);
  };

  // Função para excluir receita
  const handleDeleteIncome = (income: any, index: number) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a receita "${income.category}" no valor de ${income.value}?`
    );

    if (confirmDelete) {
      console.log("Excluindo receita:", income, "índice:", index);
      // Aqui você implementaria a lógica para excluir do backend/estado
      alert("Receita excluída com sucesso!");
    }
  };

  // Função para fechar o modal
  const handleCloseIncomeModal = () => {
    setIsIncomeModalOpen(false);
    setIsEditMode(false);
    setEditingIncome(null);
  };

  // Função para salvar receita
  const handleSaveIncome = (incomeData: IncomeData) => {
    console.log("Nova receita criada:", incomeData);

    // Aqui você pode implementar a lógica para:
    // 1. Enviar os dados para o backend/API
    // 2. Atualizar o estado local
    // 3. Mostrar notificação de sucesso

    // Exemplo de lógica para determinar se é receita ou conta a receber:
    const incomeDate = new Date(incomeData.date);
    const today = new Date();
    const isContaAReceber = incomeDate > today;

    console.log(
      isContaAReceber
        ? "Conta a receber adicionada para o futuro"
        : "Receita atual registrada"
    );

    // Fechar o modal após salvar
    setIsIncomeModalOpen(false);
  };

  // Configuração das opções do card mobile
  const mobileCardOptions = [
    {
      key: "receita",
      label: "Receitas",
      title: "Receitas do mês",
      value: "R$ 2.850,00",
      icon: sacoDeDinheiro,
      type: "positive" as const,
    },
    {
      key: "contas",
      label: "A Receber",
      title: "Contas a receber",
      value: "R$ 1.120,00",
      icon: simboloMeuBolsoContasAReceberCard,
      type: "positive" as const,
    },
  ];

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
              title="Contas a Receber"
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

          {/* Contas a Receber */}
          <TransactionTable
            title="Contas a Receber"
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
        editData={editingIncome || undefined}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Receitas;
