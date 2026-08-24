/* =============================================================================
   Chunk 07 — FPO. navigation-ia.md §6: P-01 (P1, read-only), P-02 (P1.5),
   P-03 (P1), P-04 (P1.5). P-05…P-07 are P2 and excluded.
   Same indigo role palette as dealer (.role-dealer, design-system §2.1);
   the SEMANTIC layer is identical everywhere (§1) — cluster-alert severity
   uses the same statusUrgent/statusCaution chips as the farmer's diagnosis.
   ============================================================================= */
(function () {
  "use strict";
  var K = window.KT;
  var esc = K.esc, ic = K.ic, btn = K.btn, appbar = K.appbar,
    packPlaceholder = K.packPlaceholder, terrain = K.terrain;

  function fhead(C, title, backGo) {
    var mic = '<button class="abmic" data-act="speak" aria-label="mic">' + ic("mic") + "</button>";
    return appbar(C, title, backGo, C.S.s05.roleFpo, mic);
  }
  function topnav(C, active) {
    var S = C.S, sc = C.sc;
    function tab(key, label, act) {
      return '<button class="tab' + (active === key ? " on" : "") + " " + sc + '" ' + act + ">" + esc(label) + "</button>";
    }
    return '<div class="topnav">' +
      tab("members", S.p.navMembers, 'data-act="goto" data-go="P-01"') +
      tab("alerts", S.p.navAlerts, 'data-act="goto" data-go="P-03"') +
      tab("demand", S.d.navDemand, 'data-act="stub" data-note="→ P-05 Pooled demand (P2)"') +
      tab("more", S.common.navMore, 'data-act="stub" data-note="FPO settings — later"') +
      "</div>";
  }
  function agedCard(C) {
    return '<div class="card neutral"><div class="row">' + ic("cloudOff") +
      '<div class="t-body ' + C.sc + '">' + esc(C.S.f10.offline) + " " + esc(C.S.f10.savedAge) + "</div></div></div>";
  }

  var SCREENS = {};

  SCREENS["P-01"] = {
    name: "Member list", off: "◐ cached offline",
    states: ["default", "offline"], exit: "read-only",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function member(name, village) {
        return '<div class="srow">' + ic("person") +
          '<div class="grow"><div class="t-body ' + sc + '">' + esc(name) + '</div>' +
          '<div class="t-caption muted"><span class="lang-en">' + esc(village) + "</span> · " +
          '<span class="' + sc + '">' + esc(S.f03.cropChilli) + '</span> · <span class="lang-en">2</span> <span class="' + sc + '">' + esc(S.f01.unitGuntha) + "</span></div></div>" +
          '<span class="ptag lang-en">PLACEHOLDER — stage</span></div>';
      }
      return '<div class="scr role-dealer">' + fhead(C, S.p.navMembers, null) + topnav(C, "members") +
        (st === "offline" ? agedCard(C) : "") +
        '<div class="t-caption muted ' + sc + '">' + esc(S.p01.readOnly) + "</div>" +
        member(S.s24.sampleName, "Duggondi") + member(S.d.name2, "Atmakur") +
        member(S.d.name3, "Parkal") + member(S.d.name4, "Duggondi") + "</div>";
    }
  };

  SCREENS["P-02"] = {
    name: "Crop map", off: "◐ cached offline",
    states: ["default", "offline"], exit: "village view",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function bubble(x, y, n, v) {
        return '<div style="position:absolute;left:' + x + "%;top:" + y + '%;transform:translate(-50%,-50%);text-align:center">' +
          '<div style="width:56px;height:56px;border-radius:50%;background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center" class="t-title lang-en">' + n + "</div>" +
          '<span class="t-caption lang-en">' + esc(v) + "</span></div>";
      }
      return '<div class="scr role-dealer">' + fhead(C, S.p02.title, null) + topnav(C, "members") +
        (st === "offline" ? agedCard(C) : "") +
        '<div class="mapbox" style="min-height:340px">' + terrain() +
        bubble(30, 30, 34, "Duggondi") + bubble(68, 45, 18, "Atmakur") + bubble(45, 75, 9, "Parkal") + "</div>" +
        '<div class="chips">' +
        '<span class="rolechip ' + sc + '">' + esc(S.f03.cropChilli) + "</span>" +
        '<span class="rolechip ' + sc + '">' + esc(S.f03.cropTomato) + "</span>" +
        '<span class="rolechip ' + sc + '">' + esc(S.f03.cropOkra) + "</span></div></div>";
    }
  };

  SCREENS["P-03"] = {
    name: "Cluster alerts", off: "✕ arrives by push",
    states: ["default", "empty", "offline"], exit: "open alert",
    entrySt: function (A) { return A.state.offline ? "offline" : "default"; },
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      var head = fhead(C, S.p03.title, null) + topnav(C, "alerts");
      if (st === "offline") {
        return '<div class="scr role-dealer">' + head +
          '<div class="card neutral"><div class="row">' + ic("cloudOff") + '<div class="t-body ' + sc + '">' + esc(C.S.common.needsSignal) + "</div></div></div></div>";
      }
      if (st === "empty") {
        return '<div class="scr role-dealer">' + head +
          '<div class="card healthy"><div class="row">' + ic("check") + '<div class="t-body ' + sc + '">' + esc(S.p03.emptyBody) + "</div></div></div></div>";
      }
      function alert(sev, sevLabel, spread, date) {
        return '<button class="card" style="width:100%;text-align:left" data-act="goto" data-go="P-04">' +
          '<span class="sevchip ' + sev + '">' + ic("alert") + esc(sevLabel) + "</span>" +
          '<span class="ptag lang-en">PLACEHOLDER — problem from diagnosis cluster</span>' +
          '<div class="t-body ' + sc + '">' + esc(spread) + '</div>' +
          '<div class="t-caption muted ' + sc + '">' + esc(date) + "</div></button>";
      }
      return '<div class="scr role-dealer">' + head +
        alert("urgent", S.f25.sevUrgent, S.p03.spread1, S.f03.sampleDate) +
        alert("caution", S.f25.sevCaution, S.p03.spread2, S.f42.date2) + "</div>";
    }
  };

  SCREENS["P-04"] = {
    name: "Alert detail", off: "◐ cached offline",
    states: ["default", "offline"], exit: "notify (P2)",
    render: function (st, C) {
      var sc = C.sc, S = C.S;
      function member(name, village) {
        return '<div class="srow">' + ic("person") +
          '<span class="grow t-body ' + sc + '">' + esc(name) + '</span>' +
          '<span class="t-caption muted lang-en">' + esc(village) + "</span></div>";
      }
      return '<div class="scr role-dealer">' + fhead(C, S.p04.title, "P-03") + topnav(C, "alerts") +
        (st === "offline" ? agedCard(C) : "") +
        '<span class="sevchip urgent">' + ic("alert") + esc(S.f25.sevUrgent) + "</span>" +
        '<div class="t-body ' + sc + '">' + esc(S.p03.spread1) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — problem from diagnosis cluster") +
        '<div class="t-label ' + sc + '">' + esc(S.p04.affected) + "</div>" +
        member(S.s24.sampleName, "Duggondi") + member(S.d.name2, "Atmakur") + member(S.d.name4, "Duggondi") +
        '<div class="t-label ' + sc + '">' + esc(S.p04.response) + "</div>" +
        packPlaceholder(C, "PLACEHOLDER — coordinated response from aggregation + crop pack") +
        btn(esc(S.p04.notify), "stub", "btn-primary", sc, 'data-note="→ P-07 Notify members (P2)"') + "</div>";
    }
  };

  window.KT.boot({
    subtitle: "07 · FPO — navigation-ia.md §6: P-01…P-04 (P-05…P-07 are P2)",
    seq: ["P-01", "P-02", "P-03", "P-04"],
    screens: SCREENS,
    links: {},
    tileData: {},
    freshData: function () { return {}; },
    onAct: function () { return false; }
  });
})();
