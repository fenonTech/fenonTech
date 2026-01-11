import React from "react";
import "./FloatingActionButton.css";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: "plus" | "edit";
  color?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = "plus",
  color = "primary",
  size = "medium",
  className = "",
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "plus":
        return (
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
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "edit":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`floating-action-button fab-${color} fab-${size} ${className}`}
      onClick={onClick}
      aria-label="Adicionar transação"
    >
      {renderIcon()}
    </button>
  );
};

export default FloatingActionButton;
