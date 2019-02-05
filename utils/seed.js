'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const FoodItem = require('../models/foodItem');


const { items } = require('../dummy/data');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
  .then(() => {
    console.info('Deleting Data...');
    return Promise.all([
      FoodItem.deleteMany()
    ]);
  })
  .then(() => {
    console.info('Seeding Database...');
    return Promise.all([
      FoodItem.insertMany(items)
    ]);
  })
  .then(results => {
    console.log('Inserted', results);
    console.info('Disconnecting...');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
