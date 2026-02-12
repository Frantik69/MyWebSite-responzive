// ======================================================
// ====================== UTILS MODULE ===================
// ======================================================
//
// Tento modul obsahuje malé pomocné funkcie:
// - meniny + sviatky podľa jazyka
// - aktuálny rok vo footeri
// - hviezdičkové hodnotenie v portfóliu
// - fade-in animáciu hlavného obsahu
//
// Modul je inicializovaný cez main.js
// ======================================================


// ------------------------------------------------------
// IMPORTY – meniny + sviatky
// ------------------------------------------------------
import { 
  SK_NAMEDAYS, 
  DE_NAMEDAYS, 
  EN_NAMEDAYS,
  SK_HOLIDAYS,
  EN_HOLIDAYS,
  DE_HOLIDAYS
} from "./meniny.js";


// ------------------------------------------------------
// MENINY + SVIATKY
// ------------------------------------------------------
export const NAMEDAYS = {
  sk: SK_NAMEDAYS,
  de: DE_NAMEDAYS,
  en: EN_NAMEDAYS
};

export const HOLIDAYS = {
  sk: SK_HOLIDAYS,
  en: EN_HOLIDAYS,
  de: DE_HOLIDAYS
};

/* Vráti meniny pre dnešný dátum podľa jazyka */
export function getTodayNameday(lang) {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;

  return NAMEDAYS[lang]?.[key] || "";
}


// ------------------------------------------------------
// FOOTER – AKTUÁLNY ROK
// ------------------------------------------------------
export function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}


// ------------------------------------------------------
// HVIEZDIČKY V PORTFÓLIU
// ------------------------------------------------------
export function initRatingStars() {
  document.querySelectorAll("[data-rating]").forEach(el => {
    const rating = parseInt(el.dataset.rating, 10);

    const wrapper = document.createElement("span");
    wrapper.className = "rating";

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = "★";
      star.style.color = i < rating ? "#f5c518" : "#ccc";
      wrapper.appendChild(star);
    }

    el.prepend(wrapper);
  });
}


// ------------------------------------------------------
// FADE-IN ANIMÁCIA HLAVNÉHO OBSAHU
// ------------------------------------------------------
export function initMainContentFadeIn() {
  const main = document.querySelector(".main-content");
  if (!main) return;

  setTimeout(() => {
    main.classList.add("loaded");
  }, 100);
}
