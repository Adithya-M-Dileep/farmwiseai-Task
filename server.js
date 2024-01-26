const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
const port = 3000;

dotenv.config();

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', bookRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server; // Export the server instance for testing

