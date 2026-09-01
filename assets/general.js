// Shared across every page: reduced-motion flag, smooth scroll, and the
// site nav (reveal-on-scroll-up + mobile hamburger menu). 

var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Nav/footer on every page is plain static HTML (GitHub Pages project
// sites serve from a repo subpath, e.g. /repo-name/, so root-absolute
// URLs like the ones nav-footer.js used to generate would 404 there —
// hand-written relative paths per page sidestep that entirely). This
// file just wires up behavior against whatever markup is already in the
// DOM: smooth scroll, nav reveal-on-scroll, and the mobile hamburger
// menu (the latter two look up #siteNav/#navToggle/#navModal by id).
// nav-footer.js still exists in this folder but isn't loaded by any
// page right now — kept around in case the generator approach comes
// back later.

(function () {
  "use strict";

  if (prefersReducedMotion || typeof Lenis === "undefined") return;

  var lenis = new Lenis({
    autoRaf: true,
    autoToggle: true,
    anchors: true,
    allowNestedScroll: true,
    naiveDimensions: true,
    stopInertiaOnNavigate: true,
    duration: 1.8,
  });

})();

(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  if (!nav) return;

  var revealThreshold = 100; // px scrolled before the nav is allowed to appear at all
  var lastY = window.scrollY;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY;

    if (y < revealThreshold) {
      nav.classList.remove("is-visible");
    } else if (y < lastY) {
      nav.classList.add("is-visible"); // scrolling up
    } else if (y > lastY) {
      nav.classList.remove("is-visible"); // scrolling down
    }

    lastY = y;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
})();

(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var modal = document.getElementById("navModal");
  if (!toggle || !modal) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu(); else openMenu();
  });

  modal.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
})();
