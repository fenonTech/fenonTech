# 🚀 Guia de Deploy para AWS S3

Este guia explica passo a passo como fazer o deploy da aplicação React no Amazon S3 com hospedagem de site estático.

---

## 📋 Pré-requisitos

1. **Conta AWS** ativa (criar em https://aws.amazon.com)
2. **AWS CLI** instalado (opcional, mas recomendado)
3. **Build da aplicação** já gerado (`npm run build`)

---

## 🎯 Método 1: Upload Manual via Console AWS (Mais Simples)

### Passo 1: Criar o Bucket S3

1. Acesse o [Console AWS](https://console.aws.amazon.com/)
2. Busque por **S3** na barra de pesquisa
3. Clique em **"Criar bucket"** (Create bucket)
4. Configure o bucket:
   - **Nome do bucket**: `meubolso-frontend` (deve ser único globalmente)
   - **Região**: escolha a mais próxima (ex: `us-east-1` ou `sa-east-1` para São Paulo)
   - **Desmarque**: "Bloquear todo o acesso público" (Block all public access)
   - ⚠️ **Confirme**: que está ciente que o bucket será público
5. Mantenha as outras configurações padrão
6. Clique em **"Criar bucket"**

### Passo 2: Habilitar Hospedagem de Site Estático

1. Clique no bucket recém-criado
2. Vá para a aba **"Propriedades"** (Properties)
3. Role até a seção **"Hospedagem de site estático"** (Static website hosting)
4. Clique em **"Editar"**
5. Selecione **"Ativar"** (Enable)
6. Configure:
   - **Documento de índice**: `index.html`
   - **Documento de erro**: `index.html` ⚠️ (importante para rotas React)
7. Clique em **"Salvar"**
8. **Anote a URL do endpoint** que aparecerá (ex: `http://meubolso-frontend.s3-website-us-east-1.amazonaws.com`)

### Passo 3: Configurar Permissões Públicas

1. Vá para a aba **"Permissões"** (Permissions)
2. Na seção **"Política do bucket"** (Bucket policy), clique em **"Editar"**
3. Cole esta política (substitua `meubolso-frontend` pelo nome do seu bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::meubolso-frontend/*"
    }
  ]
}
```

4. Clique em **"Salvar"**

### Passo 4: Fazer Upload dos Arquivos

1. Vá para a aba **"Objetos"** (Objects)
2. Clique em **"Carregar"** (Upload)
3. Clique em **"Adicionar arquivos"** e **"Adicionar pastas"**
4. Selecione TODO o conteúdo da pasta `dist/`:
   - `index.html`
   - `vite.svg`
   - `dinheiroSaldo.png`
   - Pasta `assets/` completa
5. Clique em **"Carregar"** (Upload)
6. Aguarde a conclusão do upload

### Passo 5: Testar o Site

1. Volte para **Propriedades → Hospedagem de site estático**
2. Copie a **URL do endpoint do bucket**
3. Abra em um navegador
4. ✅ Seu site está no ar!

---

## 🔧 Método 2: Deploy via AWS CLI (Profissional)

### Instalação do AWS CLI

**Windows (PowerShell como Administrador):**

```powershell
# Baixar o instalador MSI
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verificar instalação
aws --version
```

**Ou baixe manualmente:** https://aws.amazon.com/cli/

### Configuração das Credenciais

1. Crie um usuário IAM no AWS Console:
   - IAM → Usuários → Adicionar usuário
   - Permissões: `AmazonS3FullAccess`
   - Copie: **Access Key ID** e **Secret Access Key**

2. Configure o AWS CLI:

```powershell
aws configure
```

Preencha:

```
AWS Access Key ID: [sua-access-key]
AWS Secret Access Key: [sua-secret-key]
Default region name: us-east-1  # ou sa-east-1
Default output format: json
```

### Criar Bucket via CLI

```powershell
# Criar bucket
aws s3 mb s3://meubolso-frontend --region us-east-1

# Habilitar hospedagem estática
aws s3 website s3://meubolso-frontend `
  --index-document index.html `
  --error-document index.html
```

### Configurar Política Pública

Crie um arquivo `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::meubolso-frontend/*"
    }
  ]
}
```

Aplique a política:

```powershell
aws s3api put-bucket-policy `
  --bucket meubolso-frontend `
  --policy (Get-Content bucket-policy.json -Raw)
```

### Deploy Automatizado

```powershell
# Sincronizar arquivos (apaga arquivos antigos, envia novos)
aws s3 sync ./dist s3://meubolso-frontend --delete

# OU com cache otimizado:
# HTML sem cache (sempre busca versão mais nova)
aws s3 sync ./dist s3://meubolso-frontend --delete `
  --exclude "*" --include "*.html" `
  --cache-control "no-cache, no-store, must-revalidate" `
  --metadata-directive REPLACE

# Assets com cache longo (JS, CSS, imagens)
aws s3 sync ./dist s3://meubolso-frontend --delete `
  --exclude "*.html" `
  --cache-control "public, max-age=31536000, immutable" `
  --metadata-directive REPLACE
```

### Ver URL do Site

```powershell
aws s3api get-bucket-website --bucket meubolso-frontend
```

A URL será: `http://meubolso-frontend.s3-website-us-east-1.amazonaws.com`

---

## 🚀 Método 3: Deploy com CloudFront (Produção)

CloudFront adiciona:

- ✅ **HTTPS** automático
- ✅ **CDN global** (velocidade)
- ✅ **Cache inteligente**
- ✅ **Domínio customizado**

### Criar Distribuição CloudFront

1. No Console AWS, vá para **CloudFront**
2. Clique em **"Criar distribuição"**
3. Configure:
   - **Origem**: Selecione seu bucket S3
   - **Redirecionar HTTP para HTTPS**: Sim
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Default Root Object**: `index.html`
4. Em **"Configurações de erro"**, adicione:
   - **Código de erro HTTP**: 403, 404
   - **Página de resposta**: `/index.html`
   - **Código de resposta HTTP**: 200
   - (Isso garante que as rotas React funcionem)
5. Clique em **"Criar distribuição"**
6. Aguarde 5-10 minutos para deploy
7. Use a URL do CloudFront (ex: `https://d123abc456.cloudfront.net`)

### Invalidação de Cache (Após Novos Deploys)

Quando você atualizar o site, limpe o cache:

```powershell
# Via CLI
aws cloudfront create-invalidation `
  --distribution-id E1234ABCD5678 `
  --paths "/*"
```

Ou no Console: CloudFront → Sua distribuição → Invalidações → Criar invalidação → `/*`

---

## 📝 Script de Deploy Automatizado

Crie um arquivo `deploy-s3.ps1` na raiz do projeto:

```powershell
# deploy-s3.ps1
Write-Host "🔨 Buildando aplicação..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falhou!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído!" -ForegroundColor Green
Write-Host "📤 Enviando para S3..." -ForegroundColor Cyan

# Sincronizar arquivos
aws s3 sync ./dist s3://meubolso-frontend --delete

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 URL: http://meubolso-frontend.s3-website-us-east-1.amazonaws.com" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deploy falhou!" -ForegroundColor Red
    exit 1
}
```

**Usar:**

```powershell
.\deploy-s3.ps1
```

---

## 🔐 Domínio Customizado (Opcional)

### Com Route 53 + CloudFront

1. **Registre um domínio** no Route 53 (ou transfira o seu)
2. **Crie um certificado SSL** no AWS Certificate Manager (região `us-east-1`)
3. **Configure CloudFront**:
   - Alternate Domain Names (CNAMEs): `app.seudominio.com.br`
   - SSL Certificate: Selecione o certificado criado
4. **Configure Route 53**:
   - Crie um registro tipo **A** (Alias)
   - Aponte para a distribuição CloudFront

Seu site ficará: `https://app.seudominio.com.br`

---

## 🛠️ Troubleshooting

### Problema: Erro 404 ao acessar rotas (ex: /receitas)

**Solução**: Configure o **Error Document** como `index.html` no S3 (Passo 2)

### Problema: Erro 403 Forbidden

**Solução**: Verifique:

1. Bucket policy está correta (Passo 3)
2. "Block all public access" está DESATIVADO

### Problema: Arquivos não atualizam após novo deploy

**Solução**:

- **S3**: Use `aws s3 sync --delete`
- **CloudFront**: Crie uma invalidação de cache

### Problema: CSS/JS não carrega

**Solução**: Verifique se a pasta `assets/` foi enviada completa

---

## 💰 Custos Estimados

### S3 (Free Tier - Primeiro ano)

- **Armazenamento**: 5 GB grátis
- **Requisições**: 20.000 GET, 2.000 PUT grátis/mês
- Seu app (~1-5 MB) = **praticamente grátis**

### CloudFront (Free Tier - Permanente)

- **Transferência**: 1 TB grátis/mês
- **Requisições**: 10 milhões grátis/mês
- Suficiente para milhares de acessos = **grátis**

**Custo real estimado**: < **$1/mês** para aplicações pequenas/médias

---

## 🎓 Resumo dos Comandos Essenciais

```powershell
# 1. Build da aplicação
npm run build

# 2. Deploy para S3
aws s3 sync ./dist s3://meubolso-frontend --delete

# 3. Invalidar cache do CloudFront (se usar)
aws cloudfront create-invalidation --distribution-id SEU-ID --paths "/*"

# 4. Ver arquivos no bucket
aws s3 ls s3://meubolso-frontend --recursive

# 5. Deletar bucket (cuidado!)
aws s3 rb s3://meubolso-frontend --force
```

---

## 📚 Recursos Adicionais

- [Documentação AWS S3](https://docs.aws.amazon.com/s3/)
- [Documentação CloudFront](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [Calculadora de Custos AWS](https://calculator.aws/)

---

## ✅ Checklist de Deploy

- [ ] Bucket S3 criado
- [ ] Hospedagem estática habilitada
- [ ] Error document configurado como `index.html`
- [ ] Bucket policy pública configurada
- [ ] Build gerado (`npm run build`)
- [ ] Arquivos da pasta `dist/` enviados
- [ ] Site testado no endpoint do S3
- [ ] (Opcional) CloudFront configurado
- [ ] (Opcional) Domínio customizado configurado
- [ ] (Opcional) Script de deploy automatizado criado

---

**✨ Pronto! Seu site React está no ar na AWS!**
