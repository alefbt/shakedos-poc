/* ============================================================
   שקד — מאגר שאלות: סינון חי על תוכן סטטי
   הכרטיסים נטענים סטטית ב-HTML (קריאים לזחלנים ללא JS);
   הסקריפט בונה את סרגל הסינון ומסנן בהצגה/הסתרה.
   ============================================================ */
(function () {
  "use strict";

  var TYPE = {
    event: "שאלת אירוע", half: "חצי-אירוע", position: "עמדה",
    simple: "ידע פשוט", complex: "ידע מורכב", text: "מתוך טקסט"
  };
  var LEVEL = { 1: "קלה", 2: "בינונית", 3: "קשה" };
  var CHARACTER = { bagrut: "שאלת בגרות", practice: "שאלת תרגול" };

  var grid = document.getElementById("q-grid");
  var countEl = document.getElementById("q-count");
  var emptyEl = document.getElementById("q-empty");
  var clearBtn = document.getElementById("q-clear");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".q-card"));

  /* ---- מצב הסינון ---- */
  var state = { subject: "all", types: new Set(), levels: new Set(), characters: new Set() };

  /* ---- בניית צ'יפים ---- */
  function makeChip(value, label, group, extraClass) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "qchip" + (extraClass ? " " + extraClass : "");
    b.setAttribute("aria-pressed", "false");
    b.dataset.group = group;
    b.dataset.value = value;
    b.textContent = label;
    return b;
  }
  function buildGroup(containerId, map, group) {
    var c = document.getElementById(containerId);
    Object.keys(map).forEach(function (key) { c.appendChild(makeChip(key, map[key], group)); });
  }
  buildGroup("filter-type", TYPE, "types");
  buildGroup("filter-character", CHARACTER, "characters");
  (function () {
    var c = document.getElementById("filter-level");
    [1, 2, 3].forEach(function (n) {
      c.appendChild(makeChip(String(n), LEVEL[n] + " (" + n + ")", "levels", "qchip--lvl" + n));
    });
  })();

  var subjectBtns = Array.prototype.slice.call(document.querySelectorAll("[data-subject][aria-pressed]"));

  /* ---- התאמה וסינון ---- */
  function matches(card) {
    var d = card.dataset;
    if (state.subject !== "all" && d.subject !== state.subject) return false;
    if (state.types.size && !state.types.has(d.type)) return false;
    if (state.levels.size && !state.levels.has(d.level)) return false;
    if (state.characters.size && !state.characters.has(d.character)) return false;
    return true;
  }

  function apply() {
    var n = 0;
    cards.forEach(function (card) {
      var show = matches(card);
      card.classList.toggle("is-hidden", !show);
      if (show) n++;
    });
    countEl.textContent = n === 1 ? "תוצאה אחת" : n + " תוצאות";
    emptyEl.hidden = n !== 0;
    grid.hidden = n === 0;
  }

  /* ---- אירועים ---- */
  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".qchip");
    if (chip && chip.dataset.group) {
      var set = state[chip.dataset.group];
      var val = chip.dataset.value;
      var on = chip.getAttribute("aria-pressed") === "true";
      if (on) { set.delete(val); chip.setAttribute("aria-pressed", "false"); }
      else { set.add(val); chip.setAttribute("aria-pressed", "true"); }
      apply();
      return;
    }

    var more = e.target.closest(".q-card__more");
    if (more) {
      var det = document.getElementById(more.getAttribute("aria-controls"));
      var open = more.getAttribute("aria-expanded") === "true";
      more.setAttribute("aria-expanded", open ? "false" : "true");
      if (det) det.hidden = open;
      more.querySelector(".more-label").textContent = open ? "קרא עוד" : "סגור";
      return;
    }
  });

  subjectBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      state.subject = b.dataset.subject;
      subjectBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      apply();
    });
  });

  clearBtn.addEventListener("click", function () {
    state.subject = "all";
    state.types.clear(); state.levels.clear(); state.characters.clear();
    document.querySelectorAll(".qchip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    subjectBtns.forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.subject === "all" ? "true" : "false"); });
    apply();
  });

  apply();
})();
