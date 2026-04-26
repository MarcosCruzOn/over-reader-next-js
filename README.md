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