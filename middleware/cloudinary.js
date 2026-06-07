const cloudinary        = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer            = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage pour images produits ────────────────────────────
const produitStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'guyagod/produits',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// ── Storage pour photos de profil ───────────────────────────
const profilStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'guyagod/profils',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', quality: 'auto' }],
  },
});

const uploadProduit = multer({
  storage: produitStorage,
  limits:  { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont acceptées'), false);
  },
});

const uploadProfil = multer({
  storage: profilStorage,
  limits:  { fileSize: 2 * 1024 * 1024 },
});

const deleteImage = async (imageUrl) => {
  try {
    const parts    = imageUrl.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder   = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${filename}`);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = { uploadProduit, uploadProfil, deleteImage, cloudinary };
