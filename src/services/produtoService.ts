
import Produto from "../models/Produto.js";

interface FiltrosProduto {
    categoria?: string;
    precoMin?: number;
    precoMax?: number;
    ordenar?:
        | "menor-preco"
        | "maior-preco"
        | "mais-recentes"
        | "mais-antigos";
}

interface DadosProduto {
    nome: string;
    descricao: string;
    preco: number;
    custo: number;
    categoria: string;
    quantidadeEstoque: number;
    estoqueMinimo: number;
}

// Cadastrar produto
export const criarProduto = async (dados: DadosProduto) => {
    return await Produto.create(dados);
};

// Listar produtos com pesquisa, paginação, filtros e ordenação
export const listarProdutos = async (
    pagina: number = 1,
    limite: number = 10,
    pesquisa: string = "",
    filtros: FiltrosProduto = {}
) => {
    const filtro: Record<string, unknown> = {};

    // Pesquisa pelo nome
    if (pesquisa) {
        filtro.nome = {
            $regex: pesquisa,
            $options: "i"
        };
    }

    // Filtro por categoria
    if (filtros.categoria) {
        filtro.categoria = filtros.categoria;
    }

    // Filtro por faixa de preço
    if (
        filtros.precoMin !== undefined ||
        filtros.precoMax !== undefined
    ) {
        const preco: Record<string, number> = {};

        if (filtros.precoMin !== undefined) {
            preco.$gte = filtros.precoMin;
        }

        if (filtros.precoMax !== undefined) {
            preco.$lte = filtros.precoMax;
        }

        filtro.preco = preco;
    }

    // Ordenação
    let ordenacao: Record<string, 1 | -1> = {
        createdAt: -1
    };

    switch (filtros.ordenar) {
        case "menor-preco":
            ordenacao = { preco: 1 };
            break;

        case "maior-preco":
            ordenacao = { preco: -1 };
            break;

        case "mais-antigos":
            ordenacao = { createdAt: 1 };
            break;

        case "mais-recentes":
            ordenacao = { createdAt: -1 };
            break;
    }

    const pular = (pagina - 1) * limite;

    const [produtos, total] = await Promise.all([
        Produto.find(filtro)
            .sort(ordenacao)
            .skip(pular)
            .limit(limite),

        Produto.countDocuments(filtro)
    ]);

    return {
        produtos,
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
    };
};

// Buscar produto pelo ID
export const buscarProdutoPorId = async (id: string) => {
    return await Produto.findById(id);
};

// Atualizar produto
export const atualizarProduto = async (
    id: string,
    dados: Partial<DadosProduto>
) => {
    return await Produto.findByIdAndUpdate(
        id,
        dados,
        {
            new: true,
            runValidators: true
        }
    );
};

// Excluir produto
export const excluirProduto = async (id: string) => {
    return await Produto.findByIdAndDelete(id);
};
