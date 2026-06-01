const express          = require('express');
const PanierController = require('../controllers/panier.controller');
const { verifyToken }  = require('../middleware/auth.middleware');
const router           = express.Router();

router.use(verifyToken);

router.get('/',               PanierController.get);
router.post('/',              PanierController.add);
router.put('/:produit_id',    PanierController.update);
router.delete('/vider',       PanierController.clear);
router.delete('/:produit_id', PanierController.remove);

module.exports = router;
