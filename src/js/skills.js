// ======================================================
// ===================== SKILLS MODULE ===================
// ======================================================
//
// Tento modul zabezpečuje:
// - dynamické renderovanie skill kariet
// - dvojstĺpcový layout (flex 50%)
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
  { icon: iconIntelliJ, alt: "IntelliJ IDEA icon", titleKey: "skillTitleIntelliJ",  descKey: "intelliJIDEAskills" },
  { icon: iconDevTools, alt: "DevTools icon",      titleKey: "skillTitleDevTools", descKey: "devtoolsskills" },
  { icon: iconHTML5,    alt: "HTML5 icon",         titleKey: "skillTitleHTML5",    descKey: "html5skills" },
  { icon: iconSCSS,     alt: "SCSS icon",          titleKey: "skillTitleSCSS",     descKey: "scssskills" },
  { icon: iconJS,       alt: "JavaScript icon",    titleKey: "skillTitleJavaScript", descKey: "javaScriptskills" },
  { icon: iconBootstrap, alt: "Bootstrap icon",    titleKey: "skillTitleBootstrap", descKey: "bootstrapskills" },

  { icon: iconSQL,      alt: "SQL icon",           titleKey: "skillTitleSQL",      descKey: "sqlskills" },
  { icon: iconGit,      alt: "Git icon",           titleKey: "skillTitleGit",      descKey: "gitskills" },
  { icon: iconGitHub,   alt: "GitHub icon",        titleKey: "skillTitleGitHub",   descKey: "githubskills" },
  { icon: iconJava,     alt: "Java icon",          titleKey: "skillTitleJava",     descKey: "javaskills" },
  { icon: iconSpring,   alt: "Spring Boot icon",   titleKey: "skillTitleSpringBoot", descKey: "springbootskills" },
  { icon: iconRestAPI,  alt: "REST API icon",      titleKey: "skillTitleRestAPI",  descKey: "restAPIskills" }
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
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  grid.innerHTML = "";

  SKILLS_DATA.forEach(skill => {
    const wrapper = document.createElement("div");
    wrapper.className = "skills-info";

    const card = createSkillCard(skill);
    wrapper.appendChild(card);

    grid.appendChild(wrapper);
  });
}
