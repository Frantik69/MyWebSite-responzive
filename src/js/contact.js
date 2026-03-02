// ======================================================
// =============== CLOUDFLARE TURNSTILE =================
// ======================================================
//
// Funkcia renderuje CAPTCHA widget podľa aktuálneho jazyka.
// V DEV režime sa zobrazí len placeholder.
// V PROD režime sa vykreslí skutočný Turnstile widget.
//

import { translations } from "./translations.js";

export function renderTurnstile(lang) {
  const container = document.getElementById("turnstile-container");
  if (!container) return;

  // DEV režim – jednoduchý placeholder
  if (import.meta.env.DEV) {
    container.innerHTML = "DEV MODE – CAPTCHA OK";
    container.classList.add("dev-placeholder");
    return;
  }

  // PROD režim – reálny widget
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
// ============= FORMULÁR – ODOSLANIE SPRÁVY ============
// ======================================================
//
// Spracovanie kontaktného formulára:
// - validácia vstupov
// - aktivácia spinnera
// - odoslanie na Formspree
// - zobrazenie overlay správy
// - reset formulára + reset CAPTCHA


export function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener("submit", async e => {
    e.preventDefault();

    const lang = localStorage.getItem("lang") || "sk";
    const t = translations[lang];

    // Aktivácia spinnera
    submitBtn.querySelector(".hover-bubble")?.remove();
    submitBtn.classList.add("btn-loading");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "";

    // Získanie hodnôt
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validácia
    if (!name) return alert(t.errorName);
    if (!/^[^ ]+@[^ ]+\.[a-z]{2,}$/.test(email)) return alert(t.errorEmail);
    if (!message) return alert(t.errorMessage);

    // CAPTCHA token
    const token = document.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!token) {
      alert("Turnstile overenie zlyhalo. Skúste to znova.");
      return;
    }

    // Odoslanie na Formspree
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

    // Overlay správa
    showOverlayMessage(
      response.ok ? t.successMessage : t.errorGeneral,
      response.ok
    );

    // Reset formulára + CAPTCHA
    if (response.ok) {
      contactForm.reset();
      turnstile.reset();
    }
  });
}


// ======================================================
// ============ OVERLAY SPRÁVA PO ODOSLANÍ ==============
// ======================================================
//
// Jednoduchý overlay, ktorý sa zobrazí po odoslaní formulára.
// Automaticky zmizne po 3 sekundách.
//

export function showOverlayMessage(text, success = true) {
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
// ================== TURNSTILE CALLBACK ================
// ======================================================

export function onTurnstileSuccess(token) {
  console.log("Turnstile token:", token);
}
