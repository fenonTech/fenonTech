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
      staleTime: 30000, // Dados ficam "frescos" por 30 segundos
      gcTime: 300000, // Cache mantido por 5 minutos (antes era cacheTime)
      refetchOnWindowFocus: true, // Atualiza quando usuário volta para aba
      retry: 1, // Tenta 1 vez se falhar
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
