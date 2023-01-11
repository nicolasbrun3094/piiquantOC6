const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');



// //Permet de sécuriser nos en-têtes HTPP
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));



// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

const mongo_pwd = process.env.MONGODB_PASSWORD;
const mongo_name = process.env.MONGODB_NAME;

mongoose.connect('mongodb+srv://Yaga:cluster0@cluster0.38sv9pe.mongodb.net/test',

    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// remplace body.PARSON et gère les routes post
app.use(express.json());

// permet de ne pas avoir d'erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
  

module.exports = app;