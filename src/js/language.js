// ======================================================
// =================== LANGUAGE MODULE ===================
// ======================================================
//
// Tento modul zabezpečuje:
// - prepínanie jazykov
// - dynamické preklady textov, placeholderov, tooltipov
// - zmenu vlajky a jazykového labelu
// - dynamický náhľad sekcie "O mne"
// - re-render Cloudflare Turnstile
//
// Modul je inicializovaný cez initLanguage() v main.js
//
// ======================================================

// Preklady
import { translations } from "./translations.js";

// Vlajky
import flagSK from "../assets/img/flags/sk.png";
import flagEN from "../assets/img/flags/uk.png";
import flagDE from "../assets/img/flags/de.png";

// Turnstile
import { renderTurnstile } from "./contact.js";


// ------------------------------------------------------
// Hlavná funkcia na zmenu jazyka
// ------------------------------------------------------
export function setLanguage(lang) {
  const t = translations[lang] || translations.sk;

  // --- META DESCRIPTION ---
  const metaDesc = document.getElementById("meta-description");
  if (metaDesc && t.description) {
    metaDesc.setAttribute("content", t.description);
  }

  // --- TITLE + HTML LANG ---
  document.title = t.pageTitle;
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);

  // --- TEXTOVÉ PREKLADY ---
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.dataset.translate;
    const value = t[key];
    if (!value) return;

    el.classList.remove("show");

    setTimeout(() => {
      if (el.tagName.toLowerCase() === "img") {
        el.alt = value;

      } else if (el.hasAttribute("data-translate-html")) {
        el.innerHTML = DOMPurify.sanitize(value, {
          ALLOWED_TAGS: ["b", "strong", "i", "em", "span", "br"],
          ALLOWED_ATTR: ["style"]
        });
        el.querySelectorAll(".skeleton").forEach(s => s.remove());

      } else {
        let replaced = false;
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = value;
            replaced = true;
          }
        });
        if (!replaced) el.textContent = value;
      }

      el.classList.add("show");
    }, 300);
  });

  // --- PLACEHOLDERY ---
  document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
    el.placeholder = t[el.dataset.translatePlaceholder];
  });

  // --- ARIA LABELS ---
  document.querySelectorAll("[data-translate-aria]").forEach(el => {
    el.setAttribute("aria-label", t[el.dataset.translateAria]);
  });

  // --- TOOLTIPY ---
  document.querySelectorAll("[data-translate-info]").forEach(el => {
    const key = el.dataset.translateInfo;
    if (t[key]) el.setAttribute("data-tooltip", t[key]);
  });

  // --- SUBLIST PREKLADY ---
  document.querySelectorAll("[data-translate-sublist]").forEach(el => {
    const key = el.dataset.translateSublist;
    if (t[key]) el.textContent = t[key];
  });

  // --- UI LABEL PRE JAZYK ---
  const selectedLang = document.getElementById("selected-lang");
  if (selectedLang) selectedLang.textContent = lang.toUpperCase();

  // --- ZMENA VLAJKY ---
  const selectedFlag = document.getElementById("selected-flag");
  if (selectedFlag) {
    selectedFlag.src =
      lang === "sk" ? flagSK :
      lang === "en" ? flagEN :
      flagDE;
  }

  // --- DYNAMICKÝ PREVIEW "O MNE" ---
  const aboutPreview = document.getElementById("aboutPreview");
  if (aboutPreview) {
    const full = (t.aboutInfo1 || "").replace(/<[^>]*>/g, "").trim();
    const previewLength = Math.floor(full.length * 0.535);
    aboutPreview.textContent = full.substring(0, previewLength) + "...";
  }

  // --- RE-RENDER CAPTCHA ---
  renderTurnstile(lang);
}


// ------------------------------------------------------
// Zvýraznenie aktívneho jazyka v dropdown menu
// ------------------------------------------------------
export function highlightActiveLang() {
  const lang = localStorage.getItem("lang") || "sk";
  const menu = document.getElementById("languageMenu");
  if (!menu) return;

  menu.querySelectorAll(".dropdown-item").forEach(el => {
    el.classList.toggle("active", el.dataset.lang === lang);
  });
}


// ------------------------------------------------------
// Inicializácia jazykového systému
// ------------------------------------------------------
export function initLanguage() {
  const browserLang = navigator.language.slice(0, 2);
  const savedLang = localStorage.getItem("lang") || browserLang || "sk";

  // Nastavenie jazyka
  setLanguage(savedLang);

  // Dropdown – zvýraznenie aktívneho jazyka
  const dropdownToggle = document.getElementById("languageDropdown");
  dropdownToggle?.addEventListener("show.bs.dropdown", highlightActiveLang);

  // Klik na jazyk v menu
  const menu = document.getElementById("languageMenu");
  if (menu) {
    menu.addEventListener("click", e => {
      const item = e.target.closest(".dropdown-item");
      if (!item) return;

      e.preventDefault();
      setLanguage(item.dataset.lang);
      highlightActiveLang();

      dropdownToggle &&
        bootstrap.Dropdown.getOrCreateInstance(dropdownToggle).hide();
    });
  }

  // Prvé vykreslenie Turnstile
  renderTurnstile(savedLang);
}
