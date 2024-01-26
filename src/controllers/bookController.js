const Book = require('../models/bookModel');

// Create a new book
exports.createBook = (req, res) => {
  const { title, author, ISBN, price, quantity } = req.body;
  if (!ISBN) {
    return res.status(400).json({ message: 'ISBN is required' });
  }

  const book = new Book({ title, author, ISBN, price, quantity });
  
  book.save()
    .then((savedBook) => {
      res.json(savedBook);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// Get all books
exports.getAllBooks = (req, res) => {
  Book.find({})
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// Get a book by ISBN
exports.getBookByISBN = (req, res) => {
  const bookISBN = req.params.isbn;

  if (!bookISBN) {
    return res.status(400).json({ message: 'ISBN is required' });
  }

  Book.findOne({ ISBN: bookISBN })
    .then((book) => {
      if (!book) {
        // Book not found, return a 404 status code
        return res.status(404).json({ message: 'Book not found' });
      }

      res.json(book);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// Update a book by ISBN
exports.updateBook=(req, res) => {
    const { isbn } = req.params;
    const { title, author, ISBN, price, quantity } = req.body;

    if (!isbn) {
        return res.status(400).json({ message: 'ISBN is required' });
      }
  
    Book.findOne({ ISBN: isbn })
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
  

      // Update only the provided fields
      if (title) book.title = title;
      if (author) book.author = author;
      if (price) book.price = price;
      if (quantity) book.quantity = quantity;
  
        return book.save()
          .then((updatedBook) => {
            res.json(updatedBook);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
          });
      });
  };

  // Delete a book by ISBN
exports.deleteBook=(req, res) => {
    const { isbn } = req.params;
  

    if (!isbn) {
        return res.status(400).json({ message: 'ISBN is required' });
      }
    Book.findOneAndDelete({ ISBN: isbn })
      .then((deletedBook) => {
        if (!deletedBook) {
          return res.status(404).json({ message: 'Book not found' });
        }
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };