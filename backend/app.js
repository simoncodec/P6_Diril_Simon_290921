// import framework Express pour node.js
const express = require('express');

// création des constantes pour importer les routes créées
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// utilisation de path pour accéder au chemins des fichiers
const path = require('path');

//package pour faciliter les interaction avec MongoDB
// import du package
const mongoose = require('mongoose');

const mongoSanitize = require('express-mongo-sanitize');

// import d'helmet pour sécuriser les entetes requetes
const helmet = require("helmet");

// créé un environnement avec des variables confidentielles
require('dotenv').config();


// Connexion de l'API à MongoDB grace au package mongoose
mongoose.connect(process.env.MONGO_DB,
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !!!!!!'))
  .catch(() => console.log('Connexion à MongoDB échouée ! :('));

// mise en place du framework après importation
const app = express();

// paramétrage d'entete des requetes globales
app.use((req, res, next) =>{
    // autorisaion d'accès : tout le monde
    res.setHeader('Access-Control-Allow-Origin', '*');
    // autorisation d'utilisation des entetes définies
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // autorisation pour utiliser les méthodes définies
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //on passe au middleware suivant
    next();
});

// remplace bodyparser et recupere requetes au format json
app.use(express.json());

// utilisation du package pour la protection contre les injections SQL
app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));

//applique le plugin helmet
app.use(helmet());

// utilisation des routes vers les sauces
app.use('/api/sauces', sauceRoutes);
// utilisation des routes vers les users
app.use('/api/auth', userRoutes);

module.exports = app;