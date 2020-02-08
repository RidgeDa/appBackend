/*var express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
 
app.use(express.static("public"));

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get("/test", (req, res) => {
    console.log("here");
})
 
// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  res.send('welcome, ' + req.body.username)
})
 
// POST /api/users gets JSON bodies
app.post('/users/signup', jsonParser, function (req, res) {
  console.log(req.body.username);
  res.send("REgistration successful");
})

app.listen(3400);
*/
 
//Load express.js
const express = require('express') 
const app = express()

const lessons = [
  { 'topic': 'math', 'location': 'hendon', 'price': 100 },
  { 'topic': 'math', 'location': 'colindale', 'price': 80 },
  { 'topic': 'math', 'location': 'brent cross', 'price': 90 },
  { 'topic': 'math', 'location': 'golders green', 'price': 120 },
  ];

// Load bodyparser module for json
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//connect to mongodb
const MongoClient = require('mongodb').MongoClient;
let db; 
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {     
  db = client.db('afterschool') 
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Get the collection name
app.param('signUp', (req, res, next, collectionName) => {   
  req.collection = db.collection(collectionName)   
  return next() 
})

//Get the collection name
app.param('login', (req, res, next, collectionName) => {   
  req.collection = db.collection(collectionName)   
  return next() 
})


// dispaly a message for root path to show that API is working 
app.get('/', function (req, res) {     
  res.send('Select a collection, e.g., /collections/signUp') 
})

// dispaly a message for root path to show that API is working 
app.get('/', function (req, res) {     
  res.send('Select a collection, e.g., /collections/login') 
})

// dispaly a message for root path to show that API is working 
app.get('/', function (req, res) {     
  res.send('Select a collection, e.g., /collections/lessons') 
})

// retrieve all the objects from an collection 
app.get('/collections/:signUp', (req, res) => {     
  req.collection.find({}, { limit: 5, sort: [['price', -1]] }).toArray((e, results) => {         
    if (e) return next(e)         
    res.send(results)     
  }) 
})

// retrieve all the objects from an collection 
app.get('/collections/:login', (req, res) => {     
  req.collection.find({}, { limit: 5, sort: [['price', -1]] }).toArray((e, results) => {         
    if (e) return next(e)         
    res.send(results)     
  }) 
})

// retrieve all the objects from an collection 
app.get('/collections/:lessons', (req, res) => {     
  req.collection.find({}, { limit: 5, sort: [['price', -1]] }).toArray((e, results) => {         
    if (e) return next(e)         
    res.send(results)     
  }) 
})

// add a signUp
app.post('/:signUp', (req, res, next) => {     
  // TODO: Validate req.body
       req.collection.insert(req.body, (e, results) => {         
         if (e) return next(e)         
         res.send(results.ops)     
        }) 
      })

// add a lessons
app.post('/:login', (req, res, next) => {     
  // TODO: Validate req.body
       req.collection.insert(req.body, (e, results) => {         
         if (e) return next(e)         
         res.send(results.ops)     
        }) 
      })

// add a lessons
app.post('/:lessons', (req, res, next) => {     
  // TODO: Validate req.body
       req.collection.insert(req.body, (e, results) => {         
         if (e) return next(e)         
         res.send(results.ops)     
        }) 
      })      

// retrieve a lesson by mongodb ID
const ObjectID = require('mongodb').ObjectID; 
app.get('/collections/:collectionName/:id', (req, res, next) => {     
  console.log('searching json object with id:', req.params.id)     
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {         
    if (e) return next(e)         
    res.send(result)     
  }) 
})

// define the route
app.get('/:lessons', (req, res) => {
  res.send(JSON.stringify(lessons));
  })

// update a lesson by ID
 app.put('/collections/:collectionName/:id', (req, res, next) => {     
   req.collection.update({ _id: new ObjectID(req.params.id) },         
   { $set: req.body },         
   { safe: true, multi: false }, (e, result) => {             
     if (e) return next(e)             
     res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })         
    }) 
  }) 
 
  // delete a lesson by ID 
  app.delete('/collections/:collectionName/:id', (req, res, next) => {     
    req.collection.deleteOne({ _id: ObjectID(req.params.id) }, (e, result) => {         
      if (e) return next(e)         
      res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })     
    }) 
  }) 
 app.listen(3000)
