
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
    registrarMovimentacao
} from "../services/estoqueService.js";

import MovimentacaoEstoque from "../models/MovimentacaoEstoque.js";

// Registrar entrada ou saída de estoque
export const criarMovimentacao = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const movimentacao = await registrarMovimentacao({
            produtoId: req.body.produtoId,
            tipo: req.body.tipo,
            quantidade: req.body.quantidade,
            observacao: req.body.observacao
        });

        res.status(201).json({
            sucesso: true,
            mensagem: "Movimentação registrada com sucesso!",
            dados: movimentacao
        });
    } catch (erro) {
        next(erro);
    }
};

// Listar histórico de movimentações
export const obterMovimentacoes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { produtoId } = req.query;

        const filtro: Record<string, unknown> = {};

        if (produtoId) {
            if (
                typeof produtoId !== "string" ||
                !mongoose.isValidObjectId(produtoId)
            ) {
                res.status(400).json({
                    sucesso: false,
                    mensagem: "ID do produto inválido."
                });

                return;
            }

            filtro.produto = produtoId;
        }

        const movimentacoes = await MovimentacaoEstoque.find(filtro)
            .populate("produto", "nome")
            .sort({ createdAt: -1 });

        res.status(200).json({
            sucesso: true,
            total: movimentacoes.length,
            dados: movimentacoes
        });
    } catch (erro) {
        next(erro);
    }
};
