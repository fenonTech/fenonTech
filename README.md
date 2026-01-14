# 💰 Meu Bolso - Dashboard Financeiro Inteligente

<div align="center">
  <img src="src/assets/logo.png" alt="Meu Bolso Logo" width="120"/>
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![N8N](https://img.shields.io/badge/N8N-Ready-FF6D6D?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
  
  **Bem-vindo ao seu controle financeiro inteligente**
  
  Uma aplicação moderna e responsiva para gestão financeira pessoal com automação avançada via N8N.
</div>

---

## 🚀 **Visão Geral**

**Meu Bolso** é uma plataforma completa de gestão financeira pessoal, desenvolvida com as tecnologias mais modernas do mercado. O projeto combina uma interface elegante e intuitiva com poderosas funcionalidades de automação através de webhooks N8N.

### ✨ **Principais Características**

- 📊 **Dashboard Interativo** - Visão geral completa de suas finanças
- 💰 **Gestão de Receitas** - Controle total de suas entradas
- 💸 **Controle de Despesas** - Monitoramento inteligente de gastos
- 🏦 **Integração Bancária** - Conecte suas contas bancárias
- 🔄 **Automação N8N** - Workflows inteligentes e notificações
- 📱 **Design Responsivo** - Funciona perfeitamente em todos os dispositivos
- 🎨 **Interface Moderna** - Design clean com paleta dourada elegante

---

## 🛠️ **Stack Tecnológica**

### **Frontend**

- **React 19.1.1** - Biblioteca JavaScript moderna
- **TypeScript 5.6** - Tipagem estática para maior segurança
- **Vite 6.0** - Build tool super rápido
- **CSS3** - Estilização responsiva e moderna

### **Automação & APIs**

- **N8N Integration** - Webhooks e workflows automatizados
- **Fetch API** - Comunicação com APIs REST
- **Context API** - Gerenciamento de estado global

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linting e padronização de código
- **Git** - Controle de versão
- **VS Code** - Editor recomendado

---

## 📱 **Páginas e Funcionalidades**

### 🏠 **Dashboard**

- Visão geral dos saldos e transações
- Gráficos interativos de receitas e despesas
- Cards informativos com métricas importantes
- Lista de transações recentes

### 💰 **Receitas**

- Cadastro e gestão de receitas
- Categorização (Fixa/Variável)
- Gráficos de evolução mensal
- Filtros e relatórios detalhados

### 💸 **Despesas**

- Controle completo de gastos
- Categorização por tipo de despesa
- Gráficos de distribuição (pizza e barras)
- Alertas de orçamento

### ⚙️ **Configurações**

- Perfil do usuário
- Configurações de notificações
- Gerenciamento de bancos conectados
- Preferências da aplicação

---

## 🚀 **Instalação e Execução**

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Git

### **1. Clone o Repositório**

```bash
git clone https://github.com/fenonTech/fenonTech.git
cd fenonTech
```

### **2. Instale as Dependências**

```bash
npm install
# ou
yarn install
```

### **3. Configure as Variáveis de Ambiente**

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure suas variáveis
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
VITE_N8N_API_KEY=your-api-key-here
VITE_API_BASE_URL=http://https://backend-pearl-rho-82.vercel.app/api
```

### **4. Execute em Desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

### **5. Acesse a Aplicação**

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## 🔄 **Integração N8N**

### **Configuração Básica**

O projeto está preparado para integração completa com N8N via webhooks:

```typescript
// Exemplo de uso
import { useWebhooks } from "./hooks";

const { sendToN8N, isConnected } = useWebhooks();

// Enviar dados para N8N
await sendToN8N("transaction.created", transactionData);
```

### **Fluxos de Automação Disponíveis**

- 🏦 **Sincronização Bancária** - Importação automática de transações
- 📊 **Categorização Inteligente** - IA para categorizar despesas
- 🔔 **Alertas Smart** - Notificações de gastos e metas
- 📈 **Relatórios Automáticos** - Geração periódica de relatórios

### **Documentação Completa**

- 📖 [Guia de Integração N8N](./README_N8N.md)
- 🔧 [Configuração de Backend](./docs/BACKEND_WEBHOOKS.md)

---

## 📦 **Scripts Disponíveis**

```bash
npm run dev          # Executar em desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificar código com ESLint
npm run lint:fix     # Corrigir problemas do ESLint
```

---

## 🏗️ **Estrutura do Projeto**

```
fenonTech/
├── src/
│   ├── assets/              # Imagens e recursos
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header/         # Cabeçalho da aplicação
│   │   ├── Sidebar/        # Menu lateral
│   │   ├── Cards/          # Cards informativos
│   │   └── Layout/         # Layout principal
│   ├── pages/              # Páginas da aplicação
│   │   ├── Dashboard/      # Página inicial
│   │   ├── Receitas/       # Gestão de receitas
│   │   ├── Despesas/       # Controle de despesas
│   │   └── Configuracoes/  # Configurações
│   ├── contexts/           # Context API
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços e APIs
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Utilitários
├── docs/                   # Documentação
├── public/                 # Arquivos públicos
└── README.md              # Este arquivo
```

---

## 🎨 **Design System**

### **Paleta de Cores**

- **Primária**: `#FFD700` (Dourado)
- **Secundária**: `#1a1a1a` (Preto)
- **Background**: `#0f0f0f` (Preto escuro)
- **Texto**: `#ffffff` (Branco)
- **Accent**: `#333333` (Cinza escuro)

### **Tipografia**

- **Fonte Principal**: System fonts (Inter, Roboto, Helvetica)
- **Títulos**: Bold, variando de 1.25rem a 2rem
- **Texto**: Regular, 0.875rem a 1rem

---

## 🤝 **Contribuição**

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **Padrões de Commit**

- ✨ `feat:` Nova funcionalidade
- 🐛 `fix:` Correção de bug
- 📚 `docs:` Documentação
- 🎨 `style:` Formatação/estilo
- ♻️ `refactor:` Refatoração
- 🔧 `config:` Configuração

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 **Contato & Suporte**

- **Desenvolvedor**: FenonTech Team
- **Email**: [contato@fenontech.com](mailto:contato@fenontech.com)
- **GitHub**: [@fenonTech](https://github.com/fenonTech)

---

## 🔮 **Roadmap**

### **V2.0 - Em Desenvolvimento**

- [ ] Autenticação de usuários
- [ ] Integração com bancos brasileiros
- [ ] Relatórios em PDF
- [ ] App mobile (React Native)
- [ ] IA para recomendações financeiras

### **V1.5 - Próxima Release**

- [ ] Temas personalizáveis
- [ ] Exportação de dados
- [ ] Backup automático
- [ ] Notificações push

---

<div align="center">
  
  **Desenvolvido com ❤️ pela FenonTech**
  
  ⭐ **Não esqueça de dar uma estrela se este projeto te ajudou!** ⭐
  
</div>
