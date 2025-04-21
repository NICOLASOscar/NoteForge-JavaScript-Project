// Import de la bibliothèque 'marked' pour le rendu Markdown
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export function initEditor() {
  // Récupération des éléments nécessaires du DOM
  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("markdown-preview");
  const downloadBtn = document.getElementById("download-pdf");
  const downloadMd = document.getElementById("download-md");
  const downloadTxt = document.getElementById("download-txt");
  const filenameInput = document.getElementById("md-filename");
  const importInput = document.getElementById("import-md");
  const clearBtn = document.getElementById("clear-editor");

  // Sécurité : vérifie que les éléments essentiels sont présents
  if (!textarea || !preview || !downloadBtn) {
    console.warn("initEditor() : certains éléments DOM sont introuvables.");
    return;
  }

  // Remplit automatiquement le champ nom de fichier avec la date du jour
  if (filenameInput) {
    const today = new Date().toISOString().slice(0, 10);
    filenameInput.value = `NoteForge_${today}`;
  }

  // Récupère le contenu localStorage ou injecte un exemple de démarrage
  const saved = localStorage.getItem("noteContent");
  textarea.value = saved || `# Bienvenue sur NoteForge 👋

Vous pouvez commencer à écrire en **Markdown** ici.

## Exemple :
- ✅ **Gras** : \`**texte**\`
- ✅ *Italique* : \`*texte*\`
- ✅ Code : \`console.log("Hello")\`
- ✅ Liste :
  - Élément 1
  - Élément 2
- ✅ Formule LaTeX : $ \\frac{a}{b} = c $

> Le rendu apparaît automatiquement à droite 🪄

Bon courage ✨`;

  // Synchronise le scroll vertical entre l'éditeur et la preview
  textarea.addEventListener("scroll", () => {
    const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
  });

  // Fonction de mise à jour de la preview HTML et LaTeX
  function updatePreview() {
    const raw = textarea.value;
    const html = marked.parse(raw);
    preview.innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise([preview]);
  }

  // Mise à jour de la preview à chaque modification de texte
  textarea.addEventListener("input", () => {
    updatePreview();
    localStorage.setItem("noteContent", textarea.value);
  });

  // Premier rendu
  updatePreview();

  // --- Export PDF avec html2canvas + jsPDF ---
  downloadBtn.addEventListener("click", async () => {
    if (window.MathJax) await MathJax.typesetPromise([preview]);

    // Crée une copie de la preview à exporter
    const cleanContent = document.createElement("div");
    cleanContent.innerHTML = preview.innerHTML;
    Object.assign(cleanContent.style, {
      fontFamily: "sans-serif",
      color: "#000000",
      background: "#ffffff",
      padding: "2rem",
      width: "800px",
      lineHeight: "1.5",
      fontSize: "1rem"
    });

    // Conteneur temporaire hors-écran pour html2canvas
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "-9999px",
      left: "0",
      zIndex: "-1",
      background: "#ffffff"
    });
    container.appendChild(cleanContent);
    document.body.appendChild(container);

    // Génère le PDF à partir du rendu HTML
    html2canvas(cleanContent, {
      backgroundColor: "#ffffff",
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("NoteForge_export.pdf");

      document.body.removeChild(container);
    });
  });

  // --- Export Markdown brut (.md) ---
  downloadMd.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const content = textarea.value || "# Note vide";
    let filename = filenameInput?.value.trim() || "NoteForge_export";
    if (!filename.endsWith(".md")) filename += ".md";

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  });

  // --- Export texte brut (.txt) ---
  if (downloadTxt) {
    downloadTxt.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const content = textarea.value || "Note vide";
      let filename = filenameInput?.value.trim() || "NoteForge_export";
      if (!filename.endsWith(".txt")) filename += ".txt";

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    });
  }

  // --- Réinitialisation du contenu ---
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Souhaitez-vous vraiment vider la note ?")) {
        textarea.value = "";
        updatePreview();
        localStorage.removeItem("noteContent");
      }
    });
  }

  // --- Import d'un fichier .md ---
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        textarea.value = evt.target.result;
        updatePreview();
        localStorage.setItem("noteContent", textarea.value);
        importInput.value = ""; // Réinitialise l'input pour permettre une nouvelle sélection
      };
      reader.readAsText(file);
    });
  }
}
