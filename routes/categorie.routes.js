const express = require('express');
const pool    = require('../db/connection');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.nom, c.slug, c.description, c.image, c.parent_id,
              p.nom AS parent_nom
       FROM categories c LEFT JOIN categories p ON p.id=c.parent_id
       ORDER BY c.parent_id IS NOT NULL, c.nom ASC`);
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [[cat]] = await pool.query('SELECT * FROM categories WHERE id=? LIMIT 1', [req.params.id]);
    if (!cat) return res.status(404).json({ success: false, message: 'Catégorie introuvable' });
    return res.json({ success: true, data: cat });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, slug, description, image, parent_id } = req.body;
    if (!nom || !slug) return res.status(400).json({ success: false, message: 'Nom et slug requis' });
    const [r] = await pool.query(
      'INSERT INTO categories (nom, slug, description, image, parent_id) VALUES (?,?,?,?,?)',
      [nom, slug, description, image, parent_id || null]);
    return res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: 'Slug déjà utilisé' });
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, slug, description, image, parent_id } = req.body;
    await pool.query(
      'UPDATE categories SET nom=?,slug=?,description=?,image=?,parent_id=? WHERE id=?',
      [nom, slug, description, image, parent_id || null, req.params.id]);
    return res.json({ success: true, message: 'Catégorie mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Catégorie supprimée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
