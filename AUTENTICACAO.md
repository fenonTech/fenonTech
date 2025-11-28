# 🔐 Sistema de Autenticação

## Como Funciona

O sistema captura as credenciais do usuário através da URL e as armazena no `localStorage` para uso em todas as chamadas da API.

## Formato da URL

```
https://www.fenontech.com.br/dashboard/index.html?telefone={numerotelefone}&codigo={codigotemp}
```

**Exemplo real:**

```
https://www.fenontech.com.br/dashboard/index.html?telefone=+5511911451180&codigo=x76elj
```

**Parâmetros (query string):**

- **telefone**: Número com código do país (ex: `+5511911451180`) - deve começar com `+`
- **codigo**: Código temporário de autenticação (ex: `x76elj`)

**Por que usar query parameters?**

Como estamos hospedados no S3, usamos query parameters (`?param=value`) para passar as credenciais. O S3 sempre serve o `index.html` e ignora os parâmetros, permitindo que o JavaScript leia as credenciais sem causar erro 404 ou Access Denied.

**⚠️ IMPORTANTE:**

- ✅ O código **NÃO possui credenciais fixas**
- ✅ Todas as credenciais vêm da URL ou do localStorage
- ✅ Cada usuário tem suas próprias credenciais dinâmicas
- ✅ Query parameters não causam erros de roteamento no S3

## Fluxo de Autenticação

### 1. Primeira Visita (com parâmetros na URL)

```
URL: https://www.fenontech.com.br/dashboard/index.html?telefone=+5511911451180&codigo=x76elj
```

**O que acontece:**

1. `AuthGuard` captura os parâmetros da query string
2. Valida se o telefone começa com `+`
3. Salva no localStorage:
   - `fenontech-telefone`: `+5511911451180`
   - `fenontech-codigoTemp`: `x76elj`
4. Redireciona para a URL limpa: `https://www.fenontech.com.br/dashboard/index.html`
5. Libera acesso à aplicação

### 2. Visitas Subsequentes (sem parâmetros)

```
URL: https://www.fenontech.com.br/dashboard/index.html
```

**O que acontece:**

1. `AuthGuard` verifica o localStorage
2. Se encontrar as credenciais, libera acesso
3. Se não encontrar, redireciona para: `https://www.fenontech.com.br/landingpage/index.html#/login`

### 3. Sem Credenciais

```
URL: https://www.fenontech.com.br/dashboard/index.html
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
  "codigoTemp": "x76elj",
  "dadosRequisicao": {
    "tela": "dashboard",
    "tipoMetodo": "get"
  }
}
```

## Testando Localmente

### Teste 1: Primeira Visita

1. Limpe o localStorage: `localStorage.clear()`
2. Acesse: `http://localhost:5173/?telefone=+5511911451180&codigo=x76elj`
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

## Testando em Produção (S3)

### URL de Acesso com Credenciais:

```
https://www.fenontech.com.br/dashboard/index.html?telefone=+5511911451180&codigo=x76elj
```

### URL Normal (após autenticação):

```
https://www.fenontech.com.br/dashboard/index.html
```

**Vantagens dos Query Parameters:**

- ✅ S3 sempre serve `index.html` independente dos parâmetros
- ✅ Não causa erro 404 ou Access Denied
- ✅ Funciona perfeitamente em hospedagem estática

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
