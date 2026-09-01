// Data + renderer for the single project-page template (project.html).
// Reads ?slug= from the URL, looks itself up here, and fills in the
// brand, category, media and copy. Everything else on the page is
// static markup/placeholders — this only ever touches text and media.

var PROJECTS = {
    nivea: {
        brand: "Nivea",
        eyebrow: "Brand Experience · Experiential Marketing · BTL Activation · Production",
        description: "Nivea at Electric Castle — a Highlight Group brand experience.",
        media: { type: "video", src: "../../assets/video/showcase-nivea.mp4" },
        paragraphs: [
            "We brought the fun in the sun to the festival.",
            "Am creat un spațiu în care distracția, relaxarea și grija pentru piele s-au întâlnit, pentru ca festivalierii să se bucure de fiecare moment, fără să uite de SPF.",
            "Use your SPF daily."
        ],
        linkUrl: "https://www.instagram.com/p/Dcd4jUpN0K9/",
        linkLabel: "View Project"
    },
    lays: {
        brand: "Lay's",
        eyebrow: "Brand Experience · Experiential Marketing · BTL Activation · Production",
        description: "Lay's at Electric Castle — a Highlight Group brand experience.",
        media: { type: "video", src: "../../assets/video/showcase-lays.mp4" },
        paragraphs: [
            "Because at Electric Castle, it was simple: #NoLaysNoGame.",
            "At the Lay's Activities area, festival-goers took a break from the stages to play, compete, and share plenty of smiles. Because great festivals are all about great experiences."
        ],
        linkUrl: "https://www.instagram.com/p/DbITa-lpqJf/",
        linkLabel: "View Project"
    },
    persil: {
        brand: "Persil",
        eyebrow: "Brand Experience · Experiential Marketing · BTL Activation · Production",
        description: "Persil at Electric Castle — a Highlight Group brand experience.",
        media: { type: "video", src: "../../assets/video/showcase-persil.mp4" },
        paragraphs: [
            "Electric Castle may be over, but we're still reliving the bright moments. From The Bright Side in the festival grounds to the Laundromat / Refreshomat in the camping area, Persil kept the good vibes fresh all weekend long."
        ],
        linkUrl: "https://www.instagram.com/p/DbDYIMXNYw2/",
        linkLabel: "View Project"
    },
    pepsi: {
        brand: "Pepsi",
        eyebrow: "Brand Experience · Experiential Marketing · BTL Activation · Production",
        description: "Pepsi at Electric Castle — a Highlight Group brand experience.",
        media: { type: "video", src: "../../assets/video/showcase-pepsi.mp4" },
        paragraphs: [
            "Pepsi Zmeură. Sweet, fizzy and hard to ignore. Ai apucat să-l încerci?",
        ],
        linkUrl: "https://www.instagram.com/p/DV-3sCzCbLW/",
        linkLabel: "View Project"
    },
    jameson: {
        brand: "Jameson",
        eyebrow: "Festival Activation · Electric Castle",
        description: "Jameson at Electric Castle — a Highlight Group festival activation.",
        media: { type: "image", src: "../../assets/news/0faa8690ce6bbe78920da3eb83d79693.jpg", alt: "Jameson bar activation at Electric Castle festival" },
        paragraphs: [
            "We brought the Jameson bar experience to Electric Castle — a full spirits bar, built and run on-site for the length of the festival, neon-lit counter included."
        ],
        linkUrl: "https://www.iqads.ro/articol/70820/crestere-sustinuta-pentru-highlight-group-si-in-2024-cifra-de-afaceri-cu-60-mai",
        linkLabel: "Read the story"
    },
    "havana-club": {
        brand: "Havana Club",
        eyebrow: "Brand Experience · Pernod Ricard",
        description: "Havana Club at Electric Castle — a Highlight Group brand experience.",
        media: { type: "image", src: "../../assets/news/e2d5894c315e9de74bc4d77d8629ad92.jpg", alt: "Havana Club branded bottles and bar setup" },
        paragraphs: [
            "Together with Pernod Ricard, we built the Havana Club Bodega at Electric Castle: a full bar concept, branded down to the last bottle, for a weekend of Cuban-inspired nights."
        ],
        linkUrl: "https://www.iqads.ro/articol/72666/ritm-culoare-si-experiente-tropicale-highlight-group-si-pernod-ricard-romania-au",
        linkLabel: "Read the story"
    },
    schwarzkopf: {
        brand: "Schwarzkopf",
        eyebrow: "Product Launch · Creme Supreme",
        description: "Schwarzkopf Creme Supreme launch — a Highlight Group product launch.",
        media: { type: "image", src: "../../assets/news/12fa2782f924b73e672f46151e6a081e.jpg", alt: "Schwarzkopf Creme Supreme product launch event" },
        paragraphs: [
            "A full launch event for Schwarzkopf's Creme Supreme line — styling stations, a branded stage set and hands-on demos, built to let the product speak for itself."
        ],
        linkUrl: "https://www.iqads.ro/articol/72925/culoarea-care-spune-o-poveste-lansarea-schwarzkopf-creme-supreme-by-highlight",
        linkLabel: "Read the story"
    },
    absolut: {
        brand: "Absolut",
        eyebrow: "Festival Activation · UNTOLD",
        description: "Absolut at UNTOLD — a Highlight Group festival activation.",
        media: { type: "image", src: "../../assets/news/05aa12c62f5c629d394711ecf7d73beb.jpg", alt: "Absolut branded festival installation" },
        paragraphs: [
            "Three signature cocktails, one festival: Absolut's UNTOLD activation paired a fully branded install with a drinks program built to keep the night moving."
        ],
        linkUrl: "https://www.iqads.ro/articol/72826/absolut-x-highlight-group-trei-cocktailuri-un-festival-si-o-vara-de-tinut-minte",
        linkLabel: "Read the story"
    }
};

(function () {
    "use strict";

    var slug = new URLSearchParams(window.location.search).get("slug");
    var project = PROJECTS[slug];

    if (!project) {
        window.location.replace("../index.html");
        return;
    }

    document.title = project.brand + " — Highlight Group";
    var metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", project.description);

    document.getElementById("projectBrand").textContent = project.brand;
    document.getElementById("projectEyebrow").textContent = project.eyebrow;

    var mediaEl = document.getElementById("projectMedia");
    if (project.media.type === "video") {
        var video = document.createElement("video");
        video.className = "showcase-video";
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.src = project.media.src;
        mediaEl.appendChild(video);
        if (!prefersReducedMotion) {
            video.play().catch(function () { });
        }
    } else {
        var img = document.createElement("img");
        img.src = project.media.src;
        img.alt = project.media.alt || "";
        img.decoding = "async";
        mediaEl.appendChild(img);
    }

    var copyEl = document.getElementById("projectCopy");
    var linkEl = document.getElementById("projectLink");

    project.paragraphs.forEach(function (text) {
        var p = document.createElement("p");
        p.textContent = text;
        copyEl.insertBefore(p, linkEl);
    });

    linkEl.href = project.linkUrl;
    linkEl.textContent = project.linkLabel;
})();
