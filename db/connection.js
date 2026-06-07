const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'guyagod_marketplace',
  port:     parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

pool.getConnection()
  .then(conn => {
    console.log('✓ MySQL connecté');
    conn.release();
  })
  .catch(err => {
    console.error('✕ Erreur MySQL complète :', err.message);
  });

module.exports = pool;