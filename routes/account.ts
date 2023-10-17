import express, { Router } from "express";
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccounts,
} from "../controllers/accounts.controller";
import { auth } from "../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/", auth, getAccounts);
router.post("/", auth, addAccount);
router.post("/:_id", auth, editAccount);
router.delete("/:_id", auth, deleteAccount);

export default router;
