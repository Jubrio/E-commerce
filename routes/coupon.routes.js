const express    = require('express');
const CouponDAO  = require('../dao/coupon.dao');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router     = express.Router();

router.post('/verifier', verifyToken, async (req, res) => {
  try {
    const { code, total } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Code requis' });

    const coupon = await CouponDAO.findByCode(code);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon invalide ou expiré' });

    if (total && total < coupon.minimum_commande)
      return res.status(400).json({ success: false, message: `Montant minimum requis : ${coupon.minimum_commande}€` });

    if (await CouponDAO.dejaUtilise(coupon.id, req.user.id))
      return res.status(400).json({ success: false, message: 'Coupon déjà utilisé' });

    const reduction = total ? CouponDAO.calculerReduction(coupon, total) : null;
    return res.json({ success: true, data: { coupon, reduction } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const rows = await CouponDAO.findAll();
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { code, type_reduction, reduction, minimum_commande, usage_max, expiration } = req.body;
    if (!code || !reduction)
      return res.status(400).json({ success: false, message: 'Code et réduction requis' });
    const id = await CouponDAO.create({ code, type_reduction, reduction, minimum_commande, usage_max, expiration });
    return res.status(201).json({ success: true, data: { id } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: 'Code déjà utilisé' });
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await CouponDAO.update(req.params.id, req.body);
    return res.json({ success: true, message: 'Coupon mis à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
