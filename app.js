const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Product = require('./models/Product');

let db_name = "Project_quizz";
let db_user = "RomWIR";
let db_pwrd = "SeFXtMQqdcf7Q9a";

mongoose.connect('mongodb+srv://' + db_user + ':' + db_pwrd + '@cluster0.la3ur.mongodb.net/' + db_name + '?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie (' + db_name + ') - ' + Date.now() ))
    .catch((mongo_error) => console.log('Connexion à MongoDB échouée !\n' + mongo_error));

const app = express();

app.use((req, res, next) => { // CORS Policy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/products', (req, res, next) => {
    delete req.body._id;
    const product = new Product({
        ...req.body
    });
    product.save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error })); // error = raccourci JS
});

app.get('/api/products', (req, res, next) => { // URL Visée par l'application (uniquement l'extension et pas l'URL totale)
    Product.find() // Get sur la totalité des products
    .then(products => {
        res.status(200).json(products);
        console.log({products: Product});
    }) // find retourne une Promise
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id }) // get sur un seul produit
    .then(product => res.status(200).json(product)) // nouvelle Promise
    .catch(error => res.status(404).json({ error }));
});

app.put('/api/products/:id', (req, res, next) => {
    Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!'}))
    .catch(error => res.status(400).json({ error}));
});

app.delete('/api/products/:id', (req, res, next) => {
   Product.deleteOne({ _id: req.params.id })
   .then(() => res.status(200).json({ mesage: 'Deleted!'}))
   .catch(error => res.status(400).json({ error })); 
});

module.exports = app;