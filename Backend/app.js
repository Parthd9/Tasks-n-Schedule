const express = require('express');
const multer = require('multer');

const app= express();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const db = require('./utils/db');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('mime:',file.mimetype);
  if (file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
);
// app.use('/images', express.static(path.join(__dirname, 'files')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN');
    next();
  });

app.use(express.json()); // application/json

app.use('/tns/auth',authRoutes);

app.use('/tns/api/admin',adminRoutes);

app.use('/tns/api/projects',projectRoutes);

app.use('/tns/api/tasks',taskRoutes);


app.use((error, req, res, next) => {
  console.log('error middleware:',error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message });
});

db.mongoConnect(() => {
    app.listen(3000);
});