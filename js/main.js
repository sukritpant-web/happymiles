/* Happy Miles — light front-end behaviour only (no dependencies). */
(function () {
  "use strict";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close the menu after tapping a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Header shadow once the page scrolls
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Current year in the footer
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Enquiry form — submit via fetch and show an inline status (falls back to a
  // normal POST to send-enquiry.php if JS is unavailable).
  var form = document.getElementById("enquiry-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (statusEl) { statusEl.className = "form-status"; statusEl.textContent = ""; }
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      fetch(form.action, {
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest", "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && res.d && res.d.ok) {
            form.reset();
            if (statusEl) { statusEl.className = "form-status is-ok"; statusEl.textContent = res.d.message || "Thank you — your message has been sent."; }
          } else {
            if (statusEl) { statusEl.className = "form-status is-err"; statusEl.textContent = (res.d && res.d.message) || "Something went wrong. Please email info@happymiles.com.np."; }
          }
        })
        .catch(function () {
          if (statusEl) { statusEl.className = "form-status is-err"; statusEl.textContent = "Network error. Please email info@happymiles.com.np directly."; }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send enquiry"; }
        });
    });
  }

  // Reveal-on-scroll (respects reduced-motion via CSS)
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();
