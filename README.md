# Over-Reader 📚

Plataforma de leitura de mangás dividida em um monorepo.

## 🛠️ Stack Tecnológica

- **Backend:** Node.js, Express, PostgreSQL, Drizzle ORM
- **Frontend (Web e Admin):** Next.js, shadcn/ui
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
- `src/controllers`: Validação de entrada e saída.
- `src/useCases`: Regras de negócio da aplicação (ex: cadastro de mangás, ranking de engajamento).
- `src/repositories`: Acesso a dados via Drizzle ORM / PostgreSQL.

**Para rodar isoladamente:**
Acesse `apps/backend` e rode `npm run dev`.

## 🗄️ Banco de Dados (Drizzle + PostgreSQL)

As entidades do banco estão localizadas em `apps/backend/src/entities`.

**Comandos úteis do Banco de Dados (Rode dentro de `apps/backend`):**

- `npm run db:generate`: Gera os arquivos de migração.
- `npm run db:push`: Sincroniza as tabelas com o banco de dados.

## 👥 Gestão de Mangás e Usuários (Backend)

A API de mangás e usuários também segue os princípios de Clean Architecture.
A tabela `users` garante unicidade de emails e gerencia os níveis de acesso e status da conta.

**Entidades e Rotas Principais:**

- `POST /mangas`: Cadastro de novos mangás.
- `POST /users`: Cadastro de novos usuários (Role padrão: 'USER', Status padrão: 'ativo').
- `GET /users`: Lista todos os usuários cadastrados.
- `PATCH /users/:id/status`: Altera o status de um usuário (ativo, banido, suspenso).
