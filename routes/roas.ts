import express from "express";
import {
  getMultiRoas,
  getRoas,
  insertRoas,
} from "../controllers/roas.controller";

const router = express.Router();

router.route("/").get(getRoas);
router.route("/multiple").post(getMultiRoas);
router.route("/").post(insertRoas);

export default router;
