const pool = require('../db/connection');

const CouponDAO = {
  async findByCode(code) {
    const [rows] = await pool.query(
      `SELECT * FROM coupons
       WHERE code=? AND actif=TRUE
         AND (expiration IS NULL OR expiration > NOW())
         AND (usage_max IS NULL OR usage_actuel < usage_max)
       LIMIT 1`, [code]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id=? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    return rows;
  },

  async create({ code, type_reduction, reduction, minimum_commande, usage_max, expiration }) {
    const [r] = await pool.query(
      `INSERT INTO coupons (code, type_reduction, reduction, minimum_commande, usage_max, expiration)
       VALUES (?,?,?,?,?,?)`,
      [code, type_reduction||'pourcentage', reduction, minimum_commande||0, usage_max||null, expiration||null]);
    return r.insertId;
  },

  async update(id, { type_reduction, reduction, minimum_commande, usage_max, expiration, actif }) {
    const [r] = await pool.query(
      `UPDATE coupons SET type_reduction=?,reduction=?,minimum_commande=?,
              usage_max=?,expiration=?,actif=? WHERE id=?`,
      [type_reduction, reduction, minimum_commande, usage_max, expiration, actif, id]);
    return r.affectedRows > 0;
  },

  async incrementUsage(id) {
    await pool.query('UPDATE coupons SET usage_actuel=usage_actuel+1 WHERE id=?', [id]);
  },

  async logUtilisation(coupon_id, user_id, commande_id) {
    await pool.query(
      'INSERT INTO coupon_utilisations (coupon_id, user_id, commande_id) VALUES (?,?,?)',
      [coupon_id, user_id, commande_id]);
  },

  async dejaUtilise(coupon_id, user_id) {
    const [rows] = await pool.query(
      'SELECT id FROM coupon_utilisations WHERE coupon_id=? AND user_id=? LIMIT 1',
      [coupon_id, user_id]);
    return rows.length > 0;
  },

  // Calcule le montant de réduction
  calculerReduction(coupon, total) {
    if (coupon.type_reduction === 'pourcentage') {
      return parseFloat((total * coupon.reduction / 100).toFixed(2));
    }
    return Math.min(coupon.reduction, total);
  },
};

module.exports = CouponDAO;
