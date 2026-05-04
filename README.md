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
- `POST /reviews`: Adiciona uma avaliação (1 a 5 estrelas) de um usuário a um mangá.

## 💬 Engajamento (Tabelas Relacionais)

O sistema possui três tabelas principais para engajamento dos usuários com os mangás:

- `favorites`: Relação de mangás favoritados pelos usuários.
- `reviews`: Sistema de notas (rating) de usuários para os mangás.
- `comments`: Comentários atrelados a um mangá e um usuário.

**Rotas de Engajamento:**

- `POST /reviews`: Adiciona uma avaliação (1 a 5 estrelas).
- `POST /favorites`: Favorita um mangá.
- `POST /comments`: Adiciona um comentário a um mangá.

## 📚 Gestão de Conteúdo (Admin)

O sistema permite o gerenciamento completo do ciclo de vida dos mangás, desde o cadastro inicial até a publicação de capítulos.

### Rotas de Mangás

- `GET /mangas`: Lista todos os mangás.
- `POST /mangas`: Cadastra um novo mangá.
- `PUT /mangas/:id`: Atualiza dados de um mangá existente.
- `DELETE /mangas/:id`: Remove um mangá e todo o seu conteúdo relacionado (cascata).
- `PATCH /users/:id/avatar`: Faz o upload da foto de perfil para a AWS S3 e atualiza o banco de dados.
- `PATCH /users/:id/cover`: Faz o upload da capa do mangá para a AWS S3 e atualiza o banco de dados.

### Estrutura de Publicação

- **Volumes**: Organização lógica de capítulos dentro de um mangá.
- **Capítulos**: Contém o número do capítulo, título e a lista de links (JSON) das páginas para leitura.
