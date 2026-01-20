import React, { useState, useEffect } from "react";
import "./Configuracoes.css";
import { userService, assinaturasService } from "../../services";
import type { Usuario, MinhasAssinaturasResponse } from "../../services";
import { authService } from "../../services/authService";

const Configuracoes: React.FC = () => {
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [assinaturasData, setAssinaturasData] =
    useState<MinhasAssinaturasResponse | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funções utilitárias
  const formatDate = (dateString: string): string => {
    try {
      const [year, month, day] = dateString.split("T")[0].split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const calculateDaysRemaining = (prazo: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [year, month, day] = prazo.split("T")[0].split("-");
    const expiryDate = new Date(Number(year), Number(month) - 1, Number(day));
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Carregar dados do usuário e assinaturas
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar dados do usuário
        const userResponse = await userService.getMe();
        setUserData(userResponse);
        setEditedName(userResponse.nome);

        // Carregar dados das assinaturas
        try {
          const assinaturasResponse =
            await assinaturasService.getMinhasAssinaturas();
          setAssinaturasData(assinaturasResponse);
        } catch (assinaturasError) {
          console.warn("Assinaturas não disponíveis:", assinaturasError);
          // Não definir como erro crítico, apenas assinaturas não estão disponíveis
        }
      } catch (err: any) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Função para salvar o nome editado
  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === userData?.nome) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Chamar a API de atualização de perfil
      const updatedUser = await userService.updateProfile({
        nome: editedName.trim(),
      });

      // Atualizar os dados locais
      setUserData(updatedUser);

      // Atualizar o localStorage para que outros componentes sejam atualizados
      authService.updateUserName(updatedUser.nome);

      setIsEditingName(false);

      console.log("✅ Nome atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar nome:", err);
      setError(err.message || "Erro ao atualizar nome");
      // Reverter para o nome original em caso de erro
      setEditedName(userData?.nome || "");
    } finally {
      setIsUpdating(false);
    }
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditedName(userData?.nome || "");
    setIsEditingName(false);
  };

  if (loading) {
    return (
      <div className="configuracoes-page">
        <div className="loading-container">
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="configuracoes-page">
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracoes-page">
      {/* Header */}
      <div className="page-header">
        <h1>Configurações</h1>
        <p>Gerencie suas preferências e dados da conta</p>
      </div>

      <div className="configuracoes-content">
        {/* Profile Section */}
        {userData && (
          <div className="config-profile-card">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {userData.nome.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-info">
              <h2>{userData.nome}</h2>
              <p>Dados da sua conta</p>
            </div>
          </div>
        )}

        {/* Perfil do Usuário */}
        {userData && (
          <div className="config-card">
            <div className="card-header">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                Dados Pessoais
              </h3>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label>Nome</label>
                {isEditingName ? (
                  <div className="edit-name-container">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="form-input"
                      disabled={isUpdating}
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSaveName();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={handleSaveName}
                        className="save-btn"
                        disabled={isUpdating || !editedName.trim()}
                      >
                        {isUpdating ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        disabled={isUpdating}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="form-display-value"
                    onClick={() => setIsEditingName(true)}
                  >
                    {userData.nome}
                    <span className="edit-icon">✏️</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <div className="form-display-value readonly">
                  {userData.email}
                </div>
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <div className="form-display-value readonly">
                  {userData.telefone}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assinatura */}
        {assinaturasData && (
          <div className="config-card">
            <div className="card-header">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                </svg>
                Minha Assinatura
              </h3>
            </div>

            <div className="subscription-info">
              <div className="subscription-current">
                <div className="subscription-name">
                  {assinaturasData.assinatura_atual.nome_assinatura}
                </div>
                <div className="subscription-details">
                  <div className="detail-item">
                    <span className="detail-label">Vence em:</span>
                    <span className="detail-value">
                      {formatDate(assinaturasData.assinatura_atual.prazo)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Restam:</span>
                    <span
                      className={`detail-value ${
                        calculateDaysRemaining(
                          assinaturasData.assinatura_atual.prazo,
                        ) <= 7
                          ? "warning"
                          : "active"
                      }`}
                    >
                      {calculateDaysRemaining(
                        assinaturasData.assinatura_atual.prazo,
                      )}{" "}
                      dias
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`detail-value ${
                        assinaturasData.assinatura_atual.is_cancelado
                          ? "canceled"
                          : "active"
                      }`}
                    >
                      {assinaturasData.assinatura_atual.is_cancelado
                        ? "Cancelado"
                        : "Ativo"}
                    </span>
                  </div>
                </div>
              </div>

              {calculateDaysRemaining(assinaturasData.assinatura_atual.prazo) <=
                7 && (
                <div className="subscription-warning">
                  ⚠️ Sua assinatura está próxima do vencimento!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notificações */}
        <div className="config-card">
          <div className="card-header">
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Notificações
            </h3>
          </div>

          <div className="notifications-placeholder">
            <p>Configure suas preferências de notificação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
