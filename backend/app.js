// importation du framwork Express pour node.JS
const express = require('express');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;

// importation de mmongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://raiden952:Xironman**@clusters.aqdlj.mongodb.net/Clusters?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

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

// utilisation des routes vers les sauces
app.use('/api/sauces', sauceRoutes);
// utilisation des routes vers les users
app.use('/api/auth', userRoutes);