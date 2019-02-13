'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = require('../server');
const Item = require('../models/foodItem');

const {items, users} = require('../dummy/data');
const User = require('../models/user');

const { TEST_MONGODB_URI } = require('../config');
const { JWT_SECRET } = require('../config');
chai.use(chaiHttp);
const expect = chai.expect;

let token;
let user;

describe('fridge App API - fridge items', function () {
  
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true, useCreateIndex : true })
      .then(() => Promise.all([
        Item.deleteMany(),
      ]));
  });
  
  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Item.insertMany(items)
        
        
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });
  
  afterEach(function () {
    return Promise.all([
      Item.deleteMany(), 
      User.deleteMany()
    ]);
  });
  
  after(function () {
    return mongoose.disconnect();
  });
    
  describe('GET /api/item', function () {
  
    it('should return a list of items', function () {
      return Promise.all([
        Item.find({ userId: user.id }).sort('expirationDate'),
        chai.request(app).get('/api/item')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  
    it('should return a list sorted by name with the correct fields and values', function () {
      return Promise.all([
        Item.find({ userId: user.id}).sort('name'),
        chai.request(app).get('/api/item')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.have.all.keys('updatedAt', 'userId', 'id', 'itemName', 'createdAt', 'expirationDate');
            expect(item.id).to.equal(data[i].id);
            expect(item.name).to.equal(data[i].name);
            expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
          });
        });
    });
  });

  
  describe('POST /api/item', function () {
  
    it('should create and return a new item when provided valid data', function () {
      const newItem = { itemName: 'newItem', expirationDate: '2019-02-03' };
      let body;
      return chai.request(app)
        .post('/api/item')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.all.keys('updatedAt', 'userId', 'id', 'itemName', 'createdAt', 'expirationDate');
          return Item.findById(body.id);
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  
    it('should return an error when missing "name" field', function () {
      const newItem = {};
      return chai.request(app)
        .post('/api/item')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing name or expiration date in request body');
        });
    });
  
    it('should return an error when "name" field is empty string', function () {
      const newItem = { name: '' };
      return chai.request(app)
        .post('/api/item')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing name or expiration date in request body');
        });
    });
  });
  
  describe('DELETE /api/item/:id', function () {
  
    it('should delete an existing Item and respond with 204', function () {
      let data;
      return Item.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/item/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          return Item.count({ _id: data.id });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });
  
    it('should respond with a 400 for an invalid id', function () {
      return chai.request(app)
        .delete('/api/item/NOT-A-VALID-ID')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('The `id` is not valid');
        });
    });
  
  });
  
});
  