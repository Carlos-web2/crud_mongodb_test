
import { Router } from "express";

import { validarDados } from "../middlewares/validarDados.js";

import {
    criarMovimentacao,
    obterMovimentacoes
} from "../controllers/estoqueController.js";

import {
    movimentacaoEstoqueSchema
} from "../validators/estoqueValidator.js";

const router = Router();

// Registrar entrada ou saída de estoque
router.post(
    "/",
    validarDados(movimentacaoEstoqueSchema),
    criarMovimentacao
);

// Consultar histórico de movimentações
router.get(
    "/",
    obterMovimentacoes
);

export default router;
