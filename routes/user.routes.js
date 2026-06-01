// backend/routes/user.routes.js — VERSION CORRIGÉE
// Ajout : admin peut créer un compte vendeur ou client

const express   = require('express');
const bcrypt    = require('bcryptjs');
const UserDAO   = require('../dao/user.dao');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const router    = express.Router();

router.use(verifyToken);

// GET /api/users/profil
router.get('/profil', async (req, res) => {
  try {
    const user = await UserDAO.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Introuvable' });
    return res.json({ success: true, data: user });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/users/profil
router.put('/profil', async (req, res) => {
  try {
    await UserDAO.update(req.user.id, req.body);
    return res.json({ success: true, message: 'Profil mis à jour' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/users/mot-de-passe
router.put('/mot-de-passe', async (req, res) => {
  try {
    const { ancien, nouveau } = req.body;
    if (!ancien || !nouveau)
      return res.status(400).json({ success: false, message: 'Ancien et nouveau requis' });
    const user = await UserDAO.findByEmail(req.user.email);
    const ok   = await bcrypt.compare(ancien, user.mot_de_passe);
    if (!ok) return res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect' });
    const hash = await bcrypt.hash(nouveau, 12);
    await UserDAO.updatePassword(req.user.id, hash);
    return res.json({ success: true, message: 'Mot de passe modifié' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// GET /api/users — admin
router.get('/', isAdmin, async (req, res) => {
  try {
    const result = await UserDAO.findAll(req.query);
    return res.json({ success: true, data: result });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// POST /api/users/creer — admin crée un compte vendeur ou client
router.post('/creer', isAdmin, async (req, res) => {
  try {
    const { nom, prenom, email, telephone, mot_de_passe, role_id } = req.body;

    if (!nom || !email || !mot_de_passe)
      return res.status(400).json({ success: false, message: 'Nom, email et mot de passe requis' });

    // role_id : 2 = vendeur, 3 = client (admin ne peut pas créer un autre admin)
    const roleValide = [2, 3].includes(parseInt(role_id));
    if (!roleValide)
      return res.status(400).json({ success: false, message: 'Rôle invalide (2=vendeur, 3=client)' });

    const existant = await UserDAO.findByEmail(email);
    if (existant)
      return res.status(409).json({ success: false, message: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(mot_de_passe, 12);
    const id   = await UserDAO.create({ nom, prenom, email, telephone, mot_de_passe: hash, role_id: parseInt(role_id) });

    return res.status(201).json({ success: true, message: 'Compte créé', data: { id, nom, email, role_id } });
  } catch (err) {
    console.error('creer user:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT /api/users/:id/desactiver — admin
router.put('/:id/desactiver', isAdmin, async (req, res) => {
  try {
    await UserDAO.desactiver(req.params.id);
    return res.json({ success: true, message: 'Compte désactivé' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

// PUT /api/users/:id/reactiver — admin
router.put('/:id/reactiver', isAdmin, async (req, res) => {
  try {
    const pool = require('../db/connection');
    await pool.query('UPDATE users SET actif = TRUE WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Compte réactivé' });
  } catch { return res.status(500).json({ success: false, message: 'Erreur serveur' }); }
});

module.exports = router;
