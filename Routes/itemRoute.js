'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Item = require('../models/foodItem');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// GET route
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  let filter = { userId };

  Item.find(filter)
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

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Item.findOneAndRemove({ _id: id, userId })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;