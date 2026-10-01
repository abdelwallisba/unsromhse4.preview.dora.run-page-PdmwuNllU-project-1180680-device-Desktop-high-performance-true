# LocalBox — site web

Plateforme e-commerce hybride pour la modernisation du commerce béninois :
**Magasin** (B2C), **TokpaExpress** (B2B en gros) et **Marketplace** (B2B2C sans commission),
réalisée d'après le *Dossier intégral du projet LocalBox* et les maquettes `Maquettes_LocalBox_Complet_Televersees.pdf`.

> « LocalBox. Le Marché dans votre main, le cœur dans votre poche. »

## Lancer le site

Site statique (HTML, CSS, JavaScript sans dépendance de build). Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Mise en ligne possible telle quelle sur GitHub Pages, Netlify, Vercel ou tout hébergement statique.

## Pages

| Page | Fichier | Contenu (référence au dossier) |
|---|---|---|
| Accueil | `index.html` | Bannière des maquettes, atouts, offres du moment, 3 services, rayons, produits populaires, parcours en 5 étapes, boutiques, paniers prêts, témoignages « LocalBox c'est moi », paiement, LocalPoints, blog |
| Magasin | `magasin.html`, `produit.html` | Catalogue B2C par rayons, filtres, paniers prêts, fiche produit (origine, fournisseuse) |
| Panier & commande | `panier.html` | Facture détaillée, lieu Maison/Travail/Autre + géolocalisation, créneaux, express, modes de remise Marketplace, Mobile Money (MTN, Moov, Celtiis), paiement à la livraison, carte, LocalPoints, code parrainage |
| Suivi de commande | `commande.html` | Étapes, QR code de réception, facture imprimable, reprogrammation, message au livreur, annulation, avis, « Déclarer un problème » |
| TokpaExpress | `tokpaexpress.html` | Abonnements 5 000 FCFA (2 livraisons) / 7 000 FCFA (3 livraisons), inscription en ligne ou par SMS, carte TokpaPro, **espace pro** : catalogue de gros, fiches enrichies (bénéfice, marge), comparateur, quota de livraisons, livraison automatique, historique avec code PIN, suivi de stock et alertes |
| Marketplace | `marketplace.html`, `boutique.html` | Boutiques par catégorie (restaurants, épiceries, artisanat, cosmétique, beauté), ville, ouvert maintenant ; mini-boutique avec statut 🟢/🔴, délai de préparation, badges, avis et notations, WhatsApp |
| Vendre sur LocalBox | `vendre.html` | Service fournisseur, tarifs 20 000 + options 10 000/10 000 FCFA, simulateur 0 % commission, process avec/sans logistique, « Mon commerce, ma fierté », inscription vendeur, formulaire fournisseuses du marché |
| Tableau de bord vendeur | `tableau-de-bord.html` | Vue d'ensemble, commandes, produits & stock, statistiques avancées, alertes, réglages boutique, abonnement & parrainage (mode démonstration si aucune boutique créée) |
| Espace client | `compte.html` | Connexion par code SMS, commandes, adresses, LocalPoints & récompenses, parrainage, réclamations, profil |
| Livraison & logistique | `livraison.html` | Zones et tarifs, mini-hubs, QR code, charte livreurs, incidents, suivi de commande |
| Fidélité | `fidelite.html` | LocalPoints, catalogue de récompenses, Hall of Fame, trophées, Club des 1000 Premiers |
| À propos | `a-propos.html` | Maquette « À propos » (arche), contexte Dantokpa, feuille de route 3 phases, organisation, vision 10 ans |
| Blog | `blog.html`, `article.html` | #CarnetDuMarché, portraits, conseils, nouveautés |
| À venir | `a-venir.html` | AgroBox, Marketplace Services, mini-hubs supermarchés, Academy, wallet |
| Aide & légal | `faq.html`, `contact.html`, `retours.html`, `cgu.html`, `confidentialite.html`, `mentions-legales.html`, `404.html` | |
| Recherche | `recherche.html` | Produits, boutiques et articles des boutiques |

## Structure

```
assets/
  css/style.css          charte graphique (palette relevée sur les maquettes)
  img/                   illustrations extraites des maquettes + favicon
  js/config.js           ⚙️ tarifs, contacts, zones de livraison, LocalPoints — à personnaliser
  js/data.js             catalogue de démonstration (produits, gros, boutiques, blog, FAQ)
  js/app.js              en-tête/pied de page, panier, compte, commandes, FR/EN
  js/pages/tokpa.js      espace pro TokpaExpress
  js/pages/dashboard.js  tableau de bord vendeur
  js/vendor/qrcode.js    génération des QR codes (qrcode-generator, licence MIT)
```

## À compléter avant la mise en ligne publique

1. **Coordonnées** dans `assets/js/config.js` : téléphone, numéro WhatsApp, numéro SMS TokpaExpress, e-mail, liens réseaux sociaux (actuellement des valeurs d'exemple).
2. **Catalogue réel** dans `assets/js/data.js` : produits et prix des fournisseuses, boutiques des vendeurs. Le champ `img` accepte une vraie photo ; le dossier recommande des photos réalistes des étals plutôt que des icônes.
3. **Mentions légales** : RCCM, IFU, hébergeur ; CGU/CGV et confidentialité à faire valider par le pôle juridique.
4. **Contenus de démonstration** : les boutiques, avis, classements Hall of Fame et témoignages sont des exemples.

## Ce qui reste à brancher côté serveur

Cette version fonctionne entièrement dans le navigateur : compte, panier, commandes, abonnements et boutiques sont enregistrés dans le `localStorage` de l'appareil. Pour la production, il faudra :

- une **API et une base de données** (comptes, catalogue, commandes, boutiques, tickets SAV) ;
- un **agrégateur de paiement Mobile Money** compatible MTN, Moov et Celtiis (paiements et remboursements) ;
- l'**envoi de SMS** (code de connexion, inscription TokpaExpress) et de notifications WhatsApp ;
- les **applications agents/livreurs** (scan des QR codes, tournées), le portail fournisseuses et la tour de contrôle logistique ;
- l'intégration du **partenaire de livraison** (ex. API Gozem) ;
- la traduction complète en anglais (seuls la navigation et les éléments communs sont traduits).
