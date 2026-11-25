# Gerenciador de Estoque

Sistema web para gerenciamento de produtos e controle de estoque, desenvolvido com Node.js, TypeScript e MongoDB.

## Funcionalidades

- Cadastro de produtos.
- Listagem de produtos cadastrados.
- Edição de informações dos produtos.
- Exclusão de produtos.
- Pesquisa e filtros de produtos.
- Controle de entrada e saída de estoque.
- Histórico de movimentações.
- Consulta de quantidade disponível e estoque mínimo.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- MongoDB Atlas
- Mongoose
- HTML
- CSS
- JavaScript
- Zod

## Como executar o projeto

1. Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

2. Entre na pasta do projeto:

```bash
cd proj002
```

3. Instale as dependências:

```bash
npm install
```

4. Configure o arquivo `.env` com a conexão do MongoDB.

5. Inicie o servidor:

```bash
npm run dev
```

6. Acesse no navegador:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── validators/
└── public/
    ├── css/
    ├── js/
    └── index.html
```

## Objetivo

O projeto foi desenvolvido para praticar operações CRUD, desenvolvimento de APIs, integração com banco de dados e construção de uma interface web para gerenciamento de produtos e estoque.