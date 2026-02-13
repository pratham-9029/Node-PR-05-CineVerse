import { Router } from "express";
import authController from "../controller/auth.controller.js";

const authRouter = Router();

// Page routes
authRouter.get('/login', authController.loginPage);
authRouter.get('/sign-up', authController.signUpPage);

// API routes (JSON responses for AJAX)
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;
