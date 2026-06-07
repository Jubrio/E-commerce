const express       = require('express');
const PromotionDAO  = require('../dao/promotion.dao');
const { verifyToken, isAdmin, isVendeur } = require('../middleware/auth.middleware');
const router        = express.Router();

router.get('/actives', async (req, res) => {
  try {
    const rows = await PromotionDAO.findActive();
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/produit/:id', async (req, res) => {
  try {
    const rows = await PromotionDAO.findByProduit(req.params.id);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/', verifyToken, isVendeur, async (req, res) => {
  try {
    const { produit_id, pourcentage, date_debut, date_fin } = req.body;
    if (!produit_id || !pourcentage || !date_debut || !date_fin)
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    const id = await PromotionDAO.create({ produit_id, pourcentage, date_debut, date_fin });
    return res.status(201).json({ success: true, data: { id } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await PromotionDAO.update(req.params.id, req.body);
    return res.json({ success: true, message: 'Promotion mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await PromotionDAO.delete(req.params.id);
    return res.json({ success: true, message: 'Promotion supprimée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
