/* =============================================================================
   Chunk 02 — Farmer home & crop. navigation-ia.md §4: F-10…F-14.
   Framework: ../shared/proto.js. Continues chunk 01 (F-05 → F-10).
   Agronomic content (stage names, tasks, weather decisions) renders as marked
   placeholders — it comes only from an approved crop pack (root CLAUDE.md #5).
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, fmt = K.fmt, ic = K.ic, btn = K.btn, loadrow = K.loadrow,
    offlineCard = K.offlineCard, errorCard = K.errorCard, appbar = K.appbar,
    packPlaceholder = K.packPlaceholder;

  function fieldName(C, idx) { return idx === 1 ? C.S.f14.sample2 : C.S.f14.sample1; }

  var SCREENS = {};

  SCREENS["F-10"] = {
    name: "Home — four tiles", off: "◐ cached offline",
    states: ["default", "loading", "offline"], exit: "tap My crop",
    nav: "home", mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : (A.data.homeLoaded ? "default" : "loading"); },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1100, function () { A.data.homeLoaded = true; A.setSt("default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, "KrishiTech", null);
      var fchip = '<button class="chipbtn ' + sc + '" data-act="goto" data-go="F-14">' + ic("pin") +
        esc(fieldName(C, d.currentField)) + ic("down") + "</button>";
      if (st === "loading") return '<div class="scr withnav">' + head + fchip + loadrow(S.f10.loading, sc) + "</div>";
      var offline = st === "offline"
        ? '<div class="card neutral"><div class="row">' + ic("cloudOff") +
          '<div><div class="t-body ' + sc + '">' + esc(S.f10.offline) + '</div>' +
          '<div class="t-caption muted ' + sc + '">' + esc(S.f10.savedAge) + "</div></div></div></div>"
        : "";
      function tile(icn, label, sub, act) {
        return '<button class="hometile" ' + act + ">" + ic(icn) +
          '<span class="t-label ' + sc + '">' + esc(label) + "</span>" +
          (sub ? '<span class="hsub ' + sc + '">' + sub + "</span>" : "") + "</button>";
      }
      var tiles = '<div class="tilegrid">' +
        tile("leaf", S.f10.myCrop, esc(S.f03.cropChilli) + ' · ' + esc(fmt(S.f11.sown, { date: S.f03.sampleDate })), 'data-act="goto" data-go="F-11"') +
        tile("sun", S.f10.weather, '<span class="lang-en">31°</span> · 60% ' + esc(S.f13.rain), 'data-act="goto" data-go="F-13"') +
        tile("camera", S.f10.report, "", 'data-act="chunknext"') +
        tile("chat", S.f10.ask, "", 'data-act="navx" data-target="F-40" data-dir="04-ask-history"') +
        "</div>";
      return '<div class="scr withnav">' + head + fchip + offline + tiles + "</div>";
    }
  };

  SCREENS["F-11"] = {
    name: "Crop timeline", off: "✅ works offline",
    states: ["default"], exit: "open a task",
    nav: "crop", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.f11.title, "F-10");
      var cropCard = '<div class="card"><div class="row">' + ic("leaf") +
        '<div><div class="t-title ' + sc + '">' + esc(S.f03.cropChilli) + '</div>' +
        '<div class="t-caption muted ' + sc + '">' + esc(fmt(S.f11.sown, { date: S.f03.sampleDate })) + " · " + esc(fieldName(C, d.currentField)) + "</div></div></div></div>";
      var tasks = [1, 2, 3].map(function (n) {
        return '<button class="taskrow" data-act="goto" data-go="F-12">' + ic("calendar") +
          '<span class="grow"><span class="ptag lang-en">PLACEHOLDER · task ' + n + "</span></span>" + ic("next") + "</button>";
      }).join("");
      return '<div class="scr withnav">' + head + cropCard +
        '<div class="t-label ' + sc + '">' + esc(S.f11.stageNow) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — stage from crop pack") +
        '<div class="t-label ' + sc + '">' + esc(S.f11.nextTasks) + "</div>" + tasks + "</div>";
    }
  };

  SCREENS["F-12"] = {
    name: "Task detail", off: "✅ works offline",
    states: ["default"], exit: "back → weather tile",
    nav: "crop", mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f12.title + " 1", "F-11");
      function section(label, full) {
        var inner = full
          ? packPlaceholder(C, "PLACEHOLDER — awaiting crop pack")
          : '<div class="placeholder"><span class="ptag lang-en">PLACEHOLDER — awaiting crop pack</span></div>';
        return '<div class="t-label ' + sc + '">' + esc(label) + "</div>" + inner;
      }
      return '<div class="scr withnav">' + head +
        '<button class="btn btn-tonal ' + sc + '" data-act="speak">' + ic("speaker") + esc(S.common.listen) + "</button>" +
        section(S.f12.what, true) +
        section(S.f12.why) +
        section(S.f12.when) +
        section(S.f12.how) + "</div>";
    }
  };

  SCREENS["F-13"] = {
    name: "Weather → action", off: "◐ partial offline",
    states: ["default", "loading", "degraded", "offline", "error"], exit: "back → field chip",
    nav: true, mic: true,
    entrySt: function (A) { return A.state.offline ? "offline" : (A.data.wxLoaded ? "default" : "loading"); },
    onEnter: function (A) {
      if (A.state.st === "loading") A.later(1200, function () { A.data.wxLoaded = true; A.setSt("default"); });
    },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = appbar(C, S.f13.title, "F-10");
      if (st === "loading") return '<div class="scr withnav">' + head + loadrow(S.f13.loading, sc) + "</div>";
      if (st === "error") return '<div class="scr withnav">' + head + errorCard(C, S.f13.error, "f13retry") + "</div>";
      function wrow(day, icn, temp, rainPct) {
        return '<div class="weatherrow"><span class="wday t-body ' + sc + '">' + esc(day) + "</span>" + ic(icn) +
          '<span class="t-body lang-en">' + temp + "</span>" +
          '<span class="wrain t-caption"><span class="lang-en">' + rainPct + "%</span> " + '<span class="' + sc + '">' + esc(S.f13.rain) + "</span></span></div>";
      }
      var forecast = '<div class="t-label ' + sc + '">' + esc(S.f13.forecastTitle) + "</div>" +
        '<div class="card">' +
        wrow(S.f13.today, "rain", "31°", 60) +
        wrow(S.f13.tomorrow, "cloudSun", "32°", 20) +
        wrow(S.f13.day3, "sun", "33°", 10) +
        wrow(S.f13.day4, "rain", "31°", 40) + "</div>";
      var decision = '<div class="t-label ' + sc + '">' + esc(S.f13.decisionTitle) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — decision from weather agent + crop pack");
      /* §8 degraded: data age stated explicitly, decision first, forecast second */
      if (st === "degraded") {
        return '<div class="scr withnav">' + head +
          '<div class="card info"><div class="row">' + ic("alert") + '<div class="t-body ' + sc + '">' + esc(S.f13.stale) + "</div></div></div>" +
          decision + forecast + "</div>";
      }
      if (st === "offline") {
        return '<div class="scr withnav">' + head + offlineCard(C, S.f13.offlineBody, "f13retry") + decision + forecast + "</div>";
      }
      return '<div class="scr withnav">' + head +
        '<div class="t-caption muted ' + sc + '">' + esc(S.f13.updated) + "</div>" +
        decision + forecast + "</div>";
    }
  };

  SCREENS["F-14"] = {
    name: "Field switcher", off: "✅ works offline",
    states: ["default", "single"], exit: "field picked → Home",
    nav: true, mic: true,
    render: function (st, C) {
      var sc = C.sc, S = C.S, d = C.data;
      var head = appbar(C, S.f14.title, "F-10");
      function fcard(idx) {
        var on = d.currentField === idx;
        return '<button class="card fieldcard' + (on ? " on" : "") + '" data-act="f14pick" data-idx="' + idx + '"><div class="row">' + ic("leaf") +
          '<div class="grow" style="flex:1;text-align:left"><div class="t-label ' + sc + '">' + esc(fieldName(C, idx)) + '</div>' +
          '<div class="t-caption muted"><span class="lang-en">2</span> <span class="' + sc + '">' + esc(S.f01.unitGuntha) + "</span> · " +
          '<span class="' + sc + '">' + esc(S.f03.cropChilli) + "</span></div></div>" +
          (on ? '<div class="pstate">' + ic("check") + '<span class="t-caption ' + sc + '">' + esc(S.f14.selected) + "</span></div>" : "") +
          "</div></button>";
      }
      var body;
      if (st === "single") {
        body = fcard(0) +
          '<div class="card info"><div class="row">' + ic("leaf") + '<div class="t-body ' + sc + '">' + esc(S.f14.single) + "</div></div></div>";
      } else {
        body = fcard(0) + fcard(1);
      }
      return '<div class="scr withnav">' + head + body +
        '<button class="btn btn-outline ' + sc + '" data-act="f14add">' + ic("edit") + esc(S.f14.add) + "</button></div>";
    }
  };

  /* --------------------------------------------------- chunk configuration */
  window.KT.boot({
    subtitle: "02 · Home & crop — navigation-ia.md §4: F-10…F-14",
    seq: ["F-10", "F-11", "F-12", "F-13", "F-14"],
    screens: SCREENS,
    links: {
      prev: { href: "../01-onboarding/index.html", screen: "F-05", label: "01 · Onboarding" },
      next: { href: "../03-report-problem/index.html", screen: "F-20", label: "03 · Report a problem" }
    },
    tileData: {},
    freshData: function () {
      return { currentField: 0, homeLoaded: false, wxLoaded: false };
    },
    onAct: function (act, el, A) {
      switch (act) {
        case "f14pick":
          A.data.currentField = parseInt(el.getAttribute("data-idx"), 10) || 0;
          A.go("F-10");
          return true;
        case "f14add":
          location.href = "../01-onboarding/index.html#mode=flow&screen=F-01&state=default&lang=" + A.state.lang;
          return true;
        case "f13retry":
          A.setSt("loading");
          A.later(1200, function () { A.data.wxLoaded = true; A.setSt("default"); });
          return true;
      }
      return false;
    }
  });
})();
