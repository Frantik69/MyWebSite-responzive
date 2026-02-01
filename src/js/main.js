import '../scss/main.scss';
import flagSK from "../assets/img/flags/sk.png";
import flagEN from "../assets/img/flags/uk.png";
import flagDE from "../assets/img/flags/de.png";
import c1 from "../assets/certificates/Certificate_Java_Basic.png";
import c2 from "../assets/certificates/Certifikat_Webove_stranky_krok_za_krokom.png";
import c3 from "../assets/certificates/Certifikat_Kompletny_kurz_CSS_frameworku_Bootstrap.png";
import c4 from "../assets/certificates/Certifikat_MySQL_databazy_krok_za_krokom.png";
import c5 from "../assets/certificates/Certifikat_Zakladne_konstrukcie_jazyka_Java.png";
import c6 from "../assets/certificates/skillmea-certifikat-java-pre-junior-programatorov.png";
import c7 from "../assets/certificates/skillmea-certifikat-java-pre-pokrocilych.png";
import c8 from "../assets/certificates/skillmea-certifikat-java-a-oop-pre-zaciatocnikov.png";
import c9 from "../assets/certificates/Certifikat_Objektovo_orientovane_programovanie_v_Jave.png";
import c10 from "../assets/certificates/Certifikat_Kolekcie_a_prudy_v_Jave.png";
import c11 from "../assets/certificates/Certifikat_Praca_so_subormi_v_Jave.png";
import c12 from "../assets/certificates/Certifikat_Testovanie_v_Jave.png";
import c13 from "../assets/certificates/Certifikat_Zaklady_Spring_Boot_frameworku_pre_Javu.png";
import c14 from "../assets/certificates/Certifikat_Databaza_a_Hibernate_v_Spring_Boot_-_Blog.png";
import c15 from "../assets/certificates/Certifikat_Zaklady_React.png";
import c16 from "../assets/certificates/Certifikat_Best_practices_pre_navrh_softwaru.png";
import c17 from "../assets/certificates/Certifikat_Git.png";
import c18 from "../assets/certificates/Certifikat_UML.png";
import { SK_NAMEDAYS, DE_NAMEDAYS, EN_NAMEDAYS } from "./meniny.js";
import { SK_HOLIDAYS, EN_HOLIDAYS, DE_HOLIDAYS } from "./meniny.js";
import { translations } from "./translations.js";

// ======================================================
// ============= PREPÍNAČ PRE KALENDÁRE =================
// ======================================================

const NAMEDAYS = {
  sk: SK_NAMEDAYS,
  de: DE_NAMEDAYS,
  en: EN_NAMEDAYS
};

const HOLIDAYS = {
  sk: SK_HOLIDAYS,
  en: EN_HOLIDAYS,
  de: DE_HOLIDAYS
};


function getTodayNameday(lang) {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;

  return NAMEDAYS[lang]?.[key] || "";
}

// ======================================================
// === JAZYK & PREKLAD ==================================
// ======================================================

// === SET_LANGUAGE ===
function setLanguage(lang) {
  const t = translations[lang] || translations.sk;

  document.title = t.pageTitle;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    const value = t[key];
    if (!value) return;

    el.classList.remove("show");

    setTimeout(() => {
      if (el.tagName.toLowerCase() === "img") {
        el.alt = value;
      } else if (el.hasAttribute("data-translate-html")) {
        el.innerHTML = value;
      } else {
        let hasTextNode = false;
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = value;
            hasTextNode = true;
          }
        });
        if (!hasTextNode) el.textContent = value;
      }
      el.classList.add("show");
    }, 300);
  });

  // Placeholdery
  document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
    const key = el.getAttribute("data-translate-placeholder");
    el.placeholder = t[key];
  });

  // Tooltipy
  document.querySelectorAll("[data-translate-info]").forEach(el => {
  const key = el.getAttribute("data-translate-info");
  const value = t[key];
  if (value) {
    el.setAttribute("data-tooltip", value);
  }
});

  // Sublist
  document.querySelectorAll("[data-translate-sublist]").forEach(el => {
    const key = el.getAttribute("data-translate-sublist");
    if (t[key]) el.textContent = t[key];
  });

  // UI štítky
  const selectedLang = document.getElementById("selected-lang");
  if (selectedLang) selectedLang.textContent = lang.toUpperCase();

  const selectedFlag = document.getElementById("selected-flag");
  if (selectedFlag) {
    if (lang === "sk") selectedFlag.src = flagSK;
    else if (lang === "en") selectedFlag.src = flagEN;
    else if (lang === "de") selectedFlag.src = flagDE;

  }

  // Dynamický náhľad "O mne"
  const aboutPreview = document.getElementById("aboutPreview");
  if (aboutPreview) {
    let full = (t.aboutInfo1 || "").replace(/<[^>]*>/g, "").trim();
    const previewLength = Math.floor(full.length * 0.535);
    aboutPreview.textContent = full.substring(0, previewLength) + "...";
  }

  // === DYNAMICKÝ RE-RENDER TURNTILE ===
  renderTurnstile(lang);
}

// === HIGHLIGHT_ACTIVE_LANG ===
function highlightActiveLang() {
  const lang = localStorage.getItem("lang") || "sk";
  const menu = document.getElementById("languageMenu");
  if (!menu) return;

  menu.querySelectorAll(".dropdown-item").forEach(el => {
    el.classList.toggle("active", el.getAttribute("data-lang") === lang);
  });
}

// === INIT_LANGUAGE ===
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "sk";
  setLanguage(savedLang);

  const dropdownToggle = document.getElementById("languageDropdown");
  if (dropdownToggle) {
    dropdownToggle.addEventListener("show.bs.dropdown", highlightActiveLang);
  }

  const menu = document.getElementById("languageMenu");
  if (menu) {
    menu.addEventListener("click", e => {
      const target = e.target.closest(".dropdown-item");
      if (!target) return;

      e.preventDefault();
      setLanguage(target.getAttribute("data-lang"));
      highlightActiveLang();

      if (dropdownToggle) {
        bootstrap.Dropdown.getOrCreateInstance(dropdownToggle).hide();
      }
    });
  }

  // === PRVÉ RENDEROVANIE TURNTILE PO NAČÍTANÍ STRÁNKY ===
  renderTurnstile(savedLang);
});

// ======================================================
// === DYNAMICKÝ RENDER CLOUDLFARE TURNSTILE ============
// ======================================================

function renderTurnstile(lang) {
  const container = document.getElementById("turnstile-container");
  if (!container) return;

  // DEV režim – zobraz placeholder
  if (import.meta.env.DEV) {
    container.innerHTML = "DEV MODE – CAPTCHA OK";
    container.classList.add("dev-placeholder");
    return;
  }

  // PROD režim – renderuj skutočný Turnstile
  container.classList.remove("dev-placeholder");
  container.innerHTML = "";

  if (window.turnstile) {
    turnstile.render(container, {
      sitekey: "0x4AAAAAACIMa_Sh59vc7MBI",
      language: lang,
      theme: "light",
      responseFieldName: "cf-turnstile-response"
    });
  }
}


// ======================================================
// === NAVIGÁCIA & SCROLLSPY ============================
// ======================================================

// === INIT_NAVBAR ===
function INIT_NAVBAR() {
  const navbarCollapsible = document.querySelector('#mainNav');

  const navbarShrink = () => {
    if (!navbarCollapsible) return;
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove('navbar-shrink');
    } else {
      navbarCollapsible.classList.add('navbar-shrink');
    }
  };

  navbarShrink();
  document.addEventListener('scroll', navbarShrink);

  // ScrollSpy
  if (navbarCollapsible) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  }
  if (window.innerWidth > 992) {
    window.addEventListener('wheel', function(e) {
    e.preventDefault();
    window.scrollBy({
      top: e.deltaY < 0 ? -50 : 50,
      behavior: 'smooth'
      });
    }, { passive: false });
  }

  // Zatvorenie menu v mobile
  const navbarToggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach(item => {
    item.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', INIT_NAVBAR);

// ======================================================
// === MODAL PRE POČASIE ================================
// ======================================================

// === INIT_WEATHER_MODAL ===
function INIT_WEATHER_MODAL() {
  const weatherLinks = document.querySelectorAll(".weatherNav"); // oba elementy
  const modal = document.getElementById("weatherModal");
  const confirmBtn = document.getElementById("confirmWeather");
  const cancelBtn = document.getElementById("cancelWeather");

  if (!weatherLinks.length || !modal) return;

  modal.style.display = "none";

  weatherLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      modal.style.display = "flex";

      // uložíme si URL, na ktorú sa má ísť po potvrdení
      modal.dataset.targetUrl = link.href;
    });
  });

  confirmBtn?.addEventListener("click", function() {
    modal.style.display = "none";
    const url = modal.dataset.targetUrl;
    if (url) window.open(url, "_blank");
  });

  cancelBtn?.addEventListener("click", function() {
    modal.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", INIT_WEATHER_MODAL);


// ======================================================
// ==---------------= MODAL PRE GITHUB ==================
// ======================================================

// === INIT_GITHUB_MODAL ===
function INIT_GITHUB_MODAL() {
  const githubLink = document.querySelector(".portfolio-links a");
  const modal = document.getElementById("GitHubModal");
  const confirmBtn = document.getElementById("confirmGitHub");
  const cancelBtn = document.getElementById("cancelGitHub");

  if (!githubLink || !modal) return;

  modal.style.display = "none";

  githubLink.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  confirmBtn?.addEventListener("click", function() {
    modal.style.display = "none";
    window.open(githubLink.href, "_blank");
  });

  cancelBtn?.addEventListener("click", function() {
    modal.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", INIT_GITHUB_MODAL);


// ======================================================
// === TOOLTIP FOLLOW (INFO BUBBLE) =====================
// ======================================================

// === INIT_TOOLTIP_FOLLOW ===
function INIT_TOOLTIP_FOLLOW() {
  const OFFSET_X_RIGHT = 16;
  const OFFSET_X_LEFT  = -115;
  const OFFSET_Y = 35;

  const overlay = document.createElement('div');
  overlay.className = 'tooltip-follow';
  overlay.innerHTML = `<span class="tooltip-follow__bubble"></span>`;
  document.body.appendChild(overlay);

  const bubble = overlay.querySelector('.tooltip-follow__bubble');
  let active = false;
  let hideTimer = null;

  function positionOverlay(e) {
    if (!active) return;

    const bubbleWidth = bubble.offsetWidth || 150;
    const viewportWidth = window.innerWidth;

    let side = 'right';
    if (e.clientX + OFFSET_X_RIGHT + bubbleWidth > viewportWidth) {
      side = 'left';
    }

    const offsetX = side === 'left' ? OFFSET_X_LEFT : OFFSET_X_RIGHT;
    const x = e.clientX + offsetX;
    const y = e.clientY + OFFSET_Y;

    overlay.style.transform = `translate(${x}px, ${y}px)`;
  }

  function showBubble(item) {
    const skipIds = ["homeNav", "portfolioNav", "aboutNav", "skillsNav", "contactNav", "submitBtn"];
    if (skipIds.includes(item.id)) return;

    let key = item.getAttribute('data-translate-info');
    if (!key && item.id === "languageDropdown") key = "languageInfo";

    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang] || translations.sk;
    const text = t[key] || key;

    bubble.textContent = text;

    if (item.id === "languageDropdown" || item.closest("#languageMenu")) {
      bubble.classList.add("lang-bubble");
    }else {
      bubble.classList.remove("lang-bubble");
    }

    overlay.style.display = 'flex';
    overlay.classList.add('showing');
    active = true;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      onLeave();
    }, 1000);
  }

  function onLeave() {
    active = false;
    overlay.style.display = 'none';
    overlay.classList.remove('showing');
  }

  const items = document.querySelectorAll(
    '.dropdown-item, #languageDropdown, #confirmWeather, #cancelWeather, #confirmGitHub, #cancelGitHub, .aboutPreview, .contact-email, .portfolio-links a, #weatherFloating, .show-pdf'
  );

  items.forEach(item => {
    item.addEventListener('mouseenter', e => showBubble(e.currentTarget));
    item.addEventListener('mousemove', positionOverlay);
    item.addEventListener('click', onLeave);
    item.addEventListener('mouseleave', onLeave);
  });

  //delegácia pre dynamické prvky (vrátane certifikátov)
  document.addEventListener('mouseenter', e => {
    const target = e.target.closest('[data-translate-info]');
    if (!target || target.closest('#sideNav')) return;
    showBubble(target);
  }, true);

  document.addEventListener('mousemove', e => {
    positionOverlay(e);
  }, true);

  document.addEventListener('mouseleave', e => {
    if (!e.relatedTarget) onLeave();
  }, true);


  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) onLeave();
  });
}

document.addEventListener("DOMContentLoaded", INIT_TOOLTIP_FOLLOW);

// ======================================================
// ============= NAVIGATION BUBBLE (MAIN NAV) ===========
// ======================================================

function INIT_NAV_HOVER_BUBBLE() {
  // IBA hlavné menu – odstránený sideNav selektor
  const links = document.querySelectorAll('.nav-item.menu-item .nav-link');

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      // filter pre top-right menu ostáva
      if (link.closest('#rightNav') || link.id === 'languageDropdown') return;

      const parent = link.closest('.nav-item, .menu-item');
      if (!parent) return;

      const infoKey = parent.getAttribute('data-translate-info');
      if (!infoKey) return;

      const lang = localStorage.getItem("lang") || "sk";
      const t = translations[lang] || translations.sk;
      const text = t[infoKey] || infoKey;

      let bubble = link.querySelector('.hover-bubble');
      if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'hover-bubble';
        link.appendChild(bubble);
      }

      bubble.textContent = text;

      let fontSize = 0.7;
      bubble.style.fontSize = fontSize + "rem";

      const minSize = 0.15;
      while (bubble.scrollHeight > bubble.clientHeight && fontSize > minSize) {
        fontSize -= 0.05;
        bubble.style.fontSize = fontSize + "rem";
      }

      link.classList.add('show-bubble');

      setTimeout(() => {
        link.classList.remove('show-bubble');
      }, 1000);
    });

    link.addEventListener('mouseleave', () => {
      link.classList.remove('show-bubble');
    });
  });
}

document.addEventListener("DOMContentLoaded", INIT_NAV_HOVER_BUBBLE);



// ======================================================
// =========== SCROLLSPY REFRESH PRI RESIZE =============
// ======================================================

// === INIT_SCROLLSPY_RESIZE ===
function INIT_SCROLLSPY_RESIZE() {
  window.addEventListener('resize', () => {
    const spy = bootstrap.ScrollSpy.getInstance(document.body);
    if (spy) {
      spy._config.offset = document.querySelector('#mainNav').offsetHeight;
      spy.refresh();
    }
  });
}

INIT_SCROLLSPY_RESIZE();

// ======================================================
// ============= FORMULÁR – ODOSLANIE SPRÁVY ============
// ======================================================

// === INIT_CONTACT_FORM ===
function INIT_CONTACT_FORM() {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener("submit", async e => {
    contactForm.requestSubmit();
    e.preventDefault();

    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang];

    // Aktivácia spinnera
    submitBtn.querySelector('.hover-bubble')?.remove();
    submitBtn.classList.add("btn-loading");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name) return alert(t.errorName);
    if (!/^[^ ]+@[^ ]+\.[a-z]{2,}$/.test(email)) return alert(t.errorEmail);
    if (!message) return alert(t.errorMessage);

    const token = document.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!token) {
      alert("Turnstile overenie zlyhalo. Skúste to znova.");
      return;
    }

    const response = await fetch("https://formspree.io/f/xwvepdrk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        Meno: name,
        Email: email,
        Správa: message,
        "cf-turnstile-response": token
      })
    });

    // Deaktivácia spinnera
    submitBtn.classList.remove("btn-loading");
    submitBtn.textContent = originalText;

    SHOW_OVERLAY_MESSAGE(response.ok ? t.successMessage : t.errorGeneral, response.ok);

    if (response.ok) {
      contactForm.reset();
      turnstile.reset();
    }
  });
}

document.addEventListener("DOMContentLoaded", INIT_CONTACT_FORM);

// ======================================================
// ============ OVERLAY SPRÁVA PO ODOSLANÍ ==============
// ======================================================

// === SHOW_OVERLAY_MESSAGE ===
function SHOW_OVERLAY_MESSAGE(text, success = true) {
  const overlay = document.getElementById("overlay");
  const overlayMessage = document.getElementById("overlayMessage");

  if (!overlay || !overlayMessage) return;

  overlayMessage.textContent = text;
  overlayMessage.classList.remove("success", "error");
  overlayMessage.classList.add(success ? "success" : "error");

  overlay.classList.add("show");

  setTimeout(() => {
    overlay.classList.remove("show");
    overlayMessage.classList.remove("success", "error");
  }, 3000);
}

// ======================================================
// ========== HOVER BUBBLE NA TLAČIDLE ODOSLAŤ ==========
// ======================================================

// === INIT_SUBMIT_BUTTON_BUBBLE ===
function INIT_SUBMIT_BUTTON_BUBBLE() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener('mouseenter', () => {
    const infoKey = submitBtn.getAttribute('data-translate-info');
    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang] || translations.sk;
    const text = t[infoKey] || infoKey;

    let bubble = submitBtn.querySelector('.hover-bubble');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.className = 'hover-bubble';
      submitBtn.appendChild(bubble);
    }

    bubble.textContent = text;

    let fontSize = 0.8;
    bubble.style.fontSize = fontSize + 'rem';
    const minSize = 0.6;

    requestAnimationFrame(() => {
      while (bubble.scrollHeight > bubble.clientHeight && fontSize > minSize) {
        fontSize -= 0.05;
        bubble.style.fontSize = fontSize + 'rem';
      }
    });

    submitBtn.classList.add('show-bubble');

    setTimeout(() => {
      submitBtn.classList.remove('show-bubble');
    }, 1000);
  });

  submitBtn.addEventListener('mouseleave', () => {
    submitBtn.classList.remove('show-bubble');
  });

  submitBtn.addEventListener('click', () => {
    submitBtn.classList.remove('show-bubble');
  });
}

document.addEventListener("DOMContentLoaded", INIT_SUBMIT_BUTTON_BUBBLE);

// ======================================================
// =============== CAPTCHA – TURNSTILE ==================
// ======================================================

// === onTurnstileSuccess ===
function onTurnstileSuccess(token) {
  console.log("Turnstile token:", token);
}

// === LOAD_TURNSTILE_SCRIPT ===
(function LOAD_TURNSTILE_SCRIPT() {
  if (document.querySelector(".cf-turnstile")) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
})();

// ======================================================
// =========== POČASIE – API, CACHE, GEOLOKÁCIA =========
// ======================================================

// === UPDATE_WEATHER_UI ===
function updateWeatherUI(data) {
  const icons = document.querySelectorAll(".weather-icon");
  const temps = document.querySelectorAll(".weather-temp");
  const cities = document.querySelectorAll(".weather-city");

  // Mesto
  cities.forEach(c => c.textContent = data.name);

  // Teplota (°C / °F podľa krajiny)
  const isUSA = data.sys?.country === "US";
  const tempC = data.main.temp;
  const tempF = (tempC * 9/5) + 32;
  const finalTemp = isUSA ? Math.round(tempF) + "°F" : Math.round(tempC) + "°C";

  temps.forEach(t => t.textContent = finalTemp);

  // Ikona
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  icons.forEach(i => i.src = iconUrl);
}

// === FETCH_WEATHER_BY_COORDS ===
async function fetchWeatherByCoords(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return (await fetch(url)).json();
}

// === FETCH_WEATHER_BY_CITY ===
async function fetchWeatherByCity(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  return (await fetch(url)).json();
}

// === GET_API_KEY ===
async function getApiKey() {
  const res = await fetch("config.json");
  const config = await res.json();
  return config.weatherApiKey;
}

// === LOAD_DEFAULT_WEATHER ===
async function loadDefaultWeather(apiKey) {
  try {
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();
    const city = ipData.city || "Kosice";

    const data = await fetchWeatherByCity(city, apiKey);
    updateWeatherUI(data);

    localStorage.setItem("weatherData", JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("Fallback IP geolocation failed:", error);
  }
}

// === LOAD_WEATHER ===
async function loadWeather() {
  const apiKey = await getApiKey();
  const cached = localStorage.getItem("weatherData");

  // Cache platná 1 hodinu
  if (cached) {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < 3600000) {
      updateWeatherUI(parsed.data);
      return;
    }
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const data = await fetchWeatherByCoords(
          pos.coords.latitude,
          pos.coords.longitude,
          apiKey
        );
        updateWeatherUI(data);

        localStorage.setItem("weatherData", JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch {
        await loadDefaultWeather(apiKey);
      }
    },
    async () => await loadDefaultWeather(apiKey)
  );
}

document.addEventListener("DOMContentLoaded", loadWeather);


// ======================================================
// ============== FOOTER – AKTUÁLNY ROK =================
// ======================================================

// === INIT_FOOTER_YEAR ===
function INIT_FOOTER_YEAR() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", INIT_FOOTER_YEAR);

// ======================================================
// ========= PDF MODAL – OTVORENIE / ZATVORENIE =========
// ======================================================

// === INIT_PDF_MODAL ===
function INIT_PDF_MODAL() {
  const modal = document.getElementById('pdfModal');
  const img = document.getElementById('pdfImage');
  const closeBtn = document.querySelector('.pdf-close');
  const arrowLeft = document.querySelector('.pdf-arrow.left');
  const arrowRight = document.querySelector('.pdf-arrow.right');

  if (!modal || !img || !closeBtn || !arrowLeft || !arrowRight) return;

  // Mapa názov súboru -> importovaný asset
  const CERT_MAP = {
    "Certificate_Java_Basic.png": c1,
    "Certifikat_Webove_stranky_krok_za_krokom.png": c2,
    "Certifikat_Kompletny_kurz_CSS_frameworku_Bootstrap.png": c3,
    "Certifikat_MySQL_databazy_krok_za_krokom.png": c4,
    "Certifikat_Zakladne_konstrukcie_jazyka_Java.png": c5,
    "skillmea-certifikat-java-pre-junior-programatorov.png": c6,
    "skillmea-certifikat-java-pre-pokrocilych.png": c7,
    "skillmea-certifikat-java-a-oop-pre-zaciatocnikov.png": c8,
    "Certifikat_Objektovo_orientovane_programovanie_v_Jave.png": c9,
    "Certifikat_Kolekcie_a_prudy_v_Jave.png": c10,
    "Certifikat_Praca_so_subormi_v_Jave.png": c11,
    "Certifikat_Testovanie_v_Jave.png": c12,
    "Certifikat_Zaklady_Spring_Boot_frameworku_pre_Javu.png": c13,
    "Certifikat_Databaza_a_Hibernate_v_Spring_Boot_-_Blog.png": c14,
    "Certifikat_Zaklady_React.png": c15,
    "Certifikat_Best_practices_pre_navrh_softwaru.png": c16,
    "Certifikat_Git.png": c17,
    "Certifikat_UML.png": c18
  };

  // 🔥 Dôležité: iný názov, aby sa to nebilo s carouselom
  const modalFiles = Object.keys(CERT_MAP);
  let currentIndex = 0;

  function showImage(index) {
    const fileName = modalFiles[index];
    img.src = CERT_MAP[fileName];
  }

  // Delegovaný click – otvorenie modalu
  document.addEventListener('click', e => {
    const target = e.target.closest('.show-pdf');
    if (!target) return;

    e.preventDefault();

    const fileName = target.getAttribute('data-pdf');
    if (!fileName) return;

    currentIndex = modalFiles.indexOf(fileName);
    if (currentIndex === -1) return;

    showImage(currentIndex);

    modal.style.display = 'flex';
    if (typeof stopAutoSlide === "function") stopAutoSlide();
    adjustModalPosition();
  });

  arrowLeft.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + modalFiles.length) % modalFiles.length;
    showImage(currentIndex);
  });

  arrowRight.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % modalFiles.length;
    showImage(currentIndex);
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    img.src = "";
    if (typeof restartAutoSlide === "function") restartAutoSlide();
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      img.src = "";
      if (typeof restartAutoSlide === "function") restartAutoSlide();
    }
  });
}

document.addEventListener("DOMContentLoaded", INIT_PDF_MODAL);

// === ADJUST_MODAL_POSITION ===
function adjustModalPosition() {
  const nav = document.getElementById("mainNav");
  const footer = document.querySelector("footer");

  const navHeight = nav ? nav.offsetHeight : 0;
  const footerHeight = footer ? footer.offsetHeight : 0;

  const wrapper = document.querySelector(".pdf-wrapper");
  const availableHeight = window.innerHeight - navHeight - footerHeight;

  wrapper.style.height = availableHeight + "px";
  wrapper.style.marginTop = navHeight + "px";
}

// ======================================================
// =============== HVIEZDIČKY V PORTFOLIU ===============
// ======================================================

// === INIT_RATING_STARS ===
function INIT_RATING_STARS() {
  document.querySelectorAll("[data-rating]").forEach((el) => {
    const rating = parseInt(el.dataset.rating, 10);
    const span = document.createElement("span");
    span.className = "rating";

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = "★";
      star.style.color = i < rating ? "#f5c518" : "#ccc";
      span.appendChild(star);
    }

    el.prepend(span);
  });
}

document.addEventListener("DOMContentLoaded", INIT_RATING_STARS);

// ======================================================
// ========== MAIN CONTENT – FADE-IN ANIMÁCIA ===========
// ======================================================

// === INIT_MAIN_CONTENT_ANIMATION ===
function INIT_MAIN_CONTENT_ANIMATION() {
  const main = document.querySelector(".main-content");
  if (!main) return;

  setTimeout(() => {
    main.classList.add("loaded");
  }, 100);
}

document.addEventListener("DOMContentLoaded", INIT_MAIN_CONTENT_ANIMATION);

// ======================================================
// ========= SKRY MODAL & TOOLTIP PRI NAČÍTANÍ ==========
// ======================================================

const modal = document.getElementById("weatherModal");
if (modal) modal.style.display = "none";

const tooltipOverlay = document.querySelector(".tooltip-follow");
if (tooltipOverlay) tooltipOverlay.style.display = "none";

// ======================================================
// ======= ANIMÁCIA MENU PRI KLIKNUTI NA TOGGLER ========
// ======================================================

const toggler = document.querySelector('.navbar-toggler');
const menu = document.getElementById('navbarResponsive');

toggler.addEventListener('click', () => {
  menu.classList.toggle('show-animated');
});

// ======================================================
// === ZOBRAZENIE sideNav + weatherFloating podľa zón ===
// ======================================================

function updateFloatingVisibility() {
  const sideNav = document.getElementById("sideNav");
  const weather = document.getElementById("weatherFloating");

  // Bezpečnostná kontrola
  if (!sideNav || !weather) return;

  // Zobrazujeme len na desktopoch (>992px)
  if (window.innerWidth < 992) {
    sideNav.classList.remove("visible");
    weather.classList.remove("visible");
    document.body.classList.remove("invert-floating");
    return;
  }

  const sections = document.querySelectorAll("section, header");
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  const OFFSET = 10 * 16; // 10rem (pri root 16px)

  let shouldShow = false;
  let inContact = false;

  // 1) Úvodná obrazovka + 10rem
  if (scrollY <= windowHeight + OFFSET) {
    shouldShow = true;
  }

  // 2) Každá sekcia: zóna [top - 10rem, top]
  sections.forEach(sec => {
    const top = sec.offsetTop;

    if (scrollY >= top - OFFSET && scrollY <= top) {
      shouldShow = true;

      // Kontakt má svetlé pozadie → invertujeme farby
      if (sec.id === "contact") {
        inContact = true;
      }
    }
  });

  // Prepnutie viditeľnosti
  sideNav.classList.toggle("visible", shouldShow);
  weather.classList.toggle("visible", shouldShow);

  // Prepnutie farebnej schémy pre kontakt
  document.body.classList.toggle("invert-floating", inContact);
}

// SCROLL
document.addEventListener("scroll", updateFloatingVisibility);

// RESIZE
window.addEventListener("resize", updateFloatingVisibility);

// LOAD
window.addEventListener("load", () => {
  requestAnimationFrame(updateFloatingVisibility);
});

// KLIK NA ODKAZ (aby sa zóna prepočítala po skoku)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(() => {
      document.body.offsetHeight; // forced reflow
      updateFloatingVisibility();
    }, 50);
  });
});

// ======================================================
// ==== ŽIVÝ DÁTUM + MENINY + ČAS NAD SIDE NAVBAROM =====
// ======================================================

function updateSideNavClock() {
  const box = document.getElementById("sideNavTime");
  if (!box) return;

  const dateEl = box.querySelector(".date");
  const timeEl = box.querySelector(".time");
  const namedayEl = box.querySelector(".nameday");

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

  // --- UPPERCASE weekday + čiarka len pre SK ---
  const parts = dateStr.split(" ");
  let weekday = parts[0].toUpperCase();

  if (lang === "sk") {
    weekday += ",";
  }

  // --- Zvyšok dátumu bez medzier ---
  const rest = parts.slice(1).join("").replace(/\s+/g, "");

  // --- Výsledný formát ---
  const finalDate = `${weekday} ${rest}`;
  dateEl.textContent = finalDate;

  // --- Meniny / sviatok ---
  if (holiday) {
    namedayEl.textContent = holiday;
    namedayEl.classList.add("holiday");
  } else {
    namedayEl.textContent = nameday ? `${t.nameday} ${nameday}` : "";
    namedayEl.classList.remove("holiday");
  }

  timeEl.textContent = timeStr;
}

setInterval(updateSideNavClock, 1000);
updateSideNavClock();

// ======================================================
// ================== SIDENAV BUBBLE ====================
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  const sideNavLinks = document.querySelectorAll("#sideNav .menu-item > a");

  sideNavLinks.forEach(link => {
    let timer = null;

    link.addEventListener("mouseenter", () => {
      const parent = link.closest(".menu-item");
      if (!parent) return;

      const infoKey = parent.getAttribute("data-translate-info");
      if (!infoKey) return;

      const lang = localStorage.getItem("lang") || "sk";
      const t = translations[lang] || translations.sk;
      const text = t[infoKey] || infoKey;

      // vytvorenie bubliny, ak ešte neexistuje
      let bubble = link.querySelector(".hover-bubble");
      if (!bubble) {
        bubble = document.createElement("div");
        bubble.className = "hover-bubble";
        link.appendChild(bubble);
      }

      // vloženie textu do <span> pre animáciu
      bubble.innerHTML = `<span>${text}</span>`;

      // zobraziť bublinu
      link.classList.add("show-bubble");

      // reset starého timeru
      if (timer) clearTimeout(timer);

      // skryť po 10 sekundách
      timer = setTimeout(() => {
        link.classList.remove("show-bubble");
      }, 3000);
    });

    link.addEventListener("mouseleave", () => {
      link.classList.remove("show-bubble");
    });
  });
});

// ======================================================
// =============== CERTIFICATE CAROUSEL =================
// ======================================================

// Globálne premenne – spoločné pre carousel aj modal
let autoSlide = null;
let restartTimeout = null;
let certTrack = null;

// Importované obrázky – rovnaké ako v modale
const CERT_MAP = {
  "Certificate_Java_Basic.png": c1,
  "Certifikat_Webove_stranky_krok_za_krokom.png": c2,
  "Certifikat_Kompletny_kurz_CSS_frameworku_Bootstrap.png": c3,
  "Certifikat_MySQL_databazy_krok_za_krokom.png": c4,
  "Certifikat_Zakladne_konstrukcie_jazyka_Java.png": c5,
  "skillmea-certifikat-java-pre-junior-programatorov.png": c6,
  "skillmea-certifikat-java-pre-pokrocilych.png": c7,
  "skillmea-certifikat-java-a-oop-pre-zaciatocnikov.png": c8,
  "Certifikat_Objektovo_orientovane_programovanie_v_Jave.png": c9,
  "Certifikat_Kolekcie_a_prudy_v_Jave.png": c10,
  "Certifikat_Praca_so_subormi_v_Jave.png": c11,
  "Certifikat_Testovanie_v_Jave.png": c12,
  "Certifikat_Zaklady_Spring_Boot_frameworku_pre_Javu.png": c13,
  "Certifikat_Databaza_a_Hibernate_v_Spring_Boot_-_Blog.png": c14,
  "Certifikat_Zaklady_React.png": c15,
  "Certifikat_Best_practices_pre_navrh_softwaru.png": c16,
  "Certifikat_Git.png": c17,
  "Certifikat_UML.png": c18
};

// Pole názvov súborov (poradie pre carousel)
const certificateFiles = Object.keys(CERT_MAP);

// ============================
// POMOCNÉ FUNKCIE
// ============================

function isModalOpen() {
  const modal = document.getElementById("pdfModal");
  return modal && modal.style.display === "flex";
}

function getItemWidth() {
  if (!certTrack) return 120;
  const first = certTrack.querySelector("img");
  return first ? first.offsetWidth + 16 : 120;
}

function renderCertificates() {
  if (!certTrack) return;

  certTrack.innerHTML = "";

  certificateFiles.forEach(file => {
    const img = document.createElement("img");

    img.src = CERT_MAP[file];
    img.alt = file.replace(/\.[^.]+$/, "");

    img.classList.add("show-pdf");
    img.setAttribute("data-pdf", file);

    img.setAttribute("data-translate-info", file);

    certTrack.appendChild(img);
  });
}

// ============================
// SLIDE FUNKCIE
// ============================

function manualSlide(direction) {
  if (!certTrack) return;

  const itemWidth = getItemWidth();

  certTrack.style.transition = "transform 0.6s ease";
  certTrack.style.transform =
    direction === "left"
      ? `translateX(${itemWidth}px)`
      : `translateX(-${itemWidth}px)`;

  certTrack.addEventListener(
    "transitionend",
    () => {
      if (direction === "left") {
        certificateFiles.unshift(certificateFiles.pop());
      } else {
        certificateFiles.push(certificateFiles.shift());
      }

      renderCertificates();

      certTrack.style.transition = "none";
      certTrack.style.transform = "translateX(0)";
      void certTrack.offsetWidth;
    },
    { once: true }
  );
}

function slide() {
  if (isModalOpen()) return;
  manualSlide("right");
}

// ============================
// AUTO SLIDE
// ============================

function stopAutoSlide() {
  if (autoSlide !== null) clearInterval(autoSlide);
  if (restartTimeout !== null) clearTimeout(restartTimeout);
}

function restartAutoSlide() {
  if (restartTimeout !== null) clearTimeout(restartTimeout);
  restartTimeout = setTimeout(() => {
    autoSlide = setInterval(slide, 3000);
  }, 3000);
}

// ============================
// INIT CAROUSEL
// ============================

document.addEventListener("DOMContentLoaded", () => {
  certTrack = document.getElementById("certTrack");
  if (!certTrack) return;

  const btnLeft = document.querySelector("#home .cert-arrow.left");
  const btnRight = document.querySelector("#home .cert-arrow.right");
  const carouselWrapper = document.querySelector("#home .cert-track-wrapper");

  renderCertificates();

  if (carouselWrapper) {
    carouselWrapper.addEventListener("mouseenter", stopAutoSlide);
    carouselWrapper.addEventListener("mouseleave", restartAutoSlide);
  }
  if (btnLeft) {
    btnLeft.addEventListener("click", () => {
      stopAutoSlide();
      manualSlide("left");
      restartAutoSlide();
    });
  }
  if (btnRight) {
    btnRight.addEventListener("click", () => {
      stopAutoSlide();
      manualSlide("right");
      restartAutoSlide();
    });
  }
  autoSlide = setInterval(slide, 3000);
});
