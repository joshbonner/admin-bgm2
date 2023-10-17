import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const MONGO_URI = `${process.env.MONGO_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const PORT = process.env.PORT;
