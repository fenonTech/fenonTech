# Exemplo de Backend para Webhooks N8N

## Estrutura de Endpoints Recomendada

### 1. Endpoint para Receber Webhooks do N8N
```typescript
// POST /api/webhooks/n8n
app.post('/api/webhooks/n8n', async (req, res) => {
  try {
    const { event, data, timestamp, source } = req.body;
    
    // Validar webhook
    if (!event || !data) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    // Processar evento
    switch (event) {
      case 'transaction.created':
        await handleTransactionCreated(data);
        break;
      case 'transaction.updated':
        await handleTransactionUpdated(data);
        break;
      case 'transaction.deleted':
        await handleTransactionDeleted(data);
        break;
      case 'summary.updated':
        await handleSummaryUpdated(data);
        break;
      default:
        console.warn('Evento não reconhecido:', event);
    }
    
    // Opcional: Notificar frontend via WebSocket
    io.emit('webhook-received', { event, data, timestamp });
    
    res.json({ success: true, message: 'Webhook processado' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
```

### 2. Endpoints REST para CRUD de Transações
```typescript
// GET /api/transactions
app.get('/api/transactions', async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  // Implementar filtros e retornar transações
});

// POST /api/transactions
app.post('/api/transactions', async (req, res) => {
  // Criar nova transação
  // Após criar, enviar para N8N
});

// PUT /api/transactions/:id
app.put('/api/transactions/:id', async (req, res) => {
  // Atualizar transação
  // Após atualizar, enviar para N8N
});

// DELETE /api/transactions/:id
app.delete('/api/transactions/:id', async (req, res) => {
  // Deletar transação
  // Após deletar, enviar para N8N
});
```

### 3. WebSocket para Atualizações em Tempo Real
```typescript
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});
```

## Configuração N8N

### Workflow de Exemplo no N8N:
1. **Webhook Trigger** - Recebe dados do frontend
2. **Function Node** - Processa e valida dados
3. **Database Node** - Salva no banco de dados
4. **HTTP Request** - Envia de volta para a aplicação
5. **Slack/Email Node** - Notificações (opcional)

### Estrutura de Webhook no N8N:
```json
{
  "event": "transaction.created",
  "data": {
    "id": "123",
    "type": "receita",
    "amount": 1000,
    "description": "Salário",
    "category": "Trabalho",
    "date": "2025-10-08",
    "status": "completed"
  },
  "timestamp": "2025-10-08T10:00:00Z",
  "source": "meu-bolso-app"
}
```

## Variáveis de Ambiente Necessárias:
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
N8N_API_KEY=your-n8n-api-key
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

## Tecnologias Recomendadas para Backend:
- **Node.js** com Express ou Fastify
- **TypeScript** para tipagem
- **Socket.io** para WebSocket
- **Prisma** ou **TypeORM** para banco de dados
- **PostgreSQL** ou **MySQL** como banco
- **JWT** para autenticação
- **Zod** para validação de dados