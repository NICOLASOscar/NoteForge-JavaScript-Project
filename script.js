const textarea = document.getElementById('markdown-input');
const preview = document.getElementById('markdown-preview');
const downloadBtn = document.getElementById('download-pdf');

function updatePreview() {
    preview.innerHTML = marked.parse(textarea.value);

    // Assurer que MathJax recharge le contenu
    if (window.MathJax) {
        MathJax.typesetPromise([preview]).then(() => {
            console.log("MathJax rendu terminé !");
        }).catch(err => console.log("Erreur MathJax :", err));
    }
}

textarea.addEventListener('input', updatePreview);

// Valeur initiale pour tester
textarea.value = `# Markdown + LaTeX  

Voici une équation LaTeX :  
\$\$ E = mc^2 \$\$  

Et un code JS :  
\`\`\`js
console.log("Hello World!");
\`\`\`
`;

updatePreview();

downloadBtn.addEventListener('click', async () => {
    const fileName = prompt("Entrez le nom du fichier PDF :", "mon_document");
    if (!fileName) return;

    console.log("Début du téléchargement...");

    // Attendre MathJax pour s'assurer que les équations sont bien rendues
    if (window.MathJax) {
        try {
            await MathJax.typesetPromise([preview]);
            console.log("MathJax a fini son rendu !");
        } catch (err) {
            console.error("Erreur lors du rendu MathJax :", err);
        }
    }

    // Capturer l'aperçu après le rendu de MathJax
    html2canvas(preview, { backgroundColor: null, scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save(`${fileName}.pdf`);

        console.log("PDF téléchargé !");
    }).catch(err => console.error("Erreur lors de la capture du PDF :", err));
});
