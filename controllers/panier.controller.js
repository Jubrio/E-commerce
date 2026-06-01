const PanierDAO  = require('../dao/panier.dao');
const ProduitDAO = require('../dao/produit.dao');

const PanierController = {
  async get(req, res) {
    try {
      const items = await PanierDAO.getItems(req.user.id);
      const total = items.reduce((s, i) => s + i.prix * i.quantite, 0);
      return res.json({ success: true, data: { items, total: parseFloat(total.toFixed(2)) } });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async add(req, res) {
  try {
    const { produit_id, quantite = 1 } = req.body;
    if (!produit_id) return res.status(400).json({ success: false, message: 'produit_id requis' });

    const produit = await ProduitDAO.findById(produit_id);
    if (!produit || !produit.actif) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    if (produit.stock < quantite) return res.status(409).json({ success: false, message: 'Stock insuffisant' });

    // Conversion robuste du prix
    let prix = produit.prix;
    if (typeof prix === 'string') {
      prix = prix.replace(',', '.'); // pour gérer les virgules françaises
    }
    prix = parseFloat(prix);
    if (isNaN(prix)) {
      console.error('Prix invalide pour produit', produit_id, ':', produit.prix);
      return res.status(500).json({ success: false, message: 'Prix du produit invalide' });
    }

    const items = await PanierDAO.addItem(req.user.id, produit_id, quantite, prix);
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('❌ Panier add error :', err);
    res.status(500).json({ success: false, message: err.message || 'Erreur interne' });
  }
},

  async update(req, res) {
    try {
      const items = await PanierDAO.updateQuantite(req.user.id, req.params.produit_id, req.body.quantite);
      return res.json({ success: true, data: items });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async remove(req, res) {
    try {
      const items = await PanierDAO.removeItem(req.user.id, req.params.produit_id);
      return res.json({ success: true, data: items });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async clear(req, res) {
    try {
      await PanierDAO.clear(req.user.id);
      return res.json({ success: true, message: 'Panier vidé' });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },
};

module.exports = PanierController;
