const pool = require('../db/connection');

const TempCodesDAO = {
  // ---- Email verification ----
  async saveEmailVerification({ code, email, nom, prenom, telephone, mot_de_passe_hash, expiresAt }) {
    const [result] = await pool.query(
      `INSERT INTO email_verifications (code, email, nom, prenom, telephone, mot_de_passe_hash, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, email, nom, prenom, telephone, mot_de_passe_hash, expiresAt]
    );
    return result.insertId;
  },

  async getEmailVerification(code) {
    const [rows] = await pool.query(
      'SELECT * FROM email_verifications WHERE code = ? AND expires_at > NOW()',
      [code]
    );
    return rows[0];
  },

  async deleteEmailVerification(code) {
    await pool.query('DELETE FROM email_verifications WHERE code = ?', [code]);
  },

  async deleteExpiredEmailVerifications() {
    await pool.query('DELETE FROM email_verifications WHERE expires_at <= NOW()');
  },

  // ---- Password reset ----
  async savePasswordReset({ code, userId, expiresAt }) {
    const [result] = await pool.query(
      'INSERT INTO password_resets (code, user_id, expires_at) VALUES (?, ?, ?)',
      [code, userId, expiresAt]
    );
    return result.insertId;
  },

  async getPasswordReset(code) {
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE code = ? AND expires_at > NOW()',
      [code]
    );
    return rows[0];
  },

  async deletePasswordReset(code) {
    await pool.query('DELETE FROM password_resets WHERE code = ?', [code]);
  },

  async deleteExpiredPasswordResets() {
    await pool.query('DELETE FROM password_resets WHERE expires_at <= NOW()');
  }
};

module.exports = TempCodesDAO;