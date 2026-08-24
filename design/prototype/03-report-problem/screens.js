/* =============================================================================
   Chunk 03 — Report a problem. navigation-ia.md §4: F-20…F-27, F-29, F-30
   (F-28 is P1.5, excluded). Framework: ../shared/proto.js.
   Diagnosis content (names, doses, precautions, how-to-tell) renders as marked
   placeholders — it comes only from diagnosis/treatment agents constrained by
   an approved crop pack, with agronomic-safety veto (root CLAUDE.md #1, #5).
   Severity is hue; confidence is fill — never both hue (design-system §2.4).
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, ic = K.ic, btn = K.btn, loadrow = K.loadrow,
    offlineCard = K.offlineCard, errorCard = K.errorCard, appbar = K.appbar,
    packPlaceholder = K.packPlaceholder;

  var SCREENS = {};

  /* helpers */
  function stepPrompt(S, step) { return [S.f20.step1, S.f20.step2, S.f20.step3][Math.min(step, 2)]; }
  function shotsRow(C) {
    var sc = C.sc, out = '<div class="shots">';
    for (var i = 0; i < 3; i++) {
      var got = C.data.shots[i];
      out += '<div class="shot' + (got ? " filled" : "") + '">' + ic(got ? "check" : "photo") +
        '<span class="t-caption lang-en">' + (i + 1) + "</span></div>";
    }
    return out + "</div>";
  }
  function transcriptCard(C, withToggle) {
    var sc = C.sc, S = C.S;
    var text = C.data.showEnglish
      ? '<div class="t-bodylarge lang-en">' + esc(S.f22.englishSample) + "</div>"
      : '<div class="t-bodylarge ' + sc + '">' + esc(S.f22.sample) + "</div>";
    var toggle = withToggle
      ? '<button class="engtoggle' + (C.data.showEnglish ? " on" : "") + '" data-act="engtoggle">' +
        '<span class="knob"></span><span class="t-caption ' + sc + '">' + esc(S.f22.toEnglish) + "</span></button>"
      : "";
    return '<div class="transcript"><span class="flabel ' + sc + '">' + esc(S.f22.transcriptLabel) + "</span>" +
      text + toggle + "</div>";
  }
  function confRow(C, filled, label) {
    var segs = "";
    for (var i = 1; i <= 3; i++) segs += '<span class="' + (i <= filled ? "on" : "") + '"></span>';
    return '<div class="confrow"><span class="flabel ' + C.sc + '">' + esc(C.S.f25.confLabel) + "</span>" +
      '<div class="confseg">' + segs + "</div>" +
      '<span class="t-caption ' + C.sc + '">' + esc(label) + "</span></div>";
  }

  SCREENS["F-20"] = {
    name: "Guided capture", off: "✅ queued offline",
    states: ["default", "permission-denied"], exit: "3 photos", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.f20.title, null);
      if (st === "permission-denied") {
        return '<div class="scr withmic">' + head +
          '<div class="card info"><div class="row">' + ic("camera") +
          '<div><div class="t-label ' + sc + '">' + esc(S.f20.deniedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f20.deniedBody) + "</div></div></div></div>" +
          btn(esc(S.f22.title), "f20byvoice", "btn-primary", sc) + "</div>";
      }
      return '<div class="scr withmic">' + head +
        '<div class="iconline"><span class="ic" style="color:var(--md-primary)"><svg viewBox="0 0 24 24" aria-hidden="true">' + K.IC.speaker + "</svg></span>" +
        '<span class="t-bodylarge ' + sc + '">' + esc(stepPrompt(S, d.step)) + "</span></div>" +
        '<div class="viewfinder"><div class="vf-guide"></div>' + ic("leaf") + "</div>" +
        shotsRow(C) +
        '<div class="shutterrow">' +
        '<button class="btn btn-text ' + sc + '" style="width:auto" data-act="f20skip">' + esc(S.f20.skipStep) + "</button>" +
        '<button class="shutter" data-act="f20shot" aria-label="' + esc(S.f20.shutter) + '">' + ic("camera") + "</button>" +
        '<button class="btn btn-text ' + sc + '" style="width:auto" data-act="goto" data-go="F-21">' + esc(S.f20.review) + "</button>" +
        '</div><div class="t-caption muted ' + sc + '" style="text-align:center">' + esc(S.f20.shutter) + "</div></div>";
    }
  };

  SCREENS["F-21"] = {
    name: "Image review", off: "✅ works offline",
    states: ["default", "empty"], exit: "photos ok", mic: true,
    entrySt: function (A) { return A.data.shots.some(Boolean) ? "default" : "empty"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.f21.title, "F-20");
      if (st === "empty" || !d.shots.some(Boolean)) {
        return '<div class="scr withmic">' + head +
          '<div class="card neutral"><div class="row">' + ic("photo") +
          '<div><div class="t-label ' + sc + '">' + esc(S.f21.emptyTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f21.emptyBody) + "</div></div></div></div>" +
          btn(esc(S.f21.toCamera), "goto", "btn-primary", sc, 'data-go="F-20"') +
          btn(esc(S.f22.title), "f20byvoice", "btn-outline", sc) + "</div>";
      }
      var cards = "";
      d.shots.forEach(function (got, i) {
        if (!got) return;
        cards += '<div class="photocard"><div class="pimg">' + ic("leaf") +
          '<span class="t-caption lang-en">' + (i + 1) + "</span></div>" +
          '<div class="pacts">' +
          '<button class="btn btn-outline ' + sc + '" data-act="f21retake" data-idx="' + i + '">' + esc(S.f21.retake) + "</button>" +
          '<button class="btn btn-text ' + sc + '" data-act="f21remove" data-idx="' + i + '">' + esc(S.f21.remove) + "</button></div></div>";
      });
      return '<div class="scr withmic">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(S.f21.helper) + "</div>" +
        '<div class="photogrid">' + cards + "</div>" +
        '<div class="footer">' + btn(esc(C.S.common.continue_), "goto", "btn-primary", sc, 'data-go="F-22"') + "</div></div>";
    }
  };

  SCREENS["F-22"] = {
    name: "Voice description", off: "✅ queued offline",
    states: ["default", "listening", "review", "blocked"], exit: "voice added", mic: true,
    micState: function (st, C) {
      if (st === "listening") return { cls: "listening", label: C.S.f03.listening };
      return null;
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f22.title, "F-21");
      if (st === "review") {
        return '<div class="scr withmic">' + head + transcriptCard(C, true) +
          btn(esc(C.S.common.continue_), "goto", "btn-primary", sc, 'data-go="F-23a"') +
          btn(esc(S.f03.readbackAgain), "f22again", "btn-outline", sc) + "</div>";
      }
      if (st === "blocked") {
        /* §8 blocked: polite, non-accusatory, redirect */
        return '<div class="scr withmic">' + head +
          '<div class="card info"><div class="row">' + ic("alert") +
          '<div><div class="t-label ' + sc + '">' + esc(S.f22.blockedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f22.blockedBody) + "</div></div></div></div>" +
          btn(esc(S.f03.readbackAgain), "f22again", "btn-primary", sc) + "</div>";
      }
      var listening = st === "listening"
        ? '<div class="iconline" style="justify-content:center;color:var(--md-primary)">' + ic("mic") +
          '<span class="t-label ' + sc + '">' + esc(S.f03.listening) + "</span></div>"
        : "";
      return '<div class="scr withmic">' + head +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f22.prompt) + "</div>" + listening +
        '<div class="grow"></div>' +
        '<div class="footer">' + btn(esc(C.S.common.notNow), "goto", "btn-outline", sc, 'data-go="F-23"') + "</div></div>";
    }
  };

  SCREENS["F-23a"] = {
    name: "Transcript confirm", off: "✕ needs signal",
    states: ["default", "loading", "offline"], exit: "confirmed", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "loading"; },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1300, function () { A.setSt("default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f23a.title, "F-22");
      if (st === "loading") return '<div class="scr withmic">' + head + loadrow(S.f23a.loading, sc) + "</div>";
      if (st === "offline") return '<div class="scr withmic">' + head + offlineCard(C, S.f23a.offline, "f23aRetry") + "</div>";
      function chip(label, val) {
        return '<div class="field"><span class="flabel ' + sc + '">' + esc(label) + '</span>' +
          '<div class="fieldbox ' + sc + '">' + esc(val) + "</div></div>";
      }
      return '<div class="scr withmic">' + head + transcriptCard(C, true) +
        '<div class="t-body muted ' + sc + '">' + esc(S.f23a.helper) + "</div>" +
        chip(S.f03.crop, S.f03.cropChilli) +
        chip(S.f23a.whereLabel, S.f23a.whereVal) +
        chip(S.f23a.symptomLabel, S.f23a.symptomVal) +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.hearAgain) + "</button>" +
        btn(esc(S.f03.readbackOk), "goto", "btn-primary", sc, 'data-go="F-23"') +
        btn(esc(S.f03.readbackAgain), "f22again", "btn-outline", sc) + "</div>";
    }
  };

  SCREENS["F-23"] = {
    name: "Submitted / queued", off: "✅ works offline",
    states: ["default", "queued"], exit: "case sent", mic: true,
    entrySt: function (A) { return A.state.offline ? "queued" : "default"; },
    micState: function (st) { return st === "queued" ? { cls: "queued" } : null; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f20.title, null);
      var main = st === "queued"
        ? '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-label ' + sc + '">' + esc(C.S.f01.queuedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f23.queuedBody) + "</div></div></div></div>"
        : '<div class="iconline checkmark">' + ic("check") + '<span class="t-answer ' + sc + '">' + esc(S.f23.sentTitle) + "</span></div>" +
          '<div class="t-bodylarge ' + sc + '">' + esc(S.f23.sentBody) + "</div>";
      return '<div class="scr withmic center">' + main +
        '<div class="card"><div class="t-label ' + sc + '">' + esc(S.f23.whatNext) + '</div>' +
        '<div class="t-body ' + sc + '">' + esc(S.f23.nextBody) + "</div></div>" +
        btn(esc(C.S.common.continue_), "goto", "btn-primary", sc, 'data-go="F-24"') + "</div>";
    }
  };

  SCREENS["F-24"] = {
    name: "Clarification", off: "✕ needs signal",
    states: ["default", "listening", "offline"], exit: "answered", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    micState: function (st, C) {
      if (st === "listening") return { cls: "listening", label: C.S.f03.listening };
      return null;
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f24.title, null);
      if (st === "offline") return '<div class="scr withmic">' + head + offlineCard(C, S.f24.offline, "f24retry") + "</div>";
      var listening = st === "listening"
        ? '<div class="iconline" style="justify-content:center;color:var(--md-primary)">' + ic("mic") +
          '<span class="t-label ' + sc + '">' + esc(S.f03.listening) + "</span></div>"
        : "";
      return '<div class="scr withmic">' + head +
        '<div class="card"><div class="row">' + ic("question") +
        '<div class="t-bodylarge ' + sc + '">' + esc(S.f24.q) + "</div></div>" +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.hearAgain) + "</button></div>" +
        '<div class="answers">' +
        btn(esc(S.f24.yes), "f24answer", "btn-primary", sc) +
        btn(esc(S.f24.no), "f24answer", "btn-primary", sc) +
        btn(esc(S.f24.dontKnow), "f24dontknow", "btn-outline", sc) +
        "</div>" + listening + "</div>";
    }
  };

  SCREENS["F-25"] = {
    name: "Diagnosis card", off: "✕ · cached after first load",
    states: ["loading", "default", "urgent", "healthy", "low-confidence", "offline"],
    exit: "where to get it (P1.5)", mic: true,
    entrySt: function (A) {
      if (A.state.offline) return A.data.diagLoaded ? "default" : "offline";
      return A.data.diagLoaded ? (A.data.lowConf ? "low-confidence" : "default") : "loading";
    },
    onEnter: function (A) {
      if (A.state.st === "loading") {
        A.later(1600, function () {
          A.data.diagLoaded = true;
          A.setSt(A.data.lowConf ? "low-confidence" : "default");
        });
      }
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f25.title, null);
      if (st === "loading") return '<div class="scr withmic">' + head + loadrow(S.f25.loading, sc) + "</div>";
      if (st === "offline") return '<div class="scr withmic">' + head + offlineCard(C, S.f25.offline, "") + "</div>";
      if (st === "healthy") {
        /* §2.3: healthy has no colour — outline, icon, sentence */
        return '<div class="scr withmic">' + head +
          '<div class="card healthy"><div class="row">' + ic("check") +
          '<div><div class="t-title ' + sc + '">' + esc(S.f25.healthyTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f25.healthyBody) + "</div></div></div></div>" +
          confRow(C, 3, S.f25.conf3) +
          btn(esc(C.S.f27.backHome), "chunkprev", "btn-primary", sc) + "</div>";
      }
      if (st === "low-confidence") {
        /* nav-ia §8: never hidden — say we are unsure, offer the expert */
        return '<div class="scr withmic">' + head +
          confRow(C, 1, S.f25.conf1) +
          '<div class="card"><div class="row">' + ic("question") +
          '<div class="t-bodylarge ' + sc + '">' + esc(S.f25.lowConfBody) + "</div></div></div>" +
          btn(esc(S.f25.askExpert), "goto", "btn-primary", sc, 'data-go="F-27"') +
          btn(esc(S.f26.retakeCta), "goto", "btn-outline", sc, 'data-go="F-20"') + "</div>";
      }
      var urgent = st === "urgent";
      var sev = urgent
        ? '<span class="sevchip urgent">' + ic("alert") + esc(S.f25.sevUrgent) + "</span>"
        : '<span class="sevchip caution">' + ic("alert") + esc(S.f25.sevCaution) + "</span>";
      function section(label, tag) {
        return '<div class="t-label ' + sc + '">' + esc(label) + "</div>" +
          '<div class="placeholder"><span class="ptag lang-en">' + esc(tag) + "</span></div>";
      }
      return '<div class="scr withmic">' + head + sev +
        confRow(C, urgent ? 3 : 2, urgent ? S.f25.conf3 : S.f25.conf2) +
        '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — diagnosis from crop pack</span>' +
        '<div class="t-body muted ' + sc + '">' + esc(C.S.common.packPending) + "</div></div>" +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(C.S.common.hearAgain) + "</button>" +
        section(S.f25.secWhat, "PLACEHOLDER — awaiting crop pack") +
        section(S.f25.secWhy, "PLACEHOLDER — awaiting crop pack") +
        section(S.f25.secWhen, "PLACEHOLDER — awaiting crop pack") +
        section(S.f25.secDose, "PLACEHOLDER — dose-math + agronomic-safety veto") +
        section(S.f25.secPrec, "PLACEHOLDER — safety block from crop pack") +
        section(S.f25.secAlt, "PLACEHOLDER — awaiting crop pack") +
        '<div class="footer">' +
        btn(esc(S.f25.gotIt), "goto", "btn-primary", sc, 'data-go="F-29"') +
        btn(esc(S.f28.title), "goto", "btn-outline", sc, 'data-go="F-28"') +
        btn(esc(S.f25.askExpert), "goto", "btn-text", sc, 'data-go="F-27"') + "</div></div>";
    }
  };

  SCREENS["F-28"] = {
    /* P1.5. Appears only after the recommendation is locked (nav-ia §4). */
    name: "Dealer availability", off: "✕ needs signal",
    states: ["default", "offline"], exit: "alt: confusion pair", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f28.title, "F-25");
      if (st === "offline") return '<div class="scr withmic">' + head + offlineCard(C, C.S.common.needsSignal, "f28retry") + "</div>";
      function dealer(name, dist) {
        return '<div class="card"><div class="row">' + ic("store") +
          '<div class="grow" style="flex:1"><div class="t-label lang-en">' + esc(name) + '</div>' +
          '<div class="t-caption muted lang-en">' + esc(dist) + "</div></div>" +
          '<div class="pstate">' + ic("check") + '<span class="t-caption ' + sc + '">' + esc(S.f28.hasStock) + "</span></div></div></div>";
      }
      return '<div class="scr withmic">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(S.f28.helper) + "</div>" +
        '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — intervention class from input-match</span></div>' +
        dealer("Sri Agro, Duggondi", "2 km") +
        dealer("Krishna Agro, Atmakur", "5 km") +
        '<div class="t-caption muted ' + sc + '">' + esc(S.s04.p2) + "</div></div>";
    }
  };

  SCREENS["F-26"] = {
    name: "Confusion-pair card", off: "✕ needs signal",
    states: ["default"], exit: "alt: expert", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f26.title, "F-25");
      function opt(label) {
        return '<div class="card"><div class="t-label ' + sc + '">' + esc(label) + "</div>" +
          '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — from declared confusion pair</span></div>' +
          '<span class="flabel ' + sc + '">' + esc(S.f26.howToTell) + "</span>" +
          '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — awaiting crop pack</span></div></div>';
      }
      return '<div class="scr withmic">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(S.f26.helper) + "</div>" +
        opt(S.f26.optA) + opt(S.f26.optB) +
        btn(esc(S.f26.retakeCta), "goto", "btn-primary", sc, 'data-go="F-20"') +
        btn(esc(S.f25.askExpert), "goto", "btn-outline", sc, 'data-go="F-27"') + "</div>";
    }
  };

  SCREENS["F-27"] = {
    name: "Expert pending", off: "◐ partial offline",
    states: ["default", "offline"], exit: "T+48h", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f27.title, null);
      var stale = st === "offline"
        ? '<div class="card neutral"><div class="row">' + ic("cloudOff") + '<div class="t-body ' + sc + '">' + esc(S.f27.offlineNote) + "</div></div></div>"
        : "";
      return '<div class="scr withmic center">' + head +
        '<div style="color:var(--md-primary);align-self:center"><span class="ic" style="width:64px;height:64px"><svg viewBox="0 0 24 24" aria-hidden="true">' + K.IC.person + "</svg></span></div>" +
        '<div class="t-title ' + sc + '" style="text-align:center">' + esc(S.f27.body) + "</div>" + stale +
        '<div class="card"><div class="row">' + ic("history") + '<div class="t-body ' + sc + '">' + esc(S.f27.eta) + "</div></div>" +
        '<div class="row">' + ic("bell") + '<div class="t-body ' + sc + '">' + esc(S.f27.notify) + "</div></div></div>" +
        btn(esc(S.f27.backHome), "f27home", "btn-primary", sc) + "</div>";
    }
  };

  SCREENS["F-29"] = {
    name: "Action confirm", off: "✅ queued offline",
    states: ["default", "queued"], exit: "T+48h follow-up", mic: true,
    micState: function (st) { return st === "queued" ? { cls: "queued" } : null; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f29.title, null);
      if (st === "queued") {
        return '<div class="scr withmic">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-label ' + sc + '">' + esc(C.S.f01.queuedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f29.queuedBody) + "</div></div></div>" +
          btn(esc(C.S.common.continue_), "goto", "btn-primary", sc, 'data-go="F-30"') + "</div></div>";
      }
      return '<div class="scr withmic">' + head +
        '<div class="t-body muted ' + sc + '">' + esc(S.f29.helper) + "</div>" +
        '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — the advised treatment, from the case</span></div>' +
        '<div class="answers">' +
        btn(ic("check") + esc(S.f29.didIt), "f29answer", "btn-primary", sc) +
        btn(ic("minus") + esc(S.f29.skipped), "f29answer", "btn-outline", sc) +
        btn(ic("history") + esc(S.f29.later), "f29answer", "btn-outline", sc) +
        "</div></div>";
    }
  };

  SCREENS["F-30"] = {
    name: "Follow-up", off: "✅ queued offline",
    states: ["default", "done", "queued"], exit: "outcome logged", mic: true,
    micState: function (st) { return st === "queued" ? { cls: "queued" } : null; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f30.title, null);
      if (st === "done") {
        return '<div class="scr withmic center">' +
          '<div class="iconline checkmark">' + ic("check") + '<span class="t-answer ' + sc + '">' + esc(S.f30.doneTitle) + "</span></div>" +
          '<div class="t-bodylarge ' + sc + '">' + esc(S.f30.doneBody) + "</div>" +
          btn(esc(C.S.f27.backHome), "f27home", "btn-primary", sc) + "</div>";
      }
      if (st === "queued") {
        return '<div class="scr withmic">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-label ' + sc + '">' + esc(C.S.f01.queuedTitle) + '</div>' +
          '<div class="t-body ' + sc + '">' + esc(S.f29.queuedBody) + "</div></div></div>" +
          btn(esc(C.S.f27.backHome), "f27home", "btn-primary", sc) + "</div></div>";
      }
      return '<div class="scr withmic">' + head +
        '<div class="answers">' +
        btn(ic("up") + esc(S.f30.better), "f30answer", "btn-primary", sc) +
        btn(ic("minus") + esc(S.f30.same), "f30answer", "btn-outline", sc) +
        btn(ic("downtrend") + esc(S.f30.worse), "f30answer", "btn-outline", sc) +
        "</div></div>";
    }
  };

  /* --------------------------------------------------- chunk configuration */
  window.KT.boot({
    subtitle: "03 · Report a problem — navigation-ia.md §4: F-20…F-27, F-29, F-30",
    seq: ["F-20", "F-21", "F-22", "F-23a", "F-23", "F-24", "F-25", "F-28", "F-26", "F-27", "F-29", "F-30"],
    screens: SCREENS,
    links: {
      prev: { href: "../02-home-crop/index.html", screen: "F-10", label: "02 · Home & crop" },
      next: { href: "../04-ask-history/index.html", screen: "F-40", label: "04 · Ask & history" }
    },
    tileData: {
      "F-20": { default: { shots: [true, false, false], step: 1 } },
      "F-21": { default: { shots: [true, true, true] } },
      "F-22": { review: { voiceDone: true } },
      "F-23a": { default: { voiceDone: true } },
      "F-25": { "low-confidence": { lowConf: true, diagLoaded: true } }
    },
    freshData: function () {
      return {
        shots: [false, false, false], step: 0,
        voiceDone: false, showEnglish: false,
        diagLoaded: false, lowConf: false
      };
    },
    onAct: function (act, el, A) {
      var d = A.data, S = A.S, state = A.state;
      switch (act) {
        case "f20shot": {
          var i = d.shots.indexOf(false);
          if (i >= 0) { d.shots[i] = true; d.step = Math.min(i + 1, 2); }
          if (d.shots.every(Boolean)) A.go("F-21");
          else A.render();
          return true;
        }
        case "f20skip":
          d.step += 1;
          if (d.step > 2) A.go("F-21");
          else A.render();
          return true;
        case "f20byvoice": A.go("F-22"); return true;
        case "f21retake":
          d.shots[parseInt(el.getAttribute("data-idx"), 10)] = false;
          d.step = parseInt(el.getAttribute("data-idx"), 10);
          A.go("F-20");
          return true;
        case "f21remove": {
          d.shots[parseInt(el.getAttribute("data-idx"), 10)] = false;
          if (d.shots.some(Boolean)) A.render(); else A.setSt("empty");
          return true;
        }
        case "mic":
          if (state.screen === "F-22") {
            if (state.st === "listening") { d.voiceDone = true; A.setSt("review"); }
            else {
              A.setSt("listening");
              A.later(2000, function () { d.voiceDone = true; A.setSt("review"); });
            }
            return true;
          }
          if (state.screen === "F-24") {
            A.setSt("listening");
            A.later(1600, function () { A.go("F-25"); });
            return true;
          }
          return false;
        case "f22again": d.voiceDone = false; A.go("F-22", "default"); return true;
        case "engtoggle": d.showEnglish = !d.showEnglish; A.render(); return true;
        case "f23aRetry": A.go("F-23a"); return true;
        case "f24retry": A.go("F-24"); return true;
        case "f28retry": A.go("F-28"); return true;
        case "f24answer": A.go("F-25"); return true;
        case "f24dontknow": d.lowConf = true; A.go("F-25"); return true;
        case "f29answer":
          if (state.offline) A.setSt("queued");
          else { A.toast("Saved to the outcome ledger (simulated)"); A.go("F-30"); }
          return true;
        case "f30answer":
          if (state.offline) A.setSt("queued");
          else A.setSt("done");
          return true;
        case "f27home":
          location.href = "../02-home-crop/index.html#mode=flow&screen=F-10&state=default&lang=" + state.lang;
          return true;
      }
      return false;
    }
  });
})();
