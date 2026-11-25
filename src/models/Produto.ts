
import { Schema, model } from "mongoose";

const produtoSchema = new Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },

        descricao: {
            type: String,
            required: true,
            trim: true
        },

        preco: {
            type: Number,
            required: true,
            min: 0
        },

        custo: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        categoria: {
            type: String,
            required: true,
            trim: true
        },

        quantidadeEstoque: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        estoqueMinimo: {
            type: Number,
            required: true,
            min: 0,
            default: 5
        }
    },
    {
        timestamps: true
    }
);

const Produto = model("Produto", produtoSchema, "produtos");

export default Produto;
