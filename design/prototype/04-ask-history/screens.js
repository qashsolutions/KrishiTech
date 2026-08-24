/* =============================================================================
   Chunk 04 — Ask & history + Images & storage.
   navigation-ia.md §4: F-40…F-43, F-50…F-53. Framework: ../shared/proto.js.
   Answers are agronomic content → marked placeholders (root CLAUDE.md #5).
   F-52's destructive confirm uses statusUrgent — its one sanctioned use
   outside severity (design-system §2.3). Full-res photos are deleted;
   a thumbnail stays so case history never breaks (nav-ia §4).
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, ic = K.ic, btn = K.btn, loadrow = K.loadrow,
    offlineCard = K.offlineCard, appbar = K.appbar, packPlaceholder = K.packPlaceholder;

  var SCREENS = {};

  function qCard(C) {
    var sc = C.sc, S = C.S;
    var text = C.data.showEnglish
      ? '<div class="t-bodylarge lang-en">' + esc(S.f40.englishQ) + "</div>"
      : '<div class="t-bodylarge ' + sc + '">' + esc(S.f40.sampleQ) + "</div>";
    return '<div class="transcript"><span class="flabel ' + sc + '">' + esc(S.f40.yourQ) + "</span>" + text +
      '<button class="engtoggle' + (C.data.showEnglish ? " on" : "") + '" data-act="engtoggle">' +
      '<span class="knob"></span><span class="t-caption ' + sc + '">' + esc(S.f22.toEnglish) + "</span></button></div>";
  }
  function thumb(C, i, extra, dateStr) {
    return '<div class="thumb ' + (extra || "") + '" data-act="' + (extra === "empty" ? "none" : "thumbtap") + '" data-idx="' + i + '">' +
      (extra === "empty" ? "" : ic("leaf") + '<span class="tdate ' + C.sc + '">' + esc(dateStr || C.S.f03.sampleDate) + "</span>") + "</div>";
  }

  SCREENS["F-40"] = {
    name: "Ask agent", off: "✕ needs signal",
    states: ["default", "listening", "review", "offline"], exit: "question sent",
    nav: true, mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    micState: function (st, C) {
      if (st === "listening") return { cls: "listening", label: C.S.f03.listening };
      return null;
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f10.ask, null);
      if (st === "offline") {
        return '<div class="scr withnav">' + head + offlineCard(C, S.f40.offline, "f40retry") +
          btn(esc(C.S.common.navHistory), "goto", "btn-outline", sc, 'data-go="F-42"') + "</div>";
      }
      if (st === "review") {
        return '<div class="scr withnav">' + head + qCard(C) +
          btn(esc(S.f40.send), "f40send", "btn-primary", sc) +
          btn(esc(S.f03.readbackAgain), "f40again", "btn-outline", sc) + "</div>";
      }
      var listening = st === "listening"
        ? '<div class="iconline" style="justify-content:center;color:var(--md-primary)">' + ic("mic") +
          '<span class="t-label ' + sc + '">' + esc(S.f03.listening) + "</span></div>"
        : "";
      return '<div class="scr withnav">' + head +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f40.prompt) + "</div>" + listening + "</div>";
    }
  };

  SCREENS["F-41"] = {
    name: "Answer", off: "◐ replay cached",
    states: ["loading", "default", "offline"], exit: "history tab",
    nav: true, mic: true,
    entrySt: function (A) {
      if (A.state.offline) return "offline";
      return A.data.ansLoaded ? "default" : "loading";
    },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1500, function () { A.data.ansLoaded = true; A.setSt("default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f25.title, "F-40");
      if (st === "loading") return '<div class="scr withnav">' + head + loadrow(S.f41.loading, sc) + "</div>";
      var offlineNote = st === "offline"
        ? '<div class="card neutral"><div class="row">' + ic("cloudOff") + '<div class="t-body ' + sc + '">' + esc(S.f41.offline) + "</div></div></div>"
        : "";
      return '<div class="scr withnav">' + head + offlineNote + qCard(C) +
        packPlaceholder(C, "PLACEHOLDER — answer from weather agent + crop pack") +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.hearAgain) + "</button>" +
        (st === "default" ? btn(esc(S.f41.askAnother), "f41another", "btn-outline", sc) : "") +
        btn(esc(C.S.common.navHistory), "goto", "btn-text", sc, 'data-go="F-42"') + "</div>";
    }
  };

  SCREENS["F-42"] = {
    name: "Case history", off: "✅ works offline",
    states: ["default", "empty"], exit: "open case",
    nav: "history", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, C.S.common.navHistory, null);
      if (st === "empty") {
        return '<div class="scr withnav">' + head +
          '<div class="card neutral"><div class="row">' + ic("photo") +
          '<div><div class="t-label ' + sc + '">' + esc(S.f42.emptyTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f42.emptyBody) + "</div></div></div></div>" +
          btn(esc(S.f10.report), "navx", "btn-primary", sc, 'data-target="F-20" data-dir="03-report-problem"') +
          btn(esc(S.f10.ask), "goto", "btn-outline", sc, 'data-go="F-40"') + "</div>";
      }
      function row(icn, title, capt, chipHtml, act) {
        return '<button class="card" style="width:100%;text-align:left" ' + act + '><div class="row">' + ic(icn) +
          '<div class="grow" style="flex:1"><div class="t-label ' + sc + '">' + esc(title) + '</div>' +
          '<div class="t-caption muted ' + sc + '">' + capt + "</div></div>" + chipHtml + ic("next") + "</div></button>";
      }
      var better = '<div class="pstate">' + ic("check") + '<span class="t-caption ' + sc + '">' + esc(S.f30.better) + "</span></div>";
      var open = '<div class="pstate off"><span class="t-caption ' + sc + '">' + esc(S.f42.statusOpen) + "</span></div>";
      return '<div class="scr withnav">' + head +
        row("photo", S.f23a.symptomVal, esc(S.f03.sampleDate) + " · " + esc(S.f03.cropChilli), open, 'data-act="goto" data-go="F-43"') +
        row("chat", S.f40.sampleQ, esc(S.f03.sampleDate), "", 'data-act="goto" data-go="F-41"') +
        row("photo", S.f42.case2, esc(S.f42.date2) + " · " + esc(S.f03.cropTomato), better, 'data-act="goto" data-go="F-43"') +
        "</div>";
    }
  };

  SCREENS["F-43"] = {
    name: "Case detail", off: "✅ works offline",
    states: ["default"], exit: "→ images", nav: "history", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f43.title + " · " + S.f42.date2, "F-42");
      var thumbs = '<div class="thumbgrid">' + thumb(C, 0, "", S.f42.date2) + thumb(C, 1, "", S.f42.date2) + thumb(C, 2, "", S.f42.date2) + "</div>";
      return '<div class="scr withnav">' + head +
        '<div class="card"><div class="row">' + ic("leaf") +
        '<div><div class="t-title ' + sc + '">' + esc(S.f03.cropTomato) + '</div>' +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f42.case2) + "</div></div></div></div>" +
        '<div class="t-label ' + sc + '">' + esc(S.f43.photos) + "</div>" + thumbs +
        '<div class="t-label ' + sc + '">' + esc(S.f43.advised) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — from the case record") +
        '<div class="t-label ' + sc + '">' + esc(S.f43.happened) + "</div>" +
        '<div class="card"><div class="row"><div class="pstate">' + ic("check") + '<span class="t-label ' + sc + '">' + esc(S.f30.better) + "</span></div></div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f52.keepNote) + "</div></div>" +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.listen) + "</button></div>";
    }
  };

  SCREENS["F-50"] = {
    name: "My images", off: "✅ works offline",
    states: ["default", "full"], exit: "when full →", nav: true, mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f50.title, null);
      var full = st === "full";
      var n = full ? 10 : 7;
      var tiles = "";
      for (var i = 0; i < 10; i++) {
        tiles += i < n ? thumb(C, i, "", i < 3 ? S.f42.date2 : S.f03.sampleDate) : thumb(C, i, "empty");
      }
      return '<div class="scr withnav">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(full ? S.f50.used10 : S.f50.used7) + "</div>" +
        '<div class="thumbgrid">' + tiles + "</div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f50.longpress) + "</div>" +
        '<div class="footer">' +
        btn(esc(S.f50.freeUp), "goto", full ? "btn-primary" : "btn-outline", sc, 'data-go="F-52"') +
        btn(esc(S.f50.buyMore), "goto", "btn-outline", sc, 'data-go="F-53"') + "</div></div>";
    }
  };

  SCREENS["F-51"] = {
    name: "Storage full prompt", off: "◐ partial offline",
    states: ["default"], exit: "free or buy", nav: true, mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f51.title, null);
      return '<div class="scr withnav">' + head +
        '<div class="card info"><div class="row">' + ic("photo") +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f51.body) + "</div></div>" +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.listen) + "</button></div>" +
        btn(esc(S.f51.delete3), "goto", "btn-primary", sc, 'data-go="F-52"') +
        btn(esc(S.f50.buyMore), "goto", "btn-tonal", sc, 'data-go="F-53"') +
        btn(esc(C.S.common.notNow), "goto", "btn-text", sc, 'data-go="F-50"') + "</div>";
    }
  };

  SCREENS["F-52"] = {
    name: "Delete picker", off: "✅ works offline",
    states: ["default", "confirm"], exit: "deleted → gallery", nav: true, mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.f52.title, "F-50");
      if (st === "confirm") {
        var picked = "";
        d.sel.forEach(function (on, i) { if (on) picked += thumb(C, i, "sel", i < 3 ? S.f42.date2 : S.f03.sampleDate); });
        return '<div class="scr withnav">' + head +
          '<div class="card"><div class="t-title ' + sc + '">' + esc(S.f52.confirmTitle) + '</div>' +
          '<div class="thumbgrid">' + picked + "</div>" +
          '<div class="t-body ' + sc + '">' + esc(S.f52.noUndo) + "</div>" +
          '<div class="t-caption muted ' + sc + '">' + esc(S.f52.keepNote) + "</div>" +
          '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.listen) + "</button></div>" +
          btn(esc(S.f52.confirmBtn), "f52confirm", "btn-danger", sc) +
          btn(esc(C.S.common.notNow), "f52cancel", "btn-outline", sc) + "</div>";
      }
      function group(label, from, to, dateStr) {
        var tiles = "";
        for (var i = from; i < to; i++) tiles += thumb(C, i, d.sel[i] ? "sel" : "", dateStr);
        return '<div class="t-caption muted ' + sc + '">' + esc(label) + "</div>" +
          '<div class="thumbgrid">' + tiles + "</div>";
      }
      return '<div class="scr withnav">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(S.f52.helper) + "</div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f52.keepNote) + "</div>" +
        group(S.f42.date2 + " · " + S.f42.case2, 0, 3, S.f42.date2) +
        group(S.f03.sampleDate + " · " + S.f23a.symptomVal, 3, 10, S.f03.sampleDate) +
        '<div class="footer">' + btn(esc(S.f52.deleteN), "f52delete", "btn-primary", sc) + "</div></div>";
    }
  };

  SCREENS["F-53"] = {
    name: "Buy image slots", off: "✕ needs signal",
    states: ["default", "offline"], exit: "→ gallery", nav: true, mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f53.title, "F-50");
      if (st === "offline") return '<div class="scr withnav">' + head + offlineCard(C, S.f53.offline, "f53retry") + "</div>";
      return '<div class="scr withnav">' + head +
        '<div class="card"><div class="row">' + ic("photo") +
        '<div><div class="t-title ' + sc + '">' + esc(S.f53.offerName) + '</div>' +
        '<div class="t-answer lang-en">₹100</div></div></div>' +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f53.payNote) + "</div></div>" +
        btn(esc(S.f53.buyBtn), "f53buy", "btn-primary", sc) +
        btn(esc(C.S.common.notNow), "goto", "btn-outline", sc, 'data-go="F-50"') + "</div>";
    }
  };

  /* --------------------------------------------------- chunk configuration */
  window.KT.boot({
    subtitle: "04 · Ask & history + images — navigation-ia.md §4: F-40…F-43, F-50…F-53",
    seq: ["F-40", "F-41", "F-42", "F-43", "F-50", "F-51", "F-52", "F-53"],
    screens: SCREENS,
    links: {
      prev: { href: "../03-report-problem/index.html", screen: "F-25", label: "03 · Report a problem" },
      next: { href: "../05-settings/index.html", screen: "S-20", label: "05 · Settings & support" }
    },
    tileData: {
      "F-40": { review: { qAsked: true } },
      "F-41": { default: { ansLoaded: true }, offline: { ansLoaded: true } }
    },
    freshData: function () {
      return {
        showEnglish: false, qAsked: false, ansLoaded: false,
        sel: [true, true, true, false, false, false, false, false, false, false]
      };
    },
    onAct: function (act, el, A) {
      var d = A.data, state = A.state;
      switch (act) {
        case "mic":
          if (state.screen === "F-40" && state.st !== "offline") {
            if (state.st === "listening") { d.qAsked = true; A.setSt("review"); }
            else {
              A.setSt("listening");
              A.later(1800, function () { d.qAsked = true; A.setSt("review"); });
            }
            return true;
          }
          return false;
        case "engtoggle": d.showEnglish = !d.showEnglish; A.render(); return true;
        case "f40send": d.ansLoaded = false; A.go("F-41"); return true;
        case "f40again": d.qAsked = false; A.go("F-40", "default"); return true;
        case "f40retry": A.go("F-40"); return true;
        case "f41another": d.qAsked = false; d.ansLoaded = false; A.go("F-40", "default"); return true;
        case "thumbtap":
          if (state.screen === "F-52" && state.st === "default") {
            var i = parseInt(el.getAttribute("data-idx"), 10);
            d.sel[i] = !d.sel[i];
            A.render();
          } else {
            A.speakSim(); /* long-press speaks the label — simulated on tap */
          }
          return true;
        case "f52delete": {
          var n = d.sel.filter(Boolean).length;
          if (n !== 3) { A.toast("Select exactly 3 (review chrome)"); return true; }
          A.setSt("confirm");
          return true;
        }
        case "f52confirm":
          A.toast(A.S.f52.doneMsg);
          d.sel = [true, true, true, false, false, false, false, false, false, false];
          A.go("F-50", "default");
          return true;
        case "f52cancel": A.setSt("default"); return true;
        case "f53buy": A.toast("Google Play Billing sheet (simulated)"); A.go("F-50", "default"); return true;
        case "f53retry": A.go("F-53"); return true;
      }
      return false;
    }
  });
})();
