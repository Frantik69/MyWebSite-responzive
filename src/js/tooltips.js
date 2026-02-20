// ======================================================
// ==================== TOOLTIP MODULE ===================
// ======================================================
//
// Tento modul zabezpečuje:
// - dynamický tooltip, ktorý sleduje kurzor (tooltip-follow)
// - hover bubble pre tlačidlo "Odoslať"
// - delegované tooltipy pre dynamické prvky (certifikáty, linky)
// - automatické skrývanie tooltipov
//
// Modul je inicializovaný cez main.js
// ======================================================

import { translations } from "./translations.js";


// ------------------------------------------------------
// TOOLTIP FOLLOW – bublina sledujúca kurzor
// ------------------------------------------------------
export function initTooltipFollow() {
  const OFFSET_X_RIGHT = 16;
  const OFFSET_X_LEFT = -115;
  const OFFSET_Y = 35;

  // Vytvorenie overlay prvku
  const overlay = document.createElement("div");
  overlay.className = "tooltip-follow";
  overlay.innerHTML = `<span class="tooltip-follow__bubble"></span>`;
  document.body.appendChild(overlay);

  const bubble = overlay.querySelector(".tooltip-follow__bubble");
  let active = false;
  let hideTimer = null;

  /* Pozicionovanie tooltipu podľa kurzora */
  function positionOverlay(e) {
    if (!active) return;

    const bubbleWidth = bubble.offsetWidth || 150;
    const viewportWidth = window.innerWidth;

    const side =
      e.clientX + OFFSET_X_RIGHT + bubbleWidth > viewportWidth
        ? "left"
        : "right";

    const offsetX = side === "left" ? OFFSET_X_LEFT : OFFSET_X_RIGHT;

    overlay.style.transform = `translate(${e.clientX + offsetX}px, ${
      e.clientY + OFFSET_Y
    }px)`;
  }

  /* Zobrazenie tooltipu */
  function showBubble(item) {
    const skipIds = [
      "homeNav",
      "portfolioNav",
      "aboutNav",
      "skillsNav",
      "contactNav",
      "submitBtn"
    ];
    if (skipIds.includes(item.id)) return;

    let key = item.dataset.translateInfo;
    if (!key && item.id === "languageDropdown") key = "languageInfo";

    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang] || translations.sk;
    const text = t[key] || key;

    bubble.textContent = text;

    bubble.classList.toggle(
      "lang-bubble",
      item.id === "languageDropdown" || item.closest("#languageMenu")
    );

    overlay.style.display = "flex";
    overlay.classList.add("showing");
    active = true;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(onLeave, 1000);
  }

  /* Skrytie tooltipu */
  function onLeave() {
    active = false;
    overlay.style.display = "none";
    overlay.classList.remove("showing");
  }

  // Priame prvky s tooltipmi
  const items = document.querySelectorAll(
    ".dropdown-item, #languageDropdown, #confirmWeather, #cancelWeather, " +
      "#confirmGitHub, #cancelGitHub, .aboutPreview, .contact-email, " +
      ".portfolio-links a, #weatherFloating, .show-pdf"
  );

  items.forEach(item => {
    item.addEventListener("mouseenter", e => showBubble(e.currentTarget));
    item.addEventListener("mousemove", positionOverlay);
    item.addEventListener("click", onLeave);
    item.addEventListener("mouseleave", onLeave);
  });

  // Delegované tooltipy pre dynamické prvky
  document.addEventListener(
    "mouseenter",
    e => {
      if (!(e.target instanceof Element)) return;

      const target = e.target.closest("[data-translate-info]");
      if (!target || target.closest("#sideNav") || target.closest("#navbarResponsive")) return;

      showBubble(target);
    },
    true
  );

  document.addEventListener("mousemove", positionOverlay, true);

  document.addEventListener(
    "mouseleave",
    e => {
      if (!e.relatedTarget) onLeave();
    },
    true
  );

  window.addEventListener("mouseout", e => {
    if (!e.relatedTarget) onLeave();
  });

  // Skry overlay pri štarte
  overlay.style.display = "none";
}


// ------------------------------------------------------
// HOVER BUBBLE PRE TLAČIDLO ODOSLAŤ
// ------------------------------------------------------
export function initSubmitButtonBubble() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener("mouseenter", () => {
    const key = submitBtn.dataset.translateInfo;
    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang] || translations.sk;
    const text = t[key] || key;

    let bubble = submitBtn.querySelector(".hover-bubble");
    if (!bubble) {
      bubble = document.createElement("div");
      bubble.className = "hover-bubble";
      submitBtn.appendChild(bubble);
    }

    bubble.textContent = text;

    let fontSize = 0.8;
    const minSize = 0.6;
    bubble.style.fontSize = fontSize + "rem";

    requestAnimationFrame(() => {
      while (bubble.scrollHeight > bubble.clientHeight && fontSize > minSize) {
        fontSize -= 0.05;
        bubble.style.fontSize = fontSize + "rem";
      }
    });

    submitBtn.classList.add("show-bubble");

    setTimeout(() => {
      submitBtn.classList.remove("show-bubble");
    }, 1000);
  });

  submitBtn.addEventListener("mouseleave", () => {
    submitBtn.classList.remove("show-bubble");
  });

  submitBtn.addEventListener("click", () => {
    submitBtn.classList.remove("show-bubble");
  });
}
