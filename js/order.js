/* ============================================================
   שקד — עמוד הזמנה: ולידציה נגישה
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("order-form");
  if (!form) return;

  var summary = document.getElementById("form-errsummary");
  var summaryList = document.getElementById("form-errsummary-list");
  var successPanel = document.getElementById("form-success");

  /* כללי ולידציה לכל שדה */
  var RULES = {
    name:    { required: true, msg: "יש להזין שם מלא." },
    school:  { required: true, msg: "יש להזין את שם בית הספר." },
    phone:   { required: true, re: /^[0-9\-+()\s]{9,15}$/, msg: "יש להזין מספר טלפון תקין (לפחות 9 ספרות)." },
    email:   { required: true, re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "יש להזין כתובת אימייל תקינה." },
    product: { required: true, msg: "יש לבחור מוצר מהרשימה." }
  };

  function fieldEl(name) { return form.elements[name]; }
  function errEl(name) { return document.getElementById("err-" + name); }

  function showError(name, message) {
    var el = fieldEl(name);
    var err = errEl(name);
    el.setAttribute("aria-invalid", "true");
    if (err) {
      err.querySelector(".msg").textContent = message;
      err.classList.add("is-visible");
    }
  }

  function clearError(name) {
    var el = fieldEl(name);
    var err = errEl(name);
    el.setAttribute("aria-invalid", "false");
    if (err) err.classList.remove("is-visible");
  }

  function validateField(name) {
    var rule = RULES[name];
    if (!rule) return true;
    var el = fieldEl(name);
    var val = (el.value || "").trim();

    if (rule.required && !val) { showError(name, rule.msg); return false; }
    if (val && rule.re && !rule.re.test(val)) { showError(name, rule.msg); return false; }
    clearError(name);
    return true;
  }

  /* ולידציה חיה אחרי האינטראקציה הראשונה */
  Object.keys(RULES).forEach(function (name) {
    var el = fieldEl(name);
    if (!el) return;
    el.addEventListener("blur", function () { validateField(name); });
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid") === "true") validateField(name);
    });
    el.addEventListener("change", function () {
      if (el.getAttribute("aria-invalid") === "true") validateField(name);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var invalid = [];
    Object.keys(RULES).forEach(function (name) {
      if (!validateField(name)) {
        invalid.push({ name: name, label: fieldEl(name).getAttribute("data-label") || name });
      }
    });

    if (invalid.length) {
      /* סיכום שגיאות נגיש בראש הטופס */
      summaryList.innerHTML = invalid.map(function (f) {
        return '<li><a href="#' + f.name + '">' + f.label + "</a></li>";
      }).join("");
      summary.classList.add("is-visible");
      summary.setAttribute("tabindex", "-1");
      summary.focus();
      return;
    }

    summary.classList.remove("is-visible");

    /* הצלחה (הדגמה — ללא שליחה אמיתית לשרת) */
    form.hidden = true;
    successPanel.classList.add("is-visible");
    successPanel.setAttribute("tabindex", "-1");
    successPanel.focus();
  });

  /* קישור מסיכום השגיאות אל השדה */
  summaryList.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    e.preventDefault();
    var name = a.getAttribute("href").slice(1);
    var el = fieldEl(name);
    if (el) el.focus();
  });
})();
