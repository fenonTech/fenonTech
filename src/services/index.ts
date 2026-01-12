/**
 * Barrel Export - Serviços
 *
 * Centraliza todas as exportações de serviços
 * Facilita importação em qualquer parte da aplicação
 */

// ========================================
// 🔐 AUTENTICAÇÃO
// ========================================
export * from "./authService";

// ========================================
// 📡 SERVIÇOS DE API
// ========================================
export * from "./api/transactionService";
export * from "./api/dashboardService";
export * from "./api/categoryService";
export * from "./api/userService";
export * from "./api/assinaturasService";

// ========================================
// 🔧 UTILITÁRIOS
// ========================================
export * from "./helpers";

// ========================================
// 🔧 SERVIÇOS LEGADOS (mantidos por compatibilidade)
// ========================================
export { transactionApiService } from "./transactionApiService";
