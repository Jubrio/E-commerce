const express       = require('express');
const CommissionDAO = require('../dao/commission.dao');
const { verifyToken, isAdmin, isVendeur } = require('../middleware/auth.middleware');
const router        = express.Router();

router.get('/mes-commissions', verifyToken, isVendeur, async (req, res) => {
  try {
    const rows  = await CommissionDAO.findByVendeur(req.user.id, req.query);
    const total = await CommissionDAO.totalVendeur(req.user.id);
    return res.json({ success: true, data: { rows, total } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const rows = await CommissionDAO.findAll(req.query);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.put('/:id/verser', verifyToken, isAdmin, async (req, res) => {
  try {
    await CommissionDAO.marquerVersee(req.params.id);
    return res.json({ success: true, message: 'Commission marquée versée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
