import React, { useState, useEffect } from "react";
import "./AtualizacaoCadastralMobile.css";
import { userService, type Usuario } from "../../../services";
import { authService } from "../../../services/authService";

interface AtualizacaoCadastralMobileProps {
  onBack: () => void;
}

const AtualizacaoCadastralMobile: React.FC<AtualizacaoCadastralMobileProps> = ({
  onBack,
}) => {
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Buscar dados do usuário da API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getMe();
        setUserData(data);
        setEditedName(data.nome); // Inicializar o nome editável
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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

  return (
    <div className="atualizacao-cadastral-mobile">
      <div className="atualizacao-cadastral-header">
        <button
          className="atualizacao-back-button"
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
        <h1 className="atualizacao-cadastral-title">Atualização Cadastral</h1>
      </div>

      <div className="atualizacao-cadastral-content">
        {loading ? (
          <div className="atualizacao-loading">
            <p>Carregando dados do usuário...</p>
          </div>
        ) : error ? (
          <div className="atualizacao-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        ) : userData ? (
          <>
            {/* Profile Section */}
            <div className="atualizacao-profile-section">
              <div className="atualizacao-profile-avatar-wrapper">
                <div className="atualizacao-profile-avatar">
                  <div className="atualizacao-profile-avatar-placeholder">
                    {userData.nome.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="atualizacao-profile-info">
                <h2 className="atualizacao-profile-name">
                  {userData.nome.toUpperCase()}
                </h2>
                <p className="atualizacao-profile-subtitle">
                  EXIBIDO APENAS PARA VOCÊ
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="atualizacao-form-section">
              <div className="atualizacao-form-group">
                <label className="atualizacao-form-label">Nome</label>
                {isEditingName ? (
                  <div className="atualizacao-form-edit-container">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="atualizacao-form-input"
                      placeholder="Digite seu nome"
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
                    <div className="atualizacao-form-buttons">
                      <button
                        onClick={handleSaveName}
                        className="atualizacao-save-button"
                        disabled={isUpdating || !editedName.trim()}
                      >
                        {isUpdating ? "Salvando..." : "Salvar"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="atualizacao-cancel-button"
                        disabled={isUpdating}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="atualizacao-form-value atualizacao-form-editable"
                    onClick={() => setIsEditingName(true)}
                  >
                    {userData.nome}
                    <span className="atualizacao-edit-icon">✏️</span>
                  </div>
                )}
              </div>

              <div className="atualizacao-form-group">
                <label className="atualizacao-form-label">E-mail</label>
                <div className="atualizacao-form-value">{userData.email}</div>
              </div>

              <div className="atualizacao-form-group">
                <label className="atualizacao-form-label">Telefone</label>
                <div className="atualizacao-form-value">
                  {userData.telefone}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AtualizacaoCadastralMobile;
