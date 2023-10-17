import express, { Router } from "express";
import {
  addData,
  deleteData,
  editData,
  getData,
} from "../controllers/snapchat.cotroller";
import { auth } from "../middlewares/auth.middleware";
const router: Router = express.Router();

router.get("/", auth, getData);
router.post("/", auth, addData);
router.post("/:_id", auth, editData);
router.delete("/:_id", auth, deleteData);

export default router;
