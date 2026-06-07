const express      = require('express');
const LivraisonDAO = require('../dao/livraison.dao');
const CommandeDAO  = require('../dao/commande.dao');
const NotificationDAO = require('../dao/notification.dao');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router       = express.Router();

router.get('/commande/:id', verifyToken, async (req, res) => {
  try {
    const commande = await CommandeDAO.findById(req.params.id);
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    if (commande.user_id !== req.user.id && req.user.role_id !== 1)
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    const livraison = await LivraisonDAO.findByCommande(req.params.id);
    return res.json({ success: true, data: livraison });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.put('/commande/:id/expedier', verifyToken, isAdmin, async (req, res) => {
  try {
    const { transporteur, numero_suivi, date_livraison_estimee } = req.body;
    if (!transporteur || !numero_suivi)
      return res.status(400).json({ success: false, message: 'Transporteur et numéro de suivi requis' });

    await LivraisonDAO.marquerExpediee(req.params.id, { transporteur, numero_suivi, date_livraison_estimee });
    await CommandeDAO.updateStatut(req.params.id, 'expediee');
    const commande = await CommandeDAO.findById(req.params.id);
    await NotificationDAO.create({
      user_id: commande.user_id,
      type:    'commande_expediee',
      message: `Votre commande ${commande.reference_commande} a été expédiée via ${transporteur}. Suivi : ${numero_suivi}`,
      lien:    `/commandes/${req.params.id}`,
    });

    return res.json({ success: true, message: 'Commande marquée expédiée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.put('/commande/:id/livree', verifyToken, isAdmin, async (req, res) => {
  try {
    await LivraisonDAO.marquerLivree(req.params.id);
    await CommandeDAO.updateStatut(req.params.id, 'livree');

    const commande = await CommandeDAO.findById(req.params.id);
    await NotificationDAO.create({
      user_id: commande.user_id,
      type:    'commande_livree',
      message: `Votre commande ${commande.reference_commande} a été livrée !`,
      lien:    `/commandes/${req.params.id}`,
    });

    return res.json({ success: true, message: 'Commande marquée livrée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.put('/commande/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await LivraisonDAO.update(req.params.id, req.body);
    return res.json({ success: true, message: 'Livraison mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
