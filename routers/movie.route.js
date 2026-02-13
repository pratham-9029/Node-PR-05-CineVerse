import { Router } from "express";
import movieController from "../controller/movie.controller.js";
import imageUploads from "../middleware/imageUploads.js";

const movieRouter = Router();

// Page routes
movieRouter.get('/add-movies', movieController.addMoviePage);
movieRouter.post('/add-movies', imageUploads, movieController.addMovie);
movieRouter.get('/view-movies', movieController.viewMoviesPage);
movieRouter.get('/delete-movie/:id', movieController.deleteMovie);
movieRouter.delete('/delete-movie/:id', movieController.deleteMovie);
movieRouter.get('/edit-movie/:id', movieController.editMoviePage);
movieRouter.post('/update-movies/:id', imageUploads, movieController.updateMovie);
movieRouter.put('/reorder', movieController.reorderMovies);

export default movieRouter;