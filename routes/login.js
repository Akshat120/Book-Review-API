import { Router } from "express";
import { signup, login } from "../controllers/home.js";
const router = Router();

router.post("/", login);

export default router;