import React, { useState, useEffect, useRef } from "react";
import "./Configuracoes.css";
import simboloMeuBolsoUsadoNoCardDePerfilDoUsuario from "../../assets/simboloMeuBolsoUsadoNoCardDePerfilDoUsuario.png";
import simboloMeuBolsoUtilizadoNoCardDeNotificacoes from "../../assets/simboloMeuBolsoUtilizadoNoCardDeNotificacoes.png";
import SimboloMeuBolsoUtilizadoNoCardDeBancosConectados from "../../assets/SimboloMeuBolsoUtilizadoNoCardDeBancosConectados.png";
import nubankLogo from "../../assets/nubankLogoBancoRoxaBancosConectados.png";
import itauLogo from "../../assets/itauLogoBancoLaranjaBancosConectados.png";
import picpayLogo from "../../assets/picpayLogoBancoVerdeBancosConectados.png";
import simboloMaisBancosConectados from "../../assets/simboloMaisBancosConectados.png";
import { api } from "../../config";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PlanInfo {
  nomePlano: string;
  dataVencimento: string;
  diasRestantes: number;
  status: "ativo" | "vencido" | "renovacao";
}

const Configuracoes: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
  });
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialLoadDone = useRef(false);

  // Função para formatar telefone +5511911451180 -> (11) 91145-1180
  const formatPhone = (phone: string): string => {
    if (!phone) return "";

    // Remove tudo exceto números
    const numbers = phone.replace(/\D/g, "");

    // Se tem código do país +55, remove
    const localNumbers = numbers.startsWith("55") ? numbers.slice(2) : numbers;

    // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (localNumbers.length === 11) {
      // Celular com 9 dígitos
      return `(${localNumbers.slice(0, 2)}) ${localNumbers.slice(
        2,
        7
      )}-${localNumbers.slice(7)}`;
    } else if (localNumbers.length === 10) {
      // Fixo com 8 dígitos
      return `(${localNumbers.slice(0, 2)}) ${localNumbers.slice(
        2,
        6
      )}-${localNumbers.slice(6)}`;
    }

    return phone; // Retorna original se não conseguir formatar
  };

  // Função para calcular dias restantes do plano
  const calculateDaysRemaining = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Função para formatar data de vencimento
  const formatExpiryDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Debug: monitorar mudanças no userProfile
  useEffect(() => {
    console.log("🔍 Estado userProfile atualizado:", userProfile);
  }, [userProfile]);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    // Prevenir dupla execução (React StrictMode)
    if (initialLoadDone.current) {
      return;
    }
    initialLoadDone.current = true;

    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        console.log("🔄 Carregando dados do perfil...");

        // Obter credenciais do localStorage
        const telefone = localStorage.getItem("fenontech-telefone");
        const codigoTemp = localStorage.getItem("fenontech-codigoTemp");

        if (!telefone || !codigoTemp) {
          console.error("❌ Credenciais não encontradas");
          return;
        }

        const payload = {
          telefone,
          codigoTemp,
          dadosRequisicao: {
            tela: "configuracao",
            tipoMetodo: "get",
          },
        };

        const response = await api.post("", payload);
        console.log("✅ Dados do perfil recebidos:", response.data);

        // A API retorna um ARRAY com um objeto dentro
        const apiData = response.data as any;

        // Pegar o primeiro item do array
        const userData = Array.isArray(apiData) ? apiData[0] : apiData;

        console.log("📋 Dados do usuário:", userData);

        if (userData) {
          const novosPerfil = {
            nomeCompleto: userData.usuarioNome || "",
            email: userData.email || "",
            telefone: userData.telefone || "",
          };
          console.log("🔄 Atualizando estado com:", novosPerfil);
          setUserProfile(novosPerfil);

          // Processar informações do plano usando o campo "prazo"
          if (userData.prazo) {
            const daysRemaining = calculateDaysRemaining(userData.prazo);
            const planInfo: PlanInfo = {
              nomePlano: userData.nomePLano || "Plano Básico",
              dataVencimento: userData.prazo,
              diasRestantes: daysRemaining,
              status: daysRemaining > 0 ? "ativo" : "vencido",
            };
            setPlanInfo(planInfo);
            console.log("📋 Informações do plano carregadas:", planInfo);
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "transacoes1",
      label: "E-mail de transações",
      description: "Receba alertas de novas transações",
      enabled: true,
    },
    {
      id: "transacoes2",
      label: "E-mail de transações",
      description: "Receba alertas de novas transações",
      enabled: true,
    },
    {
      id: "transacoes3",
      label: "E-mail de transações",
      description: "Receba alertas de novas transações",
      enabled: false,
    },
    {
      id: "transacoes4",
      label: "E-mail de transações",
      description: "Receba alertas de novas transações",
      enabled: true,
    },
  ]);

  const bancos = [
    {
      id: "nubank",
      name: "Nubank",
      logo: nubankLogo,
      color: "#8A05BE",
      bgColor: "transparent",
    },
    {
      id: "itau",
      name: "Itaú",
      logo: itauLogo,
      color: "#EC7000",
      bgColor: "transparent",
    },
    {
      id: "pix",
      name: "PIX",
      logo: picpayLogo,
      color: "#32BCAD",
      bgColor: "transparent",
    },
  ];

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      console.log("💾 Salvando alterações...", userProfile);

      // Obter credenciais do localStorage
      const telefone = localStorage.getItem("fenontech-telefone");
      const codigoTemp = localStorage.getItem("fenontech-codigoTemp");

      if (!telefone || !codigoTemp) {
        console.error("❌ Credenciais não encontradas");
        alert("Erro: Credenciais não encontradas. Faça login novamente.");
        return;
      }

      const payload = {
        telefone,
        codigoTemp,
        dadosRequisicao: {
          tela: "configuracao",
          tipoMetodo: "update",
          usuarioNome: userProfile.nomeCompleto,
          usuarioEmail: userProfile.email,
        },
      };

      console.log("📤 Enviando atualização:", payload);

      const response = await api.post("", payload);
      console.log("✅ Perfil atualizado com sucesso:", response.data);

      // Atualizar nome no localStorage se foi alterado
      localStorage.setItem("fenontech-userName", userProfile.nomeCompleto);
    } catch (error: any) {
      console.error("❌ Erro ao salvar perfil:", error);
      alert(
        `Erro ao salvar alterações: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="configuracoes-page">
      <div className="configuracoes-content">
        {/* Perfil do Usuário */}
        <div className="config-card">
          <div className="card-header">
            <img
              src={simboloMeuBolsoUsadoNoCardDePerfilDoUsuario}
              alt="Perfil"
              className="card-icon"
            />
            <h3>Perfil do Usuário</h3>
          </div>

          <div className="profile-form">
            {isLoading ? (
              <p style={{ textAlign: "center", color: "#ccc" }}>
                Carregando...
              </p>
            ) : (
              <>
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={userProfile.nomeCompleto}
                    onChange={(e) =>
                      handleProfileChange("nomeCompleto", e.target.value)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) =>
                      handleProfileChange("email", e.target.value)
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formatPhone(userProfile.telefone)}
                    disabled
                    className="form-input disabled"
                    title="O telefone não pode ser alterado"
                  />
                </div>

                <button
                  className="save-button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Notificações */}
        <div className="config-card">
          <div className="card-header">
            <img
              src={simboloMeuBolsoUtilizadoNoCardDeNotificacoes}
              alt="Notificações"
              className="card-icon"
            />
            <h3>Notificações</h3>
          </div>

          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-info">
                  <span className="notification-label">
                    {notification.label}
                  </span>
                  <span className="notification-description">
                    {notification.description}
                  </span>
                </div>
                <div
                  className={`toggle-switch ${
                    notification.enabled ? "enabled" : "disabled"
                  }`}
                  onClick={() => handleNotificationToggle(notification.id)}
                >
                  <div className="toggle-circle"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bancos Conectados */}
        <div className="config-card bancos-card" style={{ display: "none" }}>
          <div className="card-header">
            <img
              src={SimboloMeuBolsoUtilizadoNoCardDeBancosConectados}
              alt="Bancos"
              className="card-icon"
            />
            <h3>Bancos conectados</h3>
          </div>

          <div className="bancos-grid">
            {bancos.map((banco) => (
              <div
                key={banco.id}
                className="banco-item"
                style={{ borderColor: banco.color }}
              >
                <div
                  className="banco-logo"
                  style={{ backgroundColor: banco.bgColor }}
                >
                  <img
                    src={banco.logo}
                    alt={banco.name}
                    className="banco-image"
                  />
                </div>
              </div>
            ))}
            <div className="banco-item add-banco">
              <div className="banco-logo add-logo">
                <img
                  src={simboloMaisBancosConectados}
                  alt="Adicionar banco"
                  className="plus-icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Minha Assinatura */}
        {planInfo && (
          <div className="config-card">
            <div className="card-header">
              <div className="card-icon plan-icon">💳</div>
              <h3>Minha Assinatura</h3>
            </div>

            <div className="plan-info">
              <div className="plan-details">
                <div className="plan-item">
                  <span className="plan-label">Plano:</span>
                  <span className="plan-value">{planInfo.nomePlano}</span>
                </div>

                <div className="plan-item">
                  <span className="plan-label">Vence em:</span>
                  <span className="plan-value">
                    {formatExpiryDate(planInfo.dataVencimento)}
                  </span>
                </div>

                <div className="plan-item">
                  <span className="plan-label">Dias restantes:</span>
                  <span
                    className={`plan-value days-remaining ${
                      planInfo.diasRestantes <= 7
                        ? "warning"
                        : planInfo.diasRestantes <= 0
                        ? "expired"
                        : "active"
                    }`}
                  >
                    {planInfo.diasRestantes > 0
                      ? `${planInfo.diasRestantes} dias`
                      : "Expirado"}
                  </span>
                </div>
              </div>

              {planInfo.diasRestantes <= 7 && (
                <div className="plan-warning">
                  <p>⚠️ Sua assinatura está próxima do vencimento!</p>
                  <button
                    className="renew-button"
                    onClick={() =>
                      window.open(
                        "https://www.fenontech.com.br/landingpage/planos",
                        "_blank"
                      )
                    }
                  >
                    Renovar Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
