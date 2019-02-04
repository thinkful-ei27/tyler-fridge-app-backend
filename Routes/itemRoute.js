'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Item = require('../Models/foodItem');

const router = express.Router();

// GET route
router.get('/', (req, res, next) => {

  Item.find()
    .sort('expirationDate')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// post route

router.post('/', (req, res, next) => {
  const { itemName, expirationDate } = req.body;
 
  new Date(expirationDate);
  
  const newItem = { itemName, expirationDate};
  console.log(newItem);
  //  validation
  if (!itemName || !expirationDate) {
    const err = new Error('Missing name or expiration date in request body');
    err.status = 400;
    return next(err);
  }
  
  Item.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;