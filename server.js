'use strict';

const express = require('express');
const mongoose = require('mongoose');
const {PORT, MONGODB_URI} = require('./config');
const cors = require('cors');
const app = express();

app.use(cors);
app.use(express.static('public'));

app.use(express.json());

// routers go here
const itemRouter = require('./Routes/itemRoute');

// mount the routers

app.use('/api/item', itemRouter);
// 404 error handler

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// start it up

if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });
  
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}
  