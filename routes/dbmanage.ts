import express from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  getAllCollections,
  getCollectionData,
} from "../controllers/db.controller";

const router = express.Router();

router.route("/collections").get(getAllCollections);
router.route("/collection/:_collection").get(getCollectionData);

export default router;
