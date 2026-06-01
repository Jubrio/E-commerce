// backend/dao/user.dao.js — FIX photo profil
// Problème : update() recevait photo_profil=undefined et écrasait la photo en NULL
// Fix : on met à jour seulement les champs fournis

const pool = require('../db/connection');

const UserDAO = {

  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND actif = TRUE LIMIT 1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
              u.photo_profil, u.role_id, r.nom_role, u.created_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = ? AND u.actif = TRUE LIMIT 1`, [id]);
    return rows[0] || null;
  },

  async create({ nom, prenom, email, telephone, mot_de_passe, role_id = 3 }) {
    const [r] = await pool.query(
      `INSERT INTO users (nom, prenom, email, telephone, mot_de_passe, role_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, telephone, mot_de_passe, role_id]);
    return r.insertId;
  },

  // FIX : met à jour SEULEMENT les champs fournis, ne touche pas photo_profil
  async update(id, { nom, prenom, telephone }) {
    const parts  = [];
    const values = [];

    if (nom       !== undefined) { parts.push('nom = ?');       values.push(nom); }
    if (prenom    !== undefined) { parts.push('prenom = ?');    values.push(prenom); }
    if (telephone !== undefined) { parts.push('telephone = ?'); values.push(telephone); }

    if (parts.length === 0) return true; // rien à mettre à jour

    values.push(id);
    const [r] = await pool.query(
      `UPDATE users SET ${parts.join(', ')} WHERE id = ?`, values);
    return r.affectedRows > 0;
  },

  // Méthode séparée pour la photo (appelée uniquement via /api/upload/profil)
  async updatePhoto(id, photo_profil) {
    const [r] = await pool.query(
      'UPDATE users SET photo_profil = ? WHERE id = ?', [photo_profil, id]);
    return r.affectedRows > 0;
  },

  async updatePassword(id, mot_de_passe) {
    const [r] = await pool.query(
      'UPDATE users SET mot_de_passe = ? WHERE id = ?', [mot_de_passe, id]);
    return r.affectedRows > 0;
  },

  async desactiver(id) {
    const [r] = await pool.query(
      'UPDATE users SET actif = FALSE WHERE id = ?', [id]);
    return r.affectedRows > 0;
  },

  async findAll({ page = 1, limit = 20 } = {}) {
    const offset   = (parseInt(page) - 1) * parseInt(limit);
    const limitInt = parseInt(limit);
    const [rows]   = await pool.query(
      `SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
              u.photo_profil, u.actif, u.role_id,
              r.nom_role, u.created_at
       FROM users u
       JOIN roles r ON r.id = u.role_id
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [limitInt, offset]);
    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    return { rows, total: parseInt(total), page: parseInt(page), limit: limitInt };
  },
};

module.exports = UserDAO;
