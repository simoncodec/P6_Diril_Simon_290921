// importation du framwork Express pour node.JS
const express = require('express');

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

  