
const API_URL = "/api/produtos";
const API_URL_ESTOQUE = "/api/estoque";

// Elementos da navegação
const itensMenu = document.querySelectorAll(".menu-item");
const tituloPagina = document.getElementById("tituloPagina");
const conteudoPagina = document.getElementById("conteudoPagina");

// Estado da aplicação
let paginaAtual = 1;
let totalPaginas = 1;
let pesquisaAtual = "";
let categoriaAtual = "";
let precoMinAtual = "";
let precoMaxAtual = "";
let ordenarAtual = "mais-recentes";

// =========================
// DASHBOARD
// =========================

const dashboardHTML = `
    <div class="boas-vindas">
        <h1>Bem-vindo ao sistema!</h1>
        <p>
            Gerencie seus produtos e acompanhe
            as movimentações do estoque.
        </p>
    </div>

    <div class="indicadores">
        <div class="indicador">
            <span>Produtos cadastrados</span>
            <h2 id="totalProdutos">Carregando...</h2>
        </div>
    </div>

    <div class="card">
        <h2>Visão geral</h2>
        <p>
            Aqui você poderá acompanhar as principais
            informações dos seus produtos e do estoque.
        </p>
    </div>
`;

// =========================
// PÁGINA DE PRODUTOS
// =========================

const produtosHTML = `
    <div class="boas-vindas">
        <h1>Produtos</h1>
        <p>Gerencie os produtos cadastrados no sistema.</p>
    </div>

    <div class="card">
        <h2 id="tituloFormulario">Cadastrar produto</h2>

        <form id="produtoForm">
            <input type="hidden" id="produtoId">

            <div class="campo">
                <label for="nome">Nome</label>
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome do produto"
                    required
                >
            </div>

            <div class="campo">
                <label for="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    placeholder="Descrição do produto"
                    required
                ></textarea>
            </div>

            <div class="campo">
                <label for="preco">Preço de venda</label>
                <input
                    type="number"
                    id="preco"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="campo">
                <label for="custo">Custo de aquisição</label>
                <input
                    type="number"
                    id="custo"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                >
            </div>

            <div class="campo">
                <label for="quantidadeEstoque">
                    Quantidade inicial em estoque
                </label>
                <input
                    type="number"
                    id="quantidadeEstoque"
                    min="0"
                    step="1"
                    value="0"
                    required
                >
                <small>
                    Depois do cadastro, altere a quantidade
                    pela página de Estoque.
                </small>
            </div>

            <div class="campo">
                <label for="estoqueMinimo">Estoque mínimo</label>
                <input
                    type="number"
                    id="estoqueMinimo"
                    min="0"
                    step="1"
                    value="5"
                    required
                >
            </div>

            <div class="campo">
                <label for="categoria">Categoria</label>
                <input
                    type="text"
                    id="categoria"
                    placeholder="Categoria"
                    required
                >
            </div>

            <div class="botoes">
                <button type="submit" id="btnSalvar">
                    Cadastrar produto
                </button>

                <button
                    type="button"
                    id="btnCancelar"
                    class="btn-cancelar"
                    hidden
                >
                    Cancelar edição
                </button>
            </div>
        </form>

        <p id="mensagem"></p>
    </div>

    <div class="card">
        <h2>Produtos cadastrados</h2>

        <form id="pesquisaForm" class="pesquisa">
            <input
                type="search"
                id="pesquisa"
                placeholder="Pesquisar produto..."
            >

            <button type="submit">Pesquisar</button>
        </form>

        <form id="filtrosForm" class="filtros">

            <div class="campo">
                <label for="filtroCategoria">Categoria</label>
                <input
                    type="text"
                    id="filtroCategoria"
                    placeholder="Ex.: Eletrônicos"
                >
            </div>

            <div class="campo">
                <label for="precoMin">Preço mínimo</label>
                <input
                    type="number"
                    id="precoMin"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                >
            </div>

            <div class="campo">
                <label for="precoMax">Preço máximo</label>
                <input
                    type="number"
                    id="precoMax"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                >
            </div>

            <div class="campo">
                <label for="ordenar">Ordenar por</label>
                <select id="ordenar">
                    <option value="mais-recentes">Mais recentes</option>
                    <option value="mais-antigos">Mais antigos</option>
                    <option value="menor-preco">Menor preço</option>
                    <option value="maior-preco">Maior preço</option>
                </select>
            </div>

            <button type="submit">Aplicar filtros</button>

            <button
                type="button"
                id="btnLimparFiltros"
                class="btn-cancelar"
            >
                Limpar filtros
            </button>

        </form>

        <div class="tabela-container">
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody id="listaProdutos">
                    <tr>
                        <td colspan="5">Carregando produtos...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="paginacao">
            <button id="btnAnterior" disabled>
                Anterior
            </button>

            <span id="infoPagina">Página 1</span>

            <button id="btnProximo" disabled>
                Próximo
            </button>
        </div>
    </div>
`;

// =========================
// PÁGINA DE ESTOQUE
// =========================

const estoqueHTML = `
    <div class="boas-vindas">
        <h1>Controle de estoque</h1>
        <p>
            Registre entradas, saídas e acompanhe
            as quantidades disponíveis.
        </p>
    </div>

    <div class="indicadores">

        <div class="indicador">
            <span>Produtos cadastrados</span>
            <h2 id="estoqueTotalProdutos">0</h2>
        </div>

        <div class="indicador">
            <span>Unidades disponíveis</span>
            <h2 id="estoqueTotalUnidades">0</h2>
        </div>

        <div class="indicador">
            <span>Produtos com estoque baixo</span>
            <h2 id="estoqueBaixo">0</h2>
        </div>

    </div>

    <div class="card">
        <h2>Registrar movimentação</h2>

        <form id="estoqueForm">

            <div class="campo">
                <label for="estoqueProduto">Produto</label>
                <select id="estoqueProduto" required>
                    <option value="">Carregando produtos...</option>
                </select>
            </div>

            <div class="campo">
                <label for="tipoMovimentacao">Tipo de movimentação</label>
                <select id="tipoMovimentacao" required>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>
            </div>

            <div class="campo">
                <label for="quantidadeMovimentacao">Quantidade</label>
                <input
                    type="number"
                    id="quantidadeMovimentacao"
                    min="1"
                    step="1"
                    placeholder="Digite a quantidade"
                    required
                >
            </div>

            <div class="campo">
                <label for="observacaoMovimentacao">Observação</label>
                <textarea
                    id="observacaoMovimentacao"
                    maxlength="200"
                    placeholder="Observação opcional"
                ></textarea>
            </div>

            <div class="botoes">
                <button type="submit" id="btnRegistrarMovimentacao">
                    Registrar movimentação
                </button>
            </div>

        </form>

        <p id="mensagemEstoque"></p>
    </div>

    <div class="card">
        <h2>Histórico de movimentações</h2>

        <div class="tabela-container">
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Observação</th>
                        <th>Data</th>
                    </tr>
                </thead>

                <tbody id="listaMovimentacoes">
                    <tr>
                        <td colspan="5">Carregando histórico...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;

// =========================
// REQUISIÇÕES À API
// =========================

async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, opcoes);
    const texto = await resposta.text();

    let dados = {};

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch {
        throw new Error("O servidor retornou uma resposta inválida.");
    }

    if (!resposta.ok) {
        throw new Error(
            dados.mensagem || "Erro ao realizar operação."
        );
    }

    return dados;
}

// =========================
// DASHBOARD
// =========================

async function carregarTotalProdutos() {
    const indicador = document.getElementById("totalProdutos");

    if (!indicador) return;

    try {
        const resultado = await requisicao(
            `${API_URL}?pagina=1&limite=1`
        );

        indicador.textContent = resultado.paginacao.total;

    } catch (erro) {
        console.error(erro);
        indicador.textContent = "Erro";
    }
}

// =========================
// MENSAGENS
// =========================

function mostrarMensagem(texto, tipo) {
    const elemento = document.getElementById("mensagem");

    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = tipo;
}

function mostrarMensagemEstoque(texto, tipo) {
    const elemento = document.getElementById("mensagemEstoque");

    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = tipo;
}

// =========================
// FORMULÁRIO DE PRODUTOS
// =========================

function limparFormulario() {
    const form = document.getElementById("produtoForm");

    form.reset();

    document.getElementById("produtoId").value = "";

    document.getElementById("quantidadeEstoque").disabled = false;

    document.getElementById("tituloFormulario").textContent =
        "Cadastrar produto";

    document.getElementById("btnSalvar").textContent =
        "Cadastrar produto";

    document.getElementById("btnCancelar").hidden = true;
}

// =========================
// CARREGAR PRODUTOS
// =========================

async function carregarProdutos() {
    const lista = document.getElementById("listaProdutos");

    if (!lista) return;

    lista.replaceChildren();

    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = 5;
    celula.textContent = "Carregando produtos...";

    linha.appendChild(celula);
    lista.appendChild(linha);

    try {
        const parametros = new URLSearchParams({
            pagina: String(paginaAtual),
            limite: "10",
            pesquisa: pesquisaAtual,
            ordenar: ordenarAtual
        });

        if (categoriaAtual) {
            parametros.set("categoria", categoriaAtual);
        }

        if (precoMinAtual !== "") {
            parametros.set("precoMin", precoMinAtual);
        }

        if (precoMaxAtual !== "") {
            parametros.set("precoMax", precoMaxAtual);
        }

        const resultado = await requisicao(
            `${API_URL}?${parametros.toString()}`
        );

        totalPaginas = resultado.paginacao.totalPaginas;

        document.getElementById("infoPagina").textContent =
            `Página ${paginaAtual} de ${totalPaginas}`;

        document.getElementById("btnAnterior").disabled =
            paginaAtual <= 1;

        document.getElementById("btnProximo").disabled =
            paginaAtual >= totalPaginas || totalPaginas === 0;

        lista.replaceChildren();

        if (resultado.dados.length === 0) {
            const linhaVazia = document.createElement("tr");
            const celulaVazia = document.createElement("td");

            celulaVazia.colSpan = 5;
            celulaVazia.textContent = "Nenhum produto encontrado.";

            linhaVazia.appendChild(celulaVazia);
            lista.appendChild(linhaVazia);

            return;
        }

        resultado.dados.forEach((produto) => {
            const linhaProduto = document.createElement("tr");

            const valores = [
                produto.nome,
                produto.descricao,
                Number(produto.preco).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                }),
                produto.categoria
            ];

            valores.forEach((valor) => {
                const celulaProduto = document.createElement("td");

                celulaProduto.textContent = valor;

                linhaProduto.appendChild(celulaProduto);
            });

            const celulaAcoes = document.createElement("td");
            const botoes = document.createElement("div");

            botoes.className = "acoes";

            const btnEditar = document.createElement("button");

            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-editar";

            btnEditar.addEventListener("click", () => {
                editarProduto(produto);
            });

            const btnExcluir = document.createElement("button");

            btnExcluir.textContent = "Excluir";
            btnExcluir.className = "btn-excluir";

            btnExcluir.addEventListener("click", () => {
                excluirProduto(produto._id);
            });

            botoes.append(btnEditar, btnExcluir);

            celulaAcoes.appendChild(botoes);
            linhaProduto.appendChild(celulaAcoes);

            lista.appendChild(linhaProduto);
        });

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");

        lista.replaceChildren();

        const linhaErro = document.createElement("tr");
        const celulaErro = document.createElement("td");

        celulaErro.colSpan = 5;
        celulaErro.textContent =
            "Não foi possível carregar os produtos.";

        linhaErro.appendChild(celulaErro);
        lista.appendChild(linhaErro);
    }
}

// =========================
// CADASTRAR OU ATUALIZAR PRODUTO
// =========================

function configurarFormularioProdutos() {
    const form = document.getElementById("produtoForm");

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const id = document.getElementById("produtoId").value;

        const dadosProduto = {
            nome: document.getElementById("nome").value.trim(),

            descricao: document.getElementById("descricao").value.trim(),

            preco: Number(document.getElementById("preco").value),

            custo: Number(document.getElementById("custo").value),

            categoria: document.getElementById("categoria").value.trim(),

            quantidadeEstoque: Number(
                document.getElementById("quantidadeEstoque").value
            ),

            estoqueMinimo: Number(
                document.getElementById("estoqueMinimo").value
            )
        };

        const url = id
            ? `${API_URL}/${encodeURIComponent(id)}`
            : API_URL;

        const metodo = id ? "PUT" : "POST";

        try {
            const resultado = await requisicao(url, {
                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dadosProduto)
            });

            mostrarMensagem(resultado.mensagem, "sucesso");

            limparFormulario();

            paginaAtual = 1;

            await carregarProdutos();

        } catch (erro) {
            mostrarMensagem(erro.message, "erro");
        }
    });

    document.getElementById("btnCancelar")
        .addEventListener("click", limparFormulario);
}

// =========================
// EDITAR PRODUTO
// =========================

function editarProduto(produto) {
    document.getElementById("produtoId").value = produto._id;

    document.getElementById("nome").value = produto.nome;

    document.getElementById("descricao").value = produto.descricao;

    document.getElementById("preco").value = produto.preco;

    document.getElementById("categoria").value = produto.categoria;

    document.getElementById("custo").value = produto.custo ?? 0;

    document.getElementById("quantidadeEstoque").value =
        produto.quantidadeEstoque ?? 0;

    // A quantidade não será alterada pela edição do produto.
    document.getElementById("quantidadeEstoque").disabled = true;

    document.getElementById("estoqueMinimo").value =
        produto.estoqueMinimo ?? 5;

    document.getElementById("tituloFormulario").textContent =
        "Editar produto";

    document.getElementById("btnSalvar").textContent =
        "Salvar alterações";

    document.getElementById("btnCancelar").hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =========================
// EXCLUIR PRODUTO
// =========================

async function excluirProduto(id) {
    const confirmar = window.confirm(
        "Tem certeza de que deseja excluir este produto?"
    );

    if (!confirmar) return;

    try {
        const resultado = await requisicao(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );

        mostrarMensagem(resultado.mensagem, "sucesso");

        if (
            document.getElementById("listaProdutos").children.length === 1 &&
            paginaAtual > 1
        ) {
            paginaAtual--;
        }

        await carregarProdutos();

    } catch (erro) {
        mostrarMensagem(erro.message, "erro");
    }
}

// =========================
// PESQUISA
// =========================

function configurarPesquisa() {
    const form = document.getElementById("pesquisaForm");

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        pesquisaAtual =
            document.getElementById("pesquisa").value.trim();

        paginaAtual = 1;

        carregarProdutos();
    });
}

// =========================
// FILTROS
// =========================

function configurarFiltros() {
    const form = document.getElementById("filtrosForm");

    const btnLimpar = document.getElementById("btnLimparFiltros");

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const categoria = document
            .getElementById("filtroCategoria")
            .value.trim();

        const precoMin = document
            .getElementById("precoMin")
            .value;

        const precoMax = document
            .getElementById("precoMax")
            .value;

        const ordenar = document
            .getElementById("ordenar")
            .value;

        if (
            precoMin !== "" &&
            precoMax !== "" &&
            Number(precoMin) > Number(precoMax)
        ) {
            mostrarMensagem(
                "O preço mínimo não pode ser maior que o máximo.",
                "erro"
            );

            return;
        }

        categoriaAtual = categoria;
        precoMinAtual = precoMin;
        precoMaxAtual = precoMax;
        ordenarAtual = ordenar;

        paginaAtual = 1;

        carregarProdutos();
    });

    btnLimpar.addEventListener("click", () => {
        form.reset();

        categoriaAtual = "";
        precoMinAtual = "";
        precoMaxAtual = "";
        ordenarAtual = "mais-recentes";

        paginaAtual = 1;

        carregarProdutos();
    });
}

// =========================
// PAGINAÇÃO
// =========================

function configurarPaginacao() {
    document.getElementById("btnAnterior")
        .addEventListener("click", () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                carregarProdutos();
            }
        });

    document.getElementById("btnProximo")
        .addEventListener("click", () => {
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                carregarProdutos();
            }
        });
}

// =========================
// INICIALIZAR PRODUTOS
// =========================

function inicializarProdutos() {
    configurarFormularioProdutos();
    configurarPesquisa();
    configurarFiltros();
    configurarPaginacao();

    carregarProdutos();
}

// =========================
// CARREGAR TODOS OS PRODUTOS
// =========================

async function carregarTodosProdutos() {
    const produtos = [];
    let pagina = 1;
    let totalPaginasProdutos = 1;

    do {
        const resultado = await requisicao(
            `${API_URL}?pagina=${pagina}&limite=100`
        );

        produtos.push(...resultado.dados);

        totalPaginasProdutos = resultado.paginacao.totalPaginas;

        pagina++;
    } while (pagina <= totalPaginasProdutos);

    return produtos;
}

// =========================
// RESUMO DO ESTOQUE
// =========================

async function carregarResumoEstoque() {
    const produtos = await carregarTodosProdutos();

    const totalProdutos = produtos.length;

    const totalUnidades = produtos.reduce((total, produto) => {
        return total + Number(produto.quantidadeEstoque ?? 0);
    }, 0);

    const produtosComEstoqueBaixo = produtos.filter((produto) => {
        const quantidade = Number(produto.quantidadeEstoque ?? 0);
        const minimo = Number(produto.estoqueMinimo ?? 5);

        return quantidade <= minimo;
    }).length;

    document.getElementById("estoqueTotalProdutos").textContent =
        totalProdutos;

    document.getElementById("estoqueTotalUnidades").textContent =
        totalUnidades;

    document.getElementById("estoqueBaixo").textContent =
        produtosComEstoqueBaixo;
}

// =========================
// CARREGAR PRODUTOS NO SELECT
// =========================

async function carregarProdutosSelect() {
    const select = document.getElementById("estoqueProduto");

    const produtos = await carregarTodosProdutos();

    select.replaceChildren();

    const opcaoInicial = document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um produto";

    select.appendChild(opcaoInicial);

    produtos.forEach((produto) => {
        const opcao = document.createElement("option");

        opcao.value = produto._id;
        opcao.textContent =
            `${produto.nome} — Estoque: ${produto.quantidadeEstoque ?? 0}`;

        select.appendChild(opcao);
    });

    if (produtos.length === 0) {
        opcaoInicial.textContent = "Nenhum produto cadastrado";
    }
}

// =========================
// REGISTRAR MOVIMENTAÇÃO
// =========================

function configurarFormularioEstoque() {
    const form = document.getElementById("estoqueForm");

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const produtoId =
            document.getElementById("estoqueProduto").value;

        const tipo =
            document.getElementById("tipoMovimentacao").value;

        const quantidade = Number(
            document.getElementById("quantidadeMovimentacao").value
        );

        const observacao = document
            .getElementById("observacaoMovimentacao")
            .value.trim();

        const dados = {
            produtoId,
            tipo,
            quantidade,
            observacao
        };

        try {
            const resultado = await requisicao(API_URL_ESTOQUE, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dados)
            });

            mostrarMensagemEstoque(
                resultado.mensagem,
                "sucesso"
            );

            form.reset();

            await atualizarPaginaEstoque();

        } catch (erro) {
            mostrarMensagemEstoque(
                erro.message,
                "erro"
            );
        }
    });
}

// =========================
// CARREGAR HISTÓRICO
// =========================

async function carregarHistoricoEstoque() {
    const lista = document.getElementById("listaMovimentacoes");

    lista.replaceChildren();

    const linhaCarregando = document.createElement("tr");
    const celulaCarregando = document.createElement("td");

    celulaCarregando.colSpan = 5;
    celulaCarregando.textContent = "Carregando histórico...";

    linhaCarregando.appendChild(celulaCarregando);
    lista.appendChild(linhaCarregando);

    try {
        const resultado = await requisicao(API_URL_ESTOQUE);

        lista.replaceChildren();

        if (!resultado.dados || resultado.dados.length === 0) {
            const linhaVazia = document.createElement("tr");
            const celulaVazia = document.createElement("td");

            celulaVazia.colSpan = 5;
            celulaVazia.textContent = "Nenhuma movimentação registrada.";

            linhaVazia.appendChild(celulaVazia);
            lista.appendChild(linhaVazia);

            return;
        }

        resultado.dados.forEach((movimentacao) => {
            const linha = document.createElement("tr");

            const nomeProduto =
                movimentacao.produto?.nome || "Produto não encontrado";

            const tipo =
                movimentacao.tipo === "entrada" ? "Entrada" : "Saída";

            const quantidade = movimentacao.quantidade;

            const observacao = movimentacao.observacao || "-";

            const data = movimentacao.createdAt
                ? new Date(movimentacao.createdAt).toLocaleString("pt-BR")
                : "-";

            const valores = [
                nomeProduto,
                tipo,
                quantidade,
                observacao,
                data
            ];

            valores.forEach((valor) => {
                const celula = document.createElement("td");

                celula.textContent = valor;

                linha.appendChild(celula);
            });

            lista.appendChild(linha);
        });

    } catch (erro) {
        lista.replaceChildren();

        const linhaErro = document.createElement("tr");
        const celulaErro = document.createElement("td");

        celulaErro.colSpan = 5;
        celulaErro.textContent = erro.message;

        linhaErro.appendChild(celulaErro);
        lista.appendChild(linhaErro);
    }
}

// =========================
// ATUALIZAR PÁGINA DE ESTOQUE
// =========================

async function atualizarPaginaEstoque() {
    try {
        await Promise.all([
            carregarResumoEstoque(),
            carregarProdutosSelect(),
            carregarHistoricoEstoque()
        ]);
    } catch (erro) {
        mostrarMensagemEstoque(
            erro.message,
            "erro"
        );
    }
}

// =========================
// INICIALIZAR ESTOQUE
// =========================

function inicializarEstoque() {
    configurarFormularioEstoque();
    atualizarPaginaEstoque();
}

// =========================
// NAVEGAÇÃO
// =========================

function navegar(pagina, elemento) {
    tituloPagina.textContent = elemento.textContent.trim();

    itensMenu.forEach((item) => {
        item.classList.remove("ativo");
    });

    elemento.classList.add("ativo");

    if (pagina === "dashboard") {
        conteudoPagina.innerHTML = dashboardHTML;

        carregarTotalProdutos();

    } else if (pagina === "produtos") {
        conteudoPagina.innerHTML = produtosHTML;

        paginaAtual = 1;
        pesquisaAtual = "";
        categoriaAtual = "";
        precoMinAtual = "";
        precoMaxAtual = "";
        ordenarAtual = "mais-recentes";

        inicializarProdutos();

    } else if (pagina === "estoque") {
        conteudoPagina.innerHTML = estoqueHTML;

        inicializarEstoque();

    } else {
        conteudoPagina.innerHTML =
            "<p>Página não encontrada.</p>";
    }
}

// =========================
// EVENTOS DO MENU
// =========================

itensMenu.forEach((item) => {
    item.addEventListener("click", (evento) => {
        evento.preventDefault();

        navegar(item.dataset.pagina, item);
    });
});

// =========================
// INICIALIZAÇÃO
// =========================

carregarTotalProdutos();
