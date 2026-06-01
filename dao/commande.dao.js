const pool = require('../db/connection');

const CommandeDAO = {
  async create({ user_id, total, total_avant_coupon, coupon_id, adresse_livraison, telephone, mode_paiement, notes_client, items }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const ref = `GUY-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*90000)+10000}`;

      const [result] = await conn.query(
        `INSERT INTO commandes (reference_commande, user_id, total, total_avant_coupon, coupon_id,
                adresse_livraison, telephone, mode_paiement, notes_client)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [ref, user_id, total, total_avant_coupon||total, coupon_id||null,
         adresse_livraison, telephone, mode_paiement, notes_client||null]);
      const commande_id = result.insertId;

      for (const item of items) {
        await conn.query(
          `INSERT INTO commande_items (commande_id, produit_id, nom_produit, quantite, prix_unitaire, sous_total)
           VALUES (?,?,?,?,?,?)`,
          [commande_id, item.produit_id, item.nom, item.quantite, item.prix, item.quantite * item.prix]);

        const [stockResult] = await conn.query(
          'UPDATE produits SET stock=stock-? WHERE id=? AND stock>=?',
          [item.quantite, item.produit_id, item.quantite]);
        if (stockResult.affectedRows === 0) throw new Error(`Stock insuffisant : ${item.nom}`);

        await conn.query(
          `INSERT INTO stock_mouvements (produit_id, type_mouvement, quantite, raison, commande_id)
           VALUES (?,'sortie',?,'vente',?)`,
          [item.produit_id, item.quantite, commande_id]);
      }

      // Fiche livraison
      await conn.query('INSERT INTO livraisons (commande_id, statut) VALUES (?,"preparation")', [commande_id]);

      // Commission vendeur (taux configurable)
      const taux = parseFloat(process.env.COMMISSION_TAUX || 5);
      for (const item of items) {
        const montant_vente = item.prix * item.quantite;
        const montant_commission = parseFloat((montant_vente * taux / 100).toFixed(2));
        await conn.query(
          `INSERT INTO commissions (vendeur_id, commande_id, montant_vente, taux, montant_commission)
           VALUES (?,?,?,?,?)`,
          [item.vendeur_id, commande_id, montant_vente, taux, montant_commission]);
      }

      await conn.commit();
      return { commande_id, reference: ref };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async findByUser(user_id, { page=1, limit=10 } = {}) {
    const offset = (page-1)*limit;
    const [rows] = await pool.query(
      `SELECT c.id, c.reference_commande, c.total, c.statut, c.mode_paiement, c.created_at,
              l.statut AS statut_livraison, l.numero_suivi
       FROM commandes c LEFT JOIN livraisons l ON l.commande_id=c.id
       WHERE c.user_id=? ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
      [user_id, limit, offset]);
    return rows;
  },

  async findById(id) {
    const [[commande]] = await pool.query(
      `SELECT c.*, l.statut AS statut_livraison, l.transporteur, l.numero_suivi,
              l.date_expedition, l.date_livraison_estimee, l.date_livraison_reelle
       FROM commandes c LEFT JOIN livraisons l ON l.commande_id=c.id
       WHERE c.id=? LIMIT 1`, [id]);
    if (!commande) return null;

    const [items] = await pool.query(
      `SELECT ci.*, p.slug,
              (SELECT image FROM produit_images WHERE produit_id=ci.produit_id AND est_principale=TRUE LIMIT 1) AS image
       FROM commande_items ci LEFT JOIN produits p ON p.id=ci.produit_id
       WHERE ci.commande_id=?`, [id]);

    return { ...commande, items };
  },

  async findAll({ page=1, limit=20, statut } = {}) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const offset = (pageNum - 1) * limitNum;
  let where = '';
  const params = [];
  if (statut) {
    where = 'WHERE c.statut = ?';
    params.push(statut);
  }
  const [rows] = await pool.query(
    `SELECT c.id, c.reference_commande, c.total, c.statut, c.created_at,
            u.nom AS client_nom, u.email AS client_email
     FROM commandes c
     JOIN users u ON u.id = c.user_id
     ${where}
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );
  return rows;
},

  async updateStatut(id, statut) {
    const [r] = await pool.query('UPDATE commandes SET statut=? WHERE id=?', [statut, id]);
    return r.affectedRows > 0;
  },
};

module.exports = CommandeDAO;
