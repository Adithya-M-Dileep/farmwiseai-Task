const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../utils/authentication');

// Create a new book
router.post('/books', authenticateToken, bookController.createBook);

// Get all books
router.get('/books', bookController.getAllBooks);

// Get a book by ISBN
router.get('/books/:isbn', bookController.getBookByISBN);

// Update a book by ISBN
router.put('/books/:isbn', authenticateToken, bookController.updateBook);

// Delete a book by ISBN
router.delete('/books/:isbn', authenticateToken, bookController.deleteBook);

module.exports = router;
