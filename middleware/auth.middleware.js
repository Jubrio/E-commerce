const jwt  = require('jsonwebtoken');
const pool = require('../db/connection');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token manquant' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {

    }
  }
  next();
};

const isAdmin   = (req, res, next) => req.user?.role_id === 1 ? next()
  : res.status(403).json({ success: false, message: 'Réservé aux administrateurs' });

const isVendeur = (req, res, next) => (req.user?.role_id === 2 || req.user?.role_id === 1) ? next()
  : res.status(403).json({ success: false, message: 'Réservé aux vendeurs' });

const logConnexion = async (user_id, req, succes = true) => {
  try {
    const ip      = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const appareil = req.headers['user-agent'] || '';
    await pool.query(
      'INSERT INTO logs_connexions (user_id, adresse_ip, appareil, succes) VALUES (?,?,?,?)',
      [user_id, ip, appareil, succes]
    );
  } catch (_) {}
};

module.exports = { verifyToken, optionalVerifyToken, isAdmin, isVendeur, logConnexion };