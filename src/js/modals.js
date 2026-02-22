// ======================================================
// ===================== MODALS MODULE ===================
// ======================================================
//
// Tento modul obsahuje:
// - GitHub potvrďovací modal
// - PDF modal pre certifikáty
// - dynamické prepínanie obrázkov v PDF modale
// - výpočet dostupnej výšky pre PDF modal
//
// Modul je inicializovaný cez main.js
//
// ======================================================

import { CERT_MAP } from "./certificates.js";
import { stopAutoSlide, restartAutoSlide } from "./carousel.js";


// ------------------------------------------------------
// GITHUB CONFIRM MODAL
// ------------------------------------------------------
export function initGitHubModal() {
  const githubLink = document.querySelector(".portfolio-links a");
  const modal = document.getElementById("GitHubModal");
  const confirmBtn = document.getElementById("confirmGitHub");
  const cancelBtn = document.getElementById("cancelGitHub");

  if (!githubLink || !modal) return;

  modal.style.display = "none";

  githubLink.addEventListener("click", e => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  confirmBtn?.addEventListener("click", () => {
    modal.style.display = "none";
    window.open(githubLink.href, "_blank");
  });

  cancelBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });
}


// ------------------------------------------------------
// PDF MODAL – CERTIFIKÁTY
// ------------------------------------------------------
export function initPdfModal() {
  const modal = document.getElementById("pdfModal");
  const img = document.getElementById("pdfImage");
  const closeBtn = document.querySelector(".pdf-close");
  const arrowLeft = document.querySelector(".pdf-arrow.left");
  const arrowRight = document.querySelector(".pdf-arrow.right");

  if (!modal || !img || !closeBtn || !arrowLeft || !arrowRight) return;

  const modalFiles = Object.keys(CERT_MAP);
  let currentIndex = 0;

  /* Zobrazí obrázok podľa indexu */
  function showImage(index) {
    img.src = CERT_MAP[modalFiles[index]];
  }

  // Delegovaný click – otvorenie PDF modalu
  document.addEventListener("click", e => {
    const target = e.target.closest(".show-pdf");
    if (!target) return;

    e.preventDefault();

    const fileName = target.dataset.pdf;
    if (!fileName) return;

    currentIndex = modalFiles.indexOf(fileName);
    if (currentIndex === -1) return;

    showImage(currentIndex);

    modal.style.display = "flex";

    stopAutoSlide?.();

    adjustModalPosition();
  });

  // Šípka doľava
  arrowLeft.addEventListener("click", e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + modalFiles.length) % modalFiles.length;
    showImage(currentIndex);
  });

  // Šípka doprava
  arrowRight.addEventListener("click", e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % modalFiles.length;
    showImage(currentIndex);
  });

  // Zatvorenie modalu
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    img.src = "";
    restartAutoSlide?.();
  });

  // Klik mimo obrázka = zatvoriť
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
      img.src = "";
      restartAutoSlide?.();
    }
  });
}


// ------------------------------------------------------
// Dynamické prispôsobenie výšky PDF modalu
// ------------------------------------------------------
export function adjustModalPosition() {
  const nav = document.getElementById("mainNav");
  const copyright = document.getElementById("copyright");
  const wrapper = document.querySelector(".pdf-wrapper");

  if (!wrapper) return;

  const navHeight = nav?.offsetHeight || 0;
  const copyrightHeight = copyright?.offsetHeight || 0;

  const availableHeight = window.innerHeight - navHeight - copyrightHeight;

  wrapper.style.height = `${availableHeight}px`;
  wrapper.style.marginTop = `${navHeight}px`;
}

