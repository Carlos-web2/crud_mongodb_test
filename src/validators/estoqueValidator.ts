import { z } from "zod";

export const movimentacaoEstoqueSchema = z.object({
    produtoId: z.string().regex(
        /^[a-fA-F0-9]{24}$/,
        "ID do produto inválido."
    ),

    tipo: z.enum(["entrada", "saida"], {
        message: "O tipo deve ser entrada ou saída."
    }),

    quantidade: z.number()
        .int("A quantidade deve ser um número inteiro.")
        .min(1, "A quantidade deve ser maior que zero."),

    observacao: z.string()
        .trim()
        .max(200, "A observação deve ter no máximo 200 caracteres.")
        .optional()
});