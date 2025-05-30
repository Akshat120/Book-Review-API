import { Router } from "express";
import { dashboard } from "../controllers/home.js";
const router = Router();

router.get("/", dashboard);

export default router;