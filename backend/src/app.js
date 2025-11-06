const express = require('express');
const userRoutes = require('./routes/userRoutes');
const progressLogRoutes = require('./routes/progressRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/progress', progressLogRoutes);

module.exports = app;
