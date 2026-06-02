# ☁️ Guia de Sobrevivência: Infraestrutura AWS

Este documento explica as ferramentas usadas para manter a nossa API no ar, segura e funcionando de forma autônoma na nuvem.

## 1. Nginx (O Recepcionista)

O Nginx é um servidor web. A única função dele na nossa arquitetura é ser um **Proxy Reverso**. Ele fica escutando as portas de internet padrão (80 e 443) e redireciona todo o tráfego de forma invisível para a porta interna onde o nosso backend realmente está rodando (3333).

- **Testar se as configurações estão corretas (sem erros de sintaxe):**
  `sudo nginx -t`
- **Ligar o Nginx:**
  `sudo systemctl start nginx`
- **Fazer o Nginx ligar sozinho se o servidor reiniciar:**
  `sudo systemctl enable nginx`
- **Ver se o Nginx está rodando (status):**
  `sudo systemctl status nginx`

## 2. Certbot / Let's Encrypt (O Segurança)

O Certbot é um robô gratuito que gera certificados SSL. É ele que coloca o "cadeadinho verde" (`https://`) no nosso domínio, criptografando os dados (como senhas de login) para que não sejam interceptados.

- **Gerar um certificado e instalar no Nginx automaticamente:**
  `sudo certbot --nginx -d seu-dominio.duckdns.org`
- _(Nota: O certificado vence a cada 90 dias, mas o Certbot no Linux geralmente cria uma rotina invisível para renovar isso sozinho)._

## 3. PM2 (O Gerente da Cozinha)

O PM2 é um gerenciador de processos para Node.js. Se rodarmos o nosso backend com `npm run dev` no terminal, assim que fecharmos a janela do terminal, o servidor desliga. O PM2 serve para rodar o nosso código em **segundo plano (background)** e religar a API automaticamente se ela travar ou der erro.

- **Ligar a API pela primeira vez (DEVE SER RODADO DENTRO DA PASTA DO BACKEND):**
  `pm2 start npm --name "nome-da-api" -- run dev`
- **Salvar a lista de processos (para religar sozinho se a AWS reiniciar):**
  `pm2 save`
- **Ver a lista de aplicativos rodando:**
  `pm2 status`
- **Ver os logs de erro ou `console.log` da sua aplicação em tempo real:**
  `pm2 logs nome-da-api`
- **Reiniciar a API (após mudar o código ou alterar o arquivo .env):**
  `pm2 restart nome-da-api`
- **Desligar a API:**
  `pm2 stop nome-da-api`
