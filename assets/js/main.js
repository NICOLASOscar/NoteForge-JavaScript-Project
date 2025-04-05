document.addEventListener("DOMContentLoaded", () => {
    loadPage("components/home.html"); // Charger la page d'accueil par défaut
  
    document.body.addEventListener("click", async (e) => {
      const target = e.target.closest("a");
      if (!target) return;
  
      const url = target.getAttribute("href");
      if (url && !url.startsWith("http") && !url.startsWith("#") && !url.endsWith(".png") && !url.endsWith(".css") && !url.endsWith(".js")) {
        e.preventDefault();
        await loadPage(url);
        window.history.pushState({}, "", url);
      }
    });
  
    window.addEventListener("popstate", () => {
      loadPage(location.pathname.replace(/^\/+/, "") || "components/home.html");
    });
  });
  
  async function loadPage(path) {
    try {
      const res = await fetch(path);
      const html = await res.text();
      const container = document.getElementById("main-container");
      const newBody = new DOMParser().parseFromString(html, "text/html").body;
      const newContent = newBody.querySelector("#main-container") || newBody;
      container.innerHTML = newContent.innerHTML;
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  }
  