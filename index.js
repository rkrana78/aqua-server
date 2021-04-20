const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dxp0i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const serviceCollection = client.db("aquaService").collection("services");
  const testimonialCollection = client.db("aquaService").collection("testimonials");
  const orderCollection = client.db("aquaService").collection("orders");
  const adminCollection = client.db("aquaService").collection("admin");
  

  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })

  app.get('/service/:id', (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
    res.send(documents[0]);
    })
    
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service: ', newService)
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/testimonials', (req, res) => {
    testimonialCollection.find()
    .toArray((err, items) => {
      res.send(items)
      
    })
  })

  app.post('/addTestimonial', (req, res) => {
    const newTestimonial = req.body;
    console.log('adding new testimonial: ', newTestimonial)
    testimonialCollection.insertOne(newTestimonial)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log('adding order: ', newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res) => {
    //console.log(req.headers.email)
    orderCollection.find({email: req.query.email})
    .toArray((err, items) => {
      res.send(items)
      
    })
  })




  app.delete('/delete/:id', (req, res) =>{
    serviceCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
    console.log(req.params.id)
    .then( result => {
      console.log(result.deletedCount)
      res.send(result.deletedCount > 0)
    })
  })

  
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('add admin: ', newAdmin)
    adminCollection.insertOne(newAdmin)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/checkAdmin', (req, res) => {
    //console.log(req.headers.email)
    adminCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents.length > 0)
      
    })
  })

 // client.close();
});


app.listen(port)