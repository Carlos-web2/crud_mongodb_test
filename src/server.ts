
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
    try {
        // Primeiro, conecta ao MongoDB
        await connectDB();

        // Depois, inicia o servidor
        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("   SERVIDOR CRUD INICIADO");
            console.log("--------------------------------");
            console.log(`Servidor: http://localhost:${PORT}`);
            console.log(`Porta: ${PORT}`);
        });

    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
        process.exit(1);
    }
};

void startServer();
