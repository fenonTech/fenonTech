import "./App.css";
import Layout from "./components/Layout";
import LayoutMobile from "./components/LayoutMobile";
import AuthGuard from "./components/AuthGuard";
import { TransactionProvider } from "./contexts/TransactionContext";
import { FilterProvider } from "./contexts/FilterContext";
import { useDeviceDetection } from "./hooks/useDeviceDetection";

function App() {
  const { isMobile } = useDeviceDetection();

  return (
    <AuthGuard>
      <FilterProvider>
        <TransactionProvider>
          {isMobile ? <LayoutMobile /> : <Layout />}
        </TransactionProvider>
      </FilterProvider>
    </AuthGuard>
  );
}

export default App;
