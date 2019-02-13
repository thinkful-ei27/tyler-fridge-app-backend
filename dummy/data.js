'use strict';

const items = [
  {
    'userId': '000000000000000000000001',
    'itemName': 'bananas',
    'expirationDate': new Date('2016-12-12')
  },

  {
    'userId': '000000000000000000000001',
    'itemName': 'Milk',
    'expirationDate': new Date('2019-02-12')
  },

  {
    'userId': '000000000000000000000002',
    'itemName': 'yogurt',
    'expirationDate': new Date('2019-02-14')
  }

];

const users = [
  {
    '_id': '000000000000000000000001',
    'fullname': 'Tyler Crabb',
    'username': 'Tcrabb',
    'password': '$2a$10$73j88U9HWcyQZXhUZVvsuesaeB9rYNnswbxwCvr9UQ.xPB2dX8zM6'
  },
  
  {
    '_id': '000000000000000000000002',
    'fullname': 'Natalie Swisher',
    'username': 'Nswish',
    'password': '$2a$10$73j88U9HWcyQZXhUZVvsuesaeB9rYNnswbxwCvr9UQ.xPB2dX8zM6'
  }
];
module.exports = {items, users};