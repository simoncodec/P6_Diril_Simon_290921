const mongoose = require('mongoose');

// constante qui permet de vérifier l'existence ou non de cette clé dans la BDD
const uniqueValidator = require('mongoose-unique-validator');
const passwordValidator = require("password-validator");

const userSchemas = mongoose.Schema ({
email: {type: String, required: true, unique: true},
password: {type: String, required: true}
});

// on applique le plugin pour vérifier la valeur unique de la donnée
userSchemas.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchemas);