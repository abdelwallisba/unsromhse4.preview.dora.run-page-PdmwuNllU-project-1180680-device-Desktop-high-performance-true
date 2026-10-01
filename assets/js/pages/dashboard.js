/* ==========================================================================
   Tableau de bord vendeur Marketplace
   - Boutique réelle (créée sur cet appareil) ou boutique de démonstration
   ========================================================================== */
(function () {
  const { C, D, qs, qsa, esc, fmt, param, auth, orders, uid, toast, stars } = LB;
  const host = qs("#dash");
  const user = auth.user();
  const real = !!(user && user.shop);

  /* Boutique de démonstration (Chez Akou) */
  const demoBase = D.shops.find((s) => s.id === "chez-akou");
  const demoShop = {
    id: demoBase.id, name: demoBase.name, cat: demoBase.cat, city: demoBase.city, district: demoBase.district,
    hours: demoBase.hours, prep: demoBase.prep, about: demoBase.about, logistics: true, stats: true,
    createdAt: "2025-08-01T08:00:00Z", trialUntil: null,
    products: demoBase.products.map((p, i) => Object.assign({ stock: [24, 3, 40, 12, 0, 18][i] }, p)),
    orderStatus: {}
  };
  const shop = real ? user.shop : demoShop;
  shop.orderStatus = shop.orderStatus || {};
  shop.products = shop.products || [];

  const save = () => { if (real) { user.shop = shop; auth.save(user); } };

  /* Générateur pseudo-aléatoire déterministe pour les données d'exemple */
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  /* ---------- Commandes ---------- */
  const VSTATUS = ["Nouvelle", "En préparation", "Prête", "Remise au client"];
  const VCLS = ["status--new", "status--prep", "status--ship", "status--done"];

  function vendorOrders() {
    if (!real) {
      const names = ["Mireille A.", "Koffi D.", "Aïcha K.", "Romuald T.", "Chloé B.", "Brice H.", "Nadia S."];
      return Array.from({ length: 7 }, (_, i) => {
        const p = demoShop.products[i % demoShop.products.length], q = 1 + (i % 3);
        return { id: "LB-DEMO" + (101 + i), date: new Date(Date.now() - i * 5.5 * 3600e3).toISOString(), customer: names[i], lines: [{ name: p.name, qty: q, price: p.price }], total: p.price * q, handover: "localbox", zone: ["Akpakpa", "Cadjèhoun", "Fidjrossè", "Calavi"][i % 4], step: shop.orderStatus["LB-DEMO" + (101 + i)] != null ? shop.orderStatus["LB-DEMO" + (101 + i)] : Math.min(3, i) };
      });
    }
    return orders.all().filter((o) => o.status !== "annulee").flatMap((o) => o.groups.filter((g) => g.shop && g.shop.id === shop.id).map((g) => ({
      id: o.id, date: o.createdAt, customer: o.customer.name, lines: g.lines, total: g.lines.reduce((n, l) => n + l.price * l.qty, 0),
      handover: g.handover, zone: o.delivery.district, step: shop.orderStatus[o.id] || 0
    })));
  }

  /* ---------- Séries de ventes ---------- */
  function series() {
    const list = vendorOrders();
    const hasReal = real && list.length > 0;
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5); return { label: d.toLocaleDateString("fr-FR", { weekday: "short" }), key: d.toISOString().slice(0, 10), v: 0 }; });
    if (hasReal || real) {
      list.forEach((o) => { const k = o.date.slice(0, 10); const d = days.find((x) => x.key === k); if (d) d.v += o.total; });
    }
    const example = !hasReal;
    if (example) { seed = 7; days.forEach((d) => (d.v = Math.round((25000 + rnd() * 45000) / 500) * 500)); }
    const weeks = Array.from({ length: 12 }, (_, i) => ({ label: "S" + (i + 1), v: Math.round((150000 + i * 9000 + rnd() * 60000) / 1000) * 1000 }));
    return { days, weeks, example, list };
  }

  function barChart(points, title) {
    const max = Math.max.apply(null, points.map((p) => p.v)) || 1;
    return '<figure style="margin:0"><figcaption class="muted" style="font-size:.85rem;margin-bottom:4px">' + esc(title) + '</figcaption><div class="chart" role="img" aria-label="' + esc(title) + '">' +
      points.map((p) => '<div class="col" tabindex="0"><span class="tip">' + esc(p.label) + " · " + fmt(p.v) + '</span><i style="height:' + Math.max(2, (p.v / max) * 85) + '%"></i><small>' + esc(p.label) + "</small></div>").join("") +
      '</div><details style="margin-top:8px"><summary class="muted" style="cursor:pointer;font-size:.85rem">Voir les données en tableau</summary><table class="table"><thead><tr><th>Période</th><th>Chiffre d\'affaires</th></tr></thead><tbody>' +
      points.map((p) => "<tr><td>" + esc(p.label) + "</td><td>" + fmt(p.v) + "</td></tr>").join("") + "</tbody></table></details></figure>";
  }

  function hbars(rows, unit) {
    const max = Math.max.apply(null, rows.map((r) => r[1])) || 1;
    return rows.map((r) => '<div class="hbar"><span>' + esc(r[0]) + '</span><span class="track"><span class="fill" style="width:' + (r[1] / max) * 100 + '%"></span></span><span>' + r[1] + (unit || "") + "</span></div>").join("");
  }

  /* ---------- Rendu ---------- */
  const PANELS = [["overview", "📊", "Vue d'ensemble"], ["orders", "🧾", "Commandes"], ["products", "📦", "Produits & stock"], ["stats", "📈", "Statistiques avancées"], ["alerts", "🔔", "Alertes"], ["settings", "🏪", "Ma boutique"], ["billing", "💳", "Abonnement"]];

  function render(active) {
    active = active || "overview";
    host.innerHTML =
      '<aside class="dash-side"><div class="who"><strong>' + esc(shop.name) + "</strong><span>" + esc(shop.district) + ", " + esc(shop.city) + "</span>" +
      (real ? "" : '<span style="display:block;margin-top:8px" class="pill pill--orange">Mode démonstration</span>') + "</div><nav>" +
      PANELS.map((p) => '<button data-panel="' + p[0] + '"' + (p[0] === active ? ' class="is-active"' : "") + "><span>" + p[1] + "</span>" + p[2] + "</button>").join("") +
      '</nav><div style="padding:16px 8px 0"><a href="' + (real && shop.products.length ? "boutique.html?id=" + shop.id : "boutique.html?id=chez-akou") + '" style="color:#ffd9a8;font-size:.9rem">Voir ma boutique en ligne →</a></div></aside>' +
      '<div class="dash-main">' +
      (param("welcome") && real ? '<div class="card card-body" style="background:var(--green-100);margin-bottom:18px"><strong>🎉 Bienvenue ' + esc(user.name.split(" ")[0]) + " ! Votre boutique est créée.</strong> Ajoutez vos premiers produits dans « Produits &amp; stock » : elle apparaîtra alors dans la Marketplace. Votre premier mois est offert.</div>" : "") +
      (!real ? '<div class="card card-body" style="background:var(--sand);margin-bottom:18px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center"><span>👀 Vous consultez un <strong>tableau de bord de démonstration</strong>. Créez votre boutique pour gérer vos vraies ventes.</span><a class="btn btn--orange btn--sm" href="vendre.html#inscription">Ouvrir ma boutique</a></div>' : "") +
      '<div id="panel"></div></div>';
    qsa("[data-panel]", host).forEach((b) => b.addEventListener("click", () => render(b.dataset.panel)));
    ({ overview, orders: ordersPanel, products: productsPanel, stats: statsPanel, alerts: alertsPanel, settings: settingsPanel, billing: billingPanel })[active]();
  }
  const panel = (html) => { qs("#panel").innerHTML = html; };

  function overview() {
    const s = series();
    const today = s.days[6].v, week = s.days.reduce((n, d) => n + d.v, 0), month = s.example ? s.weeks.slice(-4).reduce((n, w) => n + w.v, 0) : week;
    const n = s.example ? 46 : s.list.length;
    panel('<h1 style="font-size:1.6rem">Vue d\'ensemble</h1>' + (s.example ? '<p class="muted">Exemple de chiffres : vos données réelles s\'afficheront dès vos premières ventes.</p>' : "") +
      '<div class="kpis"><div class="card kpi"><span>CA aujourd\'hui</span><strong>' + fmt(today) + '</strong></div><div class="card kpi"><span>CA 7 derniers jours</span><strong>' + fmt(week) + '</strong></div><div class="card kpi"><span>CA du mois</span><strong>' + fmt(month) + '</strong></div><div class="card kpi"><span>Commandes</span><strong>' + n + "</strong><em>Panier moyen " + fmt(n ? (s.example ? month / n : week / n) : 0) + "</em></div></div>" +
      '<div class="grid grid-2"><div class="card card-body">' + barChart(s.days, "Chiffre d'affaires — 7 derniers jours") + "</div>" +
      '<div class="card card-body"><h3>Dernières commandes</h3>' + miniOrders(vendorOrders().slice(0, 5)) + '<button class="btn btn--ghost btn--sm" data-go="orders">Toutes les commandes</button></div></div>');
    bindGo();
  }
  function miniOrders(list) {
    if (!list.length) return '<p class="muted">Aucune commande pour le moment.</p>';
    return list.map((o) => '<div class="summary-row" style="border-bottom:1px solid var(--line);padding:10px 0"><span><strong>' + esc(o.customer) + '</strong><br><span class="muted" style="font-size:.85rem">' + o.lines.map((l) => l.qty + "× " + esc(l.name)).join(", ") + '</span></span><span style="text-align:right">' + fmt(o.total) + '<br><span class="status ' + VCLS[o.step] + '">' + VSTATUS[o.step] + "</span></span></div>").join("");
  }
  function bindGo() { qsa("[data-go]", host).forEach((b) => b.addEventListener("click", () => render(b.dataset.go))); }

  function ordersPanel() {
    const list = vendorOrders();
    panel('<h1 style="font-size:1.6rem">Commandes</h1><p class="muted">Une alerte vous prévient à chaque nouvelle commande. Préparez-la dans le délai indiqué (' + esc(shop.prep) + "), puis marquez-la « Prête »" + (shop.logistics ? " : un livreur LocalBox viendra la récupérer." : " et remettez-la au client sur présentation de son code ou QR code.") + "</p>" +
      (list.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>N°</th><th>Date</th><th>Client</th><th>Articles</th><th>Montant</th><th>Remise</th><th>Statut</th><th></th></tr></thead><tbody>' +
        list.map((o) => "<tr><td>" + esc(o.id) + "</td><td>" + new Date(o.date).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) + "</td><td>" + esc(o.customer) + "<br><span class=\"muted\">" + esc(o.zone || "") + "</span></td><td>" + o.lines.map((l) => l.qty + "× " + esc(l.name)).join("<br>") + "</td><td>" + fmt(o.total) + "</td><td>" + ({ localbox: "🛵 LocalBox", retrait: "🏬 Retrait", "mon-livreur": "🛵 Livreur client", vendeur: "🚚 Mon livreur" }[o.handover] || "") + '</td><td><span class="status ' + VCLS[o.step] + '">' + VSTATUS[o.step] + "</span></td><td>" + (o.step < 3 ? '<button class="btn btn--primary btn--sm" data-next="' + esc(o.id) + '">' + ["Accepter", "Marquer prête", "Remise effectuée"][o.step] + "</button>" : "✓") + "</td></tr>").join("") +
        "</tbody></table></div>" : '<div class="empty card"><span class="emoji">🧾</span>Aucune commande pour le moment. Partagez le lien de votre boutique sur WhatsApp pour vous faire connaître !</div>'));
    qsa("[data-next]", host).forEach((b) => b.addEventListener("click", () => {
      const o = list.find((x) => x.id === b.dataset.next);
      shop.orderStatus[o.id] = Math.min(3, o.step + 1);
      save();
      if (shop.orderStatus[o.id] === 3) toast("✅ Commande clôturée. Reçu envoyé au client.");
      ordersPanel();
    }));
  }

  function productsPanel() {
    const cat = D.shopCategories.find((c) => c.id === shop.cat) || D.shopCategories[0];
    panel('<h1 style="font-size:1.6rem">Produits &amp; stock</h1>' +
      '<form class="card card-body form" id="add-product" style="margin-bottom:20px"><h3>Ajouter un produit ou une prestation</h3>' +
      '<div class="form-row"><div class="field"><label for="ap-name">Nom *</label><input class="input" id="ap-name" required></div><div class="field"><label for="ap-unit">Unité / format</label><input class="input" id="ap-unit" placeholder="Ex. : Portion, 1 kg, Pièce"></div></div>' +
      '<div class="form-row"><div class="field"><label for="ap-price">Prix (FCFA) *</label><input class="input" id="ap-price" type="number" min="50" step="50" required></div><div class="field"><label for="ap-stock">Stock disponible</label><input class="input" id="ap-stock" type="number" min="0" value="10"></div></div>' +
      '<div class="form-row"><div class="field"><label for="ap-emoji">Icône (en attendant la photo)</label><input class="input" id="ap-emoji" value="' + cat.emoji + '" maxlength="4"></div><div class="field"><label for="ap-photo">Photo</label><input class="input" id="ap-photo" type="file" accept="image/*"></div></div>' +
      '<button class="btn btn--orange" type="submit">Ajouter</button></form>' +
      (shop.products.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>Produit</th><th>Prix</th><th>Stock</th><th></th></tr></thead><tbody>' +
        shop.products.map((p, i) => "<tr><td>" + esc(p.emoji || "") + " " + esc(p.name) + ' <span class="muted">(' + esc(p.unit || "") + ')</span></td><td><input class="input" type="number" value="' + p.price + '" data-price="' + i + '" style="width:110px"></td><td><input class="input" type="number" min="0" value="' + (p.stock == null ? 10 : p.stock) + '" data-stock="' + i + '" style="width:90px"' + ((p.stock || 0) <= 3 ? ' aria-describedby="low' + i + '"' : "") + ">" + ((p.stock || 0) <= 3 ? ' <span class="stock-low" id="low' + i + '">' + (p.stock ? "Stock bas" : "Rupture") + "</span>" : "") + '</td><td><button class="link-btn" data-del="' + i + '">Supprimer</button></td></tr>').join("") +
        "</tbody></table></div>" : '<div class="empty card"><span class="emoji">📦</span>Ajoutez votre premier produit ci-dessus.</div>'));

    qs("#add-product").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#ap-name").value.trim(), price = +qs("#ap-price").value;
      if (!name || !price) return;
      shop.products.push({ id: uid("P-"), name, unit: qs("#ap-unit").value.trim() || "Pièce", price, stock: +qs("#ap-stock").value || 0, emoji: qs("#ap-emoji").value || "🛍️" });
      save(); toast(real ? "Produit ajouté — visible dans votre boutique." : "Produit ajouté (démonstration)."); productsPanel();
    });
    qsa("[data-price]", host).forEach((inp) => inp.addEventListener("change", () => { shop.products[+inp.dataset.price].price = Math.max(0, +inp.value); save(); toast("Prix mis à jour."); }));
    qsa("[data-stock]", host).forEach((inp) => inp.addEventListener("change", () => { shop.products[+inp.dataset.stock].stock = Math.max(0, +inp.value); save(); productsPanel(); }));
    qsa("[data-del]", host).forEach((b) => b.addEventListener("click", () => { if (confirm("Supprimer ce produit ?")) { shop.products.splice(+b.dataset.del, 1); save(); productsPanel(); } }));
  }

  function statsPanel() {
    if (!shop.stats) {
      panel('<h1 style="font-size:1.6rem">Statistiques avancées</h1><div class="card card-body" style="text-align:center;padding:40px"><div style="font-size:3rem">🔒</div><h2>Pilotez votre activité avec les données</h2><p class="muted" style="max-width:560px;margin:0 auto 18px">Chiffre d\'affaires par période, panier moyen, fidélité de vos clients, produits stars et produits à retirer, zones et heures d\'activité, délais de livraison, alertes automatiques et recommandations.</p><button class="btn btn--orange" id="enable-stats">Activer l\'option (+' + fmt(C.marketplace.options[1].price) + "/mois)</button></div>");
      qs("#enable-stats").addEventListener("click", () => { shop.stats = true; save(); toast("Option statistiques avancées activée."); statsPanel(); });
      return;
    }
    const s = series();
    seed = 11;
    const prods = shop.products.length ? shop.products : demoShop.products;
    const top = prods.map((p) => [p.name, Math.round(5 + rnd() * 60)]).sort((a, b) => b[1] - a[1]);
    panel('<h1 style="font-size:1.6rem">Statistiques avancées</h1>' + (s.example ? '<p class="muted">Données d\'exemple tant que votre boutique n\'a pas assez de ventes.</p>' : "") +
      '<div class="kpis"><div class="card kpi"><span>Panier moyen</span><strong>' + fmt(3850) + '</strong><em>+6 % vs mois dernier</em></div><div class="card kpi"><span>Clients fidèles</span><strong>38 %</strong><em>ont commandé 2 fois ou plus</em></div><div class="card kpi"><span>Annulations</span><strong>2</strong><em style="color:var(--muted)">ce mois-ci</em></div><div class="card kpi"><span>Livrées 1re tentative</span><strong>94 %</strong><em>Délai moyen 52 min</em></div></div>' +
      '<div class="grid grid-2"><div class="card card-body">' + barChart(s.weeks, "Chiffre d'affaires hebdomadaire — 12 dernières semaines") + "</div>" +
      '<div class="card card-body"><h3>Produits les plus vendus</h3>' + hbars(top.slice(0, 5), " ventes") + '<p class="muted" style="font-size:.85rem;margin-top:10px">À améliorer : <strong>' + esc(top[top.length - 1][0]) + "</strong> (moins populaire) — essayez une nouvelle photo ou un prix d'appel.</p></div>" +
      '<div class="card card-body"><h3>Zones des clients</h3>' + hbars([["Akpakpa", 31], ["Cadjèhoun", 24], ["Fidjrossè", 18], ["Abomey-Calavi", 15], ["Autres", 12]], " %") + "</div>" +
      '<div class="card card-body"><h3>Heures les plus actives</h3>' + hbars([["7h – 10h", 22], ["11h – 14h", 35], ["17h – 20h", 33], ["Autres", 10]], " %") + '<p class="muted" style="font-size:.85rem;margin-top:10px">Navigation : 1 240 vues de la boutique ce mois · 2 min 10 s en moyenne · conversion 4,1 %.</p></div>' +
      '<div class="card card-body"><h3>Avis clients</h3><p>' + stars(4.6) + " <strong>4,6</strong> / 5 sur 48 avis</p><p class=\"muted\" style=\"font-size:.9rem\">« Produits très frais, livraison rapide. » — Aïcha K.</p></div>" +
      '<div class="card card-body"><h3>Suivi des livraisons</h3><ul class="spec-list" style="margin:0"><li>Préparation moyenne : 28 min</li><li>Livraison moyenne : 52 min</li><li>Livrées à la 1re tentative : 94 %</li></ul></div></div>');
  }

  function alertsPanel() {
    const low = shop.products.filter((p) => (p.stock || 0) <= 3);
    panel('<h1 style="font-size:1.6rem">Alertes &amp; recommandations</h1><div class="grid" style="gap:12px">' +
      low.map((p) => '<div class="card card-body">⚠️ <strong>' + ((p.stock || 0) === 0 ? "Rupture" : "Stock bas") + " :</strong> " + esc(p.name) + " (" + (p.stock || 0) + " restant" + ((p.stock || 0) > 1 ? "s" : "") + "). Pensez au réassort — ou commandez en gros avec <a href=\"tokpaexpress.html\">TokpaExpress</a>.</div>").join("") +
      '<div class="card card-body">💡 <strong>Recommandation :</strong> les boutiques avec au moins 3 photos réelles vendent davantage. Ajoutez des photos à vos produits.</div>' +
      '<div class="card card-body">📈 <strong>Tendance :</strong> forte demande le samedi matin dans votre zone. Ouvrez plus tôt ce jour-là.</div>' +
      '<div class="card card-body">🏆 <strong>Hall of Fame :</strong> encore 12 ventes pour entrer dans le Top 10 des vendeurs du mois et obtenir le badge.</div>' +
      "</div>");
  }

  function settingsPanel() {
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    panel('<h1 style="font-size:1.6rem">Ma boutique</h1><form class="card card-body form" id="settings" style="max-width:720px">' +
      '<div class="form-row"><div class="field"><label for="st-name">Nom</label><input class="input" id="st-name" value="' + esc(shop.name) + '"></div><div class="field"><label for="st-district">Quartier</label><input class="input" id="st-district" value="' + esc(shop.district) + '"></div></div>' +
      '<fieldset style="border:0;padding:0"><legend><strong>Jours d\'ouverture</strong></legend><div class="faq-cats">' + [1, 2, 3, 4, 5, 6, 0].map((d) => '<label class="check" style="margin-right:10px"><input type="checkbox" value="' + d + '"' + (shop.hours.days.includes(d) ? " checked" : "") + "> " + dayNames[d] + "</label>").join("") + "</div></fieldset>" +
      '<div class="form-row"><div class="field"><label for="st-open">Ouverture</label><input class="input" type="time" id="st-open" value="' + shop.hours.open + '"></div><div class="field"><label for="st-close">Fermeture</label><input class="input" type="time" id="st-close" value="' + shop.hours.close + '"></div></div>' +
      '<div class="field"><label for="st-prep">Délai moyen de préparation</label><input class="input" id="st-prep" value="' + esc(shop.prep) + '"></div>' +
      '<div class="field"><label for="st-about">Présentation</label><textarea class="textarea" id="st-about">' + esc(shop.about || "") + "</textarea></div>" +
      '<label class="check"><input type="checkbox" id="st-log"' + (shop.logistics ? " checked" : "") + "> Option logistique LocalBox (+" + fmt(C.marketplace.options[0].price) + "/mois)</label>" +
      '<p class="muted" style="font-size:.88rem;margin:0">Statut affiché en direct : ' + LB.openBadge(shop.hours) + "</p>" +
      '<button class="btn btn--primary" type="submit">Enregistrer</button></form>');
    qs("#settings").addEventListener("submit", (e) => {
      e.preventDefault();
      shop.name = qs("#st-name").value.trim() || shop.name;
      shop.district = qs("#st-district").value.trim();
      shop.hours = { days: qsa('#settings fieldset input:checked').map((i) => +i.value), open: qs("#st-open").value, close: qs("#st-close").value };
      shop.prep = qs("#st-prep").value.trim();
      shop.about = qs("#st-about").value.trim();
      shop.logistics = qs("#st-log").checked;
      save(); toast("Boutique mise à jour."); render("settings");
    });
  }

  function billingPanel() {
    const M = C.marketplace;
    const total = M.basePrice + (shop.logistics ? M.options[0].price : 0) + (shop.stats ? M.options[1].price : 0);
    const trial = shop.trialUntil && new Date(shop.trialUntil) > new Date();
    panel('<h1 style="font-size:1.6rem">Abonnement</h1><div class="grid grid-2"><div class="card card-body">' +
      '<div class="summary-row"><span>Abonnement de base</span><span>' + fmt(M.basePrice) + "</span></div>" +
      (shop.logistics ? '<div class="summary-row"><span>Option logistique</span><span>' + fmt(M.options[0].price) + "</span></div>" : "") +
      (shop.stats ? '<div class="summary-row"><span>Statistiques avancées</span><span>' + fmt(M.options[1].price) + "</span></div>" : "") +
      '<div class="summary-row total"><span>Mensuel</span><span>' + fmt(total) + "</span></div>" +
      '<p class="muted">Commission sur vos ventes : <strong>0 %</strong>. ' + (trial ? "🎁 Mois offert jusqu'au " + new Date(shop.trialUntil).toLocaleDateString("fr-FR") + "." : "Prochain prélèvement le 1er du mois (Mobile Money).") + "</p></div>" +
      '<div class="card card-body"><h3>Parrainez un commerçant</h3><p class="muted">Partagez votre code : visibilité boostée et réduction sur votre abonnement à chaque inscription.</p><p style="font-family:monospace;font-size:1.2rem;font-weight:800">' + esc((user && user.referral) || "LBDEMO1") + '</p><a class="btn btn--whatsapp btn--sm" target="_blank" rel="noopener" href="' + LB.waLink("", "Ouvre ta boutique sur LocalBox (0 % de commission, 1er mois offert) avec mon code " + ((user && user.referral) || "LBDEMO1")) + '">Partager sur WhatsApp</a></div></div>');
  }

  render();
})();
