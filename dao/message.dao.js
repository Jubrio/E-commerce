const pool = require('../db/connection');

const MessageDAO = {
  async findConversations(user_id) {
    const [rows] = await pool.query(
      `SELECT
         IF(m.expediteur_id=?, m.destinataire_id, m.expediteur_id) AS interlocuteur_id,
         u.nom, u.prenom, u.photo_profil,
         MAX(m.created_at) AS derniere_activite,
         SUM(m.lu=FALSE AND m.destinataire_id=?) AS non_lus
       FROM messages m
       JOIN users u ON u.id = IF(m.expediteur_id=?, m.destinataire_id, m.expediteur_id)
       WHERE m.expediteur_id=? OR m.destinataire_id=?
       GROUP BY interlocuteur_id
       ORDER BY derniere_activite DESC`,
      [user_id, user_id, user_id, user_id, user_id]);
    return rows;
  },

  async findMessages(user_id, interlocuteur_id, { page=1, limit=50 } = {}) {
    const offset = (page-1)*limit;
    const [rows] = await pool.query(
      `SELECT m.*, u.nom AS expediteur_nom
       FROM messages m JOIN users u ON u.id=m.expediteur_id
       WHERE (m.expediteur_id=? AND m.destinataire_id=?)
          OR (m.expediteur_id=? AND m.destinataire_id=?)
       ORDER BY m.created_at ASC LIMIT ? OFFSET ?`,
      [user_id, interlocuteur_id, interlocuteur_id, user_id, limit, offset]);

    await pool.query(
      'UPDATE messages SET lu=TRUE WHERE destinataire_id=? AND expediteur_id=? AND lu=FALSE',
      [user_id, interlocuteur_id]);

    return rows;
  },

  async send({ expediteur_id, destinataire_id, message, commande_id=null }) {
    const [r] = await pool.query(
      `INSERT INTO messages (expediteur_id, destinataire_id, message, commande_id)
       VALUES (?,?,?,?)`,
      [expediteur_id, destinataire_id, message, commande_id]);
    return r.insertId;
  },

  async countNonLus(user_id) {
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) AS total FROM messages WHERE destinataire_id=? AND lu=FALSE', [user_id]);
    return total;
  },
};

module.exports = MessageDAO;
