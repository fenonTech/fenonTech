import "./App.css";
import Layout from "./components/Layout";
import LayoutMobile from "./components/LayoutMobile";
import AuthGuard from "./components/AuthGuard";
import { FinancialProvider } from "./contexts";
import { TransactionProvider } from "./contexts/TransactionContext";
import { FilterProvider } from "./contexts/FilterContext";
import { useDeviceDetection } from "./hooks/useDeviceDetection";

function App() {
  const { isMobile } = useDeviceDetection();

  return (
    <AuthGuard>
      <FilterProvider>
        <FinancialProvider>
          <TransactionProvider>
            {isMobile ? <LayoutMobile /> : <Layout />}
          </TransactionProvider>
        </FinancialProvider>
      </FilterProvider>
    </AuthGuard>
  );
}

export default App;
