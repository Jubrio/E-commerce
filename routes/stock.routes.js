const express   = require('express');
const StockDAO  = require('../dao/stock.dao');
const { verifyToken, isAdmin, isVendeur } = require('../middleware/auth.middleware');
const router    = express.Router();

router.get('/alertes', verifyToken, isVendeur, async (req, res) => {
  try {
    const seuil = parseInt(req.query.seuil) || 5;
    const rows  = await StockDAO.alerteStock(seuil);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/produit/:id', verifyToken, isVendeur, async (req, res) => {
  try {
    const rows = await StockDAO.findByProduit(req.params.id, req.query);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/produit/:id/entree', verifyToken, isVendeur, async (req, res) => {
  try {
    const { quantite, raison } = req.body;
    if (!quantite || quantite <= 0)
      return res.status(400).json({ success: false, message: 'Quantité invalide' });
    await StockDAO.entree(req.params.id, quantite, raison);
    return res.json({ success: true, message: 'Stock mis à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/produit/:id/ajustement', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nouveau_stock, raison } = req.body;
    if (nouveau_stock === undefined || nouveau_stock < 0)
      return res.status(400).json({ success: false, message: 'Stock invalide' });
    await StockDAO.ajustement(req.params.id, nouveau_stock, raison);
    return res.json({ success: true, message: 'Stock ajusté' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
