// ======================================================
// ==================== TIMELINE MODULE ==================
// ======================================================
//
// Tento modul zabezpečuje:
// - dátovú štruktúru pre pracovné skúsenosti a vzdelanie
// - dynamické renderovanie timeline položiek
// - podporu pre preklady (data-translate, data-translate-sublist)
// - podporu pre PDF certifikáty (show-pdf)
//
// Modul je inicializovaný cez main.js
// ======================================================


// ------------------------------------------------------
// DÁTA PRE TIMELINE – skúsenosti + vzdelanie
// ------------------------------------------------------
export const TIMELINE_DATA = {
  experience: [
    {
      date: "12/2025",
      title: { translate: "osobneportfolio" },
      items: ["HTML5, CSS3, JavaScript"]
    },
    {
      date: "11/2025",
      title: { translate: "portfolioProjekt" },
      items: ["Java, OOP"]
    },
    {
      date: "7-11/2025",
      title: { translate: "portfolioITnetwork" },
      certificate: "Certificate_Java_Basic.png",
      items: [
        { translate: "zakladjava", pdf: "Certifikat_Zakladne_konstrukcie_jazyka_Java.png" },
        { translate: "oop", pdf: "Certifikat_Objektovo_orientovane_programovanie_v_Jave.png" },
        { translate: "kolekcie", pdf: "Certifikat_Kolekcie_a_prudy_v_Jave.png" },
        { translate: "webdesign", pdf: "Certifikat_Webove_stranky_krok_za_krokom.png" },
        { translate: "mySQL", pdf: "Certifikat_MySQL_databazy_krok_za_krokom.png" },
        { translate: "jszaklady" },
        { translate: "springBoot", pdf: "Certifikat_Zaklady_Spring_Boot_frameworku_pre_Javu.png" },
        { translate: "databazaAhibernateVSpringBoote", pdf: "Certifikat_Databaza_a_Hibernate_v_Spring_Boot_-_Blog.png" },
        { translate: "react", pdf: "Certifikat_Zaklady_React.png" },
        { text: "Bootstrap", pdf: "Certifikat_Kompletny_kurz_CSS_frameworku_Bootstrap.png" },
        {
          translate: "testing",
          pdf: "Certifikat_Testovanie_v_Jave.png",
          pdf2: "Certifikat_Git.png"
        },
        {
          translate: "bestpractices",
          pdf: "Certifikat_Best_practices_pre_navrh_softwaru.png",
          pdf2: "Certifikat_UML.png"
        },
        { translate: "files", pdf: "Certifikat_Praca_so_subormi_v_Jave.png" }
      ]
    },
    {
      date: "2023-2024",
      title: { translate: "portfolioSkillmea2" },
      certificate: "skillmea-certifikat-java-pre-junior-programatorov.png",
      items: [
        "Maven",
        { translate: "servlety" },
        "ORM - JPA (Hibernate)",
        "Patterns",
        { translate: "logovanie" },
        "RESTful web services"
      ]
    },
    {
      title: { translate: "portfolioSkillmea1" },
      certificate: "skillmea-certifikat-java-pre-pokrocilych.png",
      items: [
        { translate: "boxing" },
        {translate: "cisla" },
        {translate: "metody" },
        { translate: "vnoreneTriedy" },
        { translate: "orm" },
      ]
    },
    {
      title: { translate: "portfolioSkillmea" },
      certificate: "skillmea-certifikat-java-a-oop-pre-zaciatocnikov.png",
      items: [
        { translate: "premenne" },
        {translate: "cykly" },
        {translate: "triedy" },
        { translate: "garbageCollector" },
        { translate: "interface" },
      ]
    },
    {
      date: "2009-2022",
      title: { text: "Chemko a.s. Slovakia, Mlinské nivy 10, Bratislava 811 09" },
      items: [{ translate: "chemko" }]
    },
    {
      date: "2008",
      title: { text: "K+K a.s., Jána Holého 42, 071 01 Michalovce" },
      items: [{ translate: "kk" }]
    },
    {
      date: "2007-2008",
      title: { text: "EUROLUX s.r.o., Floriánska 30, 040 01 Košice" },
      items: [{ translate: "eurolux" }]
    }
  ],

  education: [
    { date: "2005-2007", title: { translate: "fei" } },
    { date: "2004-2005", title: { translate: "fiit" } },
    { date: "2000-2004", title: { translate: "gymnazium" } }
  ]
};


// ------------------------------------------------------
// Pomocná funkcia – vytvorenie PDF odkazu
// ------------------------------------------------------
export function createPdfLink(fileName) {
  const link = document.createElement("a");
  link.href = "#";
  link.className = "show-pdf";
  link.dataset.pdf = fileName;
  return link;
}


// ------------------------------------------------------
// Hlavná funkcia – renderovanie timeline
// ------------------------------------------------------
export function renderTimeline(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  data.forEach(entry => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    // --- DÁTUM ---
    const date = document.createElement("div");
    date.className = "timeline-date";
    date.textContent = entry.date;

    // --- OBSAH ---
    const content = document.createElement("div");
    content.className = "timeline-content";

    // --- NADPIS ---
    const title = document.createElement("span");
    if (entry.title.translate) {
      title.dataset.translate = entry.title.translate;
    } else {
      title.textContent = entry.title.text;
    }
    content.appendChild(title);

    // --- HLAVNÝ CERTIFIKÁT ---
    if (entry.certificate) {
      const cert = createPdfLink(entry.certificate);
      cert.classList.add ("certifikat");
      cert.dataset.translate = "certifikat";
      cert.dataset.translateInfo = "certifikatInfo";
      content.appendChild(cert);
    }

    // --- PODZÁZNAMY (items) ---
    if (entry.items) {
      const ul = document.createElement("ul");
      ul.className = "sublist";

      entry.items.forEach(item => {
        const li2 = document.createElement("li");

        // Text alebo preklad
        if (typeof item === "string") {
          li2.textContent = item;
        } else if (item.translate) {
          li2.dataset.translateSublist = item.translate;
        }

        // PDF odkazy
        if (item.pdf) li2.appendChild(createPdfLink(item.pdf));
        if (item.pdf2) li2.appendChild(createPdfLink(item.pdf2));

        ul.appendChild(li2);
      });

      content.appendChild(ul);
    }

    li.appendChild(date);
    li.appendChild(content);
    container.appendChild(li);
  });
}
