const mongoose       = require('mongoose');
const Book           = require('../models/book');
const csrf           = require('csurf');
const csrfProtection = csrf();

/*
* Get the list of all books from mongodb
*/
module.exports.getBooks = (req, res) => {
	let query = Book.find({}).select({'title': 1, 'author': 1}).sort('author');

	query.exec((err, books) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!books){
			return res.status(404).json({
				sucess  : false,
				message : 'The list of books is not found or does not exist.'
			});
		}

		res.status(200).json({
			success   : true, 
			message   : 'Successfully fetched the list of books.',
			books     : books
		});
	});
};


/*
* Get the form for creating a new book
*/
module.exports.getCreateNewBook = (req, res) => {
	res.status(200).json({
		success   : true,
		message   : 'You are trying to create a new book',
		//csrfToken : req.csrfToken()
	});
};

/*
* Create a new book and add to database
*/
module.exports.postCreateNewBook = (req, res) => {
	newBook = new Book(req.body);

	newBook.save(err => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		}

		res.status(200).send({
			success: true,
			message: 'Successfully added a new book!.'
		});
	});
};

/*
* Get a single book details
*/
module.exports.getBookDetails = (req, res) => {
	let query = Book.findById({ _id: req.params.id }).select({'__v': 0});

	query.exec((err, book) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!book){
			return res.status(404).json({
				sucess  : false,
				message : `The book you're looking for does not exist.`
			});
		}

		res.status(200).json({
			success   : true, 
			message   : 'Successfully fetched the details of the book.',
			book      : book
		});
	});
};

/*
* Get the book for update
*/
module.exports.getUpdateBook = (req, res) => {
	let query = Book.findById({ _id: req.params.id }).select({'__v': 0 });

	query.exec((err, book) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!book){
			return res.status(404).json({
				sucess  : false,
				message : `The book you're looking for does not exist.`
			});
		}

		res.status(200).json({
			sucess    : true,
			message   : 'You are trying to update a book',
			book      : book,
			//csrfToken : req.csrfToken()
		})
	});
};

/*
* Update a book details
*/
module.exports.putUpdateBook = (req, res) => {
	let query = Book.findById({ _id: req.params.id }).select({'__v': 0 });

	query.exec((err, book) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!book){
			return res.status(404).json({
				sucess  : false,
				message : `The book you're looking for does not exist.`
			});
		}

		book.title  = req.body.title;
		book.author = req.body.author;
		book.year   = req.body.year;
		book.page   = req.body.page;

		book.save(err => {
			if(err){
				return res.status(500).json({ 
					sucess  : false, 
					error   : err, 
					message : 'Server error.'
				});
			} 
			res.status(200).json({ 
				success : true, 
				message : 'Book has been updated',
				book    : book
			});
		});
	});
};

/*
* Delete a book
*/
module.exports.deleteBook = (req, res) => {
	let query = Book.findOneAndRemove({ _id: req.params.id }).select({'__v': 0 });

	query.exec((err, book) => {
		if(err){
			return res.status(500).json({ 
				sucess  : false, 
				error   : err, 
				message : 'Server error.'
			});
		} if(!book){
			return res.status(404).json({
				sucess  : false,
				message : `The book you're looking for does not exist.`
			});
		}

		res.status(200).json({
			success : true,
			message : 'Successfully removed a book from database'
		});
	});
};
