#  Bazar Guyane — Backend API

API REST du projet Bazar Guyane, la marketplace de la Guyane.

 **API en ligne** : [e-commerce-production-342e.up.railway.app](https://e-commerce-production-342e.up.railway.app/api/health)

---

## Stack technique

- **Runtime** : Node.js + Express
- **Base de données** : MySQL (Railway)
- **Auth** : JWT + Google OAuth (Passport.js)
- **Email** : Mailjet API
- **Paiement** : Stripe Checkout
- **Images** : Cloudinary
- **Déploiement** : Railway

---

## Fonctionnalités

- Authentification JWT + vérification email OTP
- Google OAuth2
- Gestion produits, catégories, marques
- Panier et commandes
- Paiement Stripe avec webhooks
- Livraisons et suivi
- Commissions vendeurs
- Notifications et messagerie
- Coupons de réduction
- Upload images Cloudinary
- Logs de connexion

---

## Installation locale

```bash
git clone https://github.com/Jubrio/E-commerce.git
cd E-commerce
npm install
```

Crée un fichier `.env` :

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=guyagod_marketplace
JWT_SECRET=ton_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_USER=ta_api_key_mailjet
EMAIL_PASS=ta_secret_key_mailjet
EMAIL_FROM=support.bazarguyane@gmail.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
COMMISSION_TAUX=5
```

Lance le serveur :

```bash
node server.js
```

API disponible sur [http://localhost:4000](http://localhost:4000)

---

## Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/verify-email` | Vérification OTP |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/produits` | Liste produits |
| POST | `/api/commandes` | Créer commande |
| POST | `/api/paiements/stripe/checkout` | Paiement Stripe |
| GET | `/api/health` | Statut API |

---

## Structure du projet

```
controllers/     # Logique métier
dao/             # Accès base de données
middleware/      # Auth, validation
routes/          # Définition des routes
db/              # Connexion MySQL
utils/           # Helpers
```

---

## Auteur

**Jubrio RAZAKANIRINA** — Étudiant ENI Fianarantsoa, Madagascar  
Contact : [jubriorazaka09@gmail.com](mailto:jubriorazaka09@gmail.com)