const express = require('express');
const router  = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nom, email, message } = req.body;
    if (!nom || !email || !message) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

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
            Name:  'Bazar Guyane Contact',
          },
          To: [{
            Email: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            Name:  'Bazar Guyane',
          }],
          ReplyTo: {
            Email: email,
            Name:  nom,
          },
          Subject: `[Contact Bazar Guyane] Message de ${nom}`,
          HTMLPart: `
            <div style="font-family:Arial;max-width:500px;">
              <h2 style="color:#f97316;">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${nom}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Message :</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          `,
        }],
      }),
    });

    const data = await response.json();
    console.log(' Contact Mailjet status:', response.status);
    console.log(' Contact Mailjet response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(`Mailjet error: ${JSON.stringify(data)}`);
    }

    res.json({ success: true, message: 'Votre message a été envoyé' });
  } catch (err) {
    console.error('Erreur envoi contact:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;