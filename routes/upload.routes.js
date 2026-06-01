// backend/routes/upload.routes.js
const express              = require('express');
const { uploadProduit, uploadProfil, deleteImage } = require('../middleware/cloudinary');
const { verifyToken, isVendeur } = require('../middleware/auth.middleware');
const pool                 = require('../db/connection');
const router               = express.Router();

// ── POST /api/upload/produit/:id/images ─────────────────────
// Uploader 1 à 5 images pour un produit
router.post(
  '/produit/:id/images',
  verifyToken,
  isVendeur,
  uploadProduit.array('images', 5),
  async (req, res) => {
    try {
      const produit_id     = req.params.id;
      const estPrincipale  = req.body.est_principale === 'true';
      const files          = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });
      }

      // Si première image ou demande principale → reset les autres
      if (estPrincipale) {
        await pool.query(
          'UPDATE produit_images SET est_principale = FALSE WHERE produit_id = ?',
          [produit_id]
        );
      }

      const inserted = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const [r] = await pool.query(
          'INSERT INTO produit_images (produit_id, image, est_principale, ordre) VALUES (?,?,?,?)',
          [produit_id, file.path, i === 0 && estPrincipale, i]
        );
        inserted.push({ id: r.insertId, image: file.path, est_principale: i === 0 && estPrincipale });
      }

      return res.status(201).json({ success: true, data: inserted });
    } catch (err) {
      console.error('upload produit images:', err);
      return res.status(500).json({ success: false, message: 'Erreur upload' });
    }
  }
);

// ── DELETE /api/upload/produit/image/:image_id ──────────────
router.delete('/produit/image/:image_id', verifyToken, isVendeur, async (req, res) => {
  try {
    const [[img]] = await pool.query(
      'SELECT * FROM produit_images WHERE id = ? LIMIT 1', [req.params.image_id]
    );
    if (!img) return res.status(404).json({ success: false, message: 'Image introuvable' });

    await deleteImage(img.image);
    await pool.query('DELETE FROM produit_images WHERE id = ?', [req.params.image_id]);

    return res.json({ success: true, message: 'Image supprimée' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erreur suppression' });
  }
});

// ── POST /api/upload/profil ─────────────────────────────────
router.post('/profil', verifyToken, uploadProfil.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier' });
    await pool.query(
      'UPDATE users SET photo_profil = ? WHERE id = ?',
      [req.file.path, req.user.id]
    );
    return res.json({ success: true, data: { photo_profil: req.file.path } });
  } catch {
    return res.status(500).json({ success: false, message: 'Erreur upload profil' });
  }
});

module.exports = router;
