import express, { Application } from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import { MONGO_URI } from "./config/secret";
import mongoose from "mongoose";
import path from "path";

// Router
import revenue from "./routes/revenue";
import external from "./routes/external";
import account from "./routes/account";
import auth from "./routes/auth";
import user from "./routes/user";
import snapset from "./routes/snapset";
import dbmanage from "./routes/dbmanage";
import socialRoute from "./routes/socials";
import roasRoute from "./routes/roas";
import tokenRouter from "./routes/token";

dotenv.config();
const app: Application = express();

app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection open your heart
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err: any) => {
    console.error("MongoDB Connection Error!");
    process.exit();
  });

// Primary App Routers
app.use("/api/revenue", revenue);
app.use("/api/external-api", external);
app.use("/api/account", account);
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/snapchat", snapset);
app.use("/api/dbmanage", dbmanage);
app.use("/api/social", socialRoute);
app.use("/api/roas", roasRoute);
app.use("/api/token", tokenRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/../client/build/index.html"));
  });
}

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
