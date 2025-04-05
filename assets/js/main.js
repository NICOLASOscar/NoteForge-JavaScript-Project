// 🔧 Fonction utilitaire pour charger header/footer
async function loadComponent(selector, url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (err) {
      console.error(`Erreur lors du chargement de ${url}`, err);
    }
  }
  
  // 🚀 Fonction pour charger une vue dans #main-container
  async function loadPage(path) {
    try {
      const res = await fetch(path);
      const html = await res.text();
  
      const container = document.getElementById("main-container");
      const newBody = new DOMParser().parseFromString(html, "text/html").body;
      const newContent = newBody.querySelector("#main-container") || newBody;
  
      container.innerHTML = newContent.innerHTML;
  
      // ✅ Injecter script pour l’éditeur uniquement si on est sur editor.html
      if (path.includes("editor.html")) {
        setTimeout(() => {
          import('./script.js') // chemin relatif à main.js
            .then(module => module.initEditor())
            .catch(err => console.error("Erreur dans initEditor() :", err));
        }, 50);
      }
  
      // (Optionnel) charger scripts inline spécifiques si présents
      const scripts = container.querySelectorAll("script");
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
  
    } catch (err) {
      console.error("Erreur de chargement de la page :", err);
      document.getElementById("main-container").innerHTML = `<p style="color:red;">Erreur lors du chargement de la page.</p>`;
    }
  }
  
  // ✅ Initialisation principale
  document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("#header-container", "components/header.html");
    await loadComponent("#footer-container", "components/footer.html");
  
    // 📥 Charge la page d'accueil par défaut
    loadPage("components/home.html");
  
    // 🧭 Gère les clics internes
    document.body.addEventListener("click", async (e) => {
      const link = e.target.closest("a");
      if (!link) return;
  
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("#") &&
        !href.endsWith(".png") &&
        !href.endsWith(".css") &&
        !href.endsWith(".js")
      ) {
        e.preventDefault();
        await loadPage(href);
      }
    });
  
    // 🔁 Support du bouton retour / suivant du navigateur
    window.addEventListener("popstate", () => {
      const path = location.pathname.replace(/^\/+/, "") || "components/home.html";
      loadPage(path);
    });
  });
  