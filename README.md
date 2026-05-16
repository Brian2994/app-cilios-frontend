````md
# App Cílios — Frontend

Frontend do sistema de gestão para estúdio de cílios desenvolvido com React + Vite.

A aplicação permite:

- Autenticação de usuários
- Cadastro de clientes
- Cadastro de serviços
- Gestão de agendamentos
- Dashboard financeiro
- Visualização de métricas
- Integração com API NestJS

---

# Tecnologias

- React
- TypeScript
- Vite
- Axios
- Recharts
- Railway (backend)
- Railway (deploy frontend)

---

# Estrutura do Projeto

```bash
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── routes/
 ├── App.tsx
 └── main.tsx
````

---

# Instalação

Clone o projeto:

```bash
git clone https://github.com/Brian2994/app-cilios-frontend.git
```

Entre na pasta:

```bash
cd app-cilios-frontend
```

Instale as dependências:

```bash
npm install
```

---

# Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_API_URL=https://SEU-BACKEND.up.railway.app
```

Exemplo:

```env
VITE_API_URL=https://app-cilios-backend-production.up.railway.app
```

---

# Executando em Desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:5173
```

---

# Build de Produção

```bash
npm run build
```

Pré-visualização local:

```bash
npm run preview
```

---

# Integração com Backend

O frontend consome a API NestJS através da variável:

```env
VITE_API_URL
```

Exemplo de configuração Axios:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

---

# Autenticação

O token JWT é armazenado no localStorage.

Exemplo:

```ts
localStorage.setItem("token", token);
```

Interceptador Axios:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

# Timezone e Datas

O sistema utiliza UTC internamente para evitar problemas de timezone entre navegador, backend e banco de dados.

## Envio de datas

Datas são enviadas no frontend em formato ISO UTC:

```ts
new Date(date).toISOString()
```

## Exibição

As datas são convertidas para o timezone brasileiro:

```ts
new Date(date).toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
})
```

---

# Dashboard

O dashboard apresenta:

* Faturamento diário
* Faturamento mensal
* Quantidade de clientes
* Quantidade de agendamentos
* Serviços mais utilizados
* Agenda do dia

Gráficos implementados com Recharts.

---

# Deploy

## Frontend

Deploy realizado na Railway.

## Backend

API hospedada no Railway.

---

# Scripts

```bash
npm run dev
npm run build
npm run preview
```

---

# Melhorias Futuras

* Responsividade avançada
* Tema dark mode
* Notificações
* Calendário visual
* Integração com WhatsApp
* Controle financeiro avançado
* Multiusuário

---

# Licença

Sistema desenvolvido para uso comercial e gestão de atendimentos em estúdio de cílios, com foco em organização de agenda, clientes, serviços e controle operaciona

---

⚙️ Backend: O backend desta aplicação foi desenvolvido por Pablo Brian utilizando NestJS, Prisma e PostgreSQL, e está hospedado em um repositório privado para garantir a segurança das credenciais e a privacidade dos dados dos clientes conforme a LGPD.

```
```
