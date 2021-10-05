const express = require('express');
// création d'un routeur pour l'enregistrement des routes de nos sauces
const router = express.Router();
// récupération du controleur sauce
const sauceCtrl = require('../controllers/sauces');
// récupération du middleware d'authentification pour l'appiquer a nos routes
const auth = require('../middleware/auth');
// récupération du middleware multer
const multer = require('../middleware/multer-config');

// on relie les routes aux controllers créés
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);


// export des routes créées
module.exports = router;