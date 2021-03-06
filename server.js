//npm init
//npm install express body-parser cors mongojs --save
var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectId = require('mongodb').ObjectId;

var app = express();
app.use(bodyParser.json());

var nodePort = 3000;

//How to connect to database:
//Run mongod

var db = mongojs('birds', ['sightings']);
//         name of database     name of collection. Every Mongo DB creates folders/directories named 'Collections', 'Functions', & 'Users' by default. You can rename & create your own.
app.post('/api/sighting', function(req, res) {  //we only use next inside middleware.
  var dataToInsert = req.body;

  db.sightings.insert(dataToInsert, function(err, result) {
    if(err) {
      res.status(500).send('Failed to add new record');
    }
    res.send(result);
  });
    console.log('POST success');
});

app.get('/api/sighting', function(req, res) {
  db.sightings.find({}, function(err, result) {
    if(err) {
      res.status(500).send('Failed to retrieve record');
    }
      res.send(result);
  });
    console.log('GET success');
});

app.put('/api/sighting/:id', function (req, res) {
  //db.sightings.findAndModify();

  var idToModify = ObjectId(req.params.id);

  var updateObject = {
    query: {_id: idToModify},
    update: { $set: req.body},  //we originally did just have req.body. That deleted all properties on the object. We used $set because it only rewrites the data properties we give it.
    new: false
  };

  db.sightings.findAndModify(updateObject, function(err, result){
    if(err) {
      res.status(500).send('Failed to modify record');
    }
    res.send('Data modification successful');
  });
  console.log('PUT success');
});

app.delete('/api/sighting/:id', function(req, res) {
  //db.sightings.remove();

  var idToDelete = ObjectId(req.params.id);

  db.sightings.remove({_id:idToDelete}, function(err, result){
    if(err) {
      res.status(500).send('Failed to delete record');
    }
    res.send('Successfully deleted record');
  });
  console.log('DELETE success');
});

app.listen(nodePort, function(){
  console.log('Listening on Port ' + nodePort);
});

// res.end();   means process worked but not sending back any data to the requester. Sends status code 200 instead.
