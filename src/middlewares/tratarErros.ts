
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const tratarErros = (
    erro: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Erro:", erro);

    // ID inválido do MongoDB
    if (
        erro instanceof mongoose.Error.CastError
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID ou dado inválido."
        });
    }

    // Erros de validação do Mongoose
    if (
        erro instanceof mongoose.Error.ValidationError
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Dados inválidos.",
            erros: Object.values(erro.errors).map((item) => ({
                campo: item.path,
                mensagem: item.message
            }))
        });
    }

    // Erro interno não identificado
    return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno do servidor."
    });
};
