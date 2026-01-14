# Integração N8N - Meu Bolso

## 🚀 Visão Geral

Este projeto está preparado para integração completa com N8N via webhooks, permitindo automação financeira avançada e sincronização em tempo real.

## 📁 Estrutura do Projeto

```
src/
├── types/
│   └── financial.ts          # Tipos TypeScript para dados financeiros
├── services/
│   └── apiService.ts         # Serviço para comunicação com APIs e N8N
├── contexts/
│   └── FinancialContext.tsx  # Context global para gerenciamento de estado
├── hooks/
│   ├── useTransactions.ts    # Hook para gerenciar transações
│   └── useWebhooks.ts        # Hook para webhooks N8N
└── components/
    ├── TransactionForm/      # Formulário de transações
    └── WebhookStatus/        # Monitor de status N8N
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
VITE_N8N_API_KEY=your-api-key-here
VITE_API_BASE_URL=http://https://backend-pearl-rho-82.vercel.app/api
```

### 2. Instalação de Dependências

```bash
npm install
```

## 📡 Como Usar os Webhooks

### Frontend → N8N

```typescript
import { useWebhooks } from "./hooks";

const { sendToN8N } = useWebhooks();

// Enviar evento para N8N
await sendToN8N("transaction.created", {
  id: "123",
  amount: 1000,
  description: "Nova receita",
});
```

### N8N → Frontend

```typescript
import { useWebhooks } from "./hooks";

const { processWebhook } = useWebhooks();

// Processar webhook recebido do N8N
await processWebhook({
  event: "transaction.created",
  data: transactionData,
  timestamp: new Date().toISOString(),
  source: "n8n-automation",
});
```

### Usar Hook de Transações

```typescript
import { useTransactions } from "./hooks";

const MyComponent = () => {
  const {
    transactions,
    loading,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useTransactions();

  const handleNewTransaction = async () => {
    await addTransaction({
      type: "receita",
      amount: 1000,
      description: "Salário",
      category: "Trabalho",
      date: "2025-10-08",
      status: "completed",
    });
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {transactions.map((transaction) => (
        <div key={transaction.id}>{transaction.description}</div>
      ))}
    </div>
  );
};
```

## 🔄 Fluxos de Automação Sugeridos

### 1. Sincronização Bancária

- **N8N recebe** dados do banco via API
- **N8N processa** e categoriza automaticamente
- **N8N envia** webhook para o frontend
- **Frontend atualiza** interface em tempo real

### 2. Alertas Inteligentes

- **Frontend detecta** gastos altos
- **Envia para N8N** via webhook
- **N8N analisa** padrões de gastos
- **N8N dispara** notificações (email, Slack, etc.)

### 3. Relatórios Automáticos

- **N8N agenda** relatórios mensais
- **Processa dados** financeiros
- **Gera relatórios** em PDF
- **Envia por email** e atualiza dashboard

## 📊 Eventos de Webhook Disponíveis

### Eventos Enviados pelo Frontend:

- `transaction.created` - Nova transação criada
- `transaction.updated` - Transação atualizada
- `transaction.deleted` - Transação deletada
- `summary.updated` - Resumo financeiro atualizado
- `form.transaction.submitted` - Formulário enviado

### Eventos Recebidos do N8N:

- `bank.sync.completed` - Sincronização bancária concluída
- `automation.triggered` - Automação ativada
- `alert.budget.exceeded` - Orçamento excedido
- `report.generated` - Relatório gerado

## 🛠️ Exemplos de Workflows N8N

### 1. Categorização Automática

```
Webhook → Function (IA/Regras) → Database → Response
```

### 2. Backup de Dados

```
Schedule → Database Query → Google Drive/Dropbox
```

### 3. Notificações Smart

```
Webhook → Condition → Slack/Email/WhatsApp
```

## 🔒 Segurança

- Use HTTPS para webhooks
- Implemente autenticação via API Key
- Valide todos os dados recebidos
- Log de todas as operações
- Rate limiting nos endpoints

## 🚨 Monitoramento

Use o componente `WebhookStatus` para monitorar:

- Status da conexão com N8N
- Último webhook recebido/enviado
- Logs de erro em tempo real

```typescript
import WebhookStatus from "./components/WebhookStatus/WebhookStatus";

const Dashboard = () => (
  <div>
    <WebhookStatus />
    {/* Resto do dashboard */}
  </div>
);
```

## 📈 Próximos Passos

1. **Backend API** - Implementar endpoints REST
2. **WebSocket** - Conexão em tempo real
3. **Autenticação** - JWT/OAuth
4. **Banco de Dados** - PostgreSQL/MongoDB
5. **Deploy** - Docker + CI/CD
6. **Monitoramento** - Sentry/LogRocket

## 🔗 Links Úteis

- [Documentação N8N](https://docs.n8n.io/)
- [N8N Webhook Docs](https://docs.n8n.io/integrations/core-nodes/n8n-nodes-base.webhook/)
- [React Context API](https://react.dev/reference/react/createContext)
- [TypeScript Types](https://www.typescriptlang.org/docs/)

---

**Nota:** Este setup fornece uma base sólida para integração com N8N. Adapte conforme suas necessidades específicas de automação financeira.
