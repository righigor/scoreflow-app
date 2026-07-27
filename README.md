# 🤸‍♀️ ScoreFlow

**A plataforma SaaS definitiva para gestão e apuração de campeonatos de ginástica.**

Substitua planilhas caóticas, PDFs e grupos de WhatsApp por um sistema unificado, em tempo real e com visual profissional de transmissão esportiva.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 💡 Sobre o Projeto

O **ScoreFlow** nasceu de uma dor real dentro da Federação Mineira de Ginástica (FMG): a gestão amadora de competições. 

Iniciando pela modalidade Rítmica, o sistema atua como um "HLTV da ginástica", permitindo que Federações gerenciem seus atletas, clubes e árbitros, enquanto oferece uma experiência de apuração de notas em tempo real (via WebSockets) e um portal público para pais e fãs acompanharem os resultados.

### ✨ Destaques
- 🏢 **Multi-Tenant Nativo:** Uma única base de código atende N federações, com dados 100% isolados via Row Level Security (RLS).
- ⚡ **Tempo Real:** Apuração de notas síncrona entre árbitros e o painel de divulgação (Zero lag).
- 🧮 **Cálculo FIG Automático:** Médias configuráveis (2, 3 ou 4 juízes) e cálculo automático do Individual Geral.
- 📱 **Design System Moderno:** Interface limpa, responsiva e acessível, construída sobre o Shadcn UI.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Motivo |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Performance extrema e HMR rápido. |
| **Linguagem** | TypeScript | Segurança tipográfica em um sistema de regras complexas. |
| **Estilo** | TailwindCSS + Shadcn/ui | Design system padronizado e componetizável. |
| **Estado / Dados** | TanStack Query + Zustand | Cache inteligente no cliente + estado de interface leve. |
| **Formulários** | React Hook Form + Zod | Validação performática e tipada. |
| **Backend / DB** | **Supabase** (PostgreSQL) | Relações complexas (Many-to-Many), Autenticação, Storage e Realtime nativos. |

---

## 🏗️ Arquitetura

O projeto segue o padrão **Feature-Based** (Funcionalidades), separando a lógica de negócio por domínios dentro da pasta `src/domains` (ex: `auth`, `federation`, `championship`, `scoring`).

A segregação de dados multi-tenant é garantida por **Políticas de Segurança (RLS)** diretamente no banco de dados PostgreSQL. O frontend nunca confia em filtros locais; a própria camada de dados bloqueia qualquer vazamento de informação entre federações distintas.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm ou pnpm
- Uma conta no [Supabase](https://supabase.com/)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/scoreflow-app.git
cd scoreflow-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Preencha o `.env` com as credenciais do seu projeto Supabase.

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:5173`

---

## 🗺️ Roadmap & Status do Projeto

O escopo completo, regras de negócio detalhadas e divisão de Sprints estão documentados no arquivo [`scoreflow-contexto.html`](./docs/scoreflow-contexto.html).

**Progresso Atual (V1.0 MVP):**

- [x] **Fase 0:** Setup Arquitetural (Vite, Shadcn, Supabase, RLS).
- [x] **Fase 0:** Autenticação, Perfis e Segurança de Rotas.
- [x] **Fase 0:** Gestão de Árbitros (CRUD + Convite por E-mail).
- [ ] **Sprint 1:** Painel Admin (Dados Mestres: Aparelhos e Categorias).
- [ ] **Sprint 2:** Gestão de Clubes e Atletas (Upload de documentos).
- [ ] **Sprint 3:** Cadastro de Campeonatos e Configuração.
- [ ] **Sprint 4:** Módulo de Inscrição de Clubes.
- [ ] **Sprint 5:** Ordens de Apresentação (Drag-and-Drop).
- [ ] **Sprint 6:** Apuração em Tempo Real (WebSockets & Cálculo FIG).
- [ ] **Sprint 7:** Portal Público (Painel de Divulgação).
- [ ] **Sprint 8:** Relatórios (Exportação Word) e Polimento Final.

---

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.
```