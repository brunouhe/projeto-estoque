# Sistema de Controle de Estoque

**FACULDADE GRAN**  
**Projeto da Disciplina Projeto Integrador**

## Descrição

Sistema Fullstack desenvolvido para gerenciar produtos, fornecedores e as associações existentes entre eles.

A aplicação permite realizar operações de cadastro, consulta, atualização e exclusão, utilizando uma API desenvolvida com Node.js e um banco de dados SQLite.

## Funcionalidades

### Produtos

- Cadastrar produtos
- Listar produtos
- Editar produtos
- Excluir produtos
- Registrar nome, código de barras, descrição, quantidade, categoria, validade e imagem

### Fornecedores

- Cadastrar fornecedores
- Listar fornecedores
- Editar fornecedores
- Excluir fornecedores
- Registrar nome da empresa, CNPJ, endereço, telefone, e-mail e contato principal

### Associação Produto/Fornecedor

- Associar produtos a fornecedores
- Desassociar produtos de fornecedores
- Impedir associações duplicadas
- Consultar fornecedores de determinado produto
- Consultar produtos de determinado fornecedor
- Permitir relacionamento muitos para muitos

## Tecnologias utilizadas

### Backend

- Node.js
- Express
- SQLite
- CORS

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Ferramentas

- Visual Studio Code
- Live Server
- Git
- GitHub
- Insomnia ou Postman

## Estrutura do projeto

```text
Projeto_Estoque/
├── backend/
│   ├── app.js
│   ├── database.js
│   ├── estoque.db
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Como executar o projeto

### 1. Instalar as dependências do backend

Abra o terminal na pasta `backend` e execute:

```bash
npm install
```

### 2. Iniciar o servidor

Ainda na pasta `backend`, execute:

```bash
node app.js
```

O servidor será iniciado em:

```text
http://localhost:3000
```

### 3. Iniciar o frontend

Abra o arquivo `frontend/index.html` utilizando a extensão Live Server do Visual Studio Code.

## Principais rotas da API

### Produtos

| Método | Rota | Função |
|---|---|---|
| GET | `/produtos` | Listar produtos |
| POST | `/produtos` | Cadastrar produto |
| PUT | `/produtos/:id` | Atualizar produto |
| DELETE | `/produtos/:id` | Excluir produto |

### Fornecedores

| Método | Rota | Função |
|---|---|---|
| GET | `/fornecedores` | Listar fornecedores |
| POST | `/fornecedores` | Cadastrar fornecedor |
| PUT | `/fornecedores/:id` | Atualizar fornecedor |
| DELETE | `/fornecedores/:id` | Excluir fornecedor |

### Associações

| Método | Rota | Função |
|---|---|---|
| GET | `/associacoes` | Listar todas as associações |
| POST | `/associacoes` | Criar uma associação |
| DELETE | `/associacoes` | Remover uma associação |
| GET | `/associacoes/produto/:produtoId` | Consultar fornecedores de um produto |
| GET | `/associacoes/fornecedor/:fornecedorId` | Consultar produtos de um fornecedor |

## Relacionamento muitos para muitos

Um produto pode ser fornecido por diversos fornecedores, enquanto um fornecedor pode oferecer diversos produtos.

Esse relacionamento é armazenado na tabela `associacoes`, utilizando os campos:

- `produtoId`
- `fornecedorId`

## Testes

As funcionalidades foram testadas pelo frontend e por requisições HTTP ao backend.

Foram verificados:

- Cadastro, edição e exclusão de produtos
- Cadastro, edição e exclusão de fornecedores
- Criação e remoção de associações
- Bloqueio de associações duplicadas
- Consulta por produto
- Consulta por fornecedor
- Comunicação entre frontend, backend e banco de dados

## Autor

**Bruno Uhe Sant Anna de Souza**  
Projeto acadêmico desenvolvido para a disciplina Projeto Integrador da Faculdade GRAN.