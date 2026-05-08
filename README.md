# Over-Reader 📚

Plataforma de leitura de mangás dividida em um monorepo.

## 🛠️ Stack Tecnológica

- **Backend:** Node.js, Express, PostgreSQL, Drizzle ORM
- **Frontend (Web e Admin):** Next.js, shadcn/ui
- **Cloud/Armazenamento:** AWS S3 (Uploads via Multer)
- **Boas Práticas:** SOLID, Clean Code, TDD, DRY

## 📁 Estrutura do Monorepo

- `/apps/backend`: API principal
- `/apps/admin`: Painel de controle do administrador
- `/apps/web`: Plataforma voltada para o usuário final

## 🏃‍♂️ Como rodar o projeto

Este projeto utiliza o **Turborepo** para gerenciar a execução dos aplicativos.
Na pasta raiz, você pode usar os seguintes comandos:

- `npm run dev`: Inicia o servidor de desenvolvimento de todos os apps simultaneamente.
- `npm run build`: Cria a versão de produção de todos os apps.
- `npm run lint`: Executa a verificação de código em todos os apps.

## 🎨 Design System & UI

- **Biblioteca Central:** `packages/ui`
- **Ferramentas:** Tailwind CSS + shadcn/ui
- **Consumo:** Os apps `web` e `admin` utilizam componentes compartilhados para garantir consistência visual e facilitar a manutenção (SOLID/DRY).

## ⚙️ Arquitetura do Backend

O backend foi construído visando os princípios SOLID e Clean Architecture:

- `src/routes`: Definição dos endpoints.
- `src/controllers`: Validação de entrada e saída, e integração com AWS S3.
- `src/useCases`: Regras de negócio da aplicação (ex: cadastro de mangás, ranking de engajamento).
- `src/repositories`: Acesso a dados via Drizzle ORM / PostgreSQL.

## 🗄️ Banco de Dados (Drizzle + PostgreSQL)

As entidades do banco estão localizadas em `apps/backend/src/entities`. A arquitetura relacional utiliza exclusão em cascata (`ON DELETE cascade`) para manter a integridade dos dados.

**Comandos úteis do Banco de Dados (Rode dentro de `apps/backend`):**

- `npm run db:generate`: Gera os arquivos de migração.
- `npm run db:push`: Sincroniza as tabelas com o banco de dados.

## 📚 Gestão de Conteúdo e Uploads (Admin)

O sistema permite o gerenciamento completo do ciclo de vida dos mangás, estruturado em três níveis hierárquicos:

1. **Mangás:** Obra principal (Capa, Banner, Título, Sinopse).
2. **Volumes:** Organização lógica (Arco/Saga) atrelada a um mangá.
3. **Capítulos:** Páginas de leitura atreladas a um volume.

**Uploads para AWS S3:**
A plataforma suporta envio de arquivos únicos (Capas e Banners de Mangás/Volumes) e envios em lote (Upload múltiplo de até 100 páginas simultâneas por capítulo, salvas em um JSON Array no banco).

## 🛡️ Módulo: Painel Administrativo (Admin)

O painel de controle do **Over Reader** foi construído com foco em produtividade e consistência de dados, utilizando **Next.js (App Router)** e componentes do **shadcn/ui**, integrado à nossa API REST (Node.js + Drizzle ORM).

### ✨ Funcionalidades Principais

- **Gestão de Mangás (CRUD):** \* Cadastro detalhado de obras com upload simultâneo de Capa e Banner para a nuvem (**AWS S3**).
    - Exclusão segura com deleção em cascata (apaga os volumes e capítulos vinculados automaticamente no PostgreSQL).
- **Organização de Volumes:** \* Interface alternável entre Grid (visual) e Tabela (analítica).
    - Upload e preview dinâmico das capas das edições físicas.
- **Gerenciador de Capítulos:** \* Upload de imagens em lote (múltiplas páginas simultâneas).
    - Geração automática de _thumbnails_ utilizando a primeira página do capítulo.
    - **Sistema de Rollback:** Proteção contra falhas de rede — caso o envio para a AWS falhe, o banco de dados desfaz a transação para evitar "capítulos fantasmas".
- **Arquitetura UI/UX:**
    - Tratamento de estado resiliente (Loadings, Erros 404/500 interceptados).
    - Layout construído em um ambiente Monorepo (Turborepo), garantindo reaproveitamento de componentes UI.

### 🔒 Segurança e Autenticação

- **Proteção de Borda (Edge):** Utilização do `proxy.ts` (novo padrão Next.js) para interceptar requisições e garantir que apenas usuários com tokens válidos acessem o painel.
- **Criptografia:** Senhas protegidas no banco de dados (PostgreSQL) com `bcryptjs`.
- **Sessão:** Autenticação baseada em Tokens JWT (JSON Web Tokens) com validade configurável.
