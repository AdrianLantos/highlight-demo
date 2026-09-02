(function () {
    "use strict";

    // ---- scroll progress engine ----

    var EASINGS = {
        linear: function (t) { return t; },
        out: function (t) { return 1 - Math.pow(1 - t, 3); },
        'in': function (t) { return t * t * t; },
        'in-out': function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
        'out-in': function (t) { return t < 0.5 ? (1 - Math.pow(1 - 2 * t, 3)) / 2 : 0.5 + Math.pow(2 * t - 1, 3) / 2; }
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
            if (!item.active) continue;
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

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { item.active = entry.isIntersecting; });
            requestUpdate();
        }, { rootMargin: '50% 0px 50% 0px' });
        io.observe(el);
    }

    var progressEls = document.querySelectorAll('[data-scroll-progress]');
    progressEls.forEach(register);

    if (progressEls.length) {
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });
    }

    // ---- reveal tier (one-shot) ----

    function registerReveal(el, observers) {
        var thresholdVal = el.dataset.revealThreshold || '0.6';

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

    // ---- public API ----
    window.ScrollEngine = {
        register: register,
        registerReveal: function (el) { registerReveal(el, revealObservers); },
        requestUpdate: requestUpdate
    };
})();
