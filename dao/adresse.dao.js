const pool = require('../db/connection');

const AdresseDAO = {
  async findByUser(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM adresses WHERE user_id = ? ORDER BY est_defaut DESC', [user_id]);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM adresses WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create(user_id, { libelle, pays, ville, adresse, code_postal, est_defaut = false }) {
    if (est_defaut) {
      await pool.query('UPDATE adresses SET est_defaut=FALSE WHERE user_id=?', [user_id]);
    }
    const [r] = await pool.query(
      `INSERT INTO adresses (user_id, libelle, pays, ville, adresse, code_postal, est_defaut)
       VALUES (?,?,?,?,?,?,?)`,
      [user_id, libelle, pays, ville, adresse, code_postal, est_defaut]);
    return r.insertId;
  },

  async update(id, { libelle, pays, ville, adresse, code_postal, est_defaut }) {
    if (est_defaut) {
      const [existing] = await pool.query('SELECT user_id FROM adresses WHERE id=?', [id]);
      if (existing[0]) {
        await pool.query('UPDATE adresses SET est_defaut=FALSE WHERE user_id=?', [existing[0].user_id]);
      }
    }
    const [r] = await pool.query(
      `UPDATE adresses SET libelle=?,pays=?,ville=?,adresse=?,code_postal=?,est_defaut=? WHERE id=?`,
      [libelle, pays, ville, adresse, code_postal, est_defaut, id]);
    return r.affectedRows > 0;
  },

  async delete(id) {
    const [r] = await pool.query('DELETE FROM adresses WHERE id=?', [id]);
    return r.affectedRows > 0;
  },

  async setDefaut(id, user_id) {
    await pool.query('UPDATE adresses SET est_defaut=FALSE WHERE user_id=?', [user_id]);
    await pool.query('UPDATE adresses SET est_defaut=TRUE WHERE id=? AND user_id=?', [id, user_id]);
  },
};

module.exports = AdresseDAO;
