'use strict'

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const router = express.Router();


const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

function createToken(user){
  return jwt.sign( { user }, JWT_SECRET , {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, function (req, res) {
  const authToken = createToken(req.user);
  return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createToken(req.user);
  res.json({ authToken });
});

module.exports = router;