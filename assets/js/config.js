/* ==========================================================================
   LocalBox — configuration centrale
   Toutes les valeurs « métier » (tarifs, contacts, zones) sont regroupées ici
   pour être modifiées sans toucher au reste du code.
   Sources : « Dossier intégral du projet LocalBox ».
   ========================================================================== */

window.LB_CONFIG = {
  brand: "LocalBox",
  legalName: "LocalBox SARL",
  slogan: "Le Marché dans votre main, le cœur dans votre poche.",
  city: "Cotonou, Bénin",
  currency: "FCFA",

  /* Coordonnées — À REMPLACER par les coordonnées officielles */
  contact: {
    phone: "+229 01 00 00 00 00",
    whatsapp: "22901000000000", // format international sans « + » ni espaces (lien wa.me)
    sms: "+229 01 00 00 00 00", // numéro dédié aux inscriptions TokpaExpress par SMS
    email: "contact@localbox.example",
    address: "Cotonou, Bénin",
    hours: "Lun – Sam : 7h – 21h · Dim : 9h – 18h",
    mapQuery: "Dantokpa, Cotonou, Bénin"
  },

  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#",
    tiktok: "#"
  },

  /* Magasin (B2C) */
  magasin: {
    deliveryFee: 1000,          // frais de livraison standard (FCFA)
    expressFee: 2000,           // livraison express ~2h
    freeDeliveryFrom: 25000,    // livraison offerte à partir de ce montant
    minOrder: 2000,
    slots: ["8h – 10h", "10h – 12h", "12h – 14h", "14h – 16h", "16h – 18h", "18h – 20h"]
  },

  /* TokpaExpress (B2B) — abonnements mensuels */
  tokpa: {
    plans: [
      { id: "tokpa-2", name: "TokpaExpress Essentiel", price: 5000, deliveries: 2 },
      { id: "tokpa-3", name: "TokpaExpress Pro", price: 7000, deliveries: 3, featured: true }
    ],
    extraDeliveryFee: 2500 // au-delà du quota (modalités à confirmer)
  },

  /* Marketplace (B2B2C) — abonnement vendeur, sans commission */
  marketplace: {
    basePrice: 20000,
    options: [
      { id: "logistique", name: "Option logistique", price: 10000 },
      { id: "stats", name: "Option statistiques avancées", price: 10000 }
    ],
    commission: 0,
    firstMonthFree: true
  },

  /* LocalPoints — programme de fidélité */
  points: {
    perThousand: 10,        // points gagnés par tranche de 1 000 FCFA
    review: 20,
    referral: 200,
    fifthOrderBonus: 100,
    rewards: [
      { pts: 300, label: "Livraison offerte sur une commande" },
      { pts: 600, label: "Bon de 1 000 FCFA" },
      { pts: 1500, label: "Sac isotherme LocalBox" },
      { pts: 2500, label: "T-shirt LocalBox" },
      { pts: 4000, label: "Cours de cuisine chez un partenaire" }
    ]
  },

  /* Zones de livraison — phase pilote puis expansion */
  zones: [
    { name: "Cotonou — Centre (Dantokpa, Zongo, Ganhi)", fee: 800, delay: "Le jour même", status: "active" },
    { name: "Cotonou — Akpakpa", fee: 1000, delay: "Le jour même", status: "active" },
    { name: "Cotonou — Cadjèhoun, Gbegamey, Zogbo", fee: 1000, delay: "Le jour même", status: "active" },
    { name: "Cotonou — Fidjrossè, Agla, Houéyiho", fee: 1200, delay: "Le jour même", status: "active" },
    { name: "Abomey-Calavi, Cococodji, Akassato", fee: 1500, delay: "Le jour même ou J+1", status: "active" },
    { name: "Sèmè-Kpodji", fee: 1500, delay: "J+1", status: "soon" },
    { name: "Porto-Novo", fee: 2000, delay: "≤ 24 h", status: "soon" },
    { name: "Parakou", fee: 0, delay: "—", status: "planned" },
    { name: "Abomey · Bohicon", fee: 0, delay: "—", status: "planned" }
  ],

  payments: ["MTN MoMo", "Moov Money", "Celtiis Cash", "Paiement à la livraison", "Carte bancaire"]
};
