// Shared across every page: reduced-motion flag, smooth scroll, and the
// site nav (reveal-on-scroll-up + mobile hamburger menu). 

var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Nav/footer markup generation (for pages that use it) lives in
// nav-footer.js, loaded before this file on those pages — see that
// file's header comment. The homepage keeps plain static HTML for both
// instead, so it's not affected by any of this. What stays here applies
// to every page regardless: smooth scroll, nav reveal-on-scroll, and the
// mobile hamburger menu (the latter two just look up #siteNav/#navToggle/
// #navModal by id, wherever those came from).

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
