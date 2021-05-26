const express = require('express');

const app= express();

const authRoutes = require('./routes/auth');
const db = require('./utils/db');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(express.json()); // application/json

app.use('/tns/auth', authRoutes);


db.mongoConnect(() => {
    app.listen(3000);
});