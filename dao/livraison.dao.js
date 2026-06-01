const pool = require('../db/connection');

const LivraisonDAO = {
  async findByCommande(commande_id) {
    const [rows] = await pool.query(
      'SELECT * FROM livraisons WHERE commande_id=? LIMIT 1', [commande_id]);
    return rows[0] || null;
  },

  async update(commande_id, { transporteur, numero_suivi, statut, date_expedition, date_livraison_estimee, date_livraison_reelle }) {
    const [r] = await pool.query(
      `UPDATE livraisons SET transporteur=?,numero_suivi=?,statut=?,
              date_expedition=?,date_livraison_estimee=?,date_livraison_reelle=?
       WHERE commande_id=?`,
      [transporteur, numero_suivi, statut, date_expedition||null,
       date_livraison_estimee||null, date_livraison_reelle||null, commande_id]);
    return r.affectedRows > 0;
  },

  async updateStatut(commande_id, statut) {
    const [r] = await pool.query(
      'UPDATE livraisons SET statut=? WHERE commande_id=?', [statut, commande_id]);
    return r.affectedRows > 0;
  },

  async marquerExpediee(commande_id, { transporteur, numero_suivi, date_livraison_estimee }) {
    const [r] = await pool.query(
      `UPDATE livraisons SET statut='expedie', transporteur=?, numero_suivi=?,
              date_expedition=NOW(), date_livraison_estimee=?
       WHERE commande_id=?`,
      [transporteur, numero_suivi, date_livraison_estimee||null, commande_id]);
    return r.affectedRows > 0;
  },

  async marquerLivree(commande_id) {
    const [r] = await pool.query(
      `UPDATE livraisons SET statut='livre', date_livraison_reelle=NOW() WHERE commande_id=?`,
      [commande_id]);
    return r.affectedRows > 0;
  },
};

module.exports = LivraisonDAO;
