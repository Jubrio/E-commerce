const bcrypt           = require('bcryptjs');
const jwt              = require('jsonwebtoken');
const UserDAO          = require('../dao/user.dao');
const NotificationDAO  = require('../dao/notification.dao');
const TempCodesDAO     = require('../dao/tempCodes.dao');
const { logConnexion } = require('../middleware/auth.middleware');

async function sendEmail({ to, toName, subject, html }) {

  console.log(' Envoi email via Mailjet API à:', to);
  console.log(' EMAIL_USER:', process.env.EMAIL_USER ? 'défini' : 'MANQUANT');
  console.log(' EMAIL_PASS:', process.env.EMAIL_PASS ? 'défini' : 'MANQUANT');
  console.log(' EMAIL_FROM:', process.env.EMAIL_FROM || 'MANQUANT');

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(
        `${process.env.EMAIL_USER}:${process.env.EMAIL_PASS}`
      ).toString('base64'),
    },
    body: JSON.stringify({
      Messages: [{
        From: {
          Email: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          Name:  'Bazar Guyane',
        },
        To: [{ Email: to, Name: toName || to }],
        Subject: subject,
        HTMLPart: html,
      }],
    }),
  });

  const data = await response.json();
  console.log(' EMAIL Mailjet status:', response.status);
  console.log(' EMAIL Mailjet response:', JSON.stringify(data));
  if (!response.ok) {
    throw new Error(`Mailjet error: ${JSON.stringify(data)}`);
  }
  return data;
}

async function sendVerificationEmail({ to, nom, code }) {

  await sendEmail({
    to,
    toName: nom,
    subject: 'Bienvenue sur Bazar Guyane — Vérifiez votre email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#f97316;margin-bottom:16px;">Bazar Guyane — Vérification de votre compte</h2>
        <p>Bonjour <strong>${nom}</strong>,</p>
        <p>Merci de vous être inscrit sur Bazar Guyane, la marketplace de la Guyane.</p>
        <p>Pour activer votre compte, veuillez saisir le code ci-dessous :</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;background-color:#f3f4f6;padding:16px;text-align:center;border-radius:12px;margin:24px 0;">
          ${code}
        </div>
        <p>Ce code expire dans <strong>15 minutes</strong>.</p>
        <p style="color:#666;font-size:14px;">Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
        <hr style="border-color:#e5e7eb;margin:20px 0;">
        <p style="color:#666;font-size:12px;">Administration — L'équipe Bazar Guyane</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail({ to, nom, code }) {
  await sendEmail({
    to,
    toName: nom,
    subject: 'Réinitialisation de votre mot de passe — Bazar Guyane',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#f97316;margin-bottom:16px;">Bazar Guyane — Réinitialisation du mot de passe</h2>
        <p>Bonjour <strong>${nom}</strong>,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Voici votre code de vérification :</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;background-color:#f3f4f6;padding:16px;text-align:center;border-radius:12px;margin:24px 0;">
          ${code}
        </div>
        <p>Ce code expire dans <strong>5 minutes</strong>.</p>
        <p style="color:#666;font-size:14px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        <hr style="border-color:#e5e7eb;margin:20px 0;">
        <p style="color:#666;font-size:12px;">Administration — L'équipe Bazar Guyane</p>
      </div>
    `,
  });
}

const AuthController = {

  async register(req, res) {
    try {
      const { nom, prenom, email, telephone, mot_de_passe } = req.body;
      if (!nom || !email || !mot_de_passe)
        return res.status(400).json({ success: false, message: 'Nom, email et mot de passe requis' });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        return res.status(400).json({ success: false, message: 'Format email invalide' });

      if (await UserDAO.findByEmail(email))
        return res.status(409).json({ success: false, message: 'Cet email est déjà utilisé' });

      if (mot_de_passe.length < 8)
        return res.status(400).json({ success: false, message: 'Mot de passe minimum 8 caractères' });

      const hash      = await bcrypt.hash(mot_de_passe, 12);
      const code      = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await TempCodesDAO.saveEmailVerification({
        code, email, nom, prenom, telephone,
        mot_de_passe_hash: hash,
        expiresAt,
      });

      await sendVerificationEmail({ to: email, nom, code });

      return res.status(200).json({ success: true, message: 'Code de vérification envoyé.' });
    } catch (err) {
      console.error('register:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ success: false, message: 'Code requis' });

      const record = await TempCodesDAO.getEmailVerification(code);
      if (!record)
        return res.status(400).json({ success: false, message: 'Code invalide ou expiré' });

      const id = await UserDAO.create({
        nom:          record.nom,
        prenom:       record.prenom,
        email:        record.email,
        telephone:    record.telephone,
        mot_de_passe: record.mot_de_passe_hash,
        role_id:      3,
      });

      await NotificationDAO.create({
        user_id: id,
        type:    'bienvenue',
        message: `Bienvenue sur Bazar Guyane, ${record.nom} ! Votre compte est activé.`,
        lien:    '/profil',
      });

      await TempCodesDAO.deleteEmailVerification(code);

      return res.status(201).json({
        success: true,
        message: 'Compte créé avec succès',
        data: { id, email: record.email, nom: record.nom },
      });
    } catch (err) {
      console.error('verifyEmail:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async login(req, res) {
    try {
      const { email, mot_de_passe } = req.body;
      if (!email || !mot_de_passe)
        return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

      const user = await UserDAO.findByEmail(email);
      const ok   = user && await bcrypt.compare(mot_de_passe, user.mot_de_passe);

      await logConnexion(user?.id || null, req, !!ok);

      if (!ok)
        return res.status(401).json({ success: false, message: 'Identifiants incorrects' });

      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id:           user.id,
            nom:          user.nom,
            prenom:       user.prenom,
            email:        user.email,
            role_id:      user.role_id,
            photo_profil: user.photo_profil,
          },
        },
      });
    } catch (err) {
      console.error('login:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async me(req, res) {
    try {
      const user = await UserDAO.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'Introuvable' });
      return res.json({ success: true, data: user });
    } catch {
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async motDePasseOublie(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: 'Email requis' });

      const user = await UserDAO.findByEmail(email);
      if (!user)
        return res.json({ success: true, message: 'Si cet email existe, vous allez recevoir un code.' });

      const code      = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await TempCodesDAO.savePasswordReset({ code, userId: user.id, expiresAt });
      await sendPasswordResetEmail({ to: email, nom: user.nom, code });

      return res.json({ success: true, message: 'Code de réinitialisation envoyé.' });
    } catch (err) {
      console.error('motDePasseOublie:', err);
      return res.status(500).json({ success: false, message: "Erreur lors de l'envoi" });
    }
  },

  async resetPasswordWithCode(req, res) {
    try {
      const { code, nouveau_mot_de_passe } = req.body;
      if (!code || !nouveau_mot_de_passe)
        return res.status(400).json({ success: false, message: 'Code et mot de passe requis' });

      if (nouveau_mot_de_passe.length < 8)
        return res.status(400).json({ success: false, message: 'Minimum 8 caractères' });

      const record = await TempCodesDAO.getPasswordReset(code);
      if (!record)
        return res.status(400).json({ success: false, message: 'Code invalide ou expiré' });

      const hash = await bcrypt.hash(nouveau_mot_de_passe, 12);
      await UserDAO.updatePassword(record.user_id, hash);
      await TempCodesDAO.deletePasswordReset(code);

      return res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    } catch (err) {
      console.error('resetPasswordWithCode:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },
};

module.exports = AuthController;