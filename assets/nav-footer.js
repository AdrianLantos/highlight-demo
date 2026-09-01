// Generates the nav (desktop bar + mobile modal) and footer markup for
// every page EXCEPT the homepage, which keeps them as plain hand-written
// HTML (easiest to edit directly, and it's the page most likely to keep
// changing). Any other page just needs empty mount points as the first/
// last things in <body> and this script loaded BEFORE general.js (whose
// reveal-on-scroll/hamburger logic looks up #siteNav/#navToggle/#navModal
// by id and needs them to already exist):
//
//   <div id="siteNavRoot"></div>
//   ...page content...
//   <div id="siteFooterRoot"></div>
//   <script src="path/to/assets/nav-footer.js"></script>
//   <script src="path/to/assets/general.js"></script>
//
// To add, remove or reorder a link, just edit the NAV_LINKS / SOCIAL_LINKS
// / LEGAL_LINKS arrays below — everything else builds itself from them.
// Every href here is root-absolute and clean (e.g. "/#work", never
// "/index.html#work") since these pages only ever sit a level or two
// under the root and this way there's no per-page "../" math to get wrong.

(function () {
  "use strict";

  var mount = document.getElementById("siteNavRoot");
  if (!mount) return;

  var NAV_LINKS = [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Clients", href: "/#clients" },
    { label: "News", href: "/#news" },
    { label: "Portfolio", href: "/portfolio/" }
  ];
  var NAV_CTA = { label: "Contact", href: "/#contact" };

  function link(item, extraClass) {
    var cls = extraClass ? ' class="' + extraClass + '"' : "";
    return '<a' + cls + ' href="' + item.href + '">' + item.label + '</a>';
  }

  var navLinksHtml = NAV_LINKS.map(function (item) { return link(item); }).join("");
  var modalLinksHtml = NAV_LINKS.concat([NAV_CTA]).map(function (item) { return link(item); }).join("");

  mount.innerHTML = `
    <header class="site-nav" id="siteNav">
      <div class="container site-nav-inner">
        <a class="site-nav-logo" href="/">
          <img class="site-nav-logo-img" src="/assets/logo/highlight-logo-full.svg" alt="Highlight">
        </a>
        <nav class="site-nav-links" aria-label="Primary">
          ${navLinksHtml}
          ${link(NAV_CTA, "site-nav-cta")}
        </nav>
        <button class="site-nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navModal">
          <span class="site-nav-toggle-bar"></span>
          <span class="site-nav-toggle-bar"></span>
        </button>
      </div>
    </header>
    <div class="nav-modal" id="navModal" aria-hidden="true">
      <nav class="nav-modal-links" aria-label="Mobile">
        ${modalLinksHtml}
      </nav>
    </div>
  `;
})();

(function () {
  "use strict";

  var mount = document.getElementById("siteFooterRoot");
  if (!mount) return;

  var SOCIAL_LINKS = [
    { name: "instagram", label: "Instagram", href: "#" },
    { name: "facebook", label: "Facebook", href: "#" },
    { name: "linkedin", label: "LinkedIn", href: "#" },
    { name: "youtube", label: "YouTube", href: "#" }
  ];

  var LEGAL_LINKS = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Cookie Policy", href: "#" }
  ];

  var socialHtml = SOCIAL_LINKS.map(function (item) {
    return '<a class="site-footer-social-link site-footer-social-link--' + item.name +
      '" href="' + item.href + '" aria-label="' + item.label + '"></a>';
  }).join("");

  var legalHtml = LEGAL_LINKS.map(function (item) {
    return '<a href="' + item.href + '">' + item.label + '</a>';
  }).join("");

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container site-footer-top">
        <div class="site-footer-info">
          <span class="site-footer-logo">
            <img class="site-footer-logo-img" src="/assets/logo/highlight-logo-full.svg" alt="Highlight" loading="lazy" decoding="async">
          </span>
          <address class="site-footer-address body-text-light">18 Logofat Luca Stroici Street 2nd District, 020586, Bucharest, Romania</address>
          <a class="site-footer-email" href="mailto:office@hlagency.ro">office@hlagency.ro</a>
        </div>
        <div class="site-footer-social">${socialHtml}</div>
      </div>
      <div class="container site-footer-bottom">
        <span class="site-footer-copy">© 2026 Highlight Group. All rights reserved.</span>
        <nav class="site-footer-legal" aria-label="Legal">${legalHtml}</nav>
      </div>
    </footer>
  `;
})();
