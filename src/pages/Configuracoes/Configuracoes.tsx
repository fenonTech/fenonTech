import React, { useState, useEffect } from "react";
import "./Configuracoes.css";
import { userService, type Usuario } from "../../services/api/userService";
import {
  assinaturasService,
  type MinhasAssinaturasResponse,
} from "../../services/api/assinaturasService";
import { authService } from "../../services/authService";

const Configuracoes: React.FC = () => {
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [assinaturasData, setAssinaturasData] =
    useState<MinhasAssinaturasResponse | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
    loadAssinaturas();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await userService.getMe();
      setUserData(data);
      setEditedName(data.nome);
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setError("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const loadAssinaturas = async () => {
    try {
      const data = await assinaturasService.getMinhasAssinaturas();
      setAssinaturasData(data);
    } catch (err) {
      console.error("Erro ao carregar assinaturas:", err);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;

    try {
      setIsUpdating(true);
      await userService.updateProfile({ nome: editedName });
      setUserData((prev: Usuario | null) =>
        prev ? { ...prev, nome: editedName } : null,
      );
      authService.updateUserName(editedName);
      setIsEditingName(false);
    } catch (err) {
      console.error("Erro ao atualizar nome:", err);
      setError("Erro ao atualizar nome");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userData?.nome || "");
    setIsEditingName(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível";
    try {
      const [year, month, day] = dateString.split("T")[0].split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  const calcularDiasRestantes = (dataExpiracao: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [year, month, day] = dataExpiracao.split("T")[0].split("-");
    const expiracao = new Date(Number(year), Number(month) - 1, Number(day));
    const diffTime = expiracao.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="configuracoes-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="configuracoes-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="configuracoes-container">
      <div className="configuracoes-content">
        {/* Perfil */}
        <div className="config-card">
          <h2 className="config-card-title">Perfil</h2>
          <div className="profile-section">
            <div className="profile-avatar">
              {userData?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-info">
              {isEditingName ? (
                <div className="edit-name-container">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="edit-name-input"
                    autoFocus
                    disabled={isUpdating}
                  />
                  <div className="edit-buttons">
                    <button
                      onClick={handleSaveName}
                      className="btn-save"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Salvando..." : "✓"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-cancel"
                      disabled={isUpdating}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="name-display"
                  onClick={() => setIsEditingName(true)}
                >
                  <h3>{userData?.nome}</h3>
                  <span className="edit-icon">✎</span>
                </div>
              )}
              <p className="profile-email">{userData?.email}</p>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="config-card">
          <h2 className="config-card-title">Assinatura</h2>
          {assinaturasData?.assinatura_atual ? (
            <div className="subscription-info">
              <div className="subscription-row">
                <span className="label">Plano:</span>
                <span className="value">
                  {assinaturasData.assinatura_atual.nome_assinatura}
                </span>
              </div>
              <div className="subscription-row">
                <span className="label">Status:</span>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: assinaturasData.assinatura_atual
                      .is_cancelado
                      ? "#f44336"
                      : "#4caf50",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {assinaturasData.assinatura_atual.is_cancelado
                    ? "Cancelado"
                    : "Ativo"}
                </span>
              </div>
              <div className="subscription-row">
                <span className="label">Válido até:</span>
                <span className="value">
                  {formatDate(assinaturasData.assinatura_atual.prazo)}
                </span>
              </div>
              <div className="subscription-row">
                <span className="label">Dias restantes:</span>
                <span className="value days-remaining">
                  {calcularDiasRestantes(
                    assinaturasData.assinatura_atual.prazo,
                  )}{" "}
                  dias
                </span>
              </div>
            </div>
          ) : (
            <p className="no-subscription">Nenhuma assinatura ativa</p>
          )}
        </div>

        {/* Histórico de Pagamentos */}
        {assinaturasData?.historico && assinaturasData.historico.length > 0 && (
          <div className="config-card">
            <h2 className="config-card-title">Histórico de Pagamentos</h2>
            <div className="payment-history">
              {assinaturasData.historico.map((item) => (
                <div key={item.id} className="payment-item">
                  <div className="payment-info">
                    <span className="payment-plan">{item.nome_assinatura}</span>
                    <span className="payment-date">
                      {formatDate(item.dataAssinatura)} -{" "}
                      {formatDate(item.prazo)}
                    </span>
                  </div>
                  <span
                    className="payment-status"
                    style={{ color: item.is_cancelado ? "#f44336" : "#4caf50" }}
                  >
                    {item.is_cancelado ? "Cancelado" : "Ativo"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notificações */}
        <div className="config-card">
          <h2 className="config-card-title">Notificações</h2>
          <p className="coming-soon">Em breve...</p>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
