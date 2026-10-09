const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('./db/config');
const cors = require('cors');

// Initialize express app first
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));

// Route imports
const userRoutes    = require('./routes/user');       // auth: /register, /login
const userCrudRoutes = require('./routes/userRoutes'); // protected CRUD: /users/...
const mainRoutes    = require('./routes');             // all other routes

// Route middleware
app.use('/users', userRoutes);      // POST /users/register, POST /users/login
app.use('/users', userCrudRoutes);  // GET/POST/PUT/DELETE /users (protected)
app.use('/', mainRoutes);           // all other routes

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
