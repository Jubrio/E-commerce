const express      = require('express');
const PaiementDAO  = require('../dao/paiement.dao');
const CommandeDAO  = require('../dao/commande.dao');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router       = express.Router();

// GET /api/paiements/commande/:id — client voit ses paiements
router.get('/commande/:id', verifyToken, async (req, res) => {
  try {
    const commande = await CommandeDAO.findById(req.params.id);
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    if (commande.user_id !== req.user.id && req.user.role_id !== 1)
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    const rows = await PaiementDAO.findByCommande(req.params.id);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/paiements/stripe/checkout — créer session Stripe
router.post('/stripe/checkout', verifyToken, async (req, res) => {
  try {
    const stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { commande_id, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      line_items:           items.map(i => ({
        price_data: {
          currency:     'eur',
          product_data: { name: i.nom },
          unit_amount:  Math.round(i.prix * 100),
        },
        quantity: i.quantite,
      })),
      success_url: `${process.env.FRONTEND_URL}/commande/succes?commande_id=${commande_id}`,
      cancel_url:  `${process.env.FRONTEND_URL}/panier`,
      metadata:    { commande_id: String(commande_id), user_id: String(req.user.id) },
    });

    // Enregistrer le paiement en attente
    await PaiementDAO.create({
      commande_id,
      montant:        req.body.total,
      methode:        'stripe',
      transaction_id: session.id,
      statut:         'en_attente',
    });

    return res.json({ success: true, data: { url: session.url, session_id: session.id } });
  } catch (err) {
    console.error('stripe checkout:', err);
    return res.status(500).json({ success: false, message: 'Erreur Stripe' });
  }
});

// POST /api/paiements/stripe/webhook — Stripe nous notifie

router.post('/stripe/webhook',
  require('express').raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const sig    = req.headers['stripe-signature'];
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch {
        return res.status(400).json({ success: false, message: 'Signature webhook invalide' });
      }

      if (event.type === 'checkout.session.completed') {
        const session     = event.data.object;
        const commande_id = session.metadata.commande_id;

        // Mettre à jour paiement et commande
        await PaiementDAO.updateStatutByTransaction(session.id, 'reussi', session);
        await CommandeDAO.updateStatut(commande_id, 'payee');
      }

      if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        await PaiementDAO.updateStatutByTransaction(session.id, 'echoue', session);
      }

      return res.json({ received: true });
    } catch (err) {
      console.error('webhook error:', err);
      return res.status(500).json({ success: false });
    }
  }
); 
 
// GET /api/paiements — admin
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = require('../db/connection').query(
      'SELECT p.*, c.reference_commande FROM paiements p JOIN commandes c ON c.id=p.commande_id ORDER BY p.created_at DESC'
    );
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
