const pool = require('../db/connection');

const StockDAO = {
  async findByProduit(produit_id, { page=1, limit=20 } = {}) {
    const offset = (page-1)*limit;
    const [rows] = await pool.query(
      `SELECT s.*, c.reference_commande
       FROM stock_mouvements s
       LEFT JOIN commandes c ON c.id=s.commande_id
       WHERE s.produit_id=? ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
      [produit_id, limit, offset]);
    return rows;
  },

  async entree(produit_id, quantite, raison='réapprovisionnement') {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('UPDATE produits SET stock=stock+? WHERE id=?', [quantite, produit_id]);
      await conn.query(
        `INSERT INTO stock_mouvements (produit_id, type_mouvement, quantite, raison)
         VALUES (?,'entree',?,?)`,
        [produit_id, quantite, raison]);
      await conn.commit();
    } catch (err) {
      await conn.rollback(); throw err;
    } finally { conn.release(); }
  },

  async ajustement(produit_id, nouveau_stock, raison='ajustement inventaire') {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [[p]] = await conn.query('SELECT stock FROM produits WHERE id=?', [produit_id]);
      const diff = nouveau_stock - p.stock;
      await conn.query('UPDATE produits SET stock=? WHERE id=?', [nouveau_stock, produit_id]);
      await conn.query(
        `INSERT INTO stock_mouvements (produit_id, type_mouvement, quantite, raison)
         VALUES (?,'ajustement',?,?)`,
        [produit_id, Math.abs(diff), raison]);
      await conn.commit();
    } catch (err) {
      await conn.rollback(); throw err;
    } finally { conn.release(); }
  },

  async alerteStock(seuil=5) {
    const [rows] = await pool.query(
      `SELECT p.id, p.nom, p.stock, u.nom AS vendeur_nom, u.email AS vendeur_email
       FROM produits p JOIN users u ON u.id=p.vendeur_id
       WHERE p.stock<=? AND p.actif=TRUE ORDER BY p.stock ASC`,
      [seuil]);
    return rows;
  },
};

module.exports = StockDAO;
