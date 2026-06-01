const pool = require('../db/connection');

const PaiementDAO = {
  async create({ commande_id, montant, methode, transaction_id, statut='en_attente', payload_stripe=null }) {
    const [r] = await pool.query(
      `INSERT INTO paiements (commande_id, montant, methode, transaction_id, statut, payload_stripe)
       VALUES (?,?,?,?,?,?)`,
      [commande_id, montant, methode, transaction_id||null, statut, payload_stripe ? JSON.stringify(payload_stripe) : null]);
    return r.insertId;
  },

  async findByCommande(commande_id) {
    const [rows] = await pool.query(
      'SELECT * FROM paiements WHERE commande_id=? ORDER BY created_at DESC', [commande_id]);
    return rows;
  },

  async findByTransaction(transaction_id) {
    const [rows] = await pool.query(
      'SELECT * FROM paiements WHERE transaction_id=? LIMIT 1', [transaction_id]);
    return rows[0] || null;
  },

  async updateStatut(id, statut) {
    const [r] = await pool.query('UPDATE paiements SET statut=? WHERE id=?', [statut, id]);
    return r.affectedRows > 0;
  },

  async updateStatutByTransaction(transaction_id, statut, payload=null) {
    const [r] = await pool.query(
      'UPDATE paiements SET statut=?, payload_stripe=? WHERE transaction_id=?',
      [statut, payload ? JSON.stringify(payload) : null, transaction_id]);
    return r.affectedRows > 0;
  },
};

module.exports = PaiementDAO;
