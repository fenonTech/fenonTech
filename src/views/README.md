# Views Structure

Este diretório contém as views específicas de plataforma do projeto.

## Desktop (`/desktop`)

Contém páginas otimizadas exclusivamente para desktop/web:

- **Dashboard** - Dashboard financeiro (desktop only)
- **Receitas** - Gerenciamento de receitas (desktop only)
- **Despesas** - Gerenciamento de despesas (desktop only)

## Mobile (`/mobile`)

Contém páginas otimizadas para dispositivos móveis:

- **Dashboard** - (a ser implementado)
- **Receitas** - (a ser implementado)
- **Despesas** - (a ser implementado)

## Páginas Compartilhadas (`/src/pages`)

As seguintes páginas são compartilhadas entre mobile e desktop:

- **Configuracoes** - Configurações do sistema
- **SessionExpired** - Tela de sessão expirada
- **SubscriptionError** - Tela de erro de assinatura

## Estrutura

```
src/
├── views/
│   ├── desktop/         ← Páginas específicas de desktop
│   │   ├── Dashboard/
│   │   ├── Receitas/
│   │   └── Despesas/
│   └── mobile/          ← Páginas específicas de mobile
│       └── (a ser implementado)
├── pages/               ← Páginas compartilhadas
│   ├── Configuracoes/
│   ├── SessionExpired/
│   └── SubscriptionError/
└── components/          ← Componentes compartilhados
```
