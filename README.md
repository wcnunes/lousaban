# LousaBan - Quadro Kanban Inteligente

LousaBan é uma aplicação web de quadro Kanban colaborativo, simples e visual, para organizar tarefas e fluxos de trabalho.

## Funcionalidades

- **Criação de quadros ilimitados**: cada quadro possui um link único e pode ser criado instantaneamente.
- **Compartilhamento fácil**: basta copiar o link do quadro para colaborar em tempo real com qualquer pessoa.
- **Arrastar e soltar**: mova tarefas entre colunas de forma intuitiva.
- **Edição rápida**: edite o título das colunas, limite de WIP e o conteúdo das tarefas com apenas um clique.
- **Limite de WIP**: defina limites de tarefas por coluna para melhorar o fluxo do time.
- **Reset do quadro**: recomece o quadro a qualquer momento.
- **Exportação para impressão/PDF**: gere um relatório visual do quadro para apresentação ou arquivamento.
- **Sincronização em tempo real**: todas as alterações são salvas e sincronizadas automaticamente na nuvem (Firestore/Firebase).
- **Acesso multi-dispositivo**: acesse e edite seus quadros de qualquer lugar, basta ter o link.

## Como funciona o acesso
- **Público**: qualquer pessoa com o link pode visualizar e editar o quadro.
- **Privacidade**: não há autenticação, o link é a chave de acesso.

## Tecnologias utilizadas
- React + TypeScript
- Firebase Firestore
- Vite
- TailwindCSS
- @dnd-kit (drag and drop)

---

## Configuração do Firebase (obrigatório)

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. No menu "Configurações do projeto" > "Suas apps" > "App da Web", copie as credenciais do Firebase.
3. Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
VITE_FIREBASE_API_KEY=SEU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=SEU_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=SEU_MEASUREMENT_ID
```

> **Nunca compartilhe seu arquivo `.env.local` ou suas chaves do Firebase publicamente!**

---

## Rodando localmente
1. Instale as dependências: `npm install`
2. Inicie o projeto: `npm run dev`
3. Acesse o endereço exibido no terminal (ex: http://localhost:5173)
