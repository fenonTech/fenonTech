import React from 'react';
import './Receitas.css';
import FinancialCard from '../../components/Cards/FinancialCard';
import sacoDeDinheiro from '../../assets/sacoDeDinheiro.png';
import simboloMeuBolsoContasAReceberCard from '../../assets/simboloMeuBolsoContasAReceberCard.png';

interface ReceitaEntry {
  date: string;
  category: string;
  type: string;
  value: string;
}

const Receitas: React.FC = () => {
  const receitasData: ReceitaEntry[] = [
    { date: '06/10', category: 'Salário', type: 'Fixa', value: 'R$ 5.000,00' },
    { date: '10/10', category: 'Freelancer', type: 'Variável', value: 'R$ 550,00' },
  ];

  // Dados para o gráfico de barras (simulando os valores mensais)
  const monthlyData = [
    { month: 'Jan', value: 85 },
    { month: 'Fev', value: 75 },
    { month: 'Mar', value: 95 },
    { month: 'Abr', value: 80 },
    { month: 'Mai', value: 85 },
    { month: 'Jun', value: 100 },
    { month: 'Jul', value: 90 },
    { month: 'Ago', value: 95 },
    { month: 'Set', value: 85 },
    { month: 'Out', value: 100 },
    { month: 'Nov', value: 0 },
    { month: 'Dez', value: 0 },
  ];

  const maxValue = Math.max(...monthlyData.map(item => item.value));

  return (
    <div className="receitas-page">
      <div className="page-header">
        <h1>Receita</h1>
        <p>Controle os valores que entram em sua conta</p>
      </div>

      {/* Cards principais */}
      <div className="receitas-cards">
        <FinancialCard
          title="Receita do mês"
          value="R$ 1.250,37"
          icon={sacoDeDinheiro}
          type="positive"
          className="receita-card-large"
        />
        <FinancialCard
          title="Contas a receber"
          value="R$ 600,00"
          icon={simboloMeuBolsoContasAReceberCard}
          type="neutral"
          className="receita-card-large"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="receitas-content">
        {/* Últimas Entradas */}
        <div className="receitas-card">
          <h3 className="card-header">Últimas Entradas</h3>
          <div className="entradas-summary">
            <div className="summary-item">
              <span className="summary-label">Data</span>
              <span className="summary-label">Categoria</span>
              <span className="summary-label">Tipo</span>
              <span className="summary-label">Valor</span>
            </div>
            {receitasData.map((entry, index) => (
              <div key={index} className="summary-item">
                <span className="summary-date">{entry.date}</span>
                <span className="summary-category">{entry.category}</span>
                <span className={`summary-type ${entry.type.toLowerCase()}`}>
                  {entry.type}
                </span>
                <span className="summary-value income">{entry.value}</span>
              </div>
            ))}
            <div className="summary-footer">
              <span className="entries-count">Entradas: 2</span>
              <span className="entries-total">Total: R$ 3.550,00</span>
            </div>
          </div>
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
                      opacity: item.value === 0 ? 0.3 : 1
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