const express     = require('express');
const MessageDAO  = require('../dao/message.dao');
const { verifyToken } = require('../middleware/auth.middleware');
const router      = express.Router();

router.use(verifyToken);

// GET /api/messages/conversations
router.get('/conversations', async (req, res) => {
  try {
    const rows = await MessageDAO.findConversations(req.user.id);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// GET /api/messages/:interlocuteur_id
router.get('/:interlocuteur_id', async (req, res) => {
  try {
    const rows = await MessageDAO.findMessages(req.user.id, req.params.interlocuteur_id, req.query);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/messages — envoyer un message
router.post('/', async (req, res) => {
  try {
    const { destinataire_id, message, commande_id } = req.body;
    if (!destinataire_id || !message)
      return res.status(400).json({ success: false, message: 'Destinataire et message requis' });
    if (destinataire_id === req.user.id)
      return res.status(400).json({ success: false, message: 'Impossible de vous envoyer un message' });
    const id = await MessageDAO.send({ expediteur_id: req.user.id, destinataire_id, message, commande_id });
    return res.status(201).json({ success: true, data: { id } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// GET /api/messages/non-lus/count
router.get('/non-lus/count', async (req, res) => {
  try {
    const total = await MessageDAO.countNonLus(req.user.id);
    return res.json({ success: true, data: { total } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
