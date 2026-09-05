var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- smooth scroll (Lenis) ----
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

  window.lenis = lenis;

})();

// ---- nav reveal-on-scroll-up ----
(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  if (!nav) return;

  var revealThreshold = 60;
  var lastY = window.scrollY;
  var ticking = false;

  function update() {
    ticking = false;
    if (document.body.classList.contains("nav-modal-open")) return;
    var y = window.scrollY;

    if (y < revealThreshold) {
      nav.classList.remove("is-visible");
    } else if (y < lastY) {
      nav.classList.add("is-visible");
    } else if (y > lastY) {
      nav.classList.remove("is-visible");
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

// ---- mobile hamburger + modal ----
(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var modal = document.getElementById("navModal");
  var nav = document.getElementById("siteNav");
  if (!toggle || !modal) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-modal-open");
    document.body.style.overflow = "";
    if (window.lenis) window.lenis.start();
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-modal-open");
    document.body.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();
    if (nav) nav.classList.add("is-visible");
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

// ---- video autoplay ----
(function () {
  "use strict";

  var cards = document.querySelectorAll(".js-video-autoplay");
  if (!cards.length) return;

  var activeVideo = null;

  function lazyPlayVideo(entry) {
    var video = entry.target.querySelector(".showcase-video");
    if (!video) return;

    if (entry.isIntersecting) {
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
      }
      if (video.src && !prefersReducedMotion) {
        if (activeVideo && activeVideo !== video) {
          activeVideo.pause();
        }
        video.play().catch(function () {});
        activeVideo = video;
      }
    } else {
      video.pause();
      if (activeVideo === video) activeVideo = null;
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(lazyPlayVideo);
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();
