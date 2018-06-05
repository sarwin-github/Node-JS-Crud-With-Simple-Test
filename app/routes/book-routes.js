const express   = require('express');
const router    = express();

const bookController = require('../controller/book-controller');

// get list of book
router.route('/list').get(bookController.getBooks);

// create a book
router.route('/create').get(bookController.getCreateNewBook)
					   .post(bookController.postCreateNewBook);

// get book details
router.route('/:id').get(bookController.getBookDetails);

// update a book
router.route('/update/:id').get(bookController.getUpdateBook)
						   .put(bookController.putUpdateBook);

// delete a book
router.route('/delete/:id').delete(bookController.deleteBook);

module.exports = router;