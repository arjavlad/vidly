const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
	it('should generate token with user id', () => {
		const payload =  {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};
		const user = new User(payload);
		const token = user.generateAuthToken();
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		expect(decoded).toHaveProperty('id', payload._id);
		expect(decoded).toHaveProperty('isAdmin', payload.isAdmin);
	});
});
