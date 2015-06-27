'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BarSchema = new Schema({
  name: String,
  city: String,
  users: Array
});

module.exports = mongoose.model('Bar', BarSchema);