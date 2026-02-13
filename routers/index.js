import { Router } from "express";
import adminRouter from "./admin.route.js";
import movieRouter from "./movie.route.js";
import authRouter from "./auth.route.js";

const router = Router();

router.use('/admin', adminRouter);
router.use('/movies', movieRouter);
router.use('/auth', authRouter);

export default router;