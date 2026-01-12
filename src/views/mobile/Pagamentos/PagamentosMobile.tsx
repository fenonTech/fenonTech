import React, { useState, useEffect } from "react";
import "./PagamentosMobile.css";
import {
  assinaturasService,
  type MinhasAssinaturasResponse,
} from "../../../services";

interface PagamentosMobileProps {
  onBack: () => void;
}

const PagamentosMobile: React.FC<PagamentosMobileProps> = ({ onBack }) => {
  const [assinaturasData, setAssinaturasData] =
    useState<MinhasAssinaturasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados das assinaturas da API
  useEffect(() => {
    const loadAssinaturas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await assinaturasService.getMinhasAssinaturas();
        setAssinaturasData(data);
      } catch (err: any) {
        console.error("Erro ao carregar assinaturas:", err);
        setError(err.message || "Erro ao carregar assinaturas");
      } finally {
        setLoading(false);
      }
    };

    loadAssinaturas();
  }, []);

  // Função para calcular dias restantes até o vencimento
  const calculateDaysRemaining = (prazo: string): number => {
    const today = new Date();
    const expiryDate = new Date(prazo);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="pagamentos-mobile">
      <div className="pagamentos-mobile-header">
        <button
          className="pagamentos-back-button"
          onClick={onBack}
          aria-label="Voltar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="pagamentos-mobile-title">Pagamentos</h1>
      </div>

      <div className="pagamentos-mobile-content">
        {loading ? (
          <div className="pagamentos-loading">
            <p>Carregando assinaturas...</p>
          </div>
        ) : error ? (
          <div className="pagamentos-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        ) : assinaturasData ? (
          <>
            {/* Card do Plano Atual */}
            <div className="current-plan-card">
              <h2 className="current-plan-name">
                {assinaturasData.assinatura_atual.plano_name_cakto}
              </h2>
              <div className="current-plan-info">
                <div className="plan-info-item">
                  <span className="plan-info-label">Vence Em:</span>
                  <span className="plan-info-value highlight">
                    {formatDate(assinaturasData.assinatura_atual.prazo)}
                  </span>
                </div>
                <div className="plan-info-item">
                  <span className="plan-info-label">Restam:</span>
                  <span className="plan-info-value highlight">
                    {calculateDaysRemaining(
                      assinaturasData.assinatura_atual.prazo
                    )}{" "}
                    Dias
                  </span>
                </div>
                <div className="plan-info-item">
                  <span className="plan-info-label">Status:</span>
                  <span
                    className={`plan-info-value ${
                      assinaturasData.assinatura_atual.is_cancelado
                        ? "status-canceled"
                        : "status-active"
                    }`}
                  >
                    {assinaturasData.assinatura_atual.is_cancelado
                      ? "Cancelado"
                      : "Ativo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="payment-history-section">
              <h3 className="payment-history-title">
                Histórico de Assinaturas
              </h3>

              {assinaturasData.historico.length === 0 ? (
                <div className="no-payments">
                  <p>Nenhuma assinatura encontrada no histórico</p>
                </div>
              ) : (
                <div className="payment-list">
                  {assinaturasData.historico.map((historico) => (
                    <div key={historico.id} className="payment-item">
                      <div className="payment-item-left">
                        <svg
                          className="payment-icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            stroke="#FFD700"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <div className="payment-info">
                          <span className="payment-plan-name">
                            {historico.nome_assinatura}
                          </span>
                          <span
                            className={`payment-status ${
                              historico.is_cancelado
                                ? "status-canceled"
                                : "status-active"
                            }`}
                          >
                            {historico.is_cancelado ? "Cancelado" : "Ativo"}
                          </span>
                        </div>
                      </div>
                      <div className="payment-item-right">
                        <span className="payment-date">
                          {formatDate(historico.dataAssinatura)}
                        </span>
                        <span className="payment-expiry">
                          Até: {formatDate(historico.prazo)}
                        </span>
                        {historico.dataCancelamento && (
                          <span className="payment-canceled">
                            Cancelado: {formatDate(historico.dataCancelamento)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>Nenhuma assinatura encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagamentosMobile;
