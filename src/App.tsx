import "./App.css";
import Layout from "./components/Layout";
import { FinancialProvider } from "./contexts";
import { TransactionProvider } from "./contexts/TransactionContext";

function App() {
  return (
    <FinancialProvider>
      <TransactionProvider>
        <Layout />
      </TransactionProvider>
    </FinancialProvider>
  );
}

export default App;
