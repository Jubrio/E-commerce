const express           = require('express');
const ProduitController = require('../controllers/produit.controller');
const { verifyToken, isVendeur, optionalVerifyToken } = require('../middleware/auth.middleware');
const router            = express.Router();

// Public (mais détecte si admin est connecté)
router.get('/', optionalVerifyToken, ProduitController.getAll);
router.get('/:id', ProduitController.getOne);

// Vendeur / Admin
router.post('/',     verifyToken, isVendeur, ProduitController.create);
router.put('/:id',   verifyToken, isVendeur, ProduitController.update);
router.delete('/:id',verifyToken, isVendeur, ProduitController.remove);
router.put('/:id/reactiver', verifyToken, ProduitController.reactiver);

module.exports = router;