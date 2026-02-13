import Movie from "../models/movieModel.js";

const adminController = {
    homePage: (req, res) => {
        return res.render('index');
    },
    addMoviePage: (req, res) => {
        return res.render('./pages/add-movie');
    },
    // viewMoviesPage: async (req, res) => {
    //     const movies = await Movie.find();
    //     return res.render('./pages/view-movie', { movies });
    // }
};

export default adminController;
