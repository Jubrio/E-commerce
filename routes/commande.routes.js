const express            = require('express');
const CommandeController = require('../controllers/commande.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router             = express.Router();

router.use(verifyToken);

router.post('/',             CommandeController.create);
router.get('/mes-commandes', CommandeController.getMesCommandes);
router.get('/all',           isAdmin, CommandeController.getAll);
router.get('/:id',           CommandeController.getOne);
router.put('/:id/statut',    isAdmin, CommandeController.updateStatut);

module.exports = router;
