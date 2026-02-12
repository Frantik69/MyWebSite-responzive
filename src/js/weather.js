// ======================================================
// ===================== WEATHER MODULE ==================
// ======================================================
//
// Tento modul zabezpečuje:
// - potvrďovací modal pre počasie (otvorenie externého webu)
// - načítanie počasia z OpenWeatherMap API
// - fallback cez IP geolokáciu
// - cacheovanie výsledkov na 1 hodinu
// - aktualizáciu UI (ikona, teplota, mesto)
//
// Modul je inicializovaný cez main.js
// ======================================================


// ------------------------------------------------------
// MODAL PRE POČASIE – potvrdenie otvorenia externého webu
// ------------------------------------------------------
export function initWeatherModal() {
  const weatherLinks = document.querySelectorAll(".weatherNav");
  const modal = document.getElementById("weatherModal");
  const confirmBtn = document.getElementById("confirmWeather");
  const cancelBtn = document.getElementById("cancelWeather");

  if (!weatherLinks.length || !modal) return;

  modal.style.display = "none";

  // Otvorenie modalu
  weatherLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      modal.style.display = "flex";
      modal.dataset.targetUrl = link.href;
    });
  });

  // Potvrdenie
  confirmBtn?.addEventListener("click", () => {
    modal.style.display = "none";
    const url = modal.dataset.targetUrl;
    if (url) window.open(url, "_blank");
  });

  // Zrušenie
  cancelBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });
}


// ------------------------------------------------------
// UI UPDATE – ikona, teplota, mesto
// ------------------------------------------------------
export function updateWeatherUI(data) {
  const icons = document.querySelectorAll(".nav-weather-icon, .side-weather-icon, .float-weather-icon");
  const temps = document.querySelectorAll(".nav-weather-temp, .side-weather-temp, .float-weather-temp");
  const cities = document.querySelectorAll(".nav-weather-city, .side-weather-city, .float-weather-city");

  // Mesto
  cities.forEach(c => c.textContent = data.name);

  // Teplota (USA = °F)
  const isUSA = data.sys?.country === "US";
  const tempC = data.main.temp;
  const tempF = (tempC * 9/5) + 32;
  const finalTemp = isUSA ? `${Math.round(tempF)}°F` : `${Math.round(tempC)}°C`;

  temps.forEach(t => t.textContent = finalTemp);

  // Ikona
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  icons.forEach(i => i.src = iconUrl);
}


// ------------------------------------------------------
// API FUNKCIE
// ------------------------------------------------------
export async function fetchWeatherByCoords(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  return (await fetch(url)).json();
}

export async function fetchWeatherByCity(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  return (await fetch(url)).json();
}

export async function getApiKey() {
  const res = await fetch("config.json");
  const config = await res.json();
  return config.weatherApiKey;
}


// ------------------------------------------------------
// FALLBACK – ak geolokácia zlyhá
// ------------------------------------------------------
export async function loadDefaultWeather(apiKey) {
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


// ------------------------------------------------------
// HLAVNÁ FUNKCIA – načítanie počasia
// ------------------------------------------------------
export async function loadWeather() {
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

  // Geolokácia
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


// ------------------------------------------------------
// HLAVNÁ INIT FUNKCIA PRE WEATHER MODUL
// ------------------------------------------------------
export function initWeather() {
  initWeatherModal();
  loadWeather();

  // Pre istotu skry modal pri štarte
  const modal = document.getElementById("weatherModal");
  if (modal) modal.style.display = "none";
}
