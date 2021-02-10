const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
		maxLength: 255,
	},
	password: {
		type: String,
		required: true,
		minLength: 5,
		maxLength: 1024,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
	return token;
};

const User = mongoose.model('User', userSchema, 'users');

function validate(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required(),
		email: Joi.string().email().min(3).max(255).required(),
		password: Joi.string().min(5).max(1024).required(),
		isAdmin: Joi.bool(),
	});

	return schema.validate(user);
}

exports.User = User;
exports.validate = validate;
