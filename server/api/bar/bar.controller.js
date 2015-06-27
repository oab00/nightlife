'use strict';

var _ = require('lodash');
var Bar = require('./bar.model');
//var yelp = require('yelp');
var yelp = require('../../config/yelp_config');

// Get list of bars
exports.index = function(req, res) {
  Bar.find(function (err, bars) {
    if(err) { return handleError(res, err); }
    return res.json(200, bars);
  });
};

// Get a single bar
exports.show = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.send(404); }
    return res.json(bar);
  });
};

// Creates a new bar in the DB.
exports.create = function(req, res) {
  Bar.create(req.body, function(err, bar) {
    if(err) { return handleError(res, err); }
    return res.json(201, bar);
  });
};

// Updates an existing bar in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bar.findById(req.params.id, function (err, bar) {
    if (err) { return handleError(res, err); }
    if(!bar) { return res.send(404); }
    var updated = _.extend(bar, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, bar);
    });
  });
};

// Deletes a bar from the DB.
exports.destroy = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.send(404); }
    bar.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Searches for Bars using Yelp API
exports.search = function(req, res) {

  if (req.params.location !== 'montreal') {
    yelp.search({term: "bar", location: req.params.location}, function(err, data) {
      if (err) { return handleError(res, err) };
      
      res.json({ message: data });
    });
    
    return;
  }

  // testing
  var fs = require('fs');
  var file = __dirname + '/example.json';

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) { return handleError(res, err) };

    data = JSON.parse(data);

    res.json(data);
  });
  
};

function handleError(res, err) {
  return res.send(500, err);
}