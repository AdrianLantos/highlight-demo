(function () {
  "use strict";
 
  // page-specific code goes here
 
})();
 
/* =========================================================================
   SHOWCASE — sticky text + video cards
   -------------------------------------------------------------------------
   Not part of the pin/track engine on purpose: this is discrete cards
   the user scrolls past one at a time, not one continuous progress
   value. One shared IntersectionObserver drives both the text swap
   and the video play/pause together, so they can't disagree about
   which card is "active" at a boundary the way two separate
   mechanisms could.
 
   rootMargin "-40% 0px -40% 0px" shrinks the observer's effective
   viewport to a thin band across the vertical center of the screen —
   a card is only considered "active" once it's roughly centered,
   matching "takes up most of the viewport" rather than firing the
   instant a sliver of it appears at the edge.
 
   Video src is set lazily, the first time a card becomes active —
   nothing downloads until it's actually about to play. Autoplay is
   skipped under prefers-reduced-motion; the text swap and lazy-load
   still happen either way, only .play() is withheld.
   ========================================================================= */
 
(function () {
  "use strict";
 
  var cards = document.querySelectorAll(".showcase-card");
  if (!cards.length) return;
 
  var textItems = document.querySelectorAll(".showcase-text-item");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
  function setActiveText(index) {
    textItems.forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.index === index);
    });
  }
 
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var card = entry.target;
        var video = card.querySelector(".showcase-video");
        var index = card.dataset.index;
 
        if (entry.isIntersecting) {
          setActiveText(index);
 
          if (video) {
            if (!video.src && video.dataset.src) {
              video.src = video.dataset.src;
            }
            if (video.src && !prefersReducedMotion) {
              video.play().catch(function () {
                // autoplay can still be rejected by the browser even
                // when muted (e.g. low-power mode) — fine to ignore
              });
            }
          }
        } else if (video) {
          video.pause();
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );
 
  cards.forEach(function (card) {
    observer.observe(card);
  });
})();