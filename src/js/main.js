import '../scss/main.scss';

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
    el.setAttribute("data-tooltip", t[key]);
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
    if (lang === "sk") selectedFlag.src = "src/assets/img/flags/sk.png";
    else if (lang === "en") selectedFlag.src = "src/assets/img/flags/uk.png";
    else if (lang === "de") selectedFlag.src = "src/assets/img/flags/de.png";
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

  window.addEventListener('wheel', function(e) {
  e.preventDefault();
  window.scrollBy({
    top: e.deltaY < 0 ? -50 : 50,
    behavior: 'smooth'
    });
  }, { passive: false });

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
  const weatherLink = document.getElementById("weatherNav");
  const modal = document.getElementById("weatherModal");
  const confirmBtn = document.getElementById("confirmWeather");
  const cancelBtn = document.getElementById("cancelWeather");

  if (!weatherLink || !modal) return;

  modal.style.display = "none";

  weatherLink.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  confirmBtn?.addEventListener("click", function() {
    modal.style.display = "none";
    window.open(weatherLink.href, "_blank");
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
  const githubLink = document.querySelector(".portfolio-links a"); // ✔️ správny element
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
    window.open(githubLink.href, "_blank"); // ✔️ otvorí GitHub
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
  const OFFSET_X_LEFT  = -165;
  const OFFSET_Y = 25;

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

  const items = document.querySelectorAll('.menu-item, .dropdown-item, #languageDropdown, #confirmWeather, #cancelWeather, #confirmGitHub, #cancelGitHub, .show-pdf, .aboutPreview, .contact-email, .portfolio-links a');
  items.forEach(item => {
    item.addEventListener('mouseenter', e => showBubble(e.currentTarget));
    item.addEventListener('mousemove', positionOverlay);
    item.addEventListener('click', onLeave);
    item.addEventListener('mouseleave', onLeave);
  });

  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) onLeave();
  });
}

document.addEventListener("DOMContentLoaded", INIT_TOOLTIP_FOLLOW);

// ======================================================
// ============= NAVIGATION BUBBLE ======================
// ======================================================

// === INIT_NAV_HOVER_BUBBLE ===
function INIT_NAV_HOVER_BUBBLE() {
  document.querySelectorAll('.nav-item.menu-item .nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (link.closest('#rightNav') || link.id === 'languageDropdown') return;

      const infoKey = link.closest('.nav-item').getAttribute('data-translate-info');
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
  document.getElementById("city").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
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
  document.querySelectorAll('.show-pdf').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const imgSrc = this.getAttribute('data-pdf');
      const modal = document.getElementById('pdfModal');
      const img = document.getElementById('pdfImage');

      img.src = imgSrc;
      modal.style.display = 'flex';

      adjustModalPosition();
    });
  });

  document.querySelector('.pdf-close').addEventListener('click', () => {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfImage').src = "";
  });

  document.getElementById('pdfModal').addEventListener('click', function (e) {
    if (e.target === this) {
      this.style.display = 'none';
      document.getElementById('pdfImage').src = "";
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
