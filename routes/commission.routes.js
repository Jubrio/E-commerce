const express       = require('express');
const CommissionDAO = require('../dao/commission.dao');
const { verifyToken, isAdmin, isVendeur } = require('../middleware/auth.middleware');
const router        = express.Router();

// GET /api/commissions/mes-commissions — vendeur
router.get('/mes-commissions', verifyToken, isVendeur, async (req, res) => {
  try {
    const rows  = await CommissionDAO.findByVendeur(req.user.id, req.query);
    const total = await CommissionDAO.totalVendeur(req.user.id);
    return res.json({ success: true, data: { rows, total } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// GET /api/commissions — admin : toutes les commissions
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const rows = await CommissionDAO.findAll(req.query);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/commissions/:id/verser — admin marque comme versée
router.put('/:id/verser', verifyToken, isAdmin, async (req, res) => {
  try {
    await CommissionDAO.marquerVersee(req.params.id);
    return res.json({ success: true, message: 'Commission marquée versée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
