/**
 * Hook do React Query para dados de Receitas
 * Fornece cache, loading states e refetching automático
 */

import { useQuery } from "@tanstack/react-query";
import { receitasService } from "../../services/api/receitasService";

export const useReceitasData = (mes: number, ano: number) => {
  return useQuery({
    queryKey: ["receitas", mes, ano],
    queryFn: () => receitasService.getReceitas(mes, ano),
  });
};
