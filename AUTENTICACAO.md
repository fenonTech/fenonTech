# 🔐 Sistema de Autenticação

## Como Funciona

O sistema captura as credenciais do usuário através da URL e as armazena no `localStorage` para uso em todas as chamadas da API.

## Formato da URL

```
http://localhost:5173/+5511911451180/3r50di
```

**Parâmetros:**

- **Telefone**: `+5511911451180` (deve começar com `+`)
- **Código Temporário**: `3r50di`

## Fluxo de Autenticação

### 1. Primeira Visita (com parâmetros na URL)

```
URL: http://localhost:5173/+5511911451180/3r50di
```

**O que acontece:**

1. `AuthGuard` captura os parâmetros da URL
2. Valida se o telefone começa com `+`
3. Salva no localStorage:
   - `fenontech-telefone`: `+5511911451180`
   - `fenontech-codigoTemp`: `3r50di`
4. Redireciona para a URL limpa: `http://localhost:5173/`
5. Libera acesso à aplicação

### 2. Visitas Subsequentes (sem parâmetros)

```
URL: http://localhost:5173/
```

**O que acontece:**

1. `AuthGuard` verifica o localStorage
2. Se encontrar as credenciais, libera acesso
3. Se não encontrar, redireciona para: `https://landing-page-gbprzvx9a-fenontechs-projects.vercel.app/login`

### 3. Sem Credenciais

```
URL: http://localhost:5173/
(localStorage vazio)
```

**O que acontece:**

1. `AuthGuard` não encontra credenciais
2. Redireciona automaticamente para a página de login externa
3. Usuário precisa fazer login novamente

## Uso nas APIs

Todas as chamadas da API agora usam as credenciais do localStorage:

```typescript
// Antes (constantes fixas)
const TELEFONE_FIXO = "+5511911451180";
const CODIGO_TEMP_FIXO = "0vr84e";

// Agora (do localStorage)
const { telefone, codigoTemp } = getUserCredentials();
```

**Exemplo de payload:**

```json
{
  "telefone": "+5511911451180",
  "codigoTemp": "3r50di",
  "dadosRequisicao": {
    "tela": "dashboard",
    "tipoMetodo": "get"
  }
}
```

## Testando Localmente

### Teste 1: Primeira Visita

1. Limpe o localStorage: `localStorage.clear()`
2. Acesse: `http://localhost:5173/+5511911451180/3r50di`
3. Verifique no console: `✅ Parâmetros capturados da URL`
4. Veja a URL mudar para: `http://localhost:5173/`
5. A aplicação deve carregar normalmente

### Teste 2: Retornar ao Site

1. Feche e reabra a aba
2. Acesse: `http://localhost:5173/`
3. Verifique no console: `✅ Credenciais encontradas no localStorage`
4. A aplicação deve carregar normalmente

### Teste 3: Sem Credenciais

1. Limpe o localStorage: `localStorage.clear()`
2. Acesse: `http://localhost:5173/`
3. Verifique no console: `❌ Credenciais não encontradas`
4. Deve redirecionar para a página de login

## Comandos de Debug no Console

```javascript
// Ver credenciais salvas
localStorage.getItem("fenontech-telefone");
localStorage.getItem("fenontech-codigoTemp");

// Limpar credenciais
localStorage.removeItem("fenontech-telefone");
localStorage.removeItem("fenontech-codigoTemp");

// Ou limpar tudo
localStorage.clear();
```

## Segurança

⚠️ **Nota**: As credenciais são armazenadas no `localStorage` do navegador. Para maior segurança em produção, considere:

- Adicionar expiração às credenciais
- Criptografar os dados antes de salvar
- Implementar renovação automática de tokens
- Adicionar verificação de sessão no backend
