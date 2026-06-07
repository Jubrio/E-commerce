const pool = require('../db/connection');

const NotificationDAO = {

  async findByUser(user_id, { page = 1, limit = 20 } = {}) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [rows] = await pool.query(
      `SELECT id, user_id, type, message, lien, lu, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, parseInt(limit), offset]
    );
    return rows;
  },

  async countNonLues(user_id) {
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM notifications
       WHERE user_id = ? AND lu = FALSE`,
      [user_id]
    );
    return total;
  },

  async create({ user_id, type, message, lien = null }) {
    const [r] = await pool.query(
      `INSERT INTO notifications (user_id, type, message, lien)
       VALUES (?, ?, ?, ?)`,
      [user_id, type || 'info', message, lien]
    );
    return r.insertId;
  },

  async createBulk(user_ids, { type, message, lien = null }) {
    if (!user_ids || user_ids.length === 0) return;
    const values = user_ids.map(id => [id, type || 'info', message, lien]);
    await pool.query(
      `INSERT INTO notifications (user_id, type, message, lien) VALUES ?`,
      [values]
    );
  },

  async marquerLu(id, user_id) {
    const [r] = await pool.query(
      `UPDATE notifications SET lu = TRUE WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    return r.affectedRows > 0;
  },

  async marquerToutLu(user_id) {
    await pool.query(
      `UPDATE notifications SET lu = TRUE WHERE user_id = ?`,
      [user_id]
    );
  },

  async delete(id, user_id) {
    await pool.query(
      `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
  },
};

module.exports = NotificationDAO;
