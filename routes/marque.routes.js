const express = require('express');
const pool    = require('../db/connection');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router  = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM marques ORDER BY nom ASC');
    return res.json({ success: true, data: rows });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const [[m]] = await pool.query('SELECT * FROM marques WHERE id=? LIMIT 1', [req.params.id]);
    if (!m) return res.status(404).json({ success: false, message: 'Marque introuvable' });
    return res.json({ success: true, data: m });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, slug, logo } = req.body;
    if (!nom || !slug) return res.status(400).json({ success: false, message: 'Nom et slug requis' });
    const [r] = await pool.query('INSERT INTO marques (nom, slug, logo) VALUES (?,?,?)', [nom, slug, logo]);
    return res.status(201).json({ success: true, data: { id: r.insertId } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: 'Slug déjà utilisé' });
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nom, slug, logo } = req.body;
    await pool.query('UPDATE marques SET nom=?,slug=?,logo=? WHERE id=?', [nom, slug, logo, req.params.id]);
    return res.json({ success: true, message: 'Marque mise à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM marques WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Marque supprimée' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
