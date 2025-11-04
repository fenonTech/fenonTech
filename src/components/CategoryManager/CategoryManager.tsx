import React, { useState } from "react";
import "./CategoryManager.css";

interface CustomCategory {
  name: string;
  icon: string;
  type: "expense" | "income";
}

interface CategoryManagerProps {
  expenseCategories: Array<{ name: string; icon: string }>;
  incomeCategories: Array<{ name: string; icon: string }>;
  customExpenseCategoryNames: string[];
  customIncomeCategoryNames: string[];
  onAddCategory: (category: CustomCategory) => void;
  onDeleteCategory: (name: string, type: "expense" | "income") => void;
  hasPlannedBudgets: (
    categoryName: string,
    type: "expense" | "income"
  ) => boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  expenseCategories,
  incomeCategories,
  customExpenseCategoryNames,
  customIncomeCategoryNames,
  onAddCategory,
  onDeleteCategory,
  hasPlannedBudgets,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    name: string;
    type: "expense" | "income";
  } | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "📦",
    type: "expense" as "expense" | "income",
  });

  const commonIcons = [
    "🍔",
    "🚗",
    "🏠",
    "💊",
    "📚",
    "🎮",
    "👔",
    "💻",
    "🔧",
    "📦",
    "💰",
    "💼",
    "📈",
    "🛒",
    "🏆",
    "💵",
    "🎯",
    "💳",
    "🏪",
    "🎨",
    "✈️",
    "🏋️",
    "🎬",
    "🎵",
    "📱",
    "⚡",
    "🌟",
    "💡",
    "🔑",
    "📊",
  ];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const trimmedName = newCategory.name.trim();

    // Check if category name already exists
    const allCategories = [...expenseCategories, ...incomeCategories];
    const categoryExists = allCategories.some(
      (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (categoryExists) {
      alert("Já existe uma categoria com este nome!");
      return;
    }

    onAddCategory({
      name: trimmedName,
      icon: newCategory.icon,
      type: newCategory.type,
    });

    setNewCategory({ name: "", icon: "📦", type: "expense" });
    setIsAddModalOpen(false);
    setIsOpen(false); // Close main modal too
  };

  const handleDeleteClick = (name: string, type: "expense" | "income") => {
    setDeleteConfirm({ name, type });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteCategory(deleteConfirm.name, deleteConfirm.type);
      setDeleteConfirm(null);
    }
  };

  const hasBudgets = deleteConfirm
    ? hasPlannedBudgets(deleteConfirm.name, deleteConfirm.type)
    : false;

  return (
    <>
      <button
        className="category-manager-button"
        onClick={() => setIsOpen(true)}
      >
        ⚙️ Gerenciar Categorias
      </button>

      {isOpen && (
        <div
          className="category-manager-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="category-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-manager-header">
              <h3>Gerenciar Categorias</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="category-manager-body">
              <div className="add-category-section">
                <button
                  className="add-category-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  ➕ Nova Categoria
                </button>
              </div>

              <div className="categories-lists">
                <div className="category-type-section">
                  <h4>💸 Despesas</h4>
                  <div className="categories-grid">
                    {expenseCategories.map((cat) => (
                      <div key={cat.name} className="category-item">
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-name">{cat.name}</span>
                        {customExpenseCategoryNames.includes(cat.name) && (
                          <button
                            className="delete-cat-btn"
                            onClick={() =>
                              handleDeleteClick(cat.name, "expense")
                            }
                            title="Deletar categoria"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="category-type-section">
                  <h4>💰 Receitas</h4>
                  <div className="categories-grid">
                    {incomeCategories.map((cat) => (
                      <div key={cat.name} className="category-item">
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-name">{cat.name}</span>
                        {customIncomeCategoryNames.includes(cat.name) && (
                          <button
                            className="delete-cat-btn"
                            onClick={() =>
                              handleDeleteClick(cat.name, "income")
                            }
                            title="Deletar categoria"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div
          className="category-manager-overlay"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="add-category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {newCategory.type === "expense"
                  ? "💸 Nova Despesa"
                  : "💰 Nova Receita"}
              </h3>
              <button
                className="close-button"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Tipo:</label>
                <div className="type-selector">
                  <button
                    className={`type-btn ${
                      newCategory.type === "expense" ? "active" : ""
                    }`}
                    onClick={() =>
                      setNewCategory({ ...newCategory, type: "expense" })
                    }
                  >
                    Despesa
                  </button>
                  <button
                    className={`type-btn ${
                      newCategory.type === "income" ? "active" : ""
                    }`}
                    onClick={() =>
                      setNewCategory({ ...newCategory, type: "income" })
                    }
                  >
                    Receita
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Nome da Categoria:</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Ex: Entretenimento"
                  className="category-input"
                  maxLength={30}
                />
              </div>

              <div className="form-group">
                <label>Ícone:</label>
                <div className="icon-grid">
                  {commonIcons.map((icon) => (
                    <button
                      key={icon}
                      className={`icon-btn ${
                        newCategory.icon === icon ? "selected" : ""
                      }`}
                      onClick={() => setNewCategory({ ...newCategory, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn"
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim()}
              >
                Criar Categoria
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div
          className="category-manager-overlay"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>⚠️ Confirmar Exclusão</h3>
              <button
                className="close-button"
                onClick={() => setDeleteConfirm(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="delete-message">
                Tem certeza que deseja deletar a categoria{" "}
                <strong>{deleteConfirm.name}</strong>?
              </p>
              {hasBudgets && (
                <div className="warning-box">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    <strong>Atenção!</strong> Esta categoria possui valores
                    planejados. Ao deletá-la, todos os planejamentos associados
                    serão removidos.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManager;
