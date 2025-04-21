// --- Fonction utilitaire pour charger un composant HTML dans un conteneur (header, footer, etc.)
async function loadComponent(selector, url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
  } catch (err) {
    console.error(`Erreur lors du chargement du composant ${url}`, err);
  }
}

// --- Fonction principale pour charger une vue dans #main-container
async function loadPage(path) {
  try {
    const res = await fetch(path);
    const html = await res.text();

    const container = document.getElementById("main-container");

    // Analyse du HTML pour extraire le contenu
    const newBody = new DOMParser().parseFromString(html, "text/html").body;
    const newContent = newBody.querySelector("#main-container") || newBody;

    // Injection du contenu dans le conteneur principal
    container.innerHTML = newContent.innerHTML;

    // Si la vue est l'éditeur, charge dynamiquement le module script.js
    if (path.includes("editor.html")) {
      setTimeout(() => {
        import("./script.js")
          .then((module) => module.initEditor())
          .catch((err) => console.error("Erreur lors de l'initialisation de l'éditeur :", err));
      }, 50); // petit délai pour s'assurer que le DOM est bien injecté
    }

    // Recherche et exécution des <script> inline présents dans la vue
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  } catch (err) {
    console.error("Erreur lors du chargement de la page :", err);
    document.getElementById("main-container").innerHTML =
      `<p style="color:red;">Erreur lors du chargement de la page.</p>`;
  }
}

// --- Initialisation au chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
  // Chargement des composants statiques (header/footer)
  await loadComponent("#header-container", "components/header.html");
  await loadComponent("#footer-container", "components/footer.html");

  // Chargement par défaut de la page d'accueil
  loadPage("components/home.html");

  // Gestion des clics internes (navigation SPA)
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    // Ignore les liens de téléchargement ou externes
    const href = link.getAttribute("href");
    if (
      link.hasAttribute("download") ||
      !href ||
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.endsWith(".png") ||
      href.endsWith(".css") ||
      href.endsWith(".js")
    ) {
      return;
    }

    e.preventDefault();
    await loadPage(href);
  });

  // Support des boutons précédent / suivant du navigateur
  window.addEventListener("popstate", () => {
    const path = location.pathname.replace(/^\/+/, "") || "components/home.html";
    loadPage(path);
  });
});
