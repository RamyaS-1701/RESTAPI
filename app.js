// Import the Express framework
const express = require('express');
// Import the CORS middleware to allow cross-origin requests
const cors = require('cors');

// Create an instance of the Express application
const app = express();
const port = 3000;

// Use the CORS middleware to allow all origins
// This is necessary for the HTML file running locally to communicate with the server
app.use(cors());

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// --- In-memory data store ---
// This array will hold our book objects. In a real application, this would be a database.
let books = [
    { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// --- Helper function to find the next available ID ---
// This ensures new books get a unique ID.
const getNextId = () => {
    if (books.length === 0) {
        return 1;
    }
    const maxId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    return maxId + 1;
};

// --- API Endpoints ---

// GET /books
// Returns all books in the `books` array.
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:id
// Returns a single book by its ID.
app.get('/books/:id', (req, res) => {
    // The ID from the URL is a string, so we convert it to a number
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
        // If a book is found, send it back with a 200 OK status
        res.json(book);
    } else {
        // If no book is found, send a 404 Not Found status
        res.status(404).send('Book not found.');
    }
});

// POST /books
// Adds a new book to the `books` array.
app.post('/books', (req, res) => {
    // The request body should contain the title and author
    const { title, author } = req.body;

    // Basic validation to ensure title and author are provided
    if (!title || !author) {
        return res.status(400).send('Title and author are required.');
    }

    const newBook = {
        id: getNextId(),
        title,
        author
    };

    // Add the new book to our in-memory array
    books.push(newBook);
    // Respond with the newly created book and a 201 Created status
    res.status(201).json(newBook);
});

// PUT /books/:id
// Updates an existing book by its ID.
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return res.status(404).send('Book not found.');
    }

    const { title, author } = req.body;

    // Update the book's properties with data from the request body
    if (title) book.title = title;
    if (author) book.author = author;

    // Respond with the updated book
    res.json(book);
});

// DELETE /books/:id
// Deletes a book by its ID.
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex > -1) {
        // If the book is found, remove it from the array
        books.splice(bookIndex, 1);
        // Respond with a 204 No Content status for a successful deletion
        res.status(204).send();
    } else {
        // If the book is not found, send a 404 Not Found status
        res.status(404).send('Book not found.');
    }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
