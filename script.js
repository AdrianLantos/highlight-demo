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

  var isDown = false, startX, startScroll;
  track.addEventListener("pointerdown", function (e) {
    isDown = true;
    track.classList.add("is-dragging");
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener("pointerup", function () {
    isDown = false;
    track.classList.remove("is-dragging");
  });
  window.addEventListener("pointermove", function (e) {
    if (!isDown) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
})();