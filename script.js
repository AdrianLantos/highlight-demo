var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function lazyPlayVideo(entry) {
    var video = entry.target.querySelector(".showcase-video");
    if (!video) return;

    if (entry.isIntersecting) {
        if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
        }
        if (video.src && !prefersReducedMotion) {
            video.play().catch(function () {
                // autoplay can still be rejected by the browser even when
                // muted (e.g. low-power mode) — fine to ignore
            });
        }
    } else {
        video.pause();
    }
}

(function () {
    "use strict";

    var cards = document.querySelectorAll(".highlight-project");
    if (!cards.length) return;

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


(function () {
  "use strict";

  var track = document.getElementById("newsCarousel");
  if (!track) return;

  var prevBtn = document.querySelector(".news-carousel-btn--prev");
  var nextBtn = document.querySelector(".news-carousel-btn--next");

  function scrollByCard(direction) {
    var card = track.querySelector(".news-card");
    if (!card) return;
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: (card.getBoundingClientRect().width + gap) * direction, behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(1); });

  function updateButtons() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
  }
  track.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons, { passive: true });
  updateButtons();
})();


(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  if (!nav) return;

  var revealThreshold = 160; // px scrolled before the nav is allowed to appear at all
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