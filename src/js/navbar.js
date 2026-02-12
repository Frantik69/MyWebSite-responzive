// ======================================================
// ===================== NAVBAR MODULE ===================
// ======================================================
//
// Tento modul zabezpečuje:
// - shrink efekt navigácie pri scrollovaní
// - ScrollSpy pre zvýraznenie sekcií
// - smooth wheel scroll na desktopoch
// - hover bubble pre hlavné menu
// - refresh ScrollSpy pri resize
// - animáciu menu pri kliknutí na toggler
//
// Modul je inicializovaný cez main.js
// ======================================================


// ------------------------------------------------------
// NAVBAR SHRINK + SCROLLSPY + SMOOTH WHEEL SCROLL
// ------------------------------------------------------
export function initNavbar() {
  const navbar = document.querySelector("#mainNav");

  /** Zmenší navigáciu pri scrollovaní */
  const navbarShrink = () => {
    if (!navbar) return;
    navbar.classList.toggle("navbar-shrink", window.scrollY > 0);
  };

  navbarShrink();
  document.addEventListener("scroll", navbarShrink);

  /** ScrollSpy aktivácia */
  if (navbar) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%"
    });
  }

  /** Smooth wheel scroll pre desktop */
  if (window.innerWidth > 992) {
    window.addEventListener(
      "wheel",
      e => {
        e.preventDefault();
        window.scrollBy({
          top: e.deltaY < 0 ? -50 : 50,
          behavior: "smooth"
        });
      },
      { passive: false }
    );
  }
}


// ------------------------------------------------------
// REFRESH SCROLLSPY PRI RESIZE
// ------------------------------------------------------
export function initScrollspyResize() {
  window.addEventListener("resize", () => {
    const spy = bootstrap.ScrollSpy.getInstance(document.body);
    if (!spy) return;

    const nav = document.querySelector("#mainNav");
    if (nav) spy._config.offset = nav.offsetHeight;

    spy.refresh();
  });
}


// ------------------------------------------------------
// HOVER BUBBLE PRE HLAVNÚ NAVIGÁCIU
// ------------------------------------------------------
export function initNavHoverBubble() {
  const links = document.querySelectorAll(".nav-item.menu-item .nav-link");

  links.forEach(link => {
    link.addEventListener("mouseenter", () => {
      // ignorujeme pravé menu a jazykový dropdown
      if (link.closest("#rightNav") || link.id === "languageDropdown") return;

      const parent = link.closest(".menu-item");
      if (!parent) return;

      const infoKey = parent.dataset.translateInfo;
      if (!infoKey) return;

      const lang = localStorage.getItem("lang") || "sk";
      const t = translations[lang] || translations.sk;
      const text = t[infoKey] || infoKey;

      // vytvorenie bubliny ak neexistuje
      let bubble = link.querySelector(".hover-bubble");
      if (!bubble) {
        bubble = document.createElement("div");
        bubble.className = "hover-bubble";
        link.appendChild(bubble);
      }

      bubble.textContent = text;

      // automatické zmenšovanie textu podľa priestoru
      let fontSize = 0.7;
      bubble.style.fontSize = fontSize + "rem";

      const minSize = 0.15;
      while (bubble.scrollHeight > bubble.clientHeight && fontSize > minSize) {
        fontSize -= 0.05;
        bubble.style.fontSize = fontSize + "rem";
      }

      link.classList.add("show-bubble");

      setTimeout(() => {
        link.classList.remove("show-bubble");
      }, 1000);
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("show-bubble");
    });
  });
}


// ------------------------------------------------------
// ANIMÁCIA MENU PRI KLIKNUTÍ NA TOGGLER
// ------------------------------------------------------
export function initNavbarTogglerAnimation() {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.getElementById("navbarResponsive");

  if (!toggler || !menu) return;

  toggler.addEventListener("click", () => {
    menu.classList.toggle("show-animated");
  });
}
