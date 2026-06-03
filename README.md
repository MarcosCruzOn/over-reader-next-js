# Over-Reader 📚

Plataforma de leitura de mangás dividida em um monorepo.

## 🛠️ Stack Tecnológica

- **Backend:** Node.js, Express, PostgreSQL, Drizzle ORM
- **Frontend (Web e Admin):** Next.js, shadcn/ui
- **Cloud/Armazenamento:** AWS S3 (Uploads via Multer)
- **Infraestrutura:** AWS EC2, AWS RDS, Nginx, PM2, Vercel
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

## ☁️ Infraestrutura e Deploy (Produção)

O sistema opera em uma arquitetura distribuída na nuvem, garantindo segurança e alta disponibilidade:

- **Frontend (Vercel):** Os aplicativos Web e Admin são servidos via edge network com CI/CD automatizado.
- **Backend (AWS EC2):** Instância Amazon Linux rodando a API Node.js. O **PM2** gerencia os processos em segundo plano, garantindo que o servidor reinicie automaticamente em caso de falhas.
- **Proxy Reverso e SSL:** O **Nginx** intercepta o tráfego web nas portas 80/443 e roteia para a porta interna da API. A segurança é garantida por um certificado SSL gratuito gerado pelo **Let's Encrypt (Certbot)**.
- **Banco de Dados (AWS RDS):** Instância PostgreSQL gerenciada e isolada em nuvem, acessível externamente apenas por IPs autorizados via Security Groups.

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
4. **Uploads para AWS S3:** Suporte a envio de arquivos únicos (Capas/Banners) e envios em lote (Upload múltiplo de até 100 páginas simultâneas por capítulo, salvas em um JSON Array no banco).

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

## ⭐️ Sistema de Avaliação e Ranking de Obras

Funcionalidade que permite aos leitores avaliarem mangás de 1 a 5 estrelas. A pontuação geral reflete o engajamento coletivo em tempo real.

- **Arquitetura de Dados:** Tabela `reviews` armazena as interações. Um índice único (`user_manga_review_idx`) assegura apenas uma avaliação por usuário por obra, acionando um `UPSERT` para reavaliações.
- **Endpoints de Estatísticas:** Uso de agregadores SQL (`avg` e `count`) para calcular a média formatada e o volume de votos em tempo real.
- **Componente Interativo:** `MangaRating.tsx` apresenta estados reativos de hover e atualiza a média global imediatamente após o voto sem recarregamento.

### 🗄️ Arquitetura do Banco de Dados (`Drizzle ORM`)

- **Tabela `reviews`:** Armazena o ID do usuário, ID do mangá, nota inteira e o comentário descritivo (opcional).
- **Índice Único (`user_manga_review_idx`):** Implementado para assegurar que cada usuário possua apenas uma avaliação por obra. Tentativas posteriores de avaliação acionam o fluxo inteligente de `UPSERT` (atualização da nota antiga).

### 🛣️ Endpoints do Backend (`Express API`)

- `POST /reviews` -> Executa o fluxo de criação ou re-avaliação do mangá, calculando as regras de negócio de notas válidas (entre 1 e 5).
- `GET /reviews/user/:userId/:mangaId` -> Resgata a nota específica que o leitor autenticado atribuiu à obra no passado.
- `GET /reviews/manga/:mangaId/stats` -> Utiliza agregadores SQL (`avg` e `count`) para calcular em tempo real a média de estrelas formatada (com uma casa decimal) e o volume total de votos do mangá.
- `GET /reviews/user/:userId` -> Coleta o histórico completo de obras avaliadas por um leitor para exibição no painel privado.

### 🎨 Componentes do Frontend (`Next.js / Tailwind CSS`)

- **`MangaRating.tsx`:** Componente interativo que renderiza o conjunto de estrelas na página pública do mangá. Apresenta estados reativos de _hover_ visual (as estrelas acendem antes do clique) e atualiza a média global imediatamente após o voto sem necessidade de recarregamento de página.
- **`PerfilPage (Aba Avaliações)`:** Painel que mapeia os dados do usuário e renderiza uma grelha contendo os cards dos mangás que o leitor avaliou, exibindo a respectiva nota e a miniatura da capa correspondente.

## 💬 Ecossistema Social e Interação (Comunidade)

O Over-Reader possui um sistema de comunidade robusto e em tempo real, focado no engajamento dos leitores durante o consumo das obras.

- **Comentários Aninhados (Mini-chats):** Sistema de comentários por capítulo com suporte a respostas em múltiplos níveis. A interface "achata" a visualização (estilo YouTube), garantindo que a área de comentários permaneça limpa, legível e ancorada ao comentário raiz, mesmo com centenas de respostas.
- **Notificações em Tempo Real (WebSockets):** Integração com `socket.io` no backend e frontend. Os usuários recebem notificações instantâneas (sem necessidade de recarregar a página) sempre que alguém curte ou responde aos seus comentários, refletindo na interface com um alerta visual (sino).
- **Modo Leitura Premium:** Interface de comunidade unificada na barra superior (Reading Bar), com esquema de cores `Dark Mode` adaptado para conforto visual durante a leitura, inputs de tamanho fixo e hierarquia clara de tipografia.
- **Centro de Moderação (Painel Admin):** Sistema integrado de denúncias contra conteúdos inapropriados. Os administradores possuem uma tela dedicada no painel (`/denuncias`) para julgar reportes da comunidade, com poder de exclusão de comentários em cascata (apagando respostas e curtidas associadas) ou anistia (ignorar denúncia), mantendo a plataforma segura.
- **Arquitetura DRY no Painel Admin:** Uso inteligente do `layout.tsx` do Next.js App Router para envolver todas as rotas administrativas no esqueleto do _Sidebar_ do Shadcn UI, garantindo rotas limpas e escaláveis sem repetição de código.
