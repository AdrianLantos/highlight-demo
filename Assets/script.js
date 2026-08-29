(function () {
    "use strict";

    /* =====================================================================
       SCROLL PROGRESS ENGINE
       ---------------------------------------------------------------------
       Full reference: scroll-animations.md (shipped alongside this file).
       Short version:

       One shared driver, two recipes, declared entirely in markup:

         data-scroll-progress="pin"    tall sticky-pinned scenes
                                       (the circle expand/collapse)
         data-scroll-progress="track"  ordinary elements animating as
                                       they cross the viewport — text,
                                       images, anything else

       Both write a single number (0→1) to a CSS custom property on the
       element every scroll frame; every visual effect is plain CSS
       calc() against that number. Adding a new animated element never
       means writing more JS — only new data attributes + CSS.

       Optional attributes (all recipes):
         data-scroll-var     custom property name, default --p
         data-scroll-ease    linear | out | in | in-out, default linear

       Track-only attributes:
         data-scroll-start   viewport fraction where progress = 0
                              (0.9 = element's top 90% down the screen —
                              i.e. just appearing), default 0.9
         data-scroll-end     viewport fraction where progress = 1,
                              default 0.1

       Performance model — same idea at any scale:
         - ONE scroll/resize listener for the whole page, batched into
           one requestAnimationFrame tick, no matter how many animated
           elements exist.
         - Each element has its own IntersectionObserver flagging
           whether it's near the viewport; only "active" elements get a
           getBoundingClientRect() read + style write per frame. Off-
           screen elements cost nothing, so this scales to a page with
           many of these without the per-frame loop getting heavier.
       ===================================================================== */

    var EASINGS = {
        linear: function (t) { return t; },
        out: function (t) { return 1 - Math.pow(1 - t, 3); },
        'in': function (t) { return t * t * t; },
        'in-out': function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    };

    function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

    function attrNum(el, name, fallback) {
        var v = parseFloat(el.getAttribute(name));
        return isNaN(v) ? fallback : v;
    }

    // ---- the two progress recipes ----

    function pinProgress(el, rect) {
        var range = el.offsetHeight - window.innerHeight;
        return range > 0 ? clamp(-rect.top / range, 0, 1) : 0;
    }

    function trackProgress(el, rect, cfg) {
        var vh = window.innerHeight;
        var startPx = vh * cfg.start;
        var endPx = vh * cfg.end;
        return clamp((startPx - rect.top) / (startPx - endPx), 0, 1);
    }

    // ---- shared driver ----

    var items = [];
    var ticking = false;

    function update() {
        ticking = false;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.active) continue; // skip anything off/near-screen
            var rect = item.el.getBoundingClientRect();
            var raw = item.mode === 'pin' ? pinProgress(item.el, rect) : trackProgress(item.el, rect, item.cfg);
            item.el.style.setProperty(item.varName, item.ease(raw).toFixed(4));
        }
    }

    function requestUpdate() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    function register(el) {
        var item = {
            el: el,
            mode: el.getAttribute('data-scroll-progress') === 'pin' ? 'pin' : 'track',
            varName: el.getAttribute('data-scroll-var') || '--p',
            ease: EASINGS[el.getAttribute('data-scroll-ease')] || EASINGS.linear,
            cfg: {
                start: attrNum(el, 'data-scroll-start', 0.9),
                end: attrNum(el, 'data-scroll-end', 0.1)
            },
            active: false
        };
        items.push(item);

        // Generous margin so the element is already "active" a bit before
        // it's actually visible — avoids a missed frame right at the edge.
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { item.active = entry.isIntersecting; });
            requestUpdate(); // recompute immediately on enter/exit, don't wait for a scroll event
        }, { rootMargin: '50% 0px 50% 0px' });
        io.observe(el);
    }

    var progressEls = document.querySelectorAll('[data-scroll-progress]');
    progressEls.forEach(register);

    if (progressEls.length) {
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });
    }

    // ---- separate, simpler tier: one-shot reveal on first intersection ----
    // (.reveal — for content that just needs to fade in once, not track
    // scroll continuously; see scroll-animations.md for when to use which)

    function registerReveal(el, observers) {
        var thresholdVal = el.dataset.revealThreshold || '0.4';

        // Create the observer instance only if it doesn't exist yet for
        // this threshold — elements sharing a threshold share one observer.
        if (!observers[thresholdVal]) {
            observers[thresholdVal] = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: parseFloat(thresholdVal) });
        }

        observers[thresholdVal].observe(el);
    }

    var revealObservers = {};
    var revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach(function (el) { registerReveal(el, revealObservers); });

    // ---- minimal public API ----
    // For content that shows up after this script has already run —
    // a CMS-driven section, something lazy-loaded, an infinite-scroll
    // page — rather than everything having to exist in markup at load
    // time. Static markup never needs to touch this; it's only here
    // for the dynamic-content case.
    //
    //   ScrollEngine.register(el)        // wire up a new [data-scroll-progress] element
    //   ScrollEngine.registerReveal(el)  // wire up a new .reveal element
    //   ScrollEngine.requestUpdate()     // force a recompute (e.g. after a layout change)
    window.ScrollEngine = {
        register: register,
        registerReveal: function (el) { registerReveal(el, revealObservers); },
        requestUpdate: requestUpdate
    };
})();
