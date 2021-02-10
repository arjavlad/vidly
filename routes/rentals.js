const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
	const rentals = await Rental.find().sort('movie.title');
	res.send(rentals);
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send('Invalid customer!');

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send('Invalid movie!');

	if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

	const rental = new Rental({
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
			isGold: customer.isGold,
		},
	});

	const session = await mongoose.startSession();
	session.startTransaction();

	await rental.save();
	movie.numberInStock--;
	movie.save();

	await session.commitTransaction();
	session.endSession();

	res.send(rental);
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send('Invalid customer!');

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send('Invalid movie!');

	if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

	let updated = new Rental({
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
			isGold: customer.isGold,
		},
		dateRetuned: req.body.dateRetuned,
		rental: !req.body.rental ? 0 : req.body.rental,
	});

	const rental = await Rental.findByIdAndUpdate(req.params.id, updated, { new: true });

	if (!rental) return res.status(404).send('The rental with the given ID was not found.');

	res.send(rental);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const rental = await Rental.findByIdAndRemove(req.params.id);

	if (!rental) return res.status(404).send('The rental with the given ID was not found.');

	res.send(rental);
});

router.get('/:id', async (req, res) => {
	const rental = await Rental.findById(req.params.id);
	if (!rental) return res.status(404).send('The rental with the given ID was not found.');
	res.send(rental);
});

module.exports = router;
