import express from "express";
import {
  getAll,
  updateUser,
  getSingleUser,
  deleteUser,
  updateProfile,
  updatePassword,
  resetPassword,
} from "../controllers/user.controller";
import { auth, admin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(auth, admin, getAll);
router
  .route("/:id")
  .put(auth, admin, updateUser)
  .get(auth, admin, getSingleUser)
  .delete(auth, admin, deleteUser);
router.route("/update").put(auth, updateProfile);
router.route("/password/:_id").post(auth, resetPassword);

export default router;
