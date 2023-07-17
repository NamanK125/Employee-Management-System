const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db');
const jwt=require('jsonwebtoken');

app.post('/admin', function(request, response){
  response.json({
    text:'Hello HR/ Suprervisor/ Senior manager'
  });
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })

app.get('/', (req, res) => {
  res.send('Login Page');
});

//Handle form submission
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/login', async (req, res) => {
  const { username, designation, branch, password } = req.body;
  
  try {
    // Perform authentication and login logic
    const user = await db.query('SELECT * FROM users WHERE username = $1 AND designation = $2 AND branch = $3 AND password = $4', [username, designation, branch, password]);
    
    if (user.length > 0) {
      // Generate a JWT
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      
      res.json({ token }); // Return the token as a response
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, 'BITS1234', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
      }

      req.userId = decoded.userId;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
}


app.get('/protected', verifyToken, (req, res) => {
  // Access the authenticated user's information using req.userId
  res.send('Protected route accessed');
});




