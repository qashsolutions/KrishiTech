/* =============================================================================
   KrishiTech prototype framework — shared across chunks.
   Load order: tokens.css + styles.css + strings/*.js + proto.js, then the
   chunk's screens.js, which defines { subtitle, seq, screens, tileData,
   freshData, onAct, links } and calls KT.boot(chunk).
   Provides the review chrome (BOARD/FLOW, statebar, hash routing), rendering,
   and helpers on window.KT. All visual values come from tokens.css.
   ============================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ helpers */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function fmt(tpl, vars) {
    return String(tpl).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : "{" + k + "}"; });
  }

  /* ------------------------------------------------- icons (§7 stand-ins) */
  var IC = {
    mic: '<path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
    speaker: '<path d="M4 10v4h3l5 4V6L7 10H4Z"/><path d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path d="M17.5 7.5a6 6 0 0 1 0 9"/>',
    camera: '<path d="M4 8h3l1.6-2h6.8L17 8h3v11H4V8Z"/><circle cx="12" cy="13" r="3.4"/>',
    pin: '<path d="M12 21s-6.2-5.6-6.2-10a6.2 6.2 0 1 1 12.4 0C18.2 15.4 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/>',
    bell: '<path d="M6 17h12v-1l-1.6-2.2V10a4.4 4.4 0 0 0-8.8 0v3.8L6 16v1Z"/><path d="M10 19.5a2 2 0 0 0 4 0"/>',
    finger: '<path d="M7.5 6.5a6.5 6.5 0 0 1 9 0"/><path d="M5.8 9.6A8.6 8.6 0 0 1 12 7a8.6 8.6 0 0 1 6.2 2.6"/><path d="M8.4 12.5a3.8 3.8 0 0 1 7.2 0c0 3-1 5.2-2.1 7.2"/><path d="M12 12.8v2.4"/><path d="M9 17.6c.5-1.2.9-2.4 1-3.8"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    cloudOff: '<path d="M7.2 8.4A6 6 0 0 1 16.8 10a4 4 0 0 1 .9 7.9H6a4.4 4.4 0 0 1-1.4-8.5"/><path d="M4 4l16 16"/>',
    edit: '<path d="M4 20l4.2-1L19 8.2 15.8 5 5 15.8 4 20Z"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    leaf: '<path d="M12 21v-8"/><path d="M12 13c0-5 3-8.5 8-8.5 0 5-3 8.5-8 8.5Z"/><path d="M12 15c0-4-2.3-6-6.5-6 0 4.5 2.3 6 6.5 6Z"/>',
    alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10.5v4"/><path d="M12 17.2v.1"/>',
    shield: '<path d="M12 3l7 3v6c0 4.4-2.9 7.4-7 9-4.1-1.6-7-4.6-7-9V6l7-3Z"/>',
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c1.4-3.8 4.6-5.5 7.5-5.5s6.1 1.7 7.5 5.5"/>',
    people: '<circle cx="9" cy="9" r="3"/><path d="M3 19.5c1.2-3.2 3.7-4.5 6-4.5s4.8 1.3 6 4.5"/><circle cx="17" cy="9.5" r="2.4"/><path d="M16.4 15.2c2 .3 3.7 1.5 4.6 4.3"/>',
    store: '<path d="M4 9l1.4-4h13.2L20 9"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    del: '<path d="M8 5h11v14H8l-5-7 5-7Z"/><path d="M12 10l4 4M16 10l-4 4"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/>',
    cloudSun: '<path d="M6.5 10.2a4 4 0 1 1 6.2-4.6"/><path d="M8.3 20a4 4 0 0 1-1-7.9 5.2 5.2 0 0 1 10.1 1.2 3.4 3.4 0 0 1-.6 6.7H8.3Z"/>',
    rain: '<path d="M7 15a4.4 4.4 0 0 1-1.4-8.6A6 6 0 0 1 17.3 8 4 4 0 0 1 17 15H7Z"/><path d="M8.5 18l-1 3M12.5 18l-1 3M16.5 18l-1 3"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    photo: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 15l4.5-4.5L13 15l3-3 4 4"/><circle cx="9" cy="9.2" r="1.4"/>',
    up: '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
    minus: '<path d="M6 12h12"/>',
    downtrend: '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1 1-1.1 1.8"/><path d="M12 17v.1"/>',
    history: '<path d="M12 4a8 8 0 1 1-7.6 5.6"/><path d="M4 4v5h5"/><path d="M12 8v4.5l3 2"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  };
  function ic(name, cls) {
    return '<span class="ic ' + (cls || "") + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC[name] + "</svg></span>";
  }

  /* --------------------------------------------------------------- locales */
  var LANGS = [
    { code: "en-IN", own: "English" },
    { code: "hi-IN", own: "हिन्दी" },
    { code: "mr-IN", own: "मराठी" },
    { code: "te-IN", own: "తెలుగు" },
    { code: "ta-IN", own: "தமிழ்" },
    { code: "kn-IN", own: "ಕನ್ನಡ" }
  ];
  function strings(lang) { return window.KT_STRINGS[lang] || window.KT_STRINGS["en-IN"]; }

  /* ---------------------------------------------------------- ui snippets */
  function btn(label, act, kind, cls, extra) {
    return '<button class="btn ' + (kind || "btn-primary") + " " + (cls || "") + '" data-act="' + act + '" ' + (extra || "") + ">" + label + "</button>";
  }
  function loadrow(text, sc) {
    return '<div class="loadrow"><span class="spin"></span><span class="t-body ' + sc + '">' + esc(text) + "</span></div>";
  }
  function offlineCard(C, body, retryAct) {
    var sc = C.sc;
    return '<div class="card neutral"><div class="row">' + ic("cloudOff") +
      '<div><div class="t-label ' + sc + '">' + esc(C.S.common.noSignal) + '</div>' +
      '<div class="t-body ' + sc + '">' + esc(body) + "</div></div></div>" +
      (retryAct ? btn(esc(C.S.common.retry), retryAct, "btn-outline") : "") + "</div>";
  }
  function errorCard(C, body, retryAct) {
    var sc = C.sc;
    return '<div class="card error"><div class="row">' + ic("alert") +
      '<div class="t-body ' + sc + '">' + esc(body) + "</div></div>" +
      (retryAct ? btn(esc(C.S.common.retry), retryAct, "btn-outline") : "") + "</div>";
  }
  function queuedCard(C, title, body, contAct) {
    var sc = C.sc;
    return '<div class="card neutral"><div class="row">' + ic("cloudOff") +
      '<div><div class="t-label ' + sc + '">' + esc(title) + '</div>' +
      '<div class="t-body ' + sc + '">' + esc(body) + "</div></div></div>" +
      btn(esc(C.S.common.continue_), contAct, "btn-primary") + "</div>";
  }
  function keypad() {
    var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var html = '<div class="keypad">';
    keys.forEach(function (k) { html += '<button data-act="key" data-key="' + k + '">' + k + "</button>"; });
    html += '<button data-act="none" aria-hidden="true" tabindex="-1" style="visibility:hidden"></button>';
    html += '<button data-act="key" data-key="0">0</button>';
    html += '<button data-act="del">' + ic("del") + "</button></div>";
    return html;
  }
  function micdock(C, cls, label, withnav) {
    return '<div class="micdock' + (withnav ? " withnav" : "") + '"><button class="mic ' + (cls || "") + '" data-act="mic" aria-label="' + esc(label) + '">' +
      ic("mic") + '</button><span class="miclabel ' + C.sc + '">' + esc(label) + "</span></div>";
  }
  function terrain() {
    return '<svg class="terrain" viewBox="0 0 372 280" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M0 60 C80 30 140 90 372 50" stroke="#C1C9C0" fill="none" stroke-width="2"/>' +
      '<path d="M0 150 C120 120 220 190 372 140" stroke="#C1C9C0" fill="none" stroke-width="2"/>' +
      '<path d="M0 230 C100 210 260 260 372 220" stroke="#C1C9C0" fill="none" stroke-width="2"/>' +
      '<path d="M120 0 C140 90 100 200 150 280" stroke="#C1C9C0" fill="none" stroke-width="3"/>' +
      "</svg>";
  }
  /* app bar with role chip (design-system §8) — post-login screens.
     roleName defaults to farmer; dealer/FPO chunks pass their own. */
  function appbar(C, title, backGo, roleName, extra) {
    var sc = C.sc;
    var back = backGo
      ? '<button class="abback" data-act="goto" data-go="' + backGo + '">' + ic("back") +
        '<span class="t-caption ' + sc + '">' + esc(C.S.common.back) + "</span></button>"
      : "";
    return '<div class="appbar">' + back +
      '<span class="abtitle t-label ' + sc + '">' + esc(title) + "</span>" + (extra || "") +
      '<span class="rolechip ' + sc + '">' + esc(roleName || C.S.s05.roleFarmer) + "</span></div>";
  }
  /* farmer bottom nav (navigation-ia §2) — icons + labels in local script.
     navx routes in-chunk when the target screen exists, cross-chunk otherwise. */
  function bottomnav(C, active) {
    var sc = C.sc, S = C.S;
    function item(key, icn, label, act) {
      return '<button class="navitem' + (active === key ? " on" : "") + '" ' + act + ">" +
        '<span class="navic">' + ic(icn) + '</span><span class="t-caption ' + sc + '">' + esc(label) + "</span></button>";
    }
    return '<div class="bottomnav">' +
      item("home", "leaf", S.common.navHome, 'data-act="navx" data-target="F-10" data-dir="02-home-crop"') +
      item("crop", "calendar", S.common.navCrop, 'data-act="navx" data-target="F-11" data-dir="02-home-crop"') +
      '<span class="navspacer"></span>' +
      item("history", "history", S.common.navHistory, 'data-act="navx" data-target="F-42" data-dir="04-ask-history"') +
      item("more", "more", S.common.navMore, 'data-act="navx" data-target="S-20" data-dir="05-settings"') +
      "</div>";
  }
  /* dashed placeholder block — agronomic content pending an approved pack */
  function packPlaceholder(C, tagText) {
    return '<div class="placeholder"><span class="ptag lang-en">' + esc(tagText || "PLACEHOLDER — awaiting crop pack") + "</span>" +
      '<div class="t-body muted ' + C.sc + '">' + esc(C.S.common.packPending) + "</div></div>";
  }

  /* ------------------------------------------------------------ framework */
  function boot(CHUNK) {
    var SEQ = CHUNK.seq;
    var SCREENS = CHUNK.screens;
    var TILE_DATA = CHUNK.tileData || {};

    var state = {
      mode: "flow", screen: SEQ[0], st: "default", lang: "en-IN",
      offline: false, nonce: 0,
      data: CHUNK.freshData()
    };

    function ctx(lang, dataOverride) {
      var S = strings(lang);
      return { S: S, sc: S.meta.scriptClass, lang: lang, data: dataOverride || state.data };
    }
    function phoneHTML(id, st, C, interactive) {
      var def = SCREENS[id];
      var html = def.render(st, C);
      if (def.nav) html += bottomnav(C, def.nav === true ? "" : def.nav);
      if (def.mic) {
        var m = def.micState ? def.micState(st, C) : null;
        var cls = (m && m.cls) || (st === "queued" ? "queued" : "");
        var label = (m && m.label) || C.S.common.micLabel;
        html += micdock(C, cls, label, !!def.nav);
      }
      if (!C.S.meta.reviewed) html += '<div class="ribbon">DRAFT — not reviewed</div>';
      if (interactive) html += '<div class="speakpill" id="pill" style="opacity:0">' + ic("speaker") + '<span class="' + C.sc + '">' + esc(C.S.common.speaking) + "</span></div>";
      return html;
    }

    /* ------------------------------------------------------------ routing */
    function writeHash() {
      var h = "#mode=" + state.mode + "&screen=" + state.screen + "&state=" + state.st + "&lang=" + state.lang;
      if (location.hash !== h) history.replaceState(null, "", h);
    }
    function readHash() {
      var p = new URLSearchParams(location.hash.replace(/^#/, ""));
      var mode = p.get("mode"), scr = p.get("screen"), st = p.get("state"), lang = p.get("lang");
      if (mode === "board" || mode === "flow") state.mode = mode;
      if (scr && SCREENS[scr]) state.screen = scr;
      if (lang && window.KT_STRINGS[lang]) state.lang = lang;
      var def = SCREENS[state.screen];
      state.st = (st && def.states.indexOf(st) >= 0) ? st : null;
    }

    var timers = [];
    function later(ms, fn) {
      var n = state.nonce;
      timers.push(setTimeout(function () { if (n === state.nonce) fn(); }, ms));
    }
    function cancelTimers() { timers.forEach(clearTimeout); timers = []; state.nonce++; }

    function api() {
      return {
        state: state, data: state.data, S: strings(state.lang),
        go: go, setSt: setSt, render: render, later: later,
        toast: toast, speakSim: speakSim, syncLang: syncLang
      };
    }

    function go(id, st) {
      cancelTimers();
      state.screen = id;
      var def = SCREENS[id];
      if (st && def.states.indexOf(st) >= 0) state.st = st;
      else if (def.entrySt) state.st = def.entrySt(api());
      else state.st = def.states.indexOf("default") >= 0 ? "default" : def.states[0];
      render();
      if (def.onEnter) def.onEnter(api());
    }
    function setSt(st) { cancelTimers(); state.st = st; render(); }

    /* -------------------------------------------------------------- toast */
    var toastT = null;
    function toast(msg) {
      var el = document.getElementById("toast");
      el.textContent = msg;
      el.classList.add("show");
      clearTimeout(toastT);
      toastT = setTimeout(function () { el.classList.remove("show"); }, 2200);
    }
    function speakSim() {
      var pill = document.getElementById("pill");
      if (!pill) return;
      pill.style.opacity = "1";
      later(1600, function () { var p = document.getElementById("pill"); if (p) p.style.opacity = "0"; });
    }
    function syncLang() { document.getElementById("selLang").value = state.lang; }

    function chunkHref(link, screenOverride) {
      return link.href + "#mode=flow&screen=" + (screenOverride || link.screen) +
        "&state=default&lang=" + state.lang;
    }

    /* ------------------------------------------------------------- render */
    function render() {
      writeHash();
      document.getElementById("btnBoard").classList.toggle("on", state.mode === "board");
      document.getElementById("btnFlow").classList.toggle("on", state.mode === "flow");
      syncLang();
      var stage = document.getElementById("stage");
      var statebar = document.getElementById("statebar");
      if (state.mode === "board") {
        statebar.style.display = "none";
        stage.className = "stage";
        renderBoard(stage);
      } else {
        statebar.style.display = "";
        renderStatebar(statebar);
        stage.className = "stage flowstage";
        renderFlow(stage);
      }
    }

    function renderStatebar(bar) {
      var def = SCREENS[state.screen];
      var chips = def.states.map(function (s) {
        return '<button class="chip' + (s === state.st ? " on" : "") + '" data-chip="' + s + '">' + s + "</button>";
      }).join("");
      var atFirst = SEQ.indexOf(state.screen) === 0;
      var back = atFirst && CHUNK.links && CHUNK.links.prev
        ? '<button class="chip" data-nav="chunkprev">← ' + esc(CHUNK.links.prev.label) + "</button>"
        : '<button class="chip" data-nav="back" title="Previous screen">← back</button>';
      bar.innerHTML = back +
        '<span class="sid">' + state.screen + " · " + esc(def.name) + '</span>' +
        '<span class="offmark">' + def.off + "</span>" + chips +
        (state.offline ? '<span class="note">offline simulation on</span>' : "");
    }

    function renderFlow(stage) {
      var C = ctx(state.lang);
      stage.innerHTML = '<div class="phonewrap"><div class="phone">' + phoneHTML(state.screen, state.st, C, true) + "</div></div>";
      stage.scrollTop = 0;
      fitPhone();
    }
    function fitPhone() {
      var w = document.querySelector(".phonewrap");
      var stage = document.getElementById("stage");
      if (!w || !stage) return;
      var avail = stage.clientHeight - 40;
      var s = Math.min(1, avail / 915, (window.innerWidth - 32) / 412);
      w.style.transform = "scale(" + s + ")";
    }

    /* --------------------------------------------------------------- board */
    function renderBoard(stage) {
      var groups = SEQ.map(function (id) {
        var def = SCREENS[id];
        var tiles = def.states.map(function (st) {
          var over = (TILE_DATA[id] || {})[st];
          var d = Object.assign(CHUNK.freshData(), over || {});
          var C = ctx(state.lang, d);
          return '<div class="tile" data-open="' + id + '" data-openstate="' + st + '">' +
            '<div class="frame"><div class="inner">' + phoneHTML(id, st, C, false) + "</div></div>" +
            '<div class="tlabel"><b>' + id + "</b> · " + st + "</div></div>";
        }).join("");
        return '<div class="grp" id="grp-' + id + '"><header><span class="gid">' + id + "</span> " +
          '<span class="gname">' + esc(def.name) + '</span><br><span class="goff">' + def.off + "</span></header>" +
          '<div class="tiles">' + tiles + "</div></div>";
      }).join("");
      stage.innerHTML = '<div class="board" id="board"><svg id="arrows"></svg>' +
        '<div class="hint">Every tile is the 412×915 Android screen. Click a tile to open it in FLOW at that state. Arrows follow the main path; state tiles are alternates of the same screen.</div>' +
        '<div class="groups">' + groups + "</div></div>";
      requestAnimationFrame(drawArrows);
    }
    function drawArrows() {
      var board = document.getElementById("board");
      var svg = document.getElementById("arrows");
      if (!board || !svg) return;
      svg.setAttribute("width", board.scrollWidth);
      svg.setAttribute("height", board.scrollHeight);
      var defs = '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#8A938A"/></marker></defs>';
      var inner = defs;
      for (var i = 0; i < SEQ.length - 1; i++) {
        var a = document.getElementById("grp-" + SEQ[i]);
        var b = document.getElementById("grp-" + SEQ[i + 1]);
        if (!a || !b) continue;
        var ax = a.offsetLeft, ay = a.offsetTop, aw = a.offsetWidth, ah = a.offsetHeight;
        var bx = b.offsetLeft, by = b.offsetTop;
        var label = SCREENS[SEQ[i]].exit;
        var p, lx, ly;
        if (Math.abs(by - ay) < 40) {
          var y = ay + 200;
          p = "M" + (ax + aw + 4) + " " + y + " C" + (ax + aw + 46) + " " + y + " " + (bx - 46) + " " + y + " " + (bx - 6) + " " + y;
          lx = (ax + aw + bx) / 2; ly = y - 12;
        } else {
          var sx = ax + aw / 2, sy = ay + ah + 4, tx = bx + 40, ty = by - 8;
          p = "M" + sx + " " + sy + " C" + sx + " " + (sy + 60) + " " + tx + " " + (ty - 60) + " " + tx + " " + ty;
          lx = Math.max(90, (sx + tx) / 2); ly = (sy + ty) / 2;
        }
        inner += '<path d="' + p + '" marker-end="url(#ah)"/>';
        inner += '<rect class="lbl-bg" x="' + (lx - label.length * 3.4) + '" y="' + (ly - 12) + '" width="' + (label.length * 6.8) + '" height="16" rx="4"/>';
        inner += '<text x="' + lx + '" y="' + ly + '" text-anchor="middle">' + esc(label) + "</text>";
      }
      svg.innerHTML = inner;
    }

    /* ------------------------------------------------------------- actions */
    function onAct(act, el) {
      switch (act) {
        case "speak": speakSim(); return;
        case "stub": case "navstub": toast(el.getAttribute("data-note") || "Out of this chunk"); return;
        case "goto": go(el.getAttribute("data-go")); return;
        case "navx": {
          var t = el.getAttribute("data-target");
          if (SCREENS[t]) go(t);
          else location.href = "../" + el.getAttribute("data-dir") + "/index.html#mode=flow&screen=" + t + "&state=default&lang=" + state.lang;
          return;
        }
        case "chunknext":
          if (CHUNK.links && CHUNK.links.next) location.href = chunkHref(CHUNK.links.next);
          return;
        case "chunkprev":
          if (CHUNK.links && CHUNK.links.prev) location.href = chunkHref(CHUNK.links.prev);
          return;
        case "none": return;
      }
      var handled = CHUNK.onAct ? CHUNK.onAct(act, el, api()) : false;
      if (!handled && act === "mic") speakSim();
    }

    /* --------------------------------------------------------------- wiring */
    document.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-chip]");
      if (chip) { setSt(chip.getAttribute("data-chip")); return; }
      var nav = e.target.closest("[data-nav]");
      if (nav) {
        var kind = nav.getAttribute("data-nav");
        if (kind === "chunkprev") { onAct("chunkprev", nav); return; }
        var i = SEQ.indexOf(state.screen);
        if (i > 0) go(SEQ[i - 1]);
        return;
      }
      var tile = e.target.closest("[data-open]");
      if (tile) {
        state.mode = "flow";
        go(tile.getAttribute("data-open"), tile.getAttribute("data-openstate"));
        return;
      }
      var el = e.target.closest("[data-act]");
      if (el && el.getAttribute("aria-disabled") !== "true") onAct(el.getAttribute("data-act"), el);
    });

    document.addEventListener("input", function (e) {
      var el = e.target.closest("[data-input]");
      if (!el) return;
      state.data[el.getAttribute("data-input")] = el.value;
    });
    document.addEventListener("change", function (e) {
      var el = e.target.closest("[data-input]");
      if (!el) return;
      state.data[el.getAttribute("data-input")] = el.value;
    });

    document.getElementById("btnBoard").addEventListener("click", function () { state.mode = "board"; render(); });
    document.getElementById("btnFlow").addEventListener("click", function () { state.mode = "flow"; render(); });
    document.getElementById("selLang").addEventListener("change", function (e) { state.lang = e.target.value; render(); });
    document.getElementById("selScale").addEventListener("change", function (e) {
      document.documentElement.style.setProperty("--sp-factor", e.target.value);
      render();
    });
    document.getElementById("chkOffline").addEventListener("change", function (e) { state.offline = e.target.checked; render(); });
    document.getElementById("btnRestart").addEventListener("click", function () {
      state.data = CHUNK.freshData(); state.offline = false;
      document.getElementById("chkOffline").checked = false;
      state.mode = "flow"; go(SEQ[0]);
    });
    document.getElementById("rangeTiles").addEventListener("input", function (e) {
      document.documentElement.style.setProperty("--tilescale", e.target.value);
      if (state.mode === "board") requestAnimationFrame(drawArrows);
    });
    window.addEventListener("resize", function () {
      fitPhone();
      if (state.mode === "board") drawArrows();
    });
    window.addEventListener("hashchange", function () { readHash(); go(state.screen, state.st || undefined); });

    /* ---------------------------------------------------------------- boot */
    var sel = document.getElementById("selLang");
    LANGS.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.code; o.textContent = l.own + " · " + l.code;
      sel.appendChild(o);
    });
    var brand = document.getElementById("brandSub");
    if (brand && CHUNK.subtitle) brand.textContent = CHUNK.subtitle;
    var linksSpan = document.getElementById("chunklinks");
    if (linksSpan && CHUNK.links) {
      var lh = "";
      if (CHUNK.links.prev) lh += '<button class="plainbtn" data-nav="chunkprev">← ' + esc(CHUNK.links.prev.label) + "</button>";
      if (CHUNK.links.next) lh += '<button class="plainbtn" data-act="chunknext">' + esc(CHUNK.links.next.label) + " →</button>";
      linksSpan.innerHTML = lh;
    }
    document.documentElement.style.setProperty("--tilescale", "0.42");
    readHash();
    go(state.screen, state.st || undefined);
  }

  window.KT = {
    esc: esc, fmt: fmt, ic: ic, IC: IC, btn: btn, loadrow: loadrow,
    offlineCard: offlineCard, errorCard: errorCard, queuedCard: queuedCard,
    keypad: keypad, micdock: micdock, terrain: terrain, appbar: appbar,
    bottomnav: bottomnav, packPlaceholder: packPlaceholder,
    strings: strings, LANGS: LANGS, boot: boot
  };
})();
