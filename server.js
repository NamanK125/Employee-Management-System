const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  password: '12345678',
  host: 'localhost',
  database: 'api',
  port: 5432 // or your PostgreSQL port number
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Login endpoint
app.post('/login', async (req, res) => {
  const { designation, branch, password } = req.body;

  try {
    // Find the user's hashed password in the database
    const query = 'SELECT password FROM users WHERE designation = $1 AND branch = $2';
    const values = [designation, branch];
    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { designation, branch },
      'BITS1234',
      { expiresIn: '1h' }
    );

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'BITS1234', (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  const { designation, branch } = req.user;

  // Handle the protected route logic
  res.json({ message: 'Protected route accessed successfully', designation, branch });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
