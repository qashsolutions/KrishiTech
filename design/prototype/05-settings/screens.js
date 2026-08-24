/* =============================================================================
   Chunk 05 — Settings, support & safeguarding.
   navigation-ia.md §7: S-20…S-32, S-40…S-42. Framework: ../shared/proto.js.
   S-42 follows docs/safeguarding-protocol.md: Tele-MANAS 14416 /
   1800-89-14416 (numbers pending clinical verification — do NOT run user
   sessions on this screen before that review); calm, unbranded (§2.7), one
   action, numbers shown and spoken, never auto-opened, entry only by a
   deliberate labelled tap in Help, never visible to dealer/FPO.
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, ic = K.ic, btn = K.btn, offlineCard = K.offlineCard,
    appbar = K.appbar, LANGS = K.LANGS, strings = K.strings;

  var DISTRICTS = ["Warangal", "Khammam", "Nalgonda", "Karimnagar"];
  var VILLAGES = ["Duggondi", "Atmakur", "Parkal"];

  function srow(icn, label, sc, act, val, disabled) {
    return '<button class="srow' + (disabled ? " disabled" : "") + '" ' + (act || 'data-act="none"') + ">" + ic(icn) +
      '<span class="grow t-body ' + sc + '">' + esc(label) + "</span>" +
      (val ? '<span class="sval t-caption">' + val + "</span>" : "") + ic("next") + "</button>";
  }
  function toggle(C, label, key, note) {
    var on = C.data[key];
    return '<button class="engtoggle' + (on ? " on" : "") + '" style="align-self:stretch;width:100%" data-act="tgl" data-key="' + key + '">' +
      '<span class="knob"></span><span class="t-body ' + C.sc + '">' + esc(label) + "</span></button>" +
      (note ? '<div class="t-caption muted ' + C.sc + '">' + esc(note) + "</div>" : "");
  }

  var SCREENS = {};

  SCREENS["S-20"] = {
    name: "Settings home", off: "✅ works offline",
    states: ["default"], exit: "any row", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s20.title, null) +
        srow("chat", S.s21.title, sc, 'data-act="goto" data-go="S-21"', esc(C.S.meta.code)) +
        srow("pin", S.s22.title, sc, 'data-act="goto" data-go="S-22"', "Warangal") +
        srow("sun", S.s23.title, sc, 'data-act="goto" data-go="S-23"') +
        srow("person", S.s24.title, sc, 'data-act="goto" data-go="S-24"') +
        srow("finger", S.s25.title, sc, 'data-act="goto" data-go="S-25"') +
        srow("bell", S.s26.title, sc, 'data-act="goto" data-go="S-26"') +
        srow("shield", S.s27.title, sc, 'data-act="goto" data-go="S-27"') +
        srow("photo", S.s28.title, sc, 'data-act="goto" data-go="S-28"') +
        srow("speaker", S.s40.title, sc, 'data-act="goto" data-go="S-40"') +
        srow("question", S.s41.title, sc, 'data-act="goto" data-go="S-41"') +
        srow("edit", S.s31.title, sc, 'data-act="goto" data-go="S-31"') +
        srow("more", S.s32.title, sc, 'data-act="goto" data-go="S-32"') +
        "</div>";
    }
  };

  SCREENS["S-21"] = {
    name: "Language", off: "◐ pack download needs signal",
    states: ["default", "offline"], exit: "language set", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var rows = LANGS.map(function (l) {
        var ls = strings(l.code);
        var on = C.lang === l.code;
        return '<div class="langrow"' + (on ? ' style="border-color:var(--md-primary)"' : "") + '>' +
          '<button class="lname ' + ls.meta.scriptClass + '" data-act="s21lang" data-lang="' + l.code + '">' + esc(l.own) + "</button>" +
          (on ? '<div class="pstate">' + ic("check") + "</div>" : "") + "</div>";
      }).join("");
      var offline = st === "offline" ? offlineCard(C, S.s21.offline, "") : "";
      return '<div class="scr withnav">' + appbar(C, S.s21.title, "S-20") + offline +
        '<div class="langlist">' + rows + "</div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.s21.packNote) + "</div>" +
        toggle(C, S.s21.engDefault, "engDefault", S.s21.engNote) + "</div>";
    }
  };

  SCREENS["S-22"] = {
    name: "Region / district", off: "✅ works offline",
    states: ["default"], exit: "saved", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var dopts = DISTRICTS.map(function (x) {
        return '<option' + ((d.district || "Warangal") === x ? " selected" : "") + ">" + x + "</option>";
      }).join("");
      var vopts = VILLAGES.map(function (x) {
        return '<option' + ((d.village || "Duggondi") === x ? " selected" : "") + ">" + x + "</option>";
      }).join("");
      return '<div class="scr withnav">' + appbar(C, S.s22.title, "S-20") +
        '<div class="t-body muted ' + sc + '">' + esc(S.s22.helper) + "</div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f02.district) + '</span><select class="lang-en" data-input="district">' + dopts + "</select></div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f02.village) + '</span><select class="lang-en" data-input="village">' + vopts + "</select></div>" +
        '<div class="footer">' + btn(esc(S.f02.confirm), "s22save", "btn-primary", sc) + "</div></div>";
    }
  };

  SCREENS["S-23"] = {
    name: "Theme", off: "✅ works offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s23.title, "S-20") +
        '<button class="chipbtn on ' + sc + '" style="width:100%">' + ic("sun") + esc(S.s23.day) + "</button>" +
        srow("more", S.s23.night, sc, 'data-act="none"', "", true) +
        srow("more", S.s23.system, sc, 'data-act="none"', "", true) +
        '<div class="card info"><div class="row">' + ic("sun") + '<div class="t-body ' + sc + '">' + esc(S.s23.lightOnly) + "</div></div></div></div>";
    }
  };

  SCREENS["S-24"] = {
    name: "Profile", off: "✅ works offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function fieldRow(name) {
        return '<div class="card"><div class="row">' + ic("leaf") +
          '<div><div class="t-label ' + sc + '">' + esc(name) + '</div>' +
          '<div class="t-caption muted"><span class="lang-en">2</span> <span class="' + sc + '">' + esc(S.f01.unitGuntha) + "</span> · " +
          '<span class="' + sc + '">' + esc(S.f03.cropChilli) + "</span></div></div></div></div>";
      }
      return '<div class="scr withnav">' + appbar(C, S.s24.title, "S-20") +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.s24.name) + '</span>' +
        '<input class="' + sc + '" data-input="name" value="' + esc(S.s24.sampleName) + '"></div>' +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.s02.field) + '</span>' +
        '<div class="fieldbox lang-en">+91 98765 43210</div></div>' +
        '<div class="t-label ' + sc + '">' + esc(S.f14.title) + "</div>" +
        fieldRow(S.f14.sample1) + fieldRow(S.f14.sample2) + "</div>";
    }
  };

  SCREENS["S-25"] = {
    name: "Security", off: "✅ works offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      return '<div class="scr withnav">' + appbar(C, C.S.s25.title, "S-20") +
        toggle(C, C.S.s25.bio, "bio", C.S.s07.body) + "</div>";
    }
  };

  SCREENS["S-26"] = {
    name: "Notifications & quiet hours", off: "✅ works offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s26.title, "S-20") +
        toggle(C, S.s26.tWeather, "tw") +
        toggle(C, S.s26.tTasks, "tt") +
        toggle(C, S.s26.tExpert, "tx") +
        '<div class="card"><div class="row">' + ic("bell") +
        '<div><div class="t-label ' + sc + '">' + esc(S.s26.quiet) + '</div>' +
        '<div class="t-title ' + sc + '">' + esc(S.s26.quietVal) + '</div>' +
        '<div class="t-caption muted ' + sc + '">' + esc(S.s26.quietNote) + "</div></div></div></div></div>";
    }
  };

  SCREENS["S-27"] = {
    name: "Data & privacy", off: "✅ works offline",
    states: ["default"], exit: "export / delete", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s27.title, "S-20") +
        toggle(C, S.s27.improve, "improve", S.s27.improveNote) +
        '<div class="card info"><div class="row">' + ic("store") + '<div class="t-body ' + sc + '">' + esc(S.s04.p2) + "</div></div></div>" +
        srow("down", S.s29.title, sc, 'data-act="goto" data-go="S-29"') +
        srow("del", S.s30.title, sc, 'data-act="goto" data-go="S-30"') + "</div>";
    }
  };

  SCREENS["S-28"] = {
    name: "Storage & plan", off: "◐ partial offline",
    states: ["default"], exit: "→ images / buy", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s28.title, "S-20") +
        '<div class="t-body ' + sc + '">' + esc(S.f50.used7) + "</div>" +
        '<div class="progressbar"><div class="fill" style="width:70%"></div></div>' +
        srow("photo", S.f50.title, sc, 'data-act="navx" data-target="F-50" data-dir="04-ask-history"') +
        srow("photo", S.f50.buyMore, sc, 'data-act="navx" data-target="F-53" data-dir="04-ask-history"') + "</div>";
    }
  };

  SCREENS["S-29"] = {
    name: "Export my data", off: "✕ needs signal",
    states: ["default", "requested", "offline"], exit: "requested", nav: "more", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.s29.title, "S-27");
      if (st === "offline") return '<div class="scr withnav">' + head + offlineCard(C, C.S.common.needsSignal, "s29retry") + "</div>";
      if (st === "requested") {
        return '<div class="scr withnav">' + head +
          '<div class="iconline checkmark">' + ic("check") + '<span class="t-title ' + sc + '">' + esc(S.s29.requested) + "</span></div></div>";
      }
      return '<div class="scr withnav">' + head +
        '<div class="card"><div class="row">' + ic("down") + '<div class="t-body ' + sc + '">' + esc(S.s29.body) + "</div></div></div>" +
        btn(esc(S.s29.request), "s29request", "btn-primary", sc) + "</div>";
    }
  };

  SCREENS["S-30"] = {
    name: "Delete my account", off: "✕ needs signal",
    states: ["default", "confirm", "offline"], exit: "→ S-01", nav: "more", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.s30.title, "S-27");
      if (st === "offline") return '<div class="scr withnav">' + head + offlineCard(C, C.S.common.needsSignal, "s30retry") + "</div>";
      if (st === "confirm") {
        /* spoken confirmation (nav-ia §7) + destructive statusUrgent confirm (§2.3) */
        return '<div class="scr withnav">' + head +
          '<div class="card"><div class="t-title ' + sc + '">"' + esc(S.s30.title) + '"</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.s30.confirmHelp) + "</div>" +
          '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("mic") + esc(C.S.common.micLabel) + "</button></div>" +
          btn(esc(S.s30.start), "s30confirm", "btn-danger", sc) +
          btn(esc(C.S.common.notNow), "s30cancel", "btn-outline", sc) +
          '<div class="t-caption muted lang-en">' + esc(S.s30.webNote) + "</div></div>";
      }
      return '<div class="scr withnav">' + head +
        '<div class="card error"><div class="row">' + ic("alert") + '<div class="t-bodylarge ' + sc + '">' + esc(S.s30.body) + "</div></div></div>" +
        btn(esc(S.s30.start), "s30start", "btn-danger", sc) +
        '<div class="t-caption muted lang-en">' + esc(S.s30.webNote) + "</div></div>";
    }
  };

  SCREENS["S-31"] = {
    name: "Terms & policies", off: "✅ cached offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s31.title, "S-20") +
        srow("edit", S.s04.terms, sc, 'data-act="stub" data-note="→ legal/ terms (out of prototype)"') +
        srow("shield", S.s04.privacy, sc, 'data-act="stub" data-note="→ legal/ privacy policy (out of prototype)"') +
        srow("chat", S.s31.content, sc, 'data-act="stub" data-note="→ legal/ content policy (out of prototype)"') + "</div>";
    }
  };

  SCREENS["S-32"] = {
    name: "About", off: "✅ works offline",
    states: ["default"], exit: "—", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s32.title, "S-20") +
        srow("more", S.s32.version, sc, 'data-act="none"', '<span class="lang-en">0.1.0 (prototype)</span>') +
        srow("edit", S.s32.licences, sc, 'data-act="stub" data-note="Licence list (out of prototype)"') + "</div>";
    }
  };

  SCREENS["S-40"] = {
    name: "Feedback sheet", off: "✅ queued offline",
    states: ["default", "listening", "queued"], exit: "sent", nav: "more", mic: true,
    micState: function (st, C) {
      if (st === "listening") return { cls: "listening", label: C.S.f03.listening };
      if (st === "queued") return { cls: "queued" };
      return null;
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.s40.title, "S-20");
      if (st === "queued") {
        return '<div class="scr withnav">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-label ' + sc + '">' + esc(C.S.f01.queuedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(C.S.f01.queuedBody) + "</div></div></div>" +
          btn(esc(C.S.common.done), "goto", "btn-primary", sc, 'data-go="S-20"') + "</div></div>";
      }
      var chips = '<div class="t-caption muted ' + sc + '">' + esc(S.s40.attached) + "</div>" +
        '<div class="chips">' +
        '<span class="rolechip lang-en">F-25</span>' +
        '<span class="rolechip lang-en">v0.1.0</span>' +
        '<span class="rolechip ' + sc + '">' + esc(C.lang) + "</span>" +
        '<span class="rolechip lang-en">Redmi 9A</span></div>';
      var voiceChip = d.fbVoice
        ? '<div class="iconline" style="color:var(--md-primary)">' + ic("speaker") + '<span class="t-label lang-en">0:12</span></div>'
        : "";
      var listening = st === "listening"
        ? '<div class="iconline" style="justify-content:center;color:var(--md-primary)">' + ic("mic") +
          '<span class="t-label ' + sc + '">' + esc(C.S.f03.listening) + "</span></div>"
        : "";
      return '<div class="scr withnav">' + head +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.s40.prompt) + "</div>" +
        '<input class="' + sc + '" style="min-height:var(--touch-min);border:1px solid var(--md-outline);border-radius:var(--radius-small);padding:var(--sp-12) var(--sp-16)" data-input="fbText">' +
        voiceChip + listening + chips +
        '<div class="footer">' + btn(esc(S.s40.send), "s40send", "btn-primary", sc) + "</div></div>";
    }
  };

  SCREENS["S-41"] = {
    name: "Help", off: "✅ works offline",
    states: ["default"], exit: "deliberate tap → S-42", nav: "more", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withnav">' + appbar(C, S.s41.title, "S-20") +
        '<div class="t-caption muted ' + sc + '">' + esc(S.s41.helper) + "</div>" +
        srow("speaker", S.f10.report, sc, 'data-act="speak"') +
        srow("speaker", S.s41.c2, sc, 'data-act="speak"') +
        srow("speaker", S.s41.c3, sc, 'data-act="speak"') +
        '<div class="grow"></div>' +
        /* deliberate, labelled entry to S-42 — never adjacent to common taps */
        '<button class="btn btn-outline ' + sc + '" data-act="goto" data-go="S-42">' + esc(S.s41.support) + "</button></div>";
    }
  };

  SCREENS["S-42"] = {
    name: "Support (safeguarding)", off: "✅ works offline",
    states: ["default"], exit: "—", nav: false, mic: false,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      /* §2.7: no brand colour, no urgent red, no logo, one action.
         Numbers shown and spoken (safeguarding-protocol.md). */
      return '<div class="scr s42 center">' +
        '<div class="t-title ' + sc + '" style="text-align:center">' + esc(S.s42.title) + "</div>" +
        '<div class="t-bodylarge ' + sc + '" style="text-align:center">' + esc(S.s42.body) + "</div>" +
        '<div style="text-align:center"><div class="t-caption lang-en">Tele-MANAS</div>' +
        '<div class="t-answer lang-en">14416</div>' +
        '<div class="t-caption lang-en">1800-89-14416</div></div>' +
        '<button class="quietbtn iconline" style="justify-content:center;background:none" data-act="speak">' + ic("speaker") +
        '<span class="t-caption ' + sc + '">' + esc(C.S.common.listen) + "</span></button>" +
        '<button class="btn btn-call ' + sc + '" data-act="s42call">' + esc(S.s42.call) + "</button></div>";
    }
  };

  /* --------------------------------------------------- chunk configuration */
  window.KT.boot({
    subtitle: "05 · Settings & support — navigation-ia.md §7: S-20…S-32, S-40…S-42",
    seq: ["S-20", "S-21", "S-22", "S-23", "S-24", "S-25", "S-26", "S-27", "S-28", "S-29", "S-30", "S-31", "S-32", "S-40", "S-41", "S-42"],
    screens: SCREENS,
    links: {
      prev: { href: "../02-home-crop/index.html", screen: "F-10", label: "02 · Home & crop" }
    },
    tileData: {
      "S-40": { queued: { fbVoice: true } }
    },
    freshData: function () {
      return {
        bio: true, tw: true, tt: true, tx: true,
        improve: false, engDefault: false,
        fbVoice: false, fbText: "", district: "", village: "", name: ""
      };
    },
    onAct: function (act, el, A) {
      var d = A.data, state = A.state;
      switch (act) {
        case "tgl": {
          var k = el.getAttribute("data-key");
          d[k] = !d[k];
          A.render();
          return true;
        }
        case "s21lang":
          state.lang = el.getAttribute("data-lang");
          A.syncLang();
          if (state.offline) A.setSt("offline"); else A.render();
          return true;
        case "s22save": A.toast("Saved"); A.go("S-20"); return true;
        case "s29request": A.setSt("requested"); return true;
        case "s29retry": A.go("S-29"); return true;
        case "s30start": A.setSt("confirm"); return true;
        case "s30cancel": A.setSt("default"); return true;
        case "s30retry": A.go("S-30"); return true;
        case "s30confirm":
          A.toast("Account deletion — prototype ends here; returning to S-01");
          location.href = "../01-onboarding/index.html#mode=flow&screen=S-01&state=default&lang=" + state.lang;
          return true;
        case "mic":
          if (state.screen === "S-40") {
            if (state.st === "listening") { d.fbVoice = true; A.setSt("default"); }
            else {
              A.setSt("listening");
              A.later(1800, function () { d.fbVoice = true; A.setSt("default"); });
            }
            return true;
          }
          return false;
        case "s40send":
          if (state.offline) A.setSt("queued");
          else { A.toast("Sent (simulated)"); A.go("S-20"); }
          return true;
        case "s42call": A.toast("Would dial 14416 (prototype)"); return true;
      }
      return false;
    }
  });
})();
