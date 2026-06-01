const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { nom, email, message } = req.body;
    if (!nom || !email || !message) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${nom}" <${email}>`,
      to: process.env.EMAIL_USER, // Envoi à l'adresse du site
      subject: `[Contact Bazar Guyane] Message de ${nom}`,
      html: `
        <div style="font-family: Arial; max-width: 500px;">
          <h2 style="color: #f97316;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Message :</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Votre message a été envoyé' });
  } catch (err) {
    console.error('Erreur envoi contact:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;