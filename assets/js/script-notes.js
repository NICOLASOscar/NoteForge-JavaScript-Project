import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

function loadNotes() {
  const list = document.getElementById("notes-list");
  const notes = JSON.parse(localStorage.getItem("noteForgeNotes") || "[]");

  if (notes.length === 0) {
    list.innerHTML = "<p>Aucune note enregistrée pour l’instant.</p>";
    return;
  }

  list.innerHTML = "";

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <h3>${note.title}</h3>
      <p><small>Créée le ${new Date(note.createdAt).toLocaleDateString()}</small></p>
      <div class="note-actions">
        <button data-id="${note.id}" class="open-btn">📝 Ouvrir</button>
        <button data-id="${note.id}" class="pdf-btn">⬇ PDF</button>
        <button data-id="${note.id}" class="delete-btn">🗑 Supprimer</button>
      </div>
    `;
    list.appendChild(card);
  });

  // Events
  document.querySelectorAll(".open-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const notes = JSON.parse(localStorage.getItem("noteForgeNotes") || "[]");
      const note = notes.find(n => n.id === id);
      if (note) {
        localStorage.setItem("noteForgeCurrent", JSON.stringify(note));
        window.history.pushState({}, "", "components/editor.html");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    })
  );

  document.querySelectorAll(".pdf-btn").forEach(btn =>
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const notes = JSON.parse(localStorage.getItem("noteForgeNotes") || "[]");
      const note = notes.find(n => n.id === id);
      if (!note) return;

      const container = document.createElement("div");
      container.innerHTML = marked.parse(note.content);
      container.style.padding = "2rem";
      container.style.background = "#fff";
      container.style.width = "800px";
      container.style.position = "fixed";
      container.style.top = "-9999px";
      document.body.appendChild(container);

      const canvas = await html2canvas(container);
      const img = canvas.toDataURL("image/png");
      const pdf = new jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(img);
      const width = pdf.internal.pageSize.getWidth();
      const height = (imgProps.height * width) / imgProps.width;

      pdf.addImage(img, "PNG", 0, 0, width, height);
      pdf.save(`${note.title}.pdf`);
      document.body.removeChild(container);
    })
  );

  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      let notes = JSON.parse(localStorage.getItem("noteForgeNotes") || "[]");
      notes = notes.filter(n => n.id !== id);
      localStorage.setItem("noteForgeNotes", JSON.stringify(notes));
      loadNotes();
    })
  );
}

document.addEventListener("DOMContentLoaded", loadNotes);
