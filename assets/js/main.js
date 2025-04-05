// Fonction utilitaire pour charger des composants HTML (header/footer)
async function loadComponent(selector, url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      document.querySelector(selector).innerHTML = html;
    } catch (err) {
      console.error(`Erreur lors du chargement de ${url}`, err);
    }
  }
  
  // Fonction pour charger dynamiquement une page dans #main-container
  async function loadPage(path) {
    try {
      const res = await fetch(path);
      const html = await res.text();
  
      const container = document.getElementById("main-container");
      const newBody = new DOMParser().parseFromString(html, "text/html").body;
      const newContent = newBody.querySelector("#main-container") || newBody;
  
      container.innerHTML = newContent.innerHTML;
  
      // Import dynamique selon la page chargée
      if (path.includes("editor.html")) {
        setTimeout(() => {
          import("/assets/js/script.js")
            .then(m => m.initEditor())
            .catch(err => console.error("Erreur import script.js :", err));
        }, 50);
      }
  
      if (path.includes("signup.html") || path.includes("login.html")) {
        setTimeout(() => {
          import("/assets/js/auth.js")
            .then(() => console.log("✅ auth.js chargé"))
            .catch(err => console.error("❌ auth.js non trouvé", err));
        }, 50);
      }
  
      // Recharger les scripts inline si présents dans la page chargée
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
      document.getElementById("main-container").innerHTML =
        `<p style="color:red;">Erreur lors du chargement de la page.</p>`;
    }
  }
  
  // Initialisation du site
  document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("#header-container", "/components/header.html");
    await loadComponent("#footer-container", "/components/footer.html");
  
    loadPage("/components/home.html");
  
    // Gestion des clics sur les liens internes (SPA)
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
  
    // Support des boutons précédent / suivant du navigateur
    window.addEventListener("popstate", () => {
      const path = location.pathname.replace(/^\/+/, "") || "/components/home.html";
      loadPage(path);
    });
  });
  