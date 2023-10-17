import express from "express";
import {
  register,
  login,
  loadUser,
  getIp,
  getVisits,
} from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.get("/", auth, loadUser);
router.post("/getip", getIp);
router.post("/getvisits", getVisits);

export default router;
