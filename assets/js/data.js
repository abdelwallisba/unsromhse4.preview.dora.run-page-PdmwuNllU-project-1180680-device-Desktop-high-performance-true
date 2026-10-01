/* ==========================================================================
   LocalBox — données du catalogue (démonstration)
   Ces données illustrent le fonctionnement du site. Elles sont destinées à
   être remplacées par le catalogue réel (fournisseuses de Tokpa, vendeurs
   Marketplace) lors du branchement à une base de données.
   Champ « img » : chemin d'une vraie photo. À défaut, l'emoji est affiché.
   ========================================================================== */

window.LB_DATA = (function () {

  /* ---------------------------------------------------------------------
     MAGASIN (B2C) — produits du marché vendus au détail
     --------------------------------------------------------------------- */
  const magasinCategories = [
    { id: "fruits-legumes", name: "Fruits & légumes", emoji: "🥬", desc: "Frais du jour, sélectionnés au marché" },
    { id: "cereales", name: "Céréales & tubercules", emoji: "🌾", desc: "Riz, gari, maïs, igname…" },
    { id: "epicerie", name: "Épicerie", emoji: "🫙", desc: "Huile, sucre, conserves, pâtes" },
    { id: "poissons-viandes", name: "Poissons & viandes", emoji: "🐟", desc: "Fumé, séché ou frais" },
    { id: "condiments", name: "Condiments & épices", emoji: "🌶️", desc: "Piment, sel, soumbala, crevettes" },
    { id: "boissons", name: "Boissons", emoji: "🧃", desc: "Jus locaux, eau, bissap" },
    { id: "maison", name: "Maison & hygiène", emoji: "🧼", desc: "Savon, lessive, essentiels du foyer" }
  ];

  const products = [
    // Fruits & légumes
    { id: "tomate", cat: "fruits-legumes", name: "Tomates fraîches", unit: "1 kg", price: 800, emoji: "🍅", origin: "Marché Dantokpa", supplier: "Maman Sika", popular: true, desc: "Tomates rouges et fermes, idéales pour la sauce tomate, la pâte rouge ou les salades." },
    { id: "oignon", cat: "fruits-legumes", name: "Oignons", unit: "1 kg", price: 700, emoji: "🧅", origin: "Malanville", supplier: "Maman Sika", popular: true, desc: "Oignons violets bien secs, longue conservation." },
    { id: "piment", cat: "fruits-legumes", name: "Piment frais", unit: "1 tas", price: 300, emoji: "🌶️", origin: "Vallée de l'Ouémé", supplier: "Maman Sika", desc: "Piment rouge frais, parfumé et bien relevé." },
    { id: "gombo", cat: "fruits-legumes", name: "Gombo frais", unit: "1 tas", price: 400, emoji: "🫛", origin: "Vallée de l'Ouémé", supplier: "Dah Rosine", desc: "Gombo tendre pour une sauce gombo bien gluante." },
    { id: "crincrin", cat: "fruits-legumes", name: "Feuilles de crincrin", unit: "1 botte", price: 300, emoji: "🥬", origin: "Houéyiho", supplier: "Dah Rosine", desc: "Feuilles fraîches pour la sauce crincrin." },
    { id: "ananas", cat: "fruits-legumes", name: "Ananas pain de sucre", unit: "1 pièce", price: 700, emoji: "🍍", origin: "Allada", supplier: "Chez Akou", popular: true, desc: "Le fameux pain de sucre d'Allada, très sucré et peu acide." },
    { id: "orange", cat: "fruits-legumes", name: "Oranges", unit: "1 tas (6)", price: 500, emoji: "🍊", origin: "Zou", supplier: "Chez Akou", desc: "Oranges juteuses, parfaites pour le jus du matin." },
    { id: "banane", cat: "fruits-legumes", name: "Banane plantain", unit: "1 main", price: 1500, emoji: "🍌", origin: "Couffo", supplier: "Chez Akou", desc: "Plantain mûr pour l'aloko ou vert pour le foutou." },
    { id: "mangue", cat: "fruits-legumes", name: "Mangues", unit: "1 tas (4)", price: 600, emoji: "🥭", origin: "Borgou", supplier: "Chez Akou", desc: "Mangues de saison, charnues et parfumées." },
    { id: "avocat", cat: "fruits-legumes", name: "Avocats", unit: "1 tas (3)", price: 600, emoji: "🥑", origin: "Plateau", supplier: "Chez Akou", desc: "Avocats crémeux, prêts à consommer sous 1 à 2 jours." },

    // Céréales & tubercules
    { id: "riz-local", cat: "cereales", name: "Riz local étuvé", unit: "1 kg", price: 750, emoji: "🍚", origin: "Malanville", supplier: "Maman Bernadette", popular: true, desc: "Riz béninois étuvé, grains entiers et savoureux." },
    { id: "riz-parfume", cat: "cereales", name: "Riz parfumé", unit: "5 kg", price: 4200, emoji: "🍚", origin: "Importé", supplier: "Maman Bernadette", desc: "Riz long grain parfumé, sac de 5 kg." },
    { id: "gari", cat: "cereales", name: "Gari de Savalou", unit: "1 kg", price: 600, emoji: "🥣", origin: "Savalou", supplier: "Maman Bernadette", popular: true, desc: "Gari fin et croquant, pour l'eba ou le gari trempé." },
    { id: "mais", cat: "cereales", name: "Maïs blanc grain", unit: "1 kg", price: 350, emoji: "🌽", origin: "Borgou", supplier: "Maman Bernadette", desc: "Maïs sec pour la pâte, l'akassa ou le ablo." },
    { id: "igname", cat: "cereales", name: "Igname", unit: "1 tubercule (≈2 kg)", price: 1500, emoji: "🍠", origin: "Dassa-Zoumè", supplier: "Dah Rosine", popular: true, desc: "Igname de qualité, parfaite pour l'igname pilée." },
    { id: "haricot", cat: "cereales", name: "Haricot niébé", unit: "1 kg", price: 900, emoji: "🫘", origin: "Zou", supplier: "Maman Bernadette", desc: "Niébé trié, pour l'atassi ou les beignets ata." },
    { id: "farine-mais", cat: "cereales", name: "Farine de maïs", unit: "1 kg", price: 500, emoji: "🌾", origin: "Cotonou", supplier: "Maman Bernadette", desc: "Farine fine pour la pâte blanche." },

    // Épicerie
    { id: "huile-1l", cat: "epicerie", name: "Huile végétale", unit: "1 L", price: 1400, emoji: "🫗", origin: "Bénin", supplier: "Boutique Tokpa Gros", popular: true, desc: "Huile raffinée pour la cuisine de tous les jours." },
    { id: "huile-rouge", cat: "epicerie", name: "Huile rouge (palme)", unit: "1 L", price: 1200, emoji: "🫙", origin: "Ouémé", supplier: "Dah Rosine", desc: "Huile de palme artisanale, couleur et goût authentiques." },
    { id: "sucre", cat: "epicerie", name: "Sucre en poudre", unit: "1 kg", price: 800, emoji: "🧂", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Sucre blanc cristallisé." },
    { id: "tomate-conc", cat: "epicerie", name: "Tomate concentrée", unit: "Boîte 400 g", price: 650, emoji: "🥫", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Double concentré de tomate." },
    { id: "spaghetti", cat: "epicerie", name: "Spaghetti", unit: "500 g", price: 450, emoji: "🍝", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Pâtes de blé dur, cuisson 9 minutes." },
    { id: "lait", cat: "epicerie", name: "Lait concentré sucré", unit: "Boîte 397 g", price: 600, emoji: "🥛", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Pour le café, la bouillie ou les desserts." },
    { id: "pate-arachide", cat: "epicerie", name: "Pâte d'arachide", unit: "Pot 500 g", price: 900, emoji: "🥜", origin: "Zou", supplier: "Épicerie La Récolte", desc: "Pâte d'arachide pure, pour la sauce arachide." },

    // Poissons & viandes
    { id: "poisson-fume", cat: "poissons-viandes", name: "Poisson fumé (silure)", unit: "1 pièce", price: 1500, emoji: "🐟", origin: "Lac Nokoué", supplier: "Maman Afiavi", popular: true, desc: "Silure fumé au feu de bois, goût intense pour vos sauces." },
    { id: "crevettes", cat: "poissons-viandes", name: "Crevettes séchées", unit: "1 sachet 100 g", price: 1000, emoji: "🦐", origin: "Grand-Popo", supplier: "Maman Afiavi", desc: "Crevettes séchées pour relever sauces et légumes." },
    { id: "chinchard", cat: "poissons-viandes", name: "Chinchard frais", unit: "1 kg", price: 1800, emoji: "🐠", origin: "Port de pêche", supplier: "Maman Afiavi", desc: "Poisson frais, livré sous glace." },
    { id: "poulet", cat: "poissons-viandes", name: "Poulet bicyclette", unit: "1 pièce", price: 4500, emoji: "🐔", origin: "Ferme locale", supplier: "Maman Afiavi", desc: "Poulet local élevé en plein air, nettoyé sur demande." },
    { id: "viande-boeuf", cat: "poissons-viandes", name: "Viande de bœuf", unit: "1 kg", price: 3500, emoji: "🥩", origin: "Abattoir de Cotonou", supplier: "Maman Afiavi", desc: "Viande fraîche avec os, coupée en morceaux." },

    // Condiments
    { id: "sel", cat: "condiments", name: "Sel fin", unit: "1 kg", price: 250, emoji: "🧂", origin: "Bénin", supplier: "Boutique Tokpa Gros", desc: "Sel iodé." },
    { id: "soumbala", cat: "condiments", name: "Afitin (moutarde locale)", unit: "1 boule", price: 200, emoji: "🟤", origin: "Abomey", supplier: "Dah Rosine", desc: "Condiment traditionnel fermenté pour sauces." },
    { id: "gingembre", cat: "condiments", name: "Gingembre", unit: "250 g", price: 400, emoji: "🫚", origin: "Ouémé", supplier: "Maman Sika", desc: "Gingembre frais pour jus et assaisonnements." },
    { id: "ail", cat: "condiments", name: "Ail", unit: "250 g", price: 500, emoji: "🧄", origin: "Importé", supplier: "Maman Sika", desc: "Têtes d'ail bien sèches." },

    // Boissons
    { id: "bissap", cat: "boissons", name: "Jus de bissap", unit: "1 L", price: 800, emoji: "🧃", origin: "Cotonou", supplier: "Épicerie La Récolte", desc: "Jus d'hibiscus artisanal, peu sucré, à servir frais." },
    { id: "jus-ananas", cat: "boissons", name: "Jus d'ananas", unit: "1 L", price: 1200, emoji: "🍹", origin: "Allada", supplier: "Épicerie La Récolte", desc: "100 % pur jus d'ananas pain de sucre." },
    { id: "eau", cat: "boissons", name: "Eau minérale", unit: "Pack 6 × 1,5 L", price: 1800, emoji: "💧", origin: "Bénin", supplier: "Boutique Tokpa Gros", desc: "Eau minérale naturelle." },

    // Maison & hygiène
    { id: "savon", cat: "maison", name: "Savon de ménage", unit: "1 barre", price: 300, emoji: "🧼", origin: "Bénin", supplier: "Boutique Tokpa Gros", desc: "Savon multi-usage pour le linge et la maison." },
    { id: "lessive", cat: "maison", name: "Lessive en poudre", unit: "1 kg", price: 1100, emoji: "🧺", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Lessive pour lavage à la main et en machine." },
    { id: "charbon", cat: "maison", name: "Charbon de bois", unit: "1 sac (≈10 kg)", price: 2500, emoji: "🪵", origin: "Zou", supplier: "Boutique Tokpa Gros", desc: "Charbon sec, peu de fumée." },
    { id: "papier", cat: "maison", name: "Papier hygiénique", unit: "Lot de 4", price: 900, emoji: "🧻", origin: "Importé", supplier: "Boutique Tokpa Gros", desc: "Double épaisseur." }
  ];

  /* Paniers prêts à commander */
  const bundles = [
    { id: "panier-semaine", name: "Panier de la semaine", emoji: "🧺", desc: "Tomates, oignons, piment, gombo, riz local, huile, poisson fumé", items: { tomate: 2, oignon: 1, piment: 1, gombo: 1, "riz-local": 3, "huile-1l": 1, "poisson-fume": 1 } },
    { id: "panier-sauce", name: "Kit sauce gombo", emoji: "🍲", desc: "Tout pour une sauce gombo pour 6 personnes", items: { gombo: 2, tomate: 1, piment: 1, crevettes: 1, "poisson-fume": 1, "huile-rouge": 1 } },
    { id: "panier-fruits", name: "Panier fruits du jour", emoji: "🍍", desc: "Ananas, oranges, mangues, avocats", items: { ananas: 2, orange: 1, mangue: 1, avocat: 1 } }
  ];

  /* ---------------------------------------------------------------------
     TOKPAEXPRESS (B2B) — catalogue de gros, prix « marché Tokpa »
     unitMarketPrice = prix moyen de revente à l'unité sur le marché
     --------------------------------------------------------------------- */
  const wholesale = [
    { id: "g-riz25", name: "Riz parfumé — sac 25 kg", cat: "Céréales", price: 17500, units: 25, unitLabel: "kg", unitMarketPrice: 850, emoji: "🍚", weight: "25 kg", tips: "Revente au kilo ou en mesures (tohoungbo). Stocker au sec, sur palette." },
    { id: "g-riz-local25", name: "Riz local étuvé — sac 25 kg", cat: "Céréales", price: 16000, units: 25, unitLabel: "kg", unitMarketPrice: 800, emoji: "🍚", weight: "25 kg", tips: "Forte demande en hausse sur le riz béninois." },
    { id: "g-sucre50", name: "Sucre en poudre — sac 50 kg", cat: "Épicerie", price: 32000, units: 50, unitLabel: "kg", unitMarketPrice: 800, emoji: "🧂", weight: "50 kg", tips: "Revente en sachets de 250 g / 500 g / 1 kg." },
    { id: "g-huile20", name: "Huile végétale — carton 20 × 1 L", cat: "Épicerie", price: 26000, units: 20, unitLabel: "bouteilles", unitMarketPrice: 1450, emoji: "🫗", weight: "≈19 kg", tips: "Produit à forte rotation, à avoir toujours en rayon." },
    { id: "g-sardine", name: "Sardines à l'huile — carton 50 boîtes", cat: "Conserves", price: 15000, units: 50, unitLabel: "boîtes", unitMarketPrice: 550, emoji: "🐟", weight: "≈7 kg", tips: "Exemple du dossier : marge potentielle de 83 % à la revente unitaire." },
    { id: "g-tomate48", name: "Tomate concentrée — carton 48 × 70 g", cat: "Conserves", price: 9000, units: 48, unitLabel: "sachets", unitMarketPrice: 250, emoji: "🥫", weight: "≈3,5 kg", tips: "Petits formats très demandés en boutique de quartier." },
    { id: "g-lait48", name: "Lait concentré — carton 48 boîtes", cat: "Épicerie", price: 24000, units: 48, unitLabel: "boîtes", unitMarketPrice: 600, emoji: "🥛", weight: "≈19 kg", tips: "Pic de demande en période de fêtes." },
    { id: "g-spag20", name: "Spaghetti — carton 20 × 500 g", cat: "Épicerie", price: 8000, units: 20, unitLabel: "paquets", unitMarketPrice: 450, emoji: "🍝", weight: "10 kg", tips: "Rotation rapide, faible encombrement." },
    { id: "g-farine50", name: "Farine de blé — sac 50 kg", cat: "Céréales", price: 22000, units: 50, unitLabel: "kg", unitMarketPrice: 550, emoji: "🌾", weight: "50 kg", tips: "Pour boulangers, beignetières et revente au détail." },
    { id: "g-savon72", name: "Savon de ménage — carton 72 barres", cat: "Hygiène", price: 15000, units: 72, unitLabel: "barres", unitMarketPrice: 300, emoji: "🧼", weight: "≈14 kg", tips: "Indispensable en boutique de quartier." },
    { id: "g-eau12", name: "Eau minérale — pack 12 × 1,5 L", cat: "Boissons", price: 3000, units: 12, unitLabel: "bouteilles", unitMarketPrice: 350, emoji: "💧", weight: "18 kg", tips: "Vente au frais : prévoir un réfrigérateur." },
    { id: "g-gari50", name: "Gari — sac 50 kg", cat: "Céréales", price: 22500, units: 50, unitLabel: "kg", unitMarketPrice: 600, emoji: "🥣", weight: "50 kg", tips: "Produit local à marge régulière." }
  ];

  /* ---------------------------------------------------------------------
     MARKETPLACE (B2B2C) — boutiques indépendantes
     hours : jours (0 = dimanche) et horaires d'ouverture
     --------------------------------------------------------------------- */
  const shopCategories = [
    { id: "restaurants", name: "Restaurants", emoji: "🍲" },
    { id: "epiceries", name: "Épiceries & produits du terroir", emoji: "🧺" },
    { id: "artisanat", name: "Artisanat & mode", emoji: "🧵" },
    { id: "cosmetique", name: "Cosmétique naturelle", emoji: "🌿" },
    { id: "beaute", name: "Coiffure & beauté", emoji: "💇🏾‍♀️" }
  ];

  const shops = [
    {
      id: "la-recolte", name: "Épicerie La Récolte", cat: "epiceries", city: "Cotonou", district: "Gbegamey",
      img: "assets/img/epicerie.jpg", emoji: "🧺", rating: 4.6, reviews: 128, since: "2025",
      tagline: "Produits du terroir béninois transformés avec soin",
      about: "Jus naturels, pâtes d'arachide, farines et confitures de fruits locaux, préparés par un réseau de transformatrices du Sud-Bénin.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "08:00", close: "20:00" }, prep: "1 h", logistics: true, badges: ["Top Vendeur"],
      whatsapp: "22901000000000",
      products: [
        { id: "lr-bissap", name: "Jus de bissap artisanal", price: 800, unit: "1 L", emoji: "🧃" },
        { id: "lr-ananas", name: "Jus d'ananas pain de sucre", price: 1200, unit: "1 L", emoji: "🍹" },
        { id: "lr-arachide", name: "Pâte d'arachide pure", price: 900, unit: "500 g", emoji: "🥜" },
        { id: "lr-confiture", name: "Confiture de mangue", price: 1500, unit: "Pot 350 g", emoji: "🥭" },
        { id: "lr-moringa", name: "Poudre de moringa", price: 1500, unit: "100 g", emoji: "🌿" },
        { id: "lr-kluiklui", name: "Kluiklui (galettes d'arachide)", price: 500, unit: "Sachet", emoji: "🥨" }
      ]
    },
    {
      id: "chez-amina", name: "Chez Amina", cat: "restaurants", city: "Porto-Novo", district: "Ouando",
      img: "assets/img/restaurant.jpg", emoji: "🍲", rating: 4.5, reviews: 86, since: "2025",
      tagline: "La cuisine de maman, livrée chaude",
      about: "Plats du jour béninois cuisinés chaque matin : riz au gras, atassi, pâte rouge et sauce arachide.",
      hours: { days: [1, 2, 3, 4, 5, 6, 0], open: "11:00", close: "22:00" }, prep: "30 min", logistics: true, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "am-atassi", name: "Atassi (riz-haricot) + poisson frit", price: 1500, unit: "Portion", emoji: "🍛" },
        { id: "am-gras", name: "Riz au gras + poulet", price: 2500, unit: "Portion", emoji: "🍗" },
        { id: "am-pate-rouge", name: "Pâte rouge (amiwo) + poulet", price: 2000, unit: "Portion", emoji: "🍲" },
        { id: "am-arachide", name: "Igname pilée sauce arachide", price: 2500, unit: "Portion", emoji: "🥘" },
        { id: "am-aloko", name: "Aloko + poisson braisé", price: 2000, unit: "Portion", emoji: "🍌" }
      ]
    },
    {
      id: "artisanat-abomey", name: "Artisanat d'Abomey", cat: "artisanat", city: "Comé", district: "Centre",
      img: "assets/img/artisanat.jpg", emoji: "🧵", rating: 4.7, reviews: 54, since: "2025",
      tagline: "Tentures appliquées, bonnets et objets d'art royaux",
      about: "Héritiers des artisans des palais royaux d'Abomey, nous créons tentures appliquées, coussins et accessoires à la main.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "09:00", close: "18:00" }, prep: "2 h", logistics: true, badges: ["Top Vendeur"],
      whatsapp: "22901000000000",
      products: [
        { id: "aa-tenture", name: "Tenture appliquée (60 × 90 cm)", price: 25000, unit: "Pièce", emoji: "🖼️" },
        { id: "aa-bonnet", name: "Bonnet traditionnel brodé", price: 6000, unit: "Pièce", emoji: "🧢" },
        { id: "aa-coussin", name: "Housse de coussin appliquée", price: 8000, unit: "Pièce", emoji: "🛋️" },
        { id: "aa-sac", name: "Sac en pagne tissé", price: 9500, unit: "Pièce", emoji: "👜" },
        { id: "aa-statuette", name: "Statuette en bronze", price: 18000, unit: "Pièce", emoji: "🗿" }
      ]
    },
    {
      id: "case-ecolo", name: "La Case Écolo", cat: "artisanat", city: "Bohicon", district: "Centre",
      img: "assets/img/vannerie.jpg", emoji: "🧺", rating: 4.4, reviews: 77, since: "2025",
      tagline: "Vannerie et objets du quotidien écoresponsables",
      about: "Paniers, cabas et objets en fibres naturelles tressés par des coopératives de femmes du Zou.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "08:30", close: "19:00" }, prep: "2 h", logistics: false, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "ce-panier", name: "Panier de marché tressé", price: 4500, unit: "Pièce", emoji: "🧺" },
        { id: "ce-cabas", name: "Cabas en raphia", price: 6000, unit: "Pièce", emoji: "👜" },
        { id: "ce-eventail", name: "Éventail tressé", price: 1500, unit: "Pièce", emoji: "🪭" },
        { id: "ce-natte", name: "Natte en fibres naturelles", price: 7000, unit: "Pièce", emoji: "🟫" }
      ]
    },
    {
      id: "chez-akou", name: "Chez Akou", cat: "epiceries", city: "Cotonou", district: "Dantokpa",
      img: "assets/img/hero-vendeuse.jpg", emoji: "🍊", rating: 4.8, reviews: 203, since: "2025",
      tagline: "Fruits et légumes locaux, frais du jour",
      about: "Commerçante à Dantokpa depuis 15 ans, Akou sélectionne chaque matin les meilleurs fruits et légumes du marché.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "06:30", close: "19:00" }, prep: "45 min", logistics: true, badges: ["Top Vendeur", "TokpaPro"],
      whatsapp: "22901000000000",
      products: [
        { id: "ak-tomate", name: "Tomates", price: 800, unit: "1 kg", emoji: "🍅" },
        { id: "ak-orange", name: "Oranges", price: 500, unit: "Tas de 6", emoji: "🍊" },
        { id: "ak-piment", name: "Piment", price: 300, unit: "Tas", emoji: "🌶️" },
        { id: "ak-ananas", name: "Ananas pain de sucre", price: 700, unit: "Pièce", emoji: "🍍" },
        { id: "ak-legumes", name: "Légumes feuilles (assortiment)", price: 1000, unit: "Botte", emoji: "🥬" },
        { id: "ak-patate", name: "Patate douce", price: 600, unit: "1 kg", emoji: "🍠" }
      ]
    },
    {
      id: "le-palmier", name: "Le Palmier", cat: "restaurants", city: "Cotonou", district: "Fidjrossè",
      img: "", emoji: "🌴", rating: 4.3, reviews: 61, since: "2025",
      tagline: "Grillades et poissons braisés face à la mer",
      about: "Poissons braisés, poulet bicyclette et accompagnements maison.",
      hours: { days: [2, 3, 4, 5, 6, 0], open: "12:00", close: "23:00" }, prep: "40 min", logistics: true, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "pa-tilapia", name: "Tilapia braisé + attiéké", price: 3500, unit: "Portion", emoji: "🐟" },
        { id: "pa-poulet", name: "Poulet bicyclette braisé", price: 5000, unit: "½ poulet", emoji: "🍗" },
        { id: "pa-ablo", name: "Ablo + sauce tomate", price: 1500, unit: "Portion", emoji: "🍚" }
      ]
    },
    {
      id: "chez-afi", name: "Chez Afi", cat: "restaurants", city: "Cotonou", district: "Akpakpa",
      img: "", emoji: "🥘", rating: 4.6, reviews: 92, since: "2025",
      tagline: "Spécialités du Sud : akassa, sauce feuille, wassa-wassa",
      about: "Cuisine traditionnelle préparée au feu de bois.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "10:00", close: "21:00" }, prep: "30 min", logistics: false, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "af-akassa", name: "Akassa + sauce feuille", price: 1500, unit: "Portion", emoji: "🥬" },
        { id: "af-wassa", name: "Wassa-wassa + sauce", price: 1500, unit: "Portion", emoji: "🍲" },
        { id: "af-gombo", name: "Pâte blanche + sauce gombo", price: 1500, unit: "Portion", emoji: "🥣" }
      ]
    },
    {
      id: "la-toranga", name: "La Toranga", cat: "restaurants", city: "Cotonou", district: "Cadjèhoun",
      img: "", emoji: "🍛", rating: 4.2, reviews: 40, since: "2025",
      tagline: "Cuisine béninoise moderne et jus frais",
      about: "Assiettes revisitées, salades et jus de fruits frais pressés.",
      hours: { days: [1, 2, 3, 4, 5], open: "11:30", close: "21:30" }, prep: "35 min", logistics: true, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "to-bowl", name: "Bowl riz local, légumes, poulet", price: 3000, unit: "Portion", emoji: "🥗" },
        { id: "to-jus", name: "Jus de baobab (toédji)", price: 1000, unit: "50 cl", emoji: "🥤" },
        { id: "to-dessert", name: "Dêguê (mil au lait caillé)", price: 800, unit: "Pot", emoji: "🍨" }
      ]
    },
    {
      id: "karite-or", name: "Karité d'Or", cat: "cosmetique", city: "Parakou", district: "Centre",
      img: "", emoji: "🌿", rating: 4.7, reviews: 70, since: "2025",
      tagline: "Beurre de karité pur et savons naturels du Nord-Bénin",
      about: "Coopérative de femmes productrices de karité, transformation artisanale sans additifs.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "08:00", close: "18:00" }, prep: "2 h", logistics: true, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "ko-karite", name: "Beurre de karité brut", price: 2500, unit: "Pot 250 g", emoji: "🧈" },
        { id: "ko-savon", name: "Savon noir au karité", price: 1000, unit: "Pain 150 g", emoji: "🧼" },
        { id: "ko-huile", name: "Huile de coco vierge", price: 3000, unit: "250 ml", emoji: "🥥" },
        { id: "ko-baume", name: "Baume lèvres karité-miel", price: 1200, unit: "Stick", emoji: "💄" }
      ]
    },
    {
      id: "salon-grace", name: "Salon Grâce Coiffure", cat: "beaute", city: "Cotonou", district: "Zogbo",
      img: "", emoji: "💇🏾‍♀️", rating: 4.5, reviews: 48, since: "2025",
      tagline: "Tresses, nattes et soins capillaires — sur réservation",
      about: "Coiffeuses expérimentées, au salon ou à domicile. Réservez votre créneau en ligne.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "08:00", close: "20:00" }, prep: "Sur rendez-vous", logistics: false, badges: [], booking: true,
      whatsapp: "22901000000000",
      products: [
        { id: "sg-tresses", name: "Tresses africaines (mi-longues)", price: 8000, unit: "Prestation", emoji: "💇🏾‍♀️" },
        { id: "sg-nattes", name: "Nattes collées", price: 4000, unit: "Prestation", emoji: "✨" },
        { id: "sg-soin", name: "Soin hydratant + brushing", price: 5000, unit: "Prestation", emoji: "🧴" }
      ]
    },
    {
      id: "atelier-senami", name: "Atelier Couture Sènami", cat: "artisanat", city: "Cotonou", district: "Agla",
      img: "", emoji: "👗", rating: 4.6, reviews: 39, since: "2025",
      tagline: "Tenues en pagne sur mesure et prêt-à-porter",
      about: "Couturière diplômée, je confectionne vos tenues en pagne wax, bazin et kanvô.",
      hours: { days: [1, 2, 3, 4, 5, 6], open: "09:00", close: "19:00" }, prep: "3 à 5 jours", logistics: true, badges: [],
      whatsapp: "22901000000000",
      products: [
        { id: "as-robe", name: "Robe en pagne (sur mesure)", price: 15000, unit: "Pièce", emoji: "👗" },
        { id: "as-chemise", name: "Chemise homme en kanvô", price: 12000, unit: "Pièce", emoji: "👔" },
        { id: "as-enfant", name: "Ensemble enfant en wax", price: 7000, unit: "Pièce", emoji: "🧒🏾" }
      ]
    }
  ];

  /* Avis clients (démonstration) — utilisés sur les fiches boutique */
  const reviews = [
    { name: "Chloé A.", initials: "CA", rating: 5, date: "Il y a 2 jours", text: "Commande arrivée en moins de 2 heures, produits très frais. Le livreur était courtois et a attendu que je vérifie le panier." },
    { name: "Victor M.", initials: "VM", rating: 4, date: "Il y a 1 semaine", text: "Très bon service. J'aurais aimé un créneau plus tôt le matin, mais la qualité est au rendez-vous." },
    { name: "Aïcha K.", initials: "AK", rating: 5, date: "Il y a 2 semaines", text: "Enfin je n'ai plus besoin d'aller à Tokpa le samedi ! Mes courses arrivent emballées proprement." },
    { name: "Romuald D.", initials: "RD", rating: 4, date: "Il y a 3 semaines", text: "Paiement MoMo simple et rapide. Je recommande." }
  ];

  /* Témoignages (page d'accueil) */
  const testimonials = [
    { name: "Mireille, mère de 3 enfants", initials: "M", place: "Akpakpa", segment: "Cliente Magasin", text: "Depuis que j'utilise LocalBox, mes samedis matin sont à moi. Fini la cohue du marché !" },
    { name: "Koffi, boutiquier", initials: "K", place: "Cococodji", segment: "Abonné TokpaExpress", text: "Je ne ferme plus ma boutique pour aller à Tokpa. Je commande par téléphone et mes cartons arrivent le lendemain." },
    { name: "Akou, commerçante", initials: "A", place: "Dantokpa", segment: "Vendeuse Marketplace", text: "LocalBox, c'est moi : je vends comme au marché, mais en ligne. Mes clients me retrouvent partout à Cotonou." }
  ];

  /* ---------------------------------------------------------------------
     BLOG — Carnet du Marché, portraits, conseils
     --------------------------------------------------------------------- */
  const posts = [
    {
      id: "carnet-du-marche-1", cat: "#CarnetDuMarché", date: "2025-09-05", read: "4 min", emoji: "📓", color: "#f7ecd2",
      title: "Carnet du Marché n°1 : nos premières livraisons pilotes",
      excerpt: "Premières commandes, premiers sourires, premières leçons : le journal de bord de la phase test.",
      body: [
        "Cette semaine, LocalBox a livré ses premières commandes pilotes dans les quartiers d'Akpakpa et de Cadjèhoun. Chaque panier a été composé par nos fournisseuses partenaires de Dantokpa, regroupé au mini-hub puis livré le jour même.",
        "## Ce qui a bien marché",
        "Les clientes ont apprécié l'emballage scellé et la vérification du panier à la porte, avant la confirmation par QR code. Le paiement à la livraison a rassuré les premières utilisatrices.",
        "## Ce que nous améliorons",
        "Plusieurs testeurs ont demandé des créneaux plus tôt le matin et des photos plus réalistes des produits. Nous ajoutons dès la semaine prochaine un créneau 7h–9h et nous photographions les étals de nos fournisseuses.",
        "Merci aux pionniers qui participent au concours « Je teste LocalBox » : chaque retour compte et vous rapporte des LocalPoints !"
      ]
    },
    {
      id: "portrait-akou", cat: "Portrait de commerçante", date: "2025-09-12", read: "5 min", emoji: "👩🏾‍🌾", color: "#fbe3cf",
      title: "Paroles du marché : Akou, 15 ans à Dantokpa",
      excerpt: "Elle connaît chaque allée du marché. Aujourd'hui, ses fruits et légumes voyagent dans tout Cotonou.",
      body: [
        "Akou arrive à Dantokpa avant le lever du soleil. Depuis quinze ans, elle choisit ses tomates, ses oranges et ses légumes feuilles auprès des mêmes producteurs de la vallée de l'Ouémé.",
        "## « Mon commerce, ma fierté »",
        "« Avec la délocalisation du marché, j'avais peur de perdre mes clientes. Avec LocalBox, elles commandent depuis leur téléphone et je prépare leur panier comme si elles étaient devant moi. »",
        "## Une vitrine numérique sans commission",
        "Sur la Marketplace, Akou garde 100 % de ses ventes : elle paie un abonnement mensuel fixe et a activé l'option logistique pour que LocalBox livre ses clients.",
        "Retrouvez la boutique d'Akou dans la Marketplace, rubrique Épiceries & produits du terroir."
      ]
    },
    {
      id: "conseils-produits-frais", cat: "Conseils consommation locale", date: "2025-09-19", read: "3 min", emoji: "🥬", color: "#e3eee7",
      title: "5 astuces pour conserver vos produits frais plus longtemps",
      excerpt: "Tomates, piment, légumes feuilles : nos fournisseuses partagent leurs secrets de conservation.",
      body: [
        "Bien conserver ses produits, c'est moins de gaspillage et plus d'économies. Voici les conseils de nos fournisseuses du marché.",
        "## 1. Les tomates à température ambiante",
        "Gardez-les hors du réfrigérateur, tige vers le bas, à l'abri du soleil. Elles garderont leur goût.",
        "## 2. Le piment au congélateur",
        "Lavez, séchez puis congelez votre piment entier : il se conserve plusieurs mois.",
        "## 3. Les légumes feuilles dans un linge humide",
        "Enveloppez crincrin, amaranthe ou gboma dans un linge propre légèrement humide.",
        "## 4. L'igname dans un endroit sec et aéré",
        "Jamais dans un sac plastique fermé : l'igname doit respirer.",
        "## 5. Le poisson fumé bien sec",
        "Remettez-le quelques minutes au four ou au soleil s'il ramollit, puis stockez-le dans une boîte fermée."
      ]
    },
    {
      id: "tokpaexpress-gain-de-temps", cat: "Nouveautés", date: "2025-09-26", read: "4 min", emoji: "📦", color: "#dde9fb",
      title: "TokpaExpress : commandez vos cartons en 5 minutes",
      excerpt: "Boutiquiers, épiciers, revendeurs : recevez vos réassorts sans fermer boutique.",
      body: [
        "Fermer sa boutique le matin pour courir au marché, porter des sacs lourds, payer le transport… Avec TokpaExpress, ce temps redevient du temps de vente.",
        "## Comment ça marche ?",
        "Vous choisissez votre abonnement (5 000 FCFA pour 2 livraisons ou 7 000 FCFA pour 3 livraisons par mois), vous commandez au prix de gros du marché, et un livreur dépose vos cartons directement à votre boutique.",
        "## Des statistiques offertes",
        "Chaque abonné accède gratuitement à un tableau de rentabilité : prix par carton, bénéfice potentiel, marge, alertes de réassort.",
        "## Inscription même sans smartphone",
        "Envoyez simplement un SMS au numéro TokpaExpress : notre équipe vous rappelle pour finaliser l'inscription."
      ]
    },
    {
      id: "mon-commerce-ma-fierte", cat: "Mon commerce, ma fierté", date: "2025-10-01", read: "3 min", emoji: "🧵", color: "#f1e3f3",
      title: "Artisanat d'Abomey : l'art royal à portée de clic",
      excerpt: "Tentures appliquées, bonnets brodés : un savoir-faire séculaire qui trouve de nouveaux clients en ligne.",
      body: [
        "Les tentures appliquées racontent l'histoire des rois d'Abomey. Aujourd'hui, l'atelier Artisanat d'Abomey les fait découvrir à toute une nouvelle clientèle grâce à sa boutique LocalBox.",
        "## Un portrait offert aux premiers vendeurs",
        "Dans le cadre de la campagne « Mon commerce, ma fierté », LocalBox offre aux premiers vendeurs un portrait photo professionnel et une courte vidéo de leur atelier.",
        "## Rejoindre la Marketplace",
        "Le premier mois d'abonnement est offert : une bonne occasion de tester sans risque."
      ]
    }
  ];

  /* ---------------------------------------------------------------------
     FAQ
     --------------------------------------------------------------------- */
  const faq = [
    { cat: "Commandes", q: "Les produits proposés sont-ils tous fabriqués au Bénin ?", a: "Le Magasin propose en priorité des produits locaux achetés auprès de nos fournisseuses partenaires du marché (Dantokpa, puis le nouveau marché de gros). Certains produits de première nécessité importés (riz parfumé, lait concentré…) sont aussi disponibles ; leur origine est toujours indiquée sur la fiche produit." },
    { cat: "Commandes", q: "Comment fonctionne une commande Magasin ?", a: "Vous composez votre panier en ligne, choisissez votre lieu (Maison, Travail ou Autre) et votre créneau, puis payez. Nos agents achètent vos produits chez nos fournisseuses partenaires, préparent un panier scellé au mini-hub et un livreur vous l'apporte, généralement le jour même." },
    { cat: "Commandes", q: "Puis-je annuler ma commande ?", a: "Oui, sans frais, tant que le colis n'a pas été pris en charge par le livreur. Rendez-vous dans Mon compte > Mes commandes. Le remboursement est effectué par le même moyen de paiement (sous 24 h pour le Mobile Money)." },
    { cat: "Paiement", q: "Quelles méthodes de paiement acceptez-vous ?", a: "Mobile Money (MTN MoMo, Moov Money, Celtiis Cash), paiement à la livraison (espèces ou MoMo) et carte bancaire. Le paiement en ligne est sécurisé." },
    { cat: "Paiement", q: "Y a-t-il des frais cachés ?", a: "Non. La facture affiche le détail de chaque produit, les frais de livraison et le net à payer avant validation. Nos prix sont alignés sur ceux du marché traditionnel." },
    { cat: "Livraison", q: "Où livrez-vous ?", a: "Pendant la phase pilote : Cotonou et Abomey-Calavi. Porto-Novo et Sèmè-Kpodji arrivent bientôt, puis Parakou, Abomey et Bohicon. Consultez la page Livraison pour les zones et tarifs." },
    { cat: "Livraison", q: "À quoi sert le QR code de livraison ?", a: "Chaque commande dispose d'un QR code unique visible dans votre compte. À la livraison, vous vérifiez votre panier puis présentez ce QR code au livreur : le scan confirme la réception. Personne d'autre ne peut récupérer votre colis à votre place." },
    { cat: "Livraison", q: "Je ne serai pas présent, que faire ?", a: "Depuis le suivi de commande, vous pouvez reprogrammer la livraison, laisser un message au livreur (« laisser au gardien ») ou choisir un retrait au hub LocalBox de votre quartier." },
    { cat: "Retours & réclamations", q: "Un produit est manquant ou abîmé, comment faire ?", a: "Utilisez « Déclarer un problème » dans le suivi de votre commande (photo à l'appui si possible). Nous renvoyons le produit ou vous remboursons. Chaque réclamation est traitée en moins de 7 jours ouvrés, idéalement en 48 h." },
    { cat: "Retours & réclamations", q: "Quelle est votre politique de retour ?", a: "Vous pouvez retourner un produit non conforme ou défectueux sous 7 jours ouvrés. Un livreur vient le récupérer ou vous le déposez gratuitement au hub. Le remboursement intervient sous 5 jours après contrôle." },
    { cat: "TokpaExpress", q: "Qu'est-ce que TokpaExpress ?", a: "Un abonnement pour commerçants qui veulent s'approvisionner en gros sans se déplacer : 5 000 FCFA/mois pour 2 livraisons ou 7 000 FCFA/mois pour 3 livraisons, aux prix de gros du marché, livrées à votre boutique." },
    { cat: "TokpaExpress", q: "Je n'ai pas de smartphone, puis-je m'inscrire ?", a: "Oui. Envoyez un SMS au numéro TokpaExpress : un agent vous rappelle et crée votre compte. Nos animateurs terrain passent aussi dans les marchés pour vous accompagner." },
    { cat: "TokpaExpress", q: "Qu'est-ce que la carte TokpaPro ?", a: "Après un an d'abonnement continu, vous recevez la carte TokpaPro : livraison prioritaire, hotline dédiée, badge de confiance sur la Marketplace et invitations aux rencontres TokpaPro." },
    { cat: "Marketplace", q: "Combien coûte une boutique sur la Marketplace ?", a: "20 000 FCFA/mois pour l'abonnement de base, sans aucune commission sur vos ventes. Options : logistique (+10 000 FCFA) et statistiques avancées (+10 000 FCFA). Le premier mois est offert." },
    { cat: "Marketplace", q: "Sans l'option logistique, comment mes clients reçoivent-ils leurs commandes ?", a: "Trois possibilités : retrait à votre boutique, le client envoie son propre livreur, ou vous faites livrer par un livreur de confiance. La remise se valide avec le code ou le QR code du client." },
    { cat: "Fidélité", q: "Comment gagner des LocalPoints ?", a: "À chaque commande (10 points par tranche de 1 000 FCFA), en laissant un avis, en parrainant un proche ou en atteignant chaque palier de 5 commandes. Échangez-les contre la livraison offerte, des bons d'achat ou des cadeaux." }
  ];

  return { magasinCategories, products, bundles, wholesale, shopCategories, shops, reviews, testimonials, posts, faq };
})();
