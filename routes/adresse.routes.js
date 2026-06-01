const express     = require('express');
const AdresseDAO  = require('../dao/adresse.dao');
const { verifyToken } = require('../middleware/auth.middleware');
const router      = express.Router();

router.use(verifyToken);

// GET /api/adresses — mes adresses
router.get('/', async (req, res) => {
  try {
    const rows = await AdresseDAO.findByUser(req.user.id);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/adresses — ajouter une adresse
router.post('/', async (req, res) => {
  try {
    const id = await AdresseDAO.create(req.user.id, req.body);
    return res.status(201).json({ success: true, data: { id } });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/adresses/:id
router.put('/:id', async (req, res) => {
  try {
    const adresse = await AdresseDAO.findById(req.params.id);
    if (!adresse) return res.status(404).json({ success: false, message: 'Adresse introuvable' });
    if (adresse.user_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    await AdresseDAO.update(req.params.id, req.body);
    return res.json({ success: true, message: 'Adresse mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/adresses/:id/defaut — définir comme adresse par défaut
router.put('/:id/defaut', async (req, res) => {
  try {
    await AdresseDAO.setDefaut(req.params.id, req.user.id);
    return res.json({ success: true, message: 'Adresse par défaut mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// DELETE /api/adresses/:id
router.delete('/:id', async (req, res) => {
  try {
    const adresse = await AdresseDAO.findById(req.params.id);
    if (!adresse) return res.status(404).json({ success: false, message: 'Adresse introuvable' });
    if (adresse.user_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    await AdresseDAO.delete(req.params.id);
    return res.json({ success: true, message: 'Adresse supprimée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
