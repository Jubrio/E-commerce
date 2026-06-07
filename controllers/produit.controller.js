const ProduitDAO = require('../dao/produit.dao');

const ProduitController = {

 async getAll(req, res) {
  try {
    const { page, limit, category_id, marque_id, etat, search, prix_min, prix_max, sort, order, public: isPublic } = req.query;
    let vendeur_id = req.query.vendeur_id;
    let includeInactif = false;

    if (req.user && req.user.role_id === 1) {
      includeInactif = true;
      vendeur_id = undefined;
    } 
    else if (req.user && req.user.role_id === 2 && isPublic !== 'true') {
      vendeur_id = req.user.id;
      includeInactif = false;
    } 
    else {
      includeInactif = false;
      vendeur_id = undefined;
    }

    const result = await ProduitDAO.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      category_id, marque_id, etat, search, prix_min, prix_max,
      sort: sort || 'created_at',
      order: order || 'DESC',
      vendeur_id,
      includeInactif,
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('produits getAll:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
},
  async getOne(req, res) {
    try {
      const produit = await ProduitDAO.findById(req.params.id);
      if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
      return res.json({ success: true, data: produit });
    } catch (err) {
      console.error('produit getOne:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async create(req, res) {
    try {
      const { nom, description, prix, stock, etat, category_id, marque_id, specifications } = req.body;
      if (!nom || !prix)
        return res.status(400).json({ success: false, message: 'Nom et prix requis' });

      const slug = nom.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
        + '-' + Date.now();

      const produit_id = await ProduitDAO.create({
        nom, slug, description,
        prix: parseFloat(prix),
        stock: parseInt(stock) || 0,
        sku: null,
        etat: etat || 'neuf',
        category_id: category_id || null,
        marque_id: marque_id || null,
        vendeur_id: req.user.id,
      });

      const sku = `SKU-${String(produit_id).padStart(6, '0')}`;
      await ProduitDAO.updateSku(produit_id, sku);

      if (Array.isArray(specifications)) {
        for (const s of specifications) {
          if (s.cle && s.valeur) await ProduitDAO.addSpec(produit_id, s.cle, s.valeur);
        }
      }

      return res.status(201).json({ success: true, data: { id: produit_id, sku } });
    } catch (err) {
      console.error('produit create:', err);
      return res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  },

  async update(req, res) {
  try {
    const { id } = req.params;
    const produitExistant = await ProduitDAO.findById(id);

    if (!produitExistant)
      return res.status(404).json({ success: false, message: 'Produit introuvable' });

    if (produitExistant.vendeur_id !== req.user.id && req.user.role_id !== 1) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    const {
      nom, description, prix, stock, sku, etat,
      category_id, marque_id, specifications,
    } = req.body;

    const actif = req.body.actif !== undefined ? req.body.actif : produitExistant.actif;

    const slug = (nom || produitExistant.nom).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      + '-' + id;

    await ProduitDAO.update(id, {
      nom: nom ?? produitExistant.nom,
      slug,
      description: description ?? produitExistant.description,
      prix: prix ? parseFloat(prix) : produitExistant.prix,
      stock: stock !== undefined ? parseInt(stock) : produitExistant.stock,
      sku: sku ?? produitExistant.sku,
      etat: etat ?? produitExistant.etat,
      category_id: category_id !== undefined ? category_id || null : produitExistant.category_id,
      marque_id: marque_id !== undefined ? marque_id || null : produitExistant.marque_id,
      actif,
    });

    if (Array.isArray(specifications)) {
      await ProduitDAO.deleteSpecs(id);
      for (const s of specifications) {
        if (s.cle && s.valeur) await ProduitDAO.addSpec(id, s.cle, s.valeur);
      }
    }

    return res.json({ success: true, message: 'Produit mis à jour' });
  } catch (err) {
    console.error('produit update:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
},

  async remove(req, res) {
  try {
    const produit = await ProduitDAO.findById(req.params.id);
    if (!produit)
      return res.status(404).json({ success: false, message: 'Produit introuvable' });

    if (produit.vendeur_id !== req.user.id && req.user.role_id !== 1) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    await ProduitDAO.deleteDefinitif(req.params.id);
    return res.json({ success: true, message: 'Produit supprimé définitivement' });
  } catch (err) {
    console.error('produit remove:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
},
  async reactiver(req, res) {
  try {
    const produit = await ProduitDAO.findById(req.params.id);
    
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });

    if (req.user.role_id !== 1) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    await ProduitDAO.reactiver(req.params.id);
    return res.json({ success: true, message: 'Produit réactivé' });
  } catch (err) {
    console.error('produit reactiver:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
},
};

module.exports = ProduitController;