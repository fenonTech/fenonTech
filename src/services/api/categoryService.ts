/**
 * Serviço de Categorias
 *
 * Centraliza operações relacionadas a categorias de transações
 * Compartilhado entre mobile e desktop
 */

import { api } from "../../config";

// ========================================
// 📦 TIPOS E INTERFACES
// ========================================

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
}

// Categorias padrão (podem vir da API ou serem locais)
export const DEFAULT_INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Presente",
  "Outros",
] as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Outros",
] as const;

// ========================================
// 📡 SERVIÇO DE CATEGORIAS
// ========================================

export const categoryService = {
  /**
   * Buscar todas as categorias
   */
  async getCategories(): Promise<Category[]> {
    try {
      const payload = {
        dadosRequisicao: {
          tela: "categorias",
          tipoMetodo: "get",
        },
      };

      console.log("📥 Buscando categorias da API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Categorias recebidas:", response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error("❌ Erro ao buscar categorias:", error);

      // Se API falhar, retornar categorias padrão
      console.warn("⚠️ Usando categorias padrão");
      return this.getDefaultCategories();
    }
  },

  /**
   * Buscar categorias de receitas
   */
  async getIncomeCategories(): Promise<string[]> {
    try {
      const categories = await this.getCategories();
      return categories.filter((c) => c.type === "income").map((c) => c.name);
    } catch (error) {
      return [...DEFAULT_INCOME_CATEGORIES];
    }
  },

  /**
   * Buscar categorias de despesas
   */
  async getExpenseCategories(): Promise<string[]> {
    try {
      const categories = await this.getCategories();
      return categories.filter((c) => c.type === "expense").map((c) => c.name);
    } catch (error) {
      return [...DEFAULT_EXPENSE_CATEGORIES];
    }
  },

  /**
   * Obter categorias padrão
   */
  getDefaultCategories(): Category[] {
    const incomeCategories: Category[] = DEFAULT_INCOME_CATEGORIES.map(
      (name, index) => ({
        id: `income-${index}`,
        name,
        type: "income" as const,
      })
    );

    const expenseCategories: Category[] = DEFAULT_EXPENSE_CATEGORIES.map(
      (name, index) => ({
        id: `expense-${index}`,
        name,
        type: "expense" as const,
      })
    );

    return [...incomeCategories, ...expenseCategories];
  },

  /**
   * Criar nova categoria
   */
  async createCategory(category: Omit<Category, "id">): Promise<any> {
    try {
      const payload = {
        dadosRequisicao: {
          tela: "categorias",
          tipoMetodo: "post",
          categoria: category.name,
          tipo: category.type,
        },
      };

      console.log("📤 Criando categoria na API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Categoria criada com sucesso:", response.data);

      // response.data já é o objeto direto da API
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar categoria:", error);
      throw error;
    }
  },

  /**
   * Deletar categoria
   */
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const payload = {
        dadosRequisicao: {
          tela: "categorias",
          tipoMetodo: "delete",
          categoriaId: categoryId,
        },
      };

      console.log("🗑️ Deletando categoria na API:", payload);

      const response = await api.post("", payload);

      console.log("✅ Categoria deletada com sucesso:", response.data);
    } catch (error: any) {
      console.error("❌ Erro ao deletar categoria:", error);
      throw error;
    }
  },
};
