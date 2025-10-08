import './App.css';
import Layout from './components/Layout';
import { FinancialProvider } from './contexts';

function App() {
  return (
    <FinancialProvider>
      <Layout />
    </FinancialProvider>
  );
}

export default App;
