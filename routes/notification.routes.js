// backend/routes/notification.routes.js — VERSION CORRIGÉE
const express         = require('express');
const NotificationDAO = require('../dao/notification.dao');
const { verifyToken } = require('../middleware/auth.middleware');
const router          = express.Router();

router.use(verifyToken);

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const rows    = await NotificationDAO.findByUser(req.user.id, { page, limit });
    const nonLues = await NotificationDAO.countNonLues(req.user.id);
    return res.json({ success: true, data: { rows, nonLues } });
  } catch (err) {
    console.error('notifications GET:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/notifications/lire-tout — DOIT ÊTRE AVANT /:id/lire
router.put('/lire-tout', async (req, res) => {
  try {
    await NotificationDAO.marquerToutLu(req.user.id);
    return res.json({ success: true, message: 'Toutes lues' });
  } catch (err) {
    console.error('notifications lire-tout:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/notifications/:id/lire
router.put('/:id/lire', async (req, res) => {
  try {
    await NotificationDAO.marquerLu(req.params.id, req.user.id);
    return res.json({ success: true, message: 'Notification lue' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
  try {
    await NotificationDAO.delete(req.params.id, req.user.id);
    return res.json({ success: true, message: 'Supprimée' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
