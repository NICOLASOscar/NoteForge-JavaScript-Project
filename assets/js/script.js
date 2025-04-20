// Import ESModule de marked
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export function initEditor() {
  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("markdown-preview");
  const downloadBtn = document.getElementById("download-pdf");
  const downloadMd = document.getElementById("download-md");
  const filenameInput = document.getElementById("md-filename");
  const importInput = document.getElementById("import-md");

  if (!textarea || !preview || !downloadBtn) {
    console.warn("initEditor() : éléments non trouvés !");
    return;
  }

  // Remplir automatiquement le nom de fichier par défaut
  if (filenameInput) {
    const today = new Date().toISOString().slice(0, 10); // ex: 2025-04-20
    filenameInput.value = `NoteForge_${today}`;
  }

  // Chargement depuis localStorage
  const saved = localStorage.getItem("noteContent");
  if (saved) {
    textarea.value = saved;
  }

  // Aperçu Markdown + LaTeX
  function updatePreview() {
    const raw = textarea.value;
    const html = marked.parse(raw);
    preview.innerHTML = html;
    if (window.MathJax) MathJax.typesetPromise([preview]);
  }

  textarea.addEventListener("input", () => {
    updatePreview();
    localStorage.setItem("noteContent", textarea.value);
  });

  updatePreview();

  // Export PDF
  downloadBtn.addEventListener("click", async () => {
    if (window.MathJax) await MathJax.typesetPromise([preview]);

    const cleanContent = document.createElement("div");
    cleanContent.innerHTML = preview.innerHTML;
    cleanContent.style.fontFamily = "sans-serif";
    cleanContent.style.color = "#000000";
    cleanContent.style.background = "#ffffff";
    cleanContent.style.padding = "2rem";
    cleanContent.style.width = "800px";
    cleanContent.style.lineHeight = "1.5";
    cleanContent.style.fontSize = "1rem";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-9999px";
    container.style.left = "0";
    container.style.zIndex = "-1";
    container.style.background = "#ffffff";
    container.appendChild(cleanContent);
    document.body.appendChild(container);

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

  // Export .md
  downloadMd.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // stoppe toute interférence SPA

    const content = textarea.value || "# Note vide";
    let filename = filenameInput?.value.trim() || "NoteForge_export";
    if (!filename.endsWith(".md")) filename += ".md";

    const blob = new Blob([content], {
      type: "text/markdown;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  });

  // Import .md
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (evt) {
        textarea.value = evt.target.result;
        updatePreview();
        localStorage.setItem("noteContent", textarea.value);
      };
      reader.readAsText(file);
    });
  }
}
