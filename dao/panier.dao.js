const pool = require('../db/connection');

const PanierDAO = {
  async getOrCreate(user_id) {
    let [[panier]] = await pool.query('SELECT * FROM panier WHERE user_id=? LIMIT 1', [user_id]);
    if (!panier) {
      const [r] = await pool.query('INSERT INTO panier (user_id) VALUES (?)', [user_id]);
      panier = { id: r.insertId, user_id };
    }
    return panier;
  },

  async getItems(user_id) {
  const [rows] = await pool.query(
    `SELECT pi.id, pi.produit_id, pi.quantite, pi.prix,
            p.nom, p.stock, p.actif, p.vendeur_id,
            (SELECT image FROM produit_images WHERE produit_id = p.id AND est_principale = TRUE LIMIT 1) AS image,
            u.nom AS vendeur_nom,
            (SELECT pourcentage FROM promotions WHERE produit_id = p.id AND actif = TRUE AND NOW() BETWEEN date_debut AND date_fin LIMIT 1) AS promo
     FROM panier pa
     JOIN panier_items pi ON pi.panier_id = pa.id
     JOIN produits p ON p.id = pi.produit_id
     LEFT JOIN users u ON u.id = p.vendeur_id
     WHERE pa.user_id = ? ORDER BY pi.added_at DESC`,
    [user_id]
  );
  return rows;
},

  async addItem(user_id, produit_id, quantite, prix) {
    const panier = await this.getOrCreate(user_id);
    if (!panier || !panier.id) throw new Error('Impossible de récupérer le panier');

    const prixNum = parseFloat(prix);
    if (isNaN(prixNum)) throw new Error('Prix invalide');

    await pool.query(
      `INSERT INTO panier_items (panier_id, produit_id, quantite, prix)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite)`,
      [panier.id, produit_id, quantite, prixNum]
    );

    return this.getItems(user_id);
  },

  async updateQuantite(user_id, produit_id, quantite) {
    if (quantite <= 0) return this.removeItem(user_id, produit_id);
    const [[panier]] = await pool.query('SELECT id FROM panier WHERE user_id=?', [user_id]);
    if (!panier) return [];
    await pool.query(
      'UPDATE panier_items SET quantite=? WHERE panier_id=? AND produit_id=?',
      [quantite, panier.id, produit_id]
    );
    return this.getItems(user_id);
  },

  async removeItem(user_id, produit_id) {
    const [[panier]] = await pool.query('SELECT id FROM panier WHERE user_id=?', [user_id]);
    if (!panier) return [];
    await pool.query('DELETE FROM panier_items WHERE panier_id=? AND produit_id=?', [panier.id, produit_id]);
    return this.getItems(user_id);
  },

  async clear(user_id) {
    const [[panier]] = await pool.query('SELECT id FROM panier WHERE user_id=?', [user_id]);
    if (panier) await pool.query('DELETE FROM panier_items WHERE panier_id=?', [panier.id]);
  },
};

module.exports = PanierDAO;