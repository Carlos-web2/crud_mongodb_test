
import { z } from "zod";

// Validação para cadastro e atualização completa
export const produtoSchema = z.object({
    nome: z
        .string()
        .trim()
        .min(1, "O nome do produto é obrigatório."),

    descricao: z
        .string()
        .trim()
        .min(1, "A descrição do produto é obrigatória."),

    preco: z
        .number()
        .min(0, "O preço não pode ser negativo."),

    custo: z
        .number()
        .min(0, "O custo não pode ser negativo."),

    categoria: z
        .string()
        .trim()
        .min(1, "A categoria do produto é obrigatória."),

    quantidadeEstoque: z
        .number()
        .int("A quantidade deve ser um número inteiro.")
        .min(0, "A quantidade não pode ser negativa."),

    estoqueMinimo: z
        .number()
        .int("O estoque mínimo deve ser um número inteiro.")
        .min(0, "O estoque mínimo não pode ser negativo.")
});

// Validação para atualização parcial
export const produtoAtualizacaoSchema = produtoSchema
    .partial()
    .refine(
        (dados) => Object.keys(dados).length > 0,
        {
            message: "Informe pelo menos um campo para atualizar."
        }
    );
