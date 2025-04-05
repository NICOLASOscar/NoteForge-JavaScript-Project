// Import ESModule de marked
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

export function initEditor() {
  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("markdown-preview");
  const downloadBtn = document.getElementById("download-pdf");

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

  textarea.addEventListener("input", updatePreview);
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
  
}