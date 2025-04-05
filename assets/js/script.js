// Import ESModule de marked
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

export function initEditor() {
  // 🔐 Vérifie connexion
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const warningPopup = document.getElementById("auth-warning");

  if (!isLoggedIn || isLoggedIn !== "true") {
    if (warningPopup) warningPopup.classList.remove("hidden");
    return; // on bloque l'éditeur si non connecté
  }

  // Le reste de ton code (rendu preview, PDF, etc)

  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("markdown-preview");
  const downloadBtn = document.getElementById("download-pdf");


  const draft = localStorage.getItem("noteForgeDraft");
    if (draft) {
    textarea.value = draft;
    }
  if (!textarea || !preview || !downloadBtn) {
    console.warn("initEditor() : éléments non trouvés !");
    return;
  }

  function updatePreview() {
    const raw = textarea.value;
    const html = marked.parse(raw);
    preview.innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise([preview]);
  }

  const current = JSON.parse(localStorage.getItem("noteForgeCurrent"));
    if (current) {
    textarea.value = current.content;
    localStorage.removeItem("noteForgeCurrent");
    }

  textarea.addEventListener("input", updatePreview);
  textarea.addEventListener("input", () => {
    localStorage.setItem("noteForgeDraft", textarea.value);
  });
  updatePreview();

  downloadBtn.addEventListener("click", async () => {
    if (window.MathJax) await MathJax.typesetPromise([preview]);
  
    // Cloner le contenu (mais pas les styles)
    const cleanContent = document.createElement("div");
    cleanContent.innerHTML = preview.innerHTML;
    cleanContent.style.fontFamily = "sans-serif";
    cleanContent.style.color = "#000000";
    cleanContent.style.background = "#ffffff";
    cleanContent.style.padding = "2rem";
    cleanContent.style.width = "800px";
    cleanContent.style.lineHeight = "1.5";
    cleanContent.style.fontSize = "1rem";
  
    // Créer une zone invisible pour la capture
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.left = "0";
    container.style.zIndex = "-1";
    container.style.background = "#ffffff";
    container.appendChild(cleanContent);
    document.body.appendChild(container);
  
    // Capture propre
    html2canvas(cleanContent, {
      backgroundColor: "#ffffff",
      scale: 2
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF("p", "mm", "a4");
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("NoteForge_export.pdf");
  
      document.body.removeChild(container); // Nettoyage
    });
  });
  
  document.getElementById("save-note").addEventListener("click", () => {
    const title = prompt("Titre de la note :");
    if (!title) return;
  
    const notes = JSON.parse(localStorage.getItem("noteForgeNotes") || "[]");
    const newNote = {
      id: Date.now().toString(),
      title: title,
      content: textarea.value,
      createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    localStorage.setItem("noteForgeNotes", JSON.stringify(notes));
    alert("Note enregistrée !");
  });
  
}