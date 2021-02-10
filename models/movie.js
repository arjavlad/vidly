const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');
// Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 50,
	},
	genre: {
		type: genreSchema,
		required: true,
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

function validateMovie(movie) {
	const schema = Joi.object({
		title: Joi.string().min(3).required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().required().min(0).max(255),
		dailyRentalRate: Joi.number().required().min(0).max(255),
	});

	return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
