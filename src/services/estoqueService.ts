
import mongoose from "mongoose";

import Produto from "../models/Produto.js";
import MovimentacaoEstoque from "../models/MovimentacaoEstoque.js";

interface DadosMovimentacao {
    produtoId: string;
    tipo: "entrada" | "saida";
    quantidade: number;
    observacao?: string;
}

export const registrarMovimentacao = async (
    dados: DadosMovimentacao
) => {
    const sessao = await mongoose.startSession();

    let movimentacaoCriada:
        ReturnType<typeof MovimentacaoEstoque.hydrate> | null = null;

    try {
        await sessao.withTransaction(async () => {
            const filtro: Record<string, unknown> = {
                _id: dados.produtoId
            };

            // Em uma saída, verifica se existe quantidade suficiente.
            if (dados.tipo === "saida") {
                filtro.quantidadeEstoque = {
                    $gte: dados.quantidade
                };
            }

            // Atualiza a quantidade do produto.
            const alteracao =
                dados.tipo === "entrada"
                    ? dados.quantidade
                    : -dados.quantidade;

            const produto = await Produto.findOneAndUpdate(
                filtro,
                {
                    $inc: {
                        quantidadeEstoque: alteracao
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session: sessao
                }
            );

            // Verifica por que a atualização não aconteceu.
            if (!produto) {
                const produtoExiste = await Produto.exists({
                    _id: dados.produtoId
                }).session(sessao);

                if (!produtoExiste) {
                    throw new Error("Produto não encontrado.");
                }

                throw new Error(
                    "Estoque insuficiente para realizar essa saída."
                );
            }

            // Registra a movimentação no histórico.
            const movimentacoes = await MovimentacaoEstoque.create(
                [
                    {
                        produto: dados.produtoId,
                        tipo: dados.tipo,
                        quantidade: dados.quantidade,
                        observacao: dados.observacao || ""
                    }
                ],
                {
                    session: sessao
                }
            );

            movimentacaoCriada = movimentacoes[0];
        });

        return movimentacaoCriada;
    } finally {
        await sessao.endSession();
    }
};
