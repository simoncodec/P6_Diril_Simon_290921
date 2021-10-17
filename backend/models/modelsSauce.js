// import de mongoose pour utiliser le schéma de donner crée
const mongoose = require('mongoose');

// création du schemas pour les sauces
const sauceSchema = mongoose.Schema ({
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPepper: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, require: false},
    dislikes: {type: Number, require: false},
    usersLiked: {type: [String], require: false},
    usersDisliked: {type: [String], require: false},
});

module.exports = mongoose.model('sauce', sauceSchema);