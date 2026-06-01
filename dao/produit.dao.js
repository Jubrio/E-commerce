// backend/dao/produit.dao.js — VERSION CORRIGÉE (avec inclusion des sous‑catégories)
const pool = require('../db/connection');

const SORT_ALLOWED = {
  created_at: 'p.created_at',
  prix:       'p.prix',
  note:       'note_moyenne',
};

const ProduitDAO = {

  // ── Récupère tous les IDs d’une catégorie et de ses descendants ──
  async _getAllCategoryIds(id) {
    const ids = [parseInt(id)];
    let current = [parseInt(id)];
    while (current.length) {
      const [rows] = await pool.query('SELECT id FROM categories WHERE parent_id IN (?)', [current]);
      current = rows.map(r => r.id);
      ids.push(...current);
    }
    return ids;
  },

  async findAll({
    page = 1, limit = 20,
    category_id, marque_id, vendeur_id, etat, search, prix_min, prix_max,
    sort = 'created_at', order = 'DESC',
    includeInactif = false,
  } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    const conditions = [];

    if (!includeInactif) conditions.push('p.actif = TRUE');

    // ── Gestion des catégories avec héritage ──
    if (category_id) {
      const allIds = await this._getAllCategoryIds(category_id);
      conditions.push(`p.category_id IN (${allIds.map(() => '?').join(', ')})`);
      params.push(...allIds);
    }

    if (marque_id)   conditions.push('p.marque_id = ?');
    if (vendeur_id)  conditions.push('p.vendeur_id = ?');
    if (etat)        conditions.push('p.etat = ?');
    if (prix_min)    conditions.push('p.prix >= ?');
    if (prix_max)    conditions.push('p.prix <= ?');
    if (search)      conditions.push('p.nom LIKE ?');

    // Ajout des paramètres (sauf pour category_id déjà géré)
    if (marque_id)   params.push(marque_id);
    if (vendeur_id)  params.push(vendeur_id);
    if (etat)        params.push(etat);
    if (prix_min)    params.push(prix_min);
    if (prix_max)    params.push(prix_max);
    if (search)      params.push(`%${search}%`);

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortCol  = SORT_ALLOWED[sort] || 'p.created_at';
    const sortDir  = order === 'ASC' ? 'ASC' : 'DESC';
    const orderBy  = `ORDER BY ${sortCol} ${sortDir}`;

    const [rows] = await pool.query(
      `SELECT p.id, p.nom, p.sku, p.slug, p.prix, p.stock, p.etat, p.actif, p.created_at,
              c.nom AS categorie, m.nom AS marque, u.nom AS vendeur_nom,
              (SELECT image FROM produit_images
               WHERE produit_id = p.id AND est_principale = TRUE LIMIT 1) AS image_principale,
              (SELECT ROUND(AVG(note), 1) FROM avis
               WHERE produit_id = p.id) AS note_moyenne,
              (SELECT pourcentage FROM promotions
               WHERE produit_id = p.id AND actif = TRUE
                 AND NOW() BETWEEN date_debut AND date_fin LIMIT 1) AS promo
       FROM produits p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN marques    m ON m.id = p.marque_id
       LEFT JOIN users      u ON u.id = p.vendeur_id
       ${where}
       ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const countQuery = `SELECT COUNT(*) AS total FROM produits p ${where}`;
    const [[{ total }]] = await pool.query(countQuery, params);
    console.log('findAll - includeInactif:', includeInactif, 'vendeur_id:', vendeur_id);

    return { rows, total: parseInt(total), page, limit };
  },

  async findById(id) {
    const [[produit]] = await pool.query(
      `SELECT p.*,
              c.nom AS categorie, c.slug AS categorie_slug,
              m.nom AS marque,
              u.nom AS vendeur_nom, u.id AS vendeur_id,
              (SELECT ROUND(AVG(note), 1) FROM avis WHERE produit_id = p.id) AS note_moyenne,
              (SELECT COUNT(*) FROM avis WHERE produit_id = p.id) AS nb_avis
       FROM produits p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN marques    m ON m.id = p.marque_id
       LEFT JOIN users      u ON u.id = p.vendeur_id
       WHERE p.id = ? LIMIT 1`,
      [id]
    );
    if (!produit) return null;

    const [images] = await pool.query(
      'SELECT id, image, est_principale, ordre FROM produit_images WHERE produit_id = ? ORDER BY ordre ASC',
      [id]
    );
    const [specs] = await pool.query(
      'SELECT cle, valeur FROM produit_specifications WHERE produit_id = ? ORDER BY id ASC',
      [id]
    );
    const [[promo]] = await pool.query(
      `SELECT pourcentage FROM promotions
       WHERE produit_id = ? AND actif = TRUE AND NOW() BETWEEN date_debut AND date_fin LIMIT 1`,
      [id]
    );

    return { ...produit, images, specifications: specs, promotion: promo || null };
  },

  async create({ nom, slug, description, prix, stock, sku, etat, category_id, marque_id, vendeur_id }) {
    const [r] = await pool.query(
      `INSERT INTO produits (nom, slug, description, prix, stock, sku, etat, category_id, marque_id, vendeur_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, slug, description, prix, stock || 0, sku, etat || 'neuf', category_id, marque_id, vendeur_id]
    );
    return r.insertId;
  },
  // À la fin du DAO, ajouter :
  async updateSku(id, sku) {
  const [r] = await pool.query('UPDATE produits SET sku = ? WHERE id = ?', [sku, id]);
  return r.affectedRows > 0;
  },
  async update(id, { nom, slug, description, prix, stock, sku, etat, category_id, marque_id, actif }) {
    const [r] = await pool.query(
      `UPDATE produits
       SET nom=?, slug=?, description=?, prix=?, stock=?, sku=?, etat=?,
           category_id=?, marque_id=?, actif=?, updated_at=NOW()
       WHERE id=?`,
      [nom, slug, description, prix, stock, sku, etat, category_id, marque_id,
       actif !== undefined ? actif : true, id]
    );
    return r.affectedRows > 0;
  },

  async desactiver(id) {
    const [r] = await pool.query('UPDATE produits SET actif = FALSE WHERE id = ?', [id]);
    return r.affectedRows > 0;
  },

  async addImage(produit_id, image, est_principale = false, ordre = 0) {
    if (est_principale) {
      await pool.query('UPDATE produit_images SET est_principale = FALSE WHERE produit_id = ?', [produit_id]);
    }
    const [r] = await pool.query(
      'INSERT INTO produit_images (produit_id, image, est_principale, ordre) VALUES (?, ?, ?, ?)',
      [produit_id, image, est_principale, ordre]
    );
    return r.insertId;
  },

  async deleteImages(produit_id) {
    await pool.query('DELETE FROM produit_images WHERE produit_id = ?', [produit_id]);
  },

  async addSpec(produit_id, cle, valeur) {
    const [r] = await pool.query(
      'INSERT INTO produit_specifications (produit_id, cle, valeur) VALUES (?, ?, ?)',
      [produit_id, cle, valeur]
    );
    return r.insertId;
  },

  async deleteSpecs(produit_id) {
    await pool.query('DELETE FROM produit_specifications WHERE produit_id = ?', [produit_id]);
  },
  async reactiver(id) {
  const [r] = await pool.query('UPDATE produits SET actif = TRUE WHERE id = ?', [id]);
  return r.affectedRows > 0;
},
async deleteDefinitif(id) {
  // Supprimer les dépendances (ordre important)
  await pool.query('DELETE FROM produit_images WHERE produit_id = ?', [id]);
  await pool.query('DELETE FROM produit_specifications WHERE produit_id = ?', [id]);
  await pool.query('DELETE FROM avis WHERE produit_id = ?', [id]);
  await pool.query('DELETE FROM promotions WHERE produit_id = ?', [id]);
  // Supprimer le produit lui-même
  const [r] = await pool.query('DELETE FROM produits WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
};

module.exports = ProduitDAO;
