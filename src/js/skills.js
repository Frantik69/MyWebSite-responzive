// ======================================================
// ===================== SKILLS MODULE ===================
// ======================================================
//
// Tento modul zabezpečuje:
// - dynamické renderovanie skill kariet
// - rozdelenie skillov do ľavého a pravého stĺpca
// - podporu pre viacjazyčné preklady (data-translate)
//
// Modul je inicializovaný cez main.js
// ======================================================


// ------------------------------------------------------
// DÁTA PRE SKILLS
// ------------------------------------------------------
import iconIntelliJ from "../icons/intellij-idea-logo-black-and-white.png";
import iconDevTools from "../icons/devtools-icon.png";
import iconHTML5 from "../icons/HTML5.png";
import iconSCSS from "../icons/scss-icon.png";
import iconJS from "../icons/javascript-icon.png";
import iconBootstrap from "../icons/bootstrap-logo.png";

import iconSQL from "../icons/sql-icon.png";
import iconGit from "../icons/git.png";
import iconGitHub from "../icons/Github-Logo.png";
import iconJava from "../icons/java.white.png";
import iconSpring from "../icons/Spring_Boot.png";
import iconRestAPI from "../icons/RestAPI-icon.png";


// Exportované dáta
export const SKILLS_DATA = [
  { side: "left",  icon: iconIntelliJ, alt: "IntelliJ IDEA icon", titleKey: "skillTitleIntelliJ",  descKey: "intelliJIDEAskills" },
  { side: "left",  icon: iconDevTools, alt: "DevTools icon",        titleKey: "skillTitleDevTools", descKey: "devtoolsskills" },
  { side: "left",  icon: iconHTML5,    alt: "HTML5 icon",           titleKey: "skillTitleHTML5",    descKey: "html5skills" },
  { side: "left",  icon: iconSCSS,     alt: "SCSS icon",            titleKey: "skillTitleSCSS",     descKey: "scssskills" },
  { side: "left",  icon: iconJS,       alt: "JavaScript icon",      titleKey: "skillTitleJavaScript", descKey: "javaScriptskills" },
  { side: "left",  icon: iconBootstrap, alt: "Bootstrap icon",      titleKey: "skillTitleBootstrap", descKey: "bootstrapskills" },

  { side: "right", icon: iconSQL,      alt: "SQL icon",             titleKey: "skillTitleSQL",      descKey: "sqlskills" },
  { side: "right", icon: iconGit,      alt: "Git icon",             titleKey: "skillTitleGit",      descKey: "gitskills" },
  { side: "right", icon: iconGitHub,   alt: "GitHub icon",          titleKey: "skillTitleGitHub",   descKey: "githubskills" },
  { side: "right", icon: iconJava,     alt: "Java icon",            titleKey: "skillTitleJava",     descKey: "javaskills" },
  { side: "right", icon: iconSpring,   alt: "Spring Boot icon",     titleKey: "skillTitleSpringBoot", descKey: "springbootskills" },
  { side: "right", icon: iconRestAPI,  alt: "REST API icon",        titleKey: "skillTitleRestAPI",  descKey: "restAPIskills" }
];


// ------------------------------------------------------
// Vytvorenie jednej skill karty
// ------------------------------------------------------
export function createSkillCard(skill) {
  const card = document.createElement("div");
  card.className = "skill-card";

  // Ľavá časť (ikona + názov)
  const left = document.createElement("div");
  left.className = "skill-left";

  const img = document.createElement("img");
  img.src = skill.icon;
  img.alt = skill.alt;
  img.className = "skill-icon";
  img.loading = "lazy";

  const title = document.createElement("h3");
  title.className = "skill-title";

  const titleSpan = document.createElement("span");
  titleSpan.dataset.translate = skill.titleKey;
  title.appendChild(titleSpan);

  left.appendChild(img);
  left.appendChild(title);

  // Pravá časť (popis)
  const desc = document.createElement("p");
  desc.className = "skill-desc";
  desc.dataset.translate = skill.descKey;

  card.appendChild(left);
  card.appendChild(desc);

  return card;
}


// ------------------------------------------------------
// Hlavná funkcia – renderovanie skillov
// ------------------------------------------------------
export function renderSkills() {
  const leftCol = document.getElementById("skills-left");
  const rightCol = document.getElementById("skills-right");

  if (!leftCol || !rightCol) return;

  leftCol.innerHTML = "";
  rightCol.innerHTML = "";

  SKILLS_DATA.forEach(skill => {
    const card = createSkillCard(skill);
    (skill.side === "left" ? leftCol : rightCol).appendChild(card);
  });
}
