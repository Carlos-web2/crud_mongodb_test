
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
        throw new Error(
            "A variável MONGODB_URI não foi definida no arquivo .env"
        );
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB conectado com sucesso!");
};

export default connectDB;
