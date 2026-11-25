
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import estoqueRoutes from "./routes/estoqueRoutes.js";

import produtoRoutes from "./routes/produtoRoutes.js";
import { tratarErros } from "./middlewares/tratarErros.js";

const app = express();

// Configurações de segurança
app.use(helmet());
app.use(cors());

// Leitura de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registro de requisições
app.use(morgan("dev"));

// Arquivos do frontend
app.use(express.static("src/public"));

// Rotas da API
app.use("/api/produtos", produtoRoutes);

app.use("/api/estoque", estoqueRoutes);

// Verificação da API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        sucesso: true,
        mensagem: "API de gerenciamento de estoque funcionando!"
    });
});

// Tratamento global de erros
app.use(tratarErros);

export default app;
