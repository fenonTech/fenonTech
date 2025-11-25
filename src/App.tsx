import "./App.css";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import { FinancialProvider } from "./contexts";
import { TransactionProvider } from "./contexts/TransactionContext";

function App() {
  return (
    <AuthGuard>
      <FinancialProvider>
        <TransactionProvider>
          <Layout />
        </TransactionProvider>
      </FinancialProvider>
    </AuthGuard>
  );
}

export default App;
