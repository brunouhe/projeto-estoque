const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const caminhoBanco = path.join(__dirname, "estoque.db");

const db = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.message);
    } else {
        console.log("Banco de dados conectado com sucesso!");
    }
});
db.run(`
    CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeEmpresa TEXT NOT NULL,
        cnpj TEXT NOT NULL UNIQUE,
        endereco TEXT,
        telefone TEXT,
        email TEXT,
        contatoPrincipal TEXT
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeProduto TEXT NOT NULL,
        codigoBarras TEXT NOT NULL UNIQUE,
        descricao TEXT,
        quantidadeEstoque INTEGER NOT NULL,
        categoria TEXT NOT NULL,
        dataValidade TEXT,
        imagemProduto TEXT
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS associacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produtoId INTEGER NOT NULL,
        fornecedorId INTEGER NOT NULL,
        FOREIGN KEY (produtoId) REFERENCES produtos(id),
        FOREIGN KEY (fornecedorId) REFERENCES fornecedores(id),
        UNIQUE (produtoId, fornecedorId)
    )
`);

module.exports = db;