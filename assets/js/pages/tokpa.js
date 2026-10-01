/* ==========================================================================
   TokpaExpress — abonnement et espace pro du commerçant
   ========================================================================== */
(function () {
  const { C, D, qs, qsa, esc, fmt, auth, store, uid, toast } = LB;
  const plans = C.tokpa.plans;

  /* Rentabilité d'un article de gros (méthode du dossier) */
  function profit(p) {
    const gross = p.unitMarketPrice * p.units;
    const benefit = gross - p.price;
    return { gross, benefit, margin: (benefit / p.price) * 100, unitCost: p.price / p.units };
  }
  const pct = (n) => n.toFixed(1).replace(".", ",") + " %";

  /* ---------- Abonnements ---------- */
  qs("#plans").innerHTML = plans.map((p) =>
    '<article class="card plan' + (p.featured ? " is-featured" : "") + '">' +
    (p.featured ? '<span class="pill pill--orange">Le plus choisi</span>' : '<span class="pill">Pour démarrer</span>') +
    "<h3>" + esc(p.name) + '</h3><div class="plan-price">' + fmt(p.price) + '<small class="muted" style="font-size:1rem"> / mois</small></div>' +
    "<ul><li><strong>" + p.deliveries + " livraisons</strong> à votre boutique par mois</li><li>Prix de gros du marché, sans marge</li><li>Fiches produit enrichies &amp; comparateur</li><li>Tableau de suivi et alertes de réassort</li><li>Livraison programmable (ex. toutes les 2 semaines)</li></ul>" +
    '<a class="btn ' + (p.featured ? "btn--orange" : "btn--primary") + '" href="#inscription" data-plan="' + p.id + '">Choisir cette formule</a></article>'
  ).join("");
  qs("#extra-fee").textContent = fmt(C.tokpa.extraDeliveryFee);

  qs("#plan-radios").innerHTML = plans.map((p) =>
    '<label class="pay-option"><input type="radio" name="t-plan" value="' + p.id + '"' + (p.featured ? " checked" : "") + "><strong>" + esc(p.name) + "</strong>&nbsp;— " + fmt(p.price) + "/mois · " + p.deliveries + " livraisons</label>"
  ).join("");
  qs("#plans").addEventListener("click", (e) => {
    const a = e.target.closest("[data-plan]");
    if (a) { const r = qs('input[name="t-plan"][value="' + a.dataset.plan + '"]'); if (r) r.checked = true; }
  });

  qs("#sms-number").textContent = C.contact.sms;
  qs("#sms-link").href = "sms:" + C.contact.sms.replace(/\s/g, "") + "?body=" + encodeURIComponent("TOKPA ");

  /* ---------- Inscription ---------- */
  const u0 = auth.user();
  if (u0) { qs("#t-name").value = u0.name || ""; qs("#t-phone").value = u0.phone || ""; }

  qs("#sub-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = qs("#t-msg");
    const req = ["#t-shop", "#t-name", "#t-phone", "#t-address"];
    const miss = req.filter((s) => !qs(s).value.trim());
    if (miss.length) { msg.className = "form-msg is-err"; msg.textContent = "Merci de compléter les champs obligatoires (*)."; qs(miss[0]).focus(); return; }
    const u = auth.login({ name: qs("#t-name").value.trim(), phone: qs("#t-phone").value.trim(), role: "tokpa" });
    const now = new Date().toISOString();
    u.tokpa = {
      shop: qs("#t-shop").value.trim(), type: qs("#t-type").value, address: qs("#t-address").value.trim(),
      planId: qs('input[name="t-plan"]:checked').value, startedAt: now, periodStart: now, used: 0,
      payMethod: qs('input[name="t-pay"]:checked').value, auto: null, stock: {}
    };
    auth.save(u);
    msg.className = "form-msg is-ok";
    msg.textContent = "✅ Abonnement activé ! Votre espace pro est prêt ci-dessous.";
    renderPro();
    setTimeout(() => qs("#espace-pro").scrollIntoView({ behavior: "smooth" }), 400);
  });

  /* ---------- Espace pro ---------- */
  const root = qs("#pro-root");
  const bon = { get: () => store.get("tokpaCart", {}), set: (v) => store.set("tokpaCart", v) };

  function currentSub() {
    const u = auth.user();
    if (!u || !u.tokpa) return null;
    const t = u.tokpa;
    const start = new Date(t.periodStart), now = new Date();
    if (start.getMonth() !== now.getMonth() || start.getFullYear() !== now.getFullYear()) {
      t.periodStart = now.toISOString(); t.used = 0; auth.save(u);
    }
    return { u, t, plan: plans.find((p) => p.id === t.planId) };
  }

  function ficheTable(p) {
    const r = profit(p);
    return '<table class="table" style="margin-top:10px"><tbody>' +
      "<tr><th>Prix d'achat par lot</th><td>" + fmt(p.price) + "</td></tr>" +
      "<tr><th>Nombre d'unités</th><td>" + p.units + " " + esc(p.unitLabel) + "</td></tr>" +
      "<tr><th>Coût unitaire</th><td>" + fmt(r.unitCost) + "</td></tr>" +
      "<tr><th>Prix moyen unitaire sur le marché</th><td>" + fmt(p.unitMarketPrice) + "</td></tr>" +
      "<tr><th>Revenu brut potentiel</th><td>" + fmt(p.unitMarketPrice) + " × " + p.units + " = <strong>" + fmt(r.gross) + "</strong></td></tr>" +
      "<tr><th>Bénéfice potentiel</th><td>" + fmt(r.gross) + " − " + fmt(p.price) + " = <strong>" + fmt(r.benefit) + "</strong></td></tr>" +
      "<tr><th>Marge bénéficiaire</th><td><strong style=\"color:var(--green)\">" + pct(r.margin) + "</strong></td></tr>" +
      "</tbody></table>";
  }

  function catalogue(readOnly) {
    const cart = bon.get();
    return '<div class="grid grid-3">' + D.wholesale.map((p) => {
      const r = profit(p);
      return '<article class="card"><div class="card-body">' +
        '<div style="display:flex;gap:12px;align-items:center"><span style="font-size:2.4rem">' + p.emoji + '</span><div><span class="pill">' + esc(p.cat) + '</span><h3 style="margin:6px 0 0;font-size:1rem">' + esc(p.name) + "</h3></div></div>" +
        '<div class="summary-row" style="margin-top:10px"><span class="price">' + fmt(p.price) + '</span><span class="pill" title="Marge potentielle">📈 ' + pct(r.margin) + "</span></div>" +
        '<p class="muted" style="font-size:.85rem;margin:4px 0">' + esc(p.weight) + " · Bénéfice potentiel " + fmt(r.benefit) + "</p>" +
        '<details><summary style="cursor:pointer;font-weight:600;color:var(--green)">Fiche produit enrichie</summary>' + ficheTable(p) + '<p class="muted" style="font-size:.85rem">💡 ' + esc(p.tips) + "</p></details>" +
        (readOnly ? "" : '<div class="buy-row" style="margin:12px 0 0"><div class="qty"><button data-tdec="' + p.id + '" aria-label="Diminuer">−</button><span>' + (cart[p.id] || 0) + '</span><button data-tinc="' + p.id + '" aria-label="Augmenter">+</button></div><span class="muted">lot(s)</span></div>') +
        "</div></article>";
    }).join("") + "</div>";
  }

  function renderPro() {
    const sub = currentSub();
    if (!sub) {
      root.innerHTML = '<div class="section-head"><div><p class="eyebrow">Espace pro TokpaExpress</p><h2>Aperçu du catalogue de gros</h2></div><a class="btn btn--orange" href="#inscription">S\'abonner pour commander</a></div>' +
        '<p class="muted">Chaque fiche affiche le prix par lot, le nombre d\'unités, le prix moyen de revente sur le marché, le bénéfice et la marge potentiels. Exemple : un carton de sardines à 15 000 FCFA (50 boîtes revendues 550 FCFA) rapporte 27 500 FCFA, soit 12 500 FCFA de bénéfice et 83,3 % de marge.</p>' +
        catalogue(true);
      return;
    }
    const { u, t, plan } = sub;
    const left = Math.max(0, plan.deliveries - t.used);
    const history = store.get("tokpaOrders", []);
    const renew = new Date(new Date(t.periodStart).getFullYear(), new Date(t.periodStart).getMonth() + 1, 1);
    const months = Math.floor((Date.now() - new Date(t.startedAt).getTime()) / (30 * 864e5));

    root.innerHTML =
      '<div class="section-head"><div><p class="eyebrow">Espace pro TokpaExpress</p><h2>' + esc(t.shop) + '</h2><p class="muted" style="margin:0">' + esc(t.type) + " · " + esc(t.address) + "</p></div>" +
      (months >= 12 ? '<span class="pill pill--orange">💳 Membre TokpaPro</span>' : '<span class="pill pill--grey">TokpaPro dans ' + (12 - months) + " mois</span>") + "</div>" +
      '<div class="kpis">' +
      '<div class="card kpi"><span>Formule</span><strong>' + esc(plan.name.replace("TokpaExpress ", "")) + "</strong><em>" + fmt(plan.price) + "/mois</em></div>" +
      '<div class="card kpi"><span>Livraisons restantes</span><strong>' + left + " / " + plan.deliveries + '</strong><em style="color:' + (left ? "var(--success)" : "var(--danger)") + '">Ce mois-ci</em></div>' +
      '<div class="card kpi"><span>Commandes passées</span><strong>' + history.length + "</strong><em>Depuis l'inscription</em></div>" +
      '<div class="card kpi"><span>Renouvellement</span><strong style="font-size:1.1rem">' + renew.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) + "</strong><em>Quota remis à zéro</em></div></div>" +
      '<div class="tabs" role="tablist">' + [["cmd", "🛒 Commander"], ["rent", "📊 Rentabilité & comparateur"], ["hist", "🧾 Historique"], ["stock", "📦 Stock & alertes"], ["abo", "⚙️ Abonnement"]].map((x, i) => '<button role="tab" data-tab="' + x[0] + '"' + (i === 0 ? ' class="is-active"' : "") + ">" + x[1] + "</button>").join("") + "</div>" +
      '<div class="tab-panel is-active" data-panel="cmd"><div class="cart-layout"><div>' + catalogue(false) + '</div><div id="bon"></div></div></div>' +
      '<div class="tab-panel" data-panel="rent">' + comparator() + "</div>" +
      '<div class="tab-panel" data-panel="hist">' + historyTable(history) + "</div>" +
      '<div class="tab-panel" data-panel="stock">' + stockPanel(t) + "</div>" +
      '<div class="tab-panel" data-panel="abo">' + aboPanel(t, plan) + "</div>";

    qsa("[data-tab]", root).forEach((b) => b.addEventListener("click", () => {
      qsa("[data-tab]", root).forEach((x) => x.classList.toggle("is-active", x === b));
      qsa("[data-panel]", root).forEach((p) => p.classList.toggle("is-active", p.dataset.panel === b.dataset.tab));
    }));
    renderBon(left);
    bindComparator();
    bindStock();
    bindAbo();
  }

  function renderBon(left) {
    const cart = bon.get();
    const lines = Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => ({ p: D.wholesale.find((x) => x.id === id), q })).filter((l) => l.p);
    const total = lines.reduce((n, l) => n + l.p.price * l.q, 0);
    const extra = left === 0 ? C.tokpa.extraDeliveryFee : 0;
    const today = new Date();
    const dates = [1, 2, 3, 4, 5].map((n) => { const d = new Date(today.getTime() + n * 864e5); return '<option value="' + d.toISOString().slice(0, 10) + '">' + d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }) + "</option>"; }).join("");
    qs("#bon").innerHTML = '<div class="card card-body summary"><h3>Bon de commande</h3>' +
      (lines.length ? lines.map((l) => '<div class="summary-row"><span>' + l.q + " × " + esc(l.p.name) + "</span><span>" + fmt(l.p.price * l.q) + "</span></div>").join("") : '<p class="muted">Ajoutez des lots depuis le catalogue.</p>') +
      '<div class="summary-row"><span>Livraison</span><span>' + (extra ? fmt(extra) + " (hors quota)" : "Incluse (" + left + " restante" + (left > 1 ? "s" : "") + ")") + "</span></div>" +
      '<div class="summary-row total"><span>Total marchandises</span><span>' + fmt(total + extra) + "</span></div>" +
      '<div class="form" style="margin-top:12px"><div class="field"><label for="b-date">Date de livraison</label><select class="select" id="b-date">' + dates + '</select></div>' +
      '<div class="field"><label for="b-slot">Créneau</label><select class="select" id="b-slot"><option>7h – 10h</option><option>10h – 13h</option><option>14h – 17h</option></select></div>' +
      '<label class="check"><input type="checkbox" id="b-auto"> Répéter automatiquement toutes les 2 semaines</label>' +
      '<div class="field"><label for="b-pay">Paiement des marchandises</label><select class="select" id="b-pay"><option>À la livraison</option><option>MTN MoMo</option><option>Moov Money</option><option>Celtiis Cash</option></select></div>' +
      '<button class="btn btn--orange btn--block" id="b-send"' + (lines.length ? "" : " disabled") + ">Envoyer la commande</button></div></div>";

    const send = qs("#b-send");
    if (send) send.addEventListener("click", async () => {
      const sub = currentSub();
      if (!sub) return;
      if (left === 0 && !(await LB.ask("Votre quota mensuel est épuisé. Cette livraison sera facturée " + fmt(C.tokpa.extraDeliveryFee) + ". Continuer ?", "Commander"))) return;
      const order = { id: uid("TX-"), createdAt: new Date().toISOString(), lines: lines.map((l) => ({ id: l.p.id, name: l.p.name, qty: l.q, price: l.p.price })), total: total + extra, date: qs("#b-date").value, slot: qs("#b-slot").value, auto: qs("#b-auto").checked, pay: qs("#b-pay").value, pin: String(Math.floor(1000 + Math.random() * 9000)), status: "Confirmée" };
      store.set("tokpaOrders", [order].concat(store.get("tokpaOrders", [])));
      const { u, t } = sub;
      t.used += 1;
      if (order.auto) t.auto = { every: 14, from: order.date };
      lines.forEach((l) => { t.stock[l.p.id] = t.stock[l.p.id] || { bought: 0, sold: 0 }; t.stock[l.p.id].bought += l.q; });
      auth.save(u);
      auth.addPoints(Math.floor(order.total / 1000) * C.points.perThousand, "TokpaExpress " + order.id);
      bon.set({});
      toast("✅ Commande " + order.id + " envoyée. Code PIN de réception : " + order.pin);
      renderPro();
    });
  }

  root.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-tinc]"), dec = e.target.closest("[data-tdec]");
    if (!inc && !dec) return;
    const id = (inc || dec).dataset.tinc || (inc || dec).dataset.tdec;
    const cart = bon.get();
    cart[id] = Math.max(0, (cart[id] || 0) + (inc ? 1 : -1));
    bon.set(cart);
    (inc || dec).parentElement.querySelector("span").textContent = cart[id];
    const sub = currentSub();
    renderBon(Math.max(0, sub.plan.deliveries - sub.t.used));
  });

  function comparator() {
    const opts = D.wholesale.map((p) => '<option value="' + p.id + '">' + esc(p.name) + "</option>").join("");
    const ranked = D.wholesale.slice().sort((a, b) => profit(b).margin - profit(a).margin);
    return '<div class="grid grid-2"><div class="card card-body"><h3>Comparateur intelligent</h3><div class="form-row"><div class="field"><label for="cmp-a">Produit A</label><select class="select" id="cmp-a">' + opts + '</select></div><div class="field"><label for="cmp-b">Produit B</label><select class="select" id="cmp-b">' + opts + '</select></div></div><div id="cmp-out"></div></div>' +
      '<div class="card card-body"><h3>Classement par marge potentielle</h3><div class="table-wrap"><table class="table"><thead><tr><th>Produit</th><th>Bénéfice / lot</th><th>Marge</th></tr></thead><tbody>' +
      ranked.map((p, i) => "<tr><td>" + (i < 3 ? "🔥 " : "") + esc(p.name) + "</td><td>" + fmt(profit(p).benefit) + "</td><td><strong>" + pct(profit(p).margin) + "</strong></td></tr>").join("") +
      '</tbody></table></div><p class="muted" style="font-size:.85rem">Les prix moyens de revente sont mis à jour à partir des relevés de nos agents sur les marchés. L\'historique d\'évolution des prix s\'affichera au fil des mois.</p></div></div>';
  }
  function bindComparator() {
    const a = qs("#cmp-a"), b = qs("#cmp-b");
    if (!a) return;
    b.selectedIndex = 1;
    const run = () => {
      const pa = D.wholesale.find((x) => x.id === a.value), pb = D.wholesale.find((x) => x.id === b.value);
      const ra = profit(pa), rb = profit(pb);
      const best = ra.margin >= rb.margin ? pa : pb;
      const row = (l, x, y) => "<tr><th>" + l + "</th><td>" + x + "</td><td>" + y + "</td></tr>";
      qs("#cmp-out").innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th></th><th>' + esc(pa.name) + "</th><th>" + esc(pb.name) + "</th></tr></thead><tbody>" +
        row("Prix du lot", fmt(pa.price), fmt(pb.price)) + row("Unités", pa.units + " " + pa.unitLabel, pb.units + " " + pb.unitLabel) +
        row("Revenu brut", fmt(ra.gross), fmt(rb.gross)) + row("Bénéfice", fmt(ra.benefit), fmt(rb.benefit)) + row("Marge", pct(ra.margin), pct(rb.margin)) +
        '</tbody></table></div><p style="margin:12px 0 0">💡 Le plus rentable à stocker : <strong>' + esc(best.name) + "</strong></p>";
    };
    a.addEventListener("change", run); b.addEventListener("change", run); run();
  }

  function historyTable(history) {
    if (!history.length) return '<div class="empty card"><span class="emoji">🧾</span>Aucune commande pour le moment.</div>';
    return '<div class="table-wrap"><table class="table"><thead><tr><th>N°</th><th>Date</th><th>Articles</th><th>Livraison</th><th>Montant</th><th>Code PIN</th><th>Statut</th></tr></thead><tbody>' +
      history.map((o) => "<tr><td>" + esc(o.id) + "</td><td>" + new Date(o.createdAt).toLocaleDateString("fr-FR") + "</td><td>" + o.lines.map((l) => l.qty + "× " + esc(l.name)).join("<br>") + "</td><td>" + esc(o.date) + " · " + esc(o.slot) + (o.auto ? "<br>🔁 toutes les 2 sem." : "") + "</td><td>" + fmt(o.total) + "</td><td><strong>" + o.pin + '</strong></td><td><span class="status status--new">' + esc(o.status) + "</span></td></tr>").join("") +
      "</tbody></table></div>";
  }

  function stockPanel(t) {
    const ids = Object.keys(t.stock || {});
    const hot = D.wholesale.slice().sort((a, b) => profit(b).margin - profit(a).margin)[0];
    const rows = ids.map((id) => {
      const p = D.wholesale.find((x) => x.id === id); const s = t.stock[id];
      const rest = s.bought - s.sold;
      return "<tr><td>" + p.emoji + " " + esc(p.name) + "</td><td>" + s.bought + "</td><td><input class=\"input\" type=\"number\" min=\"0\" max=\"" + s.bought + "\" value=\"" + s.sold + "\" data-sold=\"" + id + "\" style=\"width:90px\"></td><td" + (rest <= 1 ? ' class="stock-low"' : "") + ">" + rest + "</td><td>" + fmt(rest * p.price) + "</td></tr>";
    }).join("");
    const alerts = ids.filter((id) => t.stock[id].bought - t.stock[id].sold <= 1).map((id) => {
      const p = D.wholesale.find((x) => x.id === id);
      return '<li>⚠️ <strong>Re-stock :</strong> ' + esc(p.name) + " approche de la rupture (marge " + pct(profit(p).margin) + ").</li>";
    }).join("");
    return '<div class="grid grid-2"><div class="card card-body"><h3>Tableau de suivi personnalisé</h3>' +
      (ids.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>Produit</th><th>Lots achetés</th><th>Lots vendus</th><th>En stock</th><th>Valeur</th></tr></thead><tbody>' + rows + "</tbody></table></div><p class=\"muted\" style=\"font-size:.85rem\">Renseignez vos ventes pour suivre la valeur de votre stock et anticiper les ruptures.</p>" : '<p class="muted">Vos produits apparaîtront ici après votre première commande.</p>') +
      '</div><div class="card card-body"><h3>Alertes &amp; recommandations</h3><ul style="padding-left:18px;margin:0;display:grid;gap:8px">' + (alerts || "<li>✅ Aucun produit en risque de rupture.</li>") +
      '<li>🔥 <strong>Produit chaud :</strong> ' + esc(hot.name) + " est très demandé par les autres commerçants ce mois-ci.</li>" +
      "<li>📉 Nous vous préviendrons si un produit perd en rentabilité ou s'écoule moins vite.</li></ul></div></div>";
  }
  function bindStock() {
    qsa("[data-sold]", root).forEach((inp) => inp.addEventListener("change", () => {
      const sub = currentSub();
      const s = sub.t.stock[inp.dataset.sold];
      s.sold = Math.max(0, Math.min(s.bought, parseInt(inp.value || "0", 10)));
      auth.save(sub.u);
      qs('[data-panel="stock"]', root).innerHTML = stockPanel(sub.t);
      bindStock();
    }));
  }

  function aboPanel(t, plan) {
    return '<div class="grid grid-2"><div class="card card-body"><h3>Mon abonnement</h3><p>Formule actuelle : <strong>' + esc(plan.name) + "</strong> — " + fmt(plan.price) + "/mois, " + plan.deliveries + " livraisons.</p>" +
      "<p class=\"muted\">Abonné depuis le " + new Date(t.startedAt).toLocaleDateString("fr-FR") + ".</p>" +
      '<div class="field"><label for="abo-plan">Changer de formule</label><select class="select" id="abo-plan">' + plans.map((p) => '<option value="' + p.id + '"' + (p.id === plan.id ? " selected" : "") + ">" + esc(p.name) + " — " + fmt(p.price) + "</option>").join("") + "</select></div>" +
      '<div class="hero-ctas" style="margin-top:12px"><button class="btn btn--primary btn--sm" id="abo-save">Enregistrer</button><button class="btn btn--ghost btn--sm" id="abo-stop" style="color:var(--danger)">Résilier</button></div></div>' +
      '<div class="card card-body"><h3>Livraison automatique</h3>' + (t.auto ? "<p>🔁 Active : toutes les " + t.auto.every + " jours à partir du " + esc(t.auto.from) + '.</p><button class="btn btn--ghost btn--sm" id="auto-stop">Désactiver</button>' : '<p class="muted">Aucune livraison automatique. Cochez « Répéter toutes les 2 semaines » lors de votre prochaine commande.</p>') +
      '<h3 style="margin-top:18px">Besoin d\'aide ?</h3><a class="btn btn--whatsapp btn--sm" target="_blank" rel="noopener" href="' + LB.waLink(null, "Bonjour, je suis abonné TokpaExpress (" + t.shop + ").") + '">Hotline TokpaExpress</a></div></div>';
  }
  function bindAbo() {
    const save = qs("#abo-save");
    if (!save) return;
    save.addEventListener("click", () => { const s = currentSub(); s.t.planId = qs("#abo-plan").value; auth.save(s.u); toast("Formule mise à jour."); renderPro(); });
    qs("#abo-stop").addEventListener("click", async () => {
      if (!(await LB.ask("Résilier votre abonnement TokpaExpress ?", "Résilier"))) return;
      const s = currentSub(); s.u.tokpa = null; s.u.role = "client"; auth.save(s.u); toast("Abonnement résilié."); renderPro();
    });
    const as = qs("#auto-stop");
    if (as) as.addEventListener("click", () => { const s = currentSub(); s.t.auto = null; auth.save(s.u); renderPro(); });
  }

  renderPro();
})();
