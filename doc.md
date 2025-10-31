Pra rodar a API é necessário:


npm run dev

Pra rodar o banco:
npx prisma studio


🗂️ Projeto: Interapoints 2.0 — Resumo da Estrutura
📁 frontend/ — Interface do Usuário
index.html

Página principal: lista todas as tarefas.

Usa o script script.js.

nova-tarefa.html

Página com formulário para criar novas tarefas.

Usa o script nova-tarefa.js.

script.js

Executa ao carregar index.html.

Faz GET /tarefas no backend.

Renderiza tarefas na tela.

Calcula e exibe estatísticas (total, feitas, pendentes, progresso).

Usa a função criarTarefa (definida no próprio script).

Importa criarAreaDeAvaliacao de avaliacao.js.

nova-tarefa.js

Captura o envio do formulário.

Faz POST /tarefas pro backend.

Redireciona pra index.html após criar a tarefa.

avaliacao.js

Define a função criarAreaDeAvaliacao.

Adiciona estrelas e textarea pra avaliar uma tarefa concluída.

Chama uma callback (atualizarContagem) após envio da avaliação.

style.css

Estilos gerais da interface.

Inclui o estilo do componente de loading (.loading, .spinner, etc.).

📁 backend/ — API e Lógica de Servidor
server.js

Servidor Node.js com Express.

Lê variáveis do .env com dotenv.

Conecta ao MongoDB via Prisma.

Define rotas:

GET /tarefas → lista todas as tarefas

POST /tarefas → cria nova tarefa

prisma/schema.prisma

Define o modelo Tarefa usado pelo Prisma.

Lê a conexão via env("DATABASE_URL").