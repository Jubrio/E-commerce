const express       = require('express');
const PromotionDAO  = require('../dao/promotion.dao');
const { verifyToken, isAdmin, isVendeur } = require('../middleware/auth.middleware');
const router        = express.Router();

// GET /api/promotions/actives — public
router.get('/actives', async (req, res) => {
  try {
    const rows = await PromotionDAO.findActive();
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// GET /api/promotions/produit/:id — public
router.get('/produit/:id', async (req, res) => {
  try {
    const rows = await PromotionDAO.findByProduit(req.params.id);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/promotions — vendeur/admin
router.post('/', verifyToken, isVendeur, async (req, res) => {
  try {
    const { produit_id, pourcentage, date_debut, date_fin } = req.body;
    if (!produit_id || !pourcentage || !date_debut || !date_fin)
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    const id = await PromotionDAO.create({ produit_id, pourcentage, date_debut, date_fin });
    return res.status(201).json({ success: true, data: { id } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/promotions/:id — admin
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await PromotionDAO.update(req.params.id, req.body);
    return res.json({ success: true, message: 'Promotion mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// DELETE /api/promotions/:id — admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await PromotionDAO.delete(req.params.id);
    return res.json({ success: true, message: 'Promotion supprimée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
