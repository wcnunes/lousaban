# LousaBan - Quadro Estilo Kanban Inteligente

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

