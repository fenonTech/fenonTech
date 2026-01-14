/**
 * Hook do React Query para dados de Despesas
 * Fornece cache, loading states e refetching automático
 */

import { useQuery } from "@tanstack/react-query";
import { despesasService } from "../../services/api/despesasService";

export const useDespesasData = (mes: number, ano: number) => {
  return useQuery({
    queryKey: ["despesas", mes, ano],
    queryFn: () => despesasService.getDespesas(mes, ano),
  });
};
