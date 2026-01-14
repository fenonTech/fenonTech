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
  });
};
