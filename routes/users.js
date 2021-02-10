const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user.id);
	console.log(user);
	res.send(user);
});

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const existingUser = await User.findOne({ email: req.body.email });
	if (existingUser) {
		return res.status(400).send('User already registered');
	}

	let user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(user.password, salt);
	user.password = hash;
	await user.save();

	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const updated = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	};

	const user = await User.findByIdAndUpdate(req.params.id, updated, { new: true });

	if (!user) return res.status(404).send('The user with the given ID was not found.');

	res.send(user);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);

	if (!user) return res.status(404).send('The user with the given ID was not found.');

	res.send(user);
});

router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send('The user with the given ID was not found.');
	res.send(user);
});

module.exports = router;
