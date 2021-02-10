const mongoose = require('mongoose');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
	customer: {
		type: new mongoose.Schema({
			name: {
				type: String,
				required: true,
				minLength: 5,
				maxLength: 50,
			},
			phone: {
				type: String,
				required: true,
				length: 10,
			},
			isGold: {
				type: Boolean,
				required: true,
				default: false,
			},
		}),
		required: true,
	},
	movie: {
		type: new mongoose.Schema({
			title: {
				type: String,
				required: true,
				trim: true,
				minLength: 5,
				maxLength: 50,
			},
			dailyRentalRate: {
				type: Number,
				required: true,
				min: 0,
				max: 255,
			},
		}),
		required: true,
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateRetuned: {
		type: Date,
		required: false,
	},
	rentalFee: {
		type: Number,
		min: 0,
	},
});

const Rental = mongoose.model('Rental', movieSchema, 'rentals');

function validateRental(rental) {
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	});

	return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
