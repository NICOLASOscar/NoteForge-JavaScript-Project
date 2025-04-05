document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    if (!form) return;
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const firstName = form.firstName.value.trim();
      const lastName = form.lastName.value.trim();
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
  
      const feedback = document.getElementById("signup-feedback");
  
      // Vérification simple
      if (!firstName || !lastName || !email || !password) {
        feedback.textContent = "❗ Tous les champs sont obligatoires.";
        feedback.className = "signup-feedback error";
        return;
      }
  
      const users = JSON.parse(localStorage.getItem("noteForgeUsers") || "[]");
  
      if (users.find(u => u.email === email)) {
        feedback.textContent = "⚠️ Un compte avec cet email existe déjà.";
        feedback.className = "signup-feedback error";
        return;
      }
  
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString()
      };
  
      users.push(newUser);
      localStorage.setItem("noteForgeUsers", JSON.stringify(users));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
  
      feedback.textContent = "✅ Compte créé avec succès. Redirection...";
      feedback.className = "signup-feedback success";
  
      setTimeout(() => {
        window.location.href = "/components/home.html";
      }, 1200);
    });
  });
  