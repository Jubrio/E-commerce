const pool = require('../db/connection');

const PromotionDAO = {
  async findByProduit(produit_id) {
    const [rows] = await pool.query(
      'SELECT * FROM promotions WHERE produit_id=? ORDER BY date_debut DESC', [produit_id]);
    return rows;
  },

  async findActive() {
    const [rows] = await pool.query(
      `SELECT pr.*, p.nom AS produit_nom, p.prix
       FROM promotions pr JOIN produits p ON p.id=pr.produit_id
       WHERE pr.actif=TRUE AND NOW() BETWEEN pr.date_debut AND pr.date_fin
       ORDER BY pr.pourcentage DESC`);
    return rows;
  },

  async create({ produit_id, pourcentage, date_debut, date_fin }) {
    const [r] = await pool.query(
      `INSERT INTO promotions (produit_id, pourcentage, date_debut, date_fin, actif)
       VALUES (?,?,?,?,TRUE)`,
      [produit_id, pourcentage, date_debut, date_fin]);
    return r.insertId;
  },

  async update(id, { pourcentage, date_debut, date_fin, actif }) {
    const [r] = await pool.query(
      'UPDATE promotions SET pourcentage=?,date_debut=?,date_fin=?,actif=? WHERE id=?',
      [pourcentage, date_debut, date_fin, actif, id]);
    return r.affectedRows > 0;
  },

  async delete(id) {
    const [r] = await pool.query('DELETE FROM promotions WHERE id=?', [id]);
    return r.affectedRows > 0;
  },

  // Prix après promotion
  prixApresPromo(prix, pourcentage) {
    return parseFloat((prix * (1 - pourcentage / 100)).toFixed(2));
  },
};

module.exports = PromotionDAO;
