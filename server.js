// backend/server.js — MIS À JOUR avec Google OAuth
// AJOUTER au .env :
//   GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
//   GOOGLE_CLIENT_SECRET=votre_secret
//   BACKEND_URL=http://localhost:4000
// INSTALLER : npm install passport passport-google-oauth20

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const passport = require('passport');

const app = express();

// ── Sécurité & parsing ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use('/api/paiements/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/auth',          require('./routes/google.routes')); // Google OAuth
app.use('/api/users',         require('./routes/user.routes'));
app.use('/api/adresses',      require('./routes/adresse.routes'));
app.use('/api/categories',    require('./routes/categorie.routes'));
app.use('/api/marques',       require('./routes/marque.routes'));
app.use('/api/produits',      require('./routes/produit.routes'));
app.use('/api/panier',        require('./routes/panier.routes'));
app.use('/api/commandes',     require('./routes/commande.routes'));
app.use('/api/paiements',     require('./routes/paiement.routes'));
app.use('/api/livraisons',    require('./routes/livraison.routes'));
app.use('/api/promotions',    require('./routes/promotion.routes'));
app.use('/api/coupons',       require('./routes/coupon.routes'));
app.use('/api/avis',          require('./routes/avis.routes'));
app.use('/api/favoris',       require('./routes/favori.routes'));
app.use('/api/messages',      require('./routes/message.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/stock',         require('./routes/stock.routes'));
app.use('/api/commissions',   require('./routes/commission.routes'));
app.use('/api/upload',        require('./routes/upload.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

const TempCodesDAO = require('./dao/tempCodes.dao');
setInterval(async () => {
  try {
    await TempCodesDAO.deleteExpiredEmailVerifications();
    await TempCodesDAO.deleteExpiredPasswordResets();
    console.log('✅ Nettoyage des codes OTP expirés effectué');
  } catch (err) {
    console.error('Erreur nettoyage OTP:', err);
  }
}, 60 * 60 * 1000);

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '3.0.0', timestamp: new Date().toISOString() });
});

// ── 404 ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} introuvable` });
});

// ── Erreurs globales ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur interne' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Bazar Guyane API v3 — http://localhost:${PORT}`));
