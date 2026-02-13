import Movie from "../models/movieModel.js";
import fs from "fs";

const movieController = {
    addMoviePage: (req, res) => {
        return res.render('pages/add-movie');
    },
    addMovie: async (req, res) => {
        try {
            req.body.image = req.file ? req.file.path : '';
            const movie = await Movie.create(req.body);

            // AJAX request → return JSON, otherwise redirect
            if (req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, movie });
            }
            return res.redirect('/movies/view-movies');
        } catch (error) {
            if (req.headers.accept?.includes('application/json')) {
                return res.status(500).json({ success: false, message: error.message });
            }
            return res.redirect('/movies/add-movies');
        }
    },
    viewMoviesPage: async (req, res) => {
        try {
            const movies = await Movie.find();

            if (req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, movies });
            }
            return res.render('./pages/view-movie', { movies });
        } catch (error) {
            if (req.headers.accept?.includes('application/json')) {
                return res.status(500).json({ success: false, message: error.message });
            }
            return res.render('./pages/view-movie', { movies: [] });
        }
    },
    deleteMovie: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Movie.findByIdAndDelete(id);
            if (data && data.image) {
                try { fs.unlinkSync(data.image); } catch (e) { }
            }

            if (req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, message: 'Movie deleted successfully' });
            }
            return res.redirect('/movies/view-movies');
        } catch (error) {
            if (req.headers.accept?.includes('application/json')) {
                return res.status(500).json({ success: false, message: error.message });
            }
            return res.redirect('/movies/view-movies');
        }
    },
    editMoviePage: async (req, res) => {
        const { id } = req.params;
        const data = await Movie.findById(id);
        return res.render('./pages/edit-movie', { data });
    },
    updateMovie: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Movie.findById(id);
            if (req.file) {
                try { fs.unlinkSync(data.image); } catch (e) { }
                req.body.image = req.file.path;
            }
            const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });

            if (req.headers.accept?.includes('application/json')) {
                return res.json({ success: true, movie });
            }
            return res.redirect('/movies/view-movies');
        } catch (error) {
            if (req.headers.accept?.includes('application/json')) {
                return res.status(500).json({ success: false, message: error.message });
            }
            return res.redirect('/movies/view-movies');
        }
    },
    reorderMovies: async (req, res) => {
        try {
            const { order } = req.body;
            for (let i = 0; i < order.length; i++) {
                await Movie.findByIdAndUpdate(order[i], { position: i });
            }
            return res.json({ success: true, message: 'Order updated' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
}

export default movieController;
