/* =============================================================================
   Chunk 01 — Shared pre-login & onboarding + farmer onboarding.
   navigation-ia.md §3: S-01…S-07, F-01…F-05. Framework: ../shared/proto.js.
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, fmt = K.fmt, ic = K.ic, IC = K.IC, btn = K.btn,
    loadrow = K.loadrow, offlineCard = K.offlineCard, errorCard = K.errorCard,
    queuedCard = K.queuedCard, keypad = K.keypad, terrain = K.terrain,
    LANGS = K.LANGS, strings = K.strings;

  var DISTRICTS = ["Warangal", "Khammam", "Nalgonda", "Karimnagar"];
  var VILLAGES = ["Duggondi", "Atmakur", "Parkal"];

  var SCREENS = {};

  SCREENS["S-01"] = {
    name: "Splash / language picker", off: "✅ works offline",
    states: ["default"], exit: "language chosen",
    render: function (st, C) {
      var rows = LANGS.map(function (l) {
        var ls = strings(l.code);
        return '<div class="langrow"><button class="lname ' + ls.meta.scriptClass + '" data-act="lang" data-lang="' + l.code + '">' + esc(l.own) + "</button>" +
          '<button class="lspeak" data-act="speak">' + ic("speaker") + '<span class="t-caption ' + ls.meta.scriptClass + '">' + esc(ls.common.listen) + "</span></button></div>";
      }).join("");
      return '<div class="scr"><div>' +
        '<div class="t-answer lang-en">KrishiTech</div>' +
        '<div class="t-body muted ' + C.sc + '">' + esc(C.S.s01.tagline) + "</div></div>" +
        '<div class="t-title ' + C.sc + '">' + esc(C.S.s01.choose) + '</div>' +
        '<div class="langlist">' + rows + "</div>" +
        '<div class="t-caption muted ' + C.sc + '">' + esc(C.S.s01.longpress) + "</div></div>";
    }
  };

  SCREENS["S-02"] = {
    name: "Phone number entry", off: "✕ needs signal",
    states: ["default", "loading", "error", "offline"], exit: "code sent",
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var digits = d.phone || "";
      var shown = digits ? "+91 " + digits.replace(/(\d{5})(\d+)/, "$1 $2") : "+91";
      var body = '<div class="t-title ' + sc + '">' + esc(S.s02.title) + '</div>' +
        '<div class="t-body muted ' + sc + '">' + esc(S.s02.helper) + "</div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.s02.field) + '</span>' +
        '<div class="fieldbox big lang-en">' + esc(shown) + "</div></div>";
      if (st === "loading") return '<div class="scr">' + body + loadrow(S.s02.loading, sc) + "</div>";
      if (st === "offline") return '<div class="scr">' + body + offlineCard(C, S.s02.offline, "s02continue") + "</div>";
      if (st === "error") {
        var msg = d.errKind === "short" ? S.s02.errShort : S.s02.errSend;
        body += errorCard(C, msg, "s02continue");
      }
      return '<div class="scr">' + body +
        '<div class="grow"></div>' +
        btn(esc(S.common.continue_), "s02continue", "btn-primary", sc) +
        keypad() + "</div>";
    }
  };

  SCREENS["S-03"] = {
    name: "OTP verification", off: "✕ needs signal",
    states: ["default", "loading", "error", "offline"], exit: "code verified",
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var shownPhone = "+91 " + (d.phone || "9876543210").replace(/(\d{5})(\d+)/, "$1 $2");
      var boxes = '<div class="otp">';
      for (var i = 0; i < 6; i++) {
        var ch = (d.otp || "")[i] || "";
        boxes += '<div class="obox lang-en' + (ch ? " filled" : "") + '">' + esc(ch) + "</div>";
      }
      boxes += "</div>";
      var head = '<div class="t-title ' + sc + '">' + esc(S.s03.title) + '</div>' +
        '<div class="t-body muted ' + sc + '">' + esc(S.s03.helper) + ' <span class="lang-en">' + esc(shownPhone) + "</span></div>" + boxes;
      if (st === "loading") return '<div class="scr">' + head + loadrow(S.s03.loading, sc) + "</div>";
      if (st === "offline") return '<div class="scr">' + head + offlineCard(C, S.s03.offline, "s03retry") + "</div>";
      var err = st === "error" ? errorCard(C, S.s03.errWrong, "s03retry") : "";
      return '<div class="scr">' + head + err +
        btn(esc(S.s03.resend), "s03resend", "btn-text", sc) +
        '<div class="grow"></div>' + keypad() + "</div>";
    }
  };

  SCREENS["S-04"] = {
    name: "Terms, privacy & consent", off: "✕ needs signal",
    states: ["default", "error", "offline"], exit: "agreed",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function point(icn, txt) {
        return '<div class="card"><div class="row">' + ic(icn) + '<div class="t-body ' + sc + '">' + esc(txt) + "</div></div></div>";
      }
      var body = '<div class="t-title ' + sc + '">' + esc(S.s04.title) + "</div>" +
        point("shield", S.s04.p1) + point("store", S.s04.p2) + point("edit", S.s04.p3) +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(S.s04.listen) + "</button>" +
        '<div class="linkrow">' +
        '<button class="btn btn-text ' + sc + '" data-act="stub" data-note="→ S-31 Terms &amp; policies (later chunk)">' + esc(S.s04.terms) + "</button>" +
        '<button class="btn btn-text ' + sc + '" data-act="stub" data-note="→ S-31 Terms &amp; policies (later chunk)">' + esc(S.s04.privacy) + "</button></div>";
      if (st === "error") body += errorCard(C, S.s04.err, "s04agree");
      if (st === "offline") body += offlineCard(C, S.s04.offline, "s04agree");
      return '<div class="scr">' + body + '<div class="footer">' +
        (st === "default" ? btn(esc(S.s04.agree), "s04agree", "btn-primary", sc) : "") + "</div></div>";
    }
  };

  SCREENS["S-05"] = {
    name: "Role resolution", off: "✕ needs signal",
    states: ["loading", "default", "picker", "error", "offline"], exit: "role: farmer",
    entrySt: function (A) { return A.state.offline ? "offline" : "loading"; },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1300, function () { A.setSt(A.data.multiRole ? "picker" : "default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      if (st === "loading") return '<div class="scr center">' + loadrow(S.s05.loading, sc) + "</div>";
      if (st === "offline") return '<div class="scr center">' + offlineCard(C, S.s05.offline, "s05retry") + "</div>";
      if (st === "error") return '<div class="scr center">' + errorCard(C, S.s05.err, "s05retry") + "</div>";
      if (st === "picker") {
        function role(icn, name, sub, act) {
          return '<button class="chipbtn" style="width:100%" data-act="' + act + '">' + ic(icn) +
            '<span><span class="t-label ' + sc + '">' + esc(name) + '</span><br><span class="t-caption muted ' + sc + '">' + esc(sub) + "</span></span></button>";
        }
        return '<div class="scr"><div class="t-title ' + sc + '">' + esc(S.s05.multiTitle) + "</div>" +
          '<div class="chips" style="flex-direction:column">' +
          role("leaf", S.s05.roleFarmer, S.s05.roleFarmerSub, "s05continue") +
          role("store", S.s05.roleDealer, S.s05.roleDealerSub, "s05continue") +
          role("people", S.s05.roleFpo, S.s05.roleFpoSub, "s05continue") +
          "</div></div>";
      }
      return '<div class="scr center"><div class="iconline checkmark">' + ic("check") +
        '<span class="t-caption ' + sc + '">' + esc(S.common.done) + "</span></div>" +
        '<div class="t-answer ' + sc + '">' + esc(S.s05.singleTitle) + "</div>" +
        '<div class="t-body muted ' + sc + '">' + esc(S.s05.singleBody) + "</div>" +
        btn(esc(S.common.continue_), "s05continue", "btn-primary", sc) + "</div>";
    }
  };

  SCREENS["S-06"] = {
    name: "Permission primer", off: "✅ works offline",
    states: ["default", "permission-denied"], exit: "permissions addressed", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var perms = [
        { k: "mic", icn: "mic", n: S.s06.micName, w: S.s06.micWhy },
        { k: "cam", icn: "camera", n: S.s06.camName, w: S.s06.camWhy },
        { k: "loc", icn: "pin", n: S.s06.locName, w: S.s06.locWhy },
        { k: "notif", icn: "bell", n: S.s06.notifName, w: S.s06.notifWhy }
      ];
      if (st === "permission-denied") d = Object.assign({}, d, { perms: Object.assign({}, d.perms, { loc: "skipped" }) });
      var cards = perms.map(function (p) {
        var got = d.perms[p.k];
        var acts;
        if (got === "granted") acts = '<div class="pstate">' + ic("check") + '<span class="t-label ' + sc + '">' + esc(S.s06.granted) + "</span></div>";
        else if (got === "skipped") acts = '<div class="pstate off">' + ic("next") + '<span class="t-label ' + sc + '">' + esc(S.s06.skipped) + "</span></div>";
        else acts = '<div class="pacts">' +
          '<button class="btn btn-tonal ' + sc + '" data-act="s06allow" data-perm="' + p.k + '">' + esc(S.s06.allow) + "</button>" +
          '<button class="btn btn-outline ' + sc + '" data-act="s06skip" data-perm="' + p.k + '">' + esc(S.common.notNow) + "</button></div>";
        return '<div class="permcard' + (got ? " done" : "") + '"><div class="prow">' + ic(p.icn) +
          '<div><div class="t-label ' + sc + '">' + esc(p.n) + '</div>' +
          '<button class="lspeak" data-act="speak" style="padding:0">' + ic("speaker") + '<span class="t-caption muted ' + sc + '">' + esc(p.w) + "</span></button></div></div>" + acts + "</div>";
      }).join("");
      var denied = st === "permission-denied"
        ? '<div class="card info"><div class="row">' + ic("pin") + '<div><div class="t-label ' + sc + '">' + esc(S.s06.deniedTitle) + '</div><div class="t-body ' + sc + '">' + esc(S.s06.deniedBody) + "</div></div></div></div>"
        : "";
      return '<div class="scr withmic"><div class="t-title ' + sc + '">' + esc(S.s06.title) + "</div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.s06.helper) + "</div>" + cards + denied +
        '<div class="footer">' + btn(esc(S.common.continue_), "s06continue", "btn-primary", sc) + "</div></div>";
    }
  };

  SCREENS["S-07"] = {
    name: "Biometric setup", off: "✅ works offline",
    states: ["default", "unavailable"], exit: "lock set / skipped", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var body = '<div class="scr withmic center"><div style="color:var(--md-primary);align-self:center">' +
        '<span class="ic" style="width:64px;height:64px"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC.finger + "</svg></span></div>" +
        '<div class="t-title ' + sc + '" style="text-align:center">' + esc(S.s07.title) + "</div>" +
        '<div class="t-body muted ' + sc + '" style="text-align:center">' + esc(S.s07.body) + "</div>";
      if (st === "unavailable") {
        body += '<div class="card info"><div class="row">' + ic("alert") + '<div class="t-body ' + sc + '">' + esc(S.s07.unavailable) + "</div></div></div>" +
          btn(esc(S.common.continue_), "s07skip", "btn-primary", sc);
      } else {
        body += btn(esc(S.s07.use), "s07use", "btn-primary", sc) +
          btn(esc(S.common.notNow), "s07skip", "btn-outline", sc);
      }
      return body + "</div>";
    }
  };

  SCREENS["F-01"] = {
    name: "Add field", off: "✅ queued offline",
    states: ["default", "queued"], exit: "field saved", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var units = ["guntha", "cent", "acre"];
      var unitLabel = { guntha: S.f01.unitGuntha, cent: S.f01.unitCent, acre: S.f01.unitAcre };
      var chips = units.map(function (u) {
        return '<button class="chipbtn ' + sc + (d.unit === u ? " on" : "") + '" data-act="f01unit" data-unit="' + u + '">' + esc(unitLabel[u]) + "</button>";
      }).join("");
      var body = '<div class="t-title ' + sc + '">' + esc(S.f01.title) + "</div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f01.name) + '</span>' +
        '<input class="' + sc + '" data-input="fieldName" value="' + esc(d.fieldName) + '" placeholder="' + esc(S.f01.nameHint) + '"></div>' +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f01.area) + '</span>' +
        '<input class="lang-en" inputmode="numeric" data-input="area" value="' + esc(d.area) + '" placeholder="2"></div>' +
        '<div class="chips">' + chips + "</div>";
      if (st === "queued") body += queuedCard(C, S.f01.queuedTitle, S.f01.queuedBody, "f01continue");
      else body += '<div class="footer">' + btn(esc(S.f01.save), "f01save", "btn-primary", sc) + "</div>";
      return '<div class="scr withmic">' + body + "</div>";
    }
  };

  SCREENS["F-02"] = {
    name: "Field location", off: "◐ partial offline",
    states: ["default", "loading", "manual", "permission-denied", "offline"], exit: "location set", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var title = '<div class="t-title ' + sc + '">' + esc(S.f02.title) + "</div>";
      function manualPicker() {
        var dopts = '<option value=""></option>' + DISTRICTS.map(function (x) {
          return '<option' + (d.district === x ? " selected" : "") + ">" + x + "</option>";
        }).join("");
        var vopts = '<option value=""></option>' + VILLAGES.map(function (x) {
          return '<option' + (d.village === x ? " selected" : "") + ">" + x + "</option>";
        }).join("");
        return '<div class="t-title ' + sc + '">' + esc(S.f02.manualTitle) + "</div>" +
          '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f02.district) + '</span><select class="lang-en" data-input="district">' + dopts + "</select></div>" +
          '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f02.village) + '</span><select class="lang-en" data-input="village">' + vopts + "</select></div>" +
          '<div class="footer">' + btn(esc(S.f02.confirm), "f02manualConfirm", "btn-primary", sc) + "</div>";
      }
      if (st === "manual") return '<div class="scr withmic">' + manualPicker() + "</div>";
      if (st === "loading") {
        return '<div class="scr withmic">' + title +
          '<div class="mapbox">' + terrain() + "</div>" + loadrow(S.f02.loading, sc) + "</div>";
      }
      if (st === "permission-denied") {
        return '<div class="scr withmic">' + title +
          '<div class="card info"><div class="row">' + ic("pin") + '<div class="t-body ' + sc + '">' + esc(S.f02.deniedBody) + "</div></div></div>" +
          btn(esc(S.f02.manualLink), "f02manual", "btn-primary", sc) + "</div>";
      }
      if (st === "offline") {
        return '<div class="scr withmic">' + title + offlineCard(C, S.f02.offlineBody, "") +
          btn(esc(S.f02.manualLink), "f02manual", "btn-primary", sc) + "</div>";
      }
      var pinned = d.pinned;
      return '<div class="scr withmic">' + title +
        '<div class="mapbox">' + terrain() + '<span class="pin"><svg viewBox="0 0 24 24" aria-hidden="true">' + IC.pin + "</svg></span></div>" +
        (pinned ? '<div class="t-caption muted ' + sc + '">' + esc(S.f02.pin) + "</div>" +
          btn(esc(S.f02.confirm), "f02confirm", "btn-primary", sc)
          : btn(esc(S.f02.gps), "f02gps", "btn-primary", sc)) +
        btn(esc(S.f02.manualLink), "f02manual", "btn-text", sc) + "</div>";
    }
  };

  SCREENS["F-03"] = {
    name: "Crop, variety, sowing date", off: "✅ queued offline",
    states: ["default", "listening", "readback", "queued"], exit: "crop confirmed", mic: true,
    micState: function (st, C) {
      if (st === "listening") return { cls: "listening", label: C.S.f03.listening };
      return null;
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var title = '<div class="t-title ' + sc + '">' + esc(S.f03.title) + "</div>";
      if (st === "readback") {
        var crop = d.crop || S.f03.cropChilli;
        var date = d.sowDate || S.f03.sampleDate;
        return '<div class="scr withmic">' + title +
          '<div class="card"><div class="t-label ' + sc + '">' + esc(S.f03.readbackTitle) + '</div>' +
          '<div class="t-bodylarge ' + sc + '">' + esc(fmt(S.f03.readbackBody, { crop: crop, date: date })) + "</div>" +
          '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(S.common.hearAgain) + "</button></div>" +
          btn(esc(S.f03.readbackOk), "f03ok", "btn-primary", sc) +
          btn(esc(S.f03.readbackAgain), "f03again", "btn-outline", sc) + "</div>";
      }
      if (st === "queued") {
        return '<div class="scr withmic">' + title + queuedCard(C, S.f01.queuedTitle, S.f01.queuedBody, "f03continue") + "</div>";
      }
      var crops = [S.f03.cropChilli, S.f03.cropTomato, S.f03.cropOkra].map(function (c) {
        return '<button class="chipbtn ' + sc + (d.crop === c ? " on" : "") + '" data-act="f03chip" data-crop="' + esc(c) + '">' + esc(c) + "</button>";
      }).join("");
      var listening = st === "listening";
      return '<div class="scr withmic">' + title +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f03.prompt) + "</div>" +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f03.orTap) + "</div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f03.crop) + '</span><div class="chips">' + crops + "</div></div>" +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f03.variety) + '</span>' +
        '<input class="' + sc + '" data-input="variety" value="' + esc(d.variety) + '" placeholder="' + esc(S.f03.varietyHint) + '"></div>' +
        '<div class="field"><span class="flabel ' + sc + '">' + esc(S.f03.date) + '</span>' +
        '<div class="fieldbox ' + sc + '">' + esc(d.sowDate || "") + "</div></div>" +
        (listening ? '<div class="iconline" style="justify-content:center;color:var(--md-primary)">' + ic("mic") + '<span class="t-label ' + sc + '">' + esc(S.f03.listening) + "</span></div>" : "") +
        "</div>";
    }
  };

  SCREENS["F-04"] = {
    name: "Assisted-mode banner", off: "✅ works offline",
    states: ["default"], exit: "acknowledged", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      return '<div class="scr withmic center">' +
        '<div class="card"><div class="row">' + ic("people") +
        '<div><div class="t-label ' + sc + '">' + esc(S.f04.title) + '</div>' +
        '<div class="t-body ' + sc + '">' + esc(S.f04.body) + "</div></div></div>" +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(S.common.listen) + "</button></div>" +
        btn(esc(S.f04.ack), "f04ack", "btn-primary", sc) + "</div>";
    }
  };

  SCREENS["F-05"] = {
    name: "Setup complete + first tip", off: "◐ partial offline",
    states: ["loading", "default", "offline"], exit: "→ F-10 Home", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "loading"; },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1400, function () { A.setSt("default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = '<div class="iconline checkmark">' + ic("check") + '<span class="t-caption ' + sc + '">' + esc(S.common.done) + "</span></div>" +
        '<div class="t-answer ' + sc + '">' + esc(S.f05.title) + "</div>";
      if (st === "loading") return '<div class="scr withmic center">' + head + loadrow(S.f05.loading, sc) + "</div>";
      if (st === "offline") {
        return '<div class="scr withmic center">' + head + offlineCard(C, S.f05.offlineBody, "") +
          btn(esc(S.f05.done), "chunknext", "btn-primary", sc) + "</div>";
      }
      return '<div class="scr withmic center">' + head +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f05.body) + "</div>" +
        '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — awaiting crop pack</span>' +
        '<div class="t-body muted ' + sc + '">' + esc(S.f05.tipPending) + "</div></div>" +
        btn(esc(S.f05.done), "chunknext", "btn-primary", sc) + "</div>";
    }
  };

  /* --------------------------------------------------- chunk configuration */
  window.KT.boot({
    subtitle: "01 · Onboarding — navigation-ia.md §3: S-01…S-07, F-01…F-05",
    seq: ["S-01", "S-02", "S-03", "S-04", "S-05", "S-06", "S-07", "F-01", "F-02", "F-03", "F-04", "F-05"],
    screens: SCREENS,
    links: {
      next: { href: "../02-home-crop/index.html", screen: "F-10", label: "02 · Home & crop" }
    },
    tileData: {
      "S-02": { default: { phone: "98765" }, error: { phone: "98765", errKind: "short" }, loading: { phone: "9876543210" }, offline: { phone: "9876543210" } },
      "S-03": { default: { otp: "42" }, loading: { otp: "428391" }, error: { otp: "428391" } },
      "F-01": { default: { area: "2" }, queued: { area: "2" } },
      "F-02": { manual: { district: "Warangal", village: "Duggondi" } }
    },
    freshData: function () {
      return {
        phone: "", otp: "", errKind: "", multiRole: false,
        perms: { mic: null, cam: null, loc: null, notif: null },
        fieldName: "", area: "", unit: "guntha",
        district: "", village: "", pinned: false,
        crop: "", variety: "", sowDate: ""
      };
    },
    onAct: function (act, el, A) {
      var d = A.data, S = A.S, state = A.state;
      switch (act) {
        case "lang":
          state.lang = el.getAttribute("data-lang");
          A.syncLang();
          if (state.screen === "S-01") { A.speakSim(); A.later(300, function () { A.go("S-02"); }); }
          else A.render();
          return true;
        case "key": {
          var k = el.getAttribute("data-key");
          if (state.screen === "S-02" && d.phone.length < 10) { d.phone += k; A.render(); }
          if (state.screen === "S-03" && d.otp.length < 6) {
            d.otp += k; A.render();
            if (d.otp.length === 6) {
              if (state.offline) A.later(350, function () { A.setSt("offline"); });
              else {
                A.later(350, function () {
                  A.setSt("loading");
                  A.later(1200, function () { if (d.otp === "000000") A.setSt("error"); else A.go("S-04"); });
                });
              }
            }
          }
          return true;
        }
        case "del":
          if (state.screen === "S-02") { d.phone = d.phone.slice(0, -1); A.render(); }
          if (state.screen === "S-03") { d.otp = d.otp.slice(0, -1); A.render(); }
          return true;
        case "s02continue":
          if (state.offline) { A.setSt("offline"); return true; }
          if (d.phone.length < 10) { d.errKind = "short"; A.setSt("error"); return true; }
          d.errKind = "";
          A.setSt("loading");
          A.later(1200, function () { A.go("S-03"); });
          return true;
        case "s03retry": d.otp = ""; A.setSt("default"); return true;
        case "s03resend": d.otp = ""; A.toast("New code sent (simulated)"); A.setSt("default"); return true;
        case "s04agree":
          if (state.offline) { A.setSt("offline"); return true; }
          A.go("S-05");
          return true;
        case "s05retry": A.go("S-05"); return true;
        case "s05continue": A.go("S-06"); return true;
        case "s06allow": d.perms[el.getAttribute("data-perm")] = "granted"; A.render(); return true;
        case "s06skip": d.perms[el.getAttribute("data-perm")] = "skipped"; A.render(); return true;
        case "s06continue": A.go("S-07"); return true;
        case "s07use": A.toast("Fingerprint enrolled (simulated)"); A.go("F-01"); return true;
        case "s07skip": A.go("F-01"); return true;
        case "f01unit": d.unit = el.getAttribute("data-unit"); A.render(); return true;
        case "f01save":
          if (state.offline) A.setSt("queued");
          else { A.toast("Field saved"); A.go("F-02"); }
          return true;
        case "f01continue": A.go("F-02"); return true;
        case "f02gps":
          if (d.perms.loc === "skipped") { A.setSt("permission-denied"); return true; }
          if (state.offline) { A.setSt("offline"); return true; }
          A.setSt("loading");
          A.later(1400, function () { d.pinned = true; A.setSt("default"); });
          return true;
        case "f02manual": A.setSt("manual"); return true;
        case "f02manualConfirm":
          if (!d.district) { A.toast("Pick a district first"); return true; }
          A.go("F-03");
          return true;
        case "f02confirm": A.go("F-03"); return true;
        case "mic":
          if (state.screen === "F-03") {
            if (state.st === "listening") {
              d.crop = d.crop || S.f03.cropChilli; d.sowDate = S.f03.sampleDate; A.setSt("readback"); A.speakSim();
            } else {
              A.setSt("listening");
              A.later(1800, function () {
                d.crop = d.crop || S.f03.cropChilli; d.sowDate = S.f03.sampleDate; A.setSt("readback"); A.speakSim();
              });
            }
            return true;
          }
          return false;
        case "f03chip": d.crop = el.getAttribute("data-crop"); A.render(); return true;
        case "f03again": d.sowDate = ""; A.setSt("default"); return true;
        case "f03ok":
          if (state.offline) A.setSt("queued");
          else { A.toast("Crop saved"); A.go("F-04"); }
          return true;
        case "f03continue": A.go("F-04"); return true;
        case "f04ack": A.go("F-05"); return true;
      }
      return false;
    }
  });
})();
