/* ==========================================================================
   LocalBox — socle JavaScript commun à toutes les pages
   - en-tête / pied de page partagés
   - panier, compte client, commandes, LocalPoints (stockés sur l'appareil)
   - traductions FR / EN de l'interface
   - utilitaires d'affichage (cartes produit, étoiles, notifications)
   ========================================================================== */

(function () {
  const C = window.LB_CONFIG;
  const D = window.LB_DATA;

  /* ---------------------------------------------------------------------
     Stockage local sécurisé (le site reste utilisable si indisponible)
     --------------------------------------------------------------------- */
  const memory = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("lb_" + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try { localStorage.setItem("lb_" + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    },
    remove(key) {
      delete memory[key];
      try { localStorage.removeItem("lb_" + key); } catch (e) { /* stockage indisponible */ }
    }
  };

  /* ---------------------------------------------------------------------
     Utilitaires
     --------------------------------------------------------------------- */
  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const param = (name) => new URLSearchParams(location.search).get(name);
  const uid = (prefix) => (prefix || "") + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  /* number : "" = partage libre (choix du contact), null = support LocalBox */
  const waLink = (number, text) => "https://wa.me/" + (number === "" ? "" : number || C.contact.whatsapp) + (text ? "?text=" + encodeURIComponent(text) : "");

  function stars(rating) {
    const full = Math.round(rating);
    let s = "";
    for (let i = 1; i <= 5; i++) s += i <= full ? "★" : '<span class="off">★</span>';
    return '<span class="stars" aria-label="Note ' + rating + ' sur 5">' + s + "</span>";
  }

  function toast(msg) {
    let t = qs(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("is-visible"), 2600);
  }

  /* Heure locale du Bénin (UTC+1) pour l'état « Ouvert / Fermé » */
  function beninNow() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Porto-Novo", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const get = (t) => (parts.find((p) => p.type === t) || {}).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get("weekday")], minutes: parseInt(get("hour"), 10) % 24 * 60 + parseInt(get("minute"), 10) };
  }
  function isOpen(hours) {
    if (!hours) return false;
    const now = beninNow();
    const toMin = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
    return hours.days.includes(now.day) && now.minutes >= toMin(hours.open) && now.minutes < toMin(hours.close);
  }
  function openBadge(hours) {
    return isOpen(hours)
      ? '<span class="pill">🟢 Ouvert</span>'
      : '<span class="pill pill--grey">🔴 Fermé</span>';
  }

  /* ---------------------------------------------------------------------
     Catalogue : recherche d'articles par identifiant
     --------------------------------------------------------------------- */
  function findItem(type, id, shopId) {
    if (type === "magasin") return D.products.find((p) => p.id === id);
    if (type === "shop") {
      const shop = D.shops.find((s) => s.id === shopId);
      const p = shop && shop.products.find((x) => x.id === id);
      return p ? Object.assign({ supplier: shop.name, shop }, p) : null;
    }
    if (type === "gros") return D.wholesale.find((p) => p.id === id);
    return null;
  }

  /* ---------------------------------------------------------------------
     Panier
     Une ligne = { type: "magasin" | "shop" | "gros", id, shopId?, qty }
     --------------------------------------------------------------------- */
  const cart = {
    items() { return store.get("cart", []); },
    save(items) { store.set("cart", items); cart.refreshBadge(); document.dispatchEvent(new CustomEvent("cart:change")); },
    key(l) { return l.type + ":" + (l.shopId || "") + ":" + l.id; },
    add(type, id, qty, shopId) {
      const item = findItem(type, id, shopId);
      if (!item) return;
      const items = cart.items();
      const k = cart.key({ type, id, shopId });
      const line = items.find((l) => cart.key(l) === k);
      if (line) line.qty += qty || 1; else items.push({ type, id, shopId: shopId || null, qty: qty || 1 });
      cart.save(items);
      toast("✓ " + item.name + " ajouté au panier");
    },
    setQty(k, qty) {
      let items = cart.items();
      items = qty <= 0 ? items.filter((l) => cart.key(l) !== k) : items.map((l) => (cart.key(l) === k ? Object.assign(l, { qty }) : l));
      cart.save(items);
    },
    clear() { cart.save([]); },
    detailed() {
      return cart.items().map((l) => {
        const item = findItem(l.type, l.id, l.shopId);
        return item ? Object.assign({}, l, { item, key: cart.key(l), total: item.price * l.qty }) : null;
      }).filter(Boolean);
    },
    count() { return cart.items().reduce((n, l) => n + l.qty, 0); },
    subtotal() { return cart.detailed().reduce((n, l) => n + l.total, 0); },
    refreshBadge() { qsa("[data-cart-count]").forEach((b) => { const n = cart.count(); b.textContent = n; b.dataset.count = n; }); }
  };

  /* ---------------------------------------------------------------------
     Compte utilisateur (démonstration, stocké sur l'appareil)
     role : "client" | "tokpa" | "vendeur"
     --------------------------------------------------------------------- */
  const auth = {
    user() { return store.get("user", null); },
    save(u) { store.set("user", u); renderHeaderUser(); },
    login(data) {
      const existing = auth.user();
      const u = existing && existing.phone === data.phone ? existing : {
        id: uid("U-"),
        name: data.name || "Client LocalBox",
        phone: data.phone,
        email: data.email || "",
        role: data.role || "client",
        points: 50, // bonus de bienvenue
        addresses: [],
        referral: "LB" + Math.random().toString(36).slice(2, 7).toUpperCase(),
        createdAt: new Date().toISOString(),
        tokpa: null,
        shop: null
      };
      if (data.name) u.name = data.name;
      if (data.role) u.role = data.role;
      auth.save(u);
      return u;
    },
    logout() { store.remove("user"); renderHeaderUser(); },
    addPoints(n, reason) {
      const u = auth.user();
      if (!u) return;
      u.points = (u.points || 0) + n;
      u.pointsLog = (u.pointsLog || []).concat([{ n, reason, date: new Date().toISOString() }]).slice(-50);
      auth.save(u);
    }
  };

  /* La boutique créée par le vendeur sur cet appareil rejoint la Marketplace */
  (function syncUserShop() {
    const u = auth.user();
    if (!u || !u.shop || !(u.shop.products || []).length) return;
    const cat = D.shopCategories.find((c) => c.id === u.shop.cat) || D.shopCategories[0];
    D.shops.push({
      id: u.shop.id, name: u.shop.name, cat: u.shop.cat, city: u.shop.city, district: u.shop.district,
      img: "", emoji: cat.emoji, rating: 5, reviews: 0, since: new Date(u.shop.createdAt).getFullYear().toString(),
      tagline: u.shop.about ? u.shop.about.slice(0, 80) : "Nouvelle boutique sur LocalBox",
      about: u.shop.about || "Nouvelle boutique sur LocalBox.", hours: u.shop.hours, prep: u.shop.prep,
      logistics: u.shop.logistics, badges: ["Nouveau"], whatsapp: (u.phone || "").replace(/\D/g, "") || C.contact.whatsapp,
      products: u.shop.products.filter((p) => p.stock > 0 || p.stock === undefined), mine: true
    });
  })();

  /* ---------------------------------------------------------------------
     Commandes
     --------------------------------------------------------------------- */
  const orders = {
    all() { return store.get("orders", []); },
    get(id) { return orders.all().find((o) => o.id === id); },
    save(list) { store.set("orders", list); },
    create(order) {
      const list = orders.all();
      list.unshift(order);
      orders.save(list);
      return order;
    },
    update(id, patch) {
      const list = orders.all().map((o) => (o.id === id ? Object.assign(o, patch) : o));
      orders.save(list);
      return orders.get(id);
    },
    /* Statut simulé selon le temps écoulé depuis la commande */
    liveStatus(o) {
      if (o.status === "annulee" || o.status === "livree") return o.status;
      const min = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
      if (min < 2) return "confirmee";
      if (min < 10) return "preparation";
      return "en-route";
    }
  };
  const STATUS = {
    confirmee: { label: "Confirmée", cls: "status--new", step: 1 },
    preparation: { label: "En préparation", cls: "status--prep", step: 2 },
    "en-route": { label: "En cours de livraison", cls: "status--ship", step: 3 },
    livree: { label: "Livrée", cls: "status--done", step: 4 },
    annulee: { label: "Annulée", cls: "status--cancel", step: 0 }
  };

  /* ---------------------------------------------------------------------
     Traductions de l'interface (FR par défaut)
     --------------------------------------------------------------------- */
  const I18N = {
    en: {
      "nav.magasin": "Grocery", "nav.allProducts": "All products", "nav.bundles": "Ready-made baskets",
      "nav.tokpa": "TokpaExpress", "nav.marketplace": "Marketplace", "nav.allShops": "All shops",
      "nav.sell": "Sell on LocalBox", "nav.delivery": "Delivery", "nav.about": "About", "nav.story": "Our story",
      "nav.blog": "Blog", "nav.loyalty": "Loyalty", "nav.soon": "Coming soon", "nav.faq": "FAQ", "nav.contact": "Contact",
      "header.login": "Sign in", "header.account": "My account", "header.cart": "Cart",
      "header.search": "Search for products, shops, dishes…", "header.searchBtn": "Search",
      "promo": "Pilot phase in Cotonou & Abomey-Calavi — same-day delivery",
      "footer.news.title": "#MarketJournal in your inbox", "footer.news.text": "News, merchant portraits and local shopping tips.",
      "footer.news.placeholder": "Your email or WhatsApp number", "footer.news.btn": "Subscribe",
      "footer.buy": "Shop", "footer.pro": "Professionals", "footer.help": "Help", "footer.company": "LocalBox",
      "footer.track": "Track an order", "footer.returns": "Returns & claims", "footer.openShop": "Open my shop",
      "footer.dashboard": "Seller dashboard", "footer.proSpace": "TokpaExpress pro space", "footer.legal": "Legal notice",
      "footer.terms": "Terms of use & sale", "footer.privacy": "Privacy policy", "footer.demo": "Demo version — data is stored on your device only.",
      "btn.add": "Add", "btn.view": "View", "btn.order": "Order", "btn.seeProducts": "See products",
      "home.hero.title": "Local Beninese products, for the Beninese market",
      "home.hero.text": "Your flexible local shop, online.",
      "home.hero.cta": "See products", "home.hero.cta2": "Explore the Marketplace"
    }
  };
  const lang = () => store.get("lang", "fr");
  function t(key, fr) { const l = lang(); return (l !== "fr" && I18N[l] && I18N[l][key]) || fr; }
  function applyI18n() {
    document.documentElement.lang = lang();
    qsa("[data-i18n]").forEach((el) => {
      if (!el.dataset.fr) el.dataset.fr = el.textContent;
      el.textContent = t(el.dataset.i18n, el.dataset.fr);
    });
    qsa("[data-i18n-ph]").forEach((el) => {
      if (!el.dataset.frPh) el.dataset.frPh = el.placeholder;
      el.placeholder = t(el.dataset.i18nPh, el.dataset.frPh);
    });
  }

  /* ---------------------------------------------------------------------
     Icônes (SVG en ligne)
     --------------------------------------------------------------------- */
  const ICON = {
    logo: '<svg viewBox="0 0 40 32" aria-hidden="true"><rect x="1" y="2" width="38" height="5" rx="1" fill="#cc6e28"/><rect x="4" y="7" width="32" height="3" fill="#b65c1c"/><rect x="5" y="10" width="5" height="21" fill="#cc6e28"/><rect x="30" y="10" width="5" height="21" fill="#cc6e28"/><path d="M13 31V18a7 7 0 0 1 14 0v13h-4V18a3 3 0 0 0-6 0v13z" fill="#cc6e28"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="18" cy="20.5" r="1.3"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    handshake: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2 12l6-5 5 2 4-2 5 2 8 3-3 9-4 1-5 4-4-2-4 1-6-6z"/><path d="M13 9l-4 5 3 2 4-3 5 4"/></svg>',
    truck: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2 8h17v14H2zM19 13h6l4 5v4h-10z"/><circle cx="8" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/></svg>',
    store: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 12l2-7h20l2 7M4 12h24v2a4 4 0 0 1-8 0 4 4 0 0 1-8 0 4 4 0 0 1-8 0zM6 17v11h20V17M13 28v-7h6v7"/></svg>',
    bag: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 10h20l-1.5 18h-17zM11 10V8a5 5 0 0 1 10 0v2"/><path d="M12 16a4 4 0 0 0 8 0"/></svg>',
    chart: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"><path d="M8 54h48M14 54V40h8v14M28 54V32h8v22M42 54V24h8v30M10 30l16-12 10 6 18-14M46 10h8v8"/></svg>',
    box: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"><rect x="10" y="8" width="44" height="48" rx="2"/><path d="M10 32h44M26 8v8h12V8M26 32v8h12v-8"/></svg>',
    clock: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><circle cx="32" cy="32" r="24"/><path d="M32 18v14l9 7"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.2V8H8v3.5h2V22h4V11.5h2.7L17 8z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4.2 2.3 2.3 4.2 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.7 2.1 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.7-.2 5.6-2.1 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.7-2.1-5.6-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M4.5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9h3v12H3zM9 9h3v1.7c.5-.9 1.7-2 3.6-2 3.4 0 4.4 2.1 4.4 5.5V21h-3v-6c0-1.6-.3-3.2-2.2-3.2S12 13.3 12 15v6H9z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.3a6.2 6.2 0 1 0 5.3 6.1V8.6a7.9 7.9 0 0 0 4.4 1.4V6.7A4.5 4.5 0 0 1 16.6 2z"/></svg>'
  };

  /* ---------------------------------------------------------------------
     En-tête et pied de page
     --------------------------------------------------------------------- */
  const PAGE = document.body.dataset.page || "";
  const cur = (p) => (PAGE === p ? ' aria-current="page"' : "");

  function renderHeader() {
    const host = qs("#site-header");
    if (!host) return;
    const catLinks = D.magasinCategories.map((c) => '<li><a href="magasin.html?cat=' + c.id + '">' + c.emoji + " " + esc(c.name) + "</a></li>").join("");
    const shopLinks = D.shopCategories.map((c) => '<li><a href="marketplace.html?cat=' + c.id + '">' + c.emoji + " " + esc(c.name) + "</a></li>").join("");
    host.outerHTML =
      '<a class="skip-link" href="#main">Aller au contenu</a>' +
      '<div class="promo-strip">📍 <span data-i18n="promo">Phase pilote à Cotonou &amp; Abomey-Calavi — livraison le jour même</span> · <a href="livraison.html">Voir les zones</a></div>' +
      '<header class="site-header">' +
      '<div class="container header-main">' +
      '<a class="logo" href="index.html" aria-label="LocalBox — accueil">' + ICON.logo + "LocalBox</a>" +
      '<nav class="main-nav" id="main-nav" aria-label="Navigation principale"><ul>' +
      '<li class="has-sub"><a href="magasin.html"' + cur("magasin") + ' data-i18n="nav.magasin">Magasin</a><ul class="submenu"><li><a href="magasin.html" data-i18n="nav.allProducts">Tous les produits</a></li>' + catLinks + '<li><a href="magasin.html#paniers" data-i18n="nav.bundles">Paniers prêts</a></li></ul></li>' +
      '<li><a href="tokpaexpress.html"' + cur("tokpa") + ' data-i18n="nav.tokpa">TokpaExpress</a></li>' +
      '<li class="has-sub"><a href="marketplace.html"' + cur("marketplace") + ' data-i18n="nav.marketplace">Marketplace</a><ul class="submenu"><li><a href="marketplace.html" data-i18n="nav.allShops">Toutes les boutiques</a></li>' + shopLinks + "</ul></li>" +
      '<li><a href="vendre.html"' + cur("vendre") + ' data-i18n="nav.sell">Vendre sur LocalBox</a></li>' +
      '<li><a href="livraison.html"' + cur("livraison") + ' data-i18n="nav.delivery">Livraison</a></li>' +
      '<li class="has-sub"><a href="a-propos.html"' + cur("a-propos") + ' data-i18n="nav.about">À propos</a><ul class="submenu">' +
      '<li><a href="a-propos.html" data-i18n="nav.story">Notre histoire</a></li><li><a href="blog.html" data-i18n="nav.blog">Blog</a></li><li><a href="fidelite.html" data-i18n="nav.loyalty">Fidélité</a></li><li><a href="a-venir.html" data-i18n="nav.soon">À venir</a></li><li><a href="faq.html" data-i18n="nav.faq">FAQ</a></li><li><a href="contact.html" data-i18n="nav.contact">Contact</a></li></ul></li>' +
      "</ul></nav>" +
      '<div class="header-actions">' +
      '<label class="sr-only" for="lang-select">Langue</label><select class="lang-select" id="lang-select"><option value="fr">FR</option><option value="en">EN</option></select>' +
      '<a class="login-link" id="login-link" href="compte.html" data-i18n="header.login">Se connecter</a>' +
      '<a class="icon-btn" href="compte.html" aria-label="Mon compte">' + ICON.user + "</a>" +
      '<a class="icon-btn" href="panier.html" aria-label="Panier">' + ICON.cart + '<span class="badge" data-cart-count data-count="0">0</span></a>' +
      '<button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="main-nav">' + ICON.menu + "</button>" +
      "</div></div>" +
      '<div class="header-search"><div class="container"><form action="recherche.html" role="search">' +
      '<label class="search-input">' + ICON.search + '<span class="sr-only">Rechercher</span><input type="search" name="q" data-i18n-ph="header.search" placeholder="Rechercher des produits, boutiques, plats…" value="' + esc(param("q") || "") + '"></label>' +
      '<button class="btn btn--primary btn--sm" type="submit" data-i18n="header.searchBtn">Rechercher</button></form></div></div>' +
      "</header>";

    const burger = qs("#burger");
    const nav = qs("#main-nav");
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    const ls = qs("#lang-select");
    ls.value = lang();
    ls.addEventListener("change", () => { store.set("lang", ls.value); applyI18n(); });
  }

  function renderHeaderUser() {
    const u = auth.user();
    const link = qs("#login-link");
    if (!link) return;
    link.dataset.i18n = u ? "header.account" : "header.login";
    link.dataset.fr = u ? "Mon compte" : "Se connecter";
    link.textContent = u ? t("header.account", "Mon compte") : t("header.login", "Se connecter");
  }

  function renderFooter() {
    const host = qs("#site-footer");
    if (!host) return;
    const s = C.social;
    host.outerHTML =
      '<section class="newsletter" aria-labelledby="nl-title"><div class="container">' +
      '<div><h2 id="nl-title" data-i18n="footer.news.title">Le #CarnetDuMarché dans votre boîte</h2><p data-i18n="footer.news.text">Nouveautés, portraits de commerçants et conseils pour consommer local.</p></div>' +
      '<form id="newsletter-form"><label class="sr-only" for="nl-input">E-mail ou WhatsApp</label><input id="nl-input" required data-i18n-ph="footer.news.placeholder" placeholder="Votre e-mail ou numéro WhatsApp"><button class="btn btn--orange" type="submit" data-i18n="footer.news.btn">S\'abonner</button></form>' +
      "</div></section>" +
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><a class="logo" href="index.html">' + ICON.logo + 'LocalBox</a><p>« ' + esc(C.slogan) + " »</p><p class=\"muted\" style=\"color:#a9bdb3\">Plateforme e-commerce hybride pour la modernisation du commerce béninois. " + esc(C.city) + ".</p>" +
      '<div class="socials"><a href="' + s.facebook + '" aria-label="Facebook">' + ICON.facebook + '</a><a href="' + s.instagram + '" aria-label="Instagram">' + ICON.instagram + '</a><a href="' + s.linkedin + '" aria-label="LinkedIn">' + ICON.linkedin + '</a><a href="' + s.youtube + '" aria-label="YouTube">' + ICON.youtube + '</a><a href="' + s.tiktok + '" aria-label="TikTok">' + ICON.tiktok + "</a></div>" +
      '<div class="pay-badges"><span class="pay-logo mtn">MoMo</span><span class="pay-logo moov">Moov</span><span class="pay-logo celtiis">Celtiis</span><span class="pay-logo cash">Cash</span><span class="pay-logo card">Carte</span></div></div>' +
      '<div><h4 data-i18n="footer.buy">Acheter</h4><ul><li><a href="magasin.html">Magasin</a></li><li><a href="magasin.html#paniers">Paniers prêts</a></li><li><a href="marketplace.html">Marketplace</a></li><li><a href="marketplace.html?cat=restaurants">Restaurants</a></li><li><a href="fidelite.html">LocalPoints</a></li></ul></div>' +
      '<div><h4 data-i18n="footer.pro">Professionnels</h4><ul><li><a href="tokpaexpress.html">TokpaExpress</a></li><li><a href="tokpaexpress.html#espace-pro" data-i18n="footer.proSpace">Espace pro TokpaExpress</a></li><li><a href="vendre.html" data-i18n="footer.openShop">Ouvrir ma boutique</a></li><li><a href="tableau-de-bord.html" data-i18n="footer.dashboard">Tableau de bord vendeur</a></li><li><a href="vendre.html#fournisseurs">Devenir fournisseur</a></li></ul></div>' +
      '<div><h4 data-i18n="footer.help">Aide</h4><ul><li><a href="livraison.html">Livraison &amp; logistique</a></li><li><a href="compte.html#commandes" data-i18n="footer.track">Suivre une commande</a></li><li><a href="retours.html" data-i18n="footer.returns">Retours &amp; réclamations</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h4 data-i18n="footer.company">LocalBox</h4><ul><li><a href="a-propos.html">À propos</a></li><li><a href="blog.html">Blog</a></li><li><a href="a-venir.html">AgroBox &amp; services à venir</a></li><li><a href="mentions-legales.html" data-i18n="footer.legal">Mentions légales</a></li><li><a href="cgu.html" data-i18n="footer.terms">CGU &amp; CGV</a></li><li><a href="confidentialite.html" data-i18n="footer.privacy">Confidentialité</a></li></ul></div>' +
      "</div>" +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " " + esc(C.legalName) + ' · Cotonou, Bénin</span><span data-i18n="footer.demo">Version de démonstration — les données sont enregistrées uniquement sur votre appareil.</span></div>' +
      "</div></footer>" +
      '<a class="wa-float" href="' + waLink(null, "Bonjour LocalBox, j'ai une question.") + '" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">' + ICON.whatsapp + "</a>";

    qs("#newsletter-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const list = store.get("newsletter", []);
      list.push({ contact: qs("#nl-input").value, date: new Date().toISOString() });
      store.set("newsletter", list);
      e.target.reset();
      toast("Merci ! Vous recevrez le prochain #CarnetDuMarché.");
    });
  }

  /* ---------------------------------------------------------------------
     Composants réutilisables
     --------------------------------------------------------------------- */
  function thumb(item) {
    return item.img ? '<img src="' + esc(item.img) + '" alt="" loading="lazy">' : esc(item.emoji || "🛍️");
  }

  function productCard(p) {
    const cat = D.magasinCategories.find((c) => c.id === p.cat);
    return '<article class="card product-card">' +
      '<a class="p-thumb" href="produit.html?id=' + p.id + '" aria-label="' + esc(p.name) + '">' + thumb(p) + (p.popular ? '<span class="pill pill--orange">Populaire</span>' : "") + "</a>" +
      '<div class="card-body"><span class="seller">' + esc(cat ? cat.name : "") + "</span>" +
      '<h3><a href="produit.html?id=' + p.id + '">' + esc(p.name) + "</a></h3>" +
      '<span class="seller">' + esc(p.unit) + " · " + esc(p.origin) + "</span>" +
      '<div class="price-row"><span class="price">' + fmt(p.price) + '</span><button class="add-btn" data-add="magasin" data-id="' + p.id + '" aria-label="Ajouter ' + esc(p.name) + ' au panier">+</button></div>' +
      "</div></article>";
  }

  function shopProductCard(shop, p) {
    return '<article class="card product-card">' +
      '<div class="p-thumb">' + thumb(p) + "</div>" +
      '<div class="card-body"><h3>' + esc(p.name) + '</h3><span class="seller">' + esc(p.unit) + "</span>" +
      '<div class="price-row"><span class="price">' + fmt(p.price) + "</span>" +
      (shop.booking
        ? '<a class="btn btn--orange btn--sm" href="' + waLink(shop.whatsapp, "Bonjour " + shop.name + ", je souhaite réserver : " + p.name) + '" target="_blank" rel="noopener">Réserver</a>'
        : '<button class="add-btn" data-add="shop" data-shop="' + shop.id + '" data-id="' + p.id + '" aria-label="Ajouter ' + esc(p.name) + ' au panier">+</button>') +
      "</div></div></article>";
  }

  function merchantCard(s) {
    const cat = D.shopCategories.find((c) => c.id === s.cat);
    return '<a class="card merchant-card" href="boutique.html?id=' + s.id + '">' +
      '<div class="thumb">' + (s.img ? '<img src="' + esc(s.img) + '" alt="" loading="lazy">' : '<span class="emoji">' + esc(s.emoji) + "</span>") + "</div>" +
      "<h3>" + esc(s.name) + "</h3>" + stars(s.rating) +
      '<span class="meta">' + (cat ? cat.emoji + " " + esc(cat.name) : "") + "</span>" +
      '<span class="meta">Articles : ' + s.products.length + "</span>" +
      '<span class="city">' + esc(s.district) + ", " + esc(s.city) + "</span>" +
      '<span style="margin-top:8px">' + openBadge(s.hours) + "</span>" +
      "</a>";
  }

  /* Délégation : boutons « ajouter au panier » */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    e.preventDefault();
    cart.add(b.dataset.add, b.dataset.id, parseInt(b.dataset.qty || "1", 10), b.dataset.shop);
  });

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function init() {
    renderHeader();
    renderFooter();
    renderHeaderUser();
    cart.refreshBadge();
    applyI18n();
  }

  window.LB = { C, D, store, fmt, esc, qs, qsa, param, uid, waLink, stars, toast, isOpen, openBadge, findItem, cart, auth, orders, STATUS, t, applyI18n, ICON, productCard, shopProductCard, merchantCard, thumb };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
