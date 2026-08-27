const express = require("express");
const db = require("./database");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

// Lista temporária de fornecedores
const fornecedores = [];

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Projeto Estoque funcionando!"
    });
});

// Cadastrar fornecedor no banco de dados
app.post("/fornecedores", (req, res) => {
    const {
        nomeEmpresa,
        cnpj,
        endereco,
        telefone,
        email,
        contatoPrincipal
    } = req.body;

    // Verificar campos obrigatórios
    if (!nomeEmpresa || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({
            mensagem: "Todos os campos obrigatórios devem ser preenchidos."
        });
    }

    // Verificar se o CNPJ já existe no banco
    db.get(
        "SELECT * FROM fornecedores WHERE cnpj = ?",
        [cnpj],
        (erro, fornecedorExistente) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao consultar o banco de dados."
                });
            }

            if (fornecedorExistente) {
                return res.status(400).json({
                    mensagem: "Fornecedor com esse CNPJ já está cadastrado!"
                });
            }

            // Inserir fornecedor no banco
            const sql = `
                INSERT INTO fornecedores
                (nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    nomeEmpresa,
                    cnpj,
                    endereco,
                    telefone,
                    email,
                    contatoPrincipal
                ],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao cadastrar fornecedor."
                        });
                    }

                    res.status(201).json({
                        mensagem: "Fornecedor cadastrado com sucesso!",
                        fornecedor: {
                            id: this.lastID,
                            nomeEmpresa,
                            cnpj,
                            endereco,
                            telefone,
                            email,
                            contatoPrincipal
                        }
                    });
                }
            );
        }
    );
});

// Listar fornecedores do banco de dados
app.get("/fornecedores", (req, res) => {
    db.all(
        "SELECT * FROM fornecedores",
        [],
        (erro, fornecedores) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao buscar fornecedores."
                });
            }

            res.json(fornecedores);
        }
    );
});
// Atualizar fornecedor no banco de dados
app.put("/fornecedores/:id", (req, res) => {
    const { id } = req.params;

    const {
        nomeEmpresa,
        cnpj,
        endereco,
        telefone,
        email,
        contatoPrincipal
    } = req.body;

    if (!nomeEmpresa || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({
            mensagem: "Todos os campos obrigatórios devem ser preenchidos."
        });
    }

    const sql = `
        UPDATE fornecedores
        SET nomeEmpresa = ?,
            cnpj = ?,
            endereco = ?,
            telefone = ?,
            email = ?,
            contatoPrincipal = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            nomeEmpresa,
            cnpj,
            endereco,
            telefone,
            email,
            contatoPrincipal,
            id
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao atualizar fornecedor."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: "Fornecedor não encontrado."
                });
            }

            res.json({
                mensagem: "Fornecedor atualizado com sucesso!"
            });
        }
    );
});
// Excluir fornecedor do banco de dados
app.delete("/fornecedores/:id", (req, res) => {
    const { id } = req.params;

    // Primeiro, remover associações ligadas a este fornecedor
    db.run(
        "DELETE FROM associacoes WHERE fornecedorId = ?",
        [id],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao remover associações do fornecedor."
                });
            }

            // Depois, excluir o fornecedor
            db.run(
                "DELETE FROM fornecedores WHERE id = ?",
                [id],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao excluir fornecedor."
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            mensagem: "Fornecedor não encontrado."
                        });
                    }

                    res.json({
                        mensagem: "Fornecedor excluído com sucesso!"
                    });
                }
            );
        }
    );
});
// Lista temporária de produtos
const produtos = [];

// Cadastrar produto no banco de dados
app.post("/produtos", (req, res) => {
    const {
        nomeProduto,
        codigoBarras,
        descricao,
        quantidadeEstoque,
        categoria,
        dataValidade,
        imagemProduto
    } = req.body;

    // Verificar campos obrigatórios
    if (!nomeProduto || !descricao || !categoria || quantidadeEstoque === undefined) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios do produto."
        });
    }

    // Verificar se o código de barras já existe no banco
    db.get(
        "SELECT * FROM produtos WHERE codigoBarras = ?",
        [codigoBarras],
        (erro, produtoExistente) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao consultar o banco de dados."
                });
            }

            if (codigoBarras && produtoExistente) {
                return res.status(400).json({
                    mensagem: "Produto com este código de barras já está cadastrado!"
                });
            }

            // Inserir produto no banco
            const sql = `
                INSERT INTO produtos
                (
                    nomeProduto,
                    codigoBarras,
                    descricao,
                    quantidadeEstoque,
                    categoria,
                    dataValidade,
                    imagemProduto
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    nomeProduto,
                    codigoBarras,
                    descricao,
                    quantidadeEstoque,
                    categoria,
                    dataValidade,
                    imagemProduto
                ],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao cadastrar produto."
                        });
                    }

                    res.status(201).json({
                        mensagem: "Produto cadastrado com sucesso!",
                        produto: {
                            id: this.lastID,
                            nomeProduto,
                            codigoBarras,
                            descricao,
                            quantidadeEstoque,
                            categoria,
                            dataValidade,
                            imagemProduto
                        }
                    });
                }
            );
        }
    );
});

// Listar produtos do banco de dados
app.get("/produtos", (req, res) => {
    db.all(
        "SELECT * FROM produtos",
        [],
        (erro, produtos) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao buscar produtos."
                });
            }

            res.json(produtos);
        }
    );
});

// Atualizar produto no banco de dados
app.put("/produtos/:id", (req, res) => {
    const { id } = req.params;

    const {
        nomeProduto,
        codigoBarras,
        descricao,
        quantidadeEstoque,
        categoria,
        dataValidade,
        imagemProduto
    } = req.body;

    // Verificar campos obrigatórios
    if (
        !nomeProduto ||
        !descricao ||
        !categoria ||
        quantidadeEstoque === undefined
    ) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios do produto."
        });
    }

    // Verificar se outro produto já usa o mesmo código de barras
    db.get(
        `SELECT * FROM produtos
         WHERE codigoBarras = ? AND id != ?`,
        [codigoBarras, id],
        (erro, produtoExistente) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao consultar o banco de dados."
                });
            }

            if (codigoBarras && produtoExistente) {
                return res.status(400).json({
                    mensagem: "Produto com este código de barras já está cadastrado!"
                });
            }

            const sql = `
                UPDATE produtos
                SET nomeProduto = ?,
                    codigoBarras = ?,
                    descricao = ?,
                    quantidadeEstoque = ?,
                    categoria = ?,
                    dataValidade = ?,
                    imagemProduto = ?
                WHERE id = ?
            `;

            db.run(
                sql,
                [
                    nomeProduto,
                    codigoBarras,
                    descricao,
                    quantidadeEstoque,
                    categoria,
                    dataValidade,
                    imagemProduto,
                    id
                ],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao atualizar produto."
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            mensagem: "Produto não encontrado."
                        });
                    }

                    res.json({
                        mensagem: "Produto atualizado com sucesso!"
                    });
                }
            );
        }
    );
});
// Excluir produto do banco de dados
app.delete("/produtos/:id", (req, res) => {
    const { id } = req.params;

    // Primeiro, remover associações ligadas a este produto
    db.run(
        "DELETE FROM associacoes WHERE produtoId = ?",
        [id],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao remover associações do produto."
                });
            }

            // Depois, excluir o produto
            db.run(
                "DELETE FROM produtos WHERE id = ?",
                [id],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao excluir produto."
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            mensagem: "Produto não encontrado."
                        });
                    }

                    res.json({
                        mensagem: "Produto excluído com sucesso!"
                    });
                }
            );
        }
    );
});
// Lista temporária de associações entre produtos e fornecedores
const associacoes = [];

// Associar fornecedor a produto no banco de dados
app.post("/associacoes", (req, res) => {
    const { produtoId, fornecedorId } = req.body;

    // Verificar se o produto existe
    db.get(
        "SELECT * FROM produtos WHERE id = ?",
        [produtoId],
        (erro, produto) => {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao consultar produto."
                });
            }

            if (!produto) {
                return res.status(404).json({
                    mensagem: "Produto não encontrado."
                });
            }

            // Verificar se o fornecedor existe
            db.get(
                "SELECT * FROM fornecedores WHERE id = ?",
                [fornecedorId],
                (erro, fornecedor) => {

                    if (erro) {
                        return res.status(500).json({
                            mensagem: "Erro ao consultar fornecedor."
                        });
                    }

                    if (!fornecedor) {
                        return res.status(404).json({
                            mensagem: "Fornecedor não encontrado."
                        });
                    }

                    // Verificar se a associação já existe
                    db.get(
                        `SELECT * FROM associacoes
                         WHERE produtoId = ? AND fornecedorId = ?`,
                        [produtoId, fornecedorId],
                        (erro, associacaoExistente) => {

                            if (erro) {
                                return res.status(500).json({
                                    mensagem: "Erro ao consultar associação."
                                });
                            }

                            if (associacaoExistente) {
                                return res.status(400).json({
                                    mensagem: "Fornecedor já está associado a este produto!"
                                });
                            }

                            // Criar associação
                            db.run(
                                `INSERT INTO associacoes
                                 (produtoId, fornecedorId)
                                 VALUES (?, ?)`,
                                [produtoId, fornecedorId],
                                function (erro) {

                                    if (erro) {
                                        return res.status(500).json({
                                            mensagem: "Erro ao criar associação."
                                        });
                                    }

                                    res.status(201).json({
                                        mensagem: "Fornecedor associado com sucesso ao produto!",
                                        associacao: {
                                            id: this.lastID,
                                            produtoId: Number(produtoId),
                                            fornecedorId: Number(fornecedorId)
                                        }
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});
// Listar associações do banco de dados
app.get("/associacoes", (req, res) => {
    db.all(
        "SELECT * FROM associacoes",
        [],
        (erro, associacoes) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao buscar associações."
                });
            }

            res.json(associacoes);
        }
    );
});
// Consultar fornecedores associados a um produto
app.get("/associacoes/produto/:produtoId", (req, res) => {
  const { produtoId } = req.params;

  db.all(
    `SELECT fornecedores.*
     FROM fornecedores
     INNER JOIN associacoes
       ON fornecedores.id = associacoes.fornecedorId
     WHERE associacoes.produtoId = ?`,
    [produtoId],
    (erro, fornecedores) => {
      if (erro) {
        return res.status(500).json({
          mensagem: "Erro ao buscar fornecedores do produto."
        });
      }

      res.json(fornecedores);
    }
  );
});

// Consultar produtos associados a um fornecedor
app.get("/associacoes/fornecedor/:fornecedorId", (req, res) => {
  const { fornecedorId } = req.params;

  db.all(
    `SELECT produtos.*
     FROM produtos
     INNER JOIN associacoes
       ON produtos.id = associacoes.produtoId
     WHERE associacoes.fornecedorId = ?`,
    [fornecedorId],
    (erro, produtos) => {
      if (erro) {
        return res.status(500).json({
          mensagem: "Erro ao buscar produtos do fornecedor."
        });
      }

      res.json(produtos);
    }
  );
});
// Desassociar fornecedor de produto no banco de dados
app.delete("/associacoes", (req, res) => {
    const { produtoId, fornecedorId } = req.body;

    db.run(
        `DELETE FROM associacoes
         WHERE produtoId = ? AND fornecedorId = ?`,
        [produtoId, fornecedorId],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    mensagem: "Erro ao desassociar fornecedor."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: "Associação não encontrada."
                });
            }

            res.json({
                mensagem: "Fornecedor desassociado com sucesso!"
            });
        }
    );
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});