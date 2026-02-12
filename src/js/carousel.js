// ======================================================
// =============== CERTIFICATE CAROUSEL =================
// ======================================================
//
// Tento modul zabezpečuje:
// - dynamické renderovanie certifikátov do carouselu
// - automatické posúvanie
// - manuálne posúvanie šípkami
// - pozastavenie pri hoveri
// - zastavenie pri otvorenom PDF modale
//
// ======================================================

import { CERT_MAP } from "./certificates.js";

// ------------------------------------------------------
// Globálne premenne pre carousel
// ------------------------------------------------------
let autoSlide = null;
let restartTimeout = null;
let certTrack = null;

// Poradie súborov v karuseli
const certificateFiles = Object.keys(CERT_MAP);

// ------------------------------------------------------
// Pomocné funkcie
// ------------------------------------------------------

export function isModalOpen() {
  const modal = document.getElementById("pdfModal");
  return modal?.style.display === "flex";
}

export function getItemWidth() {
  const first = certTrack?.querySelector("img");
  return first ? first.offsetWidth + 16 : 120;
}

export function renderCertificates() {
  if (!certTrack) return;

  certTrack.innerHTML = "";

  certificateFiles.forEach(file => {
    const img = document.createElement("img");
    img.src = CERT_MAP[file];
    img.alt = file.replace(/\.[^.]+$/, "");
    img.classList.add("show-pdf");
    img.dataset.pdf = file;
    img.dataset.translateInfo = file;
    certTrack.appendChild(img);
  });
}

// ------------------------------------------------------
// Slide funkcie
// ------------------------------------------------------

export function manualSlide(direction) {
  if (!certTrack) return;

  const itemWidth = getItemWidth();
  const offset = direction === "left" ? itemWidth : -itemWidth;

  certTrack.style.transition = "transform 0.6s ease";
  certTrack.style.transform = `translateX(${offset}px)`;

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

export function slide() {
  if (!isModalOpen()) manualSlide("right");
}

// ------------------------------------------------------
// Auto-slide kontrola
// ------------------------------------------------------

export function stopAutoSlide() {
  clearInterval(autoSlide);
  clearTimeout(restartTimeout);
}

export function restartAutoSlide() {
  clearTimeout(restartTimeout);
  restartTimeout = setTimeout(() => {
    autoSlide = setInterval(slide, 3000);
  }, 3000);
}

// ------------------------------------------------------
// INIT FUNKCIA
// ------------------------------------------------------

export function initCarousel() {
  certTrack = document.getElementById("certTrack");
  if (!certTrack) return;

  const btnLeft = document.querySelector("#home .cert-arrow.left");
  const btnRight = document.querySelector("#home .cert-arrow.right");
  const wrapper = document.querySelector("#home .cert-track-wrapper");

  renderCertificates();

  wrapper?.addEventListener("mouseenter", stopAutoSlide);
  wrapper?.addEventListener("mouseleave", restartAutoSlide);

  btnLeft?.addEventListener("click", () => {
    stopAutoSlide();
    manualSlide("left");
    restartAutoSlide();
  });

  btnRight?.addEventListener("click", () => {
    stopAutoSlide();
    manualSlide("right");
    restartAutoSlide();
  });

  autoSlide = setInterval(slide, 3000);
}
