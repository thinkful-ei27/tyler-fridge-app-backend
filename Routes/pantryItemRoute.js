'use strict';

const express = require('express');
const mongoose = require('mongoose');

const pantryItem = require('../Models/pantryItem');

const passport = require('passport');
const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// GET route
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  let filter = { userId };

  pantryItem.find(filter)
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
  const userId = req.user.id;
  

  new Date(expirationDate);
  
  const newItem = { itemName, expirationDate, userId};
  
  //  validation
  if (!itemName || !expirationDate) {
    const err = new Error('Missing name or expiration date in request body');
    err.status = 400;
    return next(err);
  }
  
  pantryItem.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;