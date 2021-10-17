// import du modèle pour les sauces
const Sauce = require("../models/modelsSauce"); 
// utilisation du package fs
const fs = require('fs');

const parseJwt = require("../utils/parseJwt");


// création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersdisLiked: [],
    });
    sauce
    .save()
    .then(() => res.status(201).json({ message: "La sauce a été enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

// récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch ((error) => {
            res.status(404).json({error})
        });
}

// récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces)
        })
        .catch ((error) => {
            res.status(404).json({error})
        });
}

// modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};


// suppression d'une sauce
exports.deleteSauce = (req, res, next) => 
{
    Sauce.findOne({ _id: req.params.id }) 
        .then((sauce) => 
        {
            console.log(sauce)
            const filename = sauce.imageUrl.split("/images/")[1];
            console.log(filename)
            fs.unlink(`images/${filename}`, () => 
            {
                Sauce.deleteOne({ _id: req.params.id }) 
                    .then(() => res.status(200).json({ message: `Sauce supprimée !` }))
                    .catch((error) => res.status(500).json({ error }));
            });
        })
        .catch((error) => res.status(400).json({ error }));
};


// mise en place du like/dislike des sauces
exports.likeDislikeSauce = (req, res, next) => {
    // création des constantes 
    const userId = req.body.userId;
    const sauceId = req.params.id;
    const like = req.body.like;
    const jwtUserId = parseJwt(req.headers.authorization.split(" ")[1]).userId;

    // vérification de l'user ID correspond à celui connecté au token
    if (userId !== jwtUserId){
        res.status(403).json({ message: `utilisateur non autorisé` })
    }

        //Définit le statut de like (1,-1,0,defaut)
        switch (like) {

            // cas ou l'utilisateur change d'avis
            case 0:
                Sauce.findOne({ _id: sauceId })
                    .then((sauce) => {
                        if (sauce.usersLiked.includes(userId)) {
                            Sauce.updateOne(
                                { _id: sauceId },
                                {
                                    // décrémentation du like
                                    $inc: { likes: -1 },
                                    // suppression de l'user dans le tableau
                                    $pull: { usersLiked: userId }, 
                                }
                            )
                                .then(() => {res.status(201).json({ message: `like supprimé` });
                                })
                                .catch((error) => res.status(500).json({ error }));
                        }
                        if (sauce.usersDisliked.includes(userId)) {
                            Sauce.updateOne(
                                { _id: sauceId },
                                {
                                    //décrémentation du dislike
                                    $inc: { dislikes: -1 }, 
                                    // suppression de l'user dans le tableau
                                    $pull: { usersDisliked: userId },
                                }
                            )
                                .then(() =>res.status(201).json({ message: `dislike supprimé` })
                                )
                                .catch((error) => res.status(500).json({ error }));
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
                break;

            // cas ou l'utilisateur aime la sauce        
            case 1: 
                Sauce.updateOne(
                    { _id: sauceId },
                    {
                        // invrémentation des likes
                        $inc: { likes: 1 },
                        // ajout de l'utilisateur qui a like au tableau
                        $push: { usersLiked: userId }, 
                    }
                )
                    .then(() =>res.status(201).json({ message: `J'aime!` })
                    )
                    .catch((error) => res.status(500).json({ error }));
                break;

            // cas ou l'utilisateur n'aime pas la sauce        
            case -1: 
                Sauce.updateOne(
                    { _id: sauceId },
                    {
                        // invrémentation des dislikes
                        $inc: { dislikes: 1 }, 
                        // ajout de l'utilisateur qui a dislike au tableau 
                        $push: { usersDisliked: userId }, 
                    }
                )
                    .then(() =>res.status(201).json({ message: `Je n'aime pas!` })
                    )
                    .catch((error) => res.status(500).json({ error }));
                break;
    
            default:
                return res.status(400).json({ message: "Bad request"});
            }
        };