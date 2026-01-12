# API de Autenticação

Documentação da API de login e autenticação.

## 🔐 Endpoint de Login

### POST `/api/auth/login`

**URL Completa:** `https://backend-pearl-rho-82.vercel.app/api/auth/login`

### Request

```json
{
  "telefone": "+5511916736423",
  "codigo": "q06ckk"
}
```

### Responses

#### ✅ Sucesso (200)

```json
{
  "status": true,
  "status_code": 200,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 3,
    "nome": "Gustavo",
    "telefone": "+5511911451180"
  },
  "assinatura": {
    "ativa": true,
    "tipo": "paga"
  }
}
```

#### ❌ Erro - Código Inválido (400)

```json
{
  "status": false,
  "status_code": 400,
  "message": "Código inválido ou expirado"
}
```

## 💻 Como Usar

### No Código

```typescript
import { authService } from "../services/authService";

// Fazer login
try {
  const response = await authService.login("+5511999999999", "abc123");

  if (response.status && response.status_code === 200) {
    console.log("Login bem-sucedido!");
    console.log("Token:", response.token);
    console.log("Usuário:", response.usuario);
    console.log("Assinatura:", response.assinatura);

    // O token e dados são automaticamente salvos no localStorage
  } else {
    console.error("Erro:", response.message);
  }
} catch (error) {
  console.error("Erro ao fazer login:", error);
}
```

### Via URL (Query Parameters)

O usuário pode acessar a aplicação diretamente com os parâmetros:

```
https://seu-dominio.com/?telefone=+5511999999999&codigo=abc123
```

O componente `AuthGuard` automaticamente:

1. Captura os parâmetros da URL
2. Chama a API de login
3. Salva o token e dados do usuário
4. Remove os parâmetros da URL
5. Redireciona para a tela principal

## 🔒 Autenticação Automática

Após o login, o token é automaticamente adicionado em todas as requisições:

```typescript
// Configurado no axios.config.ts
headers: {
  Authorization: `Bearer ${token}`;
}
```

**IMPORTANTE**: Agora todas as APIs usam apenas o token Bearer no header. Não é mais necessário enviar `telefone` e `codigoTemp` no payload.

## 📦 Dados Salvos no localStorage

Após login bem-sucedido, são salvos **APENAS**:

- `fenontech-token` - Token JWT de autenticação
- `fenontech-user-name` - Nome do usuário
- `fenontech-subscription` - Dados da assinatura (JSON)

**Chaves removidas**: `fenontech-telefone`, `fenontech-codigoTemp`, `fenontech-user` (não são mais utilizadas)

## ⚠️ Tratamento de Erros

### Erro 401 - Sessão Expirada

Quando a API retorna 401, o sistema:

1. Marca a sessão como expirada no localStorage
2. Recarrega a página
3. Redireciona para a página de login

### Erro 403 - Assinatura Expirada

Quando a API retorna 403, o sistema:

1. Marca a assinatura como expirada
2. Recarrega a página
3. Mostra o modal de renovação de assinatura

### Erro 400 - Código Inválido

Quando o código está inválido ou expirado:

1. Mostra mensagem de erro
2. Aguarda 3 segundos
3. Redireciona para a página de login

## 🔄 Fluxo Completo

1. **Usuário acessa com parâmetros na URL**

   - `?telefone=+5511999999999&codigo=abc123`

2. **AuthGuard captura os parâmetros**

   - Valida formato do telefone
   - Chama API de login

3. **Login bem-sucedido (200)**

   - Salva token, usuário e assinatura
   - Remove parâmetros da URL
   - Usuário está autenticado

4. **Próximas requisições**

   - Token adicionado automaticamente
   - Usuário permanece autenticado

5. **Se sessão expirar (401)**

   - Redireciona para login

6. **Se assinatura expirar (403)**
   - Mostra modal de renovação

## 📱 Mobile e Desktop

A mesma lógica funciona para **mobile** e **desktop**:

- Mesmo endpoint de login
- Mesma estrutura de resposta
- Mesmo tratamento de erros
- Mesma forma de autenticação
