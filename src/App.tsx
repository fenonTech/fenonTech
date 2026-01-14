import "./App.css";
import Layout from "./components/Layout";
import LayoutMobile from "./components/LayoutMobile";
import AuthGuard from "./components/AuthGuard";
import { TransactionProvider } from "./contexts/TransactionContext";
import { FilterProvider } from "./contexts/FilterContext";
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // Dados ficam "frescos" por 5 segundos - atualização mais rápida
      gcTime: 60000, // Cache mantido por 1 minuto - liberação mais rápida de memória
      refetchOnWindowFocus: true, // Atualiza quando usuário volta para aba
      retry: 1, // Tenta 1 vez se falhar
      refetchOnMount: true, // Atualiza ao montar componente
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const { isMobile } = useDeviceDetection();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <FilterProvider>
          <TransactionProvider>
            {isMobile ? <LayoutMobile /> : <Layout />}
          </TransactionProvider>
        </FilterProvider>
      </AuthGuard>
    </QueryClientProvider>
  );
}

export default App;
