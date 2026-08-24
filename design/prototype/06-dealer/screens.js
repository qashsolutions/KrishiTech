/* =============================================================================
   Chunk 06 — Dealer (P1.5). navigation-ia.md §5: D-01…D-07 (D-08 is P2).
   Role palette: indigo/slate (design-system §2.1) via .role-dealer — the
   SEMANTIC layer is untouched (§1). Dealer chrome: top bar + tabs, mic 48dp
   top-right (nav-ia §2). Dealers see aggregate demand plus consented leads
   only — never another farmer's raw diagnosis (nav-ia §5).
   Intervention classes / stages / recommendations are pack-derived →
   placeholders. Product names in stock/orders are the dealer's own entries
   (sample data) — brands are never hardcoded (root CLAUDE.md #9).
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, ic = K.ic, btn = K.btn, appbar = K.appbar,
    packPlaceholder = K.packPlaceholder;

  function dhead(C, title, backGo) {
    var mic = '<button class="abmic" data-act="speak" aria-label="mic">' + ic("mic") + "</button>";
    return appbar(C, title, backGo, C.S.s05.roleDealer, mic);
  }
  function topnav(C, active) {
    var S = C.S, sc = C.sc;
    function tab(key, label, act) {
      return '<button class="tab' + (active === key ? " on" : "") + " " + sc + '" ' + act + ">" + esc(label) + "</button>";
    }
    return '<div class="topnav">' +
      tab("demand", S.d.navDemand, 'data-act="goto" data-go="D-01"') +
      tab("leads", S.d.navLeads, 'data-act="goto" data-go="D-03"') +
      tab("counter", S.d.navCounter, 'data-act="goto" data-go="D-05"') +
      tab("more", S.common.navMore, 'data-act="stub" data-note="Dealer settings — later"') +
      "</div>";
  }
  function agedCard(C) {
    return '<div class="card neutral"><div class="row">' + ic("cloudOff") +
      '<div class="t-body ' + C.sc + '">' + esc(C.S.f10.offline) + " " + esc(C.S.f10.savedAge) + "</div></div></div>";
  }

  var SCREENS = {};

  SCREENS["D-01"] = {
    name: "Catchment dashboard", off: "◐ cached offline",
    states: ["default", "offline"], exit: "forecast / stock",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function stat(n, label) {
        return '<div class="stattile"><span class="num lang-en">' + n + '</span>' +
          '<span class="t-caption ' + sc + '">' + esc(label) + "</span></div>";
      }
      function crop(label, pct) {
        return '<div class="hbar"><span class="hlabel t-body ' + sc + '">' + esc(label) + "</span>" +
          '<div class="progressbar"><div class="fill" style="width:' + pct + '%"></div></div>' +
          '<span class="t-caption lang-en">' + pct + "%</span></div>";
      }
      return '<div class="scr role-dealer">' + dhead(C, S.d01.title, null) + topnav(C, "demand") +
        (st === "offline" ? agedCard(C) : "") +
        '<div class="statgrid">' + stat(128, S.d01.statFarmers) + stat(17, S.d01.statProblems) + stat(9, S.d01.statVillages) + "</div>" +
        '<div class="t-label ' + sc + '">' + esc(S.d01.cropSplit) + "</div>" +
        crop(S.f03.cropChilli, 62) + crop(S.f03.cropTomato, 27) + crop(S.f03.cropOkra, 11) +
        '<div class="t-label ' + sc + '">' + esc(S.d01.stages) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — stages & problems from crop packs + aggregation") +
        '<button class="srow" data-act="goto" data-go="D-02">' + ic("history") + '<span class="grow t-body ' + sc + '">' + esc(S.d02.title) + "</span>" + ic("next") + "</button>" +
        '<button class="srow" data-act="goto" data-go="D-07">' + ic("photo") + '<span class="grow t-body ' + sc + '">' + esc(S.d07.title) + "</span>" + ic("next") + "</button></div>";
    }
  };

  SCREENS["D-02"] = {
    name: "Demand forecast", off: "◐ cached offline",
    states: ["default", "offline"], exit: "back to catchment",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function row(n, pct) {
        return '<div class="hbar"><span class="hlabel"><span class="ptag lang-en">PLACEHOLDER · ' + n + "</span></span>" +
          '<div class="progressbar"><div class="fill" style="width:' + pct + '%"></div></div></div>';
      }
      return '<div class="scr role-dealer">' + dhead(C, S.d02.title, "D-01") + topnav(C, "demand") +
        (st === "offline" ? agedCard(C) : "") +
        '<div class="t-body muted ' + sc + '">' + esc(S.d02.window) + "</div>" +
        row(1, 78) + row(2, 52) + row(3, 34) + row(4, 15) +
        '<div class="t-caption muted ' + sc + '">' + esc(C.S.common.packPending) + "</div></div>";
    }
  };

  SCREENS["D-03"] = {
    name: "Leads", off: "◐ cached offline",
    states: ["default", "empty"], exit: "open lead",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      if (st === "empty") {
        return '<div class="scr role-dealer">' + dhead(C, S.d.navLeads, null) + topnav(C, "leads") +
          '<div class="card neutral"><div class="row">' + ic("people") +
          '<div class="t-body ' + sc + '">' + esc(S.d03.emptyBody) + "</div></div></div></div>";
      }
      function lead(name, village) {
        return '<button class="card" style="width:100%;text-align:left" data-act="goto" data-go="D-04"><div class="row">' + ic("person") +
          '<div class="grow" style="flex:1"><div class="t-label ' + sc + '">' + esc(name) + '</div>' +
          '<div class="t-caption muted lang-en">' + esc(village) + "</div>" +
          '<span class="ptag lang-en">PLACEHOLDER — agronomic reason</span></div>' +
          '<div class="pstate">' + ic("check") + '<span class="t-caption ' + sc + '">' + esc(S.d03.consented) + "</span></div>" + ic("next") + "</div></button>";
      }
      return '<div class="scr role-dealer">' + dhead(C, S.d.navLeads, null) + topnav(C, "leads") +
        lead(S.s24.sampleName, "Duggondi") + lead(S.d.name2, "Atmakur") + lead(S.d.name3, "Parkal") + "</div>";
    }
  };

  SCREENS["D-04"] = {
    name: "Lead detail", off: "◐ cached offline",
    states: ["default", "offline"], exit: "stock it",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr role-dealer">' + dhead(C, S.d04.title, "D-03") + topnav(C, "leads") +
        (st === "offline" ? agedCard(C) : "") +
        '<div class="card"><div class="row">' + ic("person") +
        '<div><div class="t-label ' + sc + '">' + esc(S.s24.sampleName) + ' · <span class="lang-en">Duggondi</span></div>' +
        '<div class="t-caption muted ' + sc + '">' + esc(S.d03.consented) + "</div></div></div></div>" +
        '<div class="t-label ' + sc + '">' + esc(S.f43.title) + "</div>" +
        '<div class="card"><div class="row">' + ic("leaf") +
        '<div class="t-body ' + sc + '">' + esc(S.f03.cropChilli) + " · " + esc(S.f23a.symptomVal) + " · " + esc(S.f03.sampleDate) + "</div></div></div>" +
        '<div class="t-label ' + sc + '">' + esc(S.d04.rec) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — locked recommendation from the case") +
        '<div class="t-label ' + sc + '">' + esc(S.d04.stock) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — intervention class from input-match") + "</div>";
    }
  };

  SCREENS["D-05"] = {
    name: "Counter mode", off: "◐ 7-day cache",
    states: ["default", "result", "offline"], exit: "log order",
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = dhead(C, S.d.navCounter, null) + topnav(C, "counter");
      var lookup = '<div class="t-body ' + sc + '">' + esc(S.d05.lookup) + "</div>" +
        '<input class="lang-en" inputmode="tel" data-input="counterPhone" value="' + esc(d.counterPhone) + '" placeholder="+91" style="min-height:var(--touch-min);border:1px solid var(--md-outline);border-radius:var(--radius-small);padding:var(--sp-8) var(--sp-12)">' +
        btn(esc(S.d05.search), "d05search", "btn-primary", sc);
      if (st === "default") return '<div class="scr role-dealer">' + head + lookup + "</div>";
      var result =
        '<div class="card"><div class="row">' + ic("person") +
        '<div><div class="t-label ' + sc + '">' + esc(S.s24.sampleName) + '</div>' +
        '<div class="t-caption muted lang-en">+91 98765 43210 · Duggondi</div></div></div></div>' +
        '<div class="t-label ' + sc + '">' + esc(S.d05.current) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — locked recommendation from the case") +
        '<div class="t-caption muted ' + sc + '">' + esc(S.d05.consentNote) + "</div>" +
        btn(esc(S.d06.title), "goto", "btn-primary", sc, 'data-go="D-06"');
      if (st === "offline") {
        return '<div class="scr role-dealer">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") + '<div class="t-body ' + sc + '">' + esc(S.d05.cacheNote) + "</div></div></div>" + result + "</div>";
      }
      return '<div class="scr role-dealer">' + head + result + "</div>";
    }
  };

  SCREENS["D-06"] = {
    name: "Log order", off: "✅ queued offline",
    states: ["default", "queued"], exit: "saved",
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = dhead(C, S.d06.title, "D-05") + topnav(C, "counter");
      if (st === "queued") {
        return '<div class="scr role-dealer">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-label ' + sc + '">' + esc(C.S.f01.queuedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(C.S.f29.queuedBody) + "</div></div></div>" +
          btn(esc(C.S.common.continue_), "goto", "btn-primary", sc, 'data-go="D-05"') + "</div></div>";
      }
      return '<div class="scr role-dealer">' + head +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.d06.product) + '</span>' +
        '<input class="lang-en" data-input="product" value="' + esc(d.product) + '" placeholder="Neem oil 1L"></div>' +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.d06.qty) + '</span>' +
        '<input class="lang-en" inputmode="numeric" data-input="qty" value="' + esc(d.qty) + '" placeholder="2"></div>' +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(C.S.s05.roleFarmer) + '</span>' +
        '<select class="' + sc + '" data-input="orderFarmer"><option>' + esc(S.s24.sampleName) + "</option><option>" + esc(S.d.name2) + "</option><option>" + esc(S.d.name3) + "</option></select></div>" +
        '<div class="footer">' + btn(esc(S.d06.save), "d06save", "btn-primary", sc) + "</div></div>";
    }
  };

  SCREENS["D-07"] = {
    name: "Stock", off: "✅ queued offline",
    states: ["default"], exit: "—",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function row(name, qty, gap) {
        return '<div class="srow">' + ic("photo") +
          '<div class="grow"><div class="t-body lang-en">' + esc(name) + '</div>' +
          '<div class="t-caption muted lang-en">' + esc(qty) + "</div></div>" +
          (gap ? '<span class="sevchip caution" style="font-size:var(--type-caption-size);line-height:var(--type-caption-line);padding:var(--sp-4) var(--sp-12)">' + ic("alert") + esc(S.d07.gap) + "</span>" : "") + "</div>";
      }
      return '<div class="scr role-dealer">' + dhead(C, S.d07.title, "D-01") + topnav(C, "demand") +
        row("Neem oil 1L", "4", true) +
        row("NPK 19-19-19 · 5kg", "26", false) +
        row("Sticky traps · pack of 20", "11", false) +
        '<div class="t-caption muted ' + sc + '">' + esc(S.d07.gapNote) + "</div></div>";
    }
  };

  window.KT.boot({
    subtitle: "06 · Dealer (P1.5) — navigation-ia.md §5: D-01…D-07",
    seq: ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06", "D-07"],
    screens: SCREENS,
    links: {},
    tileData: {},
    freshData: function () {
      return { counterPhone: "", product: "", qty: "", orderFarmer: "" };
    },
    onAct: function (act, el, A) {
      var state = A.state;
      switch (act) {
        case "d05search":
          if (state.offline) A.setSt("offline"); else A.setSt("result");
          return true;
        case "d06save":
          if (state.offline) A.setSt("queued");
          else { A.toast("Order saved (simulated)"); A.go("D-05", "result"); }
          return true;
      }
      return false;
    }
  });
})();
