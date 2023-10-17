import express, { Router } from "express";
import {
  addAPI,
  editAPI,
  getAPI,
  getApiById,
  getApiByName,
} from "../controllers/social.controller";
import { auth } from "../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/", auth, getAPI);
router.post("/", addAPI);
router.get("/name/:_name", getApiByName);
router.get("/:_id", getApiById);
router.post("/:_id", editAPI);

export default router;
