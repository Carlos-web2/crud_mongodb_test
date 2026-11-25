
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
    criarProduto,
    listarProdutos,
    buscarProdutoPorId,
    atualizarProduto,
    excluirProduto
} from "../services/produtoService.js";

// Cadastrar produto
export const cadastrarProduto = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const produto = await criarProduto(req.body);

        return res.status(201).json({
            sucesso: true,
            mensagem: "Produto cadastrado com sucesso!",
            dados: produto
        });

    } catch (error) {
        next(error);
    }
};

// Listar produtos com pesquisa, paginação, filtros e ordenação
export const obterProdutos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const pagina = Math.max(
            1,
            Number(req.query.pagina) || 1
        );

        const limite = Math.min(
            100,
            Math.max(1, Number(req.query.limite) || 10)
        );

        const pesquisa = String(
            req.query.pesquisa || ""
        ).trim();

        const categoria = req.query.categoria
            ? String(req.query.categoria).trim()
            : undefined;

        const precoMin = req.query.precoMin !== undefined
            ? Number(req.query.precoMin)
            : undefined;

        const precoMax = req.query.precoMax !== undefined
            ? Number(req.query.precoMax)
            : undefined;

        const ordenar = String(
            req.query.ordenar || "mais-recentes"
        );

        // Validar faixa de preço
        if (
            (precoMin !== undefined &&
                (!Number.isFinite(precoMin) || precoMin < 0)) ||
            (precoMax !== undefined &&
                (!Number.isFinite(precoMax) || precoMax < 0)) ||
            (precoMin !== undefined &&
                precoMax !== undefined &&
                precoMin > precoMax)
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Faixa de preço inválida."
            });
        }

        // Validar ordenação
        const ordenacoesPermitidas = [
            "menor-preco",
            "maior-preco",
            "mais-recentes",
            "mais-antigos"
        ];

        if (!ordenacoesPermitidas.includes(ordenar)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Ordenação inválida."
            });
        }

        const resultado = await listarProdutos(
            pagina,
            limite,
            pesquisa,
            {
                categoria,
                precoMin,
                precoMax,
                ordenar: ordenar as
                    | "menor-preco"
                    | "maior-preco"
                    | "mais-recentes"
                    | "mais-antigos"
            }
        );

        return res.status(200).json({
            sucesso: true,
            dados: resultado.produtos,
            paginacao: {
                pagina: resultado.pagina,
                limite: resultado.limite,
                total: resultado.total,
                totalPaginas: resultado.totalPaginas
            }
        });

    } catch (error) {
        next(error);
    }
};

// Buscar produto pelo ID
export const obterProdutoPorId = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do produto inválido."
            });
        }

        const produto = await buscarProdutoPorId(req.params.id);

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        return res.status(200).json({
            sucesso: true,
            dados: produto
        });

    } catch (error) {
        next(error);
    }
};

// Atualizar produto
export const editarProduto = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do produto inválido."
            });
        }

        const produto = await atualizarProduto(
            req.params.id,
            req.body
        );

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Produto atualizado com sucesso!",
            dados: produto
        });

    } catch (error) {
        next(error);
    }
};

// Excluir produto
export const removerProduto = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID do produto inválido."
            });
        }

        const produto = await excluirProduto(req.params.id);

        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Produto não encontrado."
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Produto excluído com sucesso!",
            dados: produto
        });

    } catch (error) {
        next(error);
    }
};
