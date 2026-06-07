const express           = require('express');
const ProduitController = require('../controllers/produit.controller');
const { verifyToken, isVendeur, optionalVerifyToken } = require('../middleware/auth.middleware');
const router            = express.Router();

router.get('/', optionalVerifyToken, ProduitController.getAll);
router.get('/:id', ProduitController.getOne);
router.post('/',     verifyToken, isVendeur, ProduitController.create);
router.put('/:id',   verifyToken, isVendeur, ProduitController.update);
router.delete('/:id',verifyToken, isVendeur, ProduitController.remove);
router.put('/:id/reactiver', verifyToken, ProduitController.reactiver);

module.exports = router;