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

// Load bodyparser module for json
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//connect to mongodb
const MongoClient = require('mongodb').MongoClient;
let db; 
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {     
  db = client.db('afterschool') 
})

//Get the collection name
app.param('signUp', (req, res, next, collectionName) => {   
  req.collection = db.collection(collectionName)   
  return next() 
})


// dispaly a message for root path to show that API is working 
app.get('/', function (req, res) {     
  res.send('Select a collection, e.g., /collections/signUp') 
})

// retrieve all the objects from an collection 
app.get('/collections/:signUp', (req, res) => {     
  req.collection.find({}, { limit: 5, sort: [['price', -1]] }).toArray((e, results) => {         
    if (e) return next(e)         
    res.send(results)     
  }) 
})

// add a lesson
app.post('/signup/:collectionName', (req, res, next) => {     
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
