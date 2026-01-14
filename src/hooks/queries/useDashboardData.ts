/**
 * Hook do React Query para dados do Dashboard
 * Fornece cache, loading states e refetching automático
 */

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/api/dashboardService";

export const useDashboardData = (mes: number, ano: number) => {
  return useQuery({
    queryKey: ["dashboard", mes, ano],
    queryFn: () => dashboardService.getDashboardData(mes, ano),
    staleTime: 30000, // 30 segundos - dados ficam "frescos"
    gcTime: 300000, // 5 minutos - mantém em cache
    refetchOnWindowFocus: true, // Atualiza quando volta para aba
  });
};
