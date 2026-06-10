/* ============================================================
   שקד פתרונות פדגוגיים — Shared site chrome
   Injects header, mobile drawer, accessibility panel, and footer.
   Each page sets <body data-page="..."> to mark the active nav item.
   ============================================================ */
(function () {
  "use strict";

  /* ---- ניווט: שם הדף → קובץ ---- */
  var NAV = [
    { id: "home",      label: "דף הבית",      href: "index.html" },
    { id: "ezrahut",   label: "אזרחות",       href: "ezrahut.html" },
    { id: "history",   label: "היסטוריה",     href: "history.html" },
    { id: "questions", label: "מאגר שאלות",   href: "questions.html" },
    { id: "faq",       label: "שאלות נפוצות", href: "faq.html" },
    { id: "about",     label: "אודות",        href: "about.html" },
    { id: "order",     label: "הזמנה",        href: "order.html" }
  ];

  var current = document.body.getAttribute("data-page") || "home";

  /* ---- SVG icons ---- */
  var ICONS = {
    leaf:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M12 3C8 6 5 9.5 5 13.5A7 7 0 0 0 19 13.5C19 9.5 16 6 12 3Z" fill="#e8a72e"/>' +
      '<path d="M12 3C8 6 5 9.5 5 13.5A7 7 0 0 0 12 20.5V3Z" fill="#f6d089"/>' +
      '<path d="M12 9V21" stroke="#14283f" stroke-width="1.5" stroke-linecap="round"/></svg>',
    a11y:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none"/>' +
      '<path d="M4 8h16M9 8l1 5-1.5 7M15 8l-1 5 1.5 7"/></svg>',
    menu:
      '<svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    warn:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#f0d28e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>'
  };

  function navLinks(drawer) {
    return NAV.map(function (item) {
      var active = item.id === current ? ' aria-current="page"' : "";
      return '<li><a class="main-nav__link" href="' + item.href + '"' + active + '>' + item.label + "</a></li>";
    }).join("");
  }

  /* ============================================================
     Header
     ============================================================ */
  var headerHTML =
    '<header class="site-header">' +
      '<div class="container container--wide site-header__inner">' +
        '<a href="index.html" class="brand" aria-label="שקד פתרונות פדגוגיים — לעמוד הבית">' +
          '<span class="brand__mark">' + ICONS.leaf + "</span>" +
          '<span class="brand__text">' +
            '<span class="brand__name">שקד פתרונות פדגוגיים</span>' +
            '<span class="brand__tag">היסטוריה ואזרחות לחמ&quot;ד</span>' +
          "</span>" +
        "</a>" +

        '<nav class="main-nav" id="primary-nav" aria-label="ניווט ראשי">' +
          '<div class="drawer-head">' +
            '<span class="drawer-head__title">תפריט</span>' +
            '<button type="button" class="a11y-panel__close" data-nav-close aria-label="סגירת התפריט">' + ICONS.close + "</button>" +
          "</div>" +
          '<ul class="main-nav__list">' + navLinks() + "</ul>" +
          '<a href="order.html" class="btn btn--brand drawer-cta">לפרטים והזמנה</a>' +
        "</nav>" +

        '<div class="header-actions">' +
          '<a href="order.html" class="btn btn--brand btn--header-cta">לפרטים והזמנה</a>' +
          '<button type="button" class="a11y-toggle" id="a11y-toggle" aria-haspopup="dialog" aria-expanded="false" aria-controls="a11y-panel" aria-label="כלי נגישות">' + ICONS.a11y + "</button>" +
          '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="פתיחת תפריט הניווט">' + ICONS.menu + "</button>" +
        "</div>" +
      "</div>" +
    "</header>" +
    '<div class="nav-scrim" id="nav-scrim" hidden></div>';

  /* ============================================================
     Accessibility panel
     ============================================================ */
  var panelHTML =
    '<div class="a11y-panel" id="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-panel-title">' +
      '<div class="a11y-panel__head">' +
        '<span class="a11y-panel__title" id="a11y-panel-title">כלי נגישות</span>' +
        '<button type="button" class="a11y-panel__close" id="a11y-close" aria-label="סגירת פאנל הנגישות">' + ICONS.close + "</button>" +
      "</div>" +

      '<div class="a11y-group">' +
        '<span class="a11y-group__label">גודל טקסט</span>' +
        '<div class="a11y-seg" role="group" aria-label="גודל טקסט">' +
          '<button type="button" data-fs="1" aria-pressed="true">רגיל</button>' +
          '<button type="button" data-fs="1.15" aria-pressed="false">גדול</button>' +
          '<button type="button" data-fs="1.3" aria-pressed="false">גדול מאוד</button>' +
        "</div>" +
      "</div>" +

      '<div class="a11y-group">' +
        '<div class="a11y-toggle-row">' +
          '<span class="a11y-group__label" id="lbl-contrast" style="margin:0">ניגודיות גבוהה</span>' +
          '<button type="button" class="switch" id="sw-contrast" role="switch" aria-pressed="false" aria-labelledby="lbl-contrast"></button>' +
        "</div>" +
      "</div>" +

      '<div class="a11y-group">' +
        '<div class="a11y-toggle-row">' +
          '<span class="a11y-group__label" id="lbl-motion" style="margin:0">ביטול אנימציות</span>' +
          '<button type="button" class="switch" id="sw-motion" role="switch" aria-pressed="false" aria-labelledby="lbl-motion"></button>' +
        "</div>" +
      "</div>" +

      '<button type="button" class="a11y-reset" id="a11y-reset">איפוס הגדרות נגישות</button>' +
    "</div>";

  /* ============================================================
     Footer
     ============================================================ */
  var footerLinks = NAV.map(function (item) {
    return '<li><a href="' + item.href + '">' + item.label + "</a></li>";
  }).join("");

  var footerHTML =
    '<footer class="site-footer">' +
      '<div class="container container--wide">' +
        '<div class="site-footer__top">' +
          '<div class="footer-brand">' +
            '<div class="footer-brand__name">שקד פתרונות פדגוגיים</div>' +
            '<p class="footer-brand__desc">חומרי לימוד בהיסטוריה ובאזרחות לחינוך הממלכתי-דתי — חוברות, מצגות ומאגרי שאלות שנכתבו בידי מורים מהשטח.</p>' +
            '<div class="footer-contact">' +
              '<span>דוא&quot;ל: <a href="mailto:info@shaked-edu.co.il">info@shaked-edu.co.il</a></span>' +
              '<span>טלפון: <a href="tel:+972500000000">050-000-0000</a></span>' +
            "</div>" +
          "</div>" +
          '<nav class="footer-col" aria-label="ניווט בכותרת התחתונה">' +
            '<div class="footer-col__title">ניווט</div>' +
            "<ul>" + footerLinks + "</ul>" +
          "</nav>" +
          '<div class="footer-col">' +
            '<div class="footer-col__title">מידע</div>' +
            "<ul>" +
              '<li><a href="about.html#accessibility">הצהרת נגישות</a></li>' +
              '<li><a href="order.html">יצירת קשר והזמנה</a></li>' +
              '<li><a href="faq.html">שאלות נפוצות</a></li>' +
            "</ul>" +
          "</div>" +
        "</div>" +

        '<div class="site-footer__disclaimer">' + ICONS.warn +
          "<span>ההגדרות באתר אינן מדויקות ואין להסתמך עליהן לבחינת הבגרות.</span>" +
        "</div>" +

        '<div class="site-footer__bottom">' +
          '<span>© <span id="footer-year"></span> שקד פתרונות פדגוגיים. כל הזכויות שמורות.</span>' +
          '<span class="site-footer__bottom-links">' +
            '<a href="about.html#accessibility">הצהרת נגישות</a>' +
            '<a href="order.html">צור קשר</a>' +
          "</span>" +
        "</div>" +
      "</div>" +
    "</footer>";

  /* ============================================================
     Mount
     ============================================================ */
  var main = document.getElementById("main");
  document.body.insertAdjacentHTML("afterbegin", headerHTML);
  if (main) {
    main.insertAdjacentHTML("afterend", footerHTML);
  } else {
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  }
  document.body.insertAdjacentHTML("beforeend", panelHTML);

  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     Mobile drawer
     ============================================================ */
  var nav = document.getElementById("primary-nav");
  var navToggle = document.getElementById("nav-toggle");
  var scrim = document.getElementById("nav-scrim");
  var navCloseBtn = nav.querySelector("[data-nav-close]");
  var lastFocus = null;

  function isMobile() { return window.matchMedia("(max-width: 960px)").matches; }

  function openDrawer() {
    lastFocus = document.activeElement;
    nav.classList.add("is-drawer", "is-open");
    scrim.hidden = false;
    requestAnimationFrame(function () { scrim.classList.add("is-open"); });
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var first = nav.querySelector(".main-nav__link");
    if (first) first.focus();
  }
  function closeDrawer() {
    nav.classList.remove("is-open");
    scrim.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () {
      if (!nav.classList.contains("is-open")) {
        scrim.hidden = true;
        if (isMobile()) nav.classList.remove("is-drawer");
      }
    }, 360);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function toggleDrawer() {
    if (navToggle.getAttribute("aria-expanded") === "true") closeDrawer();
    else openDrawer();
  }

  navToggle.addEventListener("click", toggleDrawer);
  scrim.addEventListener("click", closeDrawer);
  if (navCloseBtn) navCloseBtn.addEventListener("click", closeDrawer);
  nav.addEventListener("click", function (e) {
    if (e.target.closest(".main-nav__link, .drawer-cta") && isMobile()) closeDrawer();
  });
  window.addEventListener("resize", function () {
    if (!isMobile()) {
      nav.classList.remove("is-drawer", "is-open");
      scrim.classList.remove("is-open");
      scrim.hidden = true;
      document.body.style.overflow = "";
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ============================================================
     Accessibility panel logic
     ============================================================ */
  var STORE = "shaked.a11y";
  var panel = document.getElementById("a11y-panel");
  var a11yToggle = document.getElementById("a11y-toggle");
  var a11yClose = document.getElementById("a11y-close");
  var fsButtons = Array.prototype.slice.call(panel.querySelectorAll("[data-fs]"));
  var swContrast = document.getElementById("sw-contrast");
  var swMotion = document.getElementById("sw-motion");
  var resetBtn = document.getElementById("a11y-reset");

  var prefs = { fs: "1", contrast: false, motion: false };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "{}");
    if (saved && typeof saved === "object") {
      prefs.fs = saved.fs || "1";
      prefs.contrast = !!saved.contrast;
      prefs.motion = !!saved.motion;
    }
  } catch (e) {}

  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) {}
  }

  function applyPrefs() {
    document.documentElement.style.setProperty("--user-fs", prefs.fs);
    fsButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-fs") === prefs.fs ? "true" : "false");
    });
    document.documentElement.classList.toggle("contrast-high", prefs.contrast);
    swContrast.setAttribute("aria-pressed", prefs.contrast ? "true" : "false");
    document.documentElement.classList.toggle("reduce-motion", prefs.motion);
    swMotion.setAttribute("aria-pressed", prefs.motion ? "true" : "false");
  }
  applyPrefs();

  function openPanel() {
    panel.classList.add("is-open");
    a11yToggle.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    panel.classList.remove("is-open");
    a11yToggle.setAttribute("aria-expanded", "false");
  }
  a11yToggle.addEventListener("click", function () {
    if (panel.classList.contains("is-open")) closePanel();
    else openPanel();
  });
  a11yClose.addEventListener("click", function () { closePanel(); a11yToggle.focus(); });

  fsButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      prefs.fs = b.getAttribute("data-fs");
      applyPrefs(); persist();
    });
  });
  swContrast.addEventListener("click", function () {
    prefs.contrast = !prefs.contrast; applyPrefs(); persist();
  });
  swMotion.addEventListener("click", function () {
    prefs.motion = !prefs.motion; applyPrefs(); persist();
  });
  resetBtn.addEventListener("click", function () {
    prefs = { fs: "1", contrast: false, motion: false };
    applyPrefs(); persist();
  });

  /* close panel on outside click */
  document.addEventListener("click", function (e) {
    if (!panel.classList.contains("is-open")) return;
    if (panel.contains(e.target) || a11yToggle.contains(e.target)) return;
    closePanel();
  });

  /* Esc closes panel / drawer */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (panel.classList.contains("is-open")) { closePanel(); a11yToggle.focus(); }
    if (navToggle.getAttribute("aria-expanded") === "true") closeDrawer();
  });
})();
