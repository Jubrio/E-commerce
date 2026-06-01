const express = require('express');
const pool    = require('../db/connection');
const { verifyToken } = require('../middleware/auth.middleware');
const router  = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.nom, p.slug, p.prix, f.created_at AS ajouté_le,
              (SELECT image FROM produit_images WHERE produit_id=p.id AND est_principale=TRUE LIMIT 1) AS image
       FROM favoris f JOIN produits p ON p.id=f.produit_id
       WHERE f.user_id=? ORDER BY f.created_at DESC`, [req.user.id]);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/', async (req, res) => {
  try {
    const { produit_id } = req.body;
    if (!produit_id) return res.status(400).json({ success: false, message: 'produit_id requis' });
    await pool.query('INSERT INTO favoris (user_id, produit_id) VALUES (?,?)', [req.user.id, produit_id]);
    return res.status(201).json({ success: true, message: 'Ajouté aux favoris' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.json({ success: true, message: 'Déjà en favoris' });
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.delete('/:produit_id', async (req, res) => {
  try {
    await pool.query('DELETE FROM favoris WHERE user_id=? AND produit_id=?', [req.user.id, req.params.produit_id]);
    return res.json({ success: true, message: 'Retiré des favoris' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
