// ======================================================
// ===================== SIDENAV MODULE ==================
// ======================================================
//
// Tento modul zabezpečuje:
// - generovanie side menu z hlavného menu
// - otváranie / zatváranie mobilného sideNav
// - swipe gesto na zatvorenie
// - dynamické zobrazovanie sideNav + weatherFloating
// - živý dátum, čas a meniny v sideNav
// - hover bubble pre položky side menu
//
// Modul je inicializovaný cez main.js
// ======================================================

import { getTodayNameday, HOLIDAYS } from "./utils.js";
import { translations } from "./translations.js";


// ------------------------------------------------------
// GENEROVANIE SIDEMENU Z HLAVNÉHO MENU
// ------------------------------------------------------
export function initSideMenu() {
  const mainMenu = document.querySelector("#mainMenu");
  const sideMenu = document.querySelector("#sideMenu");

  if (mainMenu && sideMenu) {
    sideMenu.innerHTML = mainMenu.innerHTML;
  }
}


// ------------------------------------------------------
// MOBILNÝ SIDENAV – TOGGLER + SWIPE + AUTO CLOSE
// ------------------------------------------------------
export function initSideNavBehavior() {
  const toggler = document.querySelector(".navbar-toggler");
  const sideNav = document.getElementById("sideNav");

  if (!sideNav) return;

  // Toggler – otvorenie / zatvorenie
  toggler?.addEventListener("click", () => {
    const isOpen = sideNav.classList.toggle("show-mobile");
    document.body.classList.toggle("nav-open", isOpen);
  });

  // Klik na položku menu = zatvoriť
  document.addEventListener("click", e => {
    if (e.target.closest("#sideMenu a")) {
      sideNav.classList.remove("show-mobile");
      document.body.classList.remove("nav-open");
    }
  });

  // Swipe zatvorenie
  let touchStartX = 0;

  sideNav.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  sideNav.addEventListener("touchend", e => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > 60 && sideNav.classList.contains("show-mobile")) {
      sideNav.classList.remove("show-mobile");
      document.body.classList.remove("nav-open");
    }
  }, { passive: true });
}


// ------------------------------------------------------
// ZOBRAZENIE sideNav + weatherFloating PODĽA ZÓN
// ------------------------------------------------------
export function updateFloatingVisibility() {
  const sideNav = document.getElementById("sideNav");
  const weather = document.getElementById("weatherFloating");

  if (!sideNav || !weather) return;

  // Desktop only
  if (window.innerWidth < 992) {
    sideNav.classList.remove("visible");
    weather.classList.remove("visible");
    document.body.classList.remove("invert-floating");
    return;
  }

  const sections = document.querySelectorAll("section, header");
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const OFFSET = 10 * 16; // 10rem

  let shouldShow = false;
  let inContact = false;

  // Úvodná obrazovka
  if (scrollY <= windowHeight + OFFSET) {
    shouldShow = true;
  }

  // Sekcie
  sections.forEach(sec => {
    const top = sec.offsetTop;

    if (scrollY >= top - OFFSET && scrollY <= top) {
      shouldShow = true;

      if (sec.id === "contact") {
        inContact = true;
      }
    }
  });

  sideNav.classList.toggle("visible", shouldShow);
  weather.classList.toggle("visible", shouldShow);

  // Invert farieb v sekcii kontakt
  document.body.classList.toggle("invert-floating", inContact);
}


// ------------------------------------------------------
// ŽIVÝ DÁTUM + MENINY + ČAS V SIDENAV
// ------------------------------------------------------
export function updateSideNavClock() {
  const box = document.getElementById("sideNavTime");
  if (!box) return;

  const dateEl = document.querySelector("#sideNavDateBlock .date");
  const namedayEl = document.querySelector("#sideNavDateBlock .nameday");
  const timeEl = document.querySelector("#sideNavTime .time");

  const now = new Date();
  const lang = localStorage.getItem("lang") || "sk";

  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;

  const dateStr = now.toLocaleDateString(
    lang === "sk" ? "sk-SK" : lang === "de" ? "de-DE" : "en-US",
    { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" }
  );

  const timeStr = now.toLocaleTimeString(
    lang === "sk" ? "sk-SK" : lang === "de" ? "de-DE" : "en-US",
    { hour: "2-digit", minute: "2-digit", second: "2-digit" }
  );

  const nameday = getTodayNameday(lang);
  const holiday = HOLIDAYS[lang]?.[key] || null;
  const t = translations[lang] || translations.sk;

  // Formátovanie dátumu
  const parts = dateStr.split(" ");
  let weekday = parts[0].toUpperCase();
  if (lang === "sk") weekday += ",";

  const rest = parts.slice(1).join("").replace(/\s+/g, "");
  dateEl.textContent = `${weekday} ${rest}`;

  // Meniny / sviatok
  if (holiday) {
    namedayEl.textContent = holiday;
    namedayEl.classList.add("holiday");
  } else {
    namedayEl.textContent = nameday ? `${t.nameday} ${nameday}` : "";
    namedayEl.classList.remove("holiday");
  }

  timeEl.textContent = timeStr;
}


// ------------------------------------------------------
// HOVER BUBBLE PRE SIDENAV
// ------------------------------------------------------
export function initSideNavBubble() {
  const links = document.querySelectorAll("#sideMenu .menu-item > a");

  links.forEach(link => {
    let timer = null;

    link.addEventListener("mouseenter", () => {
      const parent = link.closest(".menu-item");
      if (!parent) return;

      const infoKey = parent.dataset.translateInfo;
      if (!infoKey) return;

      const lang = localStorage.getItem("lang") || "sk";
      const t = translations[lang] || translations.sk;
      const text = t[infoKey] || infoKey;

      let bubble = link.querySelector(".hover-bubble");
      if (!bubble) {
        bubble = document.createElement("div");
        bubble.className = "hover-bubble";
        link.appendChild(bubble);
      }

      bubble.innerHTML = `<span>${text}</span>`;
      link.classList.add("show-bubble");

      clearTimeout(timer);
      timer = setTimeout(() => link.classList.remove("show-bubble"), 3000);
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("show-bubble");
    });
  });
}


// ------------------------------------------------------
// HLAVNÁ INICIALIZÁCIA SIDENAV MODULU
// ------------------------------------------------------
export function initSideNav() {
  initSideMenu();
  initSideNavBehavior();
  initSideNavBubble();

  updateFloatingVisibility();
  updateSideNavClock();

  // Live clock
  setInterval(updateSideNavClock, 1000);

  // Reakcia na scroll / resize
  document.addEventListener("scroll", updateFloatingVisibility);
  window.addEventListener("resize", updateFloatingVisibility);

  // Po načítaní
  window.addEventListener("load", () => {
    requestAnimationFrame(updateFloatingVisibility);
  });

  // Po kliknutí na anchor link
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        document.body.offsetHeight; // forced reflow
        updateFloatingVisibility();
      }, 50);
    });
  });
}


// ------------------------------------------------------ 
// REBUILD SIDENAV PO ZMENE JAZYKA
// ------------------------------------------------------
document.addEventListener("languageChanged", () => {
  initSideMenu();
  initSideNavBubble();
});