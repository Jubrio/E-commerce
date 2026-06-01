const express = require('express');
const pool    = require('../db/connection');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router  = express.Router();

// GET /api/avis?produit_id=X — public
router.get('/', async (req, res) => {
  try {
    const { produit_id } = req.query;
    if (!produit_id) return res.status(400).json({ success: false, message: 'produit_id requis' });
    const [rows] = await pool.query(
      `SELECT a.id, a.note, a.titre, a.commentaire, a.verifie, a.created_at,
              u.nom, u.prenom
       FROM avis a JOIN users u ON u.id=a.user_id
       WHERE a.produit_id=? ORDER BY a.created_at DESC`, [produit_id]);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/avis — client connecté
router.post('/', verifyToken, async (req, res) => {
  try {
    const { produit_id, note, titre, commentaire } = req.body;
    if (!produit_id || !note)
      return res.status(400).json({ success: false, message: 'produit_id et note requis' });
    if (note < 1 || note > 5)
      return res.status(400).json({ success: false, message: 'Note entre 1 et 5' });
    await pool.query(
      'INSERT INTO avis (user_id, produit_id, note, titre, commentaire) VALUES (?,?,?,?,?)',
      [req.user.id, produit_id, note, titre, commentaire]);
    return res.status(201).json({ success: true, message: 'Avis ajouté' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: 'Avis déjà soumis pour ce produit' });
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/avis/:id/verifier — admin marque l'avis comme vérifié
router.put('/:id/verifier', verifyToken, isAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE avis SET verifie=TRUE WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Avis vérifié' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// DELETE /api/avis/:id — admin ou auteur
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [[avis]] = await pool.query('SELECT user_id FROM avis WHERE id=?', [req.params.id]);
    if (!avis) return res.status(404).json({ success: false, message: 'Avis introuvable' });
    if (avis.user_id !== req.user.id && req.user.role_id !== 1)
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    await pool.query('DELETE FROM avis WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Avis supprimé' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
