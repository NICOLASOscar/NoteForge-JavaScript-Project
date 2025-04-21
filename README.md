# 🛠️ NoteForge – Éditeur web interactif de fichiers `.md`, `.txt` et `.pdf`

## ✨ Présentation

**NoteForge** est une application web moderne et intuitive conçue pour créer, modifier et exporter des fichiers aux formats `.md`, `.txt` et `.pdf`. Développée dans un souci d’accessibilité, de modularité et de performance, elle s’appuie sur une architecture en composants réutilisables pour garantir une expérience fluide et cohérente.

---

## 🚀 Fonctionnalités principales

- 📝 Éditeur de texte en temps réel (Markdown + LaTeX)
- 💾 Sauvegarde automatique via `localStorage`
- 📤 Export aux formats `.txt`, `.md` et `.pdf` avec jsPDF
- 🌙 Prise en charge du mode sombre / clair
- 🧩 Interface modulaire (HTML dynamiquement chargé)
- 🔄 Import et export de fichiers `.md`

---

## 🧰 Technologies utilisées

- HTML5 / CSS3 (avec design responsive)
- JavaScript (Vanilla)
- jsPDF pour la génération de fichiers PDF
- Marked.js pour le rendu Markdown
- MathJax pour les formules LaTeX

---

## 🧑‍💻 Expérience utilisateur

NoteForge a été conçu pour offrir :

- Une interface responsive adaptée aux ordinateurs et mobiles
- Une navigation fluide grâce au chargement dynamique des composants HTML
- Une prise en main rapide, même sans connaissances techniques

---

## 🗂️ Structure du projet

```
NoteForge/
├── index.html
├── README.md
├── /assets
│   ├── /css
│   │   └── style.css
│   ├── /img
│   │   ├── NoteForgeLogoWOText.png
│   │   ├── NoteForgeLogoWOTextWhite.png
│   │   ├── NoteForgeLogoWText.png
│   │   └── NoteForgeLogoWTextWhite.png
│   └── /js
│       ├── main.js         ← Gestion des vues dynamiques (SPA)
│       └── script.js       ← Logique de l’éditeur Markdown
├── /components
│   ├── editor.html
│   ├── home.html
│   ├── header.html
│   ├── footer.html
│   ├── login.html
│   └── signup.html
```

---

## ⚙️ Installation locale

1. Clonez le dépôt :
   ```bash
   git clone 
   ```
2. Ouvrez `index.html` dans votre navigateur, ou servez le projet avec :
   ```bash
   npx serve .
   # ou
   python3 -m http.server
   ```

---

## ✅ Bonnes pratiques

- Architecture modulaire et réutilisable
- Code commenté et organisé
- Utilisation de Git pour le versionnement
- Documentation claire avec ce `README.md`

---

## 👨‍💻 Équipe de développement

- **Jules Levecq**  
  📧 jules.levecq@student.junia.com

- **Titouan Gouëllo**  
  📧 titouan.gouello@student.junia.com

- **Oscar Nicolas**  
  📧 oscar.nicolas@student.junia.com

---