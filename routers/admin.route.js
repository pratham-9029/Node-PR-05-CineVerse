import { Router } from "express";
import adminController from "../controller/admin.controller.js";

const adminRouter = Router();

adminRouter.get('/', adminController.homePage);
adminRouter.get('/add-movies', adminController.addMoviePage);

export default adminRouter;