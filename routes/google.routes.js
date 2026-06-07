const express      = require('express');
const passport     = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt          = require('jsonwebtoken');
const pool         = require('../db/connection');
const router       = express.Router();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('Email Google non disponible'));

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
    );

    let user = rows[0];
    if (!user) {
      const nom    = profile.displayName?.split(' ')[0] || 'Utilisateur';
      const prenom = profile.displayName?.split(' ').slice(1).join(' ') || '';
      const photo  = profile.photos?.[0]?.value || null;

      const [result] = await pool.query(
        `INSERT INTO users (nom, prenom, email, mot_de_passe, photo_profil, role_id)
         VALUES (?, ?, ?, ?, ?, 3)`,
        [nom, prenom, email, 'GOOGLE_AUTH', photo]
      );

      const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
      await pool.query(
        'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
        [user.id, 'bienvenue', `Bienvenue sur Bazar Guyane, ${nom} !`]
      );
    } else {
      if (profile.photos?.[0]?.value && !user.photo_profil) {
        await pool.query(
          'UPDATE users SET photo_profil = ? WHERE id = ?',
          [profile.photos[0].value, user.id]
        );
        user.photo_profil = profile.photos[0].value;
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google` }),
  (req, res) => {
    const user  = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}&nom=${encodeURIComponent(user.nom)}&role_id=${user.role_id}`
    );
  }
);

module.exports = router;
