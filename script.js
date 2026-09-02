// ---- news carousel ----
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