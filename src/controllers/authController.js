const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');


dotenv.config();

const secretKey = process.env.JWT_SECRET_Key;

// User registration
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      // User with the same username already exists
      return res.status(409).json({ message: 'Username already exists' });
    }

    // If the username is unique, proceed with user registration
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    return res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to register' });
  }
};




//User login 
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'No user found' });
      }
      bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({ message: 'Invalid password' });
          }
          const token = jwt.sign({ userId: user._id }, secretKey);
          res.status(200).json({ token });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: 'Error comparing passwords' });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Error finding user' });
    });
};