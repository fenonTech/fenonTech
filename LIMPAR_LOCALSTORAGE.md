# 🧹 Limpar localStorage

O localStorage estava causando duplicação de dados. Agora ele está desabilitado e usamos apenas a API.

## Para limpar os dados antigos do localStorage:

1. Abra o DevTools (F12)
2. Vá para a aba **Console**
3. Cole e execute este comando:

```javascript
localStorage.removeItem("fenontech-transactions");
console.log("✅ localStorage limpo!");
```

4. Recarregue a página (F5)

Agora os dados virão apenas da API, sem duplicação!
