
import { Router } from "express";

import { validarDados } from "../middlewares/validarDados.js";

import {
    produtoSchema,
    produtoAtualizacaoSchema
} from "../validators/produtoValidator.js";

import {
    cadastrarProduto,
    obterProdutos,
    obterProdutoPorId,
    editarProduto,
    removerProduto
} from "../controllers/produtoController.js";

const router = Router();

// Cadastrar produto
router.post(
    "/",
    validarDados(produtoSchema),
    cadastrarProduto
);

// Listar produtos
router.get("/", obterProdutos);

// Buscar produto pelo ID
router.get("/:id", obterProdutoPorId);

// Atualizar produto completamente
router.put(
    "/:id",
    validarDados(produtoSchema),
    editarProduto
);

// Atualizar produto parcialmente
router.patch(
    "/:id",
    validarDados(produtoAtualizacaoSchema),
    editarProduto
);

// Excluir produto
router.delete("/:id", removerProduto);

export default router;
