import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: String,
    about: String,
    genre: String,
    rating: String,
    image: String,
    position: { type: Number, default: 0 }
})

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;