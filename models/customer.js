const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model(
	'Customer',
	new mongoose.Schema({
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
	'customers',
);

function validateCustomer(customer) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().length(10).required(),
		isGold: Joi.boolean().optional(),
	});

	return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
