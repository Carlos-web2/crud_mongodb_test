
import { Schema, model } from "mongoose";

const movimentacaoEstoqueSchema = new Schema(
    {
        produto: {
            type: Schema.Types.ObjectId,
            ref: "Produto",
            required: true
        },

        tipo: {
            type: String,
            enum: ["entrada", "saida"],
            required: true
        },

        quantidade: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "A quantidade deve ser um número inteiro."
            }
        },

        observacao: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const MovimentacaoEstoque = model(
    "MovimentacaoEstoque",
    movimentacaoEstoqueSchema,
    "movimentacoes_estoque"
);

export default MovimentacaoEstoque;
