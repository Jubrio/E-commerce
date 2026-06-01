const CommandeDAO     = require('../dao/commande.dao');
const PanierDAO       = require('../dao/panier.dao');
const CouponDAO       = require('../dao/coupon.dao');
const NotificationDAO = require('../dao/notification.dao');

const CommandeController = {
  async create(req, res) {
    try {
      const user_id = req.user.id;
      const { adresse_livraison, telephone, mode_paiement, code_coupon, notes_client } = req.body;
      if (!adresse_livraison || !telephone || !mode_paiement)
        return res.status(400).json({ success: false, message: 'Adresse, téléphone et mode paiement requis' });

      const items = await PanierDAO.getItems(user_id);
      if (!items.length) return res.status(400).json({ success: false, message: 'Panier vide' });

      for (const item of items) {
        if (item.stock < item.quantite)
          return res.status(409).json({ success: false, message: `Stock insuffisant : ${item.nom}` });
      }

      let total_avant_coupon = items.reduce((s, i) => s + i.prix * i.quantite, 0);
      let total = total_avant_coupon;
      let coupon = null;

      if (code_coupon) {
        coupon = await CouponDAO.findByCode(code_coupon);
        if (!coupon) return res.status(400).json({ success: false, message: 'Coupon invalide ou expiré' });
        if (total < coupon.minimum_commande)
          return res.status(400).json({ success: false, message: `Montant minimum requis : ${coupon.minimum_commande}€` });
        if (await CouponDAO.dejaUtilise(coupon.id, user_id))
          return res.status(400).json({ success: false, message: 'Coupon déjà utilisé' });
        const reduction = CouponDAO.calculerReduction(coupon, total);
        total = parseFloat((total - reduction).toFixed(2));
      }

      const { commande_id, reference } = await CommandeDAO.create({
        user_id, total, total_avant_coupon: parseFloat(total_avant_coupon.toFixed(2)),
        coupon_id: coupon?.id || null, adresse_livraison, telephone, mode_paiement, notes_client,
        items: items.map(i => ({ produit_id: i.produit_id, nom: i.nom, quantite: i.quantite, prix: i.prix, vendeur_id: i.vendeur_id })),
      });

      if (coupon) {
        await CouponDAO.incrementUsage(coupon.id);
        await CouponDAO.logUtilisation(coupon.id, user_id, commande_id);
      }

      await PanierDAO.clear(user_id);

      await NotificationDAO.create({
        user_id,
        type: 'nouvelle_commande',
        message: `Votre commande ${reference} a été passée avec succès.`,
        lien: `/commandes/${commande_id}`,
      });

      return res.status(201).json({ success: true, data: { commande_id, reference, total } });
    } catch (err) {
      console.error('commande create:', err);
      return res.status(500).json({ success: false, message: err.message || 'Erreur serveur' });
    }
  },

  async getMesCommandes(req, res) {
    try {
      const rows = await CommandeDAO.findByUser(req.user.id);
      return res.json({ success: true, data: rows });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async getOne(req, res) {
    try {
      const commande = await CommandeDAO.findById(req.params.id);
      if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
      if (commande.user_id !== req.user.id && req.user.role_id !== 1)
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      return res.json({ success: true, data: commande });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async updateStatut(req, res) {
    try {
      const { statut } = req.body;
      const valides = ['en_attente','payee','expediee','livree','annulee','remboursee'];
      if (!valides.includes(statut)) return res.status(400).json({ success: false, message: 'Statut invalide' });
      await CommandeDAO.updateStatut(req.params.id, statut);
      return res.json({ success: true, message: 'Statut mis à jour' });
    } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
  },

  async getAll(req, res) {
  try {
    const rows = await CommandeDAO.findAll(req.query);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ getAll error – DÉTAIL :", err);
    console.error("Stack :", err.stack);
    return res.status(500).json({ success: false, message: err.message });
  }
},
};

module.exports = CommandeController;
