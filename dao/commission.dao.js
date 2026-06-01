const pool = require('../db/connection');

const CommissionDAO = {
  async findByVendeur(vendeur_id, { page=1, limit=20 } = {}) {
    const offset = (page-1)*limit;
    const [rows] = await pool.query(
      `SELECT co.*, c.reference_commande, c.created_at AS date_commande
       FROM commissions co JOIN commandes c ON c.id=co.commande_id
       WHERE co.vendeur_id=? ORDER BY co.created_at DESC LIMIT ? OFFSET ?`,
      [vendeur_id, limit, offset]);
    return rows;
  },

  async totalVendeur(vendeur_id) {
    const [[r]] = await pool.query(
      `SELECT
         SUM(montant_vente)      AS total_ventes,
         SUM(montant_commission) AS total_commissions,
         SUM(IF(statut='versee', montant_commission, 0)) AS commissions_versees,
         SUM(IF(statut='en_attente', montant_commission, 0)) AS commissions_en_attente
       FROM commissions WHERE vendeur_id=?`, [vendeur_id]);
    return r;
  },

  async findAll({ page=1, limit=20, statut } = {}) {
    const offset = (page-1)*limit;
    let where = ''; const params = [];
    if (statut) { where = 'WHERE co.statut=?'; params.push(statut); }
    const [rows] = await pool.query(
      `SELECT co.*, u.nom AS vendeur_nom, c.reference_commande
       FROM commissions co
       JOIN users    u ON u.id=co.vendeur_id
       JOIN commandes c ON c.id=co.commande_id
       ${where} ORDER BY co.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]);
    return rows;
  },

  async marquerVersee(id) {
    const [r] = await pool.query(
      `UPDATE commissions SET statut='versee' WHERE id=?`, [id]);
    return r.affectedRows > 0;
  },
  
};

module.exports = CommissionDAO;
