const formProduto = document.getElementById("formProduto");
const formAssociacao = document.getElementById("formAssociacao");
const produtoAssociacao = document.getElementById("produtoAssociacao");
const fornecedorAssociacao = document.getElementById("fornecedorAssociacao");
const listaAssociacoes = document.getElementById("listaAssociacoes");

let produtoEditandoId = null;
document.querySelector("#formProduto button").textContent = "Cadastrar Produto";

formProduto.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const produto = {
        nomeProduto: document.getElementById("nomeProduto").value,
        codigoBarras: document.getElementById("codigoBarras").value,
        descricao: document.getElementById("descricao").value,
        quantidadeEstoque: Number(
            document.getElementById("quantidadeEstoque").value
        ),
        categoria: document.getElementById("categoria").value,
        dataValidade: document.getElementById("dataValidade").value || null,
        imagemProduto: document.getElementById("imagemProduto").value || null
    };

    try {
       const url = produtoEditandoId
    ? `http://localhost:3000/produtos/${produtoEditandoId}`
    : "http://localhost:3000/produtos";

const metodo = produtoEditandoId ? "PUT" : "POST";

const resposta = await fetch(url, {
    method: metodo,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
});

        const dados = await resposta.json();

        if (resposta.ok) {
    const fornecedorId = document.getElementById("fornecedorProduto").value;

    if (!produtoEditandoId && fornecedorId && dados.produto?.id) {
        await fetch("http://localhost:3000/associacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                produtoId: dados.produto.id,
                fornecedorId: Number(fornecedorId)
            })
        });
    }
if (produtoEditandoId) {
    const respostaAssociacoes = await fetch(
        "http://localhost:3000/associacoes"
    );

    const associacoesAtuais = await respostaAssociacoes.json();

    const associacaoAtual = associacoesAtuais.find(
        (assoc) => assoc.produtoId === Number(produtoEditandoId)
    );

    // Se já existe uma associação e o fornecedor mudou,
    // remove a associação antiga
    if (
        associacaoAtual &&
        String(associacaoAtual.fornecedorId) !== String(fornecedorId)
    ) {
        await fetch("http://localhost:3000/associacoes", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                produtoId: Number(produtoEditandoId),
                fornecedorId: associacaoAtual.fornecedorId
            })
        });
    }

    // Se escolheu um fornecedor novo, cria a nova associação
    if (
        fornecedorId &&
        (
            !associacaoAtual ||
            String(associacaoAtual.fornecedorId) !== String(fornecedorId)
        )
    ) {
        await fetch("http://localhost:3000/associacoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                produtoId: Number(produtoEditandoId),
                fornecedorId: Number(fornecedorId)
            })
        });
    }
}
    alert(dados.mensagem);

    formProduto.reset();
    produtoEditandoId = null;
    document.querySelector("#formProduto button").textContent = "Cadastrar Produto";
    carregarProdutos();

        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
});
async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:3000/produtos");
        const produtos = await resposta.json();
        const respostaAssociacoes = await fetch("http://localhost:3000/associacoes");
const associacoes = await respostaAssociacoes.json();

const respostaFornecedores = await fetch("http://localhost:3000/fornecedores");
const fornecedores = await respostaFornecedores.json();
produtoAssociacao.innerHTML =
  '<option value="">Selecione um produto</option>';

produtos.forEach((produto) => {
  const opcao = document.createElement("option");
  opcao.value = produto.id;
  opcao.textContent = produto.nomeProduto;
  produtoAssociacao.appendChild(opcao);
});

fornecedorAssociacao.innerHTML =
  '<option value="">Selecione um fornecedor</option>';

fornecedores.forEach((fornecedor) => {
  const opcao = document.createElement("option");
  opcao.value = fornecedor.id;
  opcao.textContent = fornecedor.nomeEmpresa;
  fornecedorAssociacao.appendChild(opcao);
});
listaAssociacoes.innerHTML = "";

associacoes.forEach((associacao) => {
  const produto = produtos.find(
    (item) => Number(item.id) === Number(associacao.produtoId)
  );

  const fornecedor = fornecedores.find(
    (item) => Number(item.id) === Number(associacao.fornecedorId)
  );

  if (!produto || !fornecedor) {
    return;
  }

  const itemAssociacao = document.createElement("div");

  itemAssociacao.innerHTML = `
    <p>
      <strong>Produto:</strong> ${produto.nomeProduto}<br>
      <strong>Fornecedor:</strong> ${fornecedor.nomeEmpresa}
    </p>
    <button class="btn-desassociar">Desassociar</button>
  `;
const botaoDesassociar =
  itemAssociacao.querySelector(".btn-desassociar");

botaoDesassociar.addEventListener("click", async () => {
  try {
    const resposta = await fetch(
      "http://localhost:3000/associacoes",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          produtoId: Number(associacao.produtoId),
          fornecedorId: Number(associacao.fornecedorId)
        })
      }
    );

    if (resposta.ok) {
      alert("Produto desassociado do fornecedor com sucesso!");
      carregarProdutos();
    } else {
      alert("Não foi possível remover a associação.");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor.");
  }
});
  listaAssociacoes.appendChild(itemAssociacao);
});
    const listaProdutos = document.getElementById("listaProdutos");

listaProdutos.innerHTML = "";

produtos.forEach((produto) => {
    const associacao = associacoes.find(
    (assoc) => assoc.produtoId === produto.id
);

let nomeFornecedor = "Nenhum fornecedor";

if (associacao) {
    const fornecedor = fornecedores.find(
        (forn) => forn.id === associacao.fornecedorId
    );

    if (fornecedor) {
        nomeFornecedor = fornecedor.nomeEmpresa;
    }
}
    const item = document.createElement("div");

    item.innerHTML = `
    <h4>${produto.nomeProduto}</h4>
    <p><strong>Código:</strong> ${produto.codigoBarras}</p>
    <p><strong>Descrição:</strong> ${produto.descricao}</p>
    <p><strong>Quantidade:</strong> ${produto.quantidadeEstoque}</p>
    <p><strong>Categoria:</strong> ${produto.categoria}</p>
    <p><strong>Fornecedor:</strong> ${nomeFornecedor}</p>

    <div class="acoes-produto">
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
    </div>
`;
const botaoEditar = item.querySelector(".btn-editar");

botaoEditar.addEventListener("click", () => {
    produtoEditandoId = produto.id;
    document.querySelector("#formProduto button").textContent = "Salvar Alterações";
    document.getElementById("nomeProduto").value = produto.nomeProduto;
    document.getElementById("codigoBarras").value = produto.codigoBarras;
    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("quantidadeEstoque").value = produto.quantidadeEstoque;
    document.getElementById("categoria").value = produto.categoria;
    document.getElementById("dataValidade").value = produto.dataValidade || "";
    document.getElementById("imagemProduto").value = produto.imagemProduto || "";
    const associacaoAtual = associacoes.find(
    (assoc) => assoc.produtoId === produto.id
);

document.getElementById("fornecedorProduto").value =
    associacaoAtual ? associacaoAtual.fornecedorId : "";
});
    listaProdutos.appendChild(item);
    const botaoExcluir = item.querySelector(".btn-excluir");

botaoExcluir.addEventListener("click", async () => {
    const confirmar = confirm(
        `Deseja realmente excluir o produto "${produto.nomeProduto}"?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/produtos/${produto.id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        if (resposta.ok) {
            carregarProdutos();
        }

    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});
});
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

carregarProdutos();


const formFornecedor = document.getElementById("formFornecedor");
let fornecedorEditandoId = null;
formFornecedor.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const fornecedor = {
        nomeEmpresa: document.getElementById("nomeEmpresa").value,
        cnpj: document.getElementById("cnpj").value,
        endereco: document.getElementById("endereco").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        contatoPrincipal: document.getElementById("contatoPrincipal").value
    };

    try {
        const url = fornecedorEditandoId
    ? `http://localhost:3000/fornecedores/${fornecedorEditandoId}`
    : "http://localhost:3000/fornecedores";

const metodo = fornecedorEditandoId ? "PUT" : "POST";

const resposta = await fetch(url, {
    method: metodo,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(fornecedor)
});

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.mensagem);
            formFornecedor.reset();
            fornecedorEditandoId = null;
document.querySelector("#formFornecedor button").textContent = "Cadastrar Fornecedor";
carregarFornecedores();
            carregarFornecedores();
        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        console.error("Erro ao cadastrar fornecedor:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});
async function carregarFornecedores() {
    try {
        const resposta = await fetch("http://localhost:3000/fornecedores");
        const fornecedores = await resposta.json();
        const selectFornecedor = document.getElementById("fornecedorProduto");

selectFornecedor.innerHTML = `
    <option value="">Selecione um fornecedor</option>
`;

fornecedores.forEach((fornecedor) => {
    const option = document.createElement("option");

    option.value = fornecedor.id;
    option.textContent = fornecedor.nomeEmpresa;

    selectFornecedor.appendChild(option);
});

        const listaFornecedores = document.getElementById("listaFornecedores");

        listaFornecedores.innerHTML = "";

        fornecedores.forEach((fornecedor) => {
            const item = document.createElement("div");

            item.innerHTML = `
                <h4>${fornecedor.nomeEmpresa}</h4>
                <p><strong>CNPJ:</strong> ${fornecedor.cnpj}</p>
                <p><strong>Endereço:</strong> ${fornecedor.endereco}</p>
                <p><strong>Telefone:</strong> ${fornecedor.telefone}</p>
                <p><strong>E-mail:</strong> ${fornecedor.email}</p>
                <p><strong>Contato:</strong> ${fornecedor.contatoPrincipal}</p>
                <div class="acoes-produto">
    <button class="btn-editar-fornecedor">Editar</button>
    <button class="btn-excluir-fornecedor">Excluir</button>
</div>
            `;

            listaFornecedores.appendChild(item);

            const botaoEditarFornecedor = item.querySelector(".btn-editar-fornecedor");

botaoEditarFornecedor.addEventListener("click", () => {
    fornecedorEditandoId = fornecedor.id;

    document.getElementById("nomeEmpresa").value = fornecedor.nomeEmpresa;
    document.getElementById("cnpj").value = fornecedor.cnpj;
    document.getElementById("endereco").value = fornecedor.endereco;
    document.getElementById("telefone").value = fornecedor.telefone;
    document.getElementById("email").value = fornecedor.email;
    document.getElementById("contatoPrincipal").value = fornecedor.contatoPrincipal;

    document.querySelector("#formFornecedor button").textContent = "Salvar Alterações";
});
            const botaoExcluirFornecedor = item.querySelector(".btn-excluir-fornecedor");

botaoExcluirFornecedor.addEventListener("click", async () => {
    const confirmar = confirm(
        `Deseja realmente excluir o fornecedor "${fornecedor.nomeEmpresa}"?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/fornecedores/${fornecedor.id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        if (resposta.ok) {
            carregarFornecedores();
        }

    } catch (erro) {
        console.error("Erro ao excluir fornecedor:", erro);
        alert("Erro ao conectar com o servidor.");
    }
});
        });

    } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
    }
}

carregarFornecedores();
formAssociacao.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const produtoId = Number(produtoAssociacao.value);
  const fornecedorId = Number(fornecedorAssociacao.value);

  if (!produtoId || !fornecedorId) {
    alert("Selecione um produto e um fornecedor.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/associacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        produtoId,
        fornecedorId
      })
    });

    if (resposta.ok) {
      alert("Produto associado ao fornecedor com sucesso!");
      formAssociacao.reset();
      carregarProdutos();
    } else {
      const dados = await resposta.json();
      alert(
  dados.mensagem ||
  dados.erro ||
  "Não foi possível realizar a associação."
);
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor.");
  }
});