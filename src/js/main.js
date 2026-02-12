// ======================================================
// ======================= MAIN JS =======================
// ======================================================
//
// Centrálny bod aplikácie.
// Importuje všetky moduly v správnom poradí.
//
// ======================================================


// ------------------------------------------------------
// SCSS
// ------------------------------------------------------
import "../scss/main.scss";


// ------------------------------------------------------
// UTILS (footer, animácie, meniny)
// ------------------------------------------------------
import { 
  initFooterYear,
  initRatingStars,
  initMainContentFadeIn
} from "./utils.js";


// ------------------------------------------------------
// TIMELINE + SKILLS
// ------------------------------------------------------
import { TIMELINE_DATA, renderTimeline } from "./timeline.js";
import { renderSkills } from "./skills.js";


// ------------------------------------------------------
// CONTACT FORM + TURNSTILE
// ------------------------------------------------------
import { 
  renderTurnstile,
  initContactForm
} from "./contact.js";


// ------------------------------------------------------
// NAVBAR + SIDENAV
// ------------------------------------------------------
import { 
  initNavbar, 
  initScrollspyResize, 
  initNavHoverBubble, 
  initNavbarTogglerAnimation 
} from "./navbar.js";

import { initSideNav } from "./sidenav.js";


// ------------------------------------------------------
// CERTIFICATES + CAROUSEL + MODALS
// ------------------------------------------------------
import { initCarousel } from "./carousel.js";
import { initGitHubModal, initPdfModal } from "./modals.js";


// ------------------------------------------------------
// WEATHER
// ------------------------------------------------------
import { initWeather, initWeatherModal } from "./weather.js";


// ------------------------------------------------------
// TOOLTIPS
// ------------------------------------------------------
import { 
  initTooltipFollow, 
  initSubmitButtonBubble 
} from "./tooltips.js";


// ------------------------------------------------------
// LANGUAGE SYSTEM
// ------------------------------------------------------
import { initLanguage } from "./language.js";


// ======================================================
// HLAVNÁ INICIALIZÁCIA
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  // Fade-in animácia hlavného obsahu
  initMainContentFadeIn();

  // Timeline (skúsenosti + vzdelanie)
  renderTimeline(TIMELINE_DATA.experience, "timeline-experience");
  renderTimeline(TIMELINE_DATA.education, "timeline-education");

  // Skills sekcia
  renderSkills();

  // Hviezdičky v portfóliu
  initRatingStars();

  // Jazyk + preklady + meta description + Turnstile
  initLanguage();

  // Navigácia + ScrollSpy
  initNavbar();
  initScrollspyResize();
  initNavbarTogglerAnimation();
  initNavHoverBubble();

  // SideNav
  initSideNav();

  // Carousel
  initCarousel();

  // Modaly
  initGitHubModal();
  initPdfModal();

  // Tooltips
  initTooltipFollow();
  initSubmitButtonBubble();

  // Počasie
  initWeatherModal();
  initWeather();

  // Kontakt formulár
  initContactForm();

  // Turnstile
  const lang = localStorage.getItem("lang") || "sk";
  renderTurnstile(lang);

  // Footer – aktuálny rok
  initFooterYear();
});

console.log("Main.js loaded – all modules initialized.");
