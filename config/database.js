import mongoose from "mongoose";
import { envConfig } from "./dotenv.js";

const db = async () => {
    try {
        await mongoose.connect(envConfig.MONGODB_URL);
        console.log("Database Connected Succesfully!!");
    } catch (error) {
        console.log(error);
    }
}

export default db();