import React, { useState, useEffect, useRef } from "react";
import "./FinancialCardMobile.css";
import receitaIcon from "/src/assets/receita.png";
import despesaIcon from "/src/assets/despesa.png";
import calendario from "/src/assets/calendario.png";

interface FinancialCardMobileProps {
  receitas: number;
  despesas: number;
  contasPagar: number;
  contasReceber: number;
  isBalanceVisible: boolean;
  onToggleVisibility: () => void;
  mesAno?: string;
  mode?: "dashboard" | "receitas" | "despesas" | "inicio";
  onNavigate?: (screen: "inicio" | "receitas" | "despesas") => void;
}

type TabType = "saldo" | "receitas" | "despesas";

const FinancialCardMobile: React.FC<FinancialCardMobileProps> = ({
  receitas,
  despesas,
  contasPagar,
  contasReceber,
  isBalanceVisible,
  onToggleVisibility,
  mode = "dashboard",
  onNavigate,
}) => {
  const getInitialTab = (): TabType => {
    if (mode === "receitas") return "receitas";
    if (mode === "despesas") return "despesas";
    return "saldo";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );
  const [prevMode, setPrevMode] = useState(mode);
  const [selectedCompetencia, setSelectedCompetencia] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
  const [isCompetenciaOpen, setIsCompetenciaOpen] = useState(false);
  const [selectorYear, setSelectorYear] = useState(new Date().getFullYear());
  const competenciaRef = useRef<HTMLDivElement>(null);

  const months = [
    { num: "01", name: "Jan" },
    { num: "02", name: "Fev" },
    { num: "03", name: "Mar" },
    { num: "04", name: "Abr" },
    { num: "05", name: "Mai" },
    { num: "06", name: "Jun" },
    { num: "07", name: "Jul" },
    { num: "08", name: "Ago" },
    { num: "09", name: "Set" },
    { num: "10", name: "Out" },
    { num: "11", name: "Nov" },
    { num: "12", name: "Dez" },
  ];

  const handleCompetenciaSelect = (month: string, year: number) => {
    setSelectedCompetencia(`${year}-${month}`);
    setIsCompetenciaOpen(false);
    console.log("Competência selecionada:", `${year}-${month}`);
  };

  const formatCompetenciaDisplay = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    const monthName = months.find((m) => m.num === month)?.name || "";
    return `${monthName}/${year}`;
  };

  const getModeOrder = (currentMode: string): number => {
    switch (currentMode) {
      case "dashboard":
        return 0;
      case "inicio":
        return 0;
      case "receitas":
        return 1;
      case "despesas":
        return 2;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        competenciaRef.current &&
        !competenciaRef.current.contains(event.target as Node)
      ) {
        setIsCompetenciaOpen(false);
      }
    };

    if (isCompetenciaOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCompetenciaOpen]);

  useEffect(() => {
    if (mode !== prevMode) {
      const currentOrder = getModeOrder(prevMode);
      const newOrder = getModeOrder(mode);

      setSlideDirection(newOrder > currentOrder ? "right" : "left");
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevMode(mode);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mode, prevMode]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const saldo = receitas - despesas;

  const getMainValue = () => {
    if (mode === "receitas") {
      return receitas;
    } else if (mode === "despesas") {
      return despesas;
    } else {
      switch (activeTab) {
        case "saldo":
          return saldo;
        case "receitas":
          return receitas;
        case "despesas":
          return despesas;
        default:
          return saldo;
      }
    }
  };

  return (
    <div
      className={`financial-card-mobile ${
        isAnimating ? `slide-${slideDirection}` : ""
      }`}
    >
      {/* Tabs */}
      <div className="financial-card-mobile-tabs">
        <div className="financial-card-mobile-tabs-left">
          <button
            className={`financial-card-mobile-tab ${
              (mode === "dashboard" && activeTab === "saldo") ||
              mode === "inicio"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveTab("saldo");
              if (onNavigate) onNavigate("inicio");
            }}
          >
            Saldo
          </button>
          <button
            className={`financial-card-mobile-tab ${
              activeTab === "receitas" || mode === "receitas" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("receitas");
              if (onNavigate) onNavigate("receitas");
            }}
          >
            RECEITAS
          </button>
          <button
            className={`financial-card-mobile-tab ${
              activeTab === "despesas" || mode === "despesas" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("despesas");
              if (onNavigate) onNavigate("despesas");
            }}
          >
            DESPESAS
          </button>
        </div>
        <div className="financial-card-mobile-date">
          <div className="competencia-wrapper" ref={competenciaRef}>
            <button
              className="competencia-button"
              onClick={() => setIsCompetenciaOpen(!isCompetenciaOpen)}
              aria-label="Selecionar competência"
            >
              <span>{formatCompetenciaDisplay(selectedCompetencia)}</span>
              <img
                src={calendario}
                alt="Calendário"
                className="competencia-icon"
              />
            </button>
            {isCompetenciaOpen && (
              <div className="competencia-dropdown">
                <div className="competencia-header">
                  <button
                    className="competencia-nav-btn"
                    onClick={() => setSelectorYear(selectorYear - 1)}
                    aria-label="Ano anterior"
                  >
                    ‹
                  </button>
                  <span className="competencia-year">{selectorYear}</span>
                  <button
                    className="competencia-nav-btn"
                    onClick={() => setSelectorYear(selectorYear + 1)}
                    aria-label="Próximo ano"
                  >
                    ›
                  </button>
                </div>
                <div className="competencia-months">
                  {months.map((month) => {
                    const isSelected =
                      selectedCompetencia === `${selectorYear}-${month.num}`;
                    return (
                      <button
                        key={month.num}
                        className={`competencia-month ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleCompetenciaSelect(month.num, selectorYear)
                        }
                      >
                        {month.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`financial-card-mobile-content ${
          mode === "receitas"
            ? "receitas-active"
            : mode === "despesas"
            ? "despesas-active"
            : `${activeTab}-active`
        }`}
      >
        {/* Main Value */}
        <div className="financial-card-mobile-main-value">
          <h2 className="financial-card-mobile-value">
            {isBalanceVisible ? formatCurrency(getMainValue()) : "R$ •••••"}
          </h2>
          <button
            className="financial-card-mobile-visibility-btn"
            onClick={onToggleVisibility}
            aria-label="Alternar visibilidade"
          >
            {isBalanceVisible ? (
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="#C39703"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="#C39703"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                  stroke="#C39703"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Contas a Receber */}
        {mode !== "despesas" && (
          <div
            className="financial-card-mobile-item"
            onClick={() => {
              if (onNavigate && mode === "dashboard") {
                onNavigate("receitas");
              }
            }}
            style={{ cursor: mode === "dashboard" ? "pointer" : "default" }}
          >
            <div className="financial-card-mobile-item-icon">
              <img
                src={receitaIcon}
                alt="Contas a Receber"
                className="financial-card-mobile-item-icon-img"
              />
            </div>
            <div className="financial-card-mobile-item-label">
              Contas a Receber
            </div>
            <div className="financial-card-mobile-item-value">
              {isBalanceVisible ? formatCurrency(contasReceber) : "R$ •••••"}
            </div>
          </div>
        )}

        {/* Contas a Pagar */}
        {mode !== "receitas" && (
          <div
            className="financial-card-mobile-item"
            onClick={() => {
              if (onNavigate && mode === "dashboard") {
                onNavigate("despesas");
              }
            }}
            style={{ cursor: mode === "dashboard" ? "pointer" : "default" }}
          >
            <div className="financial-card-mobile-item-icon">
              <img
                src={despesaIcon}
                alt="Contas a Pagar"
                className="financial-card-mobile-item-icon-img"
              />
            </div>
            <div className="financial-card-mobile-item-label">
              Contas a Pagar
            </div>
            <div className="financial-card-mobile-item-value">
              {isBalanceVisible ? formatCurrency(contasPagar) : "R$ •••••"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialCardMobile;
